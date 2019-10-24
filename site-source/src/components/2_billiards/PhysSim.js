/**
 * A simple billiards simulation. Assumes that we have some boundaries, pool balls and a cue ball. 
 */
import * as THREE from 'three';

export default class PhysicsSim {
  constructor(co_restitution, co_sliding, balls, table) {
    this.co_sliding = co_sliding;
    this.co_restitution = co_restitution;
  
    // Play/pause state
    this.isPlaying = true;

    this.balls = balls;
    // this.borders = borders;
    this.table = table;

  }

  updateForces(dt) {

  }

  updatePositionMomentum(dt) {

  }

  updateVelocities(dt) {

  }

  /**
  Objects have
 - Velocity
 - Acceleration
 - Force
 - Momentum


Euler integration

We can find the position from velocity
We can find the velocity from acceleration
We can find momentum from force
	- Where is momentum even used?
	- Its mass * velocity, related to new position?
	- Then why need position?

we're either velocity or momentum based...

1. Calculate F(t): f = mass * acceleration

2a. snext = st + vt * dt
2b. Mnext = M + F*dt 
2c. Collision junk

3. Determine velocities for next step
vnext = momentum / mass + velocity


How would... I actually think about it?

1. Update the position using st + vt*dt
2. Update momentum using Mt + (ma)*dt
3. Check if there are any collisions
	3a. If so, back up to time of collision and calculate impulse
4. Update velocity using new momentum / mass + impulse (collision) velocity

Ball:
  - Position (x,y)
  - Velocity (Vec3)
  - Momentum (Vec3)
  
  */

  updateSim(dt) {
    // // Update each ball
    // if(this.isPlaying) {
    //   for(let i = 0; i < this.balls.length; i++) {
    //     this.updateBall(dt, i);
    //   }
    //   // console.log(this.borders);
    //   // this.isPlaying = false;
    // }

    this.updateEverything(dt);
    
  }

  updateEverything(dt) {
    // Update positions and calculate forces
    let old_positions = this.updatePositions(dt);
    let momentums = this.calcMomentums(dt);

    // Handle collisions
    let impulses = this.calcCollisions(dt, old_positions);

    // Update velocities
    for(let i = 0; i < this.balls.length; i++) {
      let ball = this.balls[i];
      let new_mntm = momentums[i];
      let impulse = impulses[i];
      let new_vel = new THREE.Vector2(new_mntm.x, new_mntm.y).divideScalar(ball.mass).add(impulse);

      ball.vel = new_vel;
    }
  }

  updatePositions(dt) {
    let oldPos = [];
    for(let ball of this.balls) {
      let ball_x = ball.mesh.position.x;
      let ball_y = ball.mesh.position.y;
      oldPos.push({x: ball_x, y: ball_y});
      let new_pos = new THREE.Vector2(ball_x, ball_y).add(  new THREE.Vector2(ball.vel.x, ball.vel.y).multiplyScalar(dt)  );
      ball.mesh.position.x = new_pos.x;
      ball.mesh.position.y = new_pos.y;
    }
    return oldPos;
  }

  calcMomentums(dt) {
    let mntms = [];
    for(let ball of this.balls) {
      let force_calc = this.calculate_forces(dt, ball.mass, ball.vel);
      let new_mntm = new THREE.Vector2(ball.vel.x * ball.mass, ball.vel.y * ball.mass).add(  new THREE.Vector2(force_calc.x, force_calc.y).multiplyScalar(dt)  );
      mntms.push(new_mntm);
    }
    return mntms;
  }

  calcCollisions(dt, old_pos) {
    // First, deal with any border collisions
    let impulses = [];
    for(let i = 0; i < old_pos.length; i++) {
      let border_impulse = this.handle_border_collisions(this.balls[i], old_pos[i].x, old_pos[i].y);
      impulses.push(border_impulse);
    }

    // Now, handle any ball-related collisions
    this.handle_all_ball_collisions(dt, old_pos, impulses);

    return impulses;
  }

