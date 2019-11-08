import * as THREE from 'three';

export default class MocapAnimation {
  constructor(joints, frames) {
    
    // Track the input
    this.joints = joints;
    this.frames = frames;

    // Have an initial state: we're not playing, and our timeline is at 0 seconds
    this.isPlaying = false;
    this.hasEnded = false;
    this.timeline = 0.0;
    this.frameIndex = 0;

    // Update the meshes to their default positions/orientations
    this.updateMeshes(this.frames[0]);
  }

  playing() {
    return this.isPlaying && !this.hasEnded;
  }

  restart() {
    this.isPlaying = false;
    this.timeline = 0.0;
    this.frameIndex = 0;
    this.hasEnded = false;
    this.updateMeshes(this.frames[0]);
  }

  play() {
    if(!this.hasEnded) {
      this.isPlaying = true;
    }
  }

  pause() {
    this.isPlaying = false;
  }

  // Given the time in milliseconds, update the mocap figure
  getFrame(dt) {
    if(this.playing()) {
      // Get the new time
      let oldTime = this.timeline;
      this.timeline += dt;

      // Determine the current frame, and calculate the new position/rotation
      let currentFrame = this.frames[this.frameIndex];
      while( !currentFrame.isEnd && (this.timeline >= this.frames[this.frameIndex + 1].start) ) {
        currentFrame = this.frames[++this.frameIndex];
      }

      this.updateMeshes(currentFrame);
      //   console.log(`${this.timeline} on frame ${this.frameIndex} and ${this.frames[this.frameIndex + 1].start} vs ${this.frames[this.frameIndex].start}`);
      // console.log(`${this.timeline} on frame ${this.frameIndex}`);

      // Determine if the animation is complete
      if(currentFrame.isEnd) {
        // If complete, this.isPlaying = false and this.hasEnded = true
        this.isPlaying = false;
        this.hasEnded = true;
        this.timeline = currentFrame.start;
      }

    } 
  }

  // Calculate the rotation/position of the object at some frame and time
  updateMeshes(frame) {
    // Go through each joint and apply the matrix from the frame
    for(let i = 0; i < this.joints.length; i++) {
      let j = this.joints[i];
      let mesh = this.joints[i].mesh_joint;

      

      // j.mesh_joint.geometry.applyMatrix(frame.data[i]);
      // console.log(frame.data[i]);
      // j.mesh_joint.applyMatrix(frame.data[i]);

      // Decompose the matrix into position/rotation components
      let pos = new THREE.Vector3(), rot = new THREE.Quaternion(), scl = new THREE.Vector3();
      frame.data[i].decompose(pos, rot, scl);

      // Apply to the mesh
      // mesh.position.x = pos.x;
      // mesh.position.y = pos.y;
      // mesh.position.z = pos.z;

      // mesh.rotation.x = rot.x;

      // Update position
      mesh.position.x = pos.x || 0;
      mesh.position.y = pos.y || 0;
      mesh.position.z = pos.z || 0;
      mesh.setRotationFromQuaternion(rot);

      // Update the joint mesh as well


      if(j.mesh_segment) {
        let parent_mesh = this.joints[j.parent].mesh_joint;
        // console.log(j.mesh_segment);
        j.mesh_segment.geometry.vertices[0].x = pos.x;
        j.mesh_segment.geometry.vertices[0].y = pos.y;
        j.mesh_segment.geometry.vertices[0].z = pos.z;
        j.mesh_segment.geometry.vertices[1].x = parent_mesh.position.x;
        j.mesh_segment.geometry.vertices[1].y = parent_mesh.position.y;
        j.mesh_segment.geometry.vertices[1].z = parent_mesh.position.z;
        j.mesh_segment.geometry.verticesNeedUpdate = true;
      }
      
    }

    // let parent_matrices = {};
    // let parent_rotations = {};

    // // Update each joint
    // for(let i = 0; i < this.joints.length; i++) {
    //   // OOO - Parent Matrix * Parent Rotation * Frame Position * Offset
      
    //   let joint = this.joints[i];
    //   let parent_joint = joint.parent == -1 ? null : this.joints[joint.parent];

    //   // let p_rx = (parent_joint.channels['Xrotation'] * 180.0) / Math.PI, 
    //   //     p_ry = (parent_joint.channels['Yrotation'] * 180.0) / Math.PI, 
    //   //     p_rz = (parent_joint.channels['Zrotation'] * 180.0) / Math.PI;

    //   // let parent_matrix = parent_joint ? parent_matrices[joint.parent] : null;
    //   // let parent_rotation = new THREE.Matrix4().makeRotationFromEuler(p_rx, p_ry, p_rz);

    //   let parent_matrix = parent_joint ? parent_matrices[joint.parent] : null;
    //   let parent_rotation = parent_joint ? parent_rotations[joint.parent] : null;

    //   // Get frame data


    // }
  }

//   updateMeshes(frame_1, frame_2, u) {
//       // Edge case: Last frame, just compute that one's details
//   }

