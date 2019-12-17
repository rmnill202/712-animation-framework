/**
 * Manages instances of cube particles.
 */
import * as THREE from 'three';
import CubeParticle from './CubeParticle';

export default class CubeParticleFactory {
  constructor(scene, limit, plane_collision, start_color, end_color) {
    this.plane_collision = plane_collision;
    this.start_color = start_color;
    this.end_color = end_color;
    
    // Default particle appearances!
    this.def_geom = new THREE.BoxGeometry( 10, 10, 10 );
    this.def_mat = new THREE.MeshBasicMaterial( {color: "#6f43a8"} );

    // Pre-initialize the pool
    this.pool = [];
    this.living = [];

    for(let i = 0; i < limit; i++) {
      let newParticle = new CubeParticle( new THREE.Mesh(this.def_geom, this.start_color ? new THREE.MeshBasicMaterial( {color: start_color} ) : this.def_mat), 
                                          new THREE.Vector3(NaN, NaN, NaN), 
                                          new THREE.Vector3(NaN, NaN, NaN), -1, plane_collision, this.start_color, this.end_color );
      newParticle.mesh.visible = false;
      scene.add(newParticle.mesh);
      this.pool.push(newParticle);
    }


  }

  createParticle(position, velocity, lifetime) {
    // Attempt to create a new particle
    if(this.pool.length > 0) {
      let spawned = this.pool.pop();
      spawned.reset(position, velocity, lifetime);
      this.living.push(spawned);
      spawned.mesh.visible = true;
    }
    
  }

  update(dt) {
    // Update living particles
    for(let i = 0; i < this.living.length; i++) {
      let isDead = this.living[i].update(dt, this.start_color, this.end_color);
    
      if(isDead) {
        this.living[i].mesh.visible = false;
        this.pool.push(this.living[i]);
        this.living.splice(i, 1);
        i -= 1;
      }
    }

  }

};