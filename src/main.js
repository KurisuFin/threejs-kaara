Ammo().then(start);

// Global variables
let transform_aux;
const DISABLE_DEACTIVATION = 4;
const ZERO_QUATERNION = new THREE.Quaternion(0, 0, 0, 1);

// Physics variables
let collisionConfiguration;
let dispatcher;
let broadphase;
let solver;
let physicsWorld;

let syncList = [];
let time = 0;
let objectTimePeriod = 3;
let timeNextSpawn = time + objectTimePeriod;


function start(Ammo) {
    // Detects webgl
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        document.getElementById('container').innerHTML = "";
    }
    transform_aux = new Ammo.btTransform();

    initGraphics();
    initPhysics();
    createObjects();
    tick();
}


function initPhysics() {
    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));
}


function tick() {
    requestAnimationFrame(tick);
    let deltaTime = clock.getDelta();
    for (let i = 0; i < syncList.length; i++)
        syncList[i](deltaTime);
    physicsWorld.stepSimulation(deltaTime, 10);
    controls.update(deltaTime);
    renderer.render(scene, camera);
    time += deltaTime;
    stats.update();
    // console.log(camera.position.x + ' ' + camera.position.y + ' ' + camera.position.z)
}


function createObjects() {
    // Ground
    let goundFriction = 0.1;  // 2
    createBox(new THREE.Vector3(0, -0.5, 0), ZERO_QUATERNION, 75, 1, 75, 0, goundFriction);

    // Ramp
    let quaternion = new THREE.Quaternion(0, 0, 0, 1);
    quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 18);
    createBox(new THREE.Vector3(0, -1.5, 0), quaternion, 8, 4, 10, 0);

    // Boxes
    let boxFriction = 0.1;  // 10
    let size = .75;
    let nw = 8;
    let nh = 6;
    for (let j = 0; j < nw; j++)
        for (let i = 0; i < nh; i++)
            createBox(new THREE.Vector3(size * j - (size * (nw - 1)) / 2, size * i, 10), ZERO_QUATERNION, size, size, size, 10, boxFriction);

    createVehicle(new THREE.Vector3(0, 4, -20), ZERO_QUATERNION);
}