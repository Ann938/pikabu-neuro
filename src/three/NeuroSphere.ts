// «Нейросфера» — облако светящихся частиц, которое перестраивается в формы
// по ходу страницы. Все формы просчитаны заранее (атрибуты a0…a6), шейдер
// смешивает соседние по uMorph с разбросом по частицам — переход идёт волной.
import * as THREE from "three";

export const SHAPES = ["sphere", "galaxy", "orbs", "wave", "helix", "planets", "calm"] as const;

export type SphereState = {
  morph: number; // 0…6 — индекс формы, дробная часть — переход
  x: number; // смещение в единицах мира
  y: number;
  scale: number;
  spin: number; // доп. поворот (сцена «Сценарии» крутит галактику)
  tilt: number; // наклон по X
  glow: number; // общая яркость
};

const TAU = Math.PI * 2;

function rand(seed: number) {
  // детерминированный шум — форма одинакова при каждом запуске
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function buildShapes(n: number, planetCenters: [number, number][]) {
  const arr = SHAPES.map(() => new Float32Array(n * 3));
  const aRand = new Float32Array(n);
  const aGroup = new Float32Array(n); // для «орбов»: −1 ядро, 0…4 — модель
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const r1 = rand(i + 1);
    const r2 = rand(i + 7);
    const r3 = rand(i + 13);
    aRand[i] = r1;
    const set = (k: number, x: number, y: number, z: number) => {
      arr[k][i * 3] = x;
      arr[k][i * 3 + 1] = y;
      arr[k][i * 3 + 2] = z;
    };

    // 0 — сфера (Фибоначчи) с лёгкой толщиной оболочки
    const yy = 1 - (i / (n - 1)) * 2;
    const rr = Math.sqrt(1 - yy * yy);
    const th = golden * i;
    const R = 1.55 * (0.94 + r2 * 0.12);
    set(0, Math.cos(th) * rr * R, yy * R, Math.sin(th) * rr * R);

    // 1 — галактика: три рукава спирали в плоскости XZ
    const arm = i % 3;
    const gr = 0.25 + Math.pow(r1, 0.6) * 3.1;
    const ga = gr * 1.9 + (arm * TAU) / 3 + (r2 - 0.5) * 0.55;
    set(1, Math.cos(ga) * gr, (r3 - 0.5) * 0.18 * (3.4 - gr), Math.sin(ga) * gr);

    // 2 — ядро и пять сфер-моделей по кругу
    const g = r3 < 0.28 ? -1 : i % 5;
    aGroup[i] = g;
    const sr = g < 0 ? 0.55 : 0.42;
    const u2 = r1 * 2 - 1;
    const p2 = r2 * TAU;
    const s2 = Math.sqrt(1 - u2 * u2) * sr;
    if (g < 0) set(2, Math.cos(p2) * s2, u2 * sr, Math.sin(p2) * s2);
    else {
      const oa = (g / 5) * TAU + Math.PI / 2;
      set(2, Math.cos(oa) * 1.95 + Math.cos(p2) * s2, Math.sin(oa) * 1.95 + u2 * sr, Math.sin(p2) * s2);
    }

    // 3 — полотно для волны (сама волна — в шейдере)
    const cols = Math.ceil(Math.sqrt(n * 2.6));
    const cx = i % cols;
    const cz = Math.floor(i / cols);
    const rows = Math.ceil(n / cols);
    set(3, (cx / (cols - 1) - 0.5) * 9, 0, (cz / Math.max(1, rows - 1) - 0.5) * 3.4);

    // 4 — двойная спираль вдоль X
    const t = r1;
    const strand = i % 2 ? Math.PI : 0;
    const hx = -3.6 + t * 7.2;
    const ha = t * TAU * 2.2 + strand;
    const hr = 0.85 + (r2 - 0.5) * 0.18;
    set(4, hx, Math.cos(ha) * hr, Math.sin(ha) * hr);

    // 5 — четыре планеты по числу тарифов (центры приходят снаружи)
    const k = i % 4;
    const pr = [0.34, 0.44, 0.54, 0.66][k];
    const [px, py] = planetCenters[k];
    const ring = Math.sqrt(1 - u2 * u2) * pr;
    set(5, px + Math.cos(p2) * ring, py + u2 * pr, Math.sin(p2) * ring);

    // 6 — спокойная небольшая сфера
    set(6, arr[0][i * 3] * 0.72, arr[0][i * 3 + 1] * 0.72, arr[0][i * 3 + 2] * 0.72);
  }
  return { arr, aRand, aGroup };
}

