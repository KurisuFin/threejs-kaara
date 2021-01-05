
let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4

// --- GROUND ---


function createGround() {
    let pos = {x: 0, y: 0, z: 0};
    let scale = {x: 100, y: 2, z: 100};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);

    body.setFriction(4);
    body.setRollingFriction(10);

    physicsWorld.addRigidBody(body);
}


// --- CAR ---


function createCar() {
    let transform = new Ammo.btTransform();

    // --- TIRE ---

    // Tire Graphics

    let tirePos = {x: -5, y: 5, z: -3}
    let tireScale = {radius: 2.5, height: 1, radialSegments: 8}
    let tireMass = 0;
    let tireQuat = {x: 0, y: 0, z: 0, w: 1};

    let tire = new THREE.Mesh(new THREE.CylinderBufferGeometry(tireScale.radius, tireScale.radius, tireScale.height, tireScale.radialSegments), new THREE.MeshPhongMaterial({color: 0xdddddd}));
    tire.position.set(tirePos.x, tirePos.y, tirePos.z);
    tire.rotation.z = 90 * Math.PI / 180;
    tire.castShadow = true;
    tire.receiveShadow = true;
    scene.add(tire);

    // Tire Physics
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(tirePos.x, tirePos.y, tirePos.z));
    transform.setRotation(new Ammo.btQuaternion(tireQuat.x, tireQuat.y, tireQuat.z, tireQuat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let sphereColShape = new Ammo.btSphereShape(tireScale.radius);
    sphereColShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    sphereColShape.calculateLocalInertia(tireMass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(tireMass, motionState, sphereColShape, localInertia);
    let tireBody = new Ammo.btRigidBody(rbInfo);

    physicsWorld.addRigidBody(tireBody, colGroupGreenBall, colGroupRedBall);

    tire.userData.physicsBody = tireBody;
    rigidBodies.push(tire);


    // --- HULL ---

    // Hull Graphics

    let hullPos = {x: 0, y: 4, z: 0};
    let hullScape = {x: 8, y: 4, z: 12}
    let hullQuat = {x: 0, y: 0, z: 0, w: 1};
    let hullMass = 1;


    hull = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xff0505}));
    hull.position.set(hullPos.x, hullPos.y, hullPos.z);
    hull.scale.set(hullScape.x, hullScape.y, hullScape.z);
    hull.castShadow = true;
    hull.receiveShadow = true;
    scene.add(hull);
    // car = new THREE.Object3D();
    // car.position.set(hullPos.x, hullPos.y, hullPos.z);
    // car.add(hull);
    // car.add(tire);
    // scene.add(car);

    // Hull Physics
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(hullPos.x, hullPos.y, hullPos.z));
    transform.setRotation(new Ammo.btQuaternion(hullQuat.x, hullQuat.y, hullQuat.z, hullQuat.w));
    motionState = new Ammo.btDefaultMotionState(transform);

    let hullShape = new Ammo.btBoxShape(new Ammo.btVector3(hullScape.x * 0.5, hullScape.y * 0.5, hullScape.z * 0.5));
    hullShape.setMargin(0.05);
    localInertia = new Ammo.btVector3(0, 0, 0);
    hullShape.calculateLocalInertia(hullMass, localInertia);

    rbInfo = new Ammo.btRigidBodyConstructionInfo(hullMass, motionState, hullShape, localInertia);
    let hullBody = new Ammo.btRigidBody(rbInfo);
    hullBody.setFriction(4);
    hullBody.setActivationState(STATE.DISABLE_DEACTIVATION);
    physicsWorld.addRigidBody(hullBody);
    hull.userData.physicsBody = hullBody;
    rigidBodies.push(hull);


    // --- Joints ---

    // let spherePivot = new Ammo.btVector3(0, - tireScale.radius, 0);
    // let hullPivot = new Ammo.btVector3(-hullScape.x * 0.5, 1, 1);
    //
    // let p2p = new Ammo.btPoint2PointConstraint(tire, hull, spherePivot, hullPivot);
    // physicsWorld.addConstraint(p2p, false);

}


// function createCar() {
//     let pos = {x: 0, y: 4, z: 0};
//     let radius = 2;
//     let quat = {x: 0, y: 0, z: 0, w: 1};
//     let mass = 1;
//
//     //threeJS Section
//     car = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));
//     car.position.set(pos.x, pos.y, pos.z);
//     car.castShadow = true;
//     car.receiveShadow = true;
//     scene.add(car);
//
//     //Ammojs Section
//     let transform = new Ammo.btTransform();
//     transform.setIdentity();
//     transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
//     transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
//     let motionState = new Ammo.btDefaultMotionState(transform);
//
//     let colShape = new Ammo.btSphereShape(radius);
//     let localInertia = new Ammo.btVector3(0, 0, 0);
//     colShape.setMargin(0.05);
//     colShape.calculateLocalInertia(mass, localInertia);
//
//     let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
//     let body = new Ammo.btRigidBody(rbInfo);
//     body.setFriction(4);
//     body.setRollingFriction(10);
//
//     physicsWorld.addRigidBody(body);
//     car.userData.physicsBody = body;
//     rigidBodies.push(car);
// }


function moveCar() {
    let scalingFactor = 20;
    let moveX = keys.d - keys.a;
    let moveZ = keys.s - keys.w;
    let moveY = 0;
    if (moveX === 0 && moveY === 0 && moveZ === 0) return;

    let resultantImpulse = new Ammo.btVector3(moveX, moveY, moveZ)
    resultantImpulse.op_mul(scalingFactor);

    // let physicsBody = car.userData.physicsBody;
    let physicsBody = hull.userData.physicsBody;
    physicsBody.setLinearVelocity(resultantImpulse);
}