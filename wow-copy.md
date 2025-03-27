# Building a World of Warcraft Clone with Three.js

This guide outlines the architecture, components, and techniques needed to build a World of Warcraft-style MMORPG using Three.js and modern web technologies.

## Core Architecture

### 1. Rendering Engine

The foundation of our WoW clone is Three.js, providing:

- WebGL-based 3D rendering
- Scene graph management
- Asset loading and materials
- Animation systems
- Shader support

```javascript
// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

### 2. Entity Component System

Our architecture uses an entity-component system for flexibility:

- Entities represent game objects (characters, items, etc.)
- Components provide specific behaviors
- Systems handle logic spanning multiple entities

```javascript
class Entity {
  constructor() {
    this.components = new Map();
    this.id = generateUUID();
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Quaternion();
    this.scale = new THREE.Vector3(1, 1, 1);
  }
  
  addComponent(component) {
    component.parent = this;
    this.components.set(component.name, component);
  }
  
  getComponent(name) {
    return this.components.get(name);
  }
  
  update(deltaTime) {
    for (const component of this.components.values()) {
      component.update(deltaTime);
    }
  }
}
```

### 3. Physics System

For realistic movement and collisions:

- Ammo.js (port of Bullet Physics)
- Character controllers with collision detection
- Terrain collision and physics
- Optimized for MMO scale (physics LOD)

## Character System

### 1. Character Models & Animation

Creating realistic, customizable characters:

- Modular character mesh system
- Skeletal animation with smooth blending
- Equipment attachment points
- Animation state machine

```javascript
class CharacterModel {
  constructor(baseMesh) {
    this.baseMesh = baseMesh;
    this.equipmentSlots = {
      head: null,
      shoulders: null,
      chest: null,
      hands: null,
      legs: null,
      feet: null,
      mainHand: null,
      offHand: null
    };
    
    // Setup skeleton and animations
    this.skeleton = baseMesh.skeleton;
    this.mixer = new THREE.AnimationMixer(baseMesh);
    this.animations = {};
    
    // Find key bones for equipment
    this.attachmentPoints = this.findAttachmentPoints();
  }
  
  equipItem(slot, itemMesh) {
    if (this.equipmentSlots[slot]) {
      // Remove current item
      this.attachmentPoints[slot].remove(this.equipmentSlots[slot]);
    }
    
    // Attach new item
    this.attachmentPoints[slot].add(itemMesh);
    this.equipmentSlots[slot] = itemMesh;
  }
  
  playAnimation(name, fadeTime = 0.2) {
    const anim = this.animations[name];
    if (!anim) return;
    
    // Fade out all current animations
    for (const otherAnim of Object.values(this.animations)) {
      if (otherAnim.action.isRunning()) {
        otherAnim.action.fadeOut(fadeTime);
      }
    }
    
    // Play new animation
    anim.action.reset();
    anim.action.fadeIn(fadeTime);
    anim.action.play();
  }
  
  update(deltaTime) {
    this.mixer.update(deltaTime);
  }
}
```

### 2. Character Animation Controller

Advanced animation management:

```javascript
class CharacterAnimationController {
  constructor(character) {
    this.character = character;
    this.stateMachine = new StateMachine();
    
    // Define states
    this.stateMachine.addState('idle', {
      enter: () => this.character.playAnimation('idle'),
      update: () => {
        // Check for state transitions
        if (this.character.isMoving) {
          this.stateMachine.setState('walk');
        }
      }
    });
    
    this.stateMachine.addState('walk', {
      enter: () => this.character.playAnimation('walk'),
      update: () => {
        if (!this.character.isMoving) {
          this.stateMachine.setState('idle');
        } else if (this.character.isRunning) {
          this.stateMachine.setState('run');
        }
      }
    });
    
    // Add more states: run, jump, combat, casting, etc.
    
    // Start in idle state
    this.stateMachine.setState('idle');
  }
  
