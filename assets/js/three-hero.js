// three-hero.js — lightweight particle field for the hero background
(function(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;

  // Respect reduced motion
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) { return; }

  // Scene basics
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 2, 0.1, 1000);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Colors: draw from your CSS variables (fallback to blue/white)
  const styles = getComputedStyle(document.documentElement);
  const isDark = document.documentElement.classList.contains('dark');
  const blue = styles.getPropertyValue('--link')?.trim() || '#1a5cff';
  const fg   = styles.getPropertyValue('--text')?.trim() || (isDark ? '#e7edf7' : '#0a1522');

  // Geometry: small particle cloud
  const COUNT = 240; // keep light
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    // distribute within a shallow volume
    positions[i*3+0] = (Math.random() - 0.5) * 24;   // x
    positions[i*3+1] = (Math.random() - 0.5) * 10;   // y
    positions[i*3+2] = (Math.random() - 0.5) * 8;    // z
    sizes[i] = Math.random() * 1.8 + 0.6;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  // Material: soft blue dots that fade with depth
  const material = new THREE.PointsMaterial({
    color: blue,
    size: 0.08,
    transparent: true,
    opacity: isDark ? 0.55 : 0.45,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Subtle rotation + drift
  let t = 0;
  function animate(){
    t += 0.0035;
    points.rotation.y = Math.sin(t * 0.6) * 0.08;
    points.rotation.x = Math.cos(t * 0.4) * 0.05;

    // gentle vertical shimmer
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pos[i*3+1] += Math.sin(t + i) * 0.0009; // tiny oscillation
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Resize handler
  function resize(){
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || Math.max(240, window.innerHeight * 0.48);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Dark-mode sync: if you toggle themes, nudge colors/opacity
  const observer = new MutationObserver(() => {
    const dark = document.documentElement.classList.contains('dark');
    material.opacity = dark ? 0.55 : 0.45;
    renderer.setClearColor(0x000000, 0); // keep transparent
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Kick off
  renderer.setClearColor(0x000000, 0);
  requestAnimationFrame(animate);
})();
