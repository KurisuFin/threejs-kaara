function createBox(pos, quat, w, l, h, mass, friction) {
    let material = mass > 0 ? materialDynamic : materialStatic;
    let shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
    let geometry = new Ammo.btBoxShape(new Ammo.btVector3(w * 0.5, l * 0.5, h * 0.5));

    if (!mass) mass = 0;
    if (!friction) friction = 1;

    let mesh = new THREE.Mesh(shape, material);
    mesh.position.copy(pos);
    mesh.quaternion.copy(quat);
    scene.add(mesh);

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    let motionState = new Ammo.btDefaultMotionState(transform);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    geometry.calculateLocalInertia(mass, localInertia);

    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia);
    let body = new Ammo.btRigidBody(rbInfo);

    body.setFriction(friction);
    // body.setRestitution(.9);
    // body.setDamping(0.2, 0.2);

    physicsWorld.addRigidBody(body);

    if (mass > 0) {
        body.setActivationState(DISABLE_DEACTIVATION);

        // Sync physics and graphics
        function sync(dt) {
            let ms = body.getMotionState();
            if (ms) {
                ms.getWorldTransform(transform_aux);
                let p = transform_aux.getOrigin();
                let q = transform_aux.getRotation();
                mesh.position.set(p.x(), p.y(), p.z());
                mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }

        syncList.push(sync);
    }
}
