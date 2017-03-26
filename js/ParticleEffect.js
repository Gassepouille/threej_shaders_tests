class ParticleEffect {
	constructor(position, color, scene){
		this.startAnimation = false;
		this.originPosition = position.clone();
		this.color = color;
		this.scene = scene;
		this.liveParticles = [];
		this.deadParticles = [];
		this.time = 0;
		this.radius = 10;
		this.speed = 5;
		this.limitY = 35;
		this.initParticles();
	}
	initParticles(color){
		this.container = new THREE.Object3D();
		this.container.position.copy(this.originPosition)

		this.particleGenerator = new THREE.Object3D();
		this.container.add(this.particleGenerator)

		this.scene.add(this.container)

		for (var i = 0; i < 80; i++) {
			this.deadParticles.push(new Particle(8, this.color))
		}
	}
	update(delta,time){
		if(this.startAnimation === true){
			let posX=  this.radius*Math.cos(this.speed*50*time);
			let posZ=  this.radius*Math.sin(this.speed*50*time);
			this.particleGenerator.position.x = posX;
			this.particleGenerator.position.z = posZ;
			this.particleGenerator.position.y+=this.speed*5*delta;
			if(this.particleGenerator.position.y >= this.limitY) this.particleGenerator.position.y = 0;

			if(this.time + 0.00001 < time){
				var particle = this.deadParticles.shift();
				this.liveParticles.push(particle);
				particle.object3d.position.copy(this.particleGenerator.position)
				this.container.add(particle.object3d);
				this.time = time;
			}
			// Particles updates
			for (var i = this.liveParticles.length-1; i >=0 ; i--) {
				var particle = this.liveParticles[i];
				particle.object3d.material.opacity-=0.015;
				if(particle.object3d.material.opacity <= 0 ){
					this.container.remove(particle.object3d);
					particle.object3d.material.opacity = 1;
					var particleObject = this.liveParticles.splice(i, 1);
					this.deadParticles.push(...particleObject);
				}
			}
		}
	}
	remove(){
		for (var i = this.liveParticles.length-1; i >=0 ; i--) {
			let particle = this.liveParticles[i];
			this.container.remove(particle.object3d);
			particle.object3d.material.opacity = 1;
			let particleObject = this.liveParticles.splice(i, 1);
			this.deadParticles.push(...particleObject);
		}
	}
	stop(){
		this.startAnimation = false;
		this.particleGenerator.position.y = 0;
		this.remove();
	}
	start(){
		this.startAnimation = true;
	}

}
