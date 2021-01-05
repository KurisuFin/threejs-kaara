// Graphics variables
let container, stats, speedometer;
let camera, controls, scene, renderer;
let terrainMesh, texture;
let clock = new THREE.Clock();
let materialDynamic, materialStatic, materialInteractive;

let camPosition = {
    x: -10.23,   // -4.84
    y: 22.92,    // 4.39
    z: -27.91    // -35.11
}


function initGraphics() {
    container = document.getElementById('container');
    speedometer = document.getElementById('speedometer');

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 2000);
    camera.position.x = camPosition.x;
    camera.position.y = camPosition.y;
    camera.position.z = camPosition.z;
    camera.lookAt(new THREE.Vector3(0.33, -0.40, 0.85));
    controls = new THREE.OrbitControls(camera);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xbfd1e5);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    let ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 5);
    scene.add(dirLight);

    materialDynamic = new THREE.MeshPhongMaterial({color: 0xfca400});
    materialStatic = new THREE.MeshPhongMaterial({color: 0x999999});
    materialInteractive = new THREE.MeshPhongMaterial({color: 0x990000});

    container.innerHTML = "";

    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}