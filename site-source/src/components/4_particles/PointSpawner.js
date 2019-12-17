import * as THREE from 'three';

export default class PointSpawner {
  constructor(x, y, z, min, max) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.max = max;
    this.min = min;
  }

  setPosition(p) {
    this.x = p.x;
    this.y = p.y;
    this.z = p.z
  }

  // 
  randomParams() {
    // Come up with a random velocity
    let vel = new THREE.Vector3(this.rand(), this.rand(), this.rand());

    return {
      vel: vel,
      pos: new THREE.Vector3(this.x, this.y, this.z)
    };
  }

  rand() {
    return Math.floor(Math.random() * this.max) + this.min;
  }

};