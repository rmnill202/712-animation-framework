<template>
  <div>
    <div id="three-js-div" style="width: 500px; height: 500px; margin: auto;"></div>
    <!-- <button @click="loadAnimation()" style="margin: 10px auto">Load Animation</button>
    <div><textarea v-model="animationInput" style="width: 300px; height: 190px;"></textarea></div> -->
  </div>
</template>

<script>
import * as THREE from 'three';
import SceneEntity from '../SceneEntity.js';
import Animation from '../Animation.js';
import PhysSim from './PhysSim.js';

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
      animationInput: "",

      // Timeline details
      originTime: 0,
      lastFrameTime: 0,   // Milliseconds
      endTime: 20 * 1000, // Milliseconds
      isPaused: false,
      threeClock: null,
      
      //// The physics simulation
      // Parameters
      tableWidth: 1.298 * 15, tableHeight: 2.438 * 15, ballSize: 0.057 * 15,
      ballMass: 150, 
      co_restitution: 0.9, co_static: 0.5,
      simulation: null,

      // Meshes for the sim
      ballPositions: [
        {x: 0, y: 0, vel: [100, 20], mntm: [10,2000], id: 0 },
        {x: 1, y: 1, vel: [10, 100], mntm: [0,0], id: 1 },
        {x: 2, y: 2, vel: [-50, -10], mntm: [0,0], id: 2 }
      ],
      ballObjects: [],
      borderObjects: [],
      table: null,
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
      // this.camera.position.z = -30;
      // this.camera.rotateY(Math.PI);s
      this.camera.position.z = 30;

      // Setup the scene
      this.setupScene();

      // Then setup the simulation and pass the meshes into it
      this.setupSimulation();

      // Set up the renderer
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(threeJsDiv.clientWidth, threeJsDiv.clientHeight);

      // Initialize the timeline
      this.originTime = performance.now();
      this.lastFrameTime = this.originTime;
      this.threeClock = new THREE.Clock();

      // Finally, add the renderer to the DOM
      threeJsDiv.appendChild(this.renderer.domElement);
    },
    setupScene() {
        
        // Setup for billiard balls
        for(let pos of this.ballPositions) {
          // Geometry and mesh
          let sphere = new THREE.Mesh(new THREE.SphereGeometry(this.ballSize, 32, 32), new THREE.MeshBasicMaterial({color: "#faffd9"}) );
          sphere.position.x = pos.x;
          sphere.position.y = pos.y;

          // Add the mesh to the scene
          this.scene.add(sphere);

          // Track the mesh
          this.ballObjects.push({
            id: pos.id,
            mesh: sphere,
            vel: new THREE.Vector2(... pos.vel),
            mntm: new THREE.Vector2(... pos.mntm),
            mass: this.ballMass,
          });
        }

        // Setup the pool table
        let tableMat = new THREE.Mesh(new THREE.BoxGeometry(this.tableHeight, this.tableWidth, 1), new THREE.MeshBasicMaterial({color: "#8aa891"}));
        tableMat.position.z = -2;

        let topBorder = new THREE.Mesh(new THREE.BoxGeometry(this.tableHeight, 1, 1), new THREE.MeshBasicMaterial({color: "#48695d"}));
        topBorder.position.y += (this.tableWidth / 2);

        let bottomBorder = new THREE.Mesh(new THREE.BoxGeometry(this.tableHeight, 1, 1), new THREE.MeshBasicMaterial({color: "#48695d"}));
        bottomBorder.position.y -= (this.tableWidth / 2);

        let leftBorder = new THREE.Mesh(new THREE.BoxGeometry(1, this.tableWidth, 1), new THREE.MeshBasicMaterial({color: "#48695d"}));
        leftBorder.position.x -= (this.tableHeight / 2);

        let rightBorder = new THREE.Mesh(new THREE.BoxGeometry(1, this.tableWidth, 1), new THREE.MeshBasicMaterial({color: "#48695d"}));
        rightBorder.position.x += (this.tableHeight / 2);

        this.scene.add(tableMat);
        this.table = tableMat;
        // this.scene.add(topBorder);
        // this.scene.add(bottomBorder);
        // this.scene.add(leftBorder);
        // this.scene.add(rightBorder);

        this.borderObjects.push(topBorder, bottomBorder, leftBorder, rightBorder);

    },
    updateScene(dt) {
      // Run the simulation, which itself should update the meshes
      // console.log(dt);
      this.simulation.updateSim(dt);
    },
    animationLoop(newTime) {
      // Hook for threejs to call this method again
      requestAnimationFrame(this.animationLoop);

      // Update the scene
      // let dt = (newTime - this.originTime);
      // this.originTime = newTime;
      // if(dt >= 0 && dt <= 50) {
      //   this.updateScene(dt);
      //   // console.log(dt);
      //   // console.log(this.threeClock.getDelta());
      // }
      // console.log(dt);
      this.updateScene(this.threeClock.getDelta());

      // Finally, render the updated scene
      this.renderer.render(this.scene, this.camera);
    },
    setupSimulation() {
      this.simulation = new PhysSim(this.co_restitution, this.co_static, this.ballObjects, this.table);
    }
  },
  mounted() {
    this.init_threejs();
    this.animationLoop();
  }
};
</script>
