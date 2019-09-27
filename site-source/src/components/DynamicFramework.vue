<template>
  <div>
    <div id="three-js-div" style="width: 500px; height: 500px; margin: auto;"></div>
    <button @click="loadAnimation()" style="margin: 10px auto">Load Animation</button>
    <div><textarea v-model="animationInput" style="width: 300px; height: 190px;"></textarea></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import SceneEntity from './SceneEntity.js';
import Animation from './Animation.js';

export default {
  data() {
    return {
      // Three.js Components
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      sceneObjects: [],

      // UI Stuff
      animationInput: "0.0  0.0 0.0 0.0 1.0 1.0 -1.0 0.0\n1.0  4.0 0.0 0.0 1.0 1.0 -1.0 30.0\n2.0  8.0 0.0 0.0 1.0 1.0 -1.0 90.0\n3.0  12.0 12.0 12.0 1.0 1.0 -1.0 180.0\n4.0  12.0 18.0 18.0 1.0 1.0 -1.0 270.0\n5.0  18.0 18.0 18.0 0.0 1.0 0.0 90.0\n6.0  18.0 18.0 18.0 0.0 0.0 1.0 90.0\n7.0  25.0 12.0 12.0 1.0 0.0 0.0 0.0\n8.0  25.0 0.0 18.0 1.0 0.0 0.0 0.0\n9.0 25.0 1.0 18.0 1.0 0.0 0.0 0.0",

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
      this.camera.position.z = -30;
      this.camera.rotateY(Math.PI);

      // Setup the scene
      this.setupScene();

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
      let geometry = new THREE.BoxGeometry(5,5,5);
      let material = new THREE.MeshNormalMaterial();
      let simpleMesh = new THREE.Mesh(geometry, material);

      // Add a simple cube to the scene
      let testCube = new SceneEntity(simpleMesh);
      this.sceneObjects.push(new SceneEntity(simpleMesh));

      // Add everything to the scene
      for(let sceneObj of this.sceneObjects) {
        this.scene.add(sceneObj.mesh);
      }
    },
    updateScene(dt) {
      // // Let's also convert DT to seconds for now
      // let dtInSeconds = dt * 0.001;

      // Update each object
      for(let sObj of this.sceneObjects) {
        sObj.update(dt);
      }
    },
    animationLoop(newTime) {
      // Hook for threejs to call this method again
      requestAnimationFrame(this.animationLoop);

      // Update the scene
      let dt = (newTime - this.originTime);
      this.originTime = newTime;
      this.updateScene(dt);

      // Finally, render the updated scene
      this.renderer.render(this.scene, this.camera);
    },
    loadAnimation() {
      // Create a new animation, add it to the only cube in our scene
      this.sceneObjects[0].setAnimation(new Animation(this.animationInput));
    },
    restart() {

    },
    togglePause() {
      this.isPaused = !this.isPaused;
    }
  },
  mounted() {
    this.init_threejs();
    this.animationLoop();
  }
};
</script>