  update(deltaTime) {
    this.stateMachine.update(deltaTime);
  }
}
```

### 3. Advanced Animation Features

- Upper/lower body separation for casting while moving
- Additive animations for facial expressions
- Inverse Kinematics for foot placement on terrain
- Animation retargeting for using animations across characters

```javascript
// Example of upper/lower body separation
playPartialAnimation(name, bodyPart, fadeTime = 0.2) {
  const anim = this.animations[name];
  if (!anim) return;
  
  const action = anim.action;
  
  // Set weights for specific bone groups
  if (bodyPart === 'upper') {
    // Set weight to 0 for lower body bones
    action.setEffectiveWeightForBoneGroup('leg_l', 0);
    action.setEffectiveWeightForBoneGroup('leg_r', 0);
    action.setEffectiveWeightForBoneGroup('spine_01', 1);
    // etc.
  } else if (bodyPart === 'lower') {
    // Set weight to 0 for upper body bones
    action.setEffectiveWeightForBoneGroup('arm_l', 0);
    action.setEffectiveWeightForBoneGroup('arm_r', 0);
    action.setEffectiveWeightForBoneGroup('neck', 0);
    // etc.
  }
  
  action.reset();
  action.fadeIn(fadeTime);
  action.play();
}
```

## Camera System

### 1. Third-Person Camera

Flexible camera system supporting multiple views:

```javascript
class MMOCamera {
  constructor(target) {
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.target = target;
    
    // Camera settings
    this.distance = 5; // Distance from target
    this.minDistance = 1;
    this.maxDistance = 20;
    
    this.rotationX = 0; // Vertical rotation
    this.rotationY = 0; // Horizontal rotation
    
    this.minRotationX = -Math.PI/3; // Limit looking down
    this.maxRotationX = Math.PI/3;  // Limit looking up
    
    this.smoothFactor = 0.1; // Camera smoothing
    this.mode = 'third-person'; // first-person, third-person, action-cam
    
    // Collision detection
    this.collisionLayers = [];
    this.collisionOffset = 0.5; // Distance to maintain from obstacles
  }
  
  setMode(mode) {
    this.mode = mode;
  }
  
  zoom(delta) {
    this.distance = Math.max(this.minDistance, 
                   Math.min(this.maxDistance, 
                   this.distance + delta));
  }
  
  rotate(deltaX, deltaY) {
    this.rotationY += deltaX * 0.01;
    this.rotationX += deltaY * 0.01;
    
    this.rotationX = Math.max(this.minRotationX,
                   Math.min(this.maxRotationX, 
                   this.rotationX));
  }
  
  update() {
    if (this.mode === 'first-person') {
      this.updateFirstPerson();
    } else if (this.mode === 'third-person') {
      this.updateThirdPerson();
    } else if (this.mode === 'action-cam') {
      this.updateActionCam();
    }
  }
  
  updateThirdPerson() {
    // Calculate ideal position
    const idealPosition = new THREE.Vector3();
    
    idealPosition.x = Math.sin(this.rotationY) * Math.cos(this.rotationX) * this.distance;
    idealPosition.y = Math.sin(this.rotationX) * this.distance;
    idealPosition.z = Math.cos(this.rotationY) * Math.cos(this.rotationX) * this.distance;
    
    idealPosition.add(this.target.position);
    
    // Check for collisions
    const hasCollision = this.checkCameraCollision(idealPosition);
    
    if (hasCollision) {
      this.camera.position.lerp(this.collisionAdjustedPosition, this.smoothFactor);
    } else {
      this.camera.position.lerp(idealPosition, this.smoothFactor);
    }
    
    // Look at target
    const lookTarget = this.target.position.clone();
    lookTarget.y += 1.2; // Look at upper chest/head
    this.camera.lookAt(lookTarget);
  }
  
  checkCameraCollision(position) {
    // Raycast from target to camera
    const direction = position.clone().sub(this.target.position).normalize();
    const distance = this.target.position.distanceTo(position);
    
    const raycaster = new THREE.Raycaster(
      this.target.position.clone(), 
      direction,
      0,
      distance
    );
    
    const collisions = raycaster.intersectObjects(this.collisionLayers, true);
    
    if (collisions.length > 0) {
      const collisionDistance = collisions[0].distance - this.collisionOffset;
      
      this.collisionAdjustedPosition = this.target.position.clone()
        .add(direction.multiplyScalar(collisionDistance));
        
      return true;
    }
    
    return false;
  }
}
```

## Combat System

### 1. Ability System

Flexible ability system for spells and actions:

```javascript
class AbilitySystem {
  constructor(character) {
    this.character = character;
    this.abilities = new Map();
    this.globalCooldown = 0;
    this.globalCooldownDuration = 1.5; // seconds
  }
  
  registerAbility(ability) {
    this.abilities.set(ability.id, ability);
  }
  
