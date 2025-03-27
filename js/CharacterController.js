import * as THREE from 'three';

export class CharacterController {
  constructor(
    characterFBX,
    weaponFBX,
    scene,
    world,
    animationsPath,
    loader
  ) {
    // Public properties for shader access
    this.character = characterFBX;
    this.weapon = weaponFBX;
    
    // Private properties
    this.mixer = null;
    this.animations = new Map();
    this.currentAnimation = 'idle';
    this.scene = scene;
    
    // Animation clip names and their file paths
    this.animationPaths = {
      'idle': 'idle.fbx',
      'walk': 'walk.fbx',
      'run': 'run.fbx',
      'attack': 'attack.fbx',
      'block': 'block.fbx',
      'death': 'death.fbx'
    };
    
    // Movement properties
    this.moveSpeed = 5;
    this.rotationSpeed = 5;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.moveDirection = new THREE.Vector3();
    this.isGrounded = true;
    
    // Character properties
    this.health = 100;
    
    console.log('Setting up character with FBX:', characterFBX);
    
    // Setup character
    this.setupCharacter();
    
    // Setup animations
    this.mixer = new THREE.AnimationMixer(this.character);
    this.loadAnimations(animationsPath, loader);
    
    // Setup keyboard controls
    this.setupControls();
  }
  
