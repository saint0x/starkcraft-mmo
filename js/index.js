// Import Three.js and required modules
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from 'cannon-es';

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
    
    // Initialize Three.js
    this.scene = new THREE.Scene();
    
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      2000
    );
    this.camera.position.set(0, 2, 5); // Move camera back and up
    this.camera.lookAt(0, 1, 0);
    
    // Setup renderer with advanced features
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
    this.renderer.setClearColor(0x87CEEB); // Sky blue background
    
    document.body.appendChild(this.renderer.domElement);
    
    // Setup professional lighting
    this.setupLighting();
    
    // Setup ground
    this.setupGround();
    
    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0); // Look at character's center
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.update();
    
    // Setup physics
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });
    
    // Add ground physics
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to match visual ground
    this.world.addBody(groundBody);
    
    // Character physics setup
    this.characterBody = null;
    
    // Animation system
    this.mixer = null;
    this.animations = {};
    this.currentAnimation = 'idle';
    this.currentAction = null;
    
    // Movement state
    this.movement = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      running: false
    };
    
    // Create loading screen
    this.loadingScreen = document.getElementById('loading');
    
    // Setup loading manager
    this.setupLoadingManager();
    
    // Start loading assets
    this.loadAssets();
    
    // Start animation loop
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // Setup controls
    this.setupControls();
  }
  
  setupLoadingManager() {
    DEBUG.log('Game', 'setupLoadingManager', 'Setting up loading manager');
    
    // Create loading manager
    this.loadingManager = new THREE.LoadingManager();
    
    this.loadingManager.onLoad = () => {
      DEBUG.log('Game', 'onLoad', 'All assets loaded');
      if (this.loadingScreen) {
        this.loadingScreen.style.display = 'none';
      }
    };
    
    this.loadingManager.onProgress = (url, loaded, total) => {
      DEBUG.log('Game', 'onProgress', {
        url,
        loaded,
        total,
        percentage: Math.round(loaded / total * 100)
      });
      if (this.loadingScreen) {
        this.loadingScreen.textContent = `Loading: ${Math.round(loaded / total * 100)}%`;
      }
    };
    
    this.loadingManager.onError = (url) => {
      DEBUG.log('Game', 'onError', {
        url,
        error: 'Failed to load resource'
      });
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
    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3a8c3a,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
  
  loadAssets() {
    DEBUG.log('Game', 'loadAssets', 'Starting asset loading...');
    const loader = new FBXLoader(this.loadingManager);
    
    // Define asset paths with correct structure
    const paths = {
      character: '/fox-character-copy/animations/sword-and-shield-pack/isfoxbool.fbx',
      animations: {
        base: '/fox-character-copy/animations/sword-and-shield-pack'
      },
      weapons: '/fox-character-copy/weapons/Double_Sword_1.fbx'
    };
    
    DEBUG.log('Game', 'paths', paths);
    
    // Add debug sphere first to ensure it's visible
    const debugSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.scene.add(debugSphere);

    // Add axes helper
    const axes = new THREE.AxesHelper(5);
    this.scene.add(axes);
    
    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(gridHelper);
    
    // Load character model with enhanced error handling
    console.log('Attempting to load character from:', paths.character);
    
    try {
      loader.load(
        paths.character,
        (fbx) => {
          console.log('Character loaded successfully:', fbx);
          DEBUG.log('Game', 'character-loaded', {
            success: true,
            modelName: fbx.name,
            geometryCount: fbx.children.length
          });
          
          // Setup character
          this.character = fbx;
          this.character.scale.setScalar(0.01);
          this.character.position.set(0, 0, 0);
          
          // Rotate to face camera
          this.character.rotation.y = Math.PI;
          
          // Enhanced debug logging
          console.log('==== Character Full Structure ====');
          let hasSkeleton = false;
          let hasSkinnedMesh = false;
          
          this.character.traverse(child => {
            console.log('Object:', {
              name: child.name,
              type: child.type,
              uuid: child.uuid,
              isBone: child.isBone,
              isMesh: child.isMesh,
              isSkinnedMesh: child.isSkinnedMesh,
              parent: child.parent ? child.parent.name : 'none',
              geometry: child.geometry ? {
                type: child.geometry.type,
                vertexCount: child.geometry.attributes?.position?.count,
                hasSkinning: child.geometry.attributes?.skinIndex !== undefined,
                hasSkinWeights: child.geometry.attributes?.skinWeight !== undefined
              } : null,
              material: child.material ? {
                type: child.material.type,
                skinning: child.material.skinning
              } : null
            });
            
            if (child.isBone) hasSkeleton = true;
            if (child.isSkinnedMesh) hasSkinnedMesh = true;
          });
          
          console.log('Character Summary:', {
            hasSkeleton,
            hasSkinnedMesh,
            totalObjects: this.character.children.length
          });
          console.log('=======================');

          // Make character visible with proper materials
          this.character.traverse(child => {
            if (child.isMesh) {
              // Keep original materials but ensure skinning works
              if (!child.material.skinning) {
                const originalMaterial = child.material;
                child.material = new THREE.MeshStandardMaterial({
                  map: originalMaterial.map,
                  normalMap: originalMaterial.normalMap,
                  roughnessMap: originalMaterial.roughnessMap,
                  metalnessMap: originalMaterial.metalnessMap,
                  skinning: true
                });
              }
              
              // Enable shadows
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Force mesh to be visible
              child.visible = true;
              child.frustumCulled = false;
              
              // Log mesh info
              console.log('Mesh details:', {
                name: child.name,
                materialType: child.material.type,
                hasTexture: !!child.material.map,
                hasNormalMap: !!child.material.normalMap
              });
            }
          });

          // Add character to scene BEFORE adding helpers
          this.scene.add(this.character);

          // Setup character physics
          this.setupCharacterPhysics();

          // Add bounding box helper
          const bbox = new THREE.BoxHelper(this.character, 0xff0000);
          this.scene.add(bbox);

          // Add skeleton helper if there are bones
          const bones = [];
          this.character.traverse(object => {
            if (object.isBone) bones.push(object);
          });
          if (bones.length > 0) {
            const skeletonHelper = new THREE.SkeletonHelper(this.character);
            skeletonHelper.material.linewidth = 3; // Make bones more visible
            this.scene.add(skeletonHelper);
          }

          // Update character transform
          this.character.scale.setScalar(1.0); // Much larger scale (20x previous size)
          this.character.position.set(0, 0, 0);
          this.character.rotation.y = Math.PI;
          this.character.updateMatrixWorld(true); // Force update transforms

          // Move debug sphere to feet level for reference
          debugSphere.position.set(0, 0, 0);

          // Log scene hierarchy
          DEBUG.log('Game', 'scene-hierarchy', {
            sceneChildren: this.scene.children.length,
            characterInScene: this.scene.children.includes(this.character),
            characterChildren: this.character.children.length,
            characterPosition: this.character.position.toArray(),
            characterScale: this.character.scale.toArray(),
            characterRotation: this.character.rotation.toArray()
          });

          // Log camera setup
          DEBUG.log('Game', 'camera-setup', {
            position: this.camera.position.toArray(),
            rotation: this.camera.rotation.toArray(),
            fov: this.camera.fov,
            aspect: this.camera.aspect,
            near: this.camera.near,
            far: this.camera.far
          });

          // Log renderer setup
          DEBUG.log('Game', 'renderer-setup', {
            size: {
              width: this.renderer.domElement.width,
              height: this.renderer.domElement.height
            },
            pixelRatio: this.renderer.getPixelRatio(),
            shadowsEnabled: this.renderer.shadowMap.enabled,
            shadowType: this.renderer.shadowMap.type,
            outputEncoding: this.renderer.outputEncoding,
            toneMapping: this.renderer.toneMapping
          });

          // Setup animation mixer
          this.mixer = new THREE.AnimationMixer(this.character);
          
          // Load weapon and animations
          this.loadWeapon(loader, paths.weapons);
          this.loadAnimations(loader, paths.animations.base);
          
          // Add keyboard controls for animations
          document.addEventListener('keydown', (event) => {
            switch(event.key) {
              case ' ':  // Space for attack
                if (this.animations.attack) {
                  this.animations.attack.reset().play();
                }
                break;
              case 'w':  // W for walk
                if (this.animations.walk) {
                  this.animations.walk.reset().play().setLoop(THREE.LoopRepeat);
                }
                break;
              case 'r':  // R for run
                if (this.animations.run) {
                  this.animations.run.reset().play().setLoop(THREE.LoopRepeat);
                }
                break;
              case 's':  // S for slash
                if (this.animations.slash) {
                  this.animations.slash.reset().play();
                }
                break;
              case 'i':  // I for idle
                if (this.animations.idle) {
                  this.animations.idle.reset().play().setLoop(THREE.LoopRepeat);
                }
                break;
            }
          });
        },
        (progress) => {
          DEBUG.log('Game', 'character-progress', {
            loaded: progress.loaded,
            total: progress.total,
            percentage: (progress.loaded / progress.total * 100).toFixed(2)
          });
        },
        (error) => {
          DEBUG.log('Game', 'character-error', {
            error: error.message || error,
            type: error.type,
            stack: error.stack
          });
        }
      );
    } catch (error) {
      console.error('Error loading character:', error);
    }
  }
  
  loadWeapon(loader, weaponPath) {
    DEBUG.log('Game', 'loadWeapon', { weaponPath });
    
    loader.load(
      weaponPath,
      (weapon) => {
        DEBUG.log('Game', 'weapon-loaded', {
          success: true,
          name: weapon.name
        });
        this.weapon = weapon;
        weapon.scale.setScalar(0.01);
        
        // Enhance weapon materials
        weapon.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.material.roughness = 0.4;
            child.material.metalness = 0.8;
          }
        });
        
        // Attach weapon to character's hand if character is loaded
        if (this.character) {
          const handBone = this.character.getObjectByName('mixamorigRightHand');
          if (handBone) {
            handBone.add(weapon);
            weapon.position.set(0, 0, 0);
            weapon.rotation.set(0, 0, 0);
          }
        }
      },
      (progress) => {
        DEBUG.log('Game', 'weapon-progress', {
          loaded: progress.loaded,
          total: progress.total,
          percentage: (progress.loaded / progress.total * 100).toFixed(2)
        });
      },
      (error) => {
        DEBUG.log('Game', 'weapon-error', {
          error: error.message || error,
          type: error.type,
          stack: error.stack
        });
      }
    );
  }
  
  loadAnimations(loader, animationsPath) {
    DEBUG.log('Game', 'loadAnimations', { basePath: animationsPath });
    
    const animations = [
      { name: 'idle', file: '/idle.fbx' },
      { name: 'walk', file: '/walk.fbx' },
      { name: 'run', file: '/run.fbx' },
      { name: 'attack', file: '/attack.fbx' },
      { name: 'slash', file: '/slash.fbx' }
    ];

    // Create bone map for retargeting
    const boneMap = {};
    if (this.character) {
      console.log('Creating bone map for retargeting...');
      this.character.traverse(child => {
        if (child.isBone) {
          console.log('Found bone:', child.name);
          boneMap[child.name] = child.name;
          const cleanName = child.name.toLowerCase().replace(/^(mixamorig)?/, '');
          boneMap[`mixamorig${cleanName}`] = child.name;
        }
      });
    }
    
    // Load all animations
    animations.forEach(animation => {
      const fullPath = animationsPath + animation.file;
      
      loader.load(
        fullPath,
        (animationFbx) => {
          if (animationFbx.animations.length > 0) {
            const clip = animationFbx.animations[0];
            
            // Store the animation clip directly
            this.animations[animation.name] = clip;
            
            // Play idle animation by default
            if (animation.name === 'idle' && this.mixer) {
              this.playAnimation('idle');
            }
          }
        },
        null,
        (error) => console.error(`Error loading animation ${animation.name}:`, error)
      );
    });
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = 1/60; // Fixed time step
    
    // Update physics
    if (this.world) {
      this.world.step(delta);
      
      // Update character position from physics
      if (this.character && this.characterBody) {
        this.character.position.copy(this.characterBody.position);
        
        // Apply movement forces based on input
        const moveSpeed = this.movement.running ? 10 : 5;
        const force = new CANNON.Vec3(0, 0, 0);
        
        if (this.movement.forward) force.z -= moveSpeed;
        if (this.movement.backward) force.z += moveSpeed;
        if (this.movement.left) force.x -= moveSpeed;
        if (this.movement.right) force.x += moveSpeed;
        
        // Apply force in character's facing direction
        this.characterBody.applyLocalForce(force, new CANNON.Vec3(0, 0, 0));
      }
    }
    
    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(delta);
    }
    
    // Update controls
    this.controls.update();
    
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