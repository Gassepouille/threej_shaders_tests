class OutliningPass {
	constructor(renderer){
		this.renderer = renderer;
		let renderWidth = this.renderer.getSize().width;
		let renderHeight = this.renderer.getSize().height;

		this.renderTexture = new THREE.WebGLRenderTarget(renderWidth, renderHeight);
		// Shader
		var color = new THREE.Color( 0xff0000 );
		var outlinePass = new THREE.ShaderPass( THREE.EdgeShader3 );
		outlinePass.material.uniforms.aspect.value.x = renderWidth;
		outlinePass.material.uniforms.aspect.value.y = renderHeight;
		outlinePass.material.uniforms.color.value = color;
		outlinePass.renderToScreen = true;
		outlinePass.material.transparent = true;
		this.outlinePass = outlinePass;
	}
	update(scene, camera, selectedObject){
		if(selectedObject === null) return;
		let materialArray = {};

		// Traverse scene to hide non selected objects
		scene.traverse((object3d) =>{
			if(!object3d.material) return;
			object3d.material.visible = false;
		})

		// Display selected object in a weird color so it pops up
		// TODO TEST with :
		// postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombine;
		// postprocessing.scene.overrideMaterial = null;
		selectedObject.traverse((obj) => {
			if(!obj.material) return;
			materialArray[obj.uuid] = obj.material;
			obj.material = new THREE.MeshBasicMaterial( { color: 0x0000ff, fog:false  } );;
		})

		// Render the scene on the texture
		this.renderer.render( scene, camera, this.renderTexture, true );

		// set the material as it was for the selected object
		selectedObject.traverse((obj) => {
			if(!obj.material) return;
			obj.material = materialArray[obj.uuid];
		})
		// Show all the objects in the scene
		scene.traverse((object3d) =>{
			if(!object3d.material) return;
			object3d.material.visible = true;
		})

		this.outlinePass.render( this.renderer, null, this.renderTexture );
	}
}