  useAbility(abilityId, target) {
    if (this.globalCooldown > 0) return false;
    
    const ability = this.abilities.get(abilityId);
    if (!ability) return false;
    
    if (ability.onCooldown) return false;
    
    // Check requirements (mana, range, etc)
    if (!this.checkRequirements(ability, target)) return false;
    
    // Apply costs
    this.applyCosts(ability);
    
    // Execute ability
    ability.execute(this.character, target);
    
    // Set cooldown
    ability.startCooldown();
    
    // Set global cooldown if ability triggers it
    if (ability.triggersGlobalCooldown) {
      this.globalCooldown = this.globalCooldownDuration;
    }
    
    return true;
  }
  
  update(deltaTime) {
    // Update cooldowns
    this.globalCooldown = Math.max(0, this.globalCooldown - deltaTime);
    
    for (const ability of this.abilities.values()) {
      ability.update(deltaTime);
    }
  }
}

class Ability {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.icon = config.icon;
    this.cooldownDuration = config.cooldown || 0;
    this.cooldownRemaining = 0;
    this.castTime = config.castTime || 0;
    this.triggersGlobalCooldown = config.triggersGlobalCooldown !== false;
    this.costs = config.costs || {};
    this.range = config.range || 0;
    this.animationName = config.animation || 'cast';
    this.effects = config.effects || [];
  }
  
  get onCooldown() {
    return this.cooldownRemaining > 0;
  }
  
  execute(caster, target) {
    // Start casting animation
    caster.playAnimation(this.animationName);
    
    // Apply effects
    for (const effect of this.effects) {
      effect.apply(caster, target);
    }
  }
  
  startCooldown() {
    this.cooldownRemaining = this.cooldownDuration;
  }
  
  update(deltaTime) {
    this.cooldownRemaining = Math.max(0, this.cooldownRemaining - deltaTime);
  }
}
```

### 2. Combat Mechanics

```javascript
class CombatSystem {
  constructor() {
    this.entities = new Set();
  }
  
  registerEntity(entity) {
    this.entities.add(entity);
  }
  
  calculateDamage(source, target, abilityData) {
    // Get attack power, spell power, etc.
    const attackPower = source.getComponent('Stats').getAttackPower();
    const defense = target.getComponent('Stats').getDefense();
    
    // Calculate base damage
    let damage = abilityData.baseDamage + abilityData.scaling * attackPower;
    
    // Apply defense
    damage *= (1 - (defense / (defense + 1000)));
    
    // Random variance
    damage *= 0.9 + Math.random() * 0.2;
    
    return Math.floor(damage);
  }
  
  applyDamage(source, target, abilityData) {
    const damage = this.calculateDamage(source, target, abilityData);
    const health = target.getComponent('Health');
    
    // Apply damage
    health.takeDamage(damage);
    
    // Create floating combat text
    this.createCombatText(target.position, damage);
    
    // Check for death
    if (health.current <= 0) {
      this.handleDeath(target);
    }
    
    return damage;
  }
  