  handle_all_ball_collisions(dt, old_pos, impulses) {
    // Detect collisions
    let rad = this.balls[0].mesh.geometry.boundingSphere.radius;
    let mass = this.balls[0].mass;

    for(let a = 0; a < this.balls.length; a++) {
      for(let b = a + 1; b < this.balls.length; b++) {
        if(a == b) { continue; }

        let a_x = this.balls[a].mesh.position.x, a_y = this.balls[a].mesh.position.y,
            b_x = this.balls[b].mesh.position.x, b_y = this.balls[b].mesh.position.y;

        let a_vel = this.balls[a].vel, b_vel = this.balls[b].vel;

        // Check if they collide
        let dist = Math.sqrt( Math.pow(a_x - b_x,2) + Math.pow(a_y - b_y, 2) );
        if(dist <= rad * 2.0) {
          // Find the normalized line of action
          let line_of_action = new THREE.Vector2(a_x, a_y).sub(new THREE.Vector2(b_x, b_y)).normalize();

          // Find the impulses
          let j = (mass * (new THREE.Vector2(b_vel.x, b_vel.y).dot(line_of_action) - new THREE.Vector2(a_vel.x, a_vel.y).dot(line_of_action)) * (this.co_restitution + 1)) / 2.0;

          let a_impl = new THREE.Vector2(line_of_action.x, line_of_action.y).multiplyScalar(j / mass);
          let b_impl = new THREE.Vector2(line_of_action.x, line_of_action.y).multiplyScalar(j / mass).multiplyScalar(-1.0);

          // Update existing impulses
          impulses[a].x += a_impl.x; impulses[a].y += a_impl.y;
          impulses[b].x += b_impl.x; impulses[b].y += b_impl.y;

          // Resolve the positions of the balls so they don't stick together!
          this.balls[a].mesh.position.x = old_pos[a].x;
          this.balls[a].mesh.position.y = old_pos[a].y;

          this.balls[b].mesh.position.x = old_pos[b].x;
          this.balls[b].mesh.position.y = old_pos[b].y;

        }

      }
    }
  }
  









  updateBall(dt, ball_index) {
    let ball = this.balls[ball_index];
    let ball_x = ball.mesh.position.x;
    let ball_y = ball.mesh.position.y;

    // Calculate forces - Sliding friction!
    let force_calc = this.calculate_forces(dt, ball.mass, ball.vel);

    // Update the object's position:
    // s(t + dt) = s + v*dt
    let new_pos = new THREE.Vector2(ball_x, ball_y).add(  new THREE.Vector2(ball.vel.x, ball.vel.y).multiplyScalar(dt)  );
    ball.mesh.position.x = new_pos.x; ball.mesh.position.y = new_pos.y;
    
    // Update the momentum
    // M(t + dt) = M + F*dt
    // let new_mntm = new THREE.Vector2(ball.mntm.x, ball.mntm.y).add(  new THREE.Vector2(force_calc.x, force_calc.y).add(impulse).multiplyScalar(dt)  );
    let new_mntm = new THREE.Vector2(ball.vel.x * ball.mass, ball.vel.y * ball.mass).add(  new THREE.Vector2(force_calc.x, force_calc.y).multiplyScalar(dt)  );
    ball.mntm = new_mntm;

    // Look for collisions, and handle them. This will:
    // 1. Potentially shift the position of the object
    // 2. Create an impulse that impacts the velocity calculation for the next step
    //   The coefficient of resitution will be used for the impulse calculation
    let impulse = this.handle_collisions(ball, ball_x, ball_y);

    // Update velocity
    // v(t + dt) = (M(t + dt) / mass) + impulse velocity
    let new_vel = new THREE.Vector2(new_mntm.x, new_mntm.y).divideScalar(ball.mass).add(impulse);
    ball.vel = new_vel;
  }

  play() {
    this.isPlaying = true;
  }

  pause() {
    this.isPlaying = false;
  }




  /** Mathy / sim stuff */
  calculate_forces(dt, mass, velocity) {
    // u * mg * normalized velocity
    // Don't use dt here because its not necessary just yet, will be used down the line
    if(velocity.length() <= 0.0) {
      return new THREE.Vector2(0, 0);
    }

    let umg = this.co_sliding * (mass * 9.81);
    return new THREE.Vector2(-velocity.x, -velocity.y).normalize().multiplyScalar(umg); // Double check - Maybe 1 or 0? 
  }

  handle_collisions(ball, prev_x, prev_y) {
    // Handle rectangle-ball collisions
    let border_impulse = this.handle_border_collisions(ball, prev_x, prev_y);
    
    // Handle ball-ball collisions
    let ball_impulse = this.handle_ball_collisions(ball);

    return border_impulse.add(ball_impulse);
  }

