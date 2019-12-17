import * as THREE from 'three';

export default class NoRotAnim {
  constructor(keyframeInput) {
    // Let's assume we've received a string of lines representing keyframes
    this.parseKeyframes(keyframeInput);

    // Have an initial state: we're not playing, and our timeline is at 0 seconds
    this.isPlaying = false;
    this.hasEnded = false;
    this.timeline = 0.0;
    this.frameIndex = 0;
  }

  parseKeyframes(input) {
    // Split lines - t x y z 
    let lines = input.split("\n");
    this.frames = [];

    // Go through and create frame objects
    for(let i = 0; i < lines.length; i++) {
      let ln = lines[i].split(/\s+/);
      
      this.frames.push({
          start: parseFloat(ln[0]), isEnd: (i == lines.length - 1),
          x:  parseFloat(ln[1]),  y: parseFloat(ln[2]),  z: parseFloat(ln[3]),
      });
      
    }
  }

  playing() {
    return this.isPlaying && !this.hasEnded;
  }

  restart() {
    this.isPlaying = false;
    this.timeline = 0.0;
    this.frameIndex = 0;
    this.hasEnded = false;
  }

  play() {
    if(!this.hasEnded) {
      this.isPlaying = true;
    }
  }

  pause() {
    this.isPlaying = false;
  }

  // Given the time in milliseconds, compute the next position of the object
  getFrame(dt) {
    if(this.playing()) {
      // Get the new time
      let oldTime = this.timeline;
      this.timeline += dt;

      // Determine the current frame, and calculate the new position
      let currentFrame = this.frames[this.frameIndex];
      // console.log(`Current frame ${this.frameIndex} at ${this.timeline}`);
      while( !currentFrame.isEnd && (this.timeline >= this.frames[this.frameIndex + 1].start) ) {
        currentFrame = this.frames[++this.frameIndex];
      }

      let newDetails = this.computeFrameDetails(currentFrame);

      // Determine if the animation is complete
      if(currentFrame.isEnd) {
        // If complete, this.isPlaying = false and this.hasEnded = true
        this.isPlaying = false;
        this.hasEnded = true;
        this.timeline = currentFrame.start;
      }
        

      // Return the updated position
      return newDetails;

    } 
    else {
      return { };
    }
  }

  // Calculate the rotation/position of the object at some frame and time
  computeFrameDetails(frame) {
    // Edge case - If this is the last frame, or if we're exactly at that frame reference, just return that!
    if(frame.isEnd || this.timeline == frame.start) {

      return { pos: {x: frame.x, y: frame.y, z: frame.z} };
    }
    else {
      // Translation - 
      let pos = this.translation_lerp(frame, this.frames[this.frameIndex + 1]);

      return { pos: pos };
    }
    
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