  handleDeath(entity) {
    // Play death animation
    const animator = entity.getComponent('Animator');
    if (animator) {
      animator.playAnimation('death');
    }
    
    // Disable input/AI
    const controller = entity.getComponent('Controller');
    if (controller) {
      controller.disable();
    }
    
    // Start corpse timer
    setTimeout(() => {
      // Handle respawn or remove entity
    }, 60000);
  }
}
```

## Asset Requirements

### 1. Character Models

For high-quality character models like our mutant:

- **Mesh Requirements**:
  - 10K-20K polygons for main characters
  - Properly weighted to skeleton
  - UV mapped for texture application
  - Modular design (head, torso, arms, etc.)

- **Texture Requirements**:
  - Diffuse/Albedo maps (2K resolution)
  - Normal maps for surface detail
  - Roughness maps for material properties
  - Metallic maps for reflective areas
  - Optional: Emissive maps for glowing parts

- **Rigging Requirements**:
  - Full skeleton with 50-80 bones
  - Facial bones for expressions
  - Equipment attachment points
  - Properly named bones for animation retargeting

### 2. Animation Library

Each character class needs:

- **Core Animations**:
  - Idle (breathing, looking around)
  - Walk (forward, backward, strafing)
  - Run (forward, backward, strafing)
  - Jump (start, airborne, landing)
  - Combat idle (weapon ready)
  - Death and resurrection

- **Combat Animations**:
  - Basic attacks (multiple variations)
  - Spell casting (start, loop, release)
  - Special abilities (class-specific)
  - Block, parry, dodge
  - Getting hit (light, heavy)

- **Emote Animations**:
  - Sit, sleep, dance
  - Wave, point, laugh
  - Specialized emotes

### 3. Environment Assets

- **Terrain System**:
  - Height maps for large-scale terrain
  - Detail textures for close-up rendering
  - Blend maps for texture transitions

- **World Objects**:
  - Buildings and structures
  - Trees, rocks, foliage
  - Interactive elements (doors, switches)

### 4. Visual Effects

- **Spell Effects**:
  - Particle systems
  - Trail renderers
  - Shader effects (distortion, glow)

- **Environmental Effects**:
  - Weather systems (rain, snow)
  - Time of day lighting
  - Atmospheric effects (fog, dust)

## Performance Considerations

### 1. Level of Detail (LOD)

```javascript
class LODManager {
  constructor(camera) {
    this.camera = camera;
    this.entities = [];
    
    // Distance thresholds for detail levels
    this.thresholds = {
      high: 20,    // Full detail within 20 units
      medium: 50,  // Medium detail within 50 units
      low: 100,    // Low detail within 100 units
      ultraLow: 200 // Ultra low detail within 200 units
    };
  }
  
  registerEntity(entity) {
    if (entity.lodLevels) {
      this.entities.push(entity);
    }
  }
  
  update() {
    const cameraPosition = this.camera.position;
    
    for (const entity of this.entities) {
      const distance = entity.position.distanceTo(cameraPosition);
      
      if (distance <= this.thresholds.high) {
        entity.setLODLevel('high');
      } else if (distance <= this.thresholds.medium) {
        entity.setLODLevel('medium');
      } else if (distance <= this.thresholds.low) {
        entity.setLODLevel('low');
      } else if (distance <= this.thresholds.ultraLow) {
        entity.setLODLevel('ultraLow');
      } else {
        entity.setVisible(false);
      }
    }
  }
}
```

### 2. Instancing for Similar Characters

```javascript
class InstancedCharacterRenderer {
  constructor(baseMesh) {
    this.baseMesh = baseMesh;
    this.instancedMeshes = new Map();
    
    // Extract geometries and materials
    this.setupInstancing();
  }
  
  setupInstancing() {
    this.baseMesh.traverse(child => {
      if (child.isMesh) {
        const geometry = child.geometry;
        const material = child.material;
        
        // Create instanced mesh
        const instancedMesh = new THREE.InstancedMesh(
          geometry,
          material.clone(),
          100 // Max 100 instances
        );
        
        instancedMesh.count = 0;
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        
        this.instancedMeshes.set(child.name, {
          mesh: instancedMesh,
          originalMesh: child
        });
      }
    });
  }
  
  addInstance(position, rotation, scale, tint) {
    const transform = new THREE.Matrix4();
    transform.compose(position, rotation, scale);
    
    for (const [name, data] of this.instancedMeshes) {
      const index = data.mesh.count;
      
      if (index >= data.mesh.instanceMatrix.count) {
        console.warn('Instance limit reached');
        return -1;
      }
      
      data.mesh.setMatrixAt(index, transform);
      
      if (tint && data.mesh.material.userData.supportsInstancing) {
        data.mesh.setColorAt(index, tint);
      }
      
      data.mesh.count++;
      data.mesh.instanceMatrix.needsUpdate = true;
      
      if (data.mesh.instanceColor) {
        data.mesh.instanceColor.needsUpdate = true;
      }
    }
    
    return data.mesh.count - 1;
  }
}
```

## Networking & MMO Architecture

### 1. Client-Server Communication

```javascript
class NetworkManager {
  constructor() {
    this.socket = null;
    this.entities = new Map();
    this.localPlayer = null;
    this.entityFactory = null;
    this.predictedMoves = [];
    this.serverReconciliation = true;
  }
  
  connect(url) {
    this.socket = new WebSocket(url);
    
    this.socket.onopen = () => {
      console.log('Connected to server');
      this.authenticate();
    };
    
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
    
    this.socket.onclose = () => {
      console.log('Disconnected from server');
    };
  }
  
  authenticate() {
    // Send authentication request
    this.send({
      type: 'auth',
      token: localStorage.getItem('authToken')
    });
  }
  
