/**
 * A simple billiards simulation. Assumes that we have some boundaries, pool balls and a cue ball. 
 */
import * as THREE from 'three';

export default class PhysicsSim {
  constructor(positions) {
    // Maintain a list of entities to update
    this.entities = [];

    // Other things
    this.tableHeight = 1.298 * 10; this.tableWidth = 2.438 * 10; // Meters
    this.ballMass = 170; // Grams
    this.ballSize = 0.057 * 10; // 5.7cm or 0.057m

    for(let pos of positions) {
      this.entities.push({
        x: pos.x,
        y: pos.y,
        vel: 5
      });
    }

  }

  updateForces(dt) {

  }

  updatePositionMomentum(dt) {
    // For now, just move the balls
    for(let ball of this.entities) {
      if(ball.x > this.tableWidth) {
        ball.vel *= -1;
        ball.x = this.tableWidth;
      }
      if(ball.x < 0) {
        ball.vel *= -1;
        ball.x = 0;
      }
      ball.x += ball.vel * dt;
      // ball.x += 5 * dt;
      // ball.x += 0.005 * dt;
      // ball.y += 0.005 * dt;
    }
  }

  updateVelocities(dt) {

  }

  
  updateSim(dt) {
    // Calculate forces
    this.updateForces(dt);
    
    // Update positions/momentum
    this.updatePositionMomentum(dt);
    
    // Calculate velocities
    this.updateVelocities(dt);
  }
};