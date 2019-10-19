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
      
      // The physics simulation
      // let tw = 1.298 * 10, th = 2.438 * 10, bsize = 0.057 * 10;
      tableWidth: 1.298 * 10, tableHeight: 2.438 * 10, ballSize: 0.057 * 10,
      simulation: null,
      ballPositions: [
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 2}
      ],
      ballObjects: []
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
    //   // Create a simple mesh to add to our scene!
    //   let geometry = new THREE.BoxGeometry(5,5,5);
    //   let material = new THREE.MeshNormalMaterial();
    //   let simpleMesh = new THREE.Mesh(geometry, material);

    //   // Add a simple cube to the scene
    //   let testCube = new SceneEntity(simpleMesh);
    //   this.sceneObjects.push(new SceneEntity(simpleMesh));

    //   // Add everything to the scene
    //   for(let sceneObj of this.sceneObjects) {
    //     this.scene.add(sceneObj.mesh);
    //   }

        // Represent the billiards table with some cubes
        

        // let geometry = new THREE.BoxGeometry(tw, th, 1);
        // let material = new THREE.MeshNormalMaterial();
        // let simpleMesh = new THREE.Mesh(geometry, material);

        // let sgeometry = new THREE.SphereGeometry( bsize, 32, 32 );
        // let smaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        // let sphere = new THREE.Mesh( sgeometry, smaterial );

        // this.scene.add(simpleMesh);
        // this.scene.add(sphere);

        
        
        
        // Setup for billiard balls
        for(let pos of this.ballPositions) {
          // Geometry and mesh
          let sphere = new THREE.Mesh(new THREE.SphereGeometry(this.ballSize, 32, 32), new THREE.MeshBasicMaterial({color: "#9e9383"}) );
          sphere.position.x = pos.x;
          sphere.position.y = pos.y;

          // Add the mesh to the scene
          this.scene.add(sphere);

          // Track the mesh
          this.ballObjects.push(sphere);
        }

        // Setup the pool table
        let tableMat = new THREE.Mesh(new THREE.BoxGeometry(this.tableHeight, this.tableWidth, 1), new THREE.MeshBasicMaterial({color: "#5ac46c"}));
        tableMat.position.z = -2;

        this.scene.add(tableMat);

    },
    updateScene(dt) {
      // // Let's also convert DT to seconds for now
      // let dtInSeconds = dt * 0.001;

      // Update each object
    //   for(let sObj of this.sceneObjects) {
    //     sObj.update(dt);
    //   }

      // Run the simulation
      this.simulation.updateSim(dt);

      // Update the entities
      for(let index in this.simulation.entities) {
        this.ballObjects[index].position.x = this.simulation.entities[index].x;//+= 0.005;//= this.simulation.entities[index].x;
        // console.log(this.simulation.entities[index].x);
        this.ballObjects[index].position.y += 0;//= this.simulation.entities[index].y;
      }

    },
    animationLoop(newTime) {
      // Hook for threejs to call this method again
      requestAnimationFrame(this.animationLoop);

      // Update the scene
      let dt = (newTime - this.originTime);
      this.originTime = newTime;
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
      this.simulation = new PhysSim(this.ballPositions);
    }
  },
  mounted() {
    this.setupSimulation();
    this.init_threejs();
    this.animationLoop();
  }
};
</script>
