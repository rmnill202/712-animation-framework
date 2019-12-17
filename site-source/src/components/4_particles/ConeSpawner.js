import * as THREE from 'three';

export default class ConeSpawner {
  constructor(x, y, z, max_magnitude, inner_rad, outer_rad) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.max_magnitude = max_magnitude;
    this.inner_rad = inner_rad;
    this.outer_rad = outer_rad;
  }

  setPosition(p, diff) {
    this.x = p.x;
    this.y = p.y;
    this.z = p.z
    this.diff = diff;
  }

  // 
  randomParams() {
    // Come up with a random velocity
    // if(this.diff) {
    //     let vel = new THREE.Vector3(this.diff.x, this.diff.y, this.diff.z);
    // } else {
    //     let vel = new THREE.Vector3(this.rand(), this.rand(), this.rand());
    // }

    // Un-adjusted velocity
    let raw_velocity = this.calculate_velocity();
    //new THREE.Vector3(-this.diff.x, -this.diff.y, -this.diff.z)

    // Account for tiny tiny diffs?
    // let vel = (this.diff) 
    //     ? raw_velocity.multiplyScalar(raw_velocity.dot(   new THREE.Vector3(-this.diff.x, -this.diff.y, -this.diff.z).normalize()   ))
    //     // ? raw_velocity.multiplyScalar(  raw_velocity.dot(   new THREE.Vector3(-this.diff.x, -this.diff.y, -this.diff.z).normalize()   )).normalize().multiplyScalar(this.rand_mag())
    //     // ? raw_velocity.multiplyScalar(  raw_velocity.dot(   new THREE.Vector3(-this.diff.x, -this.diff.y, -this.diff.z).normalize()   ))
    //     // ? raw_velocity.applyAxisAngle(dupe_raw.cross(new THREE.Vector3(-this.diff.x, -this.diff.y, -this.diff.z).normalize()).normalize(), raw_velocity.dot( new THREE.Vector3(-this.diff.x, -this.diff.y, -this.diff.z).normalize() ))
    //     : new THREE.Vector3(this.rand_mag(), this.rand_mag(), this.rand_mag());


    // if(this.diff) {
    //   return raw_velocity;
    // } else {
    //   return new THREE.Vector3(this.rand_mag(), this.rand_mag(), this.rand_mag());
    // }

    // let vel = (this.diff) ? raw_velocity : new THREE.Vector3(this.rand_mag(), this.rand_mag(), this.rand_mag());
    let vel = raw_velocity;

    return {
      vel: vel,
      pos: new THREE.Vector3(this.x, this.y, this.z)
    };
  }

  // Particles should be emitted in a cone-like manner
  calculate_velocity() {
    // Calculate a random magnitude
    let magnitude = this.rand_mag();

    // Calculate a random point on a normalized 2D circle
    let norm_point = this.rand_norm_point();

    // Now, interpolate that according to the inner/outer cone radius to get two points.
    //   Those two points can then be shifted to 3D using magnitude
    let inner_point = {x: norm_point.x * this.inner_rad, 
                       y: norm_point.y * this.inner_rad};

    let outer_point = {x: norm_point.x * this.outer_rad, 
                       y: norm_point.y * this.outer_rad};

    let inner_pt = new THREE.Vector3(inner_point.x, inner_point.y, 0.0);
    let outer_pt = new THREE.Vector3(outer_point.x, outer_point.y, magnitude);
    // let inner_pt = new THREE.Vector3(inner_point.x, 0.0, inner_point.y);
    // let outer_pt = new THREE.Vector3(outer_point.x, magnitude, outer_point.y);

    // We have our two points, but they need to be aligned with the normal vector of our movements
    // let n = new THREE.Vector3(1,0,0);
    // let p = this.diff ? new THREE.Vector3(-this.diff.x, -this.diff.y, -this.diff.z).normalize() : new THREE.Vector3(1,0,0);

    // let axis = new THREE.Vector3(p.x, p.y, p.z).cross(n);
    // let angle = p.dot(n);

    // let rotMat = new THREE.Matrix4().makeRotationAxis(axis, angle);

    // outer_pt.applyMatrix4(rotMat);
    // inner_pt.applyMatrix4(rotMat);



    // let p = this.diff ? new THREE.Vector3(-this.diff.x, -this.diff.y, -this.diff.z).normalize() : new THREE.Vector3(0,0,1);
    // let rotMat = new THREE.Matrix4().makeRotationAxis(p, new THREE.Vector3(0.1, 0.1, 0.1));

    // outer_pt.applyMatrix4(rotMat);
    // inner_pt.applyMatrix4(rotMat);


    let n = new THREE.Vector3(0,0,1);
    let p = this.diff ? new THREE.Vector3(-this.diff.x, -this.diff.y, -this.diff.z).normalize() : new THREE.Vector3(0,0,1);

    let quat = new THREE.Quaternion();
    quat.setFromUnitVectors(n, p);

    let rotMat = new THREE.Matrix4();
    rotMat.makeRotationFromQuaternion(quat);

    // Get the difference to get the velocity
    let velocity = outer_pt.sub(inner_pt);


    return velocity.applyMatrix4(rotMat);
  }

  rand_default() {
    let mag = this.rand_mag();
    return this.lerp(mag, -mag, Math.random());
  }

  lerp(x, y, u) {
    return x + (u * (y - x));
  }

  rand_mag() {
    return Math.floor(Math.random() * this.max_magnitude) + 1.0;
  }

  rand_norm_point() {
    let ang = Math.random() * Math.PI * 2.0;
    let rad = Math.sqrt(Math.random()); // Sqrt for uniform distribution

    return {x: rad * Math.cos(ang), y: rad * Math.sin(ang)};
  }

};