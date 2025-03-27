// Import Three.js and required modules
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon-es';
import { CharacterController } from './controllers/CharacterController.js';
import { SceneManager } from './managers/SceneManager.js';
import { AssetManager } from './managers/AssetManager.js';
import { CAMERA } from './core/Constants.js';

// Debug logging utility
const DEBUG = {
  log: (component, action, data) => {
    console.log(`[${component}][${action}]`, data);
    if (data && typeof data === 'object') {
      console.log(`[${component}][${action}] Detailed:`, JSON.stringify(data, null, 2));
    }
  }
};

class Game {
  constructor() {
    DEBUG.log('Game', 'constructor', 'Initializing game...');
    
    this.sceneManager = new SceneManager();
    this.assetManager = new AssetManager();
    this.clock = new THREE.Clock();
    this.setupCamera();
    this.setupControls();
    this.init();
  }
  
  setupCamera() {
    const [x, y, z] = CAMERA.INITIAL_POSITION;
    this.sceneManager.camera.position.set(x, y, z);
    this.sceneManager.camera.lookAt(0, 0, 0);
  }
  
  setupControls() {
    this.controls = new OrbitControls(this.sceneManager.camera, this.sceneManager.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = CAMERA.DAMPING_FACTOR;
    this.controls.minDistance = CAMERA.MIN_DISTANCE;
    this.controls.maxDistance = CAMERA.MAX_DISTANCE;
  }
  
  async init() {
    try {
      const loader = new FBXLoader();
      const weaponPath = '../assets/weapons/Double_Sword_1.fbx';
      
      // Load weapon model
      const weapon = await loader.loadAsync(weaponPath);
      DEBUG.log('Game', 'init', 'Weapon loaded successfully');

      // Load character and animations
      const { character, animations } = await this.assetManager.loadAllAssets();
      
      this.characterController = new CharacterController(
        character,
        weapon,
        animations,
        this.sceneManager.scene
      );
      
      this.sceneManager.add(this.characterController.model);
      this.animate();
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    
    if (this.characterController) {
      this.characterController.update(delta, this.sceneManager.camera);
    }
    
    this.controls.update();
    this.sceneManager.render();
  }
  
  dispose() {
    if (this.characterController) {
      this.characterController.dispose();
    }
    this.controls.dispose();
    this.sceneManager.dispose();
  }
}

// Create loading screen
const loadingScreen = document.createElement('div');
loadingScreen.id = 'loading-screen';
loadingScreen.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const loadingText = document.createElement('h2');
loadingText.textContent = 'Loading...';
loadingText.style.color = 'white';

const progressBarContainer = document.createElement('div');
progressBarContainer.style.cssText = `
    width: 50%;
    height: 20px;
    background: #333;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 20px;
`;

const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
progressBar.style.cssText = `
    width: 0%;
    height: 100%;
    background: #4CAF50;
    transition: width 0.3s ease-in-out;
`;

progressBarContainer.appendChild(progressBar);
loadingScreen.appendChild(loadingText);
loadingScreen.appendChild(progressBarContainer);
document.body.appendChild(loadingScreen);

// Initialize game
const game = new Game();