  handle_border_collisions(ball, prev_x, prev_y) {
    // The ball is essentially just within four planes, so we can 
    //   just use the radius from the center of the sphere.

    // Get the table parameters
    let t_x = this.table.position.x, t_y = this.table.position.y, t_w2 = this.table.geometry.parameters.width / 2.0, t_h2 = this.table.geometry.parameters.height / 2.0;

    // Ball parameters
    let b_x = ball.mesh.position.x, b_y = ball.mesh.position.y, b_r = ball.mesh.geometry.boundingSphere.radius;

    let return_impulse = new THREE.Vector2(0,0);

    //// Check the sphere against the four planes
    // Top: y + h/2
    if( (b_y + b_r) >= t_y + t_h2 ) {

      // First, let's just set the y-position to ensure that the ball isn't clipping
      let current_y = ball.mesh.position.y;
      ball.mesh.position.y = t_y + t_h2 - b_r;

      // Now lets interpolate
      let u = this.lerp_find_u(current_y, prev_y, ball.mesh.position.y);

      // Use that to update the x-value
      let current_x = ball.mesh.position.x;
      ball.mesh.position.x = this.lerp(current_x, prev_x, u);
      
      // Calculate impulse
      // let impl = this.cushion_impulse(ball.mass, ball.vel, new THREE.Vector2(-1, 0));
      // return_impulse.y += impl.y;
      // return_impulse.x += impl.x;

      return_impulse.y = (ball.vel.y * -2.0) * this.co_restitution;
    }

    // Bottom: y - h/2
    if( (b_y - b_r) <= t_y - t_h2 ) {

      // First, let's just set the y-position to ensure that the ball isn't clipping
      let current_y = ball.mesh.position.y;
      ball.mesh.position.y = t_y - t_h2 + b_r;

      // Now lets interpolate
      let u = this.lerp_find_u(current_y, prev_y, ball.mesh.position.y);

      // Use that to update the x-value
      let current_x = ball.mesh.position.x;
      ball.mesh.position.x = this.lerp(current_x, prev_x, u);
      
      // Calculate impulse
      // let impl = this.cushion_impulse(ball.mass, ball.vel, new THREE.Vector2(1, 0));
      // return_impulse.y += impl.y;
      // return_impulse.x += impl.x;

      return_impulse.y = (ball.vel.y * -2.0) * this.co_restitution;

    }

    // Right: x + w/2
    if( (b_x + b_r) >= t_x + t_w2 ) {

      // First, let's just set the x-position to ensure that the ball isn't clipping
      let current_x = ball.mesh.position.x;
      ball.mesh.position.x = t_x + t_w2 - b_r;

      // Now lets interpolate
      let u = this.lerp_find_u(current_x, prev_x, ball.mesh.position.x);

      // Use that to update the y-value
      let current_y = ball.mesh.position.y;
      ball.mesh.position.y = this.lerp(current_y, prev_y, u);
      
      // Calculate impulse
      // let impl = this.cushion_impulse(ball.mass, ball.vel, new THREE.Vector2(0, -1));
      // return_impulse.y += impl.y;
      // return_impulse.x += impl.x;

      return_impulse.x = (ball.vel.x * -2.0) * this.co_restitution;

    }
    
    // Left: x - w/2
    if( (b_x - b_r) <= t_x - t_w2 ) {

      // First, let's just set the x-position to ensure that the ball isn't clipping
      let current_x = ball.mesh.position.x;
      ball.mesh.position.x = t_x - t_w2 + b_r;

      // Now lets interpolate
      let u = this.lerp_find_u(current_x, prev_x, ball.mesh.position.x);

      // Use that to update the y-value
      let current_y = ball.mesh.position.y;
      ball.mesh.position.y = this.lerp(current_y, prev_y, u);
      
      // Calculate impulse
      // let impl = this.cushion_impulse(ball.mass, ball.vel, new THREE.Vector2(0, 1));
      // return_impulse.y += impl.y;
      // return_impulse.x += impl.x;

      return_impulse.x = (ball.vel.x * -2.0) * this.co_restitution;

    }

    // return new THREE.Vector2(0,0);
    return return_impulse;
    
  }

  handle_ball_collisions(ball) {
    let impulse = new THREE.Vector2(0,0);
    let b_x = ball.mesh.position.x, b_y = ball.mesh.position.y;
    let rad = ball.mesh.geometry.boundingSphere.radius;

    for(let other_b of this.balls) {
      if(other_b.id == ball.id) { continue; } 

      let oth_x = other_b.mesh.position.x, oth_y = other_b.mesh.position.y;

      // Check if the balls are close enough to collide
      let dist = Math.sqrt( Math.pow(oth_x - b_x,2) + Math.pow(oth_y - b_y, 2) );
      if(dist <= rad * 2.0) {
        console.log("Collision");
      }
    }

    return impulse;
  }

  cushion_impulse(mass, velocity, line_of_action) {
    // Just drop the 2nd mass/velocity from the equation
    // let impulse = new THREE.Vector2(-velocity.x, -velocity.y).multiplyScalar(this.co_restitution + 1).divideScalar(1.0 / mass).dot(line_of_action);
    // return 
    // return new THREE.Vector2(0,0);

    // let impulse = new THREE.Vector2(-velocity.x, -velocity.y).multiplyScalar(this.co_restitution + 1);
    // let div = impulse.divideScalar(1.0 / mass).dot(line_of_action);
    
    // console.log(impulse.x + " , " + impulse.y);
    // console.log(div.x + " , " + div.y);
    // return impulse;

    // let impulse = new THREE.Vector2(-velocity.x, -velocity.y).multiplyScalar(this.co_restitution + 1).dot(line_of_action) / (1.0 / mass);
    // // console.log(impulse.x + " , " + impulse.y);
    // console.log(impulse);


    return new THREE.Vector2(0,0);
  }

  // calc_impulse(v1, v2, normal, m1, m2) {

  // }

  lerp(x, y, u) {
    return x + (u * (y - x));
  }

  lerp_find_u(x, y, z) {
    return (z - x) / (y - x);
  }
};