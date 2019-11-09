<template>
  <div>
    <div id="three-js-div" style="width: 1100px; height: 800px; margin: auto;"></div>
    <button @click="togglePausePlay()">{{isPaused ? "Play" : "Pause"}}</button>
    <button @click="restartAnimation()">Restart</button>
    <input type="file" @change="animFileChosen"/>
  </div>
</template>

<script>
import * as THREE from 'three';
import SceneEntity from '../SceneEntity.js';
import BvhParser from './BvhParser.js';
import MocapAnimation from './MocapAnimation.js';

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
      

      // Timeline details
      threeClock: null,
      originTime: 0,
      lastFrameTime: 0,   // Milliseconds
      endTime: 20 * 1000, // Milliseconds
      isPaused: true,
      mocap: null,
      
      // Meshes for the body
      bodyMeshes: [],

      
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
      // this.originTime = performance.now();
      // this.lastFrameTime = this.originTime;
      this.originTime = performance.now();
      this.lastFrameTime = this.originTime;
      this.threeClock = new THREE.Clock();

      // Finally, add the renderer to the DOM
      threeJsDiv.appendChild(this.renderer.domElement);
    },
    setupScene() {
      // Create a simple floor to add to our scene!
      let geometry = new THREE.BoxGeometry(3000, 1, 3000);
      let material = new THREE.MeshNormalMaterial();
      let simpleMesh = new THREE.Mesh(geometry, material);
      simpleMesh.position.y = -100;
      
      this.scene.add(simpleMesh);
      // this.scene.add(new THREE.GridHelper( 400, 10 ));
    },
    updateScene(dt) {
      // Update... stuff?
      if(this.mocap) {
        this.mocap.getFrame(dt);
      }
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
    animFileChosen(evnt) {
      let anim_file = evnt.target.files[0];
      let file_reader = new FileReader();

      file_reader.readAsText(anim_file);
      file_reader.onload = result => this.parseBvhFile(result.target.result);
        
    },
    parseBvhFile(fileString) {
      // console.log("Attempting to parse...");
      let parsed = BvhParser.parseBVH(fileString);

      // Cleanup the existing scene
      for(let m of this.bodyMeshes) {
        this.scene.remove(m);
        m.geometry.dispose();
        m.material.dispose();
      }
      this.bodyMeshes = [];

      // Now that we've parsed the BVH, we're going to prep meshes that'll be updated by the animation
      let joints = parsed.skeleton;

      for(let i = 0; i < joints.length; i++) {
        // Add a joint mesh (Cube)
        let joint_mesh = new THREE.Mesh(new THREE.BoxGeometry(5,5,5), new THREE.MeshNormalMaterial());
        joints[i].mesh_joint = joint_mesh;
        this.bodyMeshes.push(joint_mesh);

        // If this joint connects to a parent, add in a Line as well
        if(joints[i].parent != -1) {
          let line_geom = new THREE.Geometry();
          line_geom.vertices.push( 
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(1,1,1)
          );
          let line_mesh = new THREE.Line(line_geom, new THREE.LineBasicMaterial({ color: 0x0000ff }));
          joints[i].mesh_segment = line_mesh;
          this.bodyMeshes.push(line_mesh);
        }
      }

      // Create the animation, initializing the meshes to their proper positions/orientations
      this.mocap = new MocapAnimation(joints, parsed.frames);

      // Add the meshes into the scene now!
      for(let mesh of this.bodyMeshes) {
        // console.log(mesh.geometry);
        this.scene.add(mesh);
      }

    },
    restartAnimation() {
      if(this.mocap) {
        this.mocap.restart();
        this.isPaused = true;
      }
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
