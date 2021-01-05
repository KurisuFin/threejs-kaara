function createWheelMesh(radius, width) {
    let t = new THREE.CylinderGeometry(radius, radius, width, 24, 1);
    t.rotateZ(Math.PI / 2);
    let mesh = new THREE.Mesh(t, materialInteractive);
    mesh.add(new THREE.Mesh(new THREE.BoxGeometry(width * 1.5, radius * 1.75, radius * .25, 1, 1, 1), materialInteractive));
    scene.add(mesh);
    return mesh;
}


function createChassisMesh(w, l, h) {
    let shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
    let mesh = new THREE.Mesh(shape, materialInteractive);
    scene.add(mesh);
    return mesh;
}


function createVehicle(pos, quat) {
    const chassisWidth = 1.8;
    const chassisHeight = .6;
    const chassisLength = 4;
    const massVehicle = 800;

    const wheelAxisPositionBack = -1;
    const wheelRadiusBack = .4;
    const wheelWidthBack = .3;
    const wheelHalfTrackBack = 1;
    const wheelAxisHeightBack = .3;

    const wheelAxisFrontPosition = 1.7;
    const wheelHalfTrackFront = 1;
    const wheelAxisHeightFront = .3;
    const wheelRadiusFront = .35;
    const wheelWidthFront = .2;

    const frontWheelFriction = 500;    // 1000
    const backWheelFriction = 4;
    const suspensionStiffness = 20.0;   // 20.0
    const suspensionDamping = 2.3;      // 2.3
    const suspensionCompression = 4.4;  // 4.4
    const suspensionRestLength = 0.6;   // .6
    const rollInfluence = 0.3;          // .2

    const steeringIncrement = .02;      // .04
    const steeringClamp = .3;           // .5
    const maxEngineForce = 2300;        // 2000
    const maxBreakingForce = 100;       // 100

    // Chassis
    let geometry = new Ammo.btBoxShape(new Ammo.btVector3(chassisWidth * .5, chassisHeight * .5, chassisLength * .5));
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);
    let localInertia = new Ammo.btVector3(0, 0, 0);
    geometry.calculateLocalInertia(massVehicle, localInertia);
    let body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, geometry, localInertia));
    body.setActivationState(DISABLE_DEACTIVATION);
    physicsWorld.addRigidBody(body);
    let chassisMesh = createChassisMesh(chassisWidth, chassisHeight, chassisLength);

    // Raycast Vehicle
    let engineForce = 0;
    let vehicleSteering = 0;
    let breakingForce = 0;
    let tuning = new Ammo.btVehicleTuning();
    let rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
    let vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster);
    vehicle.setCoordinateSystem(0, 1, 2);
    physicsWorld.addAction(vehicle);

    // Wheels
    const FRONT_LEFT = 0;
    const FRONT_RIGHT = 1;
    const BACK_LEFT = 2;
    const BACK_RIGHT = 3;
    let wheelMeshes = [];
    let wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
    let wheelAxleCS = new Ammo.btVector3(-1, 0, 0);

    function addWheel(isFront, pos, radius, width, index) {
        let wheelInfo = vehicle.addWheel(
            pos,
            wheelDirectionCS0,
            wheelAxleCS,
            suspensionRestLength,
            radius,
            tuning,
            isFront);

        wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
        wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
        wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
        wheelInfo.set_m_rollInfluence(rollInfluence);
        if (isFront) {
            wheelInfo.set_m_frictionSlip(frontWheelFriction);
        } else {
            wheelInfo.set_m_frictionSlip(backWheelFriction);
        }

        wheelMeshes[index] = createWheelMesh(radius, width);
    }

    addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT);
    addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT);
    addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT);
    addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT);

    // Sync keybord actions and physics and graphics
    function sync(dt) {

        let speed = vehicle.getCurrentSpeedKmHour();

        speedometer.innerHTML = (speed < 0 ? '(R) ' : '') + Math.abs(speed).toFixed(1) + ' km/h';

        breakingForce = 0;
        engineForce = 0;

        if (actions.acceleration) {
            if (speed < -1)
                breakingForce = maxBreakingForce;
            else engineForce = maxEngineForce;
        }
        if (actions.braking) {
            if (speed > 1)
                breakingForce = maxBreakingForce;
            else engineForce = -maxEngineForce / 2;
        }
        if (actions.left) {
            if (vehicleSteering < steeringClamp)
                vehicleSteering += steeringIncrement;
        } else {
            if (actions.right) {
                if (vehicleSteering > -steeringClamp)
                    vehicleSteering -= steeringIncrement;
            } else {
                if (vehicleSteering < -steeringIncrement)
                    vehicleSteering += steeringIncrement;
                else {
                    if (vehicleSteering > steeringIncrement)
                        vehicleSteering -= steeringIncrement;
                    else {
                        vehicleSteering = 0;
                    }
                }
            }
        }

        vehicle.applyEngineForce(engineForce, BACK_LEFT);
        vehicle.applyEngineForce(engineForce, BACK_RIGHT);

        vehicle.setBrake(breakingForce / 2, FRONT_LEFT);
        vehicle.setBrake(breakingForce / 2, FRONT_RIGHT);
        vehicle.setBrake(breakingForce, BACK_LEFT);
        vehicle.setBrake(breakingForce, BACK_RIGHT);

        vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT);
        vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT);

        let tm, p, q, i;
        let n = vehicle.getNumWheels();
        for (i = 0; i < n; i++) {
            vehicle.updateWheelTransform(i, true);
            tm = vehicle.getWheelTransformWS(i);
            p = tm.getOrigin();
            q = tm.getRotation();
            wheelMeshes[i].position.set(p.x(), p.y(), p.z());
            wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
        }

        tm = vehicle.getChassisWorldTransform();
        p = tm.getOrigin();
        q = tm.getRotation();
        chassisMesh.position.set(p.x(), p.y(), p.z());
        chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }

    syncList.push(sync);
}