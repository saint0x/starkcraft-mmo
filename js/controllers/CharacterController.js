import * as THREE from 'three';
import { CHARACTER, CONTROLS } from '../core/Constants.js';

export class CharacterController {
  constructor(model, weapon, animations, scene) {
    // Public properties for shader access
    this.character = model;
    this.weapon = weapon;
    this.animations = animations;
    this.scene = scene;
    
    // Private properties
    this.mixer = new THREE.AnimationMixer(this.character);
    this.currentAnimation = 'IDLE';
    
    // Movement properties
    this.moveSpeed = CHARACTER.MOVE_SPEED;
    this.rotationSpeed = CHARACTER.ROTATION_SPEED;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.moveDirection = new THREE.Vector3();
    this.isGrounded = true;
    
    // Character properties
    this.health = CHARACTER.INITIAL_HEALTH;
    
    console.log('Setting up character with FBX:', model);
    
    // Setup character
    this.setupCharacter();
    
    // Setup animations
    this.setupAnimations();
    
    // Setup keyboard controls
    this.setupControls();
  }

  setupCharacter() {
    // Scale and position character appropriately
    this.character.scale.set(CHARACTER.SCALE, CHARACTER.SCALE, CHARACTER.SCALE);
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
    this.weapon.scale.set(0.01, 0.01, 0.01);
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

  setupAnimations() {
    this.animationActions = new Map();
    
    // Convert animations Map to uppercase keys
    this.animations.forEach((animation, name) => {
      const upperName = name.toUpperCase();
      const action = this.mixer.clipAction(animation);
      this.animationActions.set(upperName, action);
      
      // Set default animation weights and other properties
      action.enabled = true;
      action.setEffectiveWeight(1);
      action.setEffectiveTimeScale(1);
      
      if (upperName === 'IDLE') {
        action.play();
      }
    });
    
    console.log('Available animations:', Array.from(this.animationActions.keys()));
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
            this.playAnimation('ATTACK', true);
            break;
          case 'f':
            this.playAnimation('BLOCK', true);
            break;
          case 'e':
            // For now this will also trigger attack since we only have one,
            // but we can add more attack animations later
            this.playAnimation('ATTACK', true);
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
    console.log('Playing animation:', name, 'Current animations:', Array.from(this.animationActions.keys()));
    
    // Don't interrupt actions in progress
    if (isAction) {
      if (this.currentAnimation === 'ATTACK' || 
        this.currentAnimation === 'BLOCK') {
        return;
      }
      
      const action = this.animationActions.get(name);
      const prevAction = this.animationActions.get(this.currentAnimation);
      
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
              this.animationActions.get('RUN')?.reset().fadeIn(0.2).play();
              this.currentAnimation = 'RUN';
            } else {
              this.animationActions.get('WALK')?.reset().fadeIn(0.2).play();
              this.currentAnimation = 'WALK';
            }
          } else {
            this.animationActions.get('IDLE')?.reset().fadeIn(0.2).play();
            this.currentAnimation = 'IDLE';
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
      if (this.currentAnimation === 'ATTACK' || 
        this.currentAnimation === 'BLOCK') {
        return;
      }
      
      // Only change animation if it's different
      if (this.currentAnimation !== name) {
        const action = this.animationActions.get(name);
        const currentAction = this.animationActions.get(this.currentAnimation);
        
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
    return this.keys['w'] || this.keys['s'] || this.keys['a'] || this.keys['d'];
  }

  update(deltaTime, camera) {
    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }

    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    // Calculate right vector
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(camera.up, cameraDirection).normalize();

    // Reset movement direction
    this.moveDirection.set(0, 0, 0);
    let isMoving = false;
    let isRunning = this.keys['shift'];

    // Forward/backward movement
    if (this.keys['w']) {
      this.moveDirection.add(cameraDirection);
      isMoving = true;
    }
    if (this.keys['s']) {
      this.moveDirection.sub(cameraDirection);
      isMoving = true;
    }

    // Left/right movement
    if (this.keys['a']) {
      this.moveDirection.sub(rightVector);
      isMoving = true;
    }
    if (this.keys['d']) {
      this.moveDirection.add(rightVector);
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

      // Play appropriate movement animation
      if (!this.isActionPlaying()) {
        this.playAnimation(isRunning ? 'RUN' : 'WALK');
      }
    } else if (!this.isActionPlaying()) {
      // Play idle animation when not moving and not performing an action
      this.playAnimation('IDLE');
    }

    // Keep character grounded
    this.character.position.y = 0;
  }

  isActionPlaying() {
    return this.currentAnimation === 'ATTACK' || this.currentAnimation === 'BLOCK';
  }

  dispose() {
    document.removeEventListener('keydown', (event) => this.onKeyDown(event));
    document.removeEventListener('keyup', (event) => this.onKeyUp(event));
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.mixer.uncacheRoot(this.character);
    }
  }
} 