<template>
  <div>
    <div id="three-js-div" style="width: 500px; height: 500px; margin: auto;"></div>
    <div>Some details:</div>
    <div>Current time: {{(lastFrameTime * 0.001).toFixed(2)}}</div>
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

      if(!this.paused) {
          //// TIMELINE STUFF - Could be moved to its own method, probably!
          // Calculate delta time
          let dt = newTime - this.lastFrameTime;
          this.lastFrameTime = newTime;

          // If we need to pause
          if(this.lastFrameTime >= this.endTime) {
            this.paused = true;
          }
          ////

        // Update the scene
        this.updateScene(dt);
      }

      // Finally, render the updated scene
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init_threejs();
    this.animationLoop();
  }
};
</script>

