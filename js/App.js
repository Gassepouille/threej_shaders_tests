class APP {
	constructor(){
		this.scene		= null;
		this.renderer		= null;
		this.camera		= null;
		this.selectedObject 	= null;
		this.directionalLight	= null;
	}

	// Init
	init(){

		this.scene = new THREE.Scene();

		// Renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
		this.renderer.autoClear = false;
		this.renderer.physicallyBasedShading = true;
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild(this.renderer.domElement);

		// Camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight , 1, 1000);
		this.camera.position.set(0, 20, 50 );

		// Orbit control
		let controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;

		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

		this.updater = new Updater(this.scene, this.camera, this.renderer);

		//Outlining element
		this.initOutlining();

		// add lights
		this.initLights();

		// init Models
		this.initModels();

		// Init mouse picking
		let mousePicking = new MousePick(this.renderer, this.camera, this.scene);
		mousePicking.setCallback((object3d) => {
			var particleEffectOld = this.selectedObject.userData.particleEffect;
			if(particleEffectOld) particleEffectOld.stop();

			var particleEffect = object3d.userData.particleEffect;
			if(particleEffect) particleEffect.start();

			this.selectedObject = object3d;
		})

	}
	// Outlining
	initOutlining(){
		let outliningPass = new OutliningPass(this.renderer);
		let _this = this;
		this.updater.addToPool((delta,time)=>{
			// outline the right object
			outliningPass.update(_this.scene, _this.camera, _this.selectedObject)
		});
	}
	// Add Lights
	initLights(){
		// Lights
		let ambient = new THREE.AmbientLight( 0x404040 );
		this.scene.add( ambient );

		this.directionalLight = new THREE.DirectionalLight( 0xffffff );
		this.directionalLight.position.set( 0, 50, 0 );
		this.scene.add( this.directionalLight );

		let _this = this;
		this.updater.addToPool((delta,time)=>{
			let posX=50*Math.cos(time*50);
			let posZ=50*Math.sin(time*50);
			_this.directionalLight.position.x=posX;
			_this.directionalLight.position.z=posZ;
		});
	}
	// Add Models
	initModels(){
		let _this = this;
		let modelLoader = new ModelLoader();
		modelLoader.load('./model/muro/', 'muro', this.directionalLight).then((model) => {
			model.position.set(-15,-20,0);
			model.scale.set(0.2,0.2,0.2);
			model.userData.selectable = true;
			_this.scene.add( model );
			_this.selectedObject = model;
			// Bind particles to the model
			model.userData.particleEffect = new ParticleEffect(model.position, "#BD0404", _this.scene );
			_this.updater.addToPool((delta,time)=>{
				model.userData.particleEffect.update(delta,time);
			});
			model.userData.particleEffect.start();
		});

		modelLoader.load('./model/Nyra/', 'nyra', this.directionalLight).then((model) => {
			model.position.set(15,-18,0);
			model.scale.set(1.2,1.2,1.2);
			model.userData.selectable = true;
			_this.scene.add( model );

			model.userData.particleEffect = new ParticleEffect(model.position, "#00f", _this.scene );
			_this.updater.addToPool((delta,time)=>{
				model.userData.particleEffect.update(delta,time);
			});
		});


	}
	// Resize
	onWindowResize(){
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
}