  alt_slerp(frame_1, frame_2) {
    let u = this.lerp_find_u(frame_1.start, frame_2.start, this.timeline);
    let quat_1 = new THREE.Quaternion(), quat_2 = new THREE.Quaternion();
    quat_1.setFromAxisAngle( new THREE.Vector3(frame_1.xa, frame_1.ya, frame_1.za).normalize(), frame_1.thetaRad );
    quat_2.setFromAxisAngle( new THREE.Vector3(frame_2.xa, frame_2.ya, frame_2.za).normalize(), frame_2.thetaRad );

    return quat_1.slerp(quat_2, u);
  }

  rotation_slerp(frame_1, frame_2) {
    // Find the amount by which to rotate the angle
    let u = this.lerp_find_u(frame_1.start, frame_2.start, this.timeline);

    // Set up our quaternions
    let quat_1 = new THREE.Quaternion(), quat_2 = new THREE.Quaternion();
    quat_1.setFromAxisAngle( new THREE.Vector3(frame_1.xa, frame_1.ya, frame_1.za).normalize(), frame_1.thetaRad );
    quat_2.setFromAxisAngle( new THREE.Vector3(frame_2.xa, frame_2.ya, frame_2.za).normalize(), frame_2.thetaRad );
    quat_1.normalize();
    quat_2.normalize();

    // Take the dot product to find theta between the quaternions. Reverse if necessary
    let dot = quat_1.dot(quat_2);
    if(dot <= 0.0) { 
      quat_1.set(-quat_1.x, -quat_1.y, -quat_1.z, -quat_1.w);
      dot = -dot;
    }

    // Equation: q1 * ( sin(1-u * theta) / sin(theta))     +      q2 * (sin(u * theta) / sin(theta))
    
    // Find theta
    let theta = Math.acos(dot);
    let sin_theta = Math.sin(theta);

    // Calculate the left and right sides without the quaternions
    let left = Math.sin((1.0 - u) * theta) / sin_theta;
    let right = Math.sin(u * theta) / sin_theta;

    // Combine with quaternions, and return
    let q1v = new THREE.Vector4( ...quat_1.toArray());
    q1v.multiplyScalar(left);
    let q2v = new THREE.Vector4( ...quat_2.toArray());
    q2v.multiplyScalar(right);
    return new THREE.Quaternion( ...(q1v.add(q2v)).toArray() );
  }

  translation_lerp(frame_1, frame_2) {
    // Interpolate x/y/z linearly
    let u = this.lerp_find_u(frame_1.start, frame_2.start, this.timeline);

    // console.log(`${u} from ${frame_1.start}, ${frame_2.start}, ${this.timeline}`);
    return { x: this.lerp(frame_1.x, frame_2.x, u), y: this.lerp(frame_1.y, frame_2.y, u), z: this.lerp(frame_1.z, frame_2.z, u) }
  }

  lerp(x, y, u) {
    return x + (u * (y - x));
  }

  lerp_find_u(x, y, z) {
    return (z - x) / (y - x);
  }
}