  handleMessage(message) {
    switch (message.type) {
      case 'world_state':
        this.updateWorldState(message.entities);
        break;
      case 'entity_spawn':
        this.spawnEntity(message.entity);
        break;
      case 'entity_despawn':
        this.despawnEntity(message.entityId);
        break;
      // Handle other message types
    }
  }
  
  updateWorldState(serverEntities) {
    for (const serverEntity of serverEntities) {
      const entity = this.entities.get(serverEntity.id);
      
      if (entity) {
        // Entity exists, update it
        if (entity === this.localPlayer && this.serverReconciliation) {
          // Server reconciliation for local player
          this.reconcilePlayerPosition(serverEntity);
        } else {
          // Regular update for other entities
          this.updateEntityFromServer(entity, serverEntity);
        }
      } else {
        // New entity, spawn it
        this.spawnEntity(serverEntity);
      }
    }
  }
  
  // Send player input to server
  sendPlayerInput(input) {
    this.send({
      type: 'player_input',
      input: input,
      sequence: this.inputSequence++
    });
    
    // Store predicted move for reconciliation
    if (this.serverReconciliation) {
      this.predictedMoves.push({
        sequence: this.inputSequence,
        input: input,
        position: this.localPlayer.position.clone(),
        rotation: this.localPlayer.rotation.clone()
      });
    }
  }
  
  // Reconcile player position with server
  reconcilePlayerPosition(serverState) {
    // Find the last acknowledged move
    const serverSequence = serverState.lastProcessedInput;
    
    // Remove older moves
    while (this.predictedMoves.length > 0 &&
           this.predictedMoves[0].sequence <= serverSequence) {
      this.predictedMoves.shift();
    }
    
    // Check if correction is needed
    if (this.predictedMoves.length === 0) {
      return;
    }
    
    // Snap to server position if too far off
    const positionError = this.localPlayer.position.distanceTo(
      new THREE.Vector3(serverState.position.x, serverState.position.y, serverState.position.z)
    );
    
    if (positionError > 3) {
      // Too much error, snap to server position
      this.localPlayer.position.set(
        serverState.position.x,
        serverState.position.y,
        serverState.position.z
      );
      
      // Clear predicted moves
      this.predictedMoves = [];
    } else {
      // Apply reconciliation - start from server state and replay inputs
      this.localPlayer.position.set(
        serverState.position.x,
        serverState.position.y,
        serverState.position.z
      );
      
      // Replay moves
      for (const move of this.predictedMoves) {
        this.localPlayer.applyInput(move.input);
      }
    }
  }
  
  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
}
```

## From Our FPS to WoW Clone

### 1. Key Differences

To transform our current FPS into a WoW clone:

1. **Camera System**:
   - Replace fixed first-person camera with flexible orbit camera
   - Add camera collision detection and smooth movement
   - Implement mode switching (first/third person)

2. **Character System**:
   - Replace floating hands/gun with full character model
   - Implement character customization
   - Expand animation system for MMO actions

3. **Combat System**:
   - Replace direct gun shooting with ability system
   - Implement targeting system
   - Add cooldowns, casting times, and effects

4. **UI System**:
   - Add MMO-specific UI elements (health/mana bars, action bars)
   - Implement character/inventory screens
   - Add chat system and nameplates

### 2. Reusing Current Code

Much of our existing code can be adapted:

- Animation system (already handles blending and state machines)
- Physics system for collision detection
- Entity/component architecture
- Asset loading pipeline

### 3. Migration Path

1. Implement third-person camera system
2. Replace weapons with full character rendering
3. Expand animation state machine
4. Implement ability system
5. Add UI elements for MMO gameplay
6. Develop networking layer
7. Add character customization
8. Implement world content (quests, NPCs)

## Conclusion

Building a World of Warcraft clone with Three.js is ambitious but achievable. By leveraging modern web technologies and a solid architecture, you can create an immersive MMORPG experience with high-quality graphics and engaging gameplay.

The secret to high-quality 3D animation is:
1. Professional-quality assets
2. Sophisticated animation blending
3. State machine-driven behavior
4. Inverse kinematics for natural movement
5. Performance optimization for smooth gameplay

By building on the foundation of our current engine and expanding it with MMO-specific systems, you can create a compelling World of Warcraft-style experience in the browser. 