/**
 * A particle represented by a basic cube.
 */
import * as THREE from 'three';

export default class CubeParticle {
  constructor(mesh, position, velocity, lifetime, plane_collision, start_color, end_color) {
    this.start_color = start_color;
    this.end_color = end_color;
    this.plane_collision = plane_collision;
    this.mesh = mesh;
    this.reset(position, velocity, lifetime);
  }

  reset(position, velocity, lifetime) {
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
    this.velocity = velocity;
    this.lifetime = lifetime;
    this.time = 0.0;

    if(this.start_color) {
      this.mesh.material.color.copy(this.start_color);
    }
  }

  // Return whether or not this particle is dead
  update(dt, start_color, end_color) {
    if(this.time < this.lifetime) {
      this.time += dt;

      // Move the mesh
      this.mesh.position.x += this.velocity.x;
      this.mesh.position.y += this.velocity.y;
      this.mesh.position.z += this.velocity.z;

      if(this.plane_collision) {
        if(this.mesh.position.y <= 0) {
          this.mesh.position.y = 1;
          this.velocity.y = -this.velocity.y;
        }
      }

      if(start_color) {
        this.start_color = start_color;
        this.end_color = end_color;
      }

      // Optionally change material color
      if(this.start_color) {
        this.mesh.material.color.copy(new THREE.Color(this.start_color).lerp(new THREE.Color(this.end_color), this.time / this.lifetime));
      }

      return false;
    }
    else {
      this.mesh.position.x = NaN;
      this.mesh.position.y = NaN;
      this.mesh.position.z = NaN;
      return true;
    }
  }

};