<template>
  <div>
    <div id="three-js-div" style="width: 500px; height: 500px; margin: auto;"></div>
    <button @click="playSim()" style="margin: 10px auto">Simulate!</button>
    <div>
      <div>Click a button, or update parameters yourself. Then click "Simulate!"</div>
      <button @click="setupBasic()" style="margin: 10px">Basic Shot</button>
      <button @click="setupFric()" style="margin: 10px">Basic Shot w/ Heavy Friction</button>
      <button @click="setupRest()" style="margin: 10px">Basic Shot w/ Heavy Coeff. Restitution</button>
    </div>
    <div>
      <div>Parameters:</div>
      <div>
        <span>Restitution: </span> <input v-model.number="co_restitution" type="number"/>
      </div>
      <div>
        <span>Sliding Friction: </span> <input v-model.number="co_static" type="number"/>
      </div>
      <div>
        <span>Shot Force (x and y): </span> <input v-model.number="initial_shot_x" type="number"/> <input v-model.number="initial_shot_y" type="number"/>
      </div>
    </div>

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
      ballMass: 170 * 15, 
      co_restitution: 0.5, co_static: 0.3,
      simulation: null,
      initial_shot_x: -90, initial_shot_y: 0,

      // Meshes for the sim
      ballPositions: [
        {x: 9, y: 0,  vel: [0,0], color: '#ffffff' },
        {x: 2, y: 0,  vel: [0,0],   color: '#4f7bdb' },
        {x: 0, y: 1,  vel: [0,0],   color: '#e36d19' },
        {x: 0, y: -1, vel: [0,0],   color: '#c41010' }
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
      // this.camera.rotateY(Math.PI);
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
        for(let i = 0; i < this.ballPositions.length; i++) {
          let pos = this.ballPositions[i];

          // Geometry and mesh
          let sphere = new THREE.Mesh(new THREE.SphereGeometry(this.ballSize, 32, 32), new THREE.MeshBasicMaterial({color: pos.color}) );
          sphere.position.x = pos.x;
          sphere.position.y = pos.y;

          // Add the mesh to the scene
          this.scene.add(sphere);

          // Track the mesh
          this.ballObjects.push({
            mesh: sphere,
            vel: i == 0 ? new THREE.Vector2(this.initial_shot_x, this.initial_shot_y) : new THREE.Vector2(... pos.vel),
            mass: this.ballMass,
          });
        }

        // Setup the pool table
        let tableMat = new THREE.Mesh(new THREE.BoxGeometry(this.tableHeight, this.tableWidth, 1), new THREE.MeshBasicMaterial({color: "#8aa891"}));
        tableMat.position.z = -2;

        let underMat = new THREE.Mesh(new THREE.BoxGeometry(this.tableHeight + 2.5, this.tableWidth + 2, 1), new THREE.MeshBasicMaterial({color: "#8aa891"}));
        underMat.position.z = -2.5;

        let topBorder = new THREE.Mesh(new THREE.BoxGeometry(this.tableHeight + 2, 1, 1), new THREE.MeshBasicMaterial({color: "#48695d"}));
        topBorder.position.y += (this.tableWidth / 2) + 0.8;

        let bottomBorder = new THREE.Mesh(new THREE.BoxGeometry(this.tableHeight + 2, 1, 1), new THREE.MeshBasicMaterial({color: "#48695d"}));
        bottomBorder.position.y -= (this.tableWidth / 2) + 0.8;

        let leftBorder = new THREE.Mesh(new THREE.BoxGeometry(1, this.tableWidth + 2.2, 1), new THREE.MeshBasicMaterial({color: "#48695d"}));
        leftBorder.position.x -= (this.tableHeight / 2) + 0.8;

        let rightBorder = new THREE.Mesh(new THREE.BoxGeometry(1, this.tableWidth + 2.2, 1), new THREE.MeshBasicMaterial({color: "#48695d"}));
        rightBorder.position.x += (this.tableHeight / 2) + 0.8;

        this.scene.add(tableMat);
        this.scene.add(underMat);
        this.table = tableMat;
        this.scene.add(topBorder);
        this.scene.add(bottomBorder);
        this.scene.add(leftBorder);
        this.scene.add(rightBorder);

        this.borderObjects.push(topBorder, bottomBorder, leftBorder, rightBorder);

    },
    updateScene(dt) {
      // Run the simulation, which itself should update the meshes
      this.simulation.updateSim(dt);
    },
    animationLoop(newTime) {
      // Hook for threejs to call this method again
      requestAnimationFrame(this.animationLoop);

      // Update the scene
      this.updateScene(this.threeClock.getDelta());

      // Finally, render the updated scene
      this.renderer.render(this.scene, this.camera);
    },
    setupSimulation() {
      this.simulation = new PhysSim(this.co_restitution, this.co_static, this.ballObjects, this.table);
    },
    playSim() {
      // Stop the existing sim
      this.simulation.isPlaying = false;

      // Reset the scene visually
      for(let i = 0; i < this.ballObjects.length; i++) {
        let bl = this.ballObjects[i];
        bl.mesh.position.x = this.ballPositions[i].x;
        bl.mesh.position.y = this.ballPositions[i].y;
        // bl.vel = new THREE.Vector2(... this.ballPositions[i].vel); 
        bl.vel = i == 0 ? new THREE.Vector2(this.initial_shot_x, this.initial_shot_y) : new THREE.Vector2(... this.ballPositions[i].vel);
      }

      this.simulation = new PhysSim(this.co_restitution, this.co_static, this.ballObjects, this.table);
      this.simulation.isPlaying = true;
    },
    setupBasic() {
      this.co_restitution = 0.5;
      this.co_static = 0.3;
    },
    setupFric() {
      this.co_restitution = 0.5;
      this.co_static = 0.95;
    },
    setupRest() {
      this.co_restitution = 0.85;
      this.co_static = 0.3;
    }
  },
  mounted() {
    this.init_threejs();
    this.animationLoop();
  }
};
</script>
