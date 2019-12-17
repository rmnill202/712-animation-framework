/**
 * Manages and updates a number of particles. 
 */
import * as THREE from 'three';

export default class ParticleSystem {
  constructor(rate, spawner, minLife, maxLife, factory) {
    this.rate = rate;
    this.spawner = spawner;
    this.minLife = minLife;
    this.maxLife = maxLife;
    this.factory = factory;
  }

  // 
  update(dt, newFrame) {
    if(newFrame) {
      for(let i = 0; i < this.rate; i++) {
        // Get a new random position/velocity from the spawner
        let newPosVel = this.spawner.randomParams();

        // Tell the factory to create a new particle with this stuff
        this.factory.createParticle(newPosVel.pos, newPosVel.vel, Math.floor(Math.random() * this.maxLife) + this.minLife);
      }
    }

    // Tell the factory to update its particles
    this.factory.update(dt);
  }

};