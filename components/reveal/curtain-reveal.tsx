"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import gsap from "gsap";
import * as THREE from "three";

const DESKTOP_REVEAL_STEPS = [0, 0.48, 0.72, 1];
const MOBILE_REVEAL_STEPS = [0, 0.12, 0.45, 1];
const STAGE_COPY = [
  "Tap anywhere to pull the curtain.",
  "A glimpse of the story within.",
  "Almost revealed. One more tap.",
  "Fully revealed. Tap reset to replay.",
];

const createFabricTextures = () => {
  const size = 256;
  const baseCanvas = document.createElement("canvas");
  baseCanvas.width = size;
  baseCanvas.height = size;
  const baseContext = baseCanvas.getContext("2d");

  if (!baseContext) {
    const fallback = new THREE.Texture();
    fallback.needsUpdate = true;
    return { map: fallback, bump: fallback };
  }

  baseContext.fillStyle = "#c51a19";
  baseContext.fillRect(0, 0, size, size);

  for (let i = 0; i < size; i += 4) {
    baseContext.strokeStyle =
      i % 8 === 0 ? "rgba(255, 235, 235, 0.16)" : "rgba(0, 0, 0, 0.06)";
    baseContext.beginPath();
    baseContext.moveTo(0, i + Math.random() * 2);
    baseContext.lineTo(size, i + Math.random() * 2);
    baseContext.stroke();
  }

  for (let i = 0; i < size; i += 6) {
    baseContext.strokeStyle = "rgba(255, 230, 230, 0.12)";
    baseContext.beginPath();
    baseContext.moveTo(i, 0);
    baseContext.lineTo(i + Math.random() * 2, size);
    baseContext.stroke();
  }

  const map = new THREE.CanvasTexture(baseCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);
  map.colorSpace = THREE.SRGBColorSpace;

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpContext = bumpCanvas.getContext("2d");

  if (!bumpContext) {
    const fallback = new THREE.Texture();
    fallback.needsUpdate = true;
    return { map, bump: fallback };
  }

  bumpContext.fillStyle = "#8a7a7a";
  bumpContext.fillRect(0, 0, size, size);
  for (let i = 0; i < 1400; i += 1) {
    const tone = 90 + Math.random() * 80;
    bumpContext.fillStyle = `rgb(${tone}, ${tone}, ${tone})`;
    bumpContext.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }

  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(4, 4);

  return { map, bump };
};