const vertex = /* glsl */ `
  attribute vec3 a0; attribute vec3 a1; attribute vec3 a2; attribute vec3 a3;
  attribute vec3 a4; attribute vec3 a5; attribute vec3 a6;
  attribute float aRand; attribute float aGroup;
  uniform float uMorph; uniform float uTime; uniform float uSize; uniform float uPixel;
  uniform float uFocus; uniform float uFocusAmt; uniform float uGlow;
  varying vec3 vColor; varying float vAlpha;

  vec3 pick(float k) {
    if (k < 0.5) return a0; if (k < 1.5) return a1; if (k < 2.5) return a2;
    if (k < 3.5) return a3; if (k < 4.5) return a4; if (k < 5.5) return a5; return a6;
  }

  void main() {
    float m = clamp(uMorph, 0.0, 6.0);
    float i = floor(m);
    // переход волной: у каждой частицы своё запаздывание
    float f = clamp((m - i) * 1.7 - aRand * 0.7, 0.0, 1.0);
    f = f * f * (3.0 - 2.0 * f);
    vec3 A = pick(i);
    vec3 B = pick(min(i + 1.0, 6.0));
    vec3 p = mix(A, B, f);

    // в середине перехода частицы разлетаются — облако «дышит»
    float burst = sin(f * 3.14159);
    vec3 dir = normalize(vec3(sin(aRand * 91.0), cos(aRand * 57.0), sin(aRand * 23.0)) + 0.001);
    p += dir * burst * 0.55;

    // живое колыхание
    float t = uTime * 0.6 + aRand * 6.2831;
    p += vec3(sin(t), cos(t * 1.3), sin(t * 0.7)) * 0.025;

    // волна на «полотне»
    float waveW = 1.0 - clamp(abs(m - 3.0), 0.0, 1.0);
    p.y += (sin(p.x * 1.4 + uTime * 1.3) * 0.38 + cos(p.z * 2.2 + uTime * 0.9) * 0.16) * waveW;

    // фокус на модели: её сфера раздувается и светлеет
    float orbsW = 1.0 - clamp(abs(m - 2.0), 0.0, 1.0);
    float isFocus = (abs(aGroup - uFocus) < 0.5) ? uFocusAmt * orbsW : 0.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aRand * 0.9) * (1.0 + isFocus * 0.9) * uPixel / -mv.z;

    // градиент маскота: голубой → синий → фиолетовый
    vec3 cyan = vec3(0.31, 0.87, 0.97);
    vec3 blue = vec3(0.21, 0.55, 0.99);
    vec3 violet = vec3(0.45, 0.32, 0.95);
    float h = fract(aRand * 3.7 + p.y * 0.12);
    vec3 col = h < 0.5 ? mix(cyan, blue, h * 2.0) : mix(blue, violet, (h - 0.5) * 2.0);
    vColor = mix(col, vec3(1.0), isFocus * 0.55 + step(0.985, aRand) * 0.6);
    vAlpha = (0.35 + aRand * 0.65) * uGlow * (0.75 + isFocus);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

export class NeuroSphere {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  group = new THREE.Group();
  material: THREE.ShaderMaterial;
  geometry = new THREE.BufferGeometry();
  state: SphereState = { morph: 0, x: 0, y: 0, scale: 1, spin: 0, tilt: 0.35, glow: 1 };
  mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  focus = { index: -1, amt: 0, target: 0 };
  private raf = 0;
  private last = 0;
  private time = 0;
  private running = false;
  private autoSpin = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: { count: number; reduced: boolean; dprMax: number },
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    this.camera.position.set(0, 0, 9);

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 0.11 },
        uPixel: { value: 1 },
        uFocus: { value: -1 },
        uFocusAmt: { value: 0 },
        uGlow: { value: 1 },
      },
    });
    this.setPlanets([
      [-2.4, 0],
      [-0.8, 0],
      [0.8, 0],
      [2.4, 0],
    ]);
    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.group.add(points);
    this.scene.add(this.group);
    this.resize();
  }

  // Центры планет «Тарифов» — в мировых координатах (считаются по карточкам)
  setPlanets(centers: [number, number][]) {
    const { arr, aRand, aGroup } = buildShapes(this.opts.count, centers);
    arr.forEach((a, k) => this.geometry.setAttribute(`a${k}`, new THREE.BufferAttribute(a, 3)));
    this.geometry.setAttribute("position", new THREE.BufferAttribute(arr[0], 3));
    this.geometry.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));
    this.geometry.setAttribute("aGroup", new THREE.BufferAttribute(aGroup, 1));
  }

  // Перевод точки экрана (px) в мировые координаты плоскости z = 0
  screenToWorld(px: number, py: number) {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.camera.updateMatrixWorld(); // до первого кадра матрица камеры ещё единичная
    const v = new THREE.Vector3((px / w) * 2 - 1, -(py / h) * 2 + 1, 0.5).unproject(this.camera);
    const d = v.sub(this.camera.position).normalize();
    const t = -this.camera.position.z / d.z;
    return this.camera.position.clone().add(d.multiplyScalar(t));
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.dprMax);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    // размер точки привязан к высоте экрана — облако одинаково плотное на любом экране
    this.material.uniforms.uPixel.value = h * dpr * 0.5;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.frame(dt);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  frame(dt: number) {
    const s = this.state;
    const k = 1 - Math.exp(-4 * dt); // сглаживание, не зависящее от FPS
    if (!this.opts.reduced) {
      this.time += dt;
      this.autoSpin += dt * 0.07;
      this.mouse.sx += (this.mouse.x - this.mouse.sx) * k;
      this.mouse.sy += (this.mouse.y - this.mouse.sy) * k;
    }
    this.focus.amt += (this.focus.target - this.focus.amt) * (1 - Math.exp(-8 * dt));

    const u = this.material.uniforms;
    u.uMorph.value = s.morph;
    u.uTime.value = this.time;
    u.uGlow.value = s.glow;
    u.uFocus.value = this.focus.index;
    u.uFocusAmt.value = this.focus.amt;

    this.group.position.set(s.x, s.y, 0);
    this.group.scale.setScalar(s.scale);
    // у «орбов» и «планет» вращение по Y гасим, иначе модели уезжают от подписей
    const flat = Math.max(0, 1 - Math.abs(s.morph - 2)) + Math.max(0, 1 - Math.abs(s.morph - 5));
    const spinY = (this.autoSpin + s.spin) * (1 - Math.min(1, flat));
    this.group.rotation.set(s.tilt + this.mouse.sy * 0.25, spinY + this.mouse.sx * 0.35, 0);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
