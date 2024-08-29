function closeWindow() {
    document.getElementById('myWindow').style.display = 'none';
}

function openWindow() {
    document.getElementById('myWindow').style.display = 'block';
}

// Create the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);

// Camera position and background color
camera.position.set(4.2, 5.6, 5.5);

// Set the background color to light blue
const lightBGColor = 0xadd8e6;
scene.background = new THREE.Color(lightBGColor);

// Get the container where the model will be rendered
const container = document.getElementById('modelContainer');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.timeMappingExposure = 2.3;
renderer.shadowMap.enabled = true;
renderer.setSize(container.clientWidth, container.clientHeight);
console.log(`Width: ${container.clientWidth}, Height: ${container.clientHeight}`);
container.appendChild(renderer.domElement);

// Lighting and shadows
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10).normalize();
scene.add(directionalLight);
const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
scene.add(hemiLight)

// Load the grass texture
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load('./data/texture/grass_texture2.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(80, 80);

// Create a flat surface (plane) below the model
const planeGeometry = new THREE.PlaneGeometry(250, 250);
const planeMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
    side: THREE.DoubleSide
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2; // Rotate the plane to make it horizontal
plane.position.y = 0; // Position the plane below the model
scene.add(plane);
// Load the GLTF model
const loader = new THREE.GLTFLoader();
loader.load('./data/3d_model/structureNeb3.glb', result => {
    model = result.scene;
    model.scale.set(1,1,1);
    model.position.y = 0;
    scene.add(model);
    animate();
});

// OrbitControls for interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.minPolarAngle = 0;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 100;
controls.update();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Adjust the renderer and camera when the window is resized
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Initial window
closeWindow();