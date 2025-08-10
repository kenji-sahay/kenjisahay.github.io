// three-hero.js (diagnostic cube)
(function(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;

  // Respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 3);

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshNormalMaterial({ wireframe: false })
  );
  scene.add(box);

  function sizeToHero(){
    const hero = canvas.parentElement;             // the .hero section
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || Math.max(240, window.innerHeight * 0.45);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  sizeToHero();

  new ResizeObserver(sizeToHero).observe(canvas.parentElement);
  window.addEventListener('resize', sizeToHero, { passive: true });

  function tick(){
    box.rotation.x += 0.01;
    box.rotation.y += 0.015;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
