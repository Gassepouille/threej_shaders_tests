class ModelLoader {
    load(path, name, light){
		this.model = null;
		this.light = light;
		let mtlLoader = new THREE.MTLLoader();
		mtlLoader.setTexturePath( path );
		mtlLoader.setPath( path );
        let _this = this;

		return new Promise((resolve, reject)=>{
			mtlLoader.load( name+".mtl", ( materials ) => {
				materials.preload();
				let loader = new THREE.OBJLoader();
				loader.setPath( path );
				loader.setMaterials( materials );
				loader.load(name+".obj", ( model ) => {
					model.traverse((object3d) => {
						if(!object3d.material) return;
						object3d.material = _this.createShaderMaterial(object3d.material);
					})
					resolve(model);
				});
			});
		});
    }
    createShaderMaterial(material){
		if(material.map === null) return material;
		let shader = THREE.CelShader;
		// Get uniforms
		let u = THREE.UniformsUtils.clone(shader.uniforms);

		// Get Vertex Shader
		let vs = shader.vertexShader;
		// Get Fragment Shader
		let fs = shader.fragmentShader;
		// create material from shader
		let newMaterial = new THREE.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs });

		newMaterial.uniforms.uDirLightPos.value = this.light.position;
		newMaterial.uniforms.uDirLightColor.value = this.light.color;
		newMaterial.uniforms.uMaterialColor.value.copy(material.color);
		newMaterial.uniforms.uTexture.value = material.map;

		return newMaterial;
    }
}
