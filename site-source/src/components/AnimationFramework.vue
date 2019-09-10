<template>
  <div>
    <div id="three-js-div" style="width: 500px; height: 500px; margin: auto;"></div>
    <div>Some details:</div>
    <div>Current time: {{( (lastFrameTime) * 0.001).toFixed(2)}}</div>
    <button @click="restart()">Reset</button>
  </div>
</template>

<script>
import * as THREE from 'three';

export default {
  data() {
    return {
      // Three.js Components
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      sceneObjects: [],

      // Timeline details
      originTime: 0,
      lastFrameTime: 0,   // Milliseconds
      endTime: 20 * 1000, // Milliseconds
      isPaused: false
      
      // A three.js clock for maintaining our timeline details!
    };
  },
  methods: {
    init_threejs() {
      // Get a reference to the DOM that the renderer will be added to
      const threeJsDiv = document.getElementById("three-js-div");

      // Setup the camera and scene
      this.scene = new THREE.Scene();

      // this.camera = new THREE.PerspectiveCamera(75, threeJsDiv.clientWidth / threeJsDiv.clientHeight, 0.01, 10);
      this.camera = new THREE.PerspectiveCamera(75, threeJsDiv.clientWidth / threeJsDiv.clientHeight, 5, 1000);
      this.camera.position.z = 200;

      // Setup the scene
      this.setupScene();
                // // Setup some simple geometry stuff
                // let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
                // let material = new THREE.MeshNormalMaterial();

                // this.mesh = new THREE.Mesh(geometry, material);

                // // Add objects to the scene
                // this.scene.add(this.mesh);

      // Set up the renderer
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(threeJsDiv.clientWidth, threeJsDiv.clientHeight);

      // Initialize the timeline
      this.originTime = performance.now();
      this.lastFrameTime = this.originTime;

      // Finally, add the renderer to the DOM
      threeJsDiv.appendChild(this.renderer.domElement);
    },
    setupScene() {
      // Create a simple mesh to add to our scene!
      let geometry = new THREE.BoxGeometry(30,30,30);
      let material = new THREE.MeshNormalMaterial();
      let simpleMesh = new THREE.Mesh(geometry, material);
      // this.mesh = new THREE.Mesh(geometry, material);

      // Now, parameterize its animation
      let meshDetails = {
        'mesh': simpleMesh,
        'anim': {
          'x': 5,  // How much it changes from its base value in a given second
          'y': 5,
          'z': 0,
          'rX': 0,
          'rY': 18 * Math.PI / 180,
          'rZ': 0,
        }
      };

      // Track this mesh and its animation
      this.sceneObjects.push(meshDetails);

      // Add everything to the scene
      for(let sceneObj of this.sceneObjects) {
        this.scene.add(sceneObj.mesh);
      }
    },
    updateScene(dt) {
      // Let's also convert DT to seconds for now
      let dtInSeconds = dt * 0.001;

      // Update each object
      for(let sObj of this.sceneObjects) {
        // Update position
        // sObj.mesh.translateX(dtInSeconds * sObj.anim.x);
        // sObj.mesh.translateY(dtInSeconds * sObj.anim.y);
        // sObj.mesh.translateZ(dtInSeconds * sObj.anim.z);
        
        sObj.mesh.position.x += (dtInSeconds * sObj.anim.x) || 0;
        sObj.mesh.position.y += (dtInSeconds * sObj.anim.y) || 0;
        sObj.mesh.position.z += (dtInSeconds * sObj.anim.z) || 0;

        // Update rotation
        sObj.mesh.rotation.x += (dtInSeconds * sObj.anim.rX) || 0;
        sObj.mesh.rotation.y += (dtInSeconds * sObj.anim.rY) || 0;
        sObj.mesh.rotation.z += (dtInSeconds * sObj.anim.rZ) || 0;
      }
    },
    animationLoop(newTime) {
      // requestAnimationFrame(this.animationLoop);
      // this.mesh.rotation.x += 0.01;
      // this.mesh.rotation.y += 0.02;
      // this.renderer.render(this.scene, this.camera);

      // Hook for threejs to call this method again
      requestAnimationFrame(this.animationLoop);

      if(!this.isPaused) {
          //// TIMELINE STUFF - Could be moved to its own method, probably!
          // Calculate delta time
          let dt = (newTime - this.originTime) - this.lastFrameTime;

          // If we need to pause
          if((newTime - this.originTime) >= this.endTime) {
            this.isPaused = true;

            // Re-calculate dt such that we limit last frame time to the end of the timeline
            dt = this.endTime - this.lastFrameTime;
            this.lastFrameTime = this.endTime;
          }
          else {
            this.lastFrameTime = (newTime - this.originTime);
          }
          ////

        // Update the scene
        this.updateScene(dt);
      }

      // Finally, render the updated scene
      this.renderer.render(this.scene, this.camera);
    },
    restart() {
      // Restart the timeline
      this.originTime = performance.now();
      this.lastFrameTime = 0;
      this.isPaused = false;

      // Reset objects - Should really make this behave with any starting position / scene description
      for(let sceneObj of this.sceneObjects) {
        sceneObj.mesh.position.x = 0;
        sceneObj.mesh.position.y = 0;
        sceneObj.mesh.position.z = 0;

        sceneObj.mesh.rotation.x = 0;
        sceneObj.mesh.rotation.y = 0;
        sceneObj.mesh.rotation.z = 0;
      }
    },
  },
  mounted() {
    this.init_threejs();
    this.animationLoop();
  }
};
</script>

