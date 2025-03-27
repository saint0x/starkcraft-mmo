class CharacterController {
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
    this.physicsWorld = world;
    this.physicsBody = null;
    
    // Animation clip names and their file paths
    this.animationPaths = {
      'idle': 'sword-and-shield-idle.fbx',
      'walk': 'sword-and-shield-walk.fbx',
      'run': 'sword-and-shield-run.fbx',
      'attack': 'sword-and-shield-slash.fbx',
      'block': 'sword-and-shield-block.fbx',
      'death': 'sword-and-shield-death.fbx'
    };
    
    // Character properties
    this.speed = 5;
    this.jumpForce = 10;
    this.health = 100;
    
    // Setup character
    this.setupCharacter();
    
    // Setup animations
    this.mixer = new THREE.AnimationMixer(this.character);
    this.loadAnimations(animationsPath, loader);
    
    // Setup physics
    this.physicsBody = this.setupPhysics();
    
    // Setup keyboard controls
    this.setupControls();
  }
  
  setupCharacter() {
    // Scale and position character appropriately
    this.character.scale.set(0.05, 0.05, 0.05);
    this.character.position.set(0, 0, 0);
    
    // Ensure character casts and receives shadows
    this.character.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance materials for better rendering
        if (child.material) {
          // Convert to array if it's a single material
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
    
    // Attach weapon to character's hand
    this.attachWeapon();
  }
  
  attachWeapon() {
    // Scale and adjust weapon
    this.weapon.scale.set(0.07, 0.07, 0.07);
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
    // Create a queue to load all animations
    const animationPromises = [];
    
    // Load each animation
    for (const [name, file] of Object.entries(this.animationPaths)) {
      const promise = new Promise((resolve) => {
        loader.load(`${animationsPath}${file}`, (animFBX) => {
          // Get animation from the loaded FBX
          const animation = animFBX.animations[0];
          if (animation) {
            // Create an animation action and add to our map
            const action = this.mixer.clipAction(animation);
            this.animations.set(name, action);
            
            // If this is the idle animation, play it immediately
            if (name === 'idle') {
              action.play();
              this.currentAnimation = 'idle';
            }
          }
          resolve();
        });
      });
      
      animationPromises.push(promise);
    }
    
    // When all animations are loaded
    Promise.all(animationPromises).then(() => {
      console.log('All animations loaded successfully');
    });
  }
  
  setupPhysics() {
    // Create a capsule shape for character collision
    const radius = 1;
    const height = 4;
    const capsuleShape = new CANNON.Cylinder(
      radius, 
      radius, 
      height, 
      8
    );
    
    // Create the physics body
    const body = new CANNON.Body({
      mass: 80, // kg
      position: new CANNON.Vec3(0, height / 2, 0),
      shape: capsuleShape,
      fixedRotation: true, // Prevent character from tipping over
      linearDamping: 0.9
    });
    
    // Add physics body to world
    this.physicsWorld.addBody(body);
    
    return body;
  }
  
  setupControls() {
    // Track key states
    const keys = {
      'w': false,
      'a': false,
      's': false,
      'd': false,
      ' ': false, // Space for jump
      'shift': false, // Shift for running
      'e': false // E for attack
    };
    
    // Key down event
    window.addEventListener('keydown', (event) => {
      if (keys.hasOwnProperty(event.key.toLowerCase())) {
        keys[event.key.toLowerCase()] = true;
      }
      
      if (event.key === 'Shift') {
        keys['shift'] = true;
      }
    });
    
    // Key up event
    window.addEventListener('keyup', (event) => {
      if (keys.hasOwnProperty(event.key.toLowerCase())) {
        keys[event.key.toLowerCase()] = false;
      }
      
      if (event.key === 'Shift') {
        keys['shift'] = false;
      }
      
      // Attack on key press (not held)
      if (event.key.toLowerCase() === 'e') {
        this.playAnimation('attack', true);
      }
    });
    
    // Store keys for use in update
    this.keys = keys;
  }
  
  playAnimation(name, isAction = false) {
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
        }
      }
    }
  }
  
  isMoving() {
    return this.keys.w || this.keys.a || this.keys.s || this.keys.d;
  }
  
  update(deltaTime) {
    // Update animation mixer
    this.mixer.update(deltaTime);
    
    // Get key states
    const keys = this.keys;
    
    // Handle movement
    const moveSpeed = keys.shift ? this.speed * 2 : this.speed;
    const moveVector = new CANNON.Vec3(0, 0, 0);
    
    if (keys.w) moveVector.z = -moveSpeed;
    if (keys.s) moveVector.z = moveSpeed;
    if (keys.a) moveVector.x = -moveSpeed;
    if (keys.d) moveVector.x = moveSpeed;
    
    // Update animation based on movement
    if (this.isMoving()) {
      if (keys.shift) {
        this.playAnimation('run');
      } else {
        this.playAnimation('walk');
      }
    } else if (this.currentAnimation !== 'attack' && 
               this.currentAnimation !== 'block' && 
               this.currentAnimation !== 'death') {
      this.playAnimation('idle');
    }
    
    // Apply movement to physics body
    if (moveVector.x !== 0 || moveVector.z !== 0) {
      // Normalize vector for consistent movement speed in all directions
      if (moveVector.length() > 0) {
        moveVector.normalize();
        moveVector.scale(moveSpeed, moveVector);
      }
      
      this.physicsBody.velocity.x = moveVector.x;
      this.physicsBody.velocity.z = moveVector.z;
      
      // Rotate character to face movement direction
      if (moveVector.x !== 0 || moveVector.z !== 0) {
        const angle = Math.atan2(moveVector.x, moveVector.z);
        this.character.rotation.y = angle;
      }
    } else {
      // Apply damping to stop movement
      this.physicsBody.velocity.x *= 0.9;
      this.physicsBody.velocity.z *= 0.9;
    }
    
    // Handle jumping
    if (keys[' '] && Math.abs(this.physicsBody.velocity.y) < 0.1) {
      this.physicsBody.velocity.y = this.jumpForce;
    }
    
    // Update character position from physics
    this.character.position.x = this.physicsBody.position.x;
    this.character.position.y = this.physicsBody.position.y - 2; // Offset to place feet on ground
    this.character.position.z = this.physicsBody.position.z;
  }
}

// Make CharacterController globally available
window.CharacterController = CharacterController; 