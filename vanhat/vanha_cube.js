const cubes = []
let vanha_cube;


function createCubes() {
    let dimension = new THREE.Vector3(70, 50, 10);
    let c = new Cube(dimension);
    c.setPosition(new THREE.Vector3(0, 0, 0));
    c.turnFrameOn();

    c.addToScene();
    cubes.push(c);
    console.log(c.mesh);
    vanha_cube = c;
}


class Cube {
    constructor(dimension, color) {
        if (color === undefined) {
            color = new THREE.Color('darkgreen');
        }
        let geometry = new THREE.BoxGeometry(dimension.x, dimension.y, dimension.z);
        // let geometry = new THREE.BoxGeometry();
        let material = new THREE.MeshBasicMaterial({color: color});
        this.mesh = new THREE.Mesh(geometry, material);
    }

    addToScene() {
        scene.add(this.mesh);
    }

    turnFrameOn() {
        let geo = new THREE.EdgesGeometry( this.mesh.geometry );
        let mat = new THREE.LineBasicMaterial( { color: new THREE.Color('black'), linewidth: 2 } );
        let wireframe = new THREE.LineSegments( geo, mat );
        this.mesh.add( wireframe );
    }

    setPosition(position) {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
    }

    setRotation(vector) {
        this.mesh.rotation.x = vector.x;
        this.mesh.rotation.y = vector.y;
        this.mesh.rotation.z = vector.z;
    }

    move(vector) {
        this.mesh.position.x += vector.x;
        this.mesh.position.y += vector.y;
        this.mesh.position.z += vector.z;
    }

    rotate(vector) {
        this.mesh.rotation.x += vector.x;
        this.mesh.rotation.y += vector.y;
        this.mesh.rotation.z += vector.z;
    }

    scale(vector) {
        // this.mesh.scale.set( vector );
        this.mesh.scale.x = vector.x;
        this.mesh.scale.y = vector.y;
        this.mesh.scale.z = vector.z;
    }
}