export default function CurtainReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const openRef = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const prefersReducedMotion = useRef(false);
  const [stage, setStage] = useState(0);
  const [revealSteps, setRevealSteps] = useState(DESKTOP_REVEAL_STEPS);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateSteps = () => {
      setRevealSteps(
        mediaQuery.matches ? MOBILE_REVEAL_STEPS : DESKTOP_REVEAL_STEPS
      );
    };

    updateSteps();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateSteps);
    } else {
      mediaQuery.addListener(updateSteps);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updateSteps);
      } else {
        mediaQuery.removeListener(updateSteps);
      }
    };
  }, []);

  useEffect(() => {
    const target = revealSteps[stage] ?? 1;

    if (prefersReducedMotion.current) {
      openRef.current.value = target;
      return;
    }

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(openRef.current, {
      value: target,
      duration: 1.35,
      ease: "power3.inOut",
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [revealSteps, stage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#2a1218", 3, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
    camera.position.set(0, 0.2, 3.35);
    camera.lookAt(0, 0.05, 0);

    const ambientLight = new THREE.AmbientLight("#ffd4d1", 0.65);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(
      "#ffe1dd",
      1.6,
      12,
      Math.PI / 6,
      0.3,
      1
    );
    spotLight.position.set(1.9, 2.4, 2.4);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    spotLight.shadow.radius = 3.5;
    scene.add(spotLight);

    const fillLight = new THREE.PointLight("#ffc2bd", 0.9, 6);
    fillLight.position.set(-2.1, 0.8, 1.2);
    scene.add(fillLight);

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: "#0c2235",
      roughness: 0.95,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      floorMaterial
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.25;
    scene.add(floor);

    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 5),
      new THREE.MeshStandardMaterial({
        color: "#122c46",
        roughness: 0.95,
        metalness: 0,
      })
    );
    backdrop.position.set(0, 0.4, -2.8);
    scene.add(backdrop);

    const { map, bump } = createFabricTextures();
    const curtainMaterial = new THREE.MeshPhysicalMaterial({
      color: "#c51a19",
      roughness: 0.8,
      metalness: 0.05,
      clearcoat: 0.2,
      clearcoatRoughness: 0.6,
      sheen: 0.7,
      sheenColor: new THREE.Color("#d1a1a8"),
      emissive: new THREE.Color("#4a0a0a"),
      emissiveIntensity: 0.4,
      sheenRoughness: 0.8,
      map,
      bumpMap: bump,
      bumpScale: 0.04,
      side: THREE.DoubleSide,
    });

    const curtainWidth = 1.7;
    const curtainHeight = 2.3;
    const segmentsX = 28;
    const segmentsY = 36;

    const leftGeometry = new THREE.PlaneGeometry(
      curtainWidth,
      curtainHeight,
      segmentsX,
      segmentsY
    );
    const rightGeometry = leftGeometry.clone();

    const leftCurtain = new THREE.Mesh(leftGeometry, curtainMaterial);
    leftCurtain.castShadow = true;
    leftCurtain.receiveShadow = true;
    const rightCurtain = new THREE.Mesh(rightGeometry, curtainMaterial);
    rightCurtain.castShadow = true;
    rightCurtain.receiveShadow = true;

    const curtainGroup = new THREE.Group();
    curtainGroup.add(leftCurtain, rightCurtain);
    curtainGroup.position.set(0, 0.1, 0.4);
    scene.add(curtainGroup);

    const leftBase = new Float32Array(leftGeometry.attributes.position.array);
    const rightBase = new Float32Array(rightGeometry.attributes.position.array);

    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 3.8, 32),
      new THREE.MeshStandardMaterial({
        color: "#7e8a96",
        roughness: 0.4,
        metalness: 0.6,
      })
    );
    rod.rotation.z = Math.PI / 2;
    rod.position.set(0, curtainHeight / 2 + 0.25, 0.4);
    rod.castShadow = true;
    scene.add(rod);

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.7, 0.25, 48),
      new THREE.MeshStandardMaterial({
        color: "#d8dfe8",
        roughness: 0.8,
        metalness: 0.1,
      })
    );
    pedestal.position.set(0, -1, -0.1);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;

    const logoTexture = new THREE.TextureLoader().load(
      "/images/logo_hgm_withtext.png"
    );
    logoTexture.colorSpace = THREE.SRGBColorSpace;

    const coverMaterial = new THREE.MeshStandardMaterial({
      color: "#fdfcf9",
      roughness: 0.6,
      metalness: 0.1,
      map: logoTexture,
    });
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: "#f2e6d8",
      roughness: 0.9,
      metalness: 0.05,
    });
    const spineMaterial = new THREE.MeshStandardMaterial({
      color: "#dbcab4",
      roughness: 0.9,
      metalness: 0.05,
    });

    const bookMaterials = [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      coverMaterial,
      spineMaterial,
    ];

    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.9, 0.12),
      bookMaterials
    );
    book.castShadow = true;
    book.position.set(0, -0.35, -0.2);

    const productGroup = new THREE.Group();
    productGroup.add(pedestal, book);
    scene.add(productGroup);

    const updateCurtain = (
      geometry: THREE.PlaneGeometry,
      basePositions: Float32Array,
      time: number,
      open: number
    ) => {
      const position = geometry.attributes.position as THREE.BufferAttribute;
      const foldCount = 6;
      const foldAmplitude = 0.12 - open * 0.05;
      const flutterAmplitude = 0.03 - open * 0.012;

      for (let i = 0; i < position.count; i += 1) {
        const index = i * 3;
        const x = basePositions[index];
        const y = basePositions[index + 1];
        const z = basePositions[index + 2];
        const u = (x + curtainWidth / 2) / curtainWidth;
        const v = (y + curtainHeight / 2) / curtainHeight;
        const fold =
          Math.sin(u * Math.PI * foldCount + time * 0.9) * foldAmplitude;
        const flutter = Math.sin(v * 9 + u * 4 + time * 1.6) * flutterAmplitude;

        position.array[index + 2] = z + fold + flutter;
      }

      position.needsUpdate = true;
      geometry.computeVertexNormals();
    };

    const clock = new THREE.Clock();
    let frameId = 0;

    const render = () => {
      const time = clock.getElapsedTime();
      const open = openRef.current.value;
      const spread = THREE.MathUtils.lerp(0.32, 1.4, open);

      updateCurtain(leftGeometry, leftBase, time, open);
      updateCurtain(rightGeometry, rightBase, time + 0.2, open);

      leftCurtain.position.set(-spread, 0, 0);
      rightCurtain.position.set(spread, 0, 0);
      leftCurtain.rotation.y = THREE.MathUtils.lerp(0.1, 0.55, open);
      rightCurtain.rotation.y = THREE.MathUtils.lerp(-0.1, -0.55, open);
      leftCurtain.scale.x = THREE.MathUtils.lerp(1, 0.62, open);
      rightCurtain.scale.x = THREE.MathUtils.lerp(1, 0.62, open);

      const sway = Math.sin(time * 0.3) * 0.02;
      leftCurtain.rotation.z = sway;
      rightCurtain.rotation.z = -sway;

      productGroup.position.z = THREE.MathUtils.lerp(-0.45, -0.15, open);
      productGroup.rotation.y = Math.sin(time * 0.25) * 0.06;

      spotLight.intensity = 0.9 + open * 0.45;
      ambientLight.intensity = 0.3 + open * 0.15;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    const handleResize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) {
        return;
      }
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    handleResize();
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.dispose();
      leftGeometry.dispose();
      rightGeometry.dispose();
      floorMaterial.dispose();
      curtainMaterial.dispose();
      coverMaterial.dispose();
      edgeMaterial.dispose();
      spineMaterial.dispose();
      logoTexture.dispose();
      map.dispose();
      bump.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleAdvance = () => {
    setStage((prev) => Math.min(prev + 1, 3));
  };

  const handleReset = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setStage(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAdvance();
    }
  };

  const countdownValue = Math.max(0, 3 - stage);

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#0b1b2a] text-white"
      onClick={handleAdvance}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Tap to reveal the product"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(0,123,194,0.35),rgba(11,27,42,0)_60%),radial-gradient(90%_60%_at_50%_100%,rgba(187,225,65,0.18),rgba(11,27,42,0)_60%)]" />
      <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 pb-16 pt-24 text-center">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#b8c7d8]">
            Product Reveal
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="relative flex h-[5.5rem] items-center justify-center">
              <span
                className={`absolute text-[clamp(3rem,10vw,5.5rem)] font-semibold tracking-[0.2em] text-white transition-opacity duration-500 ${
                  stage < 3 ? "opacity-100" : "opacity-0"
                }`}
              >
                {countdownValue}
              </span>
              <span
                className={`absolute whitespace-nowrap text-[clamp(1.8rem,5.5vw,3.6rem)] font-serif font-semibold leading-none text-white transition-opacity duration-700 ${
                  stage === 3 ? "opacity-100" : "opacity-0"
                }`}
              >
                The Quiet Time Journal
              </span>
            </div>
            {stage < 3 && (
              <span className="text-xs uppercase tracking-[0.4em] text-[#cfd8e2]">
                Taps to reveal
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((step) => (
              <span
                key={step}
                className={`h-2.5 w-8 rounded-full transition-all ${
                  stage >= step
                    ? "bg-accent-green shadow-[0_0_12px_rgba(187,225,65,0.6)]"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-[#c9d8e6]">{STAGE_COPY[stage]}</p>
          {stage === 3 && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-white/30 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-accent-green hover:text-white"
            >
              Reset Reveal
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
