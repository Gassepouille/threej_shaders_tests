class Updater {
	constructor(scene, camera, renderer){
		this.updatePool = [];
		this.scene = scene;
		this.camera = camera;
		this.renderer = renderer;
		this.clock = new THREE.Clock();
		this.update();
	}
	update(){
		let delta = this.clock.getDelta();
		let time = this.clock.getElapsedTime() * 0.01;

		this.renderer.render( this.scene, this.camera );

		// Update pool of functions
		this.updatePool.forEach(function(update){
			update(delta, time);
		});

		requestAnimationFrame(this.update.bind(this));
	}
	addToPool(updateFunction){
		this.updatePool.push(updateFunction);
	}
}
