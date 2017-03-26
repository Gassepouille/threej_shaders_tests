class MousePick {
	constructor(renderer, camera, scene){
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.renderer = renderer;
		this.camera = camera;
		this.scene = scene;
		this.callback = null;

		document.addEventListener( 'mousedown', this.mouseDown.bind(this), false );
		document.addEventListener( 'touchstart', this.touchStart.bind(this), false );
	}
	touchStart(event){
			event.preventDefault();

			event.clientX = event.touches[0].clientX;
			event.clientY = event.touches[0].clientY;
			this.mouseDown( event );
	}
	mouseDown(event){
			event.preventDefault();

			this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
			this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;

			this.raycaster.setFromCamera( this.mouse, this.camera );
			let intersects = this.raycaster.intersectObjects( this.scene.children, true );
			if ( intersects.length > 0 ) {
				this.getParent(intersects[0].object).then((clickedObject) => {
					if(this.callback !== null){
						this.callback(clickedObject)
					}
				});
			}
	}
	getParent(object3d){
		return new Promise((resolve, reject)=>{
			function recursiveParent(object3d){
				if(object3d.parent instanceof THREE.Scene){
					if(object3d.userData.selectable !== true) return;
					resolve(object3d);
					return;
				}

				recursiveParent(object3d.parent)
			}
			recursiveParent(object3d)
		});
	}
	setCallback(callback){
		this.callback = callback;
	}
}
