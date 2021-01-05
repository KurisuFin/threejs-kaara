const width = window.innerWidth;
const height = window.innerHeight;

let time = 0;
let tick = 0;

let syncList = [];

// Physics variables
let collisionConfiguration;
let dispatcher;
let broadphase;
let solver;
let physicsWorld;

// Graphics variables
let container, stats, speedometer;
let camera, cameraControls;
let scene, renderer;
let terrainMesh, texture;
let clock = new THREE.Clock();
// let materialDynamic, materialStatic, materialInteractive;
let materialDynamic = new THREE.MeshPhongMaterial({color: 0xfca400});
let materialStatic = new THREE.MeshPhongMaterial({color: 0x999999});
let materialInteractive = new THREE.MeshPhongMaterial({color: 0x990000});

let actions = {};
let keysActions = {
    "KeyW": 'acceleration',
    "KeyS": 'braking',
    "KeyA": 'left',
    "KeyD": 'right'
};

const STATE = {
    ACTIVE: 1,
    ISLAND_SLEEPING: 2,
    WANTS_DEACTIVATION: 3,
    DISABLE_DEACTIVATION: 4,
    DISABLE_SIMULATION: 5
}


Ammo().then(start)

function start() {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        document.getElementById('container').innerHTML = "";
    }
    initPhysicsWorld();
    initGraphics();

    createVehicle(new THREE.Vector3(-5, 4, -10), new THREE.Quaternion(0, 0.3, 0, 1));

    renderFrame();

}

function initGraphics() {
    container = document.getElementById('container');
    speedometer = document.getElementById('speedometer');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 2000);
    camera.position.x = -4.84;
    camera.position.y = 4.39;
    camera.position.z = -35.11;
    camera.lookAt(new THREE.Vector3(0.33, -0.40, 0.85));
    cameraControls = new THREE.OrbitControls(camera);

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


function setupEventHandlers() {
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function handleKeyDown(e) {
    if (keysActions[e.code]) {
        actions[keysActions[e.code]] = true;
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}


function handleKeyUp(e) {
    if (keysActions[e.code]) {
        actions[keysActions[e.code]] = false;
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
}


function initPhysicsWorld() {
    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));

}

function renderFrame() {
    requestAnimationFrame(renderFrame);
    let deltaTime = clock.getDelta();

    for (let i = 0; i < syncList.length; i++)
        syncList[i](deltaTime);
    physicsWorld.stepSimulation(deltaTime, 10);

    cameraControls.update(deltaTime);
    renderer.render(scene, camera);

    time += deltaTime;
    stats.update();
}
