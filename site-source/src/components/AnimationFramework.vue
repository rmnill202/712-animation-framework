<template>
  <div id="three-js-div" style="width: 500px; height: 500px; margin: auto;"></div>
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
    };
  },
  methods: {
    init_threejs() {
      // Get a reference to the DOM that the renderer will be added to
      const threeJsDiv = document.getElementById("three-js-div");

      // Setup the camera and scene
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(75, threeJsDiv.clientWidth / threeJsDiv.clientHeight, 0.01, 10);
      this.camera.position.z = 1;

      // Setup some simple geometry stuff
      let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      let material = new THREE.MeshNormalMaterial();

      this.mesh = new THREE.Mesh(geometry, material);

      // Add objects to the scene
      this.scene.add(this.mesh);

      // Set up the renderer
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(threeJsDiv.clientWidth, threeJsDiv.clientHeight);

      // Finally, add the renderer to the DOM
      threeJsDiv.appendChild(this.renderer.domElement);
    },
    animationLoop() {
      requestAnimationFrame(this.animationLoop);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
    }
  },
  mounted() {
    this.init_threejs();
    this.animationLoop();
  }
};
</script>

