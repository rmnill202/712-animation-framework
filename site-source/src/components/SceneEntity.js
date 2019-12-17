export default class SceneEntity {
  constructor(mesh) {
    this.mesh = mesh;
    this.animation = null;

    // Track the base position / rotation
    this.basePos = {x: mesh.position.x, y: mesh.position.y, z: mesh.position.z};
    this.baseRot = {x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z};
  }

  setAnimation(animation) {
    this.animation = animation;
    this.animation.play();
  }

  update(dt) {
    if(this.animation && this.animation.playing()) {
      let frame = this.animation.getFrame(dt);

      // Calculate differences
      let diffs = {x: frame.pos.x - this.mesh.position.x,
                   y: frame.pos.y - this.mesh.position.y,
                   z: frame.pos.z - this.mesh.position.z
      };

      // Update position
      this.mesh.position.x = frame.pos.x;
      this.mesh.position.y = frame.pos.y;
      this.mesh.position.z = frame.pos.z;

      // // Update rotation
      if(frame.rot) {
        this.mesh.setRotationFromQuaternion(frame.rot);
      }

      return diffs;

    }
  }
};