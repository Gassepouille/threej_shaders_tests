class MouseTracking {
	constructor(camera, scene, head){
		this.camera = camera;
		this.scene = scene;
		this.head = head;
		this.direction = new THREE.Vector3(0, 0, 1);
		this.rotationOffset = head.rotation.clone();
		this.rotationOrigin = new THREE.Euler();

		document.addEventListener( 'mousemove', this.mouseMove.bind(this), false );
		document.addEventListener( 'touchmove', this.touchMove.bind(this), false );
	}
	touchMove(event){
		event.preventDefault();

		event.clientX = event.touches[0].clientX;
		event.clientY = event.touches[0].clientY;
		this.mouseMove( event );
	}
	mouseMove(event){
		event.preventDefault();

		// let vec = new THREE.Vector3(2.0 * event.scenePercentX -1.0, 1.0 - 2.0 * event.scenePercentY, 0.5);
		var scenePercentX = (event.clientX*100)/window.innerWidth;
		var scenePercentY = (event.clientY*100)/window.innerHeight;
		let vec = new THREE.Vector3(2.0 * scenePercentX -1.0, 1.0 - 2.0 * scenePercentY, 0.5);
		let wsCam = new THREE.Vector3().applyMatrix4(this.camera.matrixWorld);
		// let dir;
		// let distance;
		// let  pos;
		vec.unproject(this.camera)
		this.direction = vec.sub(wsCam).normalize();
	}
	update(){
		this.rotationOffset.x = this.head.rotation.x - this.rotationOrigin.x
		this.rotationOffset.y = this.head.rotation.y - this.rotationOrigin.y
		this.rotationOffset.z = this.head.rotation.z - this.rotationOrigin.z
		let wsPos = new THREE.Vector3().applyMatrix4(this.scene.matrixWorld);
		let wsCam = new THREE.Vector3().applyMatrix4(this.camera.matrixWorld);
		let wsDist = this.distance * wsCam.distanceTo(wsPos);
		let wsDir = new THREE.Vector3().copy(this.direction).multiplyScalar(wsDist);
		let wsTarget = new THREE.Vector3().copy(wsCam).add(wsDir);
		let parentMat = this.head.parent ? this.head.parent.matrixWorld : new THREE.Matrix4();
		let wsInv = new THREE.Matrix4().getInverse(parentMat);
		let target = new THREE.Vector3().copy(wsTarget).applyMatrix4(wsInv).sub(this.head.position);
		let eulerOffset = new THREE.Euler(this.rotationOffset.x, this.rotationOffset.y, this.rotationOffset.z, 'XYZ');
		let quaternionOffset = new THREE.Quaternion().setFromEuler(eulerOffset);

		if (target.x<0.5) target.x=0.5;
		if (target.z<1.8) target.z=1.8;
		this.head.lookAt(target);
		// this.head.quaternion.multiply(quaternionOffset);
	}

}
