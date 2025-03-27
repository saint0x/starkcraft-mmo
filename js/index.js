// Import Three.js and required modules
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon-es';
import { CharacterController } from './CharacterController.js';

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
    
    // Create loading screen
    this.loadingScreen = document.createElement('div');
    this.loadingScreen.id = 'loadingScreen'; // Add ID for easier removal
    this.loadingScreen.style.position = 'fixed';
    this.loadingScreen.style.top = '0';
    this.loadingScreen.style.left = '0';
    this.loadingScreen.style.width = '100%';
    this.loadingScreen.style.height = '100%';
    this.loadingScreen.style.background = 'rgba(0,0,0,0.8)';
    this.loadingScreen.style.color = 'white';
    this.loadingScreen.style.display = 'flex';
    this.loadingScreen.style.justifyContent = 'center';
    this.loadingScreen.style.alignItems = 'center';
    this.loadingScreen.style.fontSize = '24px';
    this.loadingScreen.style.zIndex = '1000';
    this.loadingScreen.textContent = 'Loading...';
    document.body.appendChild(this.loadingScreen);
    
    // Initialize Three.js
    this.scene = new THREE.Scene();
    
    // Setup renderer first
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setClearColor(0x87CEEB);
    
    document.body.appendChild(this.renderer.domElement);
    
    // Now setup camera and controls after renderer is created
    this.setupCamera();
    
    // Setup lighting and ground
    this.setupLighting();
    this.setupGround();
    
    // Initialize clock for animation
    this.clock = new THREE.Clock();
    
    // Setup loading manager and start loading assets
    this.setupLoadingManager();
    this.loadAssets();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(), false);
    
    // Start animation loop
    this.animate();
  }
  
  setupLoadingManager() {
    DEBUG.log('Game', 'setupLoadingManager', 'Setting up loading manager');
    
    this.loadingManager = new THREE.LoadingManager();
    
    this.loadingManager.onLoad = () => {
      DEBUG.log('Game', 'onLoad', 'All assets loaded');
      this.removeLoadingScreen();
    };
    
    this.loadingManager.onProgress = (url, loaded, total) => {
      const percentage = Math.round(loaded / total * 100);
      if (this.loadingScreen) {
        this.loadingScreen.textContent = `${percentage}%`;
      }
    };
    
    this.loadingManager.onError = (url) => {
      DEBUG.log('Game', 'onError', `Failed to load: ${url}`);
      if (this.loadingScreen) {
        this.loadingScreen.textContent = 'Error loading assets';
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Retry';
        retryButton.style.marginLeft = '10px';
        retryButton.onclick = () => {
          this.loadAssets();
          retryButton.remove();
        };
        this.loadingScreen.appendChild(retryButton);
      }
    };
  }
  
  setupLighting() {
    // Clear any existing lights
    this.scene.traverse(child => {
      if (child.isLight) {
        this.scene.remove(child);
      }
    });

    // Ambient light for overall scene brightness
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Main directional light (sun)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    this.scene.add(mainLight);

    // Add a light helper to visualize the light
    const helper = new THREE.DirectionalLightHelper(mainLight);
    this.scene.add(helper);

    // Front fill light
    const frontFill = new THREE.DirectionalLight(0xffffff, 0.5);
    frontFill.position.set(0, 5, 10);
    this.scene.add(frontFill);

    // Back rim light
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 5, -10);
    this.scene.add(rimLight);
  }
  
  setupGround() {
    // Create a large ground plane
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3a8c3a,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    
    // Add some vertex displacement for terrain variation
    const vertices = groundGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      if (i !== 1) { // Don't modify Y of center vertices
        vertices[i + 1] = Math.random() * 0.3; // Subtle height variation
      }
    }
    groundGeometry.computeVertexNormals();
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    
    // Add grid helper for visual reference
    const gridHelper = new THREE.GridHelper(1000, 100, 0x000000, 0x000000);
    gridHelper.position.y = 0.01; // Slightly above ground to prevent z-fighting
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    
    this.scene.add(ground);
    this.scene.add(gridHelper);
  }
  
  loadAssets() {
    DEBUG.log('Game', 'loadAssets', 'Loading game assets...');
    
    // Create FBX loader
    const loader = new FBXLoader(this.loadingManager);
    
    // Load character model with relative path - using isfoxbool.fbx which has correct rigging
    const characterPath = './fox-character-copy/animations/sword-and-shield-pack/isfoxbool.fbx';
    const weaponPath = './fox-character-copy/weapons/Double_Sword_1.fbx';
    
    DEBUG.log('Game', 'loadAssets', `Loading character from: ${characterPath}`);
    
    loader.load(characterPath, (characterFBX) => {
      DEBUG.log('Game', 'loadAssets', 'Character FBX loaded successfully:', characterFBX);
      
      // Load weapon model
      loader.load(weaponPath, (weaponFBX) => {
        DEBUG.log('Game', 'loadAssets', 'Weapon FBX loaded successfully:', weaponFBX);
        
        // Initialize character controller with both character and weapon
        this.characterController = new CharacterController(
          characterFBX,
          weaponFBX, // Pass the weapon model
          this.scene,
          null, // No physics world needed
          './fox-character-copy/animations/sword-and-shield-pack/', // Animation path
          loader
        );
        
        // Remove loading screen immediately after character is initialized
        this.removeLoadingScreen();
        
        DEBUG.log('Game', 'loadAssets', 'Character controller initialized with weapon');
      });
    }, 
    // Progress callback
    (progress) => {
      const percent = Math.round(progress.loaded / progress.total * 100);
      if (this.loadingScreen) {
        this.loadingScreen.textContent = `${percent}%`;
      }
    },
    // Error callback
    (error) => {
      DEBUG.log('Game', 'loadError', `Error loading character model: ${error.message}`);
      if (this.loadingScreen) {
        this.loadingScreen.textContent = 'Error loading model';
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Retry';
        retryButton.style.marginLeft = '10px';
        retryButton.onclick = () => {
          this.loadAssets();
          retryButton.remove();
        };
        this.loadingScreen.appendChild(retryButton);
      }
    });
  }
  
  removeLoadingScreen() {
    // Try multiple methods to ensure loading screen is removed
    try {
      // Method 1: Using the stored reference
      if (this.loadingScreen) {
        if (this.loadingScreen.parentNode) {
          this.loadingScreen.parentNode.removeChild(this.loadingScreen);
        }
        this.loadingScreen = null;
      }
      
      // Method 2: Using ID as backup
      const loadingScreenById = document.getElementById('loadingScreen');
      if (loadingScreenById) {
        loadingScreenById.remove();
      }
      
      // Method 3: Force remove any potential loading screens
      document.querySelectorAll('[id="loadingScreen"]').forEach(el => el.remove());
      
      DEBUG.log('Game', 'removeLoadingScreen', 'Loading screen removed successfully');
    } catch (error) {
      DEBUG.log('Game', 'removeLoadingScreen', `Error removing loading screen: ${error.message}`);
    }
  }
  
  onWindowResize() {
    if (this.camera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    if (this.controls) {
      this.controls.update();
    }
  }
  
  setupCamera() {
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      2000
    );
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 1, 0);
    
    // Setup orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below ground
    this.controls.minDistance = 2; // Minimum zoom distance
    this.controls.maxDistance = 10; // Maximum zoom distance
    this.controls.rotateSpeed = 0.5; // Adjust rotation speed
    this.controls.zoomSpeed = 1.0; // Adjust zoom speed
    this.controls.panSpeed = 1.0; // Adjust pan speed
    this.controls.enabled = true; // Ensure controls are enabled
    this.controls.enableZoom = true; // Enable zoom
    this.controls.enableRotate = true; // Enable rotation
    this.controls.enablePan = true; // Enable panning
    this.controls.update();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    // Update character controller if it exists
    if (this.characterController) {
      this.characterController.update(deltaTime, this.camera);
      
      // Update camera target to follow character
      const characterPosition = this.characterController.character.position;
      this.controls.target.set(
        characterPosition.x,
        characterPosition.y + 1, // Offset to look at character's upper body
        characterPosition.z
      );
    }
    
    // Always update controls in animation loop
    if (this.controls) {
      this.controls.update();
    }
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  setupControls() {
    // Handle keydown
    document.addEventListener('keydown', (event) => {
      switch(event.key.toLowerCase()) {
        case 'w': this.movement.forward = true; break;
        case 's': this.movement.backward = true; break;
        case 'a': this.movement.left = true; break;
        case 'd': this.movement.right = true; break;
        case 'shift': this.movement.running = true; break;
        case ' ': this.playAnimation('attack', true); break;
        case 'e': this.playAnimation('slash', true); break;
      }
      this.updateMovementAnimation();
    });

    // Handle keyup
    document.addEventListener('keyup', (event) => {
      switch(event.key.toLowerCase()) {
        case 'w': this.movement.forward = false; break;
        case 's': this.movement.backward = false; break;
        case 'a': this.movement.left = false; break;
        case 'd': this.movement.right = false; break;
        case 'shift': this.movement.running = false; break;
      }
      this.updateMovementAnimation();
    });
  }

  updateMovementAnimation() {
    const isMoving = this.movement.forward || this.movement.backward || 
                    this.movement.left || this.movement.right;
    
    if (isMoving) {
      this.playAnimation(this.movement.running ? 'run' : 'walk');
    } else {
      this.playAnimation('idle');
    }
  }

  playAnimation(name, oneTime = false) {
    if (!this.mixer || !this.animations[name]) {
      console.warn(`Cannot play animation ${name}`);
      return;
    }

    // If we're already playing this animation, don't restart it
    if (this.currentAnimation === name && this.currentAction) {
      return;
    }

    const action = this.mixer.clipAction(this.animations[name]);

    // Stop current animation
    if (this.currentAction) {
      const oldAction = this.currentAction;
      oldAction.fadeOut(0.2);
    }

    // Play new animation
    this.currentAnimation = name;
    this.currentAction = action;
    
    if (oneTime) {
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.reset().fadeIn(0.2).play();
      
      // Reset to idle when one-time animation finishes
      action.finished.then(() => {
        this.playAnimation('idle');
      });
    } else {
      action.setLoop(THREE.LoopRepeat);
      action.reset().fadeIn(0.2).play();
    }
  }

  setupCharacterPhysics() {
    if (!this.character) return;
    
    // Create character collision shape (simple capsule)
    const radius = 0.3;
    const height = 1.8;
    const shape = new CANNON.Cylinder(radius, radius, height, 8);
    
    // Create character physics body
    this.characterBody = new CANNON.Body({
      mass: 80, // 80kg
      shape: shape,
      position: new CANNON.Vec3(0, height/2, 0),
      fixedRotation: true, // Prevent character from falling over
      linearDamping: 0.9, // Add some drag
    });
    
    // Add character to physics world
    this.world.addBody(this.characterBody);
    
    // Link character mesh to physics body
    this.character.position.copy(this.characterBody.position);
  }
}

// Single initialization point
window.addEventListener('DOMContentLoaded', () => {
  DEBUG.log('Main', 'init', 'Starting game initialization');
  new Game();
});