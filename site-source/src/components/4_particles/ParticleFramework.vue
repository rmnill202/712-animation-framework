<template>
  <div>
    <div id="three-js-div" style="width: 1100px; height: 800px; margin: auto;"></div>
    <button @click="loadAnimation()" style="margin: 10px auto">Reload</button>
    <div>
      Rate: <input v-model="rate"/>
    </div>
    <div>
      Cone min: <input v-model="cone_min"/>
    </div>
    <div>
      Cone max: <input v-model="cone_max"/>
    </div>
    <div>
      Max speed: <input v-model="mag"/>
    </div>
    <div>
      Lifetime: <input v-model="lifetime"/>
    </div>
    <div v-if="coloring">
      Start/end color: <input v-model="start_color"/> - <input v-model="end_color"/>
    </div>
    <div><textarea v-model="animationInput" style="width: 300px; height: 190px;"></textarea></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import ParticleSystem from './ParticleSystem.js';
import PointSpawner from './PointSpawner.js';
import ConeSpawner from './ConeSpawner.js';
import CubeParticleFactory from './CubeParticleFactory';
import SceneEntity from '../SceneEntity.js';
import NoRotAnim from './NoRotAnim.js';

export default {
  props: ['plane_collision', 'coloring'],
  data() {
    return {
      rate: 1,
      limit: 500,
      cone_min: 2,
      cone_max: this.coloring ? 2.5 : 3,
      mag: 3,
      lifetime: this.coloring ? 1 : 5,
      start_color: this.coloring ? "#fff200" : null,
      end_color: this.coloring ? "#fc7703": null,

      // Three.js Components
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      sceneObjects: [],

      // UI Stuff
      cam_controls: null,
      

      // Timeline details
      threeClock: null,
      originTime: 0,
      lastFrameTime: 0,   // Milliseconds
      endTime: 20 * 1000, // Milliseconds
      isPaused: true,
      mocap: null,

      // Particle system
      p_system: null,
      animationInput: "0.0  0.0 0.0 0.0\n1.0  40.0 0.0 0.0\n2.0  80.0 0.0 0.0\n3.0  120.0 120.0 120.0\n4.0  120.0 180.0 180.0\n5.0  180.0 180.0 180.0\n6.0  180.0 180.0 180.0\n7.0  250.0 120.0 120.0\n8.0  250.0 0.0 180.0\n9.0  250.0 10.0 180.0",
      comet: null,
      
    };
  },
  methods: {
    init_threejs() {
      // Get a reference to the DOM that the renderer will be added to
      const threeJsDiv = document.getElementById("three-js-div");

      // Setup the camera and scene
      this.scene = new THREE.Scene();

      // this.camera = new THREE.PerspectiveCamera(75, threeJsDiv.clientWidth / threeJsDiv.clientHeight, 0.01, 10);
      this.camera = new THREE.PerspectiveCamera(75, threeJsDiv.clientWidth / threeJsDiv.clientHeight, 0.01, 10000);
      this.camera.position.z = -310;
      this.camera.position.y = 150;
      this.camera.position.x = -270;
      this.camera.rotateY(Math.PI);
      this.camera.rotateY(0.9);
      this.camera.rotateX(-0.20);

      // Setup the scene
      this.setupScene();

      // Set up the renderer
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(threeJsDiv.clientWidth, threeJsDiv.clientHeight);

      // Initialize the timeline
      this.originTime = performance.now();
      this.lastFrameTime = this.originTime;
      this.threeClock = new THREE.Clock();

      // let OrbitControls = require('three-orbit-controls')(THREE);
      // this.cam_controls = new OrbitControls(this.camera);

      // Finally, add the renderer to the DOM
      threeJsDiv.appendChild(this.renderer.domElement);
    },
    setupScene() {

      if(this.plane_collision) {
        let floor_geom = new THREE.BoxGeometry(3000, 1, 3000);
        let floor_mat = new THREE.MeshBasicMaterial( {color: 0xdbbb63} );
        let floor_mesh = new THREE.Mesh(floor_geom, floor_mat);
        floor_mesh.position.y = -5;
        this.scene.add(floor_mesh);
      }
      
      // this.scene.add(simpleMesh);
      this.scene.add(new THREE.GridHelper( 400, 10 ));

      // Setup the particle system and comet
      let comet_geometry = new THREE.SphereGeometry(10, 32, 32);
      let comet_material = new THREE.MeshNormalMaterial();
      let comet_mesh = new THREE.Mesh(comet_geometry, comet_material);
      this.scene.add(comet_mesh);
      this.comet = new SceneEntity(comet_mesh);

      this.p_system = new ParticleSystem(1, new ConeSpawner(0, 0, 0, 5, 2, 3), 1, this.lifetime, new CubeParticleFactory(this.scene, 500, this.plane_collision, this.start_color, this.end_color));

      
    },
    updateScene(dt) {
      // if(this.mocap) {
      //   this.mocap.getFrame(dt);
      // }
      let diffs = this.comet.update(dt);
      this.p_system.spawner.setPosition(this.comet.mesh.position, diffs);
      this.p_system.update(dt, true);
    },
    animationLoop(newTime) {
      // Hook for threejs to call this method again
      requestAnimationFrame(this.animationLoop);

      // Update the scene
      let dt = (newTime - this.originTime);
      this.originTime = newTime;
      this.updateScene(this.threeClock.getDelta());

      // Finally, render the updated scene
      this.renderer.render(this.scene, this.camera);
    },
    loadAnimation() {
      // Create a new animation, add it to the only cube in our scene
      this.comet.setAnimation(new NoRotAnim(this.animationInput));

      // Update spawner params
      let s = this.p_system.spawner;
      this.p_system.maxLife = this.lifetime;
      s.max_magnitude = this.mag;
      s.inner_rad = this.cone_min;
      s.outer_rad = this.cone_max;

      this.p_system.factory.start_color = this.start_color;
      this.p_system.factory.end_color = this.end_color;
    },
    togglePausePlay() {
      if(this.mocap) {
        if(this.isPaused) {
          this.mocap.play();
          this.isPaused = !this.mocap.playing();
        } else {
          this.mocap.pause();
          this.isPaused = true;
        }
      }
    },
  },
  mounted() {
    this.init_threejs();
    this.animationLoop();
  }
};
</script>