  setupCharacter() {
    // Scale and position character appropriately
    this.character.scale.set(4, 4, 4);
    this.character.position.set(0, 0, 0);
    
    // Log the character hierarchy to debug bone structure
    console.log('Character hierarchy:');
    this.character.traverse((child) => {
      console.log(child.name, child.type);
      if (child.isBone) {
        console.log('Found bone:', child.name);
      }
    });
    
    // Ensure character casts and receives shadows
    this.character.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance materials for better rendering
        if (child.material) {
          const materials = Array.isArray(child.material) 
            ? child.material 
            : [child.material];
          
          materials.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.roughness = 0.7;
              material.metalness = 0.3;
              material.envMapIntensity = 1.0;
            }
          });
        }
      }
    });
    
    // Add character to scene
    this.scene.add(this.character);
    console.log('Character added to scene with scale:', this.character.scale.x);
    
    // Only attach weapon if it exists
    if (this.weapon) {
    this.attachWeapon();
    }
  }
  
  attachWeapon() {
    // Scale and adjust weapon - maintain original proportion (0.01) with 4x larger character
    this.weapon.scale.set(0.01, 0.01, 0.01); // Keep original scale since weapon should stay same size relative to character
    this.weapon.rotateY(Math.PI / 2);
    
    // Find hand bone to attach the weapon
    let handBone = null;
    
    this.character.traverse((child) => {
      // Look for the right hand bone in the character's skeleton
      if (child.name.toLowerCase().includes('hand') && 
          child.name.toLowerCase().includes('right')) {
        handBone = child;
      }
    });
    
    // Attach weapon to hand if found
    if (handBone) {
      handBone.add(this.weapon);
      
      // Set weapon material properties
      this.weapon.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          
          if (child.material) {
            // Convert to array if it's a single material
            const materials = Array.isArray(child.material) 
              ? child.material 
              : [child.material];
            
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.roughness = 0.4;
                material.metalness = 0.8;
                material.envMapIntensity = 1.5;
              }
            });
          }
        }
      });
    } else {
      console.warn('Could not find right hand bone to attach weapon');
      
      // Fallback: add weapon as child of character
      this.character.add(this.weapon);
      this.weapon.position.set(0, 3, 0);
    }
  }
  
  loadAnimations(animationsPath, loader) {
    console.log('Loading animations from files...');
    
    // Load all animations from files
    Object.entries(this.animationPaths).forEach(([name, file]) => {
      const fullPath = `${animationsPath}${file}`;
      console.log(`Loading animation from: ${fullPath}`);
      
      loader.load(fullPath, (animFBX) => {
        if (animFBX.animations && animFBX.animations.length > 0) {
          const action = this.mixer.clipAction(animFBX.animations[0]);
            this.animations.set(name, action);
          console.log(`Loaded animation: ${name}`);
            
          // Play idle animation when it's loaded
            if (name === 'idle') {
              action.play();
              this.currentAnimation = 'idle';
            }
          }
      });
    });
  }
  
  setupControls() {
    // Track key states
    this.keys = {
      'w': false,
      's': false,
      'a': false,
      'd': false,
      'shift': false,
      'capslock': false,
      'f': false,
      'e': false
    };
    
    // Add event listeners
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (this.keys.hasOwnProperty(key)) {
        this.keys[key] = true;
        
        // Handle attack animations
        switch(key) {
          case 'capslock':
            this.playAnimation('attack', true);
            break;
          case 'f':
            this.playAnimation('block', true);
            break;
          case 'e':
            // For now this will also trigger attack since we only have one,
            // but we can add more attack animations later
            this.playAnimation('attack', true);
            break;
        }
      }
    });
    
    document.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (this.keys.hasOwnProperty(key)) {
        this.keys[key] = false;
      }
    });
  }
  
  playAnimation(name, isAction = false) {
    console.log('Playing animation:', name, 'Current animations:', Array.from(this.animations.keys()));
    
    // Don't interrupt actions in progress
    if (isAction) {
      if (this.currentAnimation === 'attack' || 
          this.currentAnimation === 'block') {
        return;
      }
      
      const action = this.animations.get(name);
      const prevAction = this.animations.get(this.currentAnimation);
      
      if (action && prevAction) {
        // Start the action animation
        prevAction.fadeOut(0.2);
        action.reset().fadeIn(0.2).play();
        
        this.currentAnimation = name;
        
        // Set up to automatically return to previous state
        const returnToIdle = () => {
          action.fadeOut(0.2);
          
          // Check what we should return to
          if (this.isMoving()) {
            if (this.keys.shift) {
              this.animations.get('run')?.reset().fadeIn(0.2).play();
              this.currentAnimation = 'run';
            } else {
              this.animations.get('walk')?.reset().fadeIn(0.2).play();
              this.currentAnimation = 'walk';
            }
          } else {
            this.animations.get('idle')?.reset().fadeIn(0.2).play();
            this.currentAnimation = 'idle';
          }
          
          action.getMixer().removeEventListener('finished', returnToIdle);
        };
        
        // Make the action play once then return
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.getMixer().addEventListener('finished', returnToIdle);
      }
    } else {
      // Don't interrupt actions for movement state changes
      if (this.currentAnimation === 'attack' || 
          this.currentAnimation === 'block') {
        return;
      }
      
      // Only change animation if it's different
      if (this.currentAnimation !== name) {
        const action = this.animations.get(name);
        const currentAction = this.animations.get(this.currentAnimation);
        
        if (action && currentAction) {
          currentAction.fadeOut(0.2);
          action.reset().fadeIn(0.2).play();
          this.currentAnimation = name;
        } else {
          console.warn(`Could not find animation: ${name}`);
        }
      }
    }
  }
  
  isMoving() {
    return this.keys.w || this.keys.a || this.keys.s || this.keys.d;
  }
  
  update(deltaTime, camera) {
    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }

    // Reset movement direction
    this.moveDirection.set(0, 0, 0);
    let isMoving = false;
    let isRunning = this.keys['shift'];

    // Don't process movement if we're in an attack animation
    if (this.currentAnimation === 'attack' || this.currentAnimation === 'block') {
      return;
    }

    // Calculate movement based on camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(camera.up, cameraDirection).normalize();

    // Forward/backward movement
    if (this.keys['w']) {
      this.moveDirection.add(cameraDirection);
      isMoving = true;
    } else if (this.keys['s']) {
      this.moveDirection.sub(cameraDirection);
      isMoving = true;
    }

    // Left/right movement
    if (this.keys['a']) {
      this.moveDirection.sub(cameraRight);
      isMoving = true;
    } else if (this.keys['d']) {
      this.moveDirection.add(cameraRight);
      isMoving = true;
    }

    // Normalize movement direction and apply speed
    if (isMoving) {
      this.moveDirection.normalize();
      const speed = isRunning ? this.moveSpeed * 2 : this.moveSpeed;
      this.moveDirection.multiplyScalar(speed * deltaTime);

      // Update character position
      this.character.position.add(this.moveDirection);

      // Update character rotation to face movement direction
      const targetRotation = Math.atan2(this.moveDirection.x, this.moveDirection.z);
      const currentRotation = this.character.rotation.y;
      const rotationDiff = targetRotation - currentRotation;
      
      // Normalize rotation difference to [-PI, PI]
      const normalizedDiff = ((rotationDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
      
      // Smoothly rotate character
      this.character.rotation.y += normalizedDiff * this.rotationSpeed * deltaTime;

      // Play appropriate animation
      this.playAnimation(isRunning ? 'run' : 'walk');
    } else {
      // Play idle animation when not moving
      this.playAnimation('idle');
    }

    // Keep character grounded
    this.character.position.y = 0;
  }
} 