

let cam = {
    fov: 60,
    near: 0.2,
    far: 10000,
    position: {
        x: -10,
        y: 20,
        z: 20
    },
    target: {
        x: 0,
        y: 0,
        z: 0
    }
};


// function initCamera() {
//     camera = new THREE.PerspectiveCamera(cam.fov, width / height, cam.near, cam.far);
//     camera.position.set(cam.position.x, cam.position.y, cam.position.z);
//     camera.lookAt(new THREE.Vector3(cam.target.x, cam.target.y, cam.target.z));
//
//     cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
//     cameraControls.target.set(cam.target.x, cam.target.y, cam.target.z);
// }


function setupGraphics() {
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);

    //Add hemisphere light
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    hemiLight.color.setHSL(0.6, 0.6, 0.6);
    hemiLight.groundColor.setHSL(0.1, 1, 0.4);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    //Add directional light
    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(100);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    let d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 13500;

    //Setup the renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xbfd1e5);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;

    initCamera();
    renderer.shadowMap.enabled = true;
}