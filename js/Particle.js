class Particle {
	constructor(size, color){
		let map = new THREE.TextureLoader().load( "images/smoke.png" );
                let material = new THREE.SpriteMaterial( { map: map, color: color, blending:THREE.AdditiveBlending } );
                this.object3d = new THREE.Sprite( material );
		let rand = Math.random()*size/2.5 + size/3;
                this.object3d.scale.x = rand;
                this.object3d.scale.y = rand;
		this.object3d.material.transparent = true;
	}

	update(delta,time){

	}

}
