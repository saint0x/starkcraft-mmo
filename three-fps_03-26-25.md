# Jockey Image

Generated: 03-26-2025 at 19:33:13

## Repository Structure

```
three-fps
│   ├── LICENSE
│   ├── RUNDOWN.md
│   ├── webpack.config.js
│   ├── package.json
│   ├── src
│   │   ├── ui
│   │   ├── AmmoLib.js
│   │   ├── Component.js
│   │   ├── Entity.js
│       └── EntityManager.js
│   ├── package-lock.json
│   ├── README.md
│   ├── yarn.lock
    └── WOW.md
```

## File: /Users/saint/Desktop/game-dev/three-fps/LICENSE

```
The MIT License (MIT)

Copyright (c) 2021 Mohsen Heydari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

## File: /Users/saint/Desktop/game-dev/three-fps/webpack.config.js

```js
const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildPath = './build/';

module.exports = {
  entry: ['./src/entry.js'],
  output: {
    path: path.join(__dirname, buildPath),
    filename: '[name].[fullhash].js',
    publicPath: '',
  },
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },
      {
        test: /\.(jpe?g|png|gif|svg|tga|glb|gltf|bin|fbx|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|ogg|wav)$/i,
        use: {
          loader: 'file-loader',
          options: {
              esModule: false
          }
        },
        exclude: path.resolve(__dirname, './node_modules/')
      },
    ]
  },
  resolve: {
    alias: {
      vendor: path.resolve(__dirname, 'vendor')
    },
    fallback: {
      'fs': false,
      'path': false, // ammo.js seems to also use path
    }
  },
  plugins: [
    new HtmlWebpackPlugin({'title': 'Three.js FPS Demo | Venolabs', template: './src/index.html'})
  ]
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/README.md

````md
# Three FPS Demo

Three.js FPS game using ammo.js and three-pathfinding with ES6 and Webpack.

The project features an entity/component system, FPS controller using ammo.js rigidbody, NPC with root-motion animations and a basic AI.

Please note that the project is still under development.

[Online Demo](http://venolabs.com/three-fps-demo/)

## Install
Before you begin, make sure you are comfortable with terminal commands and have [Node and NPM installed](https://www.npmjs.com/get-npm). Then either install via a download or with Git.

### Install via Download
First download the [zip of the project](https://github.com/mohsenheydari/three-fps/archive/master.zip) and extract it. Then in terminal at that folder type `npm install` to set things up. To get going run: `npm start`.

### Install with Git
In terminal clone the project into a directory of your choice then delete the git folder to start fresh.

```bash
git clone --depth=1 https://github.com/mohsenheydari/three-fps.git three-fps
cd three-fps
rm -rf .git
npm install
```

## Running the development server
To see the changes you make to the project go to the project's folder in terminal and type...

```bash
npm start
```

This command will bundle the project code and start a development server at [http://localhost:8080/](http://localhost:8080/). Visit this in your web browser.

## Editing the code
The first file you should open is `./src/entry.js`. In it you will find the main application class. This class is reponsible for initializing the libraries and loading art assets, it also handles the main game loop.

## Building the project for the web
Running `npm run build` in terminal will bundle your project into the folder `./build/`. You can upload this directory to a web server. For more complex results read [this guide](https://webpack.js.org/guides/production/).

## About the models
Art assets used in this project:

* [Ak47](https://skfb.ly/6UEL9) by [kursat_sokmen](https://sketchfab.com/kursat_sokmen) is licensed under CC BY 4.0
* [Metal Ammo Box](https://skfb.ly/6UAQY) by [TheoClarke](https://sketchfab.com/TheoClarke) is licensed under CC BY 4.0
* [Mutant](https://mixamo.com) by [mixamo.com](https://mixamo.com)
* [Veld Fire](https://hdrihaven.com/hdri/?h=veld_fire) by [Greg Zaal](https://hdrihaven.com/hdris/?a=Greg%20Zaal) is licensed under CC0

## Thanks to
* [Three Seed](https://github.com/edwinwebb/three-seed)
* [ammo.js](https://github.com/kripken/ammo.js/)
* [three-pathfinding](https://github.com/donmccurdy/three-pathfinding)

## License
[MIT](https://github.com/mohsenheydari/three-fps/blob/master/LICENSE)
````

## File: /Users/saint/Desktop/game-dev/three-fps/RUNDOWN.md

````md
# Modern 3D FPS Game Architecture Rundown

This document provides a deep technical explanation of how this browser-based FPS game achieves its high-quality visuals and gameplay mechanics using Three.js and modern web technologies.

## Table of Contents
- [Graphics Pipeline](#graphics-pipeline)
- [Asset Management](#asset-management)
- [Character Systems](#character-systems)
- [Physics and Collision](#physics-and-collision)
- [Animation System](#animation-system)
- [Weapon System](#weapon-system)
- [Game Loop and Performance](#game-loop-and-performance)

## Graphics Pipeline

### Renderer Setup
The game uses Three.js's WebGLRenderer with advanced rendering features enabled:

```javascript
this.renderer = new THREE.WebGLRenderer({antialias: true});
this.renderer.shadowMap.enabled = true;
this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Advanced color handling
this.renderer.toneMapping = THREE.ReinhardToneMapping;
this.renderer.toneMappingExposure = 1;
this.renderer.outputEncoding = THREE.sRGBEncoding;
```

This setup provides:
- Anti-aliasing for smooth edges
- High-quality soft shadows
- HDR-like tone mapping for better color reproduction
- Correct color space handling with sRGB

### Camera System
The game uses a perspective camera for the first-person view:

```javascript
this.camera = new THREE.PerspectiveCamera();
this.camera.near = 0.01;  // Very close near plane for weapon models
```

The near plane is set very close to allow for proper rendering of the weapon model in first-person view.

## Asset Management

### 3D Model Loading
The game uses multiple loaders for different 3D file formats:

```javascript
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const objLoader = new OBJLoader();
```

Asset loading is handled asynchronously with progress tracking:

```javascript
async LoadAssets() {
    const promises = [];
    
    // Level assets
    promises.push(this.AddAsset(level, gltfLoader, "level"));
    promises.push(this.AddAsset(navmesh, objLoader, "navmesh"));
    
    // Character assets
    promises.push(this.AddAsset(mutant, fbxLoader, "mutant"));
    promises.push(this.AddAsset(idleAnim, fbxLoader, "idleAnim"));
    // ... more animations
    
    // Weapon assets
    promises.push(this.AddAsset(ak47, gltfLoader, "ak47"));
    promises.push(this.AddAsset(muzzleFlash, gltfLoader, "muzzleFlash"));
    
    await this.PromiseProgress(promises, this.OnProgress);
}
```

### Material System
The game uses Physically Based Rendering (PBR) materials for realistic lighting:

```javascript
new THREE.MeshStandardMaterial({
    map: this.assets['ammoboxTexD'],         // Diffuse/Color map
    aoMap: this.assets['ammoboxTexAO'],      // Ambient Occlusion
    normalMap: this.assets['ammoboxTexN'],   // Normal map
    metalness: 1,
    metalnessMap: this.assets['ammoboxTexM'], // Metalness map
    roughnessMap: this.assets['ammoboxTexR'], // Roughness map
    color: new THREE.Color(0.4, 0.4, 0.4)
});
```

## Character Systems

### Player Controller
The player controller handles movement, looking, and interaction:

```javascript
export default class PlayerControls extends Component {
    constructor(camera) {
        this.moveSpeed = 5;
        this.lookSpeed = 0.002;
        this.camera = camera;
    }

    Update(t) {
        // Handle mouse look
        const mouseDelta = Input.GetMouseDelta();
        this.rotation.y -= mouseDelta.x * this.lookSpeed;
        this.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, 
            this.rotation.x - mouseDelta.y * this.lookSpeed));
            
        // Handle WASD movement
        const move = new THREE.Vector3();
        if (Input.IsKeyDown('KeyW')) move.z -= 1;
        if (Input.IsKeyDown('KeyS')) move.z += 1;
        if (Input.IsKeyDown('KeyA')) move.x -= 1;
        if (Input.IsKeyDown('KeyD')) move.x += 1;
        
        move.normalize().multiplyScalar(this.moveSpeed * t);
        this.position.add(move);
    }
}
```

### Enemy AI
The mutant enemy uses a state machine for behavior:

```javascript
export default class NpcCharacterController extends Component {
    constructor() {
        this.stateMachine = new FiniteStateMachine(this);
        this.states = {
            idle: new IdleState(),
            chase: new ChaseState(),
            attack: new AttackState(),
            die: new DieState()
        };
    }

    Update(t) {
        this.stateMachine.Update(t);
    }
}
```

## Physics and Collision

The game uses Ammo.js (a port of Bullet Physics) for realistic physics:

```javascript
SetupPhysics() {
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const broadphase = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
        dispatcher, broadphase, solver, collisionConfiguration
    );
    this.physicsWorld.setGravity(new Ammo.btVector3(0.0, -9.81, 0.0));
}
```

### Collision Detection
Weapon raycasting for hit detection:

```javascript
Raycast() {
    const start = new THREE.Vector3(0.0, 0.0, -1.0);
    start.unproject(this.camera);
    const end = new THREE.Vector3(0.0, 0.0, 1.0);
    end.unproject(this.camera);

    const collisionMask = CollisionFilterGroups.AllFilter & 
                         ~CollisionFilterGroups.SensorTrigger;
    
    if (AmmoHelper.CastRay(this.world, start, end, this.hitResult, collisionMask)) {
        const entity = this.hitResult.collisionObject.parentEntity;
        entity && entity.Broadcast({
            topic: 'hit', 
            from: this.parent, 
            amount: this.damage, 
            hitResult: this.hitResult
        });
    }
}
```

## Animation System

### Skeletal Animation
The game uses Three.js's animation system for character movements:

```javascript
export default class AnimationController {
    constructor(model) {
        this.mixer = new THREE.AnimationMixer(model);
        this.animations = {};
    }

    SetAnim(name, clip) {
        const action = this.mixer.clipAction(clip);
        this.animations[name] = {clip, action};
    }

    PlayAnimation(name, fadeTime = 0.2) {
        const anim = this.animations[name];
        if (!anim) return;

        // Smoothly transition between animations
        anim.action.reset();
        anim.action.fadeIn(fadeTime);
        anim.action.play();
    }

    Update(t) {
        this.mixer.update(t);
    }
}
```

## Weapon System

The weapon system handles shooting, reloading, and effects:

```javascript
export default class Weapon extends Component {
    constructor(camera, model, flash) {
        this.camera = camera;
        this.model = model;
        this.flash = flash;
        
        this.fireRate = 0.1;
        this.damage = 2;
        this.magAmmo = 30;
        this.ammoPerMag = 30;
    }

    Shoot(t) {
        if (!this.magAmmo) {
            this.Reload();
            return;
        }

        if (this.shootTimer <= 0.0) {
            // Visual effects
            this.flash.life = this.fireRate;
            this.flash.rotateZ(Math.PI * Math.random());
            
            // Gameplay logic
            this.magAmmo--;
            this.Raycast();
            
            // Sound effects
            this.shotSound.play();
        }
    }
}
```

## Game Loop and Performance

### Entity Component System
The game uses an entity-component system for better organization and performance:

```javascript
export default class EntityManager {
    constructor() {
        this.entities = new Set();
        this.componentsToUpdate = new Set();
    }

    Update(t) {
        for (const component of this.componentsToUpdate) {
            component.Update(t);
        }
    }
}
```

### Performance Optimizations
- Frustum culling for rendering only visible objects
- Level of Detail (LOD) for distant objects
- Object pooling for frequently created objects (bullets, effects)
- Efficient collision detection using spatial partitioning

```javascript
// Example of object pooling for bullet impacts
class BulletImpactPool {
    constructor(size) {
        this.pool = new Array(size).fill(null).map(() => 
            this.createImpact());
        this.index = 0;
    }

    getNext() {
        const impact = this.pool[this.index];
        this.index = (this.index + 1) % this.pool.length;
        return impact;
    }
}
```

## Conclusion

This FPS game achieves its high-quality visuals and smooth gameplay through:
1. Modern WebGL features via Three.js
2. Professional 3D assets and animations
3. Physically based rendering and materials
4. Efficient physics using Ammo.js
5. Component-based architecture
6. Performance optimizations

The combination of these systems creates an immersive 3D experience that runs smoothly in a web browser while maintaining high visual fidelity. 
````

## File: /Users/saint/Desktop/game-dev/three-fps/yarn.lock

```lock
# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"@babel/code-frame@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.12.13.tgz"
  integrity sha512-HV1Cm0Q3ZrpCR93tkWOYiuYIgLxZXZFVG2VgK+MBWjUqZTundupbfx2aXarXuw5Ko5aMcjtJgbSs4vUGBS5v6g==
  dependencies:
    "@babel/highlight" "^7.12.13"

"@babel/compat-data@^7.13.0", "@babel/compat-data@^7.13.12", "@babel/compat-data@^7.13.8":
  version "7.13.12"
  resolved "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.13.12.tgz"
  integrity sha512-3eJJ841uKxeV8dcN/2yGEUy+RfgQspPEgQat85umsE1rotuquQ2AbIub4S6j7c50a2d+4myc+zSlnXeIHrOnhQ==

"@babel/core@^7.0.0", "@babel/core@^7.0.0-0", "@babel/core@^7.12.10", "@babel/core@^7.13.0", "@babel/core@^7.4.0-0":
  version "7.13.14"
  resolved "https://registry.npmjs.org/@babel/core/-/core-7.13.14.tgz"
  integrity sha512-wZso/vyF4ki0l0znlgM4inxbdrUvCb+cVz8grxDq+6C9k6qbqoIJteQOKicaKjCipU3ISV+XedCqpL2RJJVehA==
  dependencies:
    "@babel/code-frame" "^7.12.13"
    "@babel/generator" "^7.13.9"
    "@babel/helper-compilation-targets" "^7.13.13"
    "@babel/helper-module-transforms" "^7.13.14"
    "@babel/helpers" "^7.13.10"
    "@babel/parser" "^7.13.13"
    "@babel/template" "^7.12.13"
    "@babel/traverse" "^7.13.13"
    "@babel/types" "^7.13.14"
    convert-source-map "^1.7.0"
    debug "^4.1.0"
    gensync "^1.0.0-beta.2"
    json5 "^2.1.2"
    semver "^6.3.0"
    source-map "^0.5.0"

"@babel/generator@^7.13.9":
  version "7.13.9"
  resolved "https://registry.npmjs.org/@babel/generator/-/generator-7.13.9.tgz"
  integrity sha512-mHOOmY0Axl/JCTkxTU6Lf5sWOg/v8nUa+Xkt4zMTftX0wqmb6Sh7J8gvcehBw7q0AhrhAR+FDacKjCZ2X8K+Sw==
  dependencies:
    "@babel/types" "^7.13.0"
    jsesc "^2.5.1"
    source-map "^0.5.0"

"@babel/helper-annotate-as-pure@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.12.13.tgz"
  integrity sha512-7YXfX5wQ5aYM/BOlbSccHDbuXXFPxeoUmfWtz8le2yTkTZc+BxsiEnENFoi2SlmA8ewDkG2LgIMIVzzn2h8kfw==
  dependencies:
    "@babel/types" "^7.12.13"

"@babel/helper-builder-binary-assignment-operator-visitor@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/helper-builder-binary-assignment-operator-visitor/-/helper-builder-binary-assignment-operator-visitor-7.12.13.tgz"
  integrity sha512-CZOv9tGphhDRlVjVkAgm8Nhklm9RzSmWpX2my+t7Ua/KT616pEzXsQCjinzvkRvHWJ9itO4f296efroX23XCMA==
  dependencies:
    "@babel/helper-explode-assignable-expression" "^7.12.13"
    "@babel/types" "^7.12.13"

"@babel/helper-compilation-targets@^7.13.0", "@babel/helper-compilation-targets@^7.13.10", "@babel/helper-compilation-targets@^7.13.13", "@babel/helper-compilation-targets@^7.13.8":
  version "7.13.13"
  resolved "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.13.13.tgz"
  integrity sha512-q1kcdHNZehBwD9jYPh3WyXcsFERi39X4I59I3NadciWtNDyZ6x+GboOxncFK0kXlKIv6BJm5acncehXWUjWQMQ==
  dependencies:
    "@babel/compat-data" "^7.13.12"
    "@babel/helper-validator-option" "^7.12.17"
    browserslist "^4.14.5"
    semver "^6.3.0"

"@babel/helper-create-class-features-plugin@^7.13.0":
  version "7.13.11"
  resolved "https://registry.npmjs.org/@babel/helper-create-class-features-plugin/-/helper-create-class-features-plugin-7.13.11.tgz"
  integrity sha512-ays0I7XYq9xbjCSvT+EvysLgfc3tOkwCULHjrnscGT3A9qD4sk3wXnJ3of0MAWsWGjdinFvajHU2smYuqXKMrw==
  dependencies:
    "@babel/helper-function-name" "^7.12.13"
    "@babel/helper-member-expression-to-functions" "^7.13.0"
    "@babel/helper-optimise-call-expression" "^7.12.13"
    "@babel/helper-replace-supers" "^7.13.0"
    "@babel/helper-split-export-declaration" "^7.12.13"

"@babel/helper-create-regexp-features-plugin@^7.12.13":
  version "7.12.17"
  resolved "https://registry.npmjs.org/@babel/helper-create-regexp-features-plugin/-/helper-create-regexp-features-plugin-7.12.17.tgz"
  integrity sha512-p2VGmBu9oefLZ2nQpgnEnG0ZlRPvL8gAGvPUMQwUdaE8k49rOMuZpOwdQoy5qJf6K8jL3bcAMhVUlHAjIgJHUg==
  dependencies:
    "@babel/helper-annotate-as-pure" "^7.12.13"
    regexpu-core "^4.7.1"

"@babel/helper-define-polyfill-provider@^0.1.5":
  version "0.1.5"
  resolved "https://registry.npmjs.org/@babel/helper-define-polyfill-provider/-/helper-define-polyfill-provider-0.1.5.tgz"
  integrity sha512-nXuzCSwlJ/WKr8qxzW816gwyT6VZgiJG17zR40fou70yfAcqjoNyTLl/DQ+FExw5Hx5KNqshmN8Ldl/r2N7cTg==
  dependencies:
    "@babel/helper-compilation-targets" "^7.13.0"
    "@babel/helper-module-imports" "^7.12.13"
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/traverse" "^7.13.0"
    debug "^4.1.1"
    lodash.debounce "^4.0.8"
    resolve "^1.14.2"
    semver "^6.1.2"

"@babel/helper-explode-assignable-expression@^7.12.13":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/helper-explode-assignable-expression/-/helper-explode-assignable-expression-7.13.0.tgz"
  integrity sha512-qS0peLTDP8kOisG1blKbaoBg/o9OSa1qoumMjTK5pM+KDTtpxpsiubnCGP34vK8BXGcb2M9eigwgvoJryrzwWA==
  dependencies:
    "@babel/types" "^7.13.0"

"@babel/helper-function-name@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/helper-function-name/-/helper-function-name-7.12.13.tgz"
  integrity sha512-TZvmPn0UOqmvi5G4vvw0qZTpVptGkB1GL61R6lKvrSdIxGm5Pky7Q3fpKiIkQCAtRCBUwB0PaThlx9vebCDSwA==
  dependencies:
    "@babel/helper-get-function-arity" "^7.12.13"
    "@babel/template" "^7.12.13"
    "@babel/types" "^7.12.13"

"@babel/helper-get-function-arity@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/helper-get-function-arity/-/helper-get-function-arity-7.12.13.tgz"
  integrity sha512-DjEVzQNz5LICkzN0REdpD5prGoidvbdYk1BVgRUOINaWJP2t6avB27X1guXK1kXNrX0WMfsrm1A/ZBthYuIMQg==
  dependencies:
    "@babel/types" "^7.12.13"

"@babel/helper-hoist-variables@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/helper-hoist-variables/-/helper-hoist-variables-7.13.0.tgz"
  integrity sha512-0kBzvXiIKfsCA0y6cFEIJf4OdzfpRuNk4+YTeHZpGGc666SATFKTz6sRncwFnQk7/ugJ4dSrCj6iJuvW4Qwr2g==
  dependencies:
    "@babel/traverse" "^7.13.0"
    "@babel/types" "^7.13.0"

"@babel/helper-member-expression-to-functions@^7.13.0", "@babel/helper-member-expression-to-functions@^7.13.12":
  version "7.13.12"
  resolved "https://registry.npmjs.org/@babel/helper-member-expression-to-functions/-/helper-member-expression-to-functions-7.13.12.tgz"
  integrity sha512-48ql1CLL59aKbU94Y88Xgb2VFy7a95ykGRbJJaaVv+LX5U8wFpLfiGXJJGUozsmA1oEh/o5Bp60Voq7ACyA/Sw==
  dependencies:
    "@babel/types" "^7.13.12"

"@babel/helper-module-imports@^7.12.13", "@babel/helper-module-imports@^7.13.12":
  version "7.13.12"
  resolved "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.13.12.tgz"
  integrity sha512-4cVvR2/1B693IuOvSI20xqqa/+bl7lqAMR59R4iu39R9aOX8/JoYY1sFaNvUMyMBGnHdwvJgUrzNLoUZxXypxA==
  dependencies:
    "@babel/types" "^7.13.12"

"@babel/helper-module-transforms@^7.13.0", "@babel/helper-module-transforms@^7.13.14":
  version "7.13.14"
  resolved "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.13.14.tgz"
  integrity sha512-QuU/OJ0iAOSIatyVZmfqB0lbkVP0kDRiKj34xy+QNsnVZi/PA6BoSoreeqnxxa9EHFAIL0R9XOaAR/G9WlIy5g==
  dependencies:
    "@babel/helper-module-imports" "^7.13.12"
    "@babel/helper-replace-supers" "^7.13.12"
    "@babel/helper-simple-access" "^7.13.12"
    "@babel/helper-split-export-declaration" "^7.12.13"
    "@babel/helper-validator-identifier" "^7.12.11"
    "@babel/template" "^7.12.13"
    "@babel/traverse" "^7.13.13"
    "@babel/types" "^7.13.14"

"@babel/helper-optimise-call-expression@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/helper-optimise-call-expression/-/helper-optimise-call-expression-7.12.13.tgz"
  integrity sha512-BdWQhoVJkp6nVjB7nkFWcn43dkprYauqtk++Py2eaf/GRDFm5BxRqEIZCiHlZUGAVmtwKcsVL1dC68WmzeFmiA==
  dependencies:
    "@babel/types" "^7.12.13"

"@babel/helper-plugin-utils@^7.0.0", "@babel/helper-plugin-utils@^7.10.4", "@babel/helper-plugin-utils@^7.12.13", "@babel/helper-plugin-utils@^7.13.0", "@babel/helper-plugin-utils@^7.8.0", "@babel/helper-plugin-utils@^7.8.3":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.13.0.tgz"
  integrity sha512-ZPafIPSwzUlAoWT8DKs1W2VyF2gOWthGd5NGFMsBcMMol+ZhK+EQY/e6V96poa6PA/Bh+C9plWN0hXO1uB8AfQ==

"@babel/helper-remap-async-to-generator@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/helper-remap-async-to-generator/-/helper-remap-async-to-generator-7.13.0.tgz"
  integrity sha512-pUQpFBE9JvC9lrQbpX0TmeNIy5s7GnZjna2lhhcHC7DzgBs6fWn722Y5cfwgrtrqc7NAJwMvOa0mKhq6XaE4jg==
  dependencies:
    "@babel/helper-annotate-as-pure" "^7.12.13"
    "@babel/helper-wrap-function" "^7.13.0"
    "@babel/types" "^7.13.0"

"@babel/helper-replace-supers@^7.12.13", "@babel/helper-replace-supers@^7.13.0", "@babel/helper-replace-supers@^7.13.12":
  version "7.13.12"
  resolved "https://registry.npmjs.org/@babel/helper-replace-supers/-/helper-replace-supers-7.13.12.tgz"
  integrity sha512-Gz1eiX+4yDO8mT+heB94aLVNCL+rbuT2xy4YfyNqu8F+OI6vMvJK891qGBTqL9Uc8wxEvRW92Id6G7sDen3fFw==
  dependencies:
    "@babel/helper-member-expression-to-functions" "^7.13.12"
    "@babel/helper-optimise-call-expression" "^7.12.13"
    "@babel/traverse" "^7.13.0"
    "@babel/types" "^7.13.12"

"@babel/helper-simple-access@^7.12.13", "@babel/helper-simple-access@^7.13.12":
  version "7.13.12"
  resolved "https://registry.npmjs.org/@babel/helper-simple-access/-/helper-simple-access-7.13.12.tgz"
  integrity sha512-7FEjbrx5SL9cWvXioDbnlYTppcZGuCY6ow3/D5vMggb2Ywgu4dMrpTJX0JdQAIcRRUElOIxF3yEooa9gUb9ZbA==
  dependencies:
    "@babel/types" "^7.13.12"

"@babel/helper-skip-transparent-expression-wrappers@^7.12.1":
  version "7.12.1"
  resolved "https://registry.npmjs.org/@babel/helper-skip-transparent-expression-wrappers/-/helper-skip-transparent-expression-wrappers-7.12.1.tgz"
  integrity sha512-Mf5AUuhG1/OCChOJ/HcADmvcHM42WJockombn8ATJG3OnyiSxBK/Mm5x78BQWvmtXZKHgbjdGL2kin/HOLlZGA==
  dependencies:
    "@babel/types" "^7.12.1"

"@babel/helper-split-export-declaration@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/helper-split-export-declaration/-/helper-split-export-declaration-7.12.13.tgz"
  integrity sha512-tCJDltF83htUtXx5NLcaDqRmknv652ZWCHyoTETf1CXYJdPC7nohZohjUgieXhv0hTJdRf2FjDueFehdNucpzg==
  dependencies:
    "@babel/types" "^7.12.13"

"@babel/helper-validator-identifier@^7.12.11":
  version "7.12.11"
  resolved "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.12.11.tgz"
  integrity sha512-np/lG3uARFybkoHokJUmf1QfEvRVCPbmQeUQpKow5cQ3xWrV9i3rUHodKDJPQfTVX61qKi+UdYk8kik84n7XOw==

"@babel/helper-validator-option@^7.12.17":
  version "7.12.17"
  resolved "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.12.17.tgz"
  integrity sha512-TopkMDmLzq8ngChwRlyjR6raKD6gMSae4JdYDB8bByKreQgG0RBTuKe9LRxW3wFtUnjxOPRKBDwEH6Mg5KeDfw==

"@babel/helper-wrap-function@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/helper-wrap-function/-/helper-wrap-function-7.13.0.tgz"
  integrity sha512-1UX9F7K3BS42fI6qd2A4BjKzgGjToscyZTdp1DjknHLCIvpgne6918io+aL5LXFcER/8QWiwpoY902pVEqgTXA==
  dependencies:
    "@babel/helper-function-name" "^7.12.13"
    "@babel/template" "^7.12.13"
    "@babel/traverse" "^7.13.0"
    "@babel/types" "^7.13.0"

"@babel/helpers@^7.13.10":
  version "7.13.10"
  resolved "https://registry.npmjs.org/@babel/helpers/-/helpers-7.13.10.tgz"
  integrity sha512-4VO883+MWPDUVRF3PhiLBUFHoX/bsLTGFpFK/HqvvfBZz2D57u9XzPVNFVBTc0PW/CWR9BXTOKt8NF4DInUHcQ==
  dependencies:
    "@babel/template" "^7.12.13"
    "@babel/traverse" "^7.13.0"
    "@babel/types" "^7.13.0"

"@babel/highlight@^7.12.13":
  version "7.13.10"
  resolved "https://registry.npmjs.org/@babel/highlight/-/highlight-7.13.10.tgz"
  integrity sha512-5aPpe5XQPzflQrFwL1/QoeHkP2MsA4JCntcXHRhEsdsfPVkvPi2w7Qix4iV7t5S/oC9OodGrggd8aco1g3SZFg==
  dependencies:
    "@babel/helper-validator-identifier" "^7.12.11"
    chalk "^2.0.0"
    js-tokens "^4.0.0"

"@babel/parser@^7.12.13", "@babel/parser@^7.13.13":
  version "7.13.13"
  resolved "https://registry.npmjs.org/@babel/parser/-/parser-7.13.13.tgz"
  integrity sha512-OhsyMrqygfk5v8HmWwOzlYjJrtLaFhF34MrfG/Z73DgYCI6ojNUTUp2TYbtnjo8PegeJp12eamsNettCQjKjVw==

"@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@^7.13.12":
  version "7.13.12"
  resolved "https://registry.npmjs.org/@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining/-/plugin-bugfix-v8-spread-parameters-in-optional-chaining-7.13.12.tgz"
  integrity sha512-d0u3zWKcoZf379fOeJdr1a5WPDny4aOFZ6hlfKivgK0LY7ZxNfoaHL2fWwdGtHyVvra38FC+HVYkO+byfSA8AQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/helper-skip-transparent-expression-wrappers" "^7.12.1"
    "@babel/plugin-proposal-optional-chaining" "^7.13.12"

"@babel/plugin-proposal-async-generator-functions@^7.13.8":
  version "7.13.8"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-async-generator-functions/-/plugin-proposal-async-generator-functions-7.13.8.tgz"
  integrity sha512-rPBnhj+WgoSmgq+4gQUtXx/vOcU+UYtjy1AA/aeD61Hwj410fwYyqfUcRP3lR8ucgliVJL/G7sXcNUecC75IXA==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/helper-remap-async-to-generator" "^7.13.0"
    "@babel/plugin-syntax-async-generators" "^7.8.4"

"@babel/plugin-proposal-class-properties@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-class-properties/-/plugin-proposal-class-properties-7.13.0.tgz"
  integrity sha512-KnTDjFNC1g+45ka0myZNvSBFLhNCLN+GeGYLDEA8Oq7MZ6yMgfLoIRh86GRT0FjtJhZw8JyUskP9uvj5pHM9Zg==
  dependencies:
    "@babel/helper-create-class-features-plugin" "^7.13.0"
    "@babel/helper-plugin-utils" "^7.13.0"

"@babel/plugin-proposal-dynamic-import@^7.13.8":
  version "7.13.8"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-dynamic-import/-/plugin-proposal-dynamic-import-7.13.8.tgz"
  integrity sha512-ONWKj0H6+wIRCkZi9zSbZtE/r73uOhMVHh256ys0UzfM7I3d4n+spZNWjOnJv2gzopumP2Wxi186vI8N0Y2JyQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/plugin-syntax-dynamic-import" "^7.8.3"

"@babel/plugin-proposal-export-namespace-from@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-export-namespace-from/-/plugin-proposal-export-namespace-from-7.12.13.tgz"
  integrity sha512-INAgtFo4OnLN3Y/j0VwAgw3HDXcDtX+C/erMvWzuV9v71r7urb6iyMXu7eM9IgLr1ElLlOkaHjJ0SbCmdOQ3Iw==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"
    "@babel/plugin-syntax-export-namespace-from" "^7.8.3"

"@babel/plugin-proposal-json-strings@^7.13.8":
  version "7.13.8"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-json-strings/-/plugin-proposal-json-strings-7.13.8.tgz"
  integrity sha512-w4zOPKUFPX1mgvTmL/fcEqy34hrQ1CRcGxdphBc6snDnnqJ47EZDIyop6IwXzAC8G916hsIuXB2ZMBCExC5k7Q==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/plugin-syntax-json-strings" "^7.8.3"

"@babel/plugin-proposal-logical-assignment-operators@^7.13.8":
  version "7.13.8"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-logical-assignment-operators/-/plugin-proposal-logical-assignment-operators-7.13.8.tgz"
  integrity sha512-aul6znYB4N4HGweImqKn59Su9RS8lbUIqxtXTOcAGtNIDczoEFv+l1EhmX8rUBp3G1jMjKJm8m0jXVp63ZpS4A==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/plugin-syntax-logical-assignment-operators" "^7.10.4"

"@babel/plugin-proposal-nullish-coalescing-operator@^7.13.8":
  version "7.13.8"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-nullish-coalescing-operator/-/plugin-proposal-nullish-coalescing-operator-7.13.8.tgz"
  integrity sha512-iePlDPBn//UhxExyS9KyeYU7RM9WScAG+D3Hhno0PLJebAEpDZMocbDe64eqynhNAnwz/vZoL/q/QB2T1OH39A==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/plugin-syntax-nullish-coalescing-operator" "^7.8.3"

"@babel/plugin-proposal-numeric-separator@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-numeric-separator/-/plugin-proposal-numeric-separator-7.12.13.tgz"
  integrity sha512-O1jFia9R8BUCl3ZGB7eitaAPu62TXJRHn7rh+ojNERCFyqRwJMTmhz+tJ+k0CwI6CLjX/ee4qW74FSqlq9I35w==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"
    "@babel/plugin-syntax-numeric-separator" "^7.10.4"

"@babel/plugin-proposal-object-rest-spread@^7.13.8":
  version "7.13.8"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-object-rest-spread/-/plugin-proposal-object-rest-spread-7.13.8.tgz"
  integrity sha512-DhB2EuB1Ih7S3/IRX5AFVgZ16k3EzfRbq97CxAVI1KSYcW+lexV8VZb7G7L8zuPVSdQMRn0kiBpf/Yzu9ZKH0g==
  dependencies:
    "@babel/compat-data" "^7.13.8"
    "@babel/helper-compilation-targets" "^7.13.8"
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/plugin-syntax-object-rest-spread" "^7.8.3"
    "@babel/plugin-transform-parameters" "^7.13.0"

"@babel/plugin-proposal-optional-catch-binding@^7.13.8":
  version "7.13.8"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-optional-catch-binding/-/plugin-proposal-optional-catch-binding-7.13.8.tgz"
  integrity sha512-0wS/4DUF1CuTmGo+NiaHfHcVSeSLj5S3e6RivPTg/2k3wOv3jO35tZ6/ZWsQhQMvdgI7CwphjQa/ccarLymHVA==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/plugin-syntax-optional-catch-binding" "^7.8.3"

"@babel/plugin-proposal-optional-chaining@^7.13.12":
  version "7.13.12"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-optional-chaining/-/plugin-proposal-optional-chaining-7.13.12.tgz"
  integrity sha512-fcEdKOkIB7Tf4IxrgEVeFC4zeJSTr78no9wTdBuZZbqF64kzllU0ybo2zrzm7gUQfxGhBgq4E39oRs8Zx/RMYQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/helper-skip-transparent-expression-wrappers" "^7.12.1"
    "@babel/plugin-syntax-optional-chaining" "^7.8.3"

"@babel/plugin-proposal-private-methods@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-private-methods/-/plugin-proposal-private-methods-7.13.0.tgz"
  integrity sha512-MXyyKQd9inhx1kDYPkFRVOBXQ20ES8Pto3T7UZ92xj2mY0EVD8oAVzeyYuVfy/mxAdTSIayOvg+aVzcHV2bn6Q==
  dependencies:
    "@babel/helper-create-class-features-plugin" "^7.13.0"
    "@babel/helper-plugin-utils" "^7.13.0"

"@babel/plugin-proposal-unicode-property-regex@^7.12.13", "@babel/plugin-proposal-unicode-property-regex@^7.4.4":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-proposal-unicode-property-regex/-/plugin-proposal-unicode-property-regex-7.12.13.tgz"
  integrity sha512-XyJmZidNfofEkqFV5VC/bLabGmO5QzenPO/YOfGuEbgU+2sSwMmio3YLb4WtBgcmmdwZHyVyv8on77IUjQ5Gvg==
  dependencies:
    "@babel/helper-create-regexp-features-plugin" "^7.12.13"
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-syntax-async-generators@^7.8.4":
  version "7.8.4"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-async-generators/-/plugin-syntax-async-generators-7.8.4.tgz"
  integrity sha512-tycmZxkGfZaxhMRbXlPXuVFpdWlXpir2W4AMhSJgRKzk/eDlIXOhb2LHWoLpDF7TEHylV5zNhykX6KAgHJmTNw==
  dependencies:
    "@babel/helper-plugin-utils" "^7.8.0"

"@babel/plugin-syntax-class-properties@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-class-properties/-/plugin-syntax-class-properties-7.12.13.tgz"
  integrity sha512-fm4idjKla0YahUNgFNLCB0qySdsoPiZP3iQE3rky0mBUtMZ23yDJ9SJdg6dXTSDnulOVqiF3Hgr9nbXvXTQZYA==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-syntax-dynamic-import@^7.8.3":
  version "7.8.3"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-dynamic-import/-/plugin-syntax-dynamic-import-7.8.3.tgz"
  integrity sha512-5gdGbFon+PszYzqs83S3E5mpi7/y/8M9eC90MRTZfduQOYW76ig6SOSPNe41IG5LoP3FGBn2N0RjVDSQiS94kQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.8.0"

"@babel/plugin-syntax-export-namespace-from@^7.8.3":
  version "7.8.3"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-export-namespace-from/-/plugin-syntax-export-namespace-from-7.8.3.tgz"
  integrity sha512-MXf5laXo6c1IbEbegDmzGPwGNTsHZmEy6QGznu5Sh2UCWvueywb2ee+CCE4zQiZstxU9BMoQO9i6zUFSY0Kj0Q==
  dependencies:
    "@babel/helper-plugin-utils" "^7.8.3"

"@babel/plugin-syntax-json-strings@^7.8.3":
  version "7.8.3"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-json-strings/-/plugin-syntax-json-strings-7.8.3.tgz"
  integrity sha512-lY6kdGpWHvjoe2vk4WrAapEuBR69EMxZl+RoGRhrFGNYVK8mOPAW8VfbT/ZgrFbXlDNiiaxQnAtgVCZ6jv30EA==
  dependencies:
    "@babel/helper-plugin-utils" "^7.8.0"

"@babel/plugin-syntax-logical-assignment-operators@^7.10.4":
  version "7.10.4"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-logical-assignment-operators/-/plugin-syntax-logical-assignment-operators-7.10.4.tgz"
  integrity sha512-d8waShlpFDinQ5MtvGU9xDAOzKH47+FFoney2baFIoMr952hKOLp1HR7VszoZvOsV/4+RRszNY7D17ba0te0ig==
  dependencies:
    "@babel/helper-plugin-utils" "^7.10.4"

"@babel/plugin-syntax-nullish-coalescing-operator@^7.8.3":
  version "7.8.3"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-nullish-coalescing-operator/-/plugin-syntax-nullish-coalescing-operator-7.8.3.tgz"
  integrity sha512-aSff4zPII1u2QD7y+F8oDsz19ew4IGEJg9SVW+bqwpwtfFleiQDMdzA/R+UlWDzfnHFCxxleFT0PMIrR36XLNQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.8.0"

"@babel/plugin-syntax-numeric-separator@^7.10.4":
  version "7.10.4"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-numeric-separator/-/plugin-syntax-numeric-separator-7.10.4.tgz"
  integrity sha512-9H6YdfkcK/uOnY/K7/aA2xpzaAgkQn37yzWUMRK7OaPOqOpGS1+n0H5hxT9AUw9EsSjPW8SVyMJwYRtWs3X3ug==
  dependencies:
    "@babel/helper-plugin-utils" "^7.10.4"

"@babel/plugin-syntax-object-rest-spread@^7.8.3":
  version "7.8.3"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-object-rest-spread/-/plugin-syntax-object-rest-spread-7.8.3.tgz"
  integrity sha512-XoqMijGZb9y3y2XskN+P1wUGiVwWZ5JmoDRwx5+3GmEplNyVM2s2Dg8ILFQm8rWM48orGy5YpI5Bl8U1y7ydlA==
  dependencies:
    "@babel/helper-plugin-utils" "^7.8.0"

"@babel/plugin-syntax-optional-catch-binding@^7.8.3":
  version "7.8.3"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-optional-catch-binding/-/plugin-syntax-optional-catch-binding-7.8.3.tgz"
  integrity sha512-6VPD0Pc1lpTqw0aKoeRTMiB+kWhAoT24PA+ksWSBrFtl5SIRVpZlwN3NNPQjehA2E/91FV3RjLWoVTglWcSV3Q==
  dependencies:
    "@babel/helper-plugin-utils" "^7.8.0"

"@babel/plugin-syntax-optional-chaining@^7.8.3":
  version "7.8.3"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-optional-chaining/-/plugin-syntax-optional-chaining-7.8.3.tgz"
  integrity sha512-KoK9ErH1MBlCPxV0VANkXW2/dw4vlbGDrFgz8bmUsBGYkFRcbRwMh6cIJubdPrkxRwuGdtCk0v/wPTKbQgBjkg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.8.0"

"@babel/plugin-syntax-top-level-await@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-syntax-top-level-await/-/plugin-syntax-top-level-await-7.12.13.tgz"
  integrity sha512-A81F9pDwyS7yM//KwbCSDqy3Uj4NMIurtplxphWxoYtNPov7cJsDkAFNNyVlIZ3jwGycVsurZ+LtOA8gZ376iQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-arrow-functions@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-arrow-functions/-/plugin-transform-arrow-functions-7.13.0.tgz"
  integrity sha512-96lgJagobeVmazXFaDrbmCLQxBysKu7U6Do3mLsx27gf5Dk85ezysrs2BZUpXD703U/Su1xTBDxxar2oa4jAGg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"

"@babel/plugin-transform-async-to-generator@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-async-to-generator/-/plugin-transform-async-to-generator-7.13.0.tgz"
  integrity sha512-3j6E004Dx0K3eGmhxVJxwwI89CTJrce7lg3UrtFuDAVQ/2+SJ/h/aSFOeE6/n0WB1GsOffsJp6MnPQNQ8nmwhg==
  dependencies:
    "@babel/helper-module-imports" "^7.12.13"
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/helper-remap-async-to-generator" "^7.13.0"

"@babel/plugin-transform-block-scoped-functions@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-block-scoped-functions/-/plugin-transform-block-scoped-functions-7.12.13.tgz"
  integrity sha512-zNyFqbc3kI/fVpqwfqkg6RvBgFpC4J18aKKMmv7KdQ/1GgREapSJAykLMVNwfRGO3BtHj3YQZl8kxCXPcVMVeg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-block-scoping@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-block-scoping/-/plugin-transform-block-scoping-7.12.13.tgz"
  integrity sha512-Pxwe0iqWJX4fOOM2kEZeUuAxHMWb9nK+9oh5d11bsLoB0xMg+mkDpt0eYuDZB7ETrY9bbcVlKUGTOGWy7BHsMQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-classes@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-classes/-/plugin-transform-classes-7.13.0.tgz"
  integrity sha512-9BtHCPUARyVH1oXGcSJD3YpsqRLROJx5ZNP6tN5vnk17N0SVf9WCtf8Nuh1CFmgByKKAIMstitKduoCmsaDK5g==
  dependencies:
    "@babel/helper-annotate-as-pure" "^7.12.13"
    "@babel/helper-function-name" "^7.12.13"
    "@babel/helper-optimise-call-expression" "^7.12.13"
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/helper-replace-supers" "^7.13.0"
    "@babel/helper-split-export-declaration" "^7.12.13"
    globals "^11.1.0"

"@babel/plugin-transform-computed-properties@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-computed-properties/-/plugin-transform-computed-properties-7.13.0.tgz"
  integrity sha512-RRqTYTeZkZAz8WbieLTvKUEUxZlUTdmL5KGMyZj7FnMfLNKV4+r5549aORG/mgojRmFlQMJDUupwAMiF2Q7OUg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"

"@babel/plugin-transform-destructuring@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-destructuring/-/plugin-transform-destructuring-7.13.0.tgz"
  integrity sha512-zym5em7tePoNT9s964c0/KU3JPPnuq7VhIxPRefJ4/s82cD+q1mgKfuGRDMCPL0HTyKz4dISuQlCusfgCJ86HA==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"

"@babel/plugin-transform-dotall-regex@^7.12.13", "@babel/plugin-transform-dotall-regex@^7.4.4":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-dotall-regex/-/plugin-transform-dotall-regex-7.12.13.tgz"
  integrity sha512-foDrozE65ZFdUC2OfgeOCrEPTxdB3yjqxpXh8CH+ipd9CHd4s/iq81kcUpyH8ACGNEPdFqbtzfgzbT/ZGlbDeQ==
  dependencies:
    "@babel/helper-create-regexp-features-plugin" "^7.12.13"
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-duplicate-keys@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-duplicate-keys/-/plugin-transform-duplicate-keys-7.12.13.tgz"
  integrity sha512-NfADJiiHdhLBW3pulJlJI2NB0t4cci4WTZ8FtdIuNc2+8pslXdPtRRAEWqUY+m9kNOk2eRYbTAOipAxlrOcwwQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-exponentiation-operator@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-exponentiation-operator/-/plugin-transform-exponentiation-operator-7.12.13.tgz"
  integrity sha512-fbUelkM1apvqez/yYx1/oICVnGo2KM5s63mhGylrmXUxK/IAXSIf87QIxVfZldWf4QsOafY6vV3bX8aMHSvNrA==
  dependencies:
    "@babel/helper-builder-binary-assignment-operator-visitor" "^7.12.13"
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-for-of@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-for-of/-/plugin-transform-for-of-7.13.0.tgz"
  integrity sha512-IHKT00mwUVYE0zzbkDgNRP6SRzvfGCYsOxIRz8KsiaaHCcT9BWIkO+H9QRJseHBLOGBZkHUdHiqj6r0POsdytg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"

"@babel/plugin-transform-function-name@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-function-name/-/plugin-transform-function-name-7.12.13.tgz"
  integrity sha512-6K7gZycG0cmIwwF7uMK/ZqeCikCGVBdyP2J5SKNCXO5EOHcqi+z7Jwf8AmyDNcBgxET8DrEtCt/mPKPyAzXyqQ==
  dependencies:
    "@babel/helper-function-name" "^7.12.13"
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-literals@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-literals/-/plugin-transform-literals-7.12.13.tgz"
  integrity sha512-FW+WPjSR7hiUxMcKqyNjP05tQ2kmBCdpEpZHY1ARm96tGQCCBvXKnpjILtDplUnJ/eHZ0lALLM+d2lMFSpYJrQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-member-expression-literals@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-member-expression-literals/-/plugin-transform-member-expression-literals-7.12.13.tgz"
  integrity sha512-kxLkOsg8yir4YeEPHLuO2tXP9R/gTjpuTOjshqSpELUN3ZAg2jfDnKUvzzJxObun38sw3wm4Uu69sX/zA7iRvg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-modules-amd@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-modules-amd/-/plugin-transform-modules-amd-7.13.0.tgz"
  integrity sha512-EKy/E2NHhY/6Vw5d1k3rgoobftcNUmp9fGjb9XZwQLtTctsRBOTRO7RHHxfIky1ogMN5BxN7p9uMA3SzPfotMQ==
  dependencies:
    "@babel/helper-module-transforms" "^7.13.0"
    "@babel/helper-plugin-utils" "^7.13.0"
    babel-plugin-dynamic-import-node "^2.3.3"

"@babel/plugin-transform-modules-commonjs@^7.13.8":
  version "7.13.8"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-modules-commonjs/-/plugin-transform-modules-commonjs-7.13.8.tgz"
  integrity sha512-9QiOx4MEGglfYZ4XOnU79OHr6vIWUakIj9b4mioN8eQIoEh+pf5p/zEB36JpDFWA12nNMiRf7bfoRvl9Rn79Bw==
  dependencies:
    "@babel/helper-module-transforms" "^7.13.0"
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/helper-simple-access" "^7.12.13"
    babel-plugin-dynamic-import-node "^2.3.3"

"@babel/plugin-transform-modules-systemjs@^7.13.8":
  version "7.13.8"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-modules-systemjs/-/plugin-transform-modules-systemjs-7.13.8.tgz"
  integrity sha512-hwqctPYjhM6cWvVIlOIe27jCIBgHCsdH2xCJVAYQm7V5yTMoilbVMi9f6wKg0rpQAOn6ZG4AOyvCqFF/hUh6+A==
  dependencies:
    "@babel/helper-hoist-variables" "^7.13.0"
    "@babel/helper-module-transforms" "^7.13.0"
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/helper-validator-identifier" "^7.12.11"
    babel-plugin-dynamic-import-node "^2.3.3"

"@babel/plugin-transform-modules-umd@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-modules-umd/-/plugin-transform-modules-umd-7.13.0.tgz"
  integrity sha512-D/ILzAh6uyvkWjKKyFE/W0FzWwasv6vPTSqPcjxFqn6QpX3u8DjRVliq4F2BamO2Wee/om06Vyy+vPkNrd4wxw==
  dependencies:
    "@babel/helper-module-transforms" "^7.13.0"
    "@babel/helper-plugin-utils" "^7.13.0"

"@babel/plugin-transform-named-capturing-groups-regex@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-named-capturing-groups-regex/-/plugin-transform-named-capturing-groups-regex-7.12.13.tgz"
  integrity sha512-Xsm8P2hr5hAxyYblrfACXpQKdQbx4m2df9/ZZSQ8MAhsadw06+jW7s9zsSw6he+mJZXRlVMyEnVktJo4zjk1WA==
  dependencies:
    "@babel/helper-create-regexp-features-plugin" "^7.12.13"

"@babel/plugin-transform-new-target@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-new-target/-/plugin-transform-new-target-7.12.13.tgz"
  integrity sha512-/KY2hbLxrG5GTQ9zzZSc3xWiOy379pIETEhbtzwZcw9rvuaVV4Fqy7BYGYOWZnaoXIQYbbJ0ziXLa/sKcGCYEQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-object-super@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-object-super/-/plugin-transform-object-super-7.12.13.tgz"
  integrity sha512-JzYIcj3XtYspZDV8j9ulnoMPZZnF/Cj0LUxPOjR89BdBVx+zYJI9MdMIlUZjbXDX+6YVeS6I3e8op+qQ3BYBoQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"
    "@babel/helper-replace-supers" "^7.12.13"

"@babel/plugin-transform-parameters@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-parameters/-/plugin-transform-parameters-7.13.0.tgz"
  integrity sha512-Jt8k/h/mIwE2JFEOb3lURoY5C85ETcYPnbuAJ96zRBzh1XHtQZfs62ChZ6EP22QlC8c7Xqr9q+e1SU5qttwwjw==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"

"@babel/plugin-transform-property-literals@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-property-literals/-/plugin-transform-property-literals-7.12.13.tgz"
  integrity sha512-nqVigwVan+lR+g8Fj8Exl0UQX2kymtjcWfMOYM1vTYEKujeyv2SkMgazf2qNcK7l4SDiKyTA/nHCPqL4e2zo1A==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-regenerator@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-regenerator/-/plugin-transform-regenerator-7.12.13.tgz"
  integrity sha512-lxb2ZAvSLyJ2PEe47hoGWPmW22v7CtSl9jW8mingV4H2sEX/JOcrAj2nPuGWi56ERUm2bUpjKzONAuT6HCn2EA==
  dependencies:
    regenerator-transform "^0.14.2"

"@babel/plugin-transform-reserved-words@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-reserved-words/-/plugin-transform-reserved-words-7.12.13.tgz"
  integrity sha512-xhUPzDXxZN1QfiOy/I5tyye+TRz6lA7z6xaT4CLOjPRMVg1ldRf0LHw0TDBpYL4vG78556WuHdyO9oi5UmzZBg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-shorthand-properties@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-shorthand-properties/-/plugin-transform-shorthand-properties-7.12.13.tgz"
  integrity sha512-xpL49pqPnLtf0tVluuqvzWIgLEhuPpZzvs2yabUHSKRNlN7ScYU7aMlmavOeyXJZKgZKQRBlh8rHbKiJDraTSw==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-spread@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-spread/-/plugin-transform-spread-7.13.0.tgz"
  integrity sha512-V6vkiXijjzYeFmQTr3dBxPtZYLPcUfY34DebOU27jIl2M/Y8Egm52Hw82CSjjPqd54GTlJs5x+CR7HeNr24ckg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/helper-skip-transparent-expression-wrappers" "^7.12.1"

"@babel/plugin-transform-sticky-regex@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-sticky-regex/-/plugin-transform-sticky-regex-7.12.13.tgz"
  integrity sha512-Jc3JSaaWT8+fr7GRvQP02fKDsYk4K/lYwWq38r/UGfaxo89ajud321NH28KRQ7xy1Ybc0VUE5Pz8psjNNDUglg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-template-literals@^7.13.0":
  version "7.13.0"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-template-literals/-/plugin-transform-template-literals-7.13.0.tgz"
  integrity sha512-d67umW6nlfmr1iehCcBv69eSUSySk1EsIS8aTDX4Xo9qajAh6mYtcl4kJrBkGXuxZPEgVr7RVfAvNW6YQkd4Mw==
  dependencies:
    "@babel/helper-plugin-utils" "^7.13.0"

"@babel/plugin-transform-typeof-symbol@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-typeof-symbol/-/plugin-transform-typeof-symbol-7.12.13.tgz"
  integrity sha512-eKv/LmUJpMnu4npgfvs3LiHhJua5fo/CysENxa45YCQXZwKnGCQKAg87bvoqSW1fFT+HA32l03Qxsm8ouTY3ZQ==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-unicode-escapes@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-unicode-escapes/-/plugin-transform-unicode-escapes-7.12.13.tgz"
  integrity sha512-0bHEkdwJ/sN/ikBHfSmOXPypN/beiGqjo+o4/5K+vxEFNPRPdImhviPakMKG4x96l85emoa0Z6cDflsdBusZbw==
  dependencies:
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/plugin-transform-unicode-regex@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/plugin-transform-unicode-regex/-/plugin-transform-unicode-regex-7.12.13.tgz"
  integrity sha512-mDRzSNY7/zopwisPZ5kM9XKCfhchqIYwAKRERtEnhYscZB79VRekuRSoYbN0+KVe3y8+q1h6A4svXtP7N+UoCA==
  dependencies:
    "@babel/helper-create-regexp-features-plugin" "^7.12.13"
    "@babel/helper-plugin-utils" "^7.12.13"

"@babel/preset-env@^7.12.11":
  version "7.13.12"
  resolved "https://registry.npmjs.org/@babel/preset-env/-/preset-env-7.13.12.tgz"
  integrity sha512-JzElc6jk3Ko6zuZgBtjOd01pf9yYDEIH8BcqVuYIuOkzOwDesoa/Nz4gIo4lBG6K861KTV9TvIgmFuT6ytOaAA==
  dependencies:
    "@babel/compat-data" "^7.13.12"
    "@babel/helper-compilation-targets" "^7.13.10"
    "@babel/helper-plugin-utils" "^7.13.0"
    "@babel/helper-validator-option" "^7.12.17"
    "@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining" "^7.13.12"
    "@babel/plugin-proposal-async-generator-functions" "^7.13.8"
    "@babel/plugin-proposal-class-properties" "^7.13.0"
    "@babel/plugin-proposal-dynamic-import" "^7.13.8"
    "@babel/plugin-proposal-export-namespace-from" "^7.12.13"
    "@babel/plugin-proposal-json-strings" "^7.13.8"
    "@babel/plugin-proposal-logical-assignment-operators" "^7.13.8"
    "@babel/plugin-proposal-nullish-coalescing-operator" "^7.13.8"
    "@babel/plugin-proposal-numeric-separator" "^7.12.13"
    "@babel/plugin-proposal-object-rest-spread" "^7.13.8"
    "@babel/plugin-proposal-optional-catch-binding" "^7.13.8"
    "@babel/plugin-proposal-optional-chaining" "^7.13.12"
    "@babel/plugin-proposal-private-methods" "^7.13.0"
    "@babel/plugin-proposal-unicode-property-regex" "^7.12.13"
    "@babel/plugin-syntax-async-generators" "^7.8.4"
    "@babel/plugin-syntax-class-properties" "^7.12.13"
    "@babel/plugin-syntax-dynamic-import" "^7.8.3"
    "@babel/plugin-syntax-export-namespace-from" "^7.8.3"
    "@babel/plugin-syntax-json-strings" "^7.8.3"
    "@babel/plugin-syntax-logical-assignment-operators" "^7.10.4"
    "@babel/plugin-syntax-nullish-coalescing-operator" "^7.8.3"
    "@babel/plugin-syntax-numeric-separator" "^7.10.4"
    "@babel/plugin-syntax-object-rest-spread" "^7.8.3"
    "@babel/plugin-syntax-optional-catch-binding" "^7.8.3"
    "@babel/plugin-syntax-optional-chaining" "^7.8.3"
    "@babel/plugin-syntax-top-level-await" "^7.12.13"
    "@babel/plugin-transform-arrow-functions" "^7.13.0"
    "@babel/plugin-transform-async-to-generator" "^7.13.0"
    "@babel/plugin-transform-block-scoped-functions" "^7.12.13"
    "@babel/plugin-transform-block-scoping" "^7.12.13"
    "@babel/plugin-transform-classes" "^7.13.0"
    "@babel/plugin-transform-computed-properties" "^7.13.0"
    "@babel/plugin-transform-destructuring" "^7.13.0"
    "@babel/plugin-transform-dotall-regex" "^7.12.13"
    "@babel/plugin-transform-duplicate-keys" "^7.12.13"
    "@babel/plugin-transform-exponentiation-operator" "^7.12.13"
    "@babel/plugin-transform-for-of" "^7.13.0"
    "@babel/plugin-transform-function-name" "^7.12.13"
    "@babel/plugin-transform-literals" "^7.12.13"
    "@babel/plugin-transform-member-expression-literals" "^7.12.13"
    "@babel/plugin-transform-modules-amd" "^7.13.0"
    "@babel/plugin-transform-modules-commonjs" "^7.13.8"
    "@babel/plugin-transform-modules-systemjs" "^7.13.8"
    "@babel/plugin-transform-modules-umd" "^7.13.0"
    "@babel/plugin-transform-named-capturing-groups-regex" "^7.12.13"
    "@babel/plugin-transform-new-target" "^7.12.13"
    "@babel/plugin-transform-object-super" "^7.12.13"
    "@babel/plugin-transform-parameters" "^7.13.0"
    "@babel/plugin-transform-property-literals" "^7.12.13"
    "@babel/plugin-transform-regenerator" "^7.12.13"
    "@babel/plugin-transform-reserved-words" "^7.12.13"
    "@babel/plugin-transform-shorthand-properties" "^7.12.13"
    "@babel/plugin-transform-spread" "^7.13.0"
    "@babel/plugin-transform-sticky-regex" "^7.12.13"
    "@babel/plugin-transform-template-literals" "^7.13.0"
    "@babel/plugin-transform-typeof-symbol" "^7.12.13"
    "@babel/plugin-transform-unicode-escapes" "^7.12.13"
    "@babel/plugin-transform-unicode-regex" "^7.12.13"
    "@babel/preset-modules" "^0.1.4"
    "@babel/types" "^7.13.12"
    babel-plugin-polyfill-corejs2 "^0.1.4"
    babel-plugin-polyfill-corejs3 "^0.1.3"
    babel-plugin-polyfill-regenerator "^0.1.2"
    core-js-compat "^3.9.0"
    semver "^6.3.0"

"@babel/preset-modules@^0.1.4":
  version "0.1.4"
  resolved "https://registry.npmjs.org/@babel/preset-modules/-/preset-modules-0.1.4.tgz"
  integrity sha512-J36NhwnfdzpmH41M1DrnkkgAqhZaqr/NBdPfQ677mLzlaXo+oDiv1deyCDtgAhz8p328otdob0Du7+xgHGZbKg==
  dependencies:
    "@babel/helper-plugin-utils" "^7.0.0"
    "@babel/plugin-proposal-unicode-property-regex" "^7.4.4"
    "@babel/plugin-transform-dotall-regex" "^7.4.4"
    "@babel/types" "^7.4.4"
    esutils "^2.0.2"

"@babel/runtime@^7.8.4":
  version "7.13.10"
  resolved "https://registry.npmjs.org/@babel/runtime/-/runtime-7.13.10.tgz"
  integrity sha512-4QPkjJq6Ns3V/RgpEahRk+AGfL0eO6RHHtTWoNNr5mO49G6B5+X6d6THgWEAvTrznU5xYpbAlVKRYcsCgh/Akw==
  dependencies:
    regenerator-runtime "^0.13.4"

"@babel/template@^7.12.13":
  version "7.12.13"
  resolved "https://registry.npmjs.org/@babel/template/-/template-7.12.13.tgz"
  integrity sha512-/7xxiGA57xMo/P2GVvdEumr8ONhFOhfgq2ihK3h1e6THqzTAkHbkXgB0xI9yeTfIUoH3+oAeHhqm/I43OTbbjA==
  dependencies:
    "@babel/code-frame" "^7.12.13"
    "@babel/parser" "^7.12.13"
    "@babel/types" "^7.12.13"

"@babel/traverse@^7.13.0", "@babel/traverse@^7.13.13":
  version "7.13.13"
  resolved "https://registry.npmjs.org/@babel/traverse/-/traverse-7.13.13.tgz"
  integrity sha512-CblEcwmXKR6eP43oQGG++0QMTtCjAsa3frUuzHoiIJWpaIIi8dwMyEFUJoXRLxagGqCK+jALRwIO+o3R9p/uUg==
  dependencies:
    "@babel/code-frame" "^7.12.13"
    "@babel/generator" "^7.13.9"
    "@babel/helper-function-name" "^7.12.13"
    "@babel/helper-split-export-declaration" "^7.12.13"
    "@babel/parser" "^7.13.13"
    "@babel/types" "^7.13.13"
    debug "^4.1.0"
    globals "^11.1.0"

"@babel/types@^7.12.1", "@babel/types@^7.12.13", "@babel/types@^7.13.0", "@babel/types@^7.13.12", "@babel/types@^7.13.13", "@babel/types@^7.13.14", "@babel/types@^7.4.4":
  version "7.13.14"
  resolved "https://registry.npmjs.org/@babel/types/-/types-7.13.14.tgz"
  integrity sha512-A2aa3QTkWoyqsZZFl56MLUsfmh7O0gN41IPvXAE/++8ojpbz12SszD7JEGYVdn4f9Kt4amIei07swF1h4AqmmQ==
  dependencies:
    "@babel/helper-validator-identifier" "^7.12.11"
    lodash "^4.17.19"
    to-fast-properties "^2.0.0"

"@discoveryjs/json-ext@^0.5.0":
  version "0.5.2"
  resolved "https://registry.npmjs.org/@discoveryjs/json-ext/-/json-ext-0.5.2.tgz"
  integrity sha512-HyYEUDeIj5rRQU2Hk5HTB2uHsbRQpF70nvMhVzi+VJR0X+xNEhjPui4/kBf3VeH/wqD28PT4sVOm8qqLjBrSZg==

"@types/ammo.js@github:osman-turan/ammo.js-typings":
  version "1.0.3"
  resolved "https://codeload.github.com/osman-turan/ammo.js-typings/tar.gz/4270a20c9f992969ffbd3e989aaa0efbe10fd5c4"
  integrity sha512-cdnG5dDRDifgBrpOAfS4a9y3DAET/tQkMH/AkEyoIdfUpLOGvBTk3ohRADv8LXasNCI14BfbN6scyw5D0oyxnQ==

"@types/anymatch@*":
  version "1.3.1"
  resolved "https://registry.npmjs.org/@types/anymatch/-/anymatch-1.3.1.tgz"
  integrity sha512-/+CRPXpBDpo2RK9C68N3b2cOvO0Cf5B9aPijHsoDQTHivnGSObdOF2BRQOYjojWTDy6nQvMjmqRXIxH55VjxxA==

"@types/eslint-scope@^3.7.0":
  version "3.7.0"
  resolved "https://registry.npmjs.org/@types/eslint-scope/-/eslint-scope-3.7.0.tgz"
  integrity sha512-O/ql2+rrCUe2W2rs7wMR+GqPRcgB6UiqN5RhrR5xruFlY7l9YLMn0ZkDzjoHLeiFkR8MCQZVudUuuvQ2BLC9Qw==
  dependencies:
    "@types/eslint" "*"
    "@types/estree" "*"

"@types/eslint@*":
  version "7.2.8"
  resolved "https://registry.npmjs.org/@types/eslint/-/eslint-7.2.8.tgz"
  integrity sha512-RTKvBsfz0T8CKOGZMfuluDNyMFHnu5lvNr4hWEsQeHXH6FcmIDIozOyWMh36nLGMwVd5UFNXC2xztA8lln22MQ==
  dependencies:
    "@types/estree" "*"
    "@types/json-schema" "*"

"@types/estree@*", "@types/estree@^0.0.46":
  version "0.0.46"
  resolved "https://registry.npmjs.org/@types/estree/-/estree-0.0.46.tgz"
  integrity sha512-laIjwTQaD+5DukBZaygQ79K1Z0jb1bPEMRrkXSLjtCcZm+abyp5YbrqpSLzD42FwWW6gK/aS4NYpJ804nG2brg==

"@types/glob@^7.1.1":
  version "7.1.3"
  resolved "https://registry.npmjs.org/@types/glob/-/glob-7.1.3.tgz"
  integrity sha512-SEYeGAIQIQX8NN6LDKprLjbrd5dARM5EXsd8GI/A5l0apYI1fGMWgPHSe4ZKL4eozlAyI+doUE9XbYS4xCkQ1w==
  dependencies:
    "@types/minimatch" "*"
    "@types/node" "*"

"@types/html-minifier-terser@^5.0.0":
  version "5.1.1"
  resolved "https://registry.npmjs.org/@types/html-minifier-terser/-/html-minifier-terser-5.1.1.tgz"
  integrity sha512-giAlZwstKbmvMk1OO7WXSj4OZ0keXAcl2TQq4LWHiiPH2ByaH7WeUzng+Qej8UPxxv+8lRTuouo0iaNDBuzIBA==

"@types/json-schema@*", "@types/json-schema@^7.0.5", "@types/json-schema@^7.0.6":
  version "7.0.7"
  resolved "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.7.tgz"
  integrity sha512-cxWFQVseBm6O9Gbw1IWb8r6OS4OhSt3hPZLkFApLjM8TEXROBuQGLAH2i2gZpcXdLBIrpXuTDhH7Vbm1iXmNGA==

"@types/minimatch@*":
  version "3.0.4"
  resolved "https://registry.npmjs.org/@types/minimatch/-/minimatch-3.0.4.tgz"
  integrity sha512-1z8k4wzFnNjVK/tlxvrWuK5WMt6mydWWP7+zvH5eFep4oj+UkrfiJTRtjCeBXNpwaA/FYqqtb4/QS4ianFpIRA==

"@types/node@*":
  version "14.14.37"
  resolved "https://registry.npmjs.org/@types/node/-/node-14.14.37.tgz"
  integrity sha512-XYmBiy+ohOR4Lh5jE379fV2IU+6Jn4g5qASinhitfyO71b/sCo6MKsMLF5tc7Zf2CE8hViVQyYSobJNke8OvUw==

"@types/source-list-map@*":
  version "0.1.2"
  resolved "https://registry.npmjs.org/@types/source-list-map/-/source-list-map-0.1.2.tgz"
  integrity sha512-K5K+yml8LTo9bWJI/rECfIPrGgxdpeNbj+d53lwN4QjW1MCwlkhUms+gtdzigTeUyBr09+u8BwOIY3MXvHdcsA==

"@types/tapable@^1", "@types/tapable@^1.0.5":
  version "1.0.7"
  resolved "https://registry.npmjs.org/@types/tapable/-/tapable-1.0.7.tgz"
  integrity sha512-0VBprVqfgFD7Ehb2vd8Lh9TG3jP98gvr8rgehQqzztZNI7o8zS8Ad4jyZneKELphpuE212D8J70LnSNQSyO6bQ==

"@types/uglify-js@*":
  version "3.13.0"
  resolved "https://registry.npmjs.org/@types/uglify-js/-/uglify-js-3.13.0.tgz"
  integrity sha512-EGkrJD5Uy+Pg0NUR8uA4bJ5WMfljyad0G+784vLCNUkD+QwOJXUbBYExXfVGf7YtyzdQp3L/XMYcliB987kL5Q==
  dependencies:
    source-map "^0.6.1"

"@types/webpack-sources@*":
  version "2.1.0"
  resolved "https://registry.npmjs.org/@types/webpack-sources/-/webpack-sources-2.1.0.tgz"
  integrity sha512-LXn/oYIpBeucgP1EIJbKQ2/4ZmpvRl+dlrFdX7+94SKRUV3Evy3FsfMZY318vGhkWUS5MPhtOM3w1/hCOAOXcg==
  dependencies:
    "@types/node" "*"
    "@types/source-list-map" "*"
    source-map "^0.7.3"

"@types/webpack@^4.41.8":
  version "4.41.27"
  resolved "https://registry.npmjs.org/@types/webpack/-/webpack-4.41.27.tgz"
  integrity sha512-wK/oi5gcHi72VMTbOaQ70VcDxSQ1uX8S2tukBK9ARuGXrYM/+u4ou73roc7trXDNmCxCoerE8zruQqX/wuHszA==
  dependencies:
    "@types/anymatch" "*"
    "@types/node" "*"
    "@types/tapable" "^1"
    "@types/uglify-js" "*"
    "@types/webpack-sources" "*"
    source-map "^0.6.0"

"@webassemblyjs/ast@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/ast/-/ast-1.11.0.tgz"
  integrity sha512-kX2W49LWsbthrmIRMbQZuQDhGtjyqXfEmmHyEi4XWnSZtPmxY0+3anPIzsnRb45VH/J55zlOfWvZuY47aJZTJg==
  dependencies:
    "@webassemblyjs/helper-numbers" "1.11.0"
    "@webassemblyjs/helper-wasm-bytecode" "1.11.0"

"@webassemblyjs/floating-point-hex-parser@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/floating-point-hex-parser/-/floating-point-hex-parser-1.11.0.tgz"
  integrity sha512-Q/aVYs/VnPDVYvsCBL/gSgwmfjeCb4LW8+TMrO3cSzJImgv8lxxEPM2JA5jMrivE7LSz3V+PFqtMbls3m1exDA==

"@webassemblyjs/helper-api-error@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/helper-api-error/-/helper-api-error-1.11.0.tgz"
  integrity sha512-baT/va95eXiXb2QflSx95QGT5ClzWpGaa8L7JnJbgzoYeaA27FCvuBXU758l+KXWRndEmUXjP0Q5fibhavIn8w==

"@webassemblyjs/helper-buffer@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/helper-buffer/-/helper-buffer-1.11.0.tgz"
  integrity sha512-u9HPBEl4DS+vA8qLQdEQ6N/eJQ7gT7aNvMIo8AAWvAl/xMrcOSiI2M0MAnMCy3jIFke7bEee/JwdX1nUpCtdyA==

"@webassemblyjs/helper-numbers@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/helper-numbers/-/helper-numbers-1.11.0.tgz"
  integrity sha512-DhRQKelIj01s5IgdsOJMKLppI+4zpmcMQ3XboFPLwCpSNH6Hqo1ritgHgD0nqHeSYqofA6aBN/NmXuGjM1jEfQ==
  dependencies:
    "@webassemblyjs/floating-point-hex-parser" "1.11.0"
    "@webassemblyjs/helper-api-error" "1.11.0"
    "@xtuc/long" "4.2.2"

"@webassemblyjs/helper-wasm-bytecode@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/helper-wasm-bytecode/-/helper-wasm-bytecode-1.11.0.tgz"
  integrity sha512-MbmhvxXExm542tWREgSFnOVo07fDpsBJg3sIl6fSp9xuu75eGz5lz31q7wTLffwL3Za7XNRCMZy210+tnsUSEA==

"@webassemblyjs/helper-wasm-section@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/helper-wasm-section/-/helper-wasm-section-1.11.0.tgz"
  integrity sha512-3Eb88hcbfY/FCukrg6i3EH8H2UsD7x8Vy47iVJrP967A9JGqgBVL9aH71SETPx1JrGsOUVLo0c7vMCN22ytJew==
  dependencies:
    "@webassemblyjs/ast" "1.11.0"
    "@webassemblyjs/helper-buffer" "1.11.0"
    "@webassemblyjs/helper-wasm-bytecode" "1.11.0"
    "@webassemblyjs/wasm-gen" "1.11.0"

"@webassemblyjs/ieee754@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/ieee754/-/ieee754-1.11.0.tgz"
  integrity sha512-KXzOqpcYQwAfeQ6WbF6HXo+0udBNmw0iXDmEK5sFlmQdmND+tr773Ti8/5T/M6Tl/413ArSJErATd8In3B+WBA==
  dependencies:
    "@xtuc/ieee754" "^1.2.0"

"@webassemblyjs/leb128@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/leb128/-/leb128-1.11.0.tgz"
  integrity sha512-aqbsHa1mSQAbeeNcl38un6qVY++hh8OpCOzxhixSYgbRfNWcxJNJQwe2rezK9XEcssJbbWIkblaJRwGMS9zp+g==
  dependencies:
    "@xtuc/long" "4.2.2"

"@webassemblyjs/utf8@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/utf8/-/utf8-1.11.0.tgz"
  integrity sha512-A/lclGxH6SpSLSyFowMzO/+aDEPU4hvEiooCMXQPcQFPPJaYcPQNKGOCLUySJsYJ4trbpr+Fs08n4jelkVTGVw==

"@webassemblyjs/wasm-edit@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/wasm-edit/-/wasm-edit-1.11.0.tgz"
  integrity sha512-JHQ0damXy0G6J9ucyKVXO2j08JVJ2ntkdJlq1UTiUrIgfGMmA7Ik5VdC/L8hBK46kVJgujkBIoMtT8yVr+yVOQ==
  dependencies:
    "@webassemblyjs/ast" "1.11.0"
    "@webassemblyjs/helper-buffer" "1.11.0"
    "@webassemblyjs/helper-wasm-bytecode" "1.11.0"
    "@webassemblyjs/helper-wasm-section" "1.11.0"
    "@webassemblyjs/wasm-gen" "1.11.0"
    "@webassemblyjs/wasm-opt" "1.11.0"
    "@webassemblyjs/wasm-parser" "1.11.0"
    "@webassemblyjs/wast-printer" "1.11.0"

"@webassemblyjs/wasm-gen@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/wasm-gen/-/wasm-gen-1.11.0.tgz"
  integrity sha512-BEUv1aj0WptCZ9kIS30th5ILASUnAPEvE3tVMTrItnZRT9tXCLW2LEXT8ezLw59rqPP9klh9LPmpU+WmRQmCPQ==
  dependencies:
    "@webassemblyjs/ast" "1.11.0"
    "@webassemblyjs/helper-wasm-bytecode" "1.11.0"
    "@webassemblyjs/ieee754" "1.11.0"
    "@webassemblyjs/leb128" "1.11.0"
    "@webassemblyjs/utf8" "1.11.0"

"@webassemblyjs/wasm-opt@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/wasm-opt/-/wasm-opt-1.11.0.tgz"
  integrity sha512-tHUSP5F4ywyh3hZ0+fDQuWxKx3mJiPeFufg+9gwTpYp324mPCQgnuVKwzLTZVqj0duRDovnPaZqDwoyhIO8kYg==
  dependencies:
    "@webassemblyjs/ast" "1.11.0"
    "@webassemblyjs/helper-buffer" "1.11.0"
    "@webassemblyjs/wasm-gen" "1.11.0"
    "@webassemblyjs/wasm-parser" "1.11.0"

"@webassemblyjs/wasm-parser@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/wasm-parser/-/wasm-parser-1.11.0.tgz"
  integrity sha512-6L285Sgu9gphrcpDXINvm0M9BskznnzJTE7gYkjDbxET28shDqp27wpruyx3C2S/dvEwiigBwLA1cz7lNUi0kw==
  dependencies:
    "@webassemblyjs/ast" "1.11.0"
    "@webassemblyjs/helper-api-error" "1.11.0"
    "@webassemblyjs/helper-wasm-bytecode" "1.11.0"
    "@webassemblyjs/ieee754" "1.11.0"
    "@webassemblyjs/leb128" "1.11.0"
    "@webassemblyjs/utf8" "1.11.0"

"@webassemblyjs/wast-printer@1.11.0":
  version "1.11.0"
  resolved "https://registry.npmjs.org/@webassemblyjs/wast-printer/-/wast-printer-1.11.0.tgz"
  integrity sha512-Fg5OX46pRdTgB7rKIUojkh9vXaVN6sGYCnEiJN1GYkb0RPwShZXp6KTDqmoMdQPKhcroOXh3fEzmkWmCYaKYhQ==
  dependencies:
    "@webassemblyjs/ast" "1.11.0"
    "@xtuc/long" "4.2.2"

"@webpack-cli/configtest@^1.0.2":
  version "1.0.2"
  resolved "https://registry.npmjs.org/@webpack-cli/configtest/-/configtest-1.0.2.tgz"
  integrity sha512-3OBzV2fBGZ5TBfdW50cha1lHDVf9vlvRXnjpVbJBa20pSZQaSkMJZiwA8V2vD9ogyeXn8nU5s5A6mHyf5jhMzA==

"@webpack-cli/info@^1.2.3":
  version "1.2.3"
  resolved "https://registry.npmjs.org/@webpack-cli/info/-/info-1.2.3.tgz"
  integrity sha512-lLek3/T7u40lTqzCGpC6CAbY6+vXhdhmwFRxZLMnRm6/sIF/7qMpT8MocXCRQfz0JAh63wpbXLMnsQ5162WS7Q==
  dependencies:
    envinfo "^7.7.3"

"@webpack-cli/serve@^1.3.1":
  version "1.3.1"
  resolved "https://registry.npmjs.org/@webpack-cli/serve/-/serve-1.3.1.tgz"
  integrity sha512-0qXvpeYO6vaNoRBI52/UsbcaBydJCggoBBnIo/ovQQdn6fug0BgwsjorV1hVS7fMqGVTZGcVxv8334gjmbj5hw==

"@xtuc/ieee754@^1.2.0":
  version "1.2.0"
  resolved "https://registry.npmjs.org/@xtuc/ieee754/-/ieee754-1.2.0.tgz"
  integrity sha512-DX8nKgqcGwsc0eJSqYt5lwP4DH5FlHnmuWWBRy7X0NcaGR0ZtuyeESgMwTYVEtxmsNGY+qit4QYT/MIYTOTPeA==

"@xtuc/long@4.2.2":
  version "4.2.2"
  resolved "https://registry.npmjs.org/@xtuc/long/-/long-4.2.2.tgz"
  integrity sha512-NuHqBY1PB/D8xU6s/thBgOAiAP7HOYDQ32+BFZILJ8ivkUkAHQnWfn6WhL79Owj1qmUnoN/YPhktdIoucipkAQ==

accepts@~1.3.4, accepts@~1.3.5, accepts@~1.3.7:
  version "1.3.7"
  resolved "https://registry.npmjs.org/accepts/-/accepts-1.3.7.tgz"
  integrity sha512-Il80Qs2WjYlJIBNzNkK6KYqlVMTbZLXgHx2oT0pU/fjRHyEp+PEfEPY0R3WCwAGVOtauxh1hOxNgIf5bv7dQpA==
  dependencies:
    mime-types "~2.1.24"
    negotiator "0.6.2"

acorn@^8.0.4:
  version "8.1.0"
  resolved "https://registry.npmjs.org/acorn/-/acorn-8.1.0.tgz"
  integrity sha512-LWCF/Wn0nfHOmJ9rzQApGnxnvgfROzGilS8936rqN/lfcYkY9MYZzdMqN+2NJ4SlTc+m5HiSa+kNfDtI64dwUA==

ajv-errors@^1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/ajv-errors/-/ajv-errors-1.0.1.tgz"
  integrity sha512-DCRfO/4nQ+89p/RK43i8Ezd41EqdGIU4ld7nGF8OQ14oc/we5rEntLCUa7+jrn3nn83BosfwZA0wb4pon2o8iQ==

ajv-keywords@^3.1.0, ajv-keywords@^3.5.2:
  version "3.5.2"
  resolved "https://registry.npmjs.org/ajv-keywords/-/ajv-keywords-3.5.2.tgz"
  integrity sha512-5p6WTN0DdTGVQk6VjcEju19IgaHudalcfabD7yhDGeA6bcQnmL+CpveLJq/3hvfwd1aof6L386Ougkx6RfyMIQ==

ajv@^6.1.0, ajv@^6.12.4, ajv@^6.12.5, ajv@^6.9.1, ajv@>=5.0.0:
  version "6.12.6"
  resolved "https://registry.npmjs.org/ajv/-/ajv-6.12.6.tgz"
  integrity sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==
  dependencies:
    fast-deep-equal "^3.1.1"
    fast-json-stable-stringify "^2.0.0"
    json-schema-traverse "^0.4.1"
    uri-js "^4.2.2"

ammo.js@kripken/ammo.js:
  version "0.0.2"
  resolved "https://codeload.github.com/kripken/ammo.js/tar.gz/05a9b87a560c40cfebbcfc9b5ec871278dfb73c0"
  integrity sha512-8tnv8Noiz7raOM0sKowY2C+i/Z9iw3FVRMPziOQjp+g9LU+0IJjPgh655r3BXsyeo07sYjrGC+SUgd8cspla+Q==

ansi-colors@^3.0.0:
  version "3.2.4"
  resolved "https://registry.npmjs.org/ansi-colors/-/ansi-colors-3.2.4.tgz"
  integrity sha512-hHUXGagefjN2iRrID63xckIvotOXOojhQKWIPUZ4mNUZ9nLZW+7FMNoE1lOkEhNWYsx/7ysGIuJYCiMAA9FnrA==

ansi-colors@^4.1.1:
  version "4.1.1"
  resolved "https://registry.npmjs.org/ansi-colors/-/ansi-colors-4.1.1.tgz"
  integrity sha512-JoX0apGbHaUJBNl6yF+p6JAFYZ666/hhCGKN5t9QFjbJQKUU/g8MNbFDbvfrgKXvI1QpZplPOnwIo99lX/AAmA==

ansi-html@0.0.7:
  version "0.0.7"
  resolved "https://registry.npmjs.org/ansi-html/-/ansi-html-0.0.7.tgz"
  integrity sha1-gTWEAhliqenm/QOflA0S9WynhZ4= sha512-JoAxEa1DfP9m2xfB/y2r/aKcwXNlltr4+0QSBC4TrLfcxyvepX2Pv0t/xpgGV5bGsDzCYV8SzjWgyCW0T9yYbA==

ansi-regex@^2.0.0:
  version "2.1.1"
  resolved "https://registry.npmjs.org/ansi-regex/-/ansi-regex-2.1.1.tgz"
  integrity sha1-w7M6te42DYbg5ijwRorn7yfWVN8= sha512-TIGnTpdo+E3+pCyAluZvtED5p5wCqLdezCyhPZzKPcxvFplEt4i+W7OONCKgeZFT3+y5NZZfOOS/Bdcanm1MYA==

ansi-regex@^4.1.0:
  version "4.1.0"
  resolved "https://registry.npmjs.org/ansi-regex/-/ansi-regex-4.1.0.tgz"
  integrity sha512-1apePfXM1UOSqw0o9IiFAovVz9M5S1Dg+4TrDwfMewQ6p/rmMueb7tWZjQ1rx4Loy1ArBggoqGpfqqdI4rondg==

ansi-styles@^3.2.0, ansi-styles@^3.2.1:
  version "3.2.1"
  resolved "https://registry.npmjs.org/ansi-styles/-/ansi-styles-3.2.1.tgz"
  integrity sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==
  dependencies:
    color-convert "^1.9.0"

anymatch@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/anymatch/-/anymatch-2.0.0.tgz"
  integrity sha512-5teOsQWABXHHBFP9y3skS5P3d/WfWXpv3FUpy+LorMrNYaT9pI4oLMQX7jzQ2KklNpGpWHzdCXTDT2Y3XGlZBw==
  dependencies:
    micromatch "^3.1.4"
    normalize-path "^2.1.1"

arr-diff@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/arr-diff/-/arr-diff-4.0.0.tgz"
  integrity sha1-1kYQdP6/7HHn4VI1dhoyml3HxSA= sha512-YVIQ82gZPGBebQV/a8dar4AitzCQs0jjXwMPZllpXMaGjXPYVUawSxQrRsjhjupyVxEvbHgUmIhKVlND+j02kA==

arr-flatten@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/arr-flatten/-/arr-flatten-1.1.0.tgz"
  integrity sha512-L3hKV5R/p5o81R7O02IGnwpDmkp6E982XhtbuwSe3O4qOtMMMtodicASA1Cny2U+aCXcNpml+m4dPsvsJ3jatg==

arr-union@^3.1.0:
  version "3.1.0"
  resolved "https://registry.npmjs.org/arr-union/-/arr-union-3.1.0.tgz"
  integrity sha1-45sJrqne+Gao8gbiiK9jkZuuOcQ= sha512-sKpyeERZ02v1FeCZT8lrfJq5u6goHCtpTAzPwJYe7c8SPFOboNjNg1vz2L4VTn9T4PQxEx13TbXLmYUcS6Ug7Q==

array-flatten@^2.1.0:
  version "2.1.2"
  resolved "https://registry.npmjs.org/array-flatten/-/array-flatten-2.1.2.tgz"
  integrity sha512-hNfzcOV8W4NdualtqBFPyVO+54DSJuZGY9qT4pRroB6S9e3iiido2ISIC5h9R2sPJ8H3FHCIiEnsv1lPXO3KtQ==

array-flatten@1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz"
  integrity sha1-ml9pkFGx5wczKPKgCJaLZOopVdI= sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==

array-union@^1.0.1:
  version "1.0.2"
  resolved "https://registry.npmjs.org/array-union/-/array-union-1.0.2.tgz"
  integrity sha1-mjRBDk9OPaI96jdb5b5w8kd47Dk= sha512-Dxr6QJj/RdU/hCaBjOfxW+q6lyuVE6JFWIrAUpuOOhoJJoQ99cUn3igRaHVB5P9WrgFVN0FfArM3x0cueOU8ng==
  dependencies:
    array-uniq "^1.0.1"

array-uniq@^1.0.1:
  version "1.0.3"
  resolved "https://registry.npmjs.org/array-uniq/-/array-uniq-1.0.3.tgz"
  integrity sha1-r2rId6Jcx/dOBYiUdThY39sk/bY= sha512-MNha4BWQ6JbwhFhj03YK552f7cb3AzoE8SzeljgChvL1dl3IcvggXVz1DilzySZkCja+CXuZbdW7yATchWn8/Q==

array-unique@^0.3.2:
  version "0.3.2"
  resolved "https://registry.npmjs.org/array-unique/-/array-unique-0.3.2.tgz"
  integrity sha1-qJS3XUvE9s1nnvMkSp/Y9Gri1Cg= sha512-SleRWjh9JUud2wH1hPs9rZBZ33H6T9HOiL0uwGnGx9FpE6wKGyfWugmbkEOIs6qWrZhg0LWeLziLrEwQJhs5mQ==

assign-symbols@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/assign-symbols/-/assign-symbols-1.0.0.tgz"
  integrity sha1-WWZ/QfrdTyDMvCu5a41Pf3jsA2c= sha512-Q+JC7Whu8HhmTdBph/Tq59IoRtoy6KAm5zzPv00WdujX82lbAL8K7WVjne7vdCsAmbF4AYaDOPyO3k0kl8qIrw==

async-each@^1.0.1:
  version "1.0.3"
  resolved "https://registry.npmjs.org/async-each/-/async-each-1.0.3.tgz"
  integrity sha512-z/WhQ5FPySLdvREByI2vZiTWwCnF0moMJ1hK9YQwDTHKh6I7/uSckMetoRGb5UBZPC1z0jlw+n/XCgjeH7y1AQ==

async-limiter@~1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/async-limiter/-/async-limiter-1.0.1.tgz"
  integrity sha512-csOlWGAcRFJaI6m+F2WKdnMKr4HhdhFVBk0H/QbJFMCr+uO2kwohwXQPxw/9OCxp05r5ghVBFSyioixx3gfkNQ==

async@^2.6.2:
  version "2.6.3"
  resolved "https://registry.npmjs.org/async/-/async-2.6.3.tgz"
  integrity sha512-zflvls11DCy+dQWzTW2dzuilv8Z5X/pjfmZOWba6TNIVDm+2UDaJmXSOXlasHKfNBs8oo3M0aT50fDEWfKZjXg==
  dependencies:
    lodash "^4.17.14"

atob@^2.1.2:
  version "2.1.2"
  resolved "https://registry.npmjs.org/atob/-/atob-2.1.2.tgz"
  integrity sha512-Wm6ukoaOGJi/73p/cl2GvLjTI5JM1k/O14isD73YML8StrH/7/lRFgmg8nICZgD3bZZvjwCGxtMOD3wWNAu8cg==

babel-loader@^8.2.2:
  version "8.2.2"
  resolved "https://registry.npmjs.org/babel-loader/-/babel-loader-8.2.2.tgz"
  integrity sha512-JvTd0/D889PQBtUXJ2PXaKU/pjZDMtHA9V2ecm+eNRmmBCMR09a+fmpGTNwnJtFmFl5Ei7Vy47LjBb+L0wQ99g==
  dependencies:
    find-cache-dir "^3.3.1"
    loader-utils "^1.4.0"
    make-dir "^3.1.0"
    schema-utils "^2.6.5"

babel-plugin-dynamic-import-node@^2.3.3:
  version "2.3.3"
  resolved "https://registry.npmjs.org/babel-plugin-dynamic-import-node/-/babel-plugin-dynamic-import-node-2.3.3.tgz"
  integrity sha512-jZVI+s9Zg3IqA/kdi0i6UDCybUI3aSBLnglhYbSSjKlV7yF1F/5LWv8MakQmvYpnbJDS6fcBL2KzHSxNCMtWSQ==
  dependencies:
    object.assign "^4.1.0"

babel-plugin-polyfill-corejs2@^0.1.4:
  version "0.1.10"
  resolved "https://registry.npmjs.org/babel-plugin-polyfill-corejs2/-/babel-plugin-polyfill-corejs2-0.1.10.tgz"
  integrity sha512-DO95wD4g0A8KRaHKi0D51NdGXzvpqVLnLu5BTvDlpqUEpTmeEtypgC1xqesORaWmiUOQI14UHKlzNd9iZ2G3ZA==
  dependencies:
    "@babel/compat-data" "^7.13.0"
    "@babel/helper-define-polyfill-provider" "^0.1.5"
    semver "^6.1.1"

babel-plugin-polyfill-corejs3@^0.1.3:
  version "0.1.7"
  resolved "https://registry.npmjs.org/babel-plugin-polyfill-corejs3/-/babel-plugin-polyfill-corejs3-0.1.7.tgz"
  integrity sha512-u+gbS9bbPhZWEeyy1oR/YaaSpod/KDT07arZHb80aTpl8H5ZBq+uN1nN9/xtX7jQyfLdPfoqI4Rue/MQSWJquw==
  dependencies:
    "@babel/helper-define-polyfill-provider" "^0.1.5"
    core-js-compat "^3.8.1"

babel-plugin-polyfill-regenerator@^0.1.2:
  version "0.1.6"
  resolved "https://registry.npmjs.org/babel-plugin-polyfill-regenerator/-/babel-plugin-polyfill-regenerator-0.1.6.tgz"
  integrity sha512-OUrYG9iKPKz8NxswXbRAdSwF0GhRdIEMTloQATJi4bDuFqrXaXcCUT/VGNrr8pBcjMh1RxZ7Xt9cytVJTJfvMg==
  dependencies:
    "@babel/helper-define-polyfill-provider" "^0.1.5"

balanced-match@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.0.tgz"
  integrity sha1-ibTRmasr7kneFk6gK4nORi1xt2c= sha512-9Y0g0Q8rmSt+H33DfKv7FOc3v+iRI+o1lbzt8jGcIosYW37IIW/2XVYq5NPdmaD5NQ59Nk26Kl/vZbwW9Fr8vg==

base@^0.11.1:
  version "0.11.2"
  resolved "https://registry.npmjs.org/base/-/base-0.11.2.tgz"
  integrity sha512-5T6P4xPgpp0YDFvSWwEZ4NoE3aM4QBQXDzmVbraCkFj8zHM+mba8SyqB5DbZWyR7mYHo6Y7BdQo3MoA4m0TeQg==
  dependencies:
    cache-base "^1.0.1"
    class-utils "^0.3.5"
    component-emitter "^1.2.1"
    define-property "^1.0.0"
    isobject "^3.0.1"
    mixin-deep "^1.2.0"
    pascalcase "^0.1.1"

batch@0.6.1:
  version "0.6.1"
  resolved "https://registry.npmjs.org/batch/-/batch-0.6.1.tgz"
  integrity sha1-3DQxT05nkxgJP8dgJyUl+UvyXBY= sha512-x+VAiMRL6UPkx+kudNvxTl6hB2XNNCG2r+7wixVfIYwu/2HKRXimwQyaumLjMveWvT2Hkd/cAJw+QBMfJ/EKVw==

big.js@^5.2.2:
  version "5.2.2"
  resolved "https://registry.npmjs.org/big.js/-/big.js-5.2.2.tgz"
  integrity sha512-vyL2OymJxmarO8gxMr0mhChsO9QGwhynfuu4+MHTAW6czfq9humCB7rKpUjDd9YUiDPU4mzpyupFSvOClAwbmQ==

binary-extensions@^1.0.0:
  version "1.13.1"
  resolved "https://registry.npmjs.org/binary-extensions/-/binary-extensions-1.13.1.tgz"
  integrity sha512-Un7MIEDdUC5gNpcGDV97op1Ywk748MpHcFTHoYs6qnj1Z3j7I53VG3nwZhKzoBZmbdRNnb6WRdFlwl7tSDuZGw==

bindings@^1.5.0:
  version "1.5.0"
  resolved "https://registry.npmjs.org/bindings/-/bindings-1.5.0.tgz"
  integrity sha512-p2q/t/mhvuOj/UeLlV6566GD/guowlr0hHxClI0W9m7MWYkL1F0hLo+0Aexs9HSPCtR1SXQ0TD3MMKrXZajbiQ==
  dependencies:
    file-uri-to-path "1.0.0"

body-parser@1.19.0:
  version "1.19.0"
  resolved "https://registry.npmjs.org/body-parser/-/body-parser-1.19.0.tgz"
  integrity sha512-dhEPs72UPbDnAQJ9ZKMNTP6ptJaionhP5cBb541nXPlW60Jepo9RV/a4fX4XWW9CuFNK22krhrj1+rgzifNCsw==
  dependencies:
    bytes "3.1.0"
    content-type "~1.0.4"
    debug "2.6.9"
    depd "~1.1.2"
    http-errors "1.7.2"
    iconv-lite "0.4.24"
    on-finished "~2.3.0"
    qs "6.7.0"
    raw-body "2.4.0"
    type-is "~1.6.17"

bonjour@^3.5.0:
  version "3.5.0"
  resolved "https://registry.npmjs.org/bonjour/-/bonjour-3.5.0.tgz"
  integrity sha1-jokKGD2O6aI5OzhExpGkK897yfU= sha512-RaVTblr+OnEli0r/ud8InrU7D+G0y6aJhlxaLa6Pwty4+xoxboF1BsUI45tujvRpbj9dQVoglChqonGAsjEBYg==
  dependencies:
    array-flatten "^2.1.0"
    deep-equal "^1.0.1"
    dns-equal "^1.0.0"
    dns-txt "^2.0.2"
    multicast-dns "^6.0.1"
    multicast-dns-service-types "^1.1.0"

boolbase@^1.0.0, boolbase@~1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/boolbase/-/boolbase-1.0.0.tgz"
  integrity sha1-aN/1++YMUes3cl6p4+0xDcwed24= sha512-JZOSA7Mo9sNGB8+UjSgzdLtokWAky1zbztM3WRLCbZ70/3cTANmQmOdR7y2g+J0e2WXywy1yS468tY+IruqEww==

brace-expansion@^1.1.7:
  version "1.1.11"
  resolved "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.11.tgz"
  integrity sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==
  dependencies:
    balanced-match "^1.0.0"
    concat-map "0.0.1"

braces@^2.3.1, braces@^2.3.2:
  version "2.3.2"
  resolved "https://registry.npmjs.org/braces/-/braces-2.3.2.tgz"
  integrity sha512-aNdbnj9P8PjdXU4ybaWLK2IF3jc/EoDYbC7AazW6to3TRsfXxscC9UXOB5iDiEQrkyIbWp2SLQda4+QAa7nc3w==
  dependencies:
    arr-flatten "^1.1.0"
    array-unique "^0.3.2"
    extend-shallow "^2.0.1"
    fill-range "^4.0.0"
    isobject "^3.0.1"
    repeat-element "^1.1.2"
    snapdragon "^0.8.1"
    snapdragon-node "^2.0.1"
    split-string "^3.0.2"
    to-regex "^3.0.1"

browserslist@^4.14.5, browserslist@^4.16.3:
  version "4.16.3"
  resolved "https://registry.npmjs.org/browserslist/-/browserslist-4.16.3.tgz"
  integrity sha512-vIyhWmIkULaq04Gt93txdh+j02yX/JzlyhLYbV3YQCn/zvES3JnY7TifHHvvr1w5hTDluNKMkV05cs4vy8Q7sw==
  dependencies:
    caniuse-lite "^1.0.30001181"
    colorette "^1.2.1"
    electron-to-chromium "^1.3.649"
    escalade "^3.1.1"
    node-releases "^1.1.70"

buffer-from@^1.0.0:
  version "1.1.1"
  resolved "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.1.tgz"
  integrity sha512-MQcXEUbCKtEo7bhqEs6560Hyd4XaovZlO/k9V3hjVUF/zwW7KBVdSK4gIt/bzwS9MbR5qob+F5jusZsb0YQK2A==

buffer-indexof@^1.0.0:
  version "1.1.1"
  resolved "https://registry.npmjs.org/buffer-indexof/-/buffer-indexof-1.1.1.tgz"
  integrity sha512-4/rOEg86jivtPTeOUUT61jJO1Ya1TrR/OkqCSZDyq84WJh3LuuiphBYJN+fm5xufIk4XAFcEwte/8WzC8If/1g==

bytes@3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/bytes/-/bytes-3.0.0.tgz"
  integrity sha1-0ygVQE1olpn4Wk6k+odV3ROpYEg= sha512-pMhOfFDPiv9t5jjIXkHosWmkSyQbvsgEVNkz0ERHbuLh2T/7j4Mqqpz523Fe8MVY89KC6Sh/QfS2sM+SjgFDcw==

bytes@3.1.0:
  version "3.1.0"
  resolved "https://registry.npmjs.org/bytes/-/bytes-3.1.0.tgz"
  integrity sha512-zauLjrfCG+xvoyaqLoV8bLVXXNGC4JqlxFCutSDWA6fJrTo2ZuvLYTqZ7aHBLZSMOopbzwv8f+wZcVzfVTI2Dg==

cache-base@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/cache-base/-/cache-base-1.0.1.tgz"
  integrity sha512-AKcdTnFSWATd5/GCPRxr2ChwIJ85CeyrEyjRHlKxQ56d4XJMGym0uAiKn0xbLOGOl3+yRpOTi484dVCEc5AUzQ==
  dependencies:
    collection-visit "^1.0.0"
    component-emitter "^1.2.1"
    get-value "^2.0.6"
    has-value "^1.0.0"
    isobject "^3.0.1"
    set-value "^2.0.0"
    to-object-path "^0.3.0"
    union-value "^1.0.0"
    unset-value "^1.0.0"

call-bind@^1.0.0, call-bind@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/call-bind/-/call-bind-1.0.2.tgz"
  integrity sha512-7O+FbCihrB5WGbFYesctwmTKae6rOiIzmz1icreWJ+0aA7LJfuqhEso2T9ncpcFtzMQtzXf2QGGueWJGTYsqrA==
  dependencies:
    function-bind "^1.1.1"
    get-intrinsic "^1.0.2"

camel-case@^4.1.1:
  version "4.1.2"
  resolved "https://registry.npmjs.org/camel-case/-/camel-case-4.1.2.tgz"
  integrity sha512-gxGWBrTT1JuMx6R+o5PTXMmUnhnVzLQ9SNutD4YqKtI6ap897t3tKECYla6gCWEkplXnlNybEkZg9GEGxKFCgw==
  dependencies:
    pascal-case "^3.1.2"
    tslib "^2.0.3"

camelcase@^5.0.0:
  version "5.3.1"
  resolved "https://registry.npmjs.org/camelcase/-/camelcase-5.3.1.tgz"
  integrity sha512-L28STB170nwWS63UjtlEOE3dldQApaJXZkOI1uMFfzf3rRuPegHaHesyee+YxQ+W6SvRDQV6UrdOdRiR153wJg==

caniuse-lite@^1.0.30001181:
  version "1.0.30001207"
  resolved "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001207.tgz"
  integrity sha512-UPQZdmAsyp2qfCTiMU/zqGSWOYaY9F9LL61V8f+8MrubsaDGpaHD9HRV/EWZGULZn0Hxu48SKzI5DgFwTvHuYw==

chalk@^2.0.0:
  version "2.4.2"
  resolved "https://registry.npmjs.org/chalk/-/chalk-2.4.2.tgz"
  integrity sha512-Mti+f9lpJNcwF4tWV8/OrTTtF1gZi+f8FqlyAdouralcFWFQWF2+NgCHShjkCb+IFBLq9buZwE1xckQU4peSuQ==
  dependencies:
    ansi-styles "^3.2.1"
    escape-string-regexp "^1.0.5"
    supports-color "^5.3.0"

chokidar@^2.1.8:
  version "2.1.8"
  resolved "https://registry.npmjs.org/chokidar/-/chokidar-2.1.8.tgz"
  integrity sha512-ZmZUazfOzf0Nve7duiCKD23PFSCs4JPoYyccjUFF3aQkQadqBhfzhjkwBH2mNOG9cTBwhamM37EIsIkZw3nRgg==
  dependencies:
    anymatch "^2.0.0"
    async-each "^1.0.1"
    braces "^2.3.2"
    glob-parent "^3.1.0"
    inherits "^2.0.3"
    is-binary-path "^1.0.0"
    is-glob "^4.0.0"
    normalize-path "^3.0.0"
    path-is-absolute "^1.0.0"
    readdirp "^2.2.1"
    upath "^1.1.1"
  optionalDependencies:
    fsevents "^1.2.7"

chrome-trace-event@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/chrome-trace-event/-/chrome-trace-event-1.0.2.tgz"
  integrity sha512-9e/zx1jw7B4CO+c/RXoCsfg/x1AfUBioy4owYH0bJprEYAx5hRFLRhWBqHAG57D0ZM4H7vxbP7bPe0VwhQRYDQ==
  dependencies:
    tslib "^1.9.0"

class-utils@^0.3.5:
  version "0.3.6"
  resolved "https://registry.npmjs.org/class-utils/-/class-utils-0.3.6.tgz"
  integrity sha512-qOhPa/Fj7s6TY8H8esGu5QNpMMQxz79h+urzrNYN6mn+9BnxlDGf5QZ+XeCDsxSjPqsSR56XOZOJmpeurnLMeg==
  dependencies:
    arr-union "^3.1.0"
    define-property "^0.2.5"
    isobject "^3.0.0"
    static-extend "^0.1.1"

clean-css@^4.2.3:
  version "4.2.3"
  resolved "https://registry.npmjs.org/clean-css/-/clean-css-4.2.3.tgz"
  integrity sha512-VcMWDN54ZN/DS+g58HYL5/n4Zrqe8vHJpGA8KdgUXFU4fuP/aHNw8eld9SyEIyabIMJX/0RaY/fplOo5hYLSFA==
  dependencies:
    source-map "~0.6.0"

cliui@^5.0.0:
  version "5.0.0"
  resolved "https://registry.npmjs.org/cliui/-/cliui-5.0.0.tgz"
  integrity sha512-PYeGSEmmHM6zvoef2w8TPzlrnNpXIjTipYK780YswmIP9vjxmd6Y2a3CB2Ks6/AU8NHjZugXvo8w3oWM2qnwXA==
  dependencies:
    string-width "^3.1.0"
    strip-ansi "^5.2.0"
    wrap-ansi "^5.1.0"

clone-deep@^4.0.1:
  version "4.0.1"
  resolved "https://registry.npmjs.org/clone-deep/-/clone-deep-4.0.1.tgz"
  integrity sha512-neHB9xuzh/wk0dIHweyAXv2aPGZIVk3pLMe+/RNzINf17fe0OG96QroktYAUm7SM1PBnzTabaLboqqxDyMU+SQ==
  dependencies:
    is-plain-object "^2.0.4"
    kind-of "^6.0.2"
    shallow-clone "^3.0.0"

collection-visit@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/collection-visit/-/collection-visit-1.0.0.tgz"
  integrity sha1-S8A3PBZLwykbTTaMgpzxqApZ3KA= sha512-lNkKvzEeMBBjUGHZ+q6z9pSJla0KWAQPvtzhEV9+iGyQYG+pBpl7xKDhxoNSOZH2hhv0v5k0y2yAM4o4SjoSkw==
  dependencies:
    map-visit "^1.0.0"
    object-visit "^1.0.0"

color-convert@^1.9.0:
  version "1.9.3"
  resolved "https://registry.npmjs.org/color-convert/-/color-convert-1.9.3.tgz"
  integrity sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==
  dependencies:
    color-name "1.1.3"

color-name@1.1.3:
  version "1.1.3"
  resolved "https://registry.npmjs.org/color-name/-/color-name-1.1.3.tgz"
  integrity sha1-p9BVi9icQveV3UIyj3QIMcpTvCU= sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==

colorette@^1.2.1:
  version "1.2.2"
  resolved "https://registry.npmjs.org/colorette/-/colorette-1.2.2.tgz"
  integrity sha512-MKGMzyfeuutC/ZJ1cba9NqcNpfeqMUcYmyF1ZFY6/Cn7CNSAKx6a+s48sqLqyAiZuaP2TcqMhoo+dlwFnVxT9w==

commander@^2.20.0:
  version "2.20.3"
  resolved "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz"
  integrity sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==

commander@^4.1.1:
  version "4.1.1"
  resolved "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz"
  integrity sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==

commander@^7.0.0:
  version "7.2.0"
  resolved "https://registry.npmjs.org/commander/-/commander-7.2.0.tgz"
  integrity sha512-QrWXB+ZQSVPmIWIhtEO9H+gwHaMGYiF5ChvoJ+K9ZGHG/sVsa6yiesAD1GC/x46sET00Xlwo1u49RVVVzvcSkw==

commondir@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/commondir/-/commondir-1.0.1.tgz"
  integrity sha1-3dgA2gxmEnOTzKWVDqloo6rxJTs= sha512-W9pAhw0ja1Edb5GVdIF1mjZw/ASI0AlShXM83UUGe2DVr5TdAPEA1OA8m/g8zWp9x6On7gqufY+FatDbC3MDQg==

component-emitter@^1.2.1:
  version "1.3.0"
  resolved "https://registry.npmjs.org/component-emitter/-/component-emitter-1.3.0.tgz"
  integrity sha512-Rd3se6QB+sO1TwqZjscQrurpEPIfO0/yYnSin6Q/rD3mOutHvUrCAhJub3r90uNb+SESBuE0QYoB90YdfatsRg==

compressible@~2.0.16:
  version "2.0.18"
  resolved "https://registry.npmjs.org/compressible/-/compressible-2.0.18.tgz"
  integrity sha512-AF3r7P5dWxL8MxyITRMlORQNaOA2IkAFaTr4k7BUumjPtRpGDTZpl0Pb1XCO6JeDCBdp126Cgs9sMxqSjgYyRg==
  dependencies:
    mime-db ">= 1.43.0 < 2"

compression@^1.7.4:
  version "1.7.4"
  resolved "https://registry.npmjs.org/compression/-/compression-1.7.4.tgz"
  integrity sha512-jaSIDzP9pZVS4ZfQ+TzvtiWhdpFhE2RDHz8QJkpX9SIpLq88VueF5jJw6t+6CUQcAoA6t+x89MLrWAqpfDE8iQ==
  dependencies:
    accepts "~1.3.5"
    bytes "3.0.0"
    compressible "~2.0.16"
    debug "2.6.9"
    on-headers "~1.0.2"
    safe-buffer "5.1.2"
    vary "~1.1.2"

concat-map@0.0.1:
  version "0.0.1"
  resolved "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz"
  integrity sha1-2Klr13/Wjfd5OnMDajug1UBdR3s= sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==

connect-history-api-fallback@^1.6.0:
  version "1.6.0"
  resolved "https://registry.npmjs.org/connect-history-api-fallback/-/connect-history-api-fallback-1.6.0.tgz"
  integrity sha512-e54B99q/OUoH64zYYRf3HBP5z24G38h5D3qXu23JGRoigpX5Ss4r9ZnDk3g0Z8uQC2x2lPaJ+UlWBc1ZWBWdLg==

content-disposition@0.5.3:
  version "0.5.3"
  resolved "https://registry.npmjs.org/content-disposition/-/content-disposition-0.5.3.tgz"
  integrity sha512-ExO0774ikEObIAEV9kDo50o+79VCUdEB6n6lzKgGwupcVeRlhrj3qGAfwq8G6uBJjkqLrhT0qEYFcWng8z1z0g==
  dependencies:
    safe-buffer "5.1.2"

content-type@~1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/content-type/-/content-type-1.0.4.tgz"
  integrity sha512-hIP3EEPs8tB9AT1L+NUqtwOAps4mk2Zob89MWXMHjHWg9milF/j4osnnQLXBCBFBk/tvIG/tUc9mOUJiPBhPXA==

convert-source-map@^1.7.0:
  version "1.7.0"
  resolved "https://registry.npmjs.org/convert-source-map/-/convert-source-map-1.7.0.tgz"
  integrity sha512-4FJkXzKXEDB1snCFZlLP4gpC3JILicCpGbzG9f9G7tGqGCzETQ2hWPrcinA9oU4wtf2biUaEH5065UnMeR33oA==
  dependencies:
    safe-buffer "~5.1.1"

cookie-signature@1.0.6:
  version "1.0.6"
  resolved "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.0.6.tgz"
  integrity sha1-4wOogrNCzD7oylE6eZmXNNqzriw= sha512-QADzlaHc8icV8I7vbaJXJwod9HWYp8uCqf1xa4OfNu1T7JVxQIrUgOWtHdNDtPiywmFbiS12VjotIXLrKM3orQ==

cookie@0.4.0:
  version "0.4.0"
  resolved "https://registry.npmjs.org/cookie/-/cookie-0.4.0.tgz"
  integrity sha512-+Hp8fLp57wnUSt0tY0tHEXh4voZRDnoIrZPqlo3DPiI4y9lwg/jqx+1Om94/W6ZaPDOUbnjOt/99w66zk+l1Xg==

copy-descriptor@^0.1.0:
  version "0.1.1"
  resolved "https://registry.npmjs.org/copy-descriptor/-/copy-descriptor-0.1.1.tgz"
  integrity sha1-Z29us8OZl8LuGsOpJP1hJHSPV40= sha512-XgZ0pFcakEUlbwQEVNg3+QAis1FyTL3Qel9FYy8pSkQqoG3PNoT0bOCQtOXcOkur21r2Eq2kI+IE+gsmAEVlYw==

core-js-compat@^3.8.1, core-js-compat@^3.9.0:
  version "3.10.0"
  resolved "https://registry.npmjs.org/core-js-compat/-/core-js-compat-3.10.0.tgz"
  integrity sha512-9yVewub2MXNYyGvuLnMHcN1k9RkvB7/ofktpeKTIaASyB88YYqGzUnu0ywMMhJrDHOMiTjSHWGzR+i7Wb9Z1kQ==
  dependencies:
    browserslist "^4.16.3"
    semver "7.0.0"

core-util-is@~1.0.0:
  version "1.0.2"
  resolved "https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.2.tgz"
  integrity sha1-tf1UIgqivFq1eqtxQMlAdUUDwac= sha512-3lqz5YjWTYnW6dlDa5TLaTCcShfar1e40rmcJVwCBJC6mWlFuj0eCHIElmG1g5kyuJ/GD+8Wn4FFCcz4gJPfaQ==

cross-spawn@^6.0.0:
  version "6.0.5"
  resolved "https://registry.npmjs.org/cross-spawn/-/cross-spawn-6.0.5.tgz"
  integrity sha512-eTVLrBSt7fjbDygz805pMnstIs2VTBNkRm0qxZd+M7A5XDdxVRWO5MxGBXZhjY4cqLYLdtrGqRf8mBPmzwSpWQ==
  dependencies:
    nice-try "^1.0.4"
    path-key "^2.0.1"
    semver "^5.5.0"
    shebang-command "^1.2.0"
    which "^1.2.9"

cross-spawn@^7.0.3:
  version "7.0.3"
  resolved "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.3.tgz"
  integrity sha512-iRDPJKUPVEND7dHPO8rkbOnPpyDygcDFtWjpeWNCgy8WP2rXcxXL8TskReQl6OrB2G7+UJrags1q15Fudc7G6w==
  dependencies:
    path-key "^3.1.0"
    shebang-command "^2.0.0"
    which "^2.0.1"

css-select@^2.0.2:
  version "2.1.0"
  resolved "https://registry.npmjs.org/css-select/-/css-select-2.1.0.tgz"
  integrity sha512-Dqk7LQKpwLoH3VovzZnkzegqNSuAziQyNZUcrdDM401iY+R5NkGBXGmtO05/yaXQziALuPogeG0b7UAgjnTJTQ==
  dependencies:
    boolbase "^1.0.0"
    css-what "^3.2.1"
    domutils "^1.7.0"
    nth-check "^1.0.2"

css-what@^3.2.1:
  version "3.4.2"
  resolved "https://registry.npmjs.org/css-what/-/css-what-3.4.2.tgz"
  integrity sha512-ACUm3L0/jiZTqfzRM3Hi9Q8eZqd6IK37mMWPLz9PJxkLWllYeRf+EHUSHYEtFop2Eqytaq1FizFVh7XfBnXCDQ==

debug@^2.2.0:
  version "2.6.9"
  resolved "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz"
  integrity sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==
  dependencies:
    ms "2.0.0"

debug@^2.3.3:
  version "2.6.9"
  resolved "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz"
  integrity sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==
  dependencies:
    ms "2.0.0"

debug@^3.1.1:
  version "3.2.7"
  resolved "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz"
  integrity sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==
  dependencies:
    ms "^2.1.1"

debug@^3.2.6:
  version "3.2.7"
  resolved "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz"
  integrity sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==
  dependencies:
    ms "^2.1.1"

debug@^4.1.0, debug@^4.1.1:
  version "4.3.1"
  resolved "https://registry.npmjs.org/debug/-/debug-4.3.1.tgz"
  integrity sha512-doEwdvm4PCeK4K3RQN2ZC2BYUBaxwLARCqZmMjtF8a51J2Rb0xpVloFRnCODwqjpwnAoao4pelN8l3RJdv3gRQ==
  dependencies:
    ms "2.1.2"

debug@2.6.9:
  version "2.6.9"
  resolved "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz"
  integrity sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==
  dependencies:
    ms "2.0.0"

decamelize@^1.2.0:
  version "1.2.0"
  resolved "https://registry.npmjs.org/decamelize/-/decamelize-1.2.0.tgz"
  integrity sha1-9lNNFRSCabIDUue+4m9QH5oZEpA= sha512-z2S+W9X73hAUUki+N+9Za2lBlun89zigOyGrsax+KUQ6wKW4ZoWpEYBkGhQjwAjjDCkWxhY0VKEhk8wzY7F5cA==

decode-uri-component@^0.2.0:
  version "0.2.0"
  resolved "https://registry.npmjs.org/decode-uri-component/-/decode-uri-component-0.2.0.tgz"
  integrity sha1-6zkTMzRYd1y4TNGh+uBiEGu4dUU= sha512-hjf+xovcEn31w/EUYdTXQh/8smFL/dzYjohQGEIgjyNavaJfBY2p5F527Bo1VPATxv0VYTUC2bOcXvqFwk78Og==

deep-equal@^1.0.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/deep-equal/-/deep-equal-1.1.1.tgz"
  integrity sha512-yd9c5AdiqVcR+JjcwUQb9DkhJc8ngNr0MahEBGvDiJw8puWab2yZlh+nkasOnZP+EGTAP6rRp2JzJhJZzvNF8g==
  dependencies:
    is-arguments "^1.0.4"
    is-date-object "^1.0.1"
    is-regex "^1.0.4"
    object-is "^1.0.1"
    object-keys "^1.1.1"
    regexp.prototype.flags "^1.2.0"

default-gateway@^4.2.0:
  version "4.2.0"
  resolved "https://registry.npmjs.org/default-gateway/-/default-gateway-4.2.0.tgz"
  integrity sha512-h6sMrVB1VMWVrW13mSc6ia/DwYYw5MN6+exNu1OaJeFac5aSAvwM7lZ0NVfTABuSkQelr4h5oebg3KB1XPdjgA==
  dependencies:
    execa "^1.0.0"
    ip-regex "^2.1.0"

define-properties@^1.1.2, define-properties@^1.1.3:
  version "1.1.3"
  resolved "https://registry.npmjs.org/define-properties/-/define-properties-1.1.3.tgz"
  integrity sha512-3MqfYKj2lLzdMSf8ZIZE/V+Zuy+BgD6f164e8K2w7dgnpKArBDerGYpM46IYYcjnkdPNMjPk9A6VFB8+3SKlXQ==
  dependencies:
    object-keys "^1.0.12"

define-property@^0.2.5:
  version "0.2.5"
  resolved "https://registry.npmjs.org/define-property/-/define-property-0.2.5.tgz"
  integrity sha1-w1se+RjsPJkPmlvFe+BKrOxcgRY= sha512-Rr7ADjQZenceVOAKop6ALkkRAmH1A4Gx9hV/7ZujPUN2rkATqFO0JZLZInbAjpZYoJ1gUx8MRMQVkYemcbMSTA==
  dependencies:
    is-descriptor "^0.1.0"

define-property@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/define-property/-/define-property-1.0.0.tgz"
  integrity sha1-dp66rz9KY6rTr56NMEybvnm/sOY= sha512-cZTYKFWspt9jZsMscWo8sc/5lbPC9Q0N5nBLgb+Yd915iL3udB1uFgS3B8YCx66UVHq018DAVFoee7x+gxggeA==
  dependencies:
    is-descriptor "^1.0.0"

define-property@^2.0.2:
  version "2.0.2"
  resolved "https://registry.npmjs.org/define-property/-/define-property-2.0.2.tgz"
  integrity sha512-jwK2UV4cnPpbcG7+VRARKTZPUWowwXA8bzH5NP6ud0oeAxyYPuGZUAC7hMugpCdz4BeSZl2Dl9k66CHJ/46ZYQ==
  dependencies:
    is-descriptor "^1.0.2"
    isobject "^3.0.1"

del@^4.1.1:
  version "4.1.1"
  resolved "https://registry.npmjs.org/del/-/del-4.1.1.tgz"
  integrity sha512-QwGuEUouP2kVwQenAsOof5Fv8K9t3D8Ca8NxcXKrIpEHjTXK5J2nXLdP+ALI1cgv8wj7KuwBhTwBkOZSJKM5XQ==
  dependencies:
    "@types/glob" "^7.1.1"
    globby "^6.1.0"
    is-path-cwd "^2.0.0"
    is-path-in-cwd "^2.0.0"
    p-map "^2.0.0"
    pify "^4.0.1"
    rimraf "^2.6.3"

depd@~1.1.2:
  version "1.1.2"
  resolved "https://registry.npmjs.org/depd/-/depd-1.1.2.tgz"
  integrity sha1-m81S4UwJd2PnSbJ0xDRu0uVgtak= sha512-7emPTl6Dpo6JRXOXjLRxck+FlLRX5847cLKEn00PLAgc3g2hTZZgr+e4c2v6QpSmLeFP3n5yUo7ft6avBK/5jQ==

destroy@~1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/destroy/-/destroy-1.0.4.tgz"
  integrity sha1-l4hXRCxEdJ5CBmE+N5RiBYJqvYA= sha512-3NdhDuEXnfun/z7x9GOElY49LoqVHoGScmOKwmxhsS8N5Y+Z8KyPPDnaSzqWgYt/ji4mqwfTS34Htrk0zPIXVg==

detect-node@^2.0.4:
  version "2.0.5"
  resolved "https://registry.npmjs.org/detect-node/-/detect-node-2.0.5.tgz"
  integrity sha512-qi86tE6hRcFHy8jI1m2VG+LaPUR1LhqDa5G8tVjuUXmOrpuAgqsA1pN0+ldgr3aKUH+QLI9hCY/OcRYisERejw==

dns-equal@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/dns-equal/-/dns-equal-1.0.0.tgz"
  integrity sha1-s55/HabrCnW6nBcySzR1PEfgZU0= sha512-z+paD6YUQsk+AbGCEM4PrOXSss5gd66QfcVBFTKR/HpFL9jCqikS94HYwKww6fQyO7IxrIIyUu+g0Ka9tUS2Cg==

dns-packet@^1.3.1:
  version "1.3.1"
  resolved "https://registry.npmjs.org/dns-packet/-/dns-packet-1.3.1.tgz"
  integrity sha512-0UxfQkMhYAUaZI+xrNZOz/as5KgDU0M/fQ9b6SpkyLbk3GEswDi6PADJVaYJradtRVsRIlF1zLyOodbcTCDzUg==
  dependencies:
    ip "^1.1.0"
    safe-buffer "^5.0.1"

dns-txt@^2.0.2:
  version "2.0.2"
  resolved "https://registry.npmjs.org/dns-txt/-/dns-txt-2.0.2.tgz"
  integrity sha1-uR2Ab10nGI5Ks+fRB9iBocxGQrY= sha512-Ix5PrWjphuSoUXV/Zv5gaFHjnaJtb02F2+Si3Ht9dyJ87+Z/lMmy+dpNHtTGraNK958ndXq2i+GLkWsWHcKaBQ==
  dependencies:
    buffer-indexof "^1.0.0"

dom-converter@^0.2:
  version "0.2.0"
  resolved "https://registry.npmjs.org/dom-converter/-/dom-converter-0.2.0.tgz"
  integrity sha512-gd3ypIPfOMr9h5jIKq8E3sHOTCjeirnl0WK5ZdS1AW0Odt0b1PaWaHdJ4Qk4klv+YB9aJBS7mESXjFoDQPu6DA==
  dependencies:
    utila "~0.4"

dom-serializer@0:
  version "0.2.2"
  resolved "https://registry.npmjs.org/dom-serializer/-/dom-serializer-0.2.2.tgz"
  integrity sha512-2/xPb3ORsQ42nHYiSunXkDjPLBaEj/xTwUO4B7XCZQTRk7EBtTOPaygh10YAAh2OI1Qrp6NWfpAhzswj0ydt9g==
  dependencies:
    domelementtype "^2.0.1"
    entities "^2.0.0"

domelementtype@^1.3.1, domelementtype@1:
  version "1.3.1"
  resolved "https://registry.npmjs.org/domelementtype/-/domelementtype-1.3.1.tgz"
  integrity sha512-BSKB+TSpMpFI/HOxCNr1O8aMOTZ8hT3pM3GQ0w/mWRmkhEDSFJkkyzz4XQsBV44BChwGkrDfMyjVD0eA2aFV3w==

domelementtype@^2.0.1:
  version "2.2.0"
  resolved "https://registry.npmjs.org/domelementtype/-/domelementtype-2.2.0.tgz"
  integrity sha512-DtBMo82pv1dFtUmHyr48beiuq792Sxohr+8Hm9zoxklYPfa6n0Z3Byjj2IV7bmr2IyqClnqEQhfgHJJ5QF0R5A==

domhandler@^2.3.0:
  version "2.4.2"
  resolved "https://registry.npmjs.org/domhandler/-/domhandler-2.4.2.tgz"
  integrity sha512-JiK04h0Ht5u/80fdLMCEmV4zkNh2BcoMFBmZ/91WtYZ8qVXSKjiw7fXMgFPnHcSZgOo3XdinHvmnDUeMf5R4wA==
  dependencies:
    domelementtype "1"

domutils@^1.5.1, domutils@^1.7.0:
  version "1.7.0"
  resolved "https://registry.npmjs.org/domutils/-/domutils-1.7.0.tgz"
  integrity sha512-Lgd2XcJ/NjEw+7tFvfKxOzCYKZsdct5lczQ2ZaQY8Djz7pfAD3Gbp8ySJWtreII/vDlMVmxwa6pHmdxIYgttDg==
  dependencies:
    dom-serializer "0"
    domelementtype "1"

dot-case@^3.0.4:
  version "3.0.4"
  resolved "https://registry.npmjs.org/dot-case/-/dot-case-3.0.4.tgz"
  integrity sha512-Kv5nKlh6yRrdrGvxeJ2e5y2eRUpkUosIW4A2AS38zwSz27zu7ufDwQPi5Jhs3XAlGNetl3bmnGhQsMtkKJnj3w==
  dependencies:
    no-case "^3.0.4"
    tslib "^2.0.3"

ee-first@1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz"
  integrity sha1-WQxhFWsK4vTwJVcyoViyZrxWsh0= sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==

electron-to-chromium@^1.3.649:
  version "1.3.707"
  resolved "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.3.707.tgz"
  integrity sha512-BqddgxNPrcWnbDdJw7SzXVzPmp+oiyjVrc7tkQVaznPGSS9SKZatw6qxoP857M+HbOyyqJQwYQtsuFIMSTNSZA==

emoji-regex@^7.0.1:
  version "7.0.3"
  resolved "https://registry.npmjs.org/emoji-regex/-/emoji-regex-7.0.3.tgz"
  integrity sha512-CwBLREIQ7LvYFB0WyRvwhq5N5qPhc6PMjD6bYggFlI5YyDgl+0vxq5VHbMOFqLg7hfWzmu8T5Z1QofhmTIhItA==

emojis-list@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/emojis-list/-/emojis-list-3.0.0.tgz"
  integrity sha512-/kyM18EfinwXZbno9FyUGeFh87KC8HRQBQGildHZbEuRyWFOmv1U10o9BBp8XVZDVNNuQKyIGIu5ZYAAXJ0V2Q==

encodeurl@~1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/encodeurl/-/encodeurl-1.0.2.tgz"
  integrity sha1-rT/0yG7C0CkyL1oCw6mmBslbP1k= sha512-TPJXq8JqFaVYm2CWmPvnP2Iyo4ZSM7/QKcSmuMLDObfpH5fi7RUGmd/rTDf+rut/saiDiQEeVTNgAmJEdAOx0w==

end-of-stream@^1.1.0:
  version "1.4.4"
  resolved "https://registry.npmjs.org/end-of-stream/-/end-of-stream-1.4.4.tgz"
  integrity sha512-+uw1inIHVPQoaVuHzRyXd21icM+cnt4CzD5rW+NC1wjOUSTOs+Te7FOv7AhN7vS9x/oIyhLP5PR1H+phQAHu5Q==
  dependencies:
    once "^1.4.0"

enhanced-resolve@^5.7.0:
  version "5.7.0"
  resolved "https://registry.npmjs.org/enhanced-resolve/-/enhanced-resolve-5.7.0.tgz"
  integrity sha512-6njwt/NsZFUKhM6j9U8hzVyD4E4r0x7NQzhTCbcWOJ0IQjNSAoalWmb0AE51Wn+fwan5qVESWi7t2ToBxs9vrw==
  dependencies:
    graceful-fs "^4.2.4"
    tapable "^2.2.0"

enquirer@^2.3.6:
  version "2.3.6"
  resolved "https://registry.npmjs.org/enquirer/-/enquirer-2.3.6.tgz"
  integrity sha512-yjNnPr315/FjS4zIsUxYguYUPP2e1NK4d7E7ZOLiyYCcbFBiTMyID+2wvm2w6+pZ/odMA7cRkjhsPbltwBOrLg==
  dependencies:
    ansi-colors "^4.1.1"

entities@^1.1.1:
  version "1.1.2"
  resolved "https://registry.npmjs.org/entities/-/entities-1.1.2.tgz"
  integrity sha512-f2LZMYl1Fzu7YSBKg+RoROelpOaNrcGmE9AZubeDfrCEia483oW4MI4VyFd5VNHIgQ/7qm1I0wUHK1eJnn2y2w==

entities@^2.0.0:
  version "2.2.0"
  resolved "https://registry.npmjs.org/entities/-/entities-2.2.0.tgz"
  integrity sha512-p92if5Nz619I0w+akJrLZH0MX0Pb5DX39XOwQTtXSdQQOaYH03S1uIQp4mhOZtAXrxq4ViO67YTiLBo2638o9A==

envinfo@^7.7.3:
  version "7.7.4"
  resolved "https://registry.npmjs.org/envinfo/-/envinfo-7.7.4.tgz"
  integrity sha512-TQXTYFVVwwluWSFis6K2XKxgrD22jEv0FTuLCQI+OjH7rn93+iY0fSSFM5lrSxFY+H1+B0/cvvlamr3UsBivdQ==

errno@^0.1.3:
  version "0.1.8"
  resolved "https://registry.npmjs.org/errno/-/errno-0.1.8.tgz"
  integrity sha512-dJ6oBr5SQ1VSd9qkk7ByRgb/1SH4JZjCHSW/mr63/QcXO9zLVxvJ6Oy13nio03rxpSnVDDjFor75SjVeZWPW/A==
  dependencies:
    prr "~1.0.1"

es-abstract@^1.18.0-next.2:
  version "1.18.0"
  resolved "https://registry.npmjs.org/es-abstract/-/es-abstract-1.18.0.tgz"
  integrity sha512-LJzK7MrQa8TS0ja2w3YNLzUgJCGPdPOV1yVvezjNnS89D+VR08+Szt2mz3YB2Dck/+w5tfIq/RoUAFqJJGM2yw==
  dependencies:
    call-bind "^1.0.2"
    es-to-primitive "^1.2.1"
    function-bind "^1.1.1"
    get-intrinsic "^1.1.1"
    has "^1.0.3"
    has-symbols "^1.0.2"
    is-callable "^1.2.3"
    is-negative-zero "^2.0.1"
    is-regex "^1.1.2"
    is-string "^1.0.5"
    object-inspect "^1.9.0"
    object-keys "^1.1.1"
    object.assign "^4.1.2"
    string.prototype.trimend "^1.0.4"
    string.prototype.trimstart "^1.0.4"
    unbox-primitive "^1.0.0"

es-module-lexer@^0.4.0:
  version "0.4.1"
  resolved "https://registry.npmjs.org/es-module-lexer/-/es-module-lexer-0.4.1.tgz"
  integrity sha512-ooYciCUtfw6/d2w56UVeqHPcoCFAiJdz5XOkYpv/Txl1HMUozpXjz/2RIQgqwKdXNDPSF1W7mJCFse3G+HDyAA==

es-to-primitive@^1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.2.1.tgz"
  integrity sha512-QCOllgZJtaUo9miYBcLChTUaHNjJF3PYs1VidD7AwiEj1kYxKeQTctLAezAOH5ZKRH0g2IgPn6KwB4IT8iRpvA==
  dependencies:
    is-callable "^1.1.4"
    is-date-object "^1.0.1"
    is-symbol "^1.0.2"

escalade@^3.1.1:
  version "3.1.1"
  resolved "https://registry.npmjs.org/escalade/-/escalade-3.1.1.tgz"
  integrity sha512-k0er2gUkLf8O0zKJiAhmkTnJlTvINGv7ygDNPbeIsX/TJjGJZHuh9B2UxbsaEkmlEo9MfhrSzmhIlhRlI2GXnw==

escape-html@~1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz"
  integrity sha1-Aljq5NPQwJdN4cFpGI7wBR0dGYg= sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==

escape-string-regexp@^1.0.5:
  version "1.0.5"
  resolved "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz"
  integrity sha1-G2HAViGQqN/2rjuyzwIAyhMLhtQ= sha512-vbRorB5FUQWvla16U8R/qgaFIya2qGzwDrNmCZuYKrbdSUMG6I1ZCGQRefkRVhuOkIGVne7BQ35DSfo1qvJqFg==

eslint-scope@^5.1.1:
  version "5.1.1"
  resolved "https://registry.npmjs.org/eslint-scope/-/eslint-scope-5.1.1.tgz"
  integrity sha512-2NxwbF/hZ0KpepYN0cNbo+FN6XoK7GaHlQhgx/hIZl6Va0bF45RQOOwhLIy8lQDbuCiadSLCBnH2CFYquit5bw==
  dependencies:
    esrecurse "^4.3.0"
    estraverse "^4.1.1"

esrecurse@^4.3.0:
  version "4.3.0"
  resolved "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz"
  integrity sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==
  dependencies:
    estraverse "^5.2.0"

estraverse@^4.1.1:
  version "4.3.0"
  resolved "https://registry.npmjs.org/estraverse/-/estraverse-4.3.0.tgz"
  integrity sha512-39nnKffWz8xN1BU/2c79n9nB9HDzo0niYUqx6xyqUnyoAnQyyWpOTdZEeiCch8BBu515t4wp9ZmgVfVhn9EBpw==

estraverse@^5.2.0:
  version "5.2.0"
  resolved "https://registry.npmjs.org/estraverse/-/estraverse-5.2.0.tgz"
  integrity sha512-BxbNGGNm0RyRYvUdHpIwv9IWzeM9XClbOxwoATuFdOE7ZE6wHL+HQ5T8hoPM+zHvmKzzsEqhgy0GrQ5X13afiQ==

esutils@^2.0.2:
  version "2.0.3"
  resolved "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz"
  integrity sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==

etag@~1.8.1:
  version "1.8.1"
  resolved "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz"
  integrity sha1-Qa4u62XvpiJorr/qg6x9eSmbCIc= sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==

eventemitter3@^4.0.0:
  version "4.0.7"
  resolved "https://registry.npmjs.org/eventemitter3/-/eventemitter3-4.0.7.tgz"
  integrity sha512-8guHBZCwKnFhYdHr2ysuRWErTwhoN2X8XELRlrRwpmfeY2jjuUN4taQMsULKUVo1K4DvZl+0pgfyoysHxvmvEw==

events@^3.2.0:
  version "3.3.0"
  resolved "https://registry.npmjs.org/events/-/events-3.3.0.tgz"
  integrity sha512-mQw+2fkQbALzQ7V0MY0IqdnXNOeTtP4r0lN9z7AAawCXgqea7bDii20AYrIBrFd/Hx0M2Ocz6S111CaFkUcb0Q==

eventsource@^1.0.7:
  version "1.1.0"
  resolved "https://registry.npmjs.org/eventsource/-/eventsource-1.1.0.tgz"
  integrity sha512-VSJjT5oCNrFvCS6igjzPAt5hBzQ2qPBFIbJ03zLI9SE0mxwZpMw6BfJrbFHm1a141AavMEB8JHmBhWAd66PfCg==
  dependencies:
    original "^1.0.0"

execa@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/execa/-/execa-1.0.0.tgz"
  integrity sha512-adbxcyWV46qiHyvSp50TKt05tB4tK3HcmF7/nxfAdhnox83seTDbwnaqKO4sXRy7roHAIFqJP/Rw/AuEbX61LA==
  dependencies:
    cross-spawn "^6.0.0"
    get-stream "^4.0.0"
    is-stream "^1.1.0"
    npm-run-path "^2.0.0"
    p-finally "^1.0.0"
    signal-exit "^3.0.0"
    strip-eof "^1.0.0"

execa@^5.0.0:
  version "5.0.0"
  resolved "https://registry.npmjs.org/execa/-/execa-5.0.0.tgz"
  integrity sha512-ov6w/2LCiuyO4RLYGdpFGjkcs0wMTgGE8PrkTHikeUy5iJekXyPIKUjifk5CsE0pt7sMCrMZ3YNqoCj6idQOnQ==
  dependencies:
    cross-spawn "^7.0.3"
    get-stream "^6.0.0"
    human-signals "^2.1.0"
    is-stream "^2.0.0"
    merge-stream "^2.0.0"
    npm-run-path "^4.0.1"
    onetime "^5.1.2"
    signal-exit "^3.0.3"
    strip-final-newline "^2.0.0"

expand-brackets@^2.1.4:
  version "2.1.4"
  resolved "https://registry.npmjs.org/expand-brackets/-/expand-brackets-2.1.4.tgz"
  integrity sha1-t3c14xXOMPa27/D4OwQVGiJEliI= sha512-w/ozOKR9Obk3qoWeY/WDi6MFta9AoMR+zud60mdnbniMcBxRuFJyDt2LdX/14A1UABeqk+Uk+LDfUpvoGKppZA==
  dependencies:
    debug "^2.3.3"
    define-property "^0.2.5"
    extend-shallow "^2.0.1"
    posix-character-classes "^0.1.0"
    regex-not "^1.0.0"
    snapdragon "^0.8.1"
    to-regex "^3.0.1"

express@^4.17.1:
  version "4.17.1"
  resolved "https://registry.npmjs.org/express/-/express-4.17.1.tgz"
  integrity sha512-mHJ9O79RqluphRrcw2X/GTh3k9tVv8YcoyY4Kkh4WDMUYKRZUq0h1o0w2rrrxBqM7VoeUVqgb27xlEMXTnYt4g==
  dependencies:
    accepts "~1.3.7"
    array-flatten "1.1.1"
    body-parser "1.19.0"
    content-disposition "0.5.3"
    content-type "~1.0.4"
    cookie "0.4.0"
    cookie-signature "1.0.6"
    debug "2.6.9"
    depd "~1.1.2"
    encodeurl "~1.0.2"
    escape-html "~1.0.3"
    etag "~1.8.1"
    finalhandler "~1.1.2"
    fresh "0.5.2"
    merge-descriptors "1.0.1"
    methods "~1.1.2"
    on-finished "~2.3.0"
    parseurl "~1.3.3"
    path-to-regexp "0.1.7"
    proxy-addr "~2.0.5"
    qs "6.7.0"
    range-parser "~1.2.1"
    safe-buffer "5.1.2"
    send "0.17.1"
    serve-static "1.14.1"
    setprototypeof "1.1.1"
    statuses "~1.5.0"
    type-is "~1.6.18"
    utils-merge "1.0.1"
    vary "~1.1.2"

extend-shallow@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/extend-shallow/-/extend-shallow-2.0.1.tgz"
  integrity sha1-Ua99YUrZqfYQ6huvu5idaxxWiQ8= sha512-zCnTtlxNoAiDc3gqY2aYAWFx7XWWiasuF2K8Me5WbN8otHKTUKBwjPtNpRs/rbUZm7KxWAaNj7P1a/p52GbVug==
  dependencies:
    is-extendable "^0.1.0"

extend-shallow@^3.0.0:
  version "3.0.2"
  resolved "https://registry.npmjs.org/extend-shallow/-/extend-shallow-3.0.2.tgz"
  integrity sha1-Jqcarwc7OfshJxcnRhMcJwQCjbg= sha512-BwY5b5Ql4+qZoefgMj2NUmx+tehVTH/Kf4k1ZEtOHNFcm2wSxMRo992l6X3TIgni2eZVTZ85xMOjF31fwZAj6Q==
  dependencies:
    assign-symbols "^1.0.0"
    is-extendable "^1.0.1"

extend-shallow@^3.0.2:
  version "3.0.2"
  resolved "https://registry.npmjs.org/extend-shallow/-/extend-shallow-3.0.2.tgz"
  integrity sha1-Jqcarwc7OfshJxcnRhMcJwQCjbg= sha512-BwY5b5Ql4+qZoefgMj2NUmx+tehVTH/Kf4k1ZEtOHNFcm2wSxMRo992l6X3TIgni2eZVTZ85xMOjF31fwZAj6Q==
  dependencies:
    assign-symbols "^1.0.0"
    is-extendable "^1.0.1"

extglob@^2.0.4:
  version "2.0.4"
  resolved "https://registry.npmjs.org/extglob/-/extglob-2.0.4.tgz"
  integrity sha512-Nmb6QXkELsuBr24CJSkilo6UHHgbekK5UiZgfE6UHD3Eb27YC6oD+bhcT+tJ6cl8dmsgdQxnWlcry8ksBIBLpw==
  dependencies:
    array-unique "^0.3.2"
    define-property "^1.0.0"
    expand-brackets "^2.1.4"
    extend-shallow "^2.0.1"
    fragment-cache "^0.2.1"
    regex-not "^1.0.0"
    snapdragon "^0.8.1"
    to-regex "^3.0.1"

fast-deep-equal@^3.1.1:
  version "3.1.3"
  resolved "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz"
  integrity sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==

fast-json-stable-stringify@^2.0.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz"
  integrity sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==

fastest-levenshtein@^1.0.12:
  version "1.0.12"
  resolved "https://registry.npmjs.org/fastest-levenshtein/-/fastest-levenshtein-1.0.12.tgz"
  integrity sha512-On2N+BpYJ15xIC974QNVuYGMOlEVt4s0EOI3wwMqOmK1fdDY+FN/zltPV8vosq4ad4c/gJ1KHScUn/6AWIgiow==

faye-websocket@^0.11.3:
  version "0.11.3"
  resolved "https://registry.npmjs.org/faye-websocket/-/faye-websocket-0.11.3.tgz"
  integrity sha512-D2y4bovYpzziGgbHYtGCMjlJM36vAl/y+xUyn1C+FVx8szd1E+86KwVw6XvYSzOP8iMpm1X0I4xJD+QtUb36OA==
  dependencies:
    websocket-driver ">=0.5.1"

file-loader@^6.2.0:
  version "6.2.0"
  resolved "https://registry.npmjs.org/file-loader/-/file-loader-6.2.0.tgz"
  integrity sha512-qo3glqyTa61Ytg4u73GultjHGjdRyig3tG6lPtyX/jOEJvHif9uB0/OCI2Kif6ctF3caQTW2G5gym21oAsI4pw==
  dependencies:
    loader-utils "^2.0.0"
    schema-utils "^3.0.0"

file-uri-to-path@1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/file-uri-to-path/-/file-uri-to-path-1.0.0.tgz"
  integrity sha512-0Zt+s3L7Vf1biwWZ29aARiVYLx7iMGnEUl9x33fbB/j3jR81u/O2LbqK+Bm1CDSNDKVtJ/YjwY7TUd5SkeLQLw==

fill-range@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/fill-range/-/fill-range-4.0.0.tgz"
  integrity sha1-1USBHUKPmOsGpj3EAtJAPDKMOPc= sha512-VcpLTWqWDiTerugjj8e3+esbg+skS3M9e54UuR3iCeIDMXCLTsAH8hTSzDQU/X6/6t3eYkOKoZSef2PlU6U1XQ==
  dependencies:
    extend-shallow "^2.0.1"
    is-number "^3.0.0"
    repeat-string "^1.6.1"
    to-regex-range "^2.1.0"

finalhandler@~1.1.2:
  version "1.1.2"
  resolved "https://registry.npmjs.org/finalhandler/-/finalhandler-1.1.2.tgz"
  integrity sha512-aAWcW57uxVNrQZqFXjITpW3sIUQmHGG3qSb9mUah9MgMC4NeWhNOlNjXEYq3HjRAvL6arUviZGGJsBg6z0zsWA==
  dependencies:
    debug "2.6.9"
    encodeurl "~1.0.2"
    escape-html "~1.0.3"
    on-finished "~2.3.0"
    parseurl "~1.3.3"
    statuses "~1.5.0"
    unpipe "~1.0.0"

find-cache-dir@^3.3.1:
  version "3.3.1"
  resolved "https://registry.npmjs.org/find-cache-dir/-/find-cache-dir-3.3.1.tgz"
  integrity sha512-t2GDMt3oGC/v+BMwzmllWDuJF/xcDtE5j/fCGbqDD7OLuJkj0cfh1YSA5VKPvwMeLFLNDBkwOKZ2X85jGLVftQ==
  dependencies:
    commondir "^1.0.1"
    make-dir "^3.0.2"
    pkg-dir "^4.1.0"

find-up@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/find-up/-/find-up-3.0.0.tgz"
  integrity sha512-1yD6RmLI1XBfxugvORwlck6f75tYL+iR0jqwsOrOxMZyGYqUuDhJ0l4AXdO1iX/FTs9cBAMEk1gWSEx1kSbylg==
  dependencies:
    locate-path "^3.0.0"

find-up@^4.0.0:
  version "4.1.0"
  resolved "https://registry.npmjs.org/find-up/-/find-up-4.1.0.tgz"
  integrity sha512-PpOwAdQ/YlXQ2vj8a3h8IipDuYRi3wceVQQGYWxNINccq40Anw7BlsEXCMbt1Zt+OLA6Fq9suIpIWD0OsnISlw==
  dependencies:
    locate-path "^5.0.0"
    path-exists "^4.0.0"

follow-redirects@^1.0.0:
  version "1.13.3"
  resolved "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.13.3.tgz"
  integrity sha512-DUgl6+HDzB0iEptNQEXLx/KhTmDb8tZUHSeLqpnjpknR70H0nC2t9N73BK6fN4hOvJ84pKlIQVQ4k5FFlBedKA==

for-in@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/for-in/-/for-in-1.0.2.tgz"
  integrity sha1-gQaNKVqBQuwKxybG4iAMMPttXoA= sha512-7EwmXrOjyL+ChxMhmG5lnW9MPt1aIeZEwKhQzoBUdTV0N3zuwWDZYVJatDvZ2OyzPUvdIAZDsCetk3coyMfcnQ==

forwarded@~0.1.2:
  version "0.1.2"
  resolved "https://registry.npmjs.org/forwarded/-/forwarded-0.1.2.tgz"
  integrity sha1-mMI9qxF1ZXuMBXPozszZGw/xjIQ= sha512-Ua9xNhH0b8pwE3yRbFfXJvfdWF0UHNCdeyb2sbi9Ul/M+r3PTdrz7Cv4SCfZRMjmzEM9PhraqfZFbGTIg3OMyA==

fragment-cache@^0.2.1:
  version "0.2.1"
  resolved "https://registry.npmjs.org/fragment-cache/-/fragment-cache-0.2.1.tgz"
  integrity sha1-QpD60n8T6Jvn8zeZxrxaCr//DRk= sha512-GMBAbW9antB8iZRHLoGw0b3HANt57diZYFO/HL1JGIC1MjKrdmhxvrJbupnVvpys0zsz7yBApXdQyfepKly2kA==
  dependencies:
    map-cache "^0.2.2"

fresh@0.5.2:
  version "0.5.2"
  resolved "https://registry.npmjs.org/fresh/-/fresh-0.5.2.tgz"
  integrity sha1-PYyt2Q2XZWn6g1qx+OSyOhBWBac= sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==

fs.realpath@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz"
  integrity sha1-FQStJSMVjKpA20onh8sBQRmU6k8= sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==

fsevents@^1.2.7:
  version "1.2.13"
  resolved "https://registry.npmjs.org/fsevents/-/fsevents-1.2.13.tgz"
  integrity sha512-oWb1Z6mkHIskLzEJ/XWX0srkpkTQ7vaopMQkyaEIoq0fmtFVxOthb8cCxeT+p3ynTdkk/RZwbgG4brR5BeWECw==
  dependencies:
    bindings "^1.5.0"
    nan "^2.12.1"

function-bind@^1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/function-bind/-/function-bind-1.1.1.tgz"
  integrity sha512-yIovAzMX49sF8Yl58fSCWJ5svSLuaibPxXQJFLmBObTuCr0Mf1KiPopGM9NiFjiYBCbfaa2Fh6breQ6ANVTI0A==

gensync@^1.0.0-beta.2:
  version "1.0.0-beta.2"
  resolved "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz"
  integrity sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==

get-caller-file@^2.0.1:
  version "2.0.5"
  resolved "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz"
  integrity sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==

get-intrinsic@^1.0.2, get-intrinsic@^1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.1.1.tgz"
  integrity sha512-kWZrnVM42QCiEA2Ig1bG8zjoIMOgxWwYCEeNdwY6Tv/cOSeGpcoX4pXHfKUxNKVoArnrEr2e9srnAxxGIraS9Q==
  dependencies:
    function-bind "^1.1.1"
    has "^1.0.3"
    has-symbols "^1.0.1"

get-stream@^4.0.0:
  version "4.1.0"
  resolved "https://registry.npmjs.org/get-stream/-/get-stream-4.1.0.tgz"
  integrity sha512-GMat4EJ5161kIy2HevLlr4luNjBgvmj413KaQA7jt4V8B4RDsfpHk7WQ9GVqfYyyx8OS/L66Kox+rJRNklLK7w==
  dependencies:
    pump "^3.0.0"

get-stream@^6.0.0:
  version "6.0.0"
  resolved "https://registry.npmjs.org/get-stream/-/get-stream-6.0.0.tgz"
  integrity sha512-A1B3Bh1UmL0bidM/YX2NsCOTnGJePL9rO/M+Mw3m9f2gUpfokS0hi5Eah0WSUEWZdZhIZtMjkIYS7mDfOqNHbg==

get-value@^2.0.3, get-value@^2.0.6:
  version "2.0.6"
  resolved "https://registry.npmjs.org/get-value/-/get-value-2.0.6.tgz"
  integrity sha1-3BXKHGcjh8p2vTesCjlbogQqLCg= sha512-Ln0UQDlxH1BapMu3GPtf7CuYNwRZf2gwCuPqbyG6pB8WfmFpzqcy4xtAaAMUhnNqjMKTiCPZG2oMT3YSx8U2NA==

glob-parent@^3.1.0:
  version "3.1.0"
  resolved "https://registry.npmjs.org/glob-parent/-/glob-parent-3.1.0.tgz"
  integrity sha1-nmr2KZ2NO9K9QEMIMr0RPfkGxa4= sha512-E8Ak/2+dZY6fnzlR7+ueWvhsH1SjHr4jjss4YS/h4py44jY9MhK/VFdaZJAWDz6BbL21KeteKxFSFpq8OS5gVA==
  dependencies:
    is-glob "^3.1.0"
    path-dirname "^1.0.0"

glob-to-regexp@^0.4.1:
  version "0.4.1"
  resolved "https://registry.npmjs.org/glob-to-regexp/-/glob-to-regexp-0.4.1.tgz"
  integrity sha512-lkX1HJXwyMcprw/5YUZc2s7DrpAiHB21/V+E1rHUrVNokkvB6bqMzT0VfV6/86ZNabt1k14YOIaT7nDvOX3Iiw==

glob@^7.0.3, glob@^7.1.3:
  version "7.1.6"
  resolved "https://registry.npmjs.org/glob/-/glob-7.1.6.tgz"
  integrity sha512-LwaxwyZ72Lk7vZINtNNrywX0ZuLyStrdDtabefZKAY5ZGJhVtgdznluResxNmPitE0SAO+O26sWTHeKSI2wMBA==
  dependencies:
    fs.realpath "^1.0.0"
    inflight "^1.0.4"
    inherits "2"
    minimatch "^3.0.4"
    once "^1.3.0"
    path-is-absolute "^1.0.0"

globals@^11.1.0:
  version "11.12.0"
  resolved "https://registry.npmjs.org/globals/-/globals-11.12.0.tgz"
  integrity sha512-WOBp/EEGUiIsJSp7wcv/y6MO+lV9UoncWqxuFfm8eBwzWNgyfBd6Gz+IeKQ9jCmyhoH99g15M3T+QaVHFjizVA==

globby@^6.1.0:
  version "6.1.0"
  resolved "https://registry.npmjs.org/globby/-/globby-6.1.0.tgz"
  integrity sha1-9abXDoOV4hyFj7BInWTfAkJNUGw= sha512-KVbFv2TQtbzCoxAnfD6JcHZTYCzyliEaaeM/gH8qQdkKr5s0OP9scEgvdcngyk7AVdY6YVW/TJHd+lQ/Df3Daw==
  dependencies:
    array-union "^1.0.1"
    glob "^7.0.3"
    object-assign "^4.0.1"
    pify "^2.0.0"
    pinkie-promise "^2.0.0"

graceful-fs@^4.1.11, graceful-fs@^4.1.2, graceful-fs@^4.2.4:
  version "4.2.6"
  resolved "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.6.tgz"
  integrity sha512-nTnJ528pbqxYanhpDYsi4Rd8MAeaBA67+RZ10CM1m3bTAVFEDcd5AuA4a6W5YkGZ1iNXHzZz8T6TBKLeBuNriQ==

handle-thing@^2.0.0:
  version "2.0.1"
  resolved "https://registry.npmjs.org/handle-thing/-/handle-thing-2.0.1.tgz"
  integrity sha512-9Qn4yBxelxoh2Ow62nP+Ka/kMnOXRi8BXnRaUwezLNhqelnN49xKz4F/dPP8OYLxLxq6JDtZb2i9XznUQbNPTg==

has-bigints@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/has-bigints/-/has-bigints-1.0.1.tgz"
  integrity sha512-LSBS2LjbNBTf6287JEbEzvJgftkF5qFkmCo9hDRpAzKhUOlJ+hx8dd4USs00SgsUNwc4617J9ki5YtEClM2ffA==

has-flag@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/has-flag/-/has-flag-3.0.0.tgz"
  integrity sha1-tdRU3CGZriJWmfNGfloH87lVuv0= sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==

has-flag@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz"
  integrity sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==

has-symbols@^1.0.1, has-symbols@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/has-symbols/-/has-symbols-1.0.2.tgz"
  integrity sha512-chXa79rL/UC2KlX17jo3vRGz0azaWEx5tGqZg5pO3NUyEJVB17dMruQlzCCOfUvElghKcm5194+BCRvi2Rv/Gw==

has-value@^0.3.1:
  version "0.3.1"
  resolved "https://registry.npmjs.org/has-value/-/has-value-0.3.1.tgz"
  integrity sha1-ex9YutpiyoJ+wKIHgCVlSEWZXh8= sha512-gpG936j8/MzaeID5Yif+577c17TxaDmhuyVgSwtnL/q8UUTySg8Mecb+8Cf1otgLoD7DDH75axp86ER7LFsf3Q==
  dependencies:
    get-value "^2.0.3"
    has-values "^0.1.4"
    isobject "^2.0.0"

has-value@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/has-value/-/has-value-1.0.0.tgz"
  integrity sha1-GLKB2lhbHFxR3vJMkw7SmgvmsXc= sha512-IBXk4GTsLYdQ7Rvt+GRBrFSVEkmuOUy4re0Xjd9kJSUQpnTrWR4/y9RpfexN9vkAPMFuQoeWKwqzPozRTlasGw==
  dependencies:
    get-value "^2.0.6"
    has-values "^1.0.0"
    isobject "^3.0.0"

has-values@^0.1.4:
  version "0.1.4"
  resolved "https://registry.npmjs.org/has-values/-/has-values-0.1.4.tgz"
  integrity sha1-bWHeldkd/Km5oCCJrThL/49it3E= sha512-J8S0cEdWuQbqD9//tlZxiMuMNmxB8PlEwvYwuxsTmR1G5RXUePEX/SJn7aD0GMLieuZYSwNH0cQuJGwnYunXRQ==

has-values@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/has-values/-/has-values-1.0.0.tgz"
  integrity sha1-lbC2P+whRmGab+V/51Yo1aOe/k8= sha512-ODYZC64uqzmtfGMEAX/FvZiRyWLpAC3vYnNunURUnkGVTS+mI0smVsWaPydRBsE3g+ok7h960jChO8mFcWlHaQ==
  dependencies:
    is-number "^3.0.0"
    kind-of "^4.0.0"

has@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/has/-/has-1.0.3.tgz"
  integrity sha512-f2dvO0VU6Oej7RkWJGrehjbzMAjFp5/VKPp5tTpWIV4JHHZK1/BxbFRtf/siA2SWTe09caDmVtYYzWEIbBS4zw==
  dependencies:
    function-bind "^1.1.1"

he@^1.2.0:
  version "1.2.0"
  resolved "https://registry.npmjs.org/he/-/he-1.2.0.tgz"
  integrity sha512-F/1DnUGPopORZi0ni+CvrCgHQ5FyEAHRLSApuYWMmrbSwoN2Mn/7k+Gl38gJnR7yyDZk6WLXwiGod1JOWNDKGw==

hpack.js@^2.1.6:
  version "2.1.6"
  resolved "https://registry.npmjs.org/hpack.js/-/hpack.js-2.1.6.tgz"
  integrity sha1-h3dMCUnlE/QuhFdbPEVoH63ioLI= sha512-zJxVehUdMGIKsRaNt7apO2Gqp0BdqW5yaiGHXXmbpvxgBYVZnAql+BJb4RO5ad2MgpbZKn5G6nMnegrH1FcNYQ==
  dependencies:
    inherits "^2.0.1"
    obuf "^1.0.0"
    readable-stream "^2.0.1"
    wbuf "^1.1.0"

html-entities@^1.3.1:
  version "1.4.0"
  resolved "https://registry.npmjs.org/html-entities/-/html-entities-1.4.0.tgz"
  integrity sha512-8nxjcBcd8wovbeKx7h3wTji4e6+rhaVuPNpMqwWgnHh+N9ToqsCs6XztWRBPQ+UtzsoMAdKZtUENoVzU/EMtZA==

html-minifier-terser@^5.0.1:
  version "5.1.1"
  resolved "https://registry.npmjs.org/html-minifier-terser/-/html-minifier-terser-5.1.1.tgz"
  integrity sha512-ZPr5MNObqnV/T9akshPKbVgyOqLmy+Bxo7juKCfTfnjNniTAMdy4hz21YQqoofMBJD2kdREaqPPdThoR78Tgxg==
  dependencies:
    camel-case "^4.1.1"
    clean-css "^4.2.3"
    commander "^4.1.1"
    he "^1.2.0"
    param-case "^3.0.3"
    relateurl "^0.2.7"
    terser "^4.6.3"

html-webpack-plugin@^4.5.1:
  version "4.5.2"
  resolved "https://registry.npmjs.org/html-webpack-plugin/-/html-webpack-plugin-4.5.2.tgz"
  integrity sha512-q5oYdzjKUIPQVjOosjgvCHQOv9Ett9CYYHlgvJeXG0qQvdSojnBq4vAdQBwn1+yGveAwHCoe/rMR86ozX3+c2A==
  dependencies:
    "@types/html-minifier-terser" "^5.0.0"
    "@types/tapable" "^1.0.5"
    "@types/webpack" "^4.41.8"
    html-minifier-terser "^5.0.1"
    loader-utils "^1.2.3"
    lodash "^4.17.20"
    pretty-error "^2.1.1"
    tapable "^1.1.3"
    util.promisify "1.0.0"

htmlparser2@^3.10.1:
  version "3.10.1"
  resolved "https://registry.npmjs.org/htmlparser2/-/htmlparser2-3.10.1.tgz"
  integrity sha512-IgieNijUMbkDovyoKObU1DUhm1iwNYE/fuifEoEHfd1oZKZDaONBSkal7Y01shxsM49R4XaMdGez3WnF9UfiCQ==
  dependencies:
    domelementtype "^1.3.1"
    domhandler "^2.3.0"
    domutils "^1.5.1"
    entities "^1.1.1"
    inherits "^2.0.1"
    readable-stream "^3.1.1"

http-deceiver@^1.2.7:
  version "1.2.7"
  resolved "https://registry.npmjs.org/http-deceiver/-/http-deceiver-1.2.7.tgz"
  integrity sha1-+nFolEq5pRnTN8sL7HKE3D5yPYc= sha512-LmpOGxTfbpgtGVxJrj5k7asXHCgNZp5nLfp+hWc8QQRqtb7fUy6kRY3BO1h9ddF6yIPYUARgxGOwB42DnxIaNw==

http-errors@~1.6.2:
  version "1.6.3"
  resolved "https://registry.npmjs.org/http-errors/-/http-errors-1.6.3.tgz"
  integrity sha1-i1VoC7S+KDoLW/TqLjhYC+HZMg0= sha512-lks+lVC8dgGyh97jxvxeYTWQFvh4uw4yC12gVl63Cg30sjPX4wuGcdkICVXDAESr6OJGjqGA8Iz5mkeN6zlD7A==
  dependencies:
    depd "~1.1.2"
    inherits "2.0.3"
    setprototypeof "1.1.0"
    statuses ">= 1.4.0 < 2"

http-errors@~1.7.2, http-errors@1.7.2:
  version "1.7.2"
  resolved "https://registry.npmjs.org/http-errors/-/http-errors-1.7.2.tgz"
  integrity sha512-uUQBt3H/cSIVfch6i1EuPNy/YsRSOUBXTVfZ+yR7Zjez3qjBz6i9+i4zjNaoqcoFVI4lQJ5plg63TvGfRSDCRg==
  dependencies:
    depd "~1.1.2"
    inherits "2.0.3"
    setprototypeof "1.1.1"
    statuses ">= 1.5.0 < 2"
    toidentifier "1.0.0"

http-parser-js@>=0.5.1:
  version "0.5.3"
  resolved "https://registry.npmjs.org/http-parser-js/-/http-parser-js-0.5.3.tgz"
  integrity sha512-t7hjvef/5HEK7RWTdUzVUhl8zkEu+LlaE0IYzdMuvbSDipxBRpOn4Uhw8ZyECEa808iVT8XCjzo6xmYt4CiLZg==

http-proxy-middleware@0.19.1:
  version "0.19.1"
  resolved "https://registry.npmjs.org/http-proxy-middleware/-/http-proxy-middleware-0.19.1.tgz"
  integrity sha512-yHYTgWMQO8VvwNS22eLLloAkvungsKdKTLO8AJlftYIKNfJr3GK3zK0ZCfzDDGUBttdGc8xFy1mCitvNKQtC3Q==
  dependencies:
    http-proxy "^1.17.0"
    is-glob "^4.0.0"
    lodash "^4.17.11"
    micromatch "^3.1.10"

http-proxy@^1.17.0:
  version "1.18.1"
  resolved "https://registry.npmjs.org/http-proxy/-/http-proxy-1.18.1.tgz"
  integrity sha512-7mz/721AbnJwIVbnaSv1Cz3Am0ZLT/UBwkC92VlxhXv/k/BBQfM2fXElQNC27BVGr0uwUpplYPQM9LnaBMR5NQ==
  dependencies:
    eventemitter3 "^4.0.0"
    follow-redirects "^1.0.0"
    requires-port "^1.0.0"

human-signals@^2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/human-signals/-/human-signals-2.1.0.tgz"
  integrity sha512-B4FFZ6q/T2jhhksgkbEW3HBvWIfDW85snkQgawt07S7J5QXTk6BkNV+0yAeZrM5QpMAdYlocGoljn0sJ/WQkFw==

iconv-lite@0.4.24:
  version "0.4.24"
  resolved "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.4.24.tgz"
  integrity sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==
  dependencies:
    safer-buffer ">= 2.1.2 < 3"

import-local@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/import-local/-/import-local-2.0.0.tgz"
  integrity sha512-b6s04m3O+s3CGSbqDIyP4R6aAwAeYlVq9+WUWep6iHa8ETRf9yei1U48C5MmfJmV9AiLYYBKPMq/W+/WRpQmCQ==
  dependencies:
    pkg-dir "^3.0.0"
    resolve-cwd "^2.0.0"

import-local@^3.0.2:
  version "3.0.2"
  resolved "https://registry.npmjs.org/import-local/-/import-local-3.0.2.tgz"
  integrity sha512-vjL3+w0oulAVZ0hBHnxa/Nm5TAurf9YLQJDhqRZyqb+VKGOB6LU8t9H1Nr5CIo16vh9XfJTOoHwU0B71S557gA==
  dependencies:
    pkg-dir "^4.2.0"
    resolve-cwd "^3.0.0"

inflight@^1.0.4:
  version "1.0.6"
  resolved "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz"
  integrity sha1-Sb1jMdfQLQwJvJEKEHW6gWW1bfk= sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==
  dependencies:
    once "^1.3.0"
    wrappy "1"

inherits@^2.0.1, inherits@^2.0.3, inherits@^2.0.4, inherits@~2.0.3, inherits@2:
  version "2.0.4"
  resolved "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz"
  integrity sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==

inherits@2.0.3:
  version "2.0.3"
  resolved "https://registry.npmjs.org/inherits/-/inherits-2.0.3.tgz"
  integrity sha1-Yzwsg+PaQqUC9SRmAiSA9CCCYd4= sha512-x00IRNXNy63jwGkJmzPigoySHbaqpNuzKbBOmzK+g2OdZpQ9w+sxCN+VSB3ja7IAge2OP2qpfxTjeNcyjmW1uw==

internal-ip@^4.3.0:
  version "4.3.0"
  resolved "https://registry.npmjs.org/internal-ip/-/internal-ip-4.3.0.tgz"
  integrity sha512-S1zBo1D6zcsyuC6PMmY5+55YMILQ9av8lotMx447Bq6SAgo/sDK6y6uUKmuYhW7eacnIhFfsPmCNYdDzsnnDCg==
  dependencies:
    default-gateway "^4.2.0"
    ipaddr.js "^1.9.0"

interpret@^2.2.0:
  version "2.2.0"
  resolved "https://registry.npmjs.org/interpret/-/interpret-2.2.0.tgz"
  integrity sha512-Ju0Bz/cEia55xDwUWEa8+olFpCiQoypjnQySseKtmjNrnps3P+xfpUmGr90T7yjlVJmOtybRvPXhKMbHr+fWnw==

ip-regex@^2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/ip-regex/-/ip-regex-2.1.0.tgz"
  integrity sha1-+ni/XS5pE8kRzp+BnuUUa7bYROk= sha512-58yWmlHpp7VYfcdTwMTvwMmqx/Elfxjd9RXTDyMsbL7lLWmhMylLEqiYVLKuLzOZqVgiWXD9MfR62Vv89VRxkw==

ip@^1.1.0, ip@^1.1.5:
  version "1.1.5"
  resolved "https://registry.npmjs.org/ip/-/ip-1.1.5.tgz"
  integrity sha1-vd7XARQpCCjAoDnnLvJfWq7ENUo= sha512-rBtCAQAJm8A110nbwn6YdveUnuZH3WrC36IwkRXxDnq53JvXA2NVQvB7IHyKomxK1MJ4VDNw3UtFDdXQ+AvLYA==

ipaddr.js@^1.9.0, ipaddr.js@1.9.1:
  version "1.9.1"
  resolved "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz"
  integrity sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==

is-absolute-url@^3.0.3:
  version "3.0.3"
  resolved "https://registry.npmjs.org/is-absolute-url/-/is-absolute-url-3.0.3.tgz"
  integrity sha512-opmNIX7uFnS96NtPmhWQgQx6/NYFgsUXYMllcfzwWKUMwfo8kku1TvE6hkNcH+Q1ts5cMVrsY7j0bxXQDciu9Q==

is-accessor-descriptor@^0.1.6:
  version "0.1.6"
  resolved "https://registry.npmjs.org/is-accessor-descriptor/-/is-accessor-descriptor-0.1.6.tgz"
  integrity sha1-qeEss66Nh2cn7u84Q/igiXtcmNY= sha512-e1BM1qnDbMRG3ll2U9dSK0UMHuWOs3pY3AtcFsmvwPtKL3MML/Q86i+GilLfvqEs4GW+ExB91tQ3Ig9noDIZ+A==
  dependencies:
    kind-of "^3.0.2"

is-accessor-descriptor@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/is-accessor-descriptor/-/is-accessor-descriptor-1.0.0.tgz"
  integrity sha512-m5hnHTkcVsPfqx3AKlyttIPb7J+XykHvJP2B9bZDjlhLIoEq4XoK64Vg7boZlVWYK6LUY94dYPEE7Lh0ZkZKcQ==
  dependencies:
    kind-of "^6.0.0"

is-arguments@^1.0.4:
  version "1.1.0"
  resolved "https://registry.npmjs.org/is-arguments/-/is-arguments-1.1.0.tgz"
  integrity sha512-1Ij4lOMPl/xB5kBDn7I+b2ttPMKa8szhEIrXDuXQD/oe3HJLTLhqhgGspwgyGd6MOywBUqVvYicF72lkgDnIHg==
  dependencies:
    call-bind "^1.0.0"

is-bigint@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/is-bigint/-/is-bigint-1.0.1.tgz"
  integrity sha512-J0ELF4yHFxHy0cmSxZuheDOz2luOdVvqjwmEcj8H/L1JHeuEDSDbeRP+Dk9kFVk5RTFzbucJ2Kb9F7ixY2QaCg==

is-binary-path@^1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/is-binary-path/-/is-binary-path-1.0.1.tgz"
  integrity sha1-dfFmQrSA8YenEcgUFh/TpKdlWJg= sha512-9fRVlXc0uCxEDj1nQzaWONSpbTfx0FmJfzHF7pwlI8DkWGoHBBea4Pg5Ky0ojwwxQmnSifgbKkI06Qv0Ljgj+Q==
  dependencies:
    binary-extensions "^1.0.0"

is-boolean-object@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.1.0.tgz"
  integrity sha512-a7Uprx8UtD+HWdyYwnD1+ExtTgqQtD2k/1yJgtXP6wnMm8byhkoTZRl+95LLThpzNZJ5aEvi46cdH+ayMFRwmA==
  dependencies:
    call-bind "^1.0.0"

is-buffer@^1.1.5:
  version "1.1.6"
  resolved "https://registry.npmjs.org/is-buffer/-/is-buffer-1.1.6.tgz"
  integrity sha512-NcdALwpXkTm5Zvvbk7owOUSvVvBKDgKP5/ewfXEznmQFfs4ZRmanOeKBTjRVjka3QFoN6XJ+9F3USqfHqTaU5w==

is-callable@^1.1.4, is-callable@^1.2.3:
  version "1.2.3"
  resolved "https://registry.npmjs.org/is-callable/-/is-callable-1.2.3.tgz"
  integrity sha512-J1DcMe8UYTBSrKezuIUTUwjXsho29693unXM2YhJUTR2txK/eG47bvNa/wipPFmZFgr/N6f1GA66dv0mEyTIyQ==

is-core-module@^2.2.0:
  version "2.2.0"
  resolved "https://registry.npmjs.org/is-core-module/-/is-core-module-2.2.0.tgz"
  integrity sha512-XRAfAdyyY5F5cOXn7hYQDqh2Xmii+DEfIcQGxK/uNwMHhIkPWO0g8msXcbzLe+MpGoR951MlqM/2iIlU4vKDdQ==
  dependencies:
    has "^1.0.3"

is-data-descriptor@^0.1.4:
  version "0.1.4"
  resolved "https://registry.npmjs.org/is-data-descriptor/-/is-data-descriptor-0.1.4.tgz"
  integrity sha1-C17mSDiOLIYCgueT8YVv7D8wG1Y= sha512-+w9D5ulSoBNlmw9OHn3U2v51SyoCd0he+bB3xMl62oijhrspxowjU+AIcDY0N3iEJbUEkB15IlMASQsxYigvXg==
  dependencies:
    kind-of "^3.0.2"

is-data-descriptor@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/is-data-descriptor/-/is-data-descriptor-1.0.0.tgz"
  integrity sha512-jbRXy1FmtAoCjQkVmIVYwuuqDFUbaOeDjmed1tOGPrsMhtJA4rD9tkgA0F1qJ3gRFRXcHYVkdeaP50Q5rE/jLQ==
  dependencies:
    kind-of "^6.0.0"

is-date-object@^1.0.1:
  version "1.0.2"
  resolved "https://registry.npmjs.org/is-date-object/-/is-date-object-1.0.2.tgz"
  integrity sha512-USlDT524woQ08aoZFzh3/Z6ch9Y/EWXEHQ/AaRN0SkKq4t2Jw2R2339tSXmwuVoY7LLlBCbOIlx2myP/L5zk0g==

is-descriptor@^0.1.0:
  version "0.1.6"
  resolved "https://registry.npmjs.org/is-descriptor/-/is-descriptor-0.1.6.tgz"
  integrity sha512-avDYr0SB3DwO9zsMov0gKCESFYqCnE4hq/4z3TdUlukEy5t9C0YRq7HLrsN52NAcqXKaepeCD0n+B0arnVG3Hg==
  dependencies:
    is-accessor-descriptor "^0.1.6"
    is-data-descriptor "^0.1.4"
    kind-of "^5.0.0"

is-descriptor@^1.0.0, is-descriptor@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/is-descriptor/-/is-descriptor-1.0.2.tgz"
  integrity sha512-2eis5WqQGV7peooDyLmNEPUrps9+SXX5c9pL3xEB+4e9HnGuDa7mB7kHxHw4CbqS9k1T2hOH3miL8n8WtiYVtg==
  dependencies:
    is-accessor-descriptor "^1.0.0"
    is-data-descriptor "^1.0.0"
    kind-of "^6.0.2"

is-extendable@^0.1.0, is-extendable@^0.1.1:
  version "0.1.1"
  resolved "https://registry.npmjs.org/is-extendable/-/is-extendable-0.1.1.tgz"
  integrity sha1-YrEQ4omkcUGOPsNqYX1HLjAd/Ik= sha512-5BMULNob1vgFX6EjQw5izWDxrecWK9AM72rugNr0TFldMOi0fj6Jk+zeKIt0xGj4cEfQIJth4w3OKWOJ4f+AFw==

is-extendable@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/is-extendable/-/is-extendable-1.0.1.tgz"
  integrity sha512-arnXMxT1hhoKo9k1LZdmlNyJdDDfy2v0fXjFlmok4+i8ul/6WlbVge9bhM74OpNPQPMGUToDtz+KXa1PneJxOA==
  dependencies:
    is-plain-object "^2.0.4"

is-extglob@^2.1.0, is-extglob@^2.1.1:
  version "2.1.1"
  resolved "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz"
  integrity sha1-qIwCU1eR8C7TfHahueqXc8gz+MI= sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==

is-fullwidth-code-point@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-2.0.0.tgz"
  integrity sha1-o7MKXE8ZkYMWeqq5O+764937ZU8= sha512-VHskAKYM8RfSFXwee5t5cbN5PZeq1Wrh6qd5bkyiXIf6UQcN6w/A0eXM9r6t8d+GYOh+o6ZhiEnb88LN/Y8m2w==

is-glob@^3.1.0:
  version "3.1.0"
  resolved "https://registry.npmjs.org/is-glob/-/is-glob-3.1.0.tgz"
  integrity sha1-e6WuJCF4BKxwcHuWkiVnSGzD6Eo= sha512-UFpDDrPgM6qpnFNI+rh/p3bUaq9hKLZN8bMUWzxmcnZVS3omf4IPK+BrewlnWjO1WmUsMYuSjKh4UJuV4+Lqmw==
  dependencies:
    is-extglob "^2.1.0"

is-glob@^4.0.0:
  version "4.0.1"
  resolved "https://registry.npmjs.org/is-glob/-/is-glob-4.0.1.tgz"
  integrity sha512-5G0tKtBTFImOqDnLB2hG6Bp2qcKEFduo4tZu9MT/H6NQv/ghhy30o55ufafxJ/LdH79LLs2Kfrn85TLKyA7BUg==
  dependencies:
    is-extglob "^2.1.1"

is-negative-zero@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.1.tgz"
  integrity sha512-2z6JzQvZRa9A2Y7xC6dQQm4FSTSTNWjKIYYTt4246eMTJmIo0Q+ZyOsU66X8lxK1AbB92dFeglPLrhwpeRKO6w==

is-number-object@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/is-number-object/-/is-number-object-1.0.4.tgz"
  integrity sha512-zohwelOAur+5uXtk8O3GPQ1eAcu4ZX3UwxQhUlfFFMNpUd83gXgjbhJh6HmB6LUNV/ieOLQuDwJO3dWJosUeMw==

is-number@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/is-number/-/is-number-3.0.0.tgz"
  integrity sha1-JP1iAaR4LPUFYcgQJ2r8fRLXEZU= sha512-4cboCqIpliH+mAvFNegjZQ4kgKc3ZUhQVr3HvWbSh5q3WH2v82ct+T2Y1hdU5Gdtorx/cLifQjqCbL7bpznLTg==
  dependencies:
    kind-of "^3.0.2"

is-path-cwd@^2.0.0:
  version "2.2.0"
  resolved "https://registry.npmjs.org/is-path-cwd/-/is-path-cwd-2.2.0.tgz"
  integrity sha512-w942bTcih8fdJPJmQHFzkS76NEP8Kzzvmw92cXsazb8intwLqPibPPdXf4ANdKV3rYMuuQYGIWtvz9JilB3NFQ==

is-path-in-cwd@^2.0.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/is-path-in-cwd/-/is-path-in-cwd-2.1.0.tgz"
  integrity sha512-rNocXHgipO+rvnP6dk3zI20RpOtrAM/kzbB258Uw5BWr3TpXi861yzjo16Dn4hUox07iw5AyeMLHWsujkjzvRQ==
  dependencies:
    is-path-inside "^2.1.0"

is-path-inside@^2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/is-path-inside/-/is-path-inside-2.1.0.tgz"
  integrity sha512-wiyhTzfDWsvwAW53OBWF5zuvaOGlZ6PwYxAbPVDhpm+gM09xKQGjBq/8uYN12aDvMxnAnq3dxTyoSoRNmg5YFg==
  dependencies:
    path-is-inside "^1.0.2"

is-plain-object@^2.0.3, is-plain-object@^2.0.4:
  version "2.0.4"
  resolved "https://registry.npmjs.org/is-plain-object/-/is-plain-object-2.0.4.tgz"
  integrity sha512-h5PpgXkWitc38BBMYawTYMWJHFZJVnBquFE57xFpjB8pJFiF6gZ+bU+WyI/yqXiFR5mdLsgYNaPe8uao6Uv9Og==
  dependencies:
    isobject "^3.0.1"

is-regex@^1.0.4, is-regex@^1.1.2:
  version "1.1.2"
  resolved "https://registry.npmjs.org/is-regex/-/is-regex-1.1.2.tgz"
  integrity sha512-axvdhb5pdhEVThqJzYXwMlVuZwC+FF2DpcOhTS+y/8jVq4trxyPgfcwIxIKiyeuLlSQYKkmUaPQJ8ZE4yNKXDg==
  dependencies:
    call-bind "^1.0.2"
    has-symbols "^1.0.1"

is-stream@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/is-stream/-/is-stream-1.1.0.tgz"
  integrity sha1-EtSj3U5o4Lec6428hBc66A2RykQ= sha512-uQPm8kcs47jx38atAcWTVxyltQYoPT68y9aWYdV6yWXSyW8mzSat0TL6CiWdZeCdF3KrAvpVtnHbTv4RN+rqdQ==

is-stream@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/is-stream/-/is-stream-2.0.0.tgz"
  integrity sha512-XCoy+WlUr7d1+Z8GgSuXmpuUFC9fOhRXglJMx+dwLKTkL44Cjd4W1Z5P+BQZpr+cR93aGP4S/s7Ftw6Nd/kiEw==

is-string@^1.0.5:
  version "1.0.5"
  resolved "https://registry.npmjs.org/is-string/-/is-string-1.0.5.tgz"
  integrity sha512-buY6VNRjhQMiF1qWDouloZlQbRhDPCebwxSjxMjxgemYT46YMd2NR0/H+fBhEfWX4A/w9TBJ+ol+okqJKFE6vQ==

is-symbol@^1.0.2, is-symbol@^1.0.3:
  version "1.0.3"
  resolved "https://registry.npmjs.org/is-symbol/-/is-symbol-1.0.3.tgz"
  integrity sha512-OwijhaRSgqvhm/0ZdAcXNZt9lYdKFpcRDT5ULUuYXPoT794UNOdU+gpT6Rzo7b4V2HUl/op6GqY894AZwv9faQ==
  dependencies:
    has-symbols "^1.0.1"

is-windows@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/is-windows/-/is-windows-1.0.2.tgz"
  integrity sha512-eXK1UInq2bPmjyX6e3VHIzMLobc4J94i4AWn+Hpq3OU5KkrRC96OAcR3PRJ/pGu6m8TRnBHP9dkXQVsT/COVIA==

is-wsl@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/is-wsl/-/is-wsl-1.1.0.tgz"
  integrity sha1-HxbkqiKwTRM2tmGIpmrzxgDDpm0= sha512-gfygJYZ2gLTDlmbWMI0CE2MwnFzSN/2SZfkMlItC4K/JBlsWVDB0bO6XhqcY13YXE7iMcAJnzTCJjPiTeJJ0Mw==

isarray@~1.0.0, isarray@1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/isarray/-/isarray-1.0.0.tgz"
  integrity sha1-u5NdSFgsuhaMBoNJV6VKPgcSTxE= sha512-VLghIWNM6ELQzo7zwmcg0NmTVyWKYjvIeM83yjp0wRDTmUnrM678fQbcKBo6n2CJEF0szoG//ytg+TKla89ALQ==

isexe@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz"
  integrity sha1-6PvzdNxVb/iUehDcsFctYz8s+hA= sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==

isobject@^2.0.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/isobject/-/isobject-2.1.0.tgz"
  integrity sha1-8GVWEJaj8dou9GJy+BXIQNh+DIk= sha512-+OUdGJlgjOBZDfxnDjYYG6zp487z0JGNQq3cYQYg5f5hKR+syHMsaztzGeml/4kGG55CSpKSpWTY+jYGgsHLgA==
  dependencies:
    isarray "1.0.0"

isobject@^3.0.0, isobject@^3.0.1:
  version "3.0.1"
  resolved "https://registry.npmjs.org/isobject/-/isobject-3.0.1.tgz"
  integrity sha1-TkMekrEalzFjaqH5yNHMvP2reN8= sha512-WhB9zCku7EGTj/HQQRz5aUQEUeoQZH2bWcltRErOpymJ4boYE6wL9Tbr23krRPSZ+C5zqNSrSw+Cc7sZZ4b7vg==

jest-worker@^26.6.2:
  version "26.6.2"
  resolved "https://registry.npmjs.org/jest-worker/-/jest-worker-26.6.2.tgz"
  integrity sha512-KWYVV1c4i+jbMpaBC+U++4Va0cp8OisU185o73T1vo99hqi7w8tSJfUXYswwqqrjzwxa6KpRK54WhPvwf5w6PQ==
  dependencies:
    "@types/node" "*"
    merge-stream "^2.0.0"
    supports-color "^7.0.0"

js-tokens@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz"
  integrity sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==

jsesc@^2.5.1:
  version "2.5.2"
  resolved "https://registry.npmjs.org/jsesc/-/jsesc-2.5.2.tgz"
  integrity sha512-OYu7XEzjkCQ3C5Ps3QIZsQfNpqoJyZZA99wd9aWd05NCtC5pWOkShK2mkL6HXQR6/Cy2lbNdPlZBpuQHXE63gA==

jsesc@~0.5.0:
  version "0.5.0"
  resolved "https://registry.npmjs.org/jsesc/-/jsesc-0.5.0.tgz"
  integrity sha1-597mbjXW/Bb3EP6R1c9p9w8IkR0= sha512-uZz5UnB7u4T9LvwmFqXii7pZSouaRPorGs5who1Ip7VO0wxanFvBL7GkM6dTHlgX+jhBApRetaWpnDabOeTcnA==

json-parse-better-errors@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/json-parse-better-errors/-/json-parse-better-errors-1.0.2.tgz"
  integrity sha512-mrqyZKfX5EhL7hvqcV6WG1yYjnjeuYDzDhhcAAUrq8Po85NBQBJP+ZDUT75qZQ98IkUoBqdkExkukOU7Ts2wrw==

json-schema-traverse@^0.4.1:
  version "0.4.1"
  resolved "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz"
  integrity sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==

json3@^3.3.3:
  version "3.3.3"
  resolved "https://registry.npmjs.org/json3/-/json3-3.3.3.tgz"
  integrity sha512-c7/8mbUsKigAbLkD5B010BK4D9LZm7A1pNItkEwiUZRpIN66exu/e7YQWysGun+TRKaJp8MhemM+VkfWv42aCA==

json5@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/json5/-/json5-1.0.1.tgz"
  integrity sha512-aKS4WQjPenRxiQsC93MNfjx+nbF4PAdYzmd/1JIj8HYzqfbu86beTuNgXDzPknWk0n0uARlyewZo4s++ES36Ow==
  dependencies:
    minimist "^1.2.0"

json5@^2.1.2:
  version "2.2.0"
  resolved "https://registry.npmjs.org/json5/-/json5-2.2.0.tgz"
  integrity sha512-f+8cldu7X/y7RAJurMEJmdoKXGB/X550w2Nr3tTbezL6RwEE/iMcm+tZnXeoZtKuOq6ft8+CqzEkrIgx1fPoQA==
  dependencies:
    minimist "^1.2.5"

killable@^1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/killable/-/killable-1.0.1.tgz"
  integrity sha512-LzqtLKlUwirEUyl/nicirVmNiPvYs7l5n8wOPP7fyJVpUPkvCnW/vuiXGpylGUlnPDnB7311rARzAt3Mhswpjg==

kind-of@^3.0.2, kind-of@^3.0.3, kind-of@^3.2.0:
  version "3.2.2"
  resolved "https://registry.npmjs.org/kind-of/-/kind-of-3.2.2.tgz"
  integrity sha1-MeohpzS6ubuw8yRm2JOupR5KPGQ= sha512-NOW9QQXMoZGg/oqnVNoNTTIFEIid1627WCffUBJEdMxYApq7mNE7CpzucIPc+ZQg25Phej7IJSmX3hO+oblOtQ==
  dependencies:
    is-buffer "^1.1.5"

kind-of@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/kind-of/-/kind-of-4.0.0.tgz"
  integrity sha1-IIE989cSkosgc3hpGkUGb65y3Vc= sha512-24XsCxmEbRwEDbz/qz3stgin8TTzZ1ESR56OMCN0ujYg+vRutNSiOj9bHH9u85DKgXguraugV5sFuvbD4FW/hw==
  dependencies:
    is-buffer "^1.1.5"

kind-of@^5.0.0:
  version "5.1.0"
  resolved "https://registry.npmjs.org/kind-of/-/kind-of-5.1.0.tgz"
  integrity sha512-NGEErnH6F2vUuXDh+OlbcKW7/wOcfdRHaZ7VWtqCztfHri/++YKmP51OdWeGPuqCOba6kk2OTe5d02VmTB80Pw==

kind-of@^6.0.0:
  version "6.0.3"
  resolved "https://registry.npmjs.org/kind-of/-/kind-of-6.0.3.tgz"
  integrity sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==

kind-of@^6.0.2:
  version "6.0.3"
  resolved "https://registry.npmjs.org/kind-of/-/kind-of-6.0.3.tgz"
  integrity sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==

loader-runner@^4.2.0:
  version "4.2.0"
  resolved "https://registry.npmjs.org/loader-runner/-/loader-runner-4.2.0.tgz"
  integrity sha512-92+huvxMvYlMzMt0iIOukcwYBFpkYJdpl2xsZ7LrlayO7E8SOv+JJUEK17B/dJIHAOLMfh2dZZ/Y18WgmGtYNw==

loader-utils@^1.2.3, loader-utils@^1.4.0:
  version "1.4.0"
  resolved "https://registry.npmjs.org/loader-utils/-/loader-utils-1.4.0.tgz"
  integrity sha512-qH0WSMBtn/oHuwjy/NucEgbx5dbxxnxup9s4PVXJUDHZBQY+s0NWA9rJf53RBnQZxfch7euUui7hpoAPvALZdA==
  dependencies:
    big.js "^5.2.2"
    emojis-list "^3.0.0"
    json5 "^1.0.1"

loader-utils@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/loader-utils/-/loader-utils-2.0.0.tgz"
  integrity sha512-rP4F0h2RaWSvPEkD7BLDFQnvSf+nK+wr3ESUjNTyAGobqrijmW92zc+SO6d4p4B1wh7+B/Jg1mkQe5NYUEHtHQ==
  dependencies:
    big.js "^5.2.2"
    emojis-list "^3.0.0"
    json5 "^2.1.2"

locate-path@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/locate-path/-/locate-path-3.0.0.tgz"
  integrity sha512-7AO748wWnIhNqAuaty2ZWHkQHRSNfPVIsPIfwEOWO22AmaoVrWavlOcMR5nzTLNYvp36X220/maaRsrec1G65A==
  dependencies:
    p-locate "^3.0.0"
    path-exists "^3.0.0"

locate-path@^5.0.0:
  version "5.0.0"
  resolved "https://registry.npmjs.org/locate-path/-/locate-path-5.0.0.tgz"
  integrity sha512-t7hw9pI+WvuwNJXwk5zVHpyhIqzg2qTlklJOf0mVxGSbe3Fp2VieZcduNYjaLDoy6p9uGpQEGWG87WpMKlNq8g==
  dependencies:
    p-locate "^4.1.0"

lodash.debounce@^4.0.8:
  version "4.0.8"
  resolved "https://registry.npmjs.org/lodash.debounce/-/lodash.debounce-4.0.8.tgz"
  integrity sha1-gteb/zCmfEAF/9XiUVMArZyk168= sha512-FT1yDzDYEoYWhnSGnpE/4Kj1fLZkDFyqRb7fNt6FdYOSxlUWAtp42Eh6Wb0rGIv/m9Bgo7x4GhQbm5Ys4SG5ow==

lodash@^4.17.11, lodash@^4.17.14, lodash@^4.17.19, lodash@^4.17.20:
  version "4.17.21"
  resolved "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz"
  integrity sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==

loglevel@^1.6.8:
  version "1.7.1"
  resolved "https://registry.npmjs.org/loglevel/-/loglevel-1.7.1.tgz"
  integrity sha512-Hesni4s5UkWkwCGJMQGAh71PaLUmKFM60dHvq0zi/vDhhrzuk+4GgNbTXJ12YYQJn6ZKBDNIjYcuQGKudvqrIw==

lower-case@^2.0.2:
  version "2.0.2"
  resolved "https://registry.npmjs.org/lower-case/-/lower-case-2.0.2.tgz"
  integrity sha512-7fm3l3NAF9WfN6W3JOmf5drwpVqX78JtoGJ3A6W0a6ZnldM41w2fV5D490psKFTpMds8TJse/eHLFFsNHHjHgg==
  dependencies:
    tslib "^2.0.3"

make-dir@^3.0.2, make-dir@^3.1.0:
  version "3.1.0"
  resolved "https://registry.npmjs.org/make-dir/-/make-dir-3.1.0.tgz"
  integrity sha512-g3FeP20LNwhALb/6Cz6Dd4F2ngze0jz7tbzrD2wAV+o9FeNHe4rL+yK2md0J/fiSf1sa1ADhXqi5+oVwOM/eGw==
  dependencies:
    semver "^6.0.0"

map-cache@^0.2.2:
  version "0.2.2"
  resolved "https://registry.npmjs.org/map-cache/-/map-cache-0.2.2.tgz"
  integrity sha1-wyq9C9ZSXZsFFkW7TyasXcmKDb8= sha512-8y/eV9QQZCiyn1SprXSrCmqJN0yNRATe+PO8ztwqrvrbdRLA3eYJF0yaR0YayLWkMbsQSKWS9N2gPcGEc4UsZg==

map-visit@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/map-visit/-/map-visit-1.0.0.tgz"
  integrity sha1-7Nyo8TFE5mDxtb1B8S80edmN+48= sha512-4y7uGv8bd2WdM9vpQsiQNo41Ln1NvhvDRuVt0k2JZQ+ezN2uaQes7lZeZ+QQUHOLQAtDaBJ+7wCbi+ab/KFs+w==
  dependencies:
    object-visit "^1.0.0"

media-typer@0.3.0:
  version "0.3.0"
  resolved "https://registry.npmjs.org/media-typer/-/media-typer-0.3.0.tgz"
  integrity sha1-hxDXrwqmJvj/+hzgAWhUUmMlV0g= sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==

memory-fs@^0.4.1:
  version "0.4.1"
  resolved "https://registry.npmjs.org/memory-fs/-/memory-fs-0.4.1.tgz"
  integrity sha1-OpoguEYlI+RHz7x+i7gO1me/xVI= sha512-cda4JKCxReDXFXRqOHPQscuIYg1PvxbE2S2GP45rnwfEK+vZaXC8C1OFvdHIbgw0DLzowXGVoxLaAmlgRy14GQ==
  dependencies:
    errno "^0.1.3"
    readable-stream "^2.0.1"

merge-descriptors@1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-1.0.1.tgz"
  integrity sha1-sAqqVW3YtEVoFQ7J0blT8/kMu2E= sha512-cCi6g3/Zr1iqQi6ySbseM1Xvooa98N0w31jzUYrXPX2xqObmFGHJ0tQ5u74H3mVh7wLouTseZyYIq39g8cNp1w==

merge-stream@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/merge-stream/-/merge-stream-2.0.0.tgz"
  integrity sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w==

methods@~1.1.2:
  version "1.1.2"
  resolved "https://registry.npmjs.org/methods/-/methods-1.1.2.tgz"
  integrity sha1-VSmk1nZUE07cxSZmVoNbD4Ua/O4= sha512-iclAHeNqNm68zFtnZ0e+1L2yUIdvzNoauKU4WBA3VvH/vPFieF7qfRlwUZU+DA9P9bPXIS90ulxoUoCH23sV2w==

micromatch@^3.1.10, micromatch@^3.1.4:
  version "3.1.10"
  resolved "https://registry.npmjs.org/micromatch/-/micromatch-3.1.10.tgz"
  integrity sha512-MWikgl9n9M3w+bpsY3He8L+w9eF9338xRl8IAO5viDizwSzziFEyUzo2xrrloB64ADbTf8uA8vRqqttDTOmccg==
  dependencies:
    arr-diff "^4.0.0"
    array-unique "^0.3.2"
    braces "^2.3.1"
    define-property "^2.0.2"
    extend-shallow "^3.0.2"
    extglob "^2.0.4"
    fragment-cache "^0.2.1"
    kind-of "^6.0.2"
    nanomatch "^1.2.9"
    object.pick "^1.3.0"
    regex-not "^1.0.0"
    snapdragon "^0.8.1"
    to-regex "^3.0.2"

"mime-db@>= 1.43.0 < 2", mime-db@1.47.0:
  version "1.47.0"
  resolved "https://registry.npmjs.org/mime-db/-/mime-db-1.47.0.tgz"
  integrity sha512-QBmA/G2y+IfeS4oktet3qRZ+P5kPhCKRXxXnQEudYqUaEioAU1/Lq2us3D/t1Jfo4hE9REQPrbB7K5sOczJVIw==

mime-types@^2.1.27, mime-types@~2.1.17, mime-types@~2.1.24:
  version "2.1.30"
  resolved "https://registry.npmjs.org/mime-types/-/mime-types-2.1.30.tgz"
  integrity sha512-crmjA4bLtR8m9qLpHvgxSChT+XoSlZi8J4n/aIdn3z92e/U47Z0V/yl+Wh9W046GgFVAmoNR/fmdbZYcSSIUeg==
  dependencies:
    mime-db "1.47.0"

mime@^2.4.4:
  version "2.5.2"
  resolved "https://registry.npmjs.org/mime/-/mime-2.5.2.tgz"
  integrity sha512-tqkh47FzKeCPD2PUiPB6pkbMzsCasjxAfC62/Wap5qrUWcb+sFasXUC5I3gYM5iBM8v/Qpn4UK0x+j0iHyFPDg==

mime@1.6.0:
  version "1.6.0"
  resolved "https://registry.npmjs.org/mime/-/mime-1.6.0.tgz"
  integrity sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==

mimic-fn@^2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/mimic-fn/-/mimic-fn-2.1.0.tgz"
  integrity sha512-OqbOk5oEQeAZ8WXWydlu9HJjz9WVdEIvamMCcXmuqUYjTknH/sqsWvhQ3vgwKFRR1HpjvNBKQ37nbJgYzGqGcg==

minimalistic-assert@^1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/minimalistic-assert/-/minimalistic-assert-1.0.1.tgz"
  integrity sha512-UtJcAD4yEaGtjPezWuO9wC4nwUnVH/8/Im3yEHQP4b67cXlD/Qr9hdITCU1xDbSEXg2XKNaP8jsReV7vQd00/A==

minimatch@^3.0.4:
  version "3.0.4"
  resolved "https://registry.npmjs.org/minimatch/-/minimatch-3.0.4.tgz"
  integrity sha512-yJHVQEhyqPLUTgt9B83PXu6W3rx4MvvHvSUvToogpwoGDOUQ+yDrR0HRot+yOCdCO7u4hX3pWft6kWBBcqh0UA==
  dependencies:
    brace-expansion "^1.1.7"

minimist@^1.2.0, minimist@^1.2.5:
  version "1.2.5"
  resolved "https://registry.npmjs.org/minimist/-/minimist-1.2.5.tgz"
  integrity sha512-FM9nNUYrRBAELZQT3xeZQ7fmMOBg6nWNmJKTcgsJeaLstP/UODVpGsr5OhXhhXg6f+qtJ8uiZ+PUxkDWcgIXLw==

mixin-deep@^1.2.0:
  version "1.3.2"
  resolved "https://registry.npmjs.org/mixin-deep/-/mixin-deep-1.3.2.tgz"
  integrity sha512-WRoDn//mXBiJ1H40rqa3vH0toePwSsGb45iInWlTySa+Uu4k3tYUSxa2v1KqAiLtvlrSzaExqS1gtk96A9zvEA==
  dependencies:
    for-in "^1.0.2"
    is-extendable "^1.0.1"

mkdirp@^0.5.1, mkdirp@^0.5.5:
  version "0.5.5"
  resolved "https://registry.npmjs.org/mkdirp/-/mkdirp-0.5.5.tgz"
  integrity sha512-NKmAlESf6jMGym1++R0Ra7wvhV+wFW63FaSOFPwRahvea0gMUcGUhVeAg/0BC0wiv9ih5NYPB1Wn1UEI1/L+xQ==
  dependencies:
    minimist "^1.2.5"

ms@^2.1.1, ms@2.1.2:
  version "2.1.2"
  resolved "https://registry.npmjs.org/ms/-/ms-2.1.2.tgz"
  integrity sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==

ms@2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz"
  integrity sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g= sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==

ms@2.1.1:
  version "2.1.1"
  resolved "https://registry.npmjs.org/ms/-/ms-2.1.1.tgz"
  integrity sha512-tgp+dl5cGk28utYktBsrFqA7HKgrhgPsg6Z/EfhWI4gl1Hwq8B/GmY/0oXZ6nF8hDVesS/FpnYaD/kOWhYQvyg==

multicast-dns-service-types@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/multicast-dns-service-types/-/multicast-dns-service-types-1.1.0.tgz"
  integrity sha1-iZ8R2WhuXgXLkbNdXw5jt3PPyQE= sha512-cnAsSVxIDsYt0v7HmC0hWZFwwXSh+E6PgCrREDuN/EsjgLwA5XRmlMHhSiDPrt6HxY1gTivEa/Zh7GtODoLevQ==

multicast-dns@^6.0.1:
  version "6.2.3"
  resolved "https://registry.npmjs.org/multicast-dns/-/multicast-dns-6.2.3.tgz"
  integrity sha512-ji6J5enbMyGRHIAkAOu3WdV8nggqviKCEKtXcOqfphZZtQrmHKycfynJ2V7eVPUA4NhJ6V7Wf4TmGbTwKE9B6g==
  dependencies:
    dns-packet "^1.3.1"
    thunky "^1.0.2"

nan@^2.12.1:
  version "2.14.2"
  resolved "https://registry.npmjs.org/nan/-/nan-2.14.2.tgz"
  integrity sha512-M2ufzIiINKCuDfBSAUr1vWQ+vuVcA9kqx8JJUsbQi6yf1uGRyb7HfpdfUr5qLXf3B/t8dPvcjhKMmlfnP47EzQ==

nanomatch@^1.2.9:
  version "1.2.13"
  resolved "https://registry.npmjs.org/nanomatch/-/nanomatch-1.2.13.tgz"
  integrity sha512-fpoe2T0RbHwBTBUOftAfBPaDEi06ufaUai0mE6Yn1kacc3SnTErfb/h+X94VXzI64rKFHYImXSvdwGGCmwOqCA==
  dependencies:
    arr-diff "^4.0.0"
    array-unique "^0.3.2"
    define-property "^2.0.2"
    extend-shallow "^3.0.2"
    fragment-cache "^0.2.1"
    is-windows "^1.0.2"
    kind-of "^6.0.2"
    object.pick "^1.3.0"
    regex-not "^1.0.0"
    snapdragon "^0.8.1"
    to-regex "^3.0.1"

negotiator@0.6.2:
  version "0.6.2"
  resolved "https://registry.npmjs.org/negotiator/-/negotiator-0.6.2.tgz"
  integrity sha512-hZXc7K2e+PgeI1eDBe/10Ard4ekbfrrqG8Ep+8Jmf4JID2bNg7NvCPOZN+kfF574pFQI7mum2AUqDidoKqcTOw==

neo-async@^2.6.2:
  version "2.6.2"
  resolved "https://registry.npmjs.org/neo-async/-/neo-async-2.6.2.tgz"
  integrity sha512-Yd3UES5mWCSqR+qNT93S3UoYUkqAZ9lLg8a7g9rimsWmYGK8cVToA4/sF3RrshdyV3sAGMXVUmpMYOw+dLpOuw==

nice-try@^1.0.4:
  version "1.0.5"
  resolved "https://registry.npmjs.org/nice-try/-/nice-try-1.0.5.tgz"
  integrity sha512-1nh45deeb5olNY7eX82BkPO7SSxR5SSYJiPTrTdFUVYwAl8CKMA5N9PjTYkHiRjisVcxcQ1HXdLhx2qxxJzLNQ==

no-case@^3.0.4:
  version "3.0.4"
  resolved "https://registry.npmjs.org/no-case/-/no-case-3.0.4.tgz"
  integrity sha512-fgAN3jGAh+RoxUGZHTSOLJIqUc2wmoBwGR4tbpNAKmmovFoWq0OdRkb0VkldReO2a2iBT/OEulG9XSUc10r3zg==
  dependencies:
    lower-case "^2.0.2"
    tslib "^2.0.3"

node-forge@^0.10.0:
  version "0.10.0"
  resolved "https://registry.npmjs.org/node-forge/-/node-forge-0.10.0.tgz"
  integrity sha512-PPmu8eEeG9saEUvI97fm4OYxXVB6bFvyNTyiUOBichBpFG8A1Ljw3bY62+5oOjDEMHRnd0Y7HQ+x7uzxOzC6JA==

node-releases@^1.1.70:
  version "1.1.71"
  resolved "https://registry.npmjs.org/node-releases/-/node-releases-1.1.71.tgz"
  integrity sha512-zR6HoT6LrLCRBwukmrVbHv0EpEQjksO6GmFcZQQuCAy139BEsoVKPYnf3jongYW83fAa1torLGYwxxky/p28sg==

normalize-path@^2.1.1:
  version "2.1.1"
  resolved "https://registry.npmjs.org/normalize-path/-/normalize-path-2.1.1.tgz"
  integrity sha1-GrKLVW4Zg2Oowab35vogE3/mrtk= sha512-3pKJwH184Xo/lnH6oyP1q2pMd7HcypqqmRs91/6/i2CGtWwIKGCkOOMTm/zXbgTEWHw1uNpNi/igc3ePOYHb6w==
  dependencies:
    remove-trailing-separator "^1.0.1"

normalize-path@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz"
  integrity sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==

npm-run-path@^2.0.0:
  version "2.0.2"
  resolved "https://registry.npmjs.org/npm-run-path/-/npm-run-path-2.0.2.tgz"
  integrity sha1-NakjLfo11wZ7TLLd8jV7GHFTbF8= sha512-lJxZYlT4DW/bRUtFh1MQIWqmLwQfAxnqWG4HhEdjMlkrJYnJn0Jrr2u3mgxqaWsdiBc76TYkTG/mhrnYTuzfHw==
  dependencies:
    path-key "^2.0.0"

npm-run-path@^4.0.1:
  version "4.0.1"
  resolved "https://registry.npmjs.org/npm-run-path/-/npm-run-path-4.0.1.tgz"
  integrity sha512-S48WzZW777zhNIrn7gxOlISNAqi9ZC/uQFnRdbeIHhZhCA6UqpkOT8T1G7BvfdgP4Er8gF4sUbaS0i7QvIfCWw==
  dependencies:
    path-key "^3.0.0"

nth-check@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/nth-check/-/nth-check-1.0.2.tgz"
  integrity sha512-WeBOdju8SnzPN5vTUJYxYUxLeXpCaVP5i5e0LF8fg7WORF2Wd7wFX/pk0tYZk7s8T+J7VLy0Da6J1+wCT0AtHg==
  dependencies:
    boolbase "~1.0.0"

object-assign@^4.0.1:
  version "4.1.1"
  resolved "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz"
  integrity sha1-IQmtx5ZYh8/AXLvUQsrIv7s2CGM= sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==

object-copy@^0.1.0:
  version "0.1.0"
  resolved "https://registry.npmjs.org/object-copy/-/object-copy-0.1.0.tgz"
  integrity sha1-fn2Fi3gb18mRpBupde04EnVOmYw= sha512-79LYn6VAb63zgtmAteVOWo9Vdj71ZVBy3Pbse+VqxDpEP83XuujMrGqHIwAXJ5I/aM0zU7dIyIAhifVTPrNItQ==
  dependencies:
    copy-descriptor "^0.1.0"
    define-property "^0.2.5"
    kind-of "^3.0.3"

object-inspect@^1.9.0:
  version "1.9.0"
  resolved "https://registry.npmjs.org/object-inspect/-/object-inspect-1.9.0.tgz"
  integrity sha512-i3Bp9iTqwhaLZBxGkRfo5ZbE07BQRT7MGu8+nNgwW9ItGp1TzCTw2DLEoWwjClxBjOFI/hWljTAmYGCEwmtnOw==

object-is@^1.0.1:
  version "1.1.5"
  resolved "https://registry.npmjs.org/object-is/-/object-is-1.1.5.tgz"
  integrity sha512-3cyDsyHgtmi7I7DfSSI2LDp6SK2lwvtbg0p0R1e0RvTqF5ceGx+K2dfSjm1bKDMVCFEDAQvy+o8c6a7VujOddw==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.1.3"

object-keys@^1.0.12, object-keys@^1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz"
  integrity sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==

object-visit@^1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/object-visit/-/object-visit-1.0.1.tgz"
  integrity sha1-95xEk68MU3e1n+OdOV5BBC3QRbs= sha512-GBaMwwAVK9qbQN3Scdo0OyvgPW7l3lnaVMj84uTOZlswkX0KpF6fyDBJhtTthf7pymztoN36/KEr1DyhF96zEA==
  dependencies:
    isobject "^3.0.0"

object.assign@^4.1.0, object.assign@^4.1.2:
  version "4.1.2"
  resolved "https://registry.npmjs.org/object.assign/-/object.assign-4.1.2.tgz"
  integrity sha512-ixT2L5THXsApyiUPYKmW+2EHpXXe5Ii3M+f4e+aJFAHao5amFRW6J0OO6c/LU8Be47utCx2GL89hxGB6XSmKuQ==
  dependencies:
    call-bind "^1.0.0"
    define-properties "^1.1.3"
    has-symbols "^1.0.1"
    object-keys "^1.1.1"

object.getownpropertydescriptors@^2.0.3:
  version "2.1.2"
  resolved "https://registry.npmjs.org/object.getownpropertydescriptors/-/object.getownpropertydescriptors-2.1.2.tgz"
  integrity sha512-WtxeKSzfBjlzL+F9b7M7hewDzMwy+C8NRssHd1YrNlzHzIDrXcXiNOMrezdAEM4UXixgV+vvnyBeN7Rygl2ttQ==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.1.3"
    es-abstract "^1.18.0-next.2"

object.pick@^1.3.0:
  version "1.3.0"
  resolved "https://registry.npmjs.org/object.pick/-/object.pick-1.3.0.tgz"
  integrity sha1-h6EKxMFpS9Lhy/U1kaZhQftd10c= sha512-tqa/UMy/CCoYmj+H5qc07qvSL9dqcs/WZENZ1JbtWBlATP+iVOe778gE6MSijnyCnORzDuX6hU+LA4SZ09YjFQ==
  dependencies:
    isobject "^3.0.1"

obuf@^1.0.0, obuf@^1.1.2:
  version "1.1.2"
  resolved "https://registry.npmjs.org/obuf/-/obuf-1.1.2.tgz"
  integrity sha512-PX1wu0AmAdPqOL1mWhqmlOd8kOIZQwGZw6rh7uby9fTc5lhaOWFLX3I6R1hrF9k3zUY40e6igsLGkDXK92LJNg==

on-finished@~2.3.0:
  version "2.3.0"
  resolved "https://registry.npmjs.org/on-finished/-/on-finished-2.3.0.tgz"
  integrity sha1-IPEzZIGwg811M3mSoWlxqi2QaUc= sha512-ikqdkGAAyf/X/gPhXGvfgAytDZtDbr+bkNUJ0N9h5MI/dmdgCs3l6hoHrcUv41sRKew3jIwrp4qQDXiK99Utww==
  dependencies:
    ee-first "1.1.1"

on-headers@~1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/on-headers/-/on-headers-1.0.2.tgz"
  integrity sha512-pZAE+FJLoyITytdqK0U5s+FIpjN0JP3OzFi/u8Rx+EV5/W+JTWGXG8xFzevE7AjBfDqHv/8vL8qQsIhHnqRkrA==

once@^1.3.0, once@^1.3.1, once@^1.4.0:
  version "1.4.0"
  resolved "https://registry.npmjs.org/once/-/once-1.4.0.tgz"
  integrity sha1-WDsap3WWHUsROsF9nFC6753Xa9E= sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==
  dependencies:
    wrappy "1"

onetime@^5.1.2:
  version "5.1.2"
  resolved "https://registry.npmjs.org/onetime/-/onetime-5.1.2.tgz"
  integrity sha512-kbpaSSGJTWdAY5KPVeMOKXSrPtr8C8C7wodJbcsd51jRnmD+GZu8Y0VoU6Dm5Z4vWr0Ig/1NKuWRKf7j5aaYSg==
  dependencies:
    mimic-fn "^2.1.0"

opn@^5.5.0:
  version "5.5.0"
  resolved "https://registry.npmjs.org/opn/-/opn-5.5.0.tgz"
  integrity sha512-PqHpggC9bLV0VeWcdKhkpxY+3JTzetLSqTCWL/z/tFIbI6G8JCjondXklT1JinczLz2Xib62sSp0T/gKT4KksA==
  dependencies:
    is-wsl "^1.1.0"

original@^1.0.0:
  version "1.0.2"
  resolved "https://registry.npmjs.org/original/-/original-1.0.2.tgz"
  integrity sha512-hyBVl6iqqUOJ8FqRe+l/gS8H+kKYjrEndd5Pm1MfBtsEKA038HkkdbAl/72EAXGyonD/PFsvmVG+EvcIpliMBg==
  dependencies:
    url-parse "^1.4.3"

p-finally@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/p-finally/-/p-finally-1.0.0.tgz"
  integrity sha1-P7z7FbiZpEEjs0ttzBi3JDNqLK4= sha512-LICb2p9CB7FS+0eR1oqWnHhp0FljGLZCWBE9aix0Uye9W8LTQPwMTYVGWQWIw9RdQiDg4+epXQODwIYJtSJaow==

p-limit@^2.0.0, p-limit@^2.2.0:
  version "2.3.0"
  resolved "https://registry.npmjs.org/p-limit/-/p-limit-2.3.0.tgz"
  integrity sha512-//88mFWSJx8lxCzwdAABTJL2MyWB12+eIY7MDL2SqLmAkeKU9qxRvWuSyTjm3FUmpBEMuFfckAIqEaVGUDxb6w==
  dependencies:
    p-try "^2.0.0"

p-limit@^3.1.0:
  version "3.1.0"
  resolved "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz"
  integrity sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==
  dependencies:
    yocto-queue "^0.1.0"

p-locate@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/p-locate/-/p-locate-3.0.0.tgz"
  integrity sha512-x+12w/To+4GFfgJhBEpiDcLozRJGegY+Ei7/z0tSLkMmxGZNybVMSfWj9aJn8Z5Fc7dBUNJOOVgPv2H7IwulSQ==
  dependencies:
    p-limit "^2.0.0"

p-locate@^4.1.0:
  version "4.1.0"
  resolved "https://registry.npmjs.org/p-locate/-/p-locate-4.1.0.tgz"
  integrity sha512-R79ZZ/0wAxKGu3oYMlz8jy/kbhsNrS7SKZ7PxEHBgJ5+F2mtFW2fK2cOtBh1cHYkQsbzFV7I+EoRKe6Yt0oK7A==
  dependencies:
    p-limit "^2.2.0"

p-map@^2.0.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/p-map/-/p-map-2.1.0.tgz"
  integrity sha512-y3b8Kpd8OAN444hxfBbFfj1FY/RjtTd8tzYwhUqNYXx0fXx2iX4maP4Qr6qhIKbQXI02wTLAda4fYUbDagTUFw==

p-retry@^3.0.1:
  version "3.0.1"
  resolved "https://registry.npmjs.org/p-retry/-/p-retry-3.0.1.tgz"
  integrity sha512-XE6G4+YTTkT2a0UWb2kjZe8xNwf8bIbnqpc/IS/idOBVhyves0mK5OJgeocjx7q5pvX/6m23xuzVPYT1uGM73w==
  dependencies:
    retry "^0.12.0"

p-try@^2.0.0:
  version "2.2.0"
  resolved "https://registry.npmjs.org/p-try/-/p-try-2.2.0.tgz"
  integrity sha512-R4nPAVTAU0B9D35/Gk3uJf/7XYbQcyohSKdvAxIRSNghFl4e71hVoGnBNQz9cWaXxO2I10KTC+3jMdvvoKw6dQ==

param-case@^3.0.3:
  version "3.0.4"
  resolved "https://registry.npmjs.org/param-case/-/param-case-3.0.4.tgz"
  integrity sha512-RXlj7zCYokReqWpOPH9oYivUzLYZ5vAPIfEmCTNViosC78F8F0H9y7T7gG2M39ymgutxF5gcFEsyZQSph9Bp3A==
  dependencies:
    dot-case "^3.0.4"
    tslib "^2.0.3"

parseurl@~1.3.2, parseurl@~1.3.3:
  version "1.3.3"
  resolved "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz"
  integrity sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==

pascal-case@^3.1.2:
  version "3.1.2"
  resolved "https://registry.npmjs.org/pascal-case/-/pascal-case-3.1.2.tgz"
  integrity sha512-uWlGT3YSnK9x3BQJaOdcZwrnV6hPpd8jFH1/ucpiLRPh/2zCVJKS19E4GvYHvaCcACn3foXZ0cLB9Wrx1KGe5g==
  dependencies:
    no-case "^3.0.4"
    tslib "^2.0.3"

pascalcase@^0.1.1:
  version "0.1.1"
  resolved "https://registry.npmjs.org/pascalcase/-/pascalcase-0.1.1.tgz"
  integrity sha1-s2PlXoAGym/iF4TS2yK9FdeRfxQ= sha512-XHXfu/yOQRy9vYOtUDVMN60OEJjW013GoObG1o+xwQTpB9eYJX/BjXMsdW13ZDPruFhYYn0AG22w0xgQMwl3Nw==

path-dirname@^1.0.0:
  version "1.0.2"
  resolved "https://registry.npmjs.org/path-dirname/-/path-dirname-1.0.2.tgz"
  integrity sha1-zDPSTVJeCZpTiMAzbG4yuRYGCeA= sha512-ALzNPpyNq9AqXMBjeymIjFDAkAFH06mHJH/cSBHAgU0s4vfpBn6b2nf8tiRLvagKD8RbTpq2FKTBg7cl9l3c7Q==

path-exists@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/path-exists/-/path-exists-3.0.0.tgz"
  integrity sha1-zg6+ql94yxiSXqfYENe1mwEP1RU= sha512-bpC7GYwiDYQ4wYLe+FA8lhRjhQCMcQGuSgGGqDkg/QerRWw9CmGRT0iSOVRSZJ29NMLZgIzqaljJ63oaL4NIJQ==

path-exists@^4.0.0:
  version "4.0.0"
  resolved "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz"
  integrity sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==

path-is-absolute@^1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz"
  integrity sha1-F0uSaHNVNP+8es5r9TpanhtcX18= sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==

path-is-inside@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/path-is-inside/-/path-is-inside-1.0.2.tgz"
  integrity sha1-NlQX3t5EQw0cEa9hAn+s8HS9/FM= sha512-DUWJr3+ULp4zXmol/SZkFf3JGsS9/SIv+Y3Rt93/UjPpDpklB5f1er4O3POIbUuUJ3FXgqte2Q7SrU6zAqwk8w==

path-key@^2.0.0, path-key@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/path-key/-/path-key-2.0.1.tgz"
  integrity sha1-QRyttXTFoUDTpLGRDUDYDMn0C0A= sha512-fEHGKCSmUSDPv4uoj8AlD+joPlq3peND+HRYyxFz4KPw4z926S/b8rIuFs2FYJg3BwsxJf6A9/3eIdLaYC+9Dw==

path-key@^3.0.0, path-key@^3.1.0:
  version "3.1.1"
  resolved "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz"
  integrity sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==

path-parse@^1.0.6:
  version "1.0.6"
  resolved "https://registry.npmjs.org/path-parse/-/path-parse-1.0.6.tgz"
  integrity sha512-GSmOT2EbHrINBf9SR7CDELwlJ8AENk3Qn7OikK4nFYAu3Ote2+JYNVvkpAEQm3/TLNEJFD/xZJjzyxg3KBWOzw==

path-to-regexp@0.1.7:
  version "0.1.7"
  resolved "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-0.1.7.tgz"
  integrity sha1-32BBeABfUi8V60SQ5yR6G/qmf4w= sha512-5DFkuoqlv1uYQKxy8omFBeJPQcdoE07Kv2sferDCrAq1ohOU+MSDswDIbnx3YAM60qIOnYa53wBhXW0EbMonrQ==

pify@^2.0.0:
  version "2.3.0"
  resolved "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz"
  integrity sha1-7RQaasBDqEnqWISY59yosVMw6Qw= sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==

pify@^4.0.1:
  version "4.0.1"
  resolved "https://registry.npmjs.org/pify/-/pify-4.0.1.tgz"
  integrity sha512-uB80kBFb/tfd68bVleG9T5GGsGPjJrLAUpR5PZIrhBnIaRTQRjqdJSsIKkOP6OAIFbj7GOrcudc5pNjZ+geV2g==

pinkie-promise@^2.0.0:
  version "2.0.1"
  resolved "https://registry.npmjs.org/pinkie-promise/-/pinkie-promise-2.0.1.tgz"
  integrity sha1-ITXW36ejWMBprJsXh3YogihFD/o= sha512-0Gni6D4UcLTbv9c57DfxDGdr41XfgUjqWZu492f0cIGr16zDU06BWP/RAEvOuo7CQ0CNjHaLlM59YJJFm3NWlw==
  dependencies:
    pinkie "^2.0.0"

pinkie@^2.0.0:
  version "2.0.4"
  resolved "https://registry.npmjs.org/pinkie/-/pinkie-2.0.4.tgz"
  integrity sha1-clVrgM+g1IqXToDnckjoDtT3+HA= sha512-MnUuEycAemtSaeFSjXKW/aroV7akBbY+Sv+RkyqFjgAe73F+MR0TBWKBRDkmfWq/HiFmdavfZ1G7h4SPZXaCSg==

pkg-dir@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/pkg-dir/-/pkg-dir-3.0.0.tgz"
  integrity sha512-/E57AYkoeQ25qkxMj5PBOVgF8Kiu/h7cYS30Z5+R7WaiCCBfLq58ZI/dSeaEKb9WVJV5n/03QwrN3IeWIFllvw==
  dependencies:
    find-up "^3.0.0"

pkg-dir@^4.1.0, pkg-dir@^4.2.0:
  version "4.2.0"
  resolved "https://registry.npmjs.org/pkg-dir/-/pkg-dir-4.2.0.tgz"
  integrity sha512-HRDzbaKjC+AOWVXxAU/x54COGeIv9eb+6CkDSQoNTt4XyWoIJvuPsXizxu/Fr23EiekbtZwmh1IcIG/l/a10GQ==
  dependencies:
    find-up "^4.0.0"

portfinder@^1.0.26:
  version "1.0.28"
  resolved "https://registry.npmjs.org/portfinder/-/portfinder-1.0.28.tgz"
  integrity sha512-Se+2isanIcEqf2XMHjyUKskczxbPH7dQnlMjXX6+dybayyHvAf/TCgyMRlzf/B6QDhAEFOGes0pzRo3by4AbMA==
  dependencies:
    async "^2.6.2"
    debug "^3.1.1"
    mkdirp "^0.5.5"

posix-character-classes@^0.1.0:
  version "0.1.1"
  resolved "https://registry.npmjs.org/posix-character-classes/-/posix-character-classes-0.1.1.tgz"
  integrity sha1-AerA/jta9xoqbAL+q7jB/vfgDqs= sha512-xTgYBc3fuo7Yt7JbiuFxSYGToMoz8fLoE6TC9Wx1P/u+LfeThMOAqmuyECnlBaaJb+u1m9hHiXUEtwW4OzfUJg==

pretty-error@^2.1.1:
  version "2.1.2"
  resolved "https://registry.npmjs.org/pretty-error/-/pretty-error-2.1.2.tgz"
  integrity sha512-EY5oDzmsX5wvuynAByrmY0P0hcp+QpnAKbJng2A2MPjVKXCxrDSUkzghVJ4ZGPIv+JC4gX8fPUWscC0RtjsWGw==
  dependencies:
    lodash "^4.17.20"
    renderkid "^2.0.4"

process-nextick-args@~2.0.0:
  version "2.0.1"
  resolved "https://registry.npmjs.org/process-nextick-args/-/process-nextick-args-2.0.1.tgz"
  integrity sha512-3ouUOpQhtgrbOa17J7+uxOTpITYWaGP7/AhoR3+A+/1e9skrzelGi/dXzEYyvbxubEF6Wn2ypscTKiKJFFn1ag==

proxy-addr@~2.0.5:
  version "2.0.6"
  resolved "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.6.tgz"
  integrity sha512-dh/frvCBVmSsDYzw6n926jv974gddhkFPfiN8hPOi30Wax25QZyZEGveluCgliBnqmuM+UJmBErbAUFIoDbjOw==
  dependencies:
    forwarded "~0.1.2"
    ipaddr.js "1.9.1"

prr@~1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/prr/-/prr-1.0.1.tgz"
  integrity sha1-0/wRS6BplaRexok/SEzrHXj19HY= sha512-yPw4Sng1gWghHQWj0B3ZggWUm4qVbPwPFcRG8KyxiU7J2OHFSoEHKS+EZ3fv5l1t9CyCiop6l/ZYeWbrgoQejw==

pump@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/pump/-/pump-3.0.0.tgz"
  integrity sha512-LwZy+p3SFs1Pytd/jYct4wpv49HiYCqd9Rlc5ZVdk0V+8Yzv6jR5Blk3TRmPL1ft69TxP0IMZGJ+WPFU2BFhww==
  dependencies:
    end-of-stream "^1.1.0"
    once "^1.3.1"

punycode@^2.1.0:
  version "2.1.1"
  resolved "https://registry.npmjs.org/punycode/-/punycode-2.1.1.tgz"
  integrity sha512-XRsRjdf+j5ml+y/6GKHPZbrF/8p2Yga0JPtdqTIY2Xe5ohJPD9saDJJLPvp9+NSBprVvevdXZybnj2cv8OEd0A==

punycode@1.3.2:
  version "1.3.2"
  resolved "https://registry.npmjs.org/punycode/-/punycode-1.3.2.tgz"
  integrity sha1-llOgNvt8HuQjQvIyXM7v6jkmxI0= sha512-RofWgt/7fL5wP1Y7fxE7/EmTLzQVnB0ycyibJ0OOHIlJqTNzglYFxVwETOcIoJqJmpDXJ9xImDv+Fq34F/d4Dw==

qs@6.7.0:
  version "6.7.0"
  resolved "https://registry.npmjs.org/qs/-/qs-6.7.0.tgz"
  integrity sha512-VCdBRNFTX1fyE7Nb6FYoURo/SPe62QCaAyzJvUjwRaIsc+NePBEniHlvxFmmX56+HZphIGtV0XeCirBtpDrTyQ==

querystring@0.2.0:
  version "0.2.0"
  resolved "https://registry.npmjs.org/querystring/-/querystring-0.2.0.tgz"
  integrity sha1-sgmEkgO7Jd+CDadW50cAWHhSFiA= sha512-X/xY82scca2tau62i9mDyU9K+I+djTMUsvwf7xnUX5GLvVzgJybOJf4Y6o9Zx3oJK/LSXg5tTZBjwzqVPaPO2g==

querystringify@^2.1.1:
  version "2.2.0"
  resolved "https://registry.npmjs.org/querystringify/-/querystringify-2.2.0.tgz"
  integrity sha512-FIqgj2EUvTa7R50u0rGsyTftzjYmv/a3hO345bZNrqabNqjtgiDMgmo4mkUjd+nzU5oF3dClKqFIPUKybUyqoQ==

randombytes@^2.1.0:
  version "2.1.0"
  resolved "https://registry.npmjs.org/randombytes/-/randombytes-2.1.0.tgz"
  integrity sha512-vYl3iOX+4CKUWuxGi9Ukhie6fsqXqS9FE2Zaic4tNFD2N2QQaXOMFbuKK4QmDHC0JO6B1Zp41J0LpT0oR68amQ==
  dependencies:
    safe-buffer "^5.1.0"

range-parser@^1.2.1, range-parser@~1.2.1:
  version "1.2.1"
  resolved "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz"
  integrity sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==

raw-body@2.4.0:
  version "2.4.0"
  resolved "https://registry.npmjs.org/raw-body/-/raw-body-2.4.0.tgz"
  integrity sha512-4Oz8DUIwdvoa5qMJelxipzi/iJIi40O5cGV1wNYp5hvZP8ZN0T+jiNkL0QepXs+EsQ9XJ8ipEDoiH70ySUJP3Q==
  dependencies:
    bytes "3.1.0"
    http-errors "1.7.2"
    iconv-lite "0.4.24"
    unpipe "1.0.0"

raw-loader@^4.0.2:
  version "4.0.2"
  resolved "https://registry.npmjs.org/raw-loader/-/raw-loader-4.0.2.tgz"
  integrity sha512-ZnScIV3ag9A4wPX/ZayxL/jZH+euYb6FcUinPcgiQW0+UBtEv0O6Q3lGd3cqJ+GHH+rksEv3Pj99oxJ3u3VIKA==
  dependencies:
    loader-utils "^2.0.0"
    schema-utils "^3.0.0"

readable-stream@^2.0.1:
  version "2.3.7"
  resolved "https://registry.npmjs.org/readable-stream/-/readable-stream-2.3.7.tgz"
  integrity sha512-Ebho8K4jIbHAxnuxi7o42OrZgF/ZTNcsZj6nRKyUmkhLFq8CHItp/fy6hQZuZmP/n3yZ9VBUbp4zz/mX8hmYPw==
  dependencies:
    core-util-is "~1.0.0"
    inherits "~2.0.3"
    isarray "~1.0.0"
    process-nextick-args "~2.0.0"
    safe-buffer "~5.1.1"
    string_decoder "~1.1.1"
    util-deprecate "~1.0.1"

readable-stream@^2.0.2:
  version "2.3.7"
  resolved "https://registry.npmjs.org/readable-stream/-/readable-stream-2.3.7.tgz"
  integrity sha512-Ebho8K4jIbHAxnuxi7o42OrZgF/ZTNcsZj6nRKyUmkhLFq8CHItp/fy6hQZuZmP/n3yZ9VBUbp4zz/mX8hmYPw==
  dependencies:
    core-util-is "~1.0.0"
    inherits "~2.0.3"
    isarray "~1.0.0"
    process-nextick-args "~2.0.0"
    safe-buffer "~5.1.1"
    string_decoder "~1.1.1"
    util-deprecate "~1.0.1"

readable-stream@^3.0.6, readable-stream@^3.1.1:
  version "3.6.0"
  resolved "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.0.tgz"
  integrity sha512-BViHy7LKeTz4oNnkcLJ+lVSL6vpiFeX6/d3oSH8zCW7UxP2onchk+vTGB143xuFjHS3deTgkKoXXymXqymiIdA==
  dependencies:
    inherits "^2.0.3"
    string_decoder "^1.1.1"
    util-deprecate "^1.0.1"

readdirp@^2.2.1:
  version "2.2.1"
  resolved "https://registry.npmjs.org/readdirp/-/readdirp-2.2.1.tgz"
  integrity sha512-1JU/8q+VgFZyxwrJ+SVIOsh+KywWGpds3NTqikiKpDMZWScmAYyKIgqkO+ARvNWJfXeXR1zxz7aHF4u4CyH6vQ==
  dependencies:
    graceful-fs "^4.1.11"
    micromatch "^3.1.10"
    readable-stream "^2.0.2"

rechoir@^0.7.0:
  version "0.7.0"
  resolved "https://registry.npmjs.org/rechoir/-/rechoir-0.7.0.tgz"
  integrity sha512-ADsDEH2bvbjltXEP+hTIAmeFekTFK0V2BTxMkok6qILyAJEXV0AFfoWcAq4yfll5VdIMd/RVXq0lR+wQi5ZU3Q==
  dependencies:
    resolve "^1.9.0"

regenerate-unicode-properties@^8.2.0:
  version "8.2.0"
  resolved "https://registry.npmjs.org/regenerate-unicode-properties/-/regenerate-unicode-properties-8.2.0.tgz"
  integrity sha512-F9DjY1vKLo/tPePDycuH3dn9H1OTPIkVD9Kz4LODu+F2C75mgjAJ7x/gwy6ZcSNRAAkhNlJSOHRe8k3p+K9WhA==
  dependencies:
    regenerate "^1.4.0"

regenerate@^1.4.0:
  version "1.4.2"
  resolved "https://registry.npmjs.org/regenerate/-/regenerate-1.4.2.tgz"
  integrity sha512-zrceR/XhGYU/d/opr2EKO7aRHUeiBI8qjtfHqADTwZd6Szfy16la6kqD0MIUs5z5hx6AaKa+PixpPrR289+I0A==

regenerator-runtime@^0.13.4:
  version "0.13.7"
  resolved "https://registry.npmjs.org/regenerator-runtime/-/regenerator-runtime-0.13.7.tgz"
  integrity sha512-a54FxoJDIr27pgf7IgeQGxmqUNYrcV338lf/6gH456HZ/PhX+5BcwHXG9ajESmwe6WRO0tAzRUrRmNONWgkrew==

regenerator-transform@^0.14.2:
  version "0.14.5"
  resolved "https://registry.npmjs.org/regenerator-transform/-/regenerator-transform-0.14.5.tgz"
  integrity sha512-eOf6vka5IO151Jfsw2NO9WpGX58W6wWmefK3I1zEGr0lOD0u8rwPaNqQL1aRxUaxLeKO3ArNh3VYg1KbaD+FFw==
  dependencies:
    "@babel/runtime" "^7.8.4"

regex-not@^1.0.0, regex-not@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/regex-not/-/regex-not-1.0.2.tgz"
  integrity sha512-J6SDjUgDxQj5NusnOtdFxDwN/+HWykR8GELwctJ7mdqhcyy1xEc4SRFHUXvxTp661YaVKAjfRLZ9cCqS6tn32A==
  dependencies:
    extend-shallow "^3.0.2"
    safe-regex "^1.1.0"

regexp.prototype.flags@^1.2.0:
  version "1.3.1"
  resolved "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.3.1.tgz"
  integrity sha512-JiBdRBq91WlY7uRJ0ds7R+dU02i6LKi8r3BuQhNXn+kmeLN+EfHhfjqMRis1zJxnlu88hq/4dx0P2OP3APRTOA==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.1.3"

regexpu-core@^4.7.1:
  version "4.7.1"
  resolved "https://registry.npmjs.org/regexpu-core/-/regexpu-core-4.7.1.tgz"
  integrity sha512-ywH2VUraA44DZQuRKzARmw6S66mr48pQVva4LBeRhcOltJ6hExvWly5ZjFLYo67xbIxb6W1q4bAGtgfEl20zfQ==
  dependencies:
    regenerate "^1.4.0"
    regenerate-unicode-properties "^8.2.0"
    regjsgen "^0.5.1"
    regjsparser "^0.6.4"
    unicode-match-property-ecmascript "^1.0.4"
    unicode-match-property-value-ecmascript "^1.2.0"

regjsgen@^0.5.1:
  version "0.5.2"
  resolved "https://registry.npmjs.org/regjsgen/-/regjsgen-0.5.2.tgz"
  integrity sha512-OFFT3MfrH90xIW8OOSyUrk6QHD5E9JOTeGodiJeBS3J6IwlgzJMNE/1bZklWz5oTg+9dCMyEetclvCVXOPoN3A==

regjsparser@^0.6.4:
  version "0.6.9"
  resolved "https://registry.npmjs.org/regjsparser/-/regjsparser-0.6.9.tgz"
  integrity sha512-ZqbNRz1SNjLAiYuwY0zoXW8Ne675IX5q+YHioAGbCw4X96Mjl2+dcX9B2ciaeyYjViDAfvIjFpQjJgLttTEERQ==
  dependencies:
    jsesc "~0.5.0"

relateurl@^0.2.7:
  version "0.2.7"
  resolved "https://registry.npmjs.org/relateurl/-/relateurl-0.2.7.tgz"
  integrity sha1-VNvzd+UUQKypCkzSdGANP/LYiKk= sha512-G08Dxvm4iDN3MLM0EsP62EDV9IuhXPR6blNz6Utcp7zyV3tr4HVNINt6MpaRWbxoOHT3Q7YN2P+jaHX8vUbgog==

remove-trailing-separator@^1.0.1:
  version "1.1.0"
  resolved "https://registry.npmjs.org/remove-trailing-separator/-/remove-trailing-separator-1.1.0.tgz"
  integrity sha1-wkvOKig62tW8P1jg1IJJuSN52O8= sha512-/hS+Y0u3aOfIETiaiirUFwDBDzmXPvO+jAfKTitUngIPzdKc6Z0LoFjM/CK5PL4C+eKwHohlHAb6H0VFfmmUsw==

renderkid@^2.0.4:
  version "2.0.5"
  resolved "https://registry.npmjs.org/renderkid/-/renderkid-2.0.5.tgz"
  integrity sha512-ccqoLg+HLOHq1vdfYNm4TBeaCDIi1FLt3wGojTDSvdewUv65oTmI3cnT2E4hRjl1gzKZIPK+KZrXzlUYKnR+vQ==
  dependencies:
    css-select "^2.0.2"
    dom-converter "^0.2"
    htmlparser2 "^3.10.1"
    lodash "^4.17.20"
    strip-ansi "^3.0.0"

repeat-element@^1.1.2:
  version "1.1.3"
  resolved "https://registry.npmjs.org/repeat-element/-/repeat-element-1.1.3.tgz"
  integrity sha512-ahGq0ZnV5m5XtZLMb+vP76kcAM5nkLqk0lpqAuojSKGgQtn4eRi4ZZGm2olo2zKFH+sMsWaqOCW1dqAnOru72g==

repeat-string@^1.6.1:
  version "1.6.1"
  resolved "https://registry.npmjs.org/repeat-string/-/repeat-string-1.6.1.tgz"
  integrity sha1-jcrkcOHIirwtYA//Sndihtp15jc= sha512-PV0dzCYDNfRi1jCDbJzpW7jNNDRuCOG/jI5ctQcGKt/clZD+YcPS3yIlWuTJMmESC8aevCFmWJy5wjAFgNqN6w==

require-directory@^2.1.1:
  version "2.1.1"
  resolved "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz"
  integrity sha1-jGStX9MNqxyXbiNE/+f3kqam30I= sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==

require-main-filename@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/require-main-filename/-/require-main-filename-2.0.0.tgz"
  integrity sha512-NKN5kMDylKuldxYLSUfrbo5Tuzh4hd+2E8NPPX02mZtn1VuREQToYe/ZdlJy+J3uCpfaiGF05e7B8W0iXbQHmg==

requires-port@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/requires-port/-/requires-port-1.0.0.tgz"
  integrity sha1-kl0mAdOaxIXgkc8NpcbmlNw9yv8= sha512-KigOCHcocU3XODJxsu8i/j8T9tzT4adHiecwORRQ0ZZFcp7ahwXuRU1m+yuO90C5ZUyGeGfocHDI14M3L3yDAQ==

resolve-cwd@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/resolve-cwd/-/resolve-cwd-2.0.0.tgz"
  integrity sha1-AKn3OHVW4nA46uIyyqNypqWbZlo= sha512-ccu8zQTrzVr954472aUVPLEcB3YpKSYR3cg/3lo1okzobPBM+1INXBbBZlDbnI/hbEocnf8j0QVo43hQKrbchg==
  dependencies:
    resolve-from "^3.0.0"

resolve-cwd@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/resolve-cwd/-/resolve-cwd-3.0.0.tgz"
  integrity sha512-OrZaX2Mb+rJCpH/6CpSqt9xFVpN++x01XnN2ie9g6P5/3xelLAkXWVADpdz1IHD/KFfEXyE6V0U01OQ3UO2rEg==
  dependencies:
    resolve-from "^5.0.0"

resolve-from@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/resolve-from/-/resolve-from-3.0.0.tgz"
  integrity sha1-six699nWiBvItuZTM17rywoYh0g= sha512-GnlH6vxLymXJNMBo7XP1fJIzBFbdYt49CuTwmB/6N53t+kMPRMFKz783LlQ4tv28XoQfMWinAJX6WCGf2IlaIw==

resolve-from@^5.0.0:
  version "5.0.0"
  resolved "https://registry.npmjs.org/resolve-from/-/resolve-from-5.0.0.tgz"
  integrity sha512-qYg9KP24dD5qka9J47d0aVky0N+b4fTU89LN9iDnjB5waksiC49rvMB0PrUJQGoTmH50XPiqOvAjDfaijGxYZw==

resolve-url@^0.2.1:
  version "0.2.1"
  resolved "https://registry.npmjs.org/resolve-url/-/resolve-url-0.2.1.tgz"
  integrity sha1-LGN/53yJOv0qZj/iGqkIAGjiBSo= sha512-ZuF55hVUQaaczgOIwqWzkEcEidmlD/xl44x1UZnhOXcYuFN2S6+rcxpG+C1N3So0wvNI3DmJICUFfu2SxhBmvg==

resolve@^1.14.2, resolve@^1.9.0:
  version "1.20.0"
  resolved "https://registry.npmjs.org/resolve/-/resolve-1.20.0.tgz"
  integrity sha512-wENBPt4ySzg4ybFQW2TT1zMQucPK95HSh/nq2CFTZVOGut2+pQvSsgtda4d26YrYcr067wjbmzOG8byDPBX63A==
  dependencies:
    is-core-module "^2.2.0"
    path-parse "^1.0.6"

ret@~0.1.10:
  version "0.1.15"
  resolved "https://registry.npmjs.org/ret/-/ret-0.1.15.tgz"
  integrity sha512-TTlYpa+OL+vMMNG24xSlQGEJ3B/RzEfUlLct7b5G/ytav+wPrplCpVMFuwzXbkecJrb6IYo1iFb0S9v37754mg==

retry@^0.12.0:
  version "0.12.0"
  resolved "https://registry.npmjs.org/retry/-/retry-0.12.0.tgz"
  integrity sha1-G0KmJmoh8HQh0bC1S33BZ7AcATs= sha512-9LkiTwjUh6rT555DtE9rTX+BKByPfrMzEAtnlEtdEwr3Nkffwiihqe2bWADg+OQRjt9gl6ICdmB/ZFDCGAtSow==

rimraf@^2.6.3:
  version "2.7.1"
  resolved "https://registry.npmjs.org/rimraf/-/rimraf-2.7.1.tgz"
  integrity sha512-uWjbaKIK3T1OSVptzX7Nl6PvQ3qAGtKEtVRjRuazjfL3Bx5eI409VZSqgND+4UNnmzLVdPj9FqFJNPqBZFve4w==
  dependencies:
    glob "^7.1.3"

safe-buffer@^5.0.1, safe-buffer@^5.1.0, safe-buffer@>=5.1.0, safe-buffer@~5.1.0, safe-buffer@~5.1.1, safe-buffer@5.1.2:
  version "5.1.2"
  resolved "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.1.2.tgz"
  integrity sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g==

safe-buffer@~5.2.0:
  version "5.2.1"
  resolved "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz"
  integrity sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==

safe-regex@^1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/safe-regex/-/safe-regex-1.1.0.tgz"
  integrity sha1-QKNmnzsHfR6UPURinhV91IAjvy4= sha512-aJXcif4xnaNUzvUuC5gcb46oTS7zvg4jpMTnuqtrEPlR3vFr4pxtdTwaF1Qs3Enjn9HK+ZlwQui+a7z0SywIzg==
  dependencies:
    ret "~0.1.10"

"safer-buffer@>= 2.1.2 < 3":
  version "2.1.2"
  resolved "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz"
  integrity sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==

schema-utils@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/schema-utils/-/schema-utils-1.0.0.tgz"
  integrity sha512-i27Mic4KovM/lnGsy8whRCHhc7VicJajAjTrYg11K9zfZXnYIt4k5F+kZkwjnrhKzLic/HLU4j11mjsz2G/75g==
  dependencies:
    ajv "^6.1.0"
    ajv-errors "^1.0.0"
    ajv-keywords "^3.1.0"

schema-utils@^2.6.5:
  version "2.7.1"
  resolved "https://registry.npmjs.org/schema-utils/-/schema-utils-2.7.1.tgz"
  integrity sha512-SHiNtMOUGWBQJwzISiVYKu82GiV4QYGePp3odlY1tuKO7gPtphAT5R/py0fA6xtbgLL/RvtJZnU9b8s0F1q0Xg==
  dependencies:
    "@types/json-schema" "^7.0.5"
    ajv "^6.12.4"
    ajv-keywords "^3.5.2"

schema-utils@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/schema-utils/-/schema-utils-3.0.0.tgz"
  integrity sha512-6D82/xSzO094ajanoOSbe4YvXWMfn2A//8Y1+MUqFAJul5Bs+yn36xbK9OtNDcRVSBJ9jjeoXftM6CfztsjOAA==
  dependencies:
    "@types/json-schema" "^7.0.6"
    ajv "^6.12.5"
    ajv-keywords "^3.5.2"

select-hose@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/select-hose/-/select-hose-2.0.0.tgz"
  integrity sha1-Yl2GWPhlr0Psliv8N2o3NZpJlMo= sha512-mEugaLK+YfkijB4fx0e6kImuJdCIt2LxCRcbEYPqRGCs4F2ogyfZU5IAZRdjCP8JPq2AtdNoC/Dux63d9Kiryg==

selfsigned@^1.10.8:
  version "1.10.8"
  resolved "https://registry.npmjs.org/selfsigned/-/selfsigned-1.10.8.tgz"
  integrity sha512-2P4PtieJeEwVgTU9QEcwIRDQ/mXJLX8/+I3ur+Pg16nS8oNbrGxEso9NyYWy8NAmXiNl4dlAp5MwoNeCWzON4w==
  dependencies:
    node-forge "^0.10.0"

semver@^5.5.0:
  version "5.7.1"
  resolved "https://registry.npmjs.org/semver/-/semver-5.7.1.tgz"
  integrity sha512-sauaDf/PZdVgrLTNYHRtpXa1iRiKcaebiKQ1BJdpQlWH2lCvexQdX55snPFyK7QzpudqbCI0qXFfOasHdyNDGQ==

semver@^6.0.0, semver@^6.1.1, semver@^6.1.2, semver@^6.3.0:
  version "6.3.0"
  resolved "https://registry.npmjs.org/semver/-/semver-6.3.0.tgz"
  integrity sha512-b39TBaTSfV6yBrapU89p5fKekE2m/NwnDocOVruQFS1/veMgdzuPcnOM34M6CwxW8jH/lxEa5rBoDeUwu5HHTw==

semver@7.0.0:
  version "7.0.0"
  resolved "https://registry.npmjs.org/semver/-/semver-7.0.0.tgz"
  integrity sha512-+GB6zVA9LWh6zovYQLALHwv5rb2PHGlJi3lfiqIHxR0uuwCgefcOJc59v9fv1w8GbStwxuuqqAjI9NMAOOgq1A==

send@0.17.1:
  version "0.17.1"
  resolved "https://registry.npmjs.org/send/-/send-0.17.1.tgz"
  integrity sha512-BsVKsiGcQMFwT8UxypobUKyv7irCNRHk1T0G680vk88yf6LBByGcZJOTJCrTP2xVN6yI+XjPJcNuE3V4fT9sAg==
  dependencies:
    debug "2.6.9"
    depd "~1.1.2"
    destroy "~1.0.4"
    encodeurl "~1.0.2"
    escape-html "~1.0.3"
    etag "~1.8.1"
    fresh "0.5.2"
    http-errors "~1.7.2"
    mime "1.6.0"
    ms "2.1.1"
    on-finished "~2.3.0"
    range-parser "~1.2.1"
    statuses "~1.5.0"

serialize-javascript@^5.0.1:
  version "5.0.1"
  resolved "https://registry.npmjs.org/serialize-javascript/-/serialize-javascript-5.0.1.tgz"
  integrity sha512-SaaNal9imEO737H2c05Og0/8LUXG7EnsZyMa8MzkmuHoELfT6txuj0cMqRj6zfPKnmQ1yasR4PCJc8x+M4JSPA==
  dependencies:
    randombytes "^2.1.0"

serve-index@^1.9.1:
  version "1.9.1"
  resolved "https://registry.npmjs.org/serve-index/-/serve-index-1.9.1.tgz"
  integrity sha1-03aNabHn2C5c4FD/9bRTvqEqkjk= sha512-pXHfKNP4qujrtteMrSBb0rc8HJ9Ms/GrXwcUtUtD5s4ewDJI8bT3Cz2zTVRMKtri49pLx2e0Ya8ziP5Ya2pZZw==
  dependencies:
    accepts "~1.3.4"
    batch "0.6.1"
    debug "2.6.9"
    escape-html "~1.0.3"
    http-errors "~1.6.2"
    mime-types "~2.1.17"
    parseurl "~1.3.2"

serve-static@1.14.1:
  version "1.14.1"
  resolved "https://registry.npmjs.org/serve-static/-/serve-static-1.14.1.tgz"
  integrity sha512-JMrvUwE54emCYWlTI+hGrGv5I8dEwmco/00EvkzIIsR7MqrHonbD9pO2MOfFnpFntl7ecpZs+3mW+XbQZu9QCg==
  dependencies:
    encodeurl "~1.0.2"
    escape-html "~1.0.3"
    parseurl "~1.3.3"
    send "0.17.1"

set-blocking@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/set-blocking/-/set-blocking-2.0.0.tgz"
  integrity sha1-BF+XgtARrppoA93TgrJDkrPYkPc= sha512-KiKBS8AnWGEyLzofFfmvKwpdPzqiy16LvQfK3yv/fVH7Bj13/wl3JSR1J+rfgRE9q7xUJK4qvgS8raSOeLUehw==

set-value@^2.0.0, set-value@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/set-value/-/set-value-2.0.1.tgz"
  integrity sha512-JxHc1weCN68wRY0fhCoXpyK55m/XPHafOmK4UWD7m2CI14GMcFypt4w/0+NV5f/ZMby2F6S2wwA7fgynh9gWSw==
  dependencies:
    extend-shallow "^2.0.1"
    is-extendable "^0.1.1"
    is-plain-object "^2.0.3"
    split-string "^3.0.1"

setprototypeof@1.1.0:
  version "1.1.0"
  resolved "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.1.0.tgz"
  integrity sha512-BvE/TwpZX4FXExxOxZyRGQQv651MSwmWKZGqvmPcRIjDqWub67kTKuIMx43cZZrS/cBBzwBcNDWoFxt2XEFIpQ==

setprototypeof@1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.1.1.tgz"
  integrity sha512-JvdAWfbXeIGaZ9cILp38HntZSFSo3mWg6xGcJJsd+d4aRMOqauag1C63dJfDw7OaMYwEbHMOxEZ1lqVRYP2OAw==

shallow-clone@^3.0.0:
  version "3.0.1"
  resolved "https://registry.npmjs.org/shallow-clone/-/shallow-clone-3.0.1.tgz"
  integrity sha512-/6KqX+GVUdqPuPPd2LxDDxzX6CAbjJehAAOKlNpqqUpAqPM6HeL8f+o3a+JsyGjn2lv0WY8UsTgUJjU9Ok55NA==
  dependencies:
    kind-of "^6.0.2"

shebang-command@^1.2.0:
  version "1.2.0"
  resolved "https://registry.npmjs.org/shebang-command/-/shebang-command-1.2.0.tgz"
  integrity sha1-RKrGW2lbAzmJaMOfNj/uXer98eo= sha512-EV3L1+UQWGor21OmnvojK36mhg+TyIKDh3iFBKBohr5xeXIhNBcx8oWdgkTEEQ+BEFFYdLRuqMfd5L84N1V5Vg==
  dependencies:
    shebang-regex "^1.0.0"

shebang-command@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz"
  integrity sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==
  dependencies:
    shebang-regex "^3.0.0"

shebang-regex@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/shebang-regex/-/shebang-regex-1.0.0.tgz"
  integrity sha1-2kL0l0DAtC2yypcoVxyxkMmO/qM= sha512-wpoSFAxys6b2a2wHZ1XpDSgD7N9iVjg29Ph9uV/uaP9Ex/KXlkTZTeddxDPSYQpgvzKLGJke2UU0AzoGCjNIvQ==

shebang-regex@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz"
  integrity sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==

signal-exit@^3.0.0, signal-exit@^3.0.3:
  version "3.0.3"
  resolved "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.3.tgz"
  integrity sha512-VUJ49FC8U1OxwZLxIbTTrDvLnf/6TDgxZcK8wxR8zs13xpx7xbG60ndBlhNrFi2EMuFRoeDoJO7wthSLq42EjA==

snapdragon-node@^2.0.1:
  version "2.1.1"
  resolved "https://registry.npmjs.org/snapdragon-node/-/snapdragon-node-2.1.1.tgz"
  integrity sha512-O27l4xaMYt/RSQ5TR3vpWCAB5Kb/czIcqUFOM/C4fYcLnbZUc1PkjTAMjof2pBWaSTwOUd6qUHcFGVGj7aIwnw==
  dependencies:
    define-property "^1.0.0"
    isobject "^3.0.0"
    snapdragon-util "^3.0.1"

snapdragon-util@^3.0.1:
  version "3.0.1"
  resolved "https://registry.npmjs.org/snapdragon-util/-/snapdragon-util-3.0.1.tgz"
  integrity sha512-mbKkMdQKsjX4BAL4bRYTj21edOf8cN7XHdYUJEe+Zn99hVEYcMvKPct1IqNe7+AZPirn8BCDOQBHQZknqmKlZQ==
  dependencies:
    kind-of "^3.2.0"

snapdragon@^0.8.1:
  version "0.8.2"
  resolved "https://registry.npmjs.org/snapdragon/-/snapdragon-0.8.2.tgz"
  integrity sha512-FtyOnWN/wCHTVXOMwvSv26d+ko5vWlIDD6zoUJ7LW8vh+ZBC8QdljveRP+crNrtBwioEUWy/4dMtbBjA4ioNlg==
  dependencies:
    base "^0.11.1"
    debug "^2.2.0"
    define-property "^0.2.5"
    extend-shallow "^2.0.1"
    map-cache "^0.2.2"
    source-map "^0.5.6"
    source-map-resolve "^0.5.0"
    use "^3.1.0"

sockjs-client@^1.5.0:
  version "1.5.1"
  resolved "https://registry.npmjs.org/sockjs-client/-/sockjs-client-1.5.1.tgz"
  integrity sha512-VnVAb663fosipI/m6pqRXakEOw7nvd7TUgdr3PlR/8V2I95QIdwT8L4nMxhyU8SmDBHYXU1TOElaKOmKLfYzeQ==
  dependencies:
    debug "^3.2.6"
    eventsource "^1.0.7"
    faye-websocket "^0.11.3"
    inherits "^2.0.4"
    json3 "^3.3.3"
    url-parse "^1.5.1"

sockjs@^0.3.21:
  version "0.3.21"
  resolved "https://registry.npmjs.org/sockjs/-/sockjs-0.3.21.tgz"
  integrity sha512-DhbPFGpxjc6Z3I+uX07Id5ZO2XwYsWOrYjaSeieES78cq+JaJvVe5q/m1uvjIQhXinhIeCFRH6JgXe+mvVMyXw==
  dependencies:
    faye-websocket "^0.11.3"
    uuid "^3.4.0"
    websocket-driver "^0.7.4"

source-list-map@^2.0.1:
  version "2.0.1"
  resolved "https://registry.npmjs.org/source-list-map/-/source-list-map-2.0.1.tgz"
  integrity sha512-qnQ7gVMxGNxsiL4lEuJwe/To8UnK7fAnmbGEEH8RpLouuKbeEm0lhbQVFIrNSuB+G7tVrAlVsZgETT5nljf+Iw==

source-map-resolve@^0.5.0:
  version "0.5.3"
  resolved "https://registry.npmjs.org/source-map-resolve/-/source-map-resolve-0.5.3.tgz"
  integrity sha512-Htz+RnsXWk5+P2slx5Jh3Q66vhQj1Cllm0zvnaY98+NFx+Dv2CF/f5O/t8x+KaNdrdIAsruNzoh/KpialbqAnw==
  dependencies:
    atob "^2.1.2"
    decode-uri-component "^0.2.0"
    resolve-url "^0.2.1"
    source-map-url "^0.4.0"
    urix "^0.1.0"

source-map-support@~0.5.12, source-map-support@~0.5.19:
  version "0.5.19"
  resolved "https://registry.npmjs.org/source-map-support/-/source-map-support-0.5.19.tgz"
  integrity sha512-Wonm7zOCIJzBGQdB+thsPar0kYuCIzYvxZwlBa87yi/Mdjv7Tip2cyVbLj5o0cFPN4EVkuTwb3GDDyUx2DGnGw==
  dependencies:
    buffer-from "^1.0.0"
    source-map "^0.6.0"

source-map-url@^0.4.0:
  version "0.4.1"
  resolved "https://registry.npmjs.org/source-map-url/-/source-map-url-0.4.1.tgz"
  integrity sha512-cPiFOTLUKvJFIg4SKVScy4ilPPW6rFgMgfuZJPNoDuMs3nC1HbMUycBoJw77xFIp6z1UJQJOfx6C9GMH80DiTw==

source-map@^0.5.0, source-map@^0.5.6:
  version "0.5.7"
  resolved "https://registry.npmjs.org/source-map/-/source-map-0.5.7.tgz"
  integrity sha1-igOdLRAh0i0eoUyA2OpGi6LvP8w= sha512-LbrmJOMUSdEVxIKvdcJzQC+nQhe8FUZQTXQy6+I75skNgn3OoQ0DZA8YnFa7gp8tqtL3KPf1kmo0R5DoApeSGQ==

source-map@^0.6.0:
  version "0.6.1"
  resolved "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz"
  integrity sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==

source-map@^0.6.1:
  version "0.6.1"
  resolved "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz"
  integrity sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==

source-map@^0.7.3:
  version "0.7.3"
  resolved "https://registry.npmjs.org/source-map/-/source-map-0.7.3.tgz"
  integrity sha512-CkCj6giN3S+n9qrYiBTX5gystlENnRW5jZeNLHpe6aue+SrHcG5VYwujhW9s4dY31mEGsxBDrHR6oI69fTXsaQ==

source-map@~0.6.0:
  version "0.6.1"
  resolved "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz"
  integrity sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==

source-map@~0.6.1:
  version "0.6.1"
  resolved "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz"
  integrity sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==

source-map@~0.7.2:
  version "0.7.3"
  resolved "https://registry.npmjs.org/source-map/-/source-map-0.7.3.tgz"
  integrity sha512-CkCj6giN3S+n9qrYiBTX5gystlENnRW5jZeNLHpe6aue+SrHcG5VYwujhW9s4dY31mEGsxBDrHR6oI69fTXsaQ==

spdy-transport@^3.0.0:
  version "3.0.0"
  resolved "https://registry.npmjs.org/spdy-transport/-/spdy-transport-3.0.0.tgz"
  integrity sha512-hsLVFE5SjA6TCisWeJXFKniGGOpBgMLmerfO2aCyCU5s7nJ/rpAepqmFifv/GCbSbueEeAJJnmSQ2rKC/g8Fcw==
  dependencies:
    debug "^4.1.0"
    detect-node "^2.0.4"
    hpack.js "^2.1.6"
    obuf "^1.1.2"
    readable-stream "^3.0.6"
    wbuf "^1.7.3"

spdy@^4.0.2:
  version "4.0.2"
  resolved "https://registry.npmjs.org/spdy/-/spdy-4.0.2.tgz"
  integrity sha512-r46gZQZQV+Kl9oItvl1JZZqJKGr+oEkB08A6BzkiR7593/7IbtuncXHd2YoYeTsG4157ZssMu9KYvUHLcjcDoA==
  dependencies:
    debug "^4.1.0"
    handle-thing "^2.0.0"
    http-deceiver "^1.2.7"
    select-hose "^2.0.0"
    spdy-transport "^3.0.0"

split-string@^3.0.1, split-string@^3.0.2:
  version "3.1.0"
  resolved "https://registry.npmjs.org/split-string/-/split-string-3.1.0.tgz"
  integrity sha512-NzNVhJDYpwceVVii8/Hu6DKfD2G+NrQHlS/V/qgv763EYudVwEcMQNxd2lh+0VrUByXN/oJkl5grOhYWvQUYiw==
  dependencies:
    extend-shallow "^3.0.0"

static-extend@^0.1.1:
  version "0.1.2"
  resolved "https://registry.npmjs.org/static-extend/-/static-extend-0.1.2.tgz"
  integrity sha1-YICcOcv/VTNyJv1eC1IPNB8ftcY= sha512-72E9+uLc27Mt718pMHt9VMNiAL4LMsmDbBva8mxWUCkT07fSzEGMYUCk0XWY6lp0j6RBAG4cJ3mWuZv2OE3s0g==
  dependencies:
    define-property "^0.2.5"
    object-copy "^0.1.0"

"statuses@>= 1.4.0 < 2", "statuses@>= 1.5.0 < 2", statuses@~1.5.0:
  version "1.5.0"
  resolved "https://registry.npmjs.org/statuses/-/statuses-1.5.0.tgz"
  integrity sha1-Fhx9rBd2Wf2YEfQ3cfqZOBR4Yow= sha512-OpZ3zP+jT1PI7I8nemJX4AKmAX070ZkYPVWV/AaKTJl+tXCTGyVdC1a4SL8RUQYEwk/f34ZX8UTykN68FwrqAA==

string_decoder@^1.1.1:
  version "1.3.0"
  resolved "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz"
  integrity sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==
  dependencies:
    safe-buffer "~5.2.0"

string_decoder@~1.1.1:
  version "1.1.1"
  resolved "https://registry.npmjs.org/string_decoder/-/string_decoder-1.1.1.tgz"
  integrity sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==
  dependencies:
    safe-buffer "~5.1.0"

string-width@^3.0.0, string-width@^3.1.0:
  version "3.1.0"
  resolved "https://registry.npmjs.org/string-width/-/string-width-3.1.0.tgz"
  integrity sha512-vafcv6KjVZKSgz06oM/H6GDBrAtz8vdhQakGjFIvNrHA6y3HCF1CInLy+QLq8dTJPQ1b+KDUqDFctkdRW44e1w==
  dependencies:
    emoji-regex "^7.0.1"
    is-fullwidth-code-point "^2.0.0"
    strip-ansi "^5.1.0"

string.prototype.trimend@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.4.tgz"
  integrity sha512-y9xCjw1P23Awk8EvTpcyL2NIr1j7wJ39f+k6lvRnSMz+mz9CGz9NYPelDk42kOz6+ql8xjfK8oYzy3jAP5QU5A==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.1.3"

string.prototype.trimstart@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.4.tgz"
  integrity sha512-jh6e984OBfvxS50tdY2nRZnoC5/mLFKOREQfw8t5yytkoUsJRNxvI/E39qu1sD0OtWI3OC0XgKSmcWwziwYuZw==
  dependencies:
    call-bind "^1.0.2"
    define-properties "^1.1.3"

strip-ansi@^3.0.0, strip-ansi@^3.0.1:
  version "3.0.1"
  resolved "https://registry.npmjs.org/strip-ansi/-/strip-ansi-3.0.1.tgz"
  integrity sha1-ajhfuIU9lS1f8F0Oiq+UJ43GPc8= sha512-VhumSSbBqDTP8p2ZLKj40UjBCV4+v8bUSEpUb4KjRgWk9pbqGF4REFj6KEagidb2f/M6AzC0EmFyDNGaw9OCzg==
  dependencies:
    ansi-regex "^2.0.0"

strip-ansi@^5.0.0:
  version "5.2.0"
  resolved "https://registry.npmjs.org/strip-ansi/-/strip-ansi-5.2.0.tgz"
  integrity sha512-DuRs1gKbBqsMKIZlrffwlug8MHkcnpjs5VPmL1PAh+mA30U0DTotfDZ0d2UUsXpPmPmMMJ6W773MaA3J+lbiWA==
  dependencies:
    ansi-regex "^4.1.0"

strip-ansi@^5.1.0:
  version "5.2.0"
  resolved "https://registry.npmjs.org/strip-ansi/-/strip-ansi-5.2.0.tgz"
  integrity sha512-DuRs1gKbBqsMKIZlrffwlug8MHkcnpjs5VPmL1PAh+mA30U0DTotfDZ0d2UUsXpPmPmMMJ6W773MaA3J+lbiWA==
  dependencies:
    ansi-regex "^4.1.0"

strip-ansi@^5.2.0:
  version "5.2.0"
  resolved "https://registry.npmjs.org/strip-ansi/-/strip-ansi-5.2.0.tgz"
  integrity sha512-DuRs1gKbBqsMKIZlrffwlug8MHkcnpjs5VPmL1PAh+mA30U0DTotfDZ0d2UUsXpPmPmMMJ6W773MaA3J+lbiWA==
  dependencies:
    ansi-regex "^4.1.0"

strip-eof@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/strip-eof/-/strip-eof-1.0.0.tgz"
  integrity sha1-u0P/VZim6wXYm1n80SnJgzE2Br8= sha512-7FCwGGmx8mD5xQd3RPUvnSpUXHM3BWuzjtpD4TXsfcZ9EL4azvVVUscFYwD9nx8Kh+uCBC00XBtAykoMHwTh8Q==

strip-final-newline@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/strip-final-newline/-/strip-final-newline-2.0.0.tgz"
  integrity sha512-BrpvfNAE3dcvq7ll3xVumzjKjZQ5tI1sEUIKr3Uoks0XUl45St3FlatVqef9prk4jRDzhW6WZg+3bk93y6pLjA==

supports-color@^5.3.0:
  version "5.5.0"
  resolved "https://registry.npmjs.org/supports-color/-/supports-color-5.5.0.tgz"
  integrity sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==
  dependencies:
    has-flag "^3.0.0"

supports-color@^6.1.0:
  version "6.1.0"
  resolved "https://registry.npmjs.org/supports-color/-/supports-color-6.1.0.tgz"
  integrity sha512-qe1jfm1Mg7Nq/NSh6XE24gPXROEVsWHxC1LIx//XNlD9iw7YZQGjZNjYN7xGaEG6iKdA8EtNFW6R0gjnVXp+wQ==
  dependencies:
    has-flag "^3.0.0"

supports-color@^7.0.0:
  version "7.2.0"
  resolved "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz"
  integrity sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==
  dependencies:
    has-flag "^4.0.0"

tapable@^1.1.3:
  version "1.1.3"
  resolved "https://registry.npmjs.org/tapable/-/tapable-1.1.3.tgz"
  integrity sha512-4WK/bYZmj8xLr+HUCODHGF1ZFzsYffasLUgEiMBY4fgtltdO6B4WJtlSbPaDTLpYTcGVwM2qLnFTICEcNxs3kA==

tapable@^2.1.1:
  version "2.2.0"
  resolved "https://registry.npmjs.org/tapable/-/tapable-2.2.0.tgz"
  integrity sha512-FBk4IesMV1rBxX2tfiK8RAmogtWn53puLOQlvO8XuwlgxcYbP4mVPS9Ph4aeamSyyVjOl24aYWAuc8U5kCVwMw==

tapable@^2.2.0:
  version "2.2.0"
  resolved "https://registry.npmjs.org/tapable/-/tapable-2.2.0.tgz"
  integrity sha512-FBk4IesMV1rBxX2tfiK8RAmogtWn53puLOQlvO8XuwlgxcYbP4mVPS9Ph4aeamSyyVjOl24aYWAuc8U5kCVwMw==

terser-webpack-plugin@^5.1.1:
  version "5.1.1"
  resolved "https://registry.npmjs.org/terser-webpack-plugin/-/terser-webpack-plugin-5.1.1.tgz"
  integrity sha512-5XNNXZiR8YO6X6KhSGXfY0QrGrCRlSwAEjIIrlRQR4W8nP69TaJUlh3bkuac6zzgspiGPfKEHcY295MMVExl5Q==
  dependencies:
    jest-worker "^26.6.2"
    p-limit "^3.1.0"
    schema-utils "^3.0.0"
    serialize-javascript "^5.0.1"
    source-map "^0.6.1"
    terser "^5.5.1"

terser@^4.6.3:
  version "4.8.0"
  resolved "https://registry.npmjs.org/terser/-/terser-4.8.0.tgz"
  integrity sha512-EAPipTNeWsb/3wLPeup1tVPaXfIaU68xMnVdPafIL1TV05OhASArYyIfFvnvJCNrR2NIOvDVNNTFRa+Re2MWyw==
  dependencies:
    commander "^2.20.0"
    source-map "~0.6.1"
    source-map-support "~0.5.12"

terser@^5.5.1:
  version "5.6.1"
  resolved "https://registry.npmjs.org/terser/-/terser-5.6.1.tgz"
  integrity sha512-yv9YLFQQ+3ZqgWCUk+pvNJwgUTdlIxUk1WTN+RnaFJe2L7ipG2csPT0ra2XRm7Cs8cxN7QXmK1rFzEwYEQkzXw==
  dependencies:
    commander "^2.20.0"
    source-map "~0.7.2"
    source-map-support "~0.5.19"

three-pathfinding@^0.14.1:
  version "0.14.1"
  resolved "https://registry.npmjs.org/three-pathfinding/-/three-pathfinding-0.14.1.tgz"
  integrity sha512-lBXt+GLlgCz/ppakGDj6L/JJH2JmZ8ZFiFHqey4v47V8SrzhKRuXfrsHo6IPF1Z/MDki/ahIf7uquW+jy/3hAg==

three@^0.127.0, three@0.x.x:
  version "0.127.0"
  resolved "https://registry.npmjs.org/three/-/three-0.127.0.tgz"
  integrity sha512-wtgrn+mhYUbobxT7QN3GPdu3SRpSBQvwY6uOzLChWS7QE//f7paDU/+wlzbg+ngeIvBBqjBHSRuywTh8A99Jng==

thunky@^1.0.2:
  version "1.1.0"
  resolved "https://registry.npmjs.org/thunky/-/thunky-1.1.0.tgz"
  integrity sha512-eHY7nBftgThBqOyHGVN+l8gF0BucP09fMo0oO/Lb0w1OF80dJv+lDVpXG60WMQvkcxAkNybKsrEIE3ZtKGmPrA==

to-fast-properties@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/to-fast-properties/-/to-fast-properties-2.0.0.tgz"
  integrity sha1-3F5pjL0HkmW8c+A3doGk5Og/YW4= sha512-/OaKK0xYrs3DmxRYqL/yDc+FxFUVYhDlXMhRmv3z915w2HF1tnN1omB354j8VUGO/hbRzyD6Y3sA7v7GS/ceog==

to-object-path@^0.3.0:
  version "0.3.0"
  resolved "https://registry.npmjs.org/to-object-path/-/to-object-path-0.3.0.tgz"
  integrity sha1-KXWIt7Dn4KwI4E5nL4XB9JmeF68= sha512-9mWHdnGRuh3onocaHzukyvCZhzvr6tiflAy/JRFXcJX0TjgfWA9pk9t8CMbzmBE4Jfw58pXbkngtBtqYxzNEyg==
  dependencies:
    kind-of "^3.0.2"

to-regex-range@^2.1.0:
  version "2.1.1"
  resolved "https://registry.npmjs.org/to-regex-range/-/to-regex-range-2.1.1.tgz"
  integrity sha1-fIDBe53+vlmeJzZ+DU3VWQFB2zg= sha512-ZZWNfCjUokXXDGXFpZehJIkZqq91BcULFq/Pi7M5i4JnxXdhMKAK682z8bCW3o8Hj1wuuzoKcW3DfVzaP6VuNg==
  dependencies:
    is-number "^3.0.0"
    repeat-string "^1.6.1"

to-regex@^3.0.1, to-regex@^3.0.2:
  version "3.0.2"
  resolved "https://registry.npmjs.org/to-regex/-/to-regex-3.0.2.tgz"
  integrity sha512-FWtleNAtZ/Ki2qtqej2CXTOayOH9bHDQF+Q48VpWyDXjbYxA4Yz8iDB31zXOBUlOHHKidDbqGVrTUvQMPmBGBw==
  dependencies:
    define-property "^2.0.2"
    extend-shallow "^3.0.2"
    regex-not "^1.0.2"
    safe-regex "^1.1.0"

toidentifier@1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.0.tgz"
  integrity sha512-yaOH/Pk/VEhBWWTlhI+qXxDFXlejDGcQipMlyxda9nthulaxLZUNcUqFxokp0vcYnvteJln5FNQDRrxj3YcbVw==

tslib@^1.9.0:
  version "1.14.1"
  resolved "https://registry.npmjs.org/tslib/-/tslib-1.14.1.tgz"
  integrity sha512-Xni35NKzjgMrwevysHTCArtLDpPvye8zV/0E4EyYn43P7/7qvQwPh9BGkHewbMulVntbigmcT7rdX3BNo9wRJg==

tslib@^2.0.3:
  version "2.1.0"
  resolved "https://registry.npmjs.org/tslib/-/tslib-2.1.0.tgz"
  integrity sha512-hcVC3wYEziELGGmEEXue7D75zbwIIVUMWAVbHItGPx0ziyXxrOMQx4rQEVEV45Ut/1IotuEvwqPopzIOkDMf0A==

type-is@~1.6.17, type-is@~1.6.18:
  version "1.6.18"
  resolved "https://registry.npmjs.org/type-is/-/type-is-1.6.18.tgz"
  integrity sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==
  dependencies:
    media-typer "0.3.0"
    mime-types "~2.1.24"

unbox-primitive@^1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.0.1.tgz"
  integrity sha512-tZU/3NqK3dA5gpE1KtyiJUrEB0lxnGkMFHptJ7q6ewdZ8s12QrODwNbhIJStmJkd1QDXa1NRA8aF2A1zk/Ypyw==
  dependencies:
    function-bind "^1.1.1"
    has-bigints "^1.0.1"
    has-symbols "^1.0.2"
    which-boxed-primitive "^1.0.2"

unicode-canonical-property-names-ecmascript@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/unicode-canonical-property-names-ecmascript/-/unicode-canonical-property-names-ecmascript-1.0.4.tgz"
  integrity sha512-jDrNnXWHd4oHiTZnx/ZG7gtUTVp+gCcTTKr8L0HjlwphROEW3+Him+IpvC+xcJEFegapiMZyZe02CyuOnRmbnQ==

unicode-match-property-ecmascript@^1.0.4:
  version "1.0.4"
  resolved "https://registry.npmjs.org/unicode-match-property-ecmascript/-/unicode-match-property-ecmascript-1.0.4.tgz"
  integrity sha512-L4Qoh15vTfntsn4P1zqnHulG0LdXgjSO035fEpdtp6YxXhMT51Q6vgM5lYdG/5X3MjS+k/Y9Xw4SFCY9IkR0rg==
  dependencies:
    unicode-canonical-property-names-ecmascript "^1.0.4"
    unicode-property-aliases-ecmascript "^1.0.4"

unicode-match-property-value-ecmascript@^1.2.0:
  version "1.2.0"
  resolved "https://registry.npmjs.org/unicode-match-property-value-ecmascript/-/unicode-match-property-value-ecmascript-1.2.0.tgz"
  integrity sha512-wjuQHGQVofmSJv1uVISKLE5zO2rNGzM/KCYZch/QQvez7C1hUhBIuZ701fYXExuufJFMPhv2SyL8CyoIfMLbIQ==

unicode-property-aliases-ecmascript@^1.0.4:
  version "1.1.0"
  resolved "https://registry.npmjs.org/unicode-property-aliases-ecmascript/-/unicode-property-aliases-ecmascript-1.1.0.tgz"
  integrity sha512-PqSoPh/pWetQ2phoj5RLiaqIk4kCNwoV3CI+LfGmWLKI3rE3kl1h59XpX2BjgDrmbxD9ARtQobPGU1SguCYuQg==

union-value@^1.0.0:
  version "1.0.1"
  resolved "https://registry.npmjs.org/union-value/-/union-value-1.0.1.tgz"
  integrity sha512-tJfXmxMeWYnczCVs7XAEvIV7ieppALdyepWMkHkwciRpZraG/xwT+s2JN8+pr1+8jCRf80FFzvr+MpQeeoF4Xg==
  dependencies:
    arr-union "^3.1.0"
    get-value "^2.0.6"
    is-extendable "^0.1.1"
    set-value "^2.0.1"

unpipe@~1.0.0, unpipe@1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz"
  integrity sha1-sr9O6FFKrmFltIF4KdIbLvSZBOw= sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==

unset-value@^1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/unset-value/-/unset-value-1.0.0.tgz"
  integrity sha1-g3aHP30jNRef+x5vw6jtDfyKtVk= sha512-PcA2tsuGSF9cnySLHTLSh2qrQiJ70mn+r+Glzxv2TWZblxsxCC52BDlZoPCsz7STd9pN7EZetkWZBAvk4cgZdQ==
  dependencies:
    has-value "^0.3.1"
    isobject "^3.0.0"

upath@^1.1.1:
  version "1.2.0"
  resolved "https://registry.npmjs.org/upath/-/upath-1.2.0.tgz"
  integrity sha512-aZwGpamFO61g3OlfT7OQCHqhGnW43ieH9WZeP7QxN/G/jS4jfqUkZxoryvJgVPEcrl5NL/ggHsSmLMHuH64Lhg==

uri-js@^4.2.2:
  version "4.4.1"
  resolved "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz"
  integrity sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==
  dependencies:
    punycode "^2.1.0"

urix@^0.1.0:
  version "0.1.0"
  resolved "https://registry.npmjs.org/urix/-/urix-0.1.0.tgz"
  integrity sha1-2pN/emLiH+wf0Y1Js1wpNQZ6bHI= sha512-Am1ousAhSLBeB9cG/7k7r2R0zj50uDRlZHPGbazid5s9rlF1F/QKYObEKSIunSjIOkJZqwRRLpvewjEkM7pSqg==

url-parse@^1.4.3, url-parse@^1.5.1:
  version "1.5.1"
  resolved "https://registry.npmjs.org/url-parse/-/url-parse-1.5.1.tgz"
  integrity sha512-HOfCOUJt7iSYzEx/UqgtwKRMC6EU91NFhsCHMv9oM03VJcVo2Qrp8T8kI9D7amFf1cu+/3CEhgb3rF9zL7k85Q==
  dependencies:
    querystringify "^2.1.1"
    requires-port "^1.0.0"

url@^0.11.0:
  version "0.11.0"
  resolved "https://registry.npmjs.org/url/-/url-0.11.0.tgz"
  integrity sha1-ODjpfPxgUh63PFJajlW/3Z4uKPE= sha512-kbailJa29QrtXnxgq+DdCEGlbTeYM2eJUxsz6vjZavrCYPMIFHMKQmSKYAIuUK2i7hgPm28a8piX5NTUtM/LKQ==
  dependencies:
    punycode "1.3.2"
    querystring "0.2.0"

use@^3.1.0:
  version "3.1.1"
  resolved "https://registry.npmjs.org/use/-/use-3.1.1.tgz"
  integrity sha512-cwESVXlO3url9YWlFW/TA9cshCEhtu7IKJ/p5soJ/gGpj7vbvFrAY/eIioQ6Dw23KjZhYgiIo8HOs1nQ2vr/oQ==

util-deprecate@^1.0.1, util-deprecate@~1.0.1:
  version "1.0.2"
  resolved "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz"
  integrity sha1-RQ1Nyfpw3nMnYvvS1KKJgUGaDM8= sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==

util.promisify@1.0.0:
  version "1.0.0"
  resolved "https://registry.npmjs.org/util.promisify/-/util.promisify-1.0.0.tgz"
  integrity sha512-i+6qA2MPhvoKLuxnJNpXAGhg7HphQOSUq2LKMZD0m15EiskXUkMvKdF4Uui0WYeCUGea+o2cw/ZuwehtfsrNkA==
  dependencies:
    define-properties "^1.1.2"
    object.getownpropertydescriptors "^2.0.3"

utila@~0.4:
  version "0.4.0"
  resolved "https://registry.npmjs.org/utila/-/utila-0.4.0.tgz"
  integrity sha1-ihagXURWV6Oupe7MWxKk+lN5dyw= sha512-Z0DbgELS9/L/75wZbro8xAnT50pBVFQZ+hUEueGDU5FN51YSCYM+jdxsfCiHjwNP/4LCDD0i/graKpeBnOXKRA==

utils-merge@1.0.1:
  version "1.0.1"
  resolved "https://registry.npmjs.org/utils-merge/-/utils-merge-1.0.1.tgz"
  integrity sha1-n5VxD1CiZ5R7LMwSR0HBAoQn5xM= sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==

uuid@^3.3.2, uuid@^3.4.0:
  version "3.4.0"
  resolved "https://registry.npmjs.org/uuid/-/uuid-3.4.0.tgz"
  integrity sha512-HjSDRw6gZE5JMggctHBcjVak08+KEVhSIiDzFnT9S9aegmp85S/bReBVTb4QTFaRNptJ9kuYaNhnbNEOkbKb/A==

v8-compile-cache@^2.2.0:
  version "2.3.0"
  resolved "https://registry.npmjs.org/v8-compile-cache/-/v8-compile-cache-2.3.0.tgz"
  integrity sha512-l8lCEmLcLYZh4nbunNZvQCJc5pv7+RCwa8q/LdUx8u7lsWvPDKmpodJAJNwkAhJC//dFY48KuIEmjtd4RViDrA==

vary@~1.1.2:
  version "1.1.2"
  resolved "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz"
  integrity sha1-IpnwLG3tMNSllhsLn3RSShj2NPw= sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==

watchpack@^2.0.0:
  version "2.1.1"
  resolved "https://registry.npmjs.org/watchpack/-/watchpack-2.1.1.tgz"
  integrity sha512-Oo7LXCmc1eE1AjyuSBmtC3+Wy4HcV8PxWh2kP6fOl8yTlNS7r0K9l1ao2lrrUza7V39Y3D/BbJgY8VeSlc5JKw==
  dependencies:
    glob-to-regexp "^0.4.1"
    graceful-fs "^4.1.2"

wbuf@^1.1.0, wbuf@^1.7.3:
  version "1.7.3"
  resolved "https://registry.npmjs.org/wbuf/-/wbuf-1.7.3.tgz"
  integrity sha512-O84QOnr0icsbFGLS0O3bI5FswxzRr8/gHwWkDlQFskhSPryQXvrTMxjxGP4+iWYoauLoBvfDpkrOauZ+0iZpDA==
  dependencies:
    minimalistic-assert "^1.0.0"

webpack-cli@^4.3.1, webpack-cli@4.x.x:
  version "4.6.0"
  resolved "https://registry.npmjs.org/webpack-cli/-/webpack-cli-4.6.0.tgz"
  integrity sha512-9YV+qTcGMjQFiY7Nb1kmnupvb1x40lfpj8pwdO/bom+sQiP4OBMKjHq29YQrlDWDPZO9r/qWaRRywKaRDKqBTA==
  dependencies:
    "@discoveryjs/json-ext" "^0.5.0"
    "@webpack-cli/configtest" "^1.0.2"
    "@webpack-cli/info" "^1.2.3"
    "@webpack-cli/serve" "^1.3.1"
    colorette "^1.2.1"
    commander "^7.0.0"
    enquirer "^2.3.6"
    execa "^5.0.0"
    fastest-levenshtein "^1.0.12"
    import-local "^3.0.2"
    interpret "^2.2.0"
    rechoir "^0.7.0"
    v8-compile-cache "^2.2.0"
    webpack-merge "^5.7.3"

webpack-dev-middleware@^3.7.2:
  version "3.7.3"
  resolved "https://registry.npmjs.org/webpack-dev-middleware/-/webpack-dev-middleware-3.7.3.tgz"
  integrity sha512-djelc/zGiz9nZj/U7PTBi2ViorGJXEWo/3ltkPbDyxCXhhEXkW0ce99falaok4TPj+AsxLiXJR0EBOb0zh9fKQ==
  dependencies:
    memory-fs "^0.4.1"
    mime "^2.4.4"
    mkdirp "^0.5.1"
    range-parser "^1.2.1"
    webpack-log "^2.0.0"

webpack-dev-server@^3.11.2:
  version "3.11.2"
  resolved "https://registry.npmjs.org/webpack-dev-server/-/webpack-dev-server-3.11.2.tgz"
  integrity sha512-A80BkuHRQfCiNtGBS1EMf2ChTUs0x+B3wGDFmOeT4rmJOHhHTCH2naNxIHhmkr0/UillP4U3yeIyv1pNp+QDLQ==
  dependencies:
    ansi-html "0.0.7"
    bonjour "^3.5.0"
    chokidar "^2.1.8"
    compression "^1.7.4"
    connect-history-api-fallback "^1.6.0"
    debug "^4.1.1"
    del "^4.1.1"
    express "^4.17.1"
    html-entities "^1.3.1"
    http-proxy-middleware "0.19.1"
    import-local "^2.0.0"
    internal-ip "^4.3.0"
    ip "^1.1.5"
    is-absolute-url "^3.0.3"
    killable "^1.0.1"
    loglevel "^1.6.8"
    opn "^5.5.0"
    p-retry "^3.0.1"
    portfinder "^1.0.26"
    schema-utils "^1.0.0"
    selfsigned "^1.10.8"
    semver "^6.3.0"
    serve-index "^1.9.1"
    sockjs "^0.3.21"
    sockjs-client "^1.5.0"
    spdy "^4.0.2"
    strip-ansi "^3.0.1"
    supports-color "^6.1.0"
    url "^0.11.0"
    webpack-dev-middleware "^3.7.2"
    webpack-log "^2.0.0"
    ws "^6.2.1"
    yargs "^13.3.2"

webpack-log@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/webpack-log/-/webpack-log-2.0.0.tgz"
  integrity sha512-cX8G2vR/85UYG59FgkoMamwHUIkSSlV3bBMRsbxVXVUk2j6NleCKjQ/WE9eYg9WY4w25O9w8wKP4rzNZFmUcUg==
  dependencies:
    ansi-colors "^3.0.0"
    uuid "^3.3.2"

webpack-merge@^5.7.3:
  version "5.7.3"
  resolved "https://registry.npmjs.org/webpack-merge/-/webpack-merge-5.7.3.tgz"
  integrity sha512-6/JUQv0ELQ1igjGDzHkXbVDRxkfA57Zw7PfiupdLFJYrgFqY5ZP8xxbpp2lU3EPwYx89ht5Z/aDkD40hFCm5AA==
  dependencies:
    clone-deep "^4.0.1"
    wildcard "^2.0.0"

webpack-sources@^2.1.1:
  version "2.2.0"
  resolved "https://registry.npmjs.org/webpack-sources/-/webpack-sources-2.2.0.tgz"
  integrity sha512-bQsA24JLwcnWGArOKUxYKhX3Mz/nK1Xf6hxullKERyktjNMC4x8koOeaDNTA2fEJ09BdWLbM/iTW0ithREUP0w==
  dependencies:
    source-list-map "^2.0.1"
    source-map "^0.6.1"

"webpack@^4.0.0 || ^5.0.0", webpack@^5.1.0, webpack@^5.14.0, webpack@>=2, "webpack@4.x.x || 5.x.x":
  version "5.30.0"
  resolved "https://registry.npmjs.org/webpack/-/webpack-5.30.0.tgz"
  integrity sha512-Zr9NIri5yzpfmaMea2lSMV1UygbW0zQsSlGLMgKUm63ACXg6alhd1u4v5UBSBjzYKXJN6BNMGVM7w165e7NxYA==
  dependencies:
    "@types/eslint-scope" "^3.7.0"
    "@types/estree" "^0.0.46"
    "@webassemblyjs/ast" "1.11.0"
    "@webassemblyjs/wasm-edit" "1.11.0"
    "@webassemblyjs/wasm-parser" "1.11.0"
    acorn "^8.0.4"
    browserslist "^4.14.5"
    chrome-trace-event "^1.0.2"
    enhanced-resolve "^5.7.0"
    es-module-lexer "^0.4.0"
    eslint-scope "^5.1.1"
    events "^3.2.0"
    glob-to-regexp "^0.4.1"
    graceful-fs "^4.2.4"
    json-parse-better-errors "^1.0.2"
    loader-runner "^4.2.0"
    mime-types "^2.1.27"
    neo-async "^2.6.2"
    schema-utils "^3.0.0"
    tapable "^2.1.1"
    terser-webpack-plugin "^5.1.1"
    watchpack "^2.0.0"
    webpack-sources "^2.1.1"

websocket-driver@^0.7.4, websocket-driver@>=0.5.1:
  version "0.7.4"
  resolved "https://registry.npmjs.org/websocket-driver/-/websocket-driver-0.7.4.tgz"
  integrity sha512-b17KeDIQVjvb0ssuSDF2cYXSg2iztliJ4B9WdsuB6J952qCPKmnVq4DyW5motImXHDC1cBT/1UezrJVsKw5zjg==
  dependencies:
    http-parser-js ">=0.5.1"
    safe-buffer ">=5.1.0"
    websocket-extensions ">=0.1.1"

websocket-extensions@>=0.1.1:
  version "0.1.4"
  resolved "https://registry.npmjs.org/websocket-extensions/-/websocket-extensions-0.1.4.tgz"
  integrity sha512-OqedPIGOfsDlo31UNwYbCFMSaO9m9G/0faIHj5/dZFDMFqPTcx6UwqyOy3COEaEOg/9VsGIpdqn62W5KhoKSpg==

which-boxed-primitive@^1.0.2:
  version "1.0.2"
  resolved "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.0.2.tgz"
  integrity sha512-bwZdv0AKLpplFY2KZRX6TvyuN7ojjr7lwkg6ml0roIy9YeuSr7JS372qlNW18UQYzgYK9ziGcerWqZOmEn9VNg==
  dependencies:
    is-bigint "^1.0.1"
    is-boolean-object "^1.1.0"
    is-number-object "^1.0.4"
    is-string "^1.0.5"
    is-symbol "^1.0.3"

which-module@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/which-module/-/which-module-2.0.0.tgz"
  integrity sha1-2e8H3Od7mQK4o6j6SzHD4/fm6Ho= sha512-B+enWhmw6cjfVC7kS8Pj9pCrKSc5txArRyaYGe088shv/FGWH+0Rjx/xPgtsWfsUtS27FkP697E4DDhgrgoc0Q==

which@^1.2.9:
  version "1.3.1"
  resolved "https://registry.npmjs.org/which/-/which-1.3.1.tgz"
  integrity sha512-HxJdYWq1MTIQbJ3nw0cqssHoTNU267KlrDuGZ1WYlxDStUtKUhOaJmh112/TZmHxxUfuJqPXSOm7tDyas0OSIQ==
  dependencies:
    isexe "^2.0.0"

which@^2.0.1:
  version "2.0.2"
  resolved "https://registry.npmjs.org/which/-/which-2.0.2.tgz"
  integrity sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==
  dependencies:
    isexe "^2.0.0"

wildcard@^2.0.0:
  version "2.0.0"
  resolved "https://registry.npmjs.org/wildcard/-/wildcard-2.0.0.tgz"
  integrity sha512-JcKqAHLPxcdb9KM49dufGXn2x3ssnfjbcaQdLlfZsL9rH9wgDQjUtDxbo8NE0F6SFvydeu1VhZe7hZuHsB2/pw==

wrap-ansi@^5.1.0:
  version "5.1.0"
  resolved "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-5.1.0.tgz"
  integrity sha512-QC1/iN/2/RPVJ5jYK8BGttj5z83LmSKmvbvrXPNCLZSEb32KKVDJDl/MOt2N01qU2H/FkzEa9PKto1BqDjtd7Q==
  dependencies:
    ansi-styles "^3.2.0"
    string-width "^3.0.0"
    strip-ansi "^5.0.0"

wrappy@1:
  version "1.0.2"
  resolved "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz"
  integrity sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8= sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==

ws@^6.2.1:
  version "6.2.1"
  resolved "https://registry.npmjs.org/ws/-/ws-6.2.1.tgz"
  integrity sha512-GIyAXC2cB7LjvpgMt9EKS2ldqr0MTrORaleiOno6TweZ6r3TKtoFQWay/2PceJ3RuBasOHzXNn5Lrw1X0bEjqA==
  dependencies:
    async-limiter "~1.0.0"

y18n@^4.0.0:
  version "4.0.1"
  resolved "https://registry.npmjs.org/y18n/-/y18n-4.0.1.tgz"
  integrity sha512-wNcy4NvjMYL8gogWWYAO7ZFWFfHcbdbE57tZO8e4cbpj8tfUcwrwqSl3ad8HxpYWCdXcJUCeKKZS62Av1affwQ==

yargs-parser@^13.1.2:
  version "13.1.2"
  resolved "https://registry.npmjs.org/yargs-parser/-/yargs-parser-13.1.2.tgz"
  integrity sha512-3lbsNRf/j+A4QuSZfDRA7HRSfWrzO0YjqTJd5kjAq37Zep1CEgaYmrH9Q3GwPiB9cHyd1Y1UwggGhJGoxipbzg==
  dependencies:
    camelcase "^5.0.0"
    decamelize "^1.2.0"

yargs@^13.3.2:
  version "13.3.2"
  resolved "https://registry.npmjs.org/yargs/-/yargs-13.3.2.tgz"
  integrity sha512-AX3Zw5iPruN5ie6xGRIDgqkT+ZhnRlZMLMHAs8tg7nRruy2Nb+i5o9bwghAogtM08q1dpr2LVoS8KSTMYpWXUw==
  dependencies:
    cliui "^5.0.0"
    find-up "^3.0.0"
    get-caller-file "^2.0.1"
    require-directory "^2.1.1"
    require-main-filename "^2.0.0"
    set-blocking "^2.0.0"
    string-width "^3.0.0"
    which-module "^2.0.0"
    y18n "^4.0.0"
    yargs-parser "^13.1.2"

yocto-queue@^0.1.0:
  version "0.1.0"
  resolved "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz"
  integrity sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==
```

## File: /Users/saint/Desktop/game-dev/three-fps/package-lock.json

```json
{
  "name": "three-fps-demo",
  "version": "0.9.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "three-fps-demo",
      "version": "0.9.0",
      "dependencies": {
        "@types/ammo.js": "github:osman-turan/ammo.js-typings",
        "ammo.js": "kripken/ammo.js",
        "three": "^0.127.0",
        "three-pathfinding": "^0.14.1",
        "webpack-cli": "^4.3.1"
      },
      "devDependencies": {
        "@babel/core": "^7.12.10",
        "@babel/preset-env": "^7.12.11",
        "babel-loader": "^8.2.2",
        "file-loader": "^6.2.0",
        "html-webpack-plugin": "^4.5.1",
        "raw-loader": "^4.0.2",
        "webpack": "^5.14.0",
        "webpack-dev-server": "^3.11.2"
      },
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.12.13.tgz",
      "integrity": "sha512-HV1Cm0Q3ZrpCR93tkWOYiuYIgLxZXZFVG2VgK+MBWjUqZTundupbfx2aXarXuw5Ko5aMcjtJgbSs4vUGBS5v6g==",
      "dev": true,
      "dependencies": {
        "@babel/highlight": "^7.12.13"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.13.12",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.13.12.tgz",
      "integrity": "sha512-3eJJ841uKxeV8dcN/2yGEUy+RfgQspPEgQat85umsE1rotuquQ2AbIub4S6j7c50a2d+4myc+zSlnXeIHrOnhQ==",
      "dev": true
    },
    "node_modules/@babel/core": {
      "version": "7.13.14",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.13.14.tgz",
      "integrity": "sha512-wZso/vyF4ki0l0znlgM4inxbdrUvCb+cVz8grxDq+6C9k6qbqoIJteQOKicaKjCipU3ISV+XedCqpL2RJJVehA==",
      "dev": true,
      "dependencies": {
        "@babel/code-frame": "^7.12.13",
        "@babel/generator": "^7.13.9",
        "@babel/helper-compilation-targets": "^7.13.13",
        "@babel/helper-module-transforms": "^7.13.14",
        "@babel/helpers": "^7.13.10",
        "@babel/parser": "^7.13.13",
        "@babel/template": "^7.12.13",
        "@babel/traverse": "^7.13.13",
        "@babel/types": "^7.13.14",
        "convert-source-map": "^1.7.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.1.2",
        "semver": "^6.3.0",
        "source-map": "^0.5.0"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.13.9",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.13.9.tgz",
      "integrity": "sha512-mHOOmY0Axl/JCTkxTU6Lf5sWOg/v8nUa+Xkt4zMTftX0wqmb6Sh7J8gvcehBw7q0AhrhAR+FDacKjCZ2X8K+Sw==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.13.0",
        "jsesc": "^2.5.1",
        "source-map": "^0.5.0"
      }
    },
    "node_modules/@babel/helper-annotate-as-pure": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.12.13.tgz",
      "integrity": "sha512-7YXfX5wQ5aYM/BOlbSccHDbuXXFPxeoUmfWtz8le2yTkTZc+BxsiEnENFoi2SlmA8ewDkG2LgIMIVzzn2h8kfw==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.12.13"
      }
    },
    "node_modules/@babel/helper-builder-binary-assignment-operator-visitor": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/helper-builder-binary-assignment-operator-visitor/-/helper-builder-binary-assignment-operator-visitor-7.12.13.tgz",
      "integrity": "sha512-CZOv9tGphhDRlVjVkAgm8Nhklm9RzSmWpX2my+t7Ua/KT616pEzXsQCjinzvkRvHWJ9itO4f296efroX23XCMA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-explode-assignable-expression": "^7.12.13",
        "@babel/types": "^7.12.13"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.13.13",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.13.13.tgz",
      "integrity": "sha512-q1kcdHNZehBwD9jYPh3WyXcsFERi39X4I59I3NadciWtNDyZ6x+GboOxncFK0kXlKIv6BJm5acncehXWUjWQMQ==",
      "dev": true,
      "dependencies": {
        "@babel/compat-data": "^7.13.12",
        "@babel/helper-validator-option": "^7.12.17",
        "browserslist": "^4.14.5",
        "semver": "^6.3.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-create-class-features-plugin": {
      "version": "7.13.11",
      "resolved": "https://registry.npmjs.org/@babel/helper-create-class-features-plugin/-/helper-create-class-features-plugin-7.13.11.tgz",
      "integrity": "sha512-ays0I7XYq9xbjCSvT+EvysLgfc3tOkwCULHjrnscGT3A9qD4sk3wXnJ3of0MAWsWGjdinFvajHU2smYuqXKMrw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-function-name": "^7.12.13",
        "@babel/helper-member-expression-to-functions": "^7.13.0",
        "@babel/helper-optimise-call-expression": "^7.12.13",
        "@babel/helper-replace-supers": "^7.13.0",
        "@babel/helper-split-export-declaration": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-create-regexp-features-plugin": {
      "version": "7.12.17",
      "resolved": "https://registry.npmjs.org/@babel/helper-create-regexp-features-plugin/-/helper-create-regexp-features-plugin-7.12.17.tgz",
      "integrity": "sha512-p2VGmBu9oefLZ2nQpgnEnG0ZlRPvL8gAGvPUMQwUdaE8k49rOMuZpOwdQoy5qJf6K8jL3bcAMhVUlHAjIgJHUg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.12.13",
        "regexpu-core": "^4.7.1"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-define-polyfill-provider": {
      "version": "0.1.5",
      "resolved": "https://registry.npmjs.org/@babel/helper-define-polyfill-provider/-/helper-define-polyfill-provider-0.1.5.tgz",
      "integrity": "sha512-nXuzCSwlJ/WKr8qxzW816gwyT6VZgiJG17zR40fou70yfAcqjoNyTLl/DQ+FExw5Hx5KNqshmN8Ldl/r2N7cTg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-compilation-targets": "^7.13.0",
        "@babel/helper-module-imports": "^7.12.13",
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/traverse": "^7.13.0",
        "debug": "^4.1.1",
        "lodash.debounce": "^4.0.8",
        "resolve": "^1.14.2",
        "semver": "^6.1.2"
      },
      "peerDependencies": {
        "@babel/core": "^7.4.0-0"
      }
    },
    "node_modules/@babel/helper-explode-assignable-expression": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-explode-assignable-expression/-/helper-explode-assignable-expression-7.13.0.tgz",
      "integrity": "sha512-qS0peLTDP8kOisG1blKbaoBg/o9OSa1qoumMjTK5pM+KDTtpxpsiubnCGP34vK8BXGcb2M9eigwgvoJryrzwWA==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.13.0"
      }
    },
    "node_modules/@babel/helper-function-name": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/helper-function-name/-/helper-function-name-7.12.13.tgz",
      "integrity": "sha512-TZvmPn0UOqmvi5G4vvw0qZTpVptGkB1GL61R6lKvrSdIxGm5Pky7Q3fpKiIkQCAtRCBUwB0PaThlx9vebCDSwA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-get-function-arity": "^7.12.13",
        "@babel/template": "^7.12.13",
        "@babel/types": "^7.12.13"
      }
    },
    "node_modules/@babel/helper-get-function-arity": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/helper-get-function-arity/-/helper-get-function-arity-7.12.13.tgz",
      "integrity": "sha512-DjEVzQNz5LICkzN0REdpD5prGoidvbdYk1BVgRUOINaWJP2t6avB27X1guXK1kXNrX0WMfsrm1A/ZBthYuIMQg==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.12.13"
      }
    },
    "node_modules/@babel/helper-hoist-variables": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-hoist-variables/-/helper-hoist-variables-7.13.0.tgz",
      "integrity": "sha512-0kBzvXiIKfsCA0y6cFEIJf4OdzfpRuNk4+YTeHZpGGc666SATFKTz6sRncwFnQk7/ugJ4dSrCj6iJuvW4Qwr2g==",
      "dev": true,
      "dependencies": {
        "@babel/traverse": "^7.13.0",
        "@babel/types": "^7.13.0"
      }
    },
    "node_modules/@babel/helper-member-expression-to-functions": {
      "version": "7.13.12",
      "resolved": "https://registry.npmjs.org/@babel/helper-member-expression-to-functions/-/helper-member-expression-to-functions-7.13.12.tgz",
      "integrity": "sha512-48ql1CLL59aKbU94Y88Xgb2VFy7a95ykGRbJJaaVv+LX5U8wFpLfiGXJJGUozsmA1oEh/o5Bp60Voq7ACyA/Sw==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.13.12"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.13.12",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.13.12.tgz",
      "integrity": "sha512-4cVvR2/1B693IuOvSI20xqqa/+bl7lqAMR59R4iu39R9aOX8/JoYY1sFaNvUMyMBGnHdwvJgUrzNLoUZxXypxA==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.13.12"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.13.14",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.13.14.tgz",
      "integrity": "sha512-QuU/OJ0iAOSIatyVZmfqB0lbkVP0kDRiKj34xy+QNsnVZi/PA6BoSoreeqnxxa9EHFAIL0R9XOaAR/G9WlIy5g==",
      "dev": true,
      "dependencies": {
        "@babel/helper-module-imports": "^7.13.12",
        "@babel/helper-replace-supers": "^7.13.12",
        "@babel/helper-simple-access": "^7.13.12",
        "@babel/helper-split-export-declaration": "^7.12.13",
        "@babel/helper-validator-identifier": "^7.12.11",
        "@babel/template": "^7.12.13",
        "@babel/traverse": "^7.13.13",
        "@babel/types": "^7.13.14"
      }
    },
    "node_modules/@babel/helper-optimise-call-expression": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/helper-optimise-call-expression/-/helper-optimise-call-expression-7.12.13.tgz",
      "integrity": "sha512-BdWQhoVJkp6nVjB7nkFWcn43dkprYauqtk++Py2eaf/GRDFm5BxRqEIZCiHlZUGAVmtwKcsVL1dC68WmzeFmiA==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.12.13"
      }
    },
    "node_modules/@babel/helper-plugin-utils": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.13.0.tgz",
      "integrity": "sha512-ZPafIPSwzUlAoWT8DKs1W2VyF2gOWthGd5NGFMsBcMMol+ZhK+EQY/e6V96poa6PA/Bh+C9plWN0hXO1uB8AfQ==",
      "dev": true
    },
    "node_modules/@babel/helper-remap-async-to-generator": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-remap-async-to-generator/-/helper-remap-async-to-generator-7.13.0.tgz",
      "integrity": "sha512-pUQpFBE9JvC9lrQbpX0TmeNIy5s7GnZjna2lhhcHC7DzgBs6fWn722Y5cfwgrtrqc7NAJwMvOa0mKhq6XaE4jg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.12.13",
        "@babel/helper-wrap-function": "^7.13.0",
        "@babel/types": "^7.13.0"
      }
    },
    "node_modules/@babel/helper-replace-supers": {
      "version": "7.13.12",
      "resolved": "https://registry.npmjs.org/@babel/helper-replace-supers/-/helper-replace-supers-7.13.12.tgz",
      "integrity": "sha512-Gz1eiX+4yDO8mT+heB94aLVNCL+rbuT2xy4YfyNqu8F+OI6vMvJK891qGBTqL9Uc8wxEvRW92Id6G7sDen3fFw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-member-expression-to-functions": "^7.13.12",
        "@babel/helper-optimise-call-expression": "^7.12.13",
        "@babel/traverse": "^7.13.0",
        "@babel/types": "^7.13.12"
      }
    },
    "node_modules/@babel/helper-simple-access": {
      "version": "7.13.12",
      "resolved": "https://registry.npmjs.org/@babel/helper-simple-access/-/helper-simple-access-7.13.12.tgz",
      "integrity": "sha512-7FEjbrx5SL9cWvXioDbnlYTppcZGuCY6ow3/D5vMggb2Ywgu4dMrpTJX0JdQAIcRRUElOIxF3yEooa9gUb9ZbA==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.13.12"
      }
    },
    "node_modules/@babel/helper-skip-transparent-expression-wrappers": {
      "version": "7.12.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-skip-transparent-expression-wrappers/-/helper-skip-transparent-expression-wrappers-7.12.1.tgz",
      "integrity": "sha512-Mf5AUuhG1/OCChOJ/HcADmvcHM42WJockombn8ATJG3OnyiSxBK/Mm5x78BQWvmtXZKHgbjdGL2kin/HOLlZGA==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.12.1"
      }
    },
    "node_modules/@babel/helper-split-export-declaration": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/helper-split-export-declaration/-/helper-split-export-declaration-7.12.13.tgz",
      "integrity": "sha512-tCJDltF83htUtXx5NLcaDqRmknv652ZWCHyoTETf1CXYJdPC7nohZohjUgieXhv0hTJdRf2FjDueFehdNucpzg==",
      "dev": true,
      "dependencies": {
        "@babel/types": "^7.12.13"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.12.11",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.12.11.tgz",
      "integrity": "sha512-np/lG3uARFybkoHokJUmf1QfEvRVCPbmQeUQpKow5cQ3xWrV9i3rUHodKDJPQfTVX61qKi+UdYk8kik84n7XOw==",
      "dev": true
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.12.17",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.12.17.tgz",
      "integrity": "sha512-TopkMDmLzq8ngChwRlyjR6raKD6gMSae4JdYDB8bByKreQgG0RBTuKe9LRxW3wFtUnjxOPRKBDwEH6Mg5KeDfw==",
      "dev": true
    },
    "node_modules/@babel/helper-wrap-function": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-wrap-function/-/helper-wrap-function-7.13.0.tgz",
      "integrity": "sha512-1UX9F7K3BS42fI6qd2A4BjKzgGjToscyZTdp1DjknHLCIvpgne6918io+aL5LXFcER/8QWiwpoY902pVEqgTXA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-function-name": "^7.12.13",
        "@babel/template": "^7.12.13",
        "@babel/traverse": "^7.13.0",
        "@babel/types": "^7.13.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.13.10",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.13.10.tgz",
      "integrity": "sha512-4VO883+MWPDUVRF3PhiLBUFHoX/bsLTGFpFK/HqvvfBZz2D57u9XzPVNFVBTc0PW/CWR9BXTOKt8NF4DInUHcQ==",
      "dev": true,
      "dependencies": {
        "@babel/template": "^7.12.13",
        "@babel/traverse": "^7.13.0",
        "@babel/types": "^7.13.0"
      }
    },
    "node_modules/@babel/highlight": {
      "version": "7.13.10",
      "resolved": "https://registry.npmjs.org/@babel/highlight/-/highlight-7.13.10.tgz",
      "integrity": "sha512-5aPpe5XQPzflQrFwL1/QoeHkP2MsA4JCntcXHRhEsdsfPVkvPi2w7Qix4iV7t5S/oC9OodGrggd8aco1g3SZFg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.12.11",
        "chalk": "^2.0.0",
        "js-tokens": "^4.0.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.13.13",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.13.13.tgz",
      "integrity": "sha512-OhsyMrqygfk5v8HmWwOzlYjJrtLaFhF34MrfG/Z73DgYCI6ojNUTUp2TYbtnjo8PegeJp12eamsNettCQjKjVw==",
      "dev": true,
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining": {
      "version": "7.13.12",
      "resolved": "https://registry.npmjs.org/@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining/-/plugin-bugfix-v8-spread-parameters-in-optional-chaining-7.13.12.tgz",
      "integrity": "sha512-d0u3zWKcoZf379fOeJdr1a5WPDny4aOFZ6hlfKivgK0LY7ZxNfoaHL2fWwdGtHyVvra38FC+HVYkO+byfSA8AQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/helper-skip-transparent-expression-wrappers": "^7.12.1",
        "@babel/plugin-proposal-optional-chaining": "^7.13.12"
      },
      "peerDependencies": {
        "@babel/core": "^7.13.0"
      }
    },
    "node_modules/@babel/plugin-proposal-async-generator-functions": {
      "version": "7.13.8",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-async-generator-functions/-/plugin-proposal-async-generator-functions-7.13.8.tgz",
      "integrity": "sha512-rPBnhj+WgoSmgq+4gQUtXx/vOcU+UYtjy1AA/aeD61Hwj410fwYyqfUcRP3lR8ucgliVJL/G7sXcNUecC75IXA==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-async-generator-functions instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/helper-remap-async-to-generator": "^7.13.0",
        "@babel/plugin-syntax-async-generators": "^7.8.4"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-class-properties": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-class-properties/-/plugin-proposal-class-properties-7.13.0.tgz",
      "integrity": "sha512-KnTDjFNC1g+45ka0myZNvSBFLhNCLN+GeGYLDEA8Oq7MZ6yMgfLoIRh86GRT0FjtJhZw8JyUskP9uvj5pHM9Zg==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-class-properties instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-create-class-features-plugin": "^7.13.0",
        "@babel/helper-plugin-utils": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-dynamic-import": {
      "version": "7.13.8",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-dynamic-import/-/plugin-proposal-dynamic-import-7.13.8.tgz",
      "integrity": "sha512-ONWKj0H6+wIRCkZi9zSbZtE/r73uOhMVHh256ys0UzfM7I3d4n+spZNWjOnJv2gzopumP2Wxi186vI8N0Y2JyQ==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-dynamic-import instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/plugin-syntax-dynamic-import": "^7.8.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-export-namespace-from": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-export-namespace-from/-/plugin-proposal-export-namespace-from-7.12.13.tgz",
      "integrity": "sha512-INAgtFo4OnLN3Y/j0VwAgw3HDXcDtX+C/erMvWzuV9v71r7urb6iyMXu7eM9IgLr1ElLlOkaHjJ0SbCmdOQ3Iw==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-export-namespace-from instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13",
        "@babel/plugin-syntax-export-namespace-from": "^7.8.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-json-strings": {
      "version": "7.13.8",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-json-strings/-/plugin-proposal-json-strings-7.13.8.tgz",
      "integrity": "sha512-w4zOPKUFPX1mgvTmL/fcEqy34hrQ1CRcGxdphBc6snDnnqJ47EZDIyop6IwXzAC8G916hsIuXB2ZMBCExC5k7Q==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-json-strings instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/plugin-syntax-json-strings": "^7.8.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-logical-assignment-operators": {
      "version": "7.13.8",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-logical-assignment-operators/-/plugin-proposal-logical-assignment-operators-7.13.8.tgz",
      "integrity": "sha512-aul6znYB4N4HGweImqKn59Su9RS8lbUIqxtXTOcAGtNIDczoEFv+l1EhmX8rUBp3G1jMjKJm8m0jXVp63ZpS4A==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-logical-assignment-operators instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/plugin-syntax-logical-assignment-operators": "^7.10.4"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-nullish-coalescing-operator": {
      "version": "7.13.8",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-nullish-coalescing-operator/-/plugin-proposal-nullish-coalescing-operator-7.13.8.tgz",
      "integrity": "sha512-iePlDPBn//UhxExyS9KyeYU7RM9WScAG+D3Hhno0PLJebAEpDZMocbDe64eqynhNAnwz/vZoL/q/QB2T1OH39A==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-nullish-coalescing-operator instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/plugin-syntax-nullish-coalescing-operator": "^7.8.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-numeric-separator": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-numeric-separator/-/plugin-proposal-numeric-separator-7.12.13.tgz",
      "integrity": "sha512-O1jFia9R8BUCl3ZGB7eitaAPu62TXJRHn7rh+ojNERCFyqRwJMTmhz+tJ+k0CwI6CLjX/ee4qW74FSqlq9I35w==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-numeric-separator instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13",
        "@babel/plugin-syntax-numeric-separator": "^7.10.4"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-object-rest-spread": {
      "version": "7.13.8",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-object-rest-spread/-/plugin-proposal-object-rest-spread-7.13.8.tgz",
      "integrity": "sha512-DhB2EuB1Ih7S3/IRX5AFVgZ16k3EzfRbq97CxAVI1KSYcW+lexV8VZb7G7L8zuPVSdQMRn0kiBpf/Yzu9ZKH0g==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-object-rest-spread instead.",
      "dev": true,
      "dependencies": {
        "@babel/compat-data": "^7.13.8",
        "@babel/helper-compilation-targets": "^7.13.8",
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/plugin-syntax-object-rest-spread": "^7.8.3",
        "@babel/plugin-transform-parameters": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-optional-catch-binding": {
      "version": "7.13.8",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-optional-catch-binding/-/plugin-proposal-optional-catch-binding-7.13.8.tgz",
      "integrity": "sha512-0wS/4DUF1CuTmGo+NiaHfHcVSeSLj5S3e6RivPTg/2k3wOv3jO35tZ6/ZWsQhQMvdgI7CwphjQa/ccarLymHVA==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-optional-catch-binding instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/plugin-syntax-optional-catch-binding": "^7.8.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-optional-chaining": {
      "version": "7.13.12",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-optional-chaining/-/plugin-proposal-optional-chaining-7.13.12.tgz",
      "integrity": "sha512-fcEdKOkIB7Tf4IxrgEVeFC4zeJSTr78no9wTdBuZZbqF64kzllU0ybo2zrzm7gUQfxGhBgq4E39oRs8Zx/RMYQ==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-optional-chaining instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/helper-skip-transparent-expression-wrappers": "^7.12.1",
        "@babel/plugin-syntax-optional-chaining": "^7.8.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-private-methods": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-private-methods/-/plugin-proposal-private-methods-7.13.0.tgz",
      "integrity": "sha512-MXyyKQd9inhx1kDYPkFRVOBXQ20ES8Pto3T7UZ92xj2mY0EVD8oAVzeyYuVfy/mxAdTSIayOvg+aVzcHV2bn6Q==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-private-methods instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-create-class-features-plugin": "^7.13.0",
        "@babel/helper-plugin-utils": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-proposal-unicode-property-regex": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-proposal-unicode-property-regex/-/plugin-proposal-unicode-property-regex-7.12.13.tgz",
      "integrity": "sha512-XyJmZidNfofEkqFV5VC/bLabGmO5QzenPO/YOfGuEbgU+2sSwMmio3YLb4WtBgcmmdwZHyVyv8on77IUjQ5Gvg==",
      "deprecated": "This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-unicode-property-regex instead.",
      "dev": true,
      "dependencies": {
        "@babel/helper-create-regexp-features-plugin": "^7.12.13",
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-async-generators": {
      "version": "7.8.4",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-async-generators/-/plugin-syntax-async-generators-7.8.4.tgz",
      "integrity": "sha512-tycmZxkGfZaxhMRbXlPXuVFpdWlXpir2W4AMhSJgRKzk/eDlIXOhb2LHWoLpDF7TEHylV5zNhykX6KAgHJmTNw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-class-properties": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-class-properties/-/plugin-syntax-class-properties-7.12.13.tgz",
      "integrity": "sha512-fm4idjKla0YahUNgFNLCB0qySdsoPiZP3iQE3rky0mBUtMZ23yDJ9SJdg6dXTSDnulOVqiF3Hgr9nbXvXTQZYA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-dynamic-import": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-dynamic-import/-/plugin-syntax-dynamic-import-7.8.3.tgz",
      "integrity": "sha512-5gdGbFon+PszYzqs83S3E5mpi7/y/8M9eC90MRTZfduQOYW76ig6SOSPNe41IG5LoP3FGBn2N0RjVDSQiS94kQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-export-namespace-from": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-export-namespace-from/-/plugin-syntax-export-namespace-from-7.8.3.tgz",
      "integrity": "sha512-MXf5laXo6c1IbEbegDmzGPwGNTsHZmEy6QGznu5Sh2UCWvueywb2ee+CCE4zQiZstxU9BMoQO9i6zUFSY0Kj0Q==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-json-strings": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-json-strings/-/plugin-syntax-json-strings-7.8.3.tgz",
      "integrity": "sha512-lY6kdGpWHvjoe2vk4WrAapEuBR69EMxZl+RoGRhrFGNYVK8mOPAW8VfbT/ZgrFbXlDNiiaxQnAtgVCZ6jv30EA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-logical-assignment-operators": {
      "version": "7.10.4",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-logical-assignment-operators/-/plugin-syntax-logical-assignment-operators-7.10.4.tgz",
      "integrity": "sha512-d8waShlpFDinQ5MtvGU9xDAOzKH47+FFoney2baFIoMr952hKOLp1HR7VszoZvOsV/4+RRszNY7D17ba0te0ig==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.10.4"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-nullish-coalescing-operator": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-nullish-coalescing-operator/-/plugin-syntax-nullish-coalescing-operator-7.8.3.tgz",
      "integrity": "sha512-aSff4zPII1u2QD7y+F8oDsz19ew4IGEJg9SVW+bqwpwtfFleiQDMdzA/R+UlWDzfnHFCxxleFT0PMIrR36XLNQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-numeric-separator": {
      "version": "7.10.4",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-numeric-separator/-/plugin-syntax-numeric-separator-7.10.4.tgz",
      "integrity": "sha512-9H6YdfkcK/uOnY/K7/aA2xpzaAgkQn37yzWUMRK7OaPOqOpGS1+n0H5hxT9AUw9EsSjPW8SVyMJwYRtWs3X3ug==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.10.4"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-object-rest-spread": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-object-rest-spread/-/plugin-syntax-object-rest-spread-7.8.3.tgz",
      "integrity": "sha512-XoqMijGZb9y3y2XskN+P1wUGiVwWZ5JmoDRwx5+3GmEplNyVM2s2Dg8ILFQm8rWM48orGy5YpI5Bl8U1y7ydlA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-optional-catch-binding": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-optional-catch-binding/-/plugin-syntax-optional-catch-binding-7.8.3.tgz",
      "integrity": "sha512-6VPD0Pc1lpTqw0aKoeRTMiB+kWhAoT24PA+ksWSBrFtl5SIRVpZlwN3NNPQjehA2E/91FV3RjLWoVTglWcSV3Q==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-optional-chaining": {
      "version": "7.8.3",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-optional-chaining/-/plugin-syntax-optional-chaining-7.8.3.tgz",
      "integrity": "sha512-KoK9ErH1MBlCPxV0VANkXW2/dw4vlbGDrFgz8bmUsBGYkFRcbRwMh6cIJubdPrkxRwuGdtCk0v/wPTKbQgBjkg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.8.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-syntax-top-level-await": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-top-level-await/-/plugin-syntax-top-level-await-7.12.13.tgz",
      "integrity": "sha512-A81F9pDwyS7yM//KwbCSDqy3Uj4NMIurtplxphWxoYtNPov7cJsDkAFNNyVlIZ3jwGycVsurZ+LtOA8gZ376iQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-arrow-functions": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-arrow-functions/-/plugin-transform-arrow-functions-7.13.0.tgz",
      "integrity": "sha512-96lgJagobeVmazXFaDrbmCLQxBysKu7U6Do3mLsx27gf5Dk85ezysrs2BZUpXD703U/Su1xTBDxxar2oa4jAGg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-async-to-generator": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-async-to-generator/-/plugin-transform-async-to-generator-7.13.0.tgz",
      "integrity": "sha512-3j6E004Dx0K3eGmhxVJxwwI89CTJrce7lg3UrtFuDAVQ/2+SJ/h/aSFOeE6/n0WB1GsOffsJp6MnPQNQ8nmwhg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-module-imports": "^7.12.13",
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/helper-remap-async-to-generator": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-block-scoped-functions": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-block-scoped-functions/-/plugin-transform-block-scoped-functions-7.12.13.tgz",
      "integrity": "sha512-zNyFqbc3kI/fVpqwfqkg6RvBgFpC4J18aKKMmv7KdQ/1GgREapSJAykLMVNwfRGO3BtHj3YQZl8kxCXPcVMVeg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-block-scoping": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-block-scoping/-/plugin-transform-block-scoping-7.12.13.tgz",
      "integrity": "sha512-Pxwe0iqWJX4fOOM2kEZeUuAxHMWb9nK+9oh5d11bsLoB0xMg+mkDpt0eYuDZB7ETrY9bbcVlKUGTOGWy7BHsMQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-classes": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-classes/-/plugin-transform-classes-7.13.0.tgz",
      "integrity": "sha512-9BtHCPUARyVH1oXGcSJD3YpsqRLROJx5ZNP6tN5vnk17N0SVf9WCtf8Nuh1CFmgByKKAIMstitKduoCmsaDK5g==",
      "dev": true,
      "dependencies": {
        "@babel/helper-annotate-as-pure": "^7.12.13",
        "@babel/helper-function-name": "^7.12.13",
        "@babel/helper-optimise-call-expression": "^7.12.13",
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/helper-replace-supers": "^7.13.0",
        "@babel/helper-split-export-declaration": "^7.12.13",
        "globals": "^11.1.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-computed-properties": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-computed-properties/-/plugin-transform-computed-properties-7.13.0.tgz",
      "integrity": "sha512-RRqTYTeZkZAz8WbieLTvKUEUxZlUTdmL5KGMyZj7FnMfLNKV4+r5549aORG/mgojRmFlQMJDUupwAMiF2Q7OUg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-destructuring": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-destructuring/-/plugin-transform-destructuring-7.13.0.tgz",
      "integrity": "sha512-zym5em7tePoNT9s964c0/KU3JPPnuq7VhIxPRefJ4/s82cD+q1mgKfuGRDMCPL0HTyKz4dISuQlCusfgCJ86HA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-dotall-regex": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-dotall-regex/-/plugin-transform-dotall-regex-7.12.13.tgz",
      "integrity": "sha512-foDrozE65ZFdUC2OfgeOCrEPTxdB3yjqxpXh8CH+ipd9CHd4s/iq81kcUpyH8ACGNEPdFqbtzfgzbT/ZGlbDeQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-create-regexp-features-plugin": "^7.12.13",
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-duplicate-keys": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-duplicate-keys/-/plugin-transform-duplicate-keys-7.12.13.tgz",
      "integrity": "sha512-NfADJiiHdhLBW3pulJlJI2NB0t4cci4WTZ8FtdIuNc2+8pslXdPtRRAEWqUY+m9kNOk2eRYbTAOipAxlrOcwwQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-exponentiation-operator": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-exponentiation-operator/-/plugin-transform-exponentiation-operator-7.12.13.tgz",
      "integrity": "sha512-fbUelkM1apvqez/yYx1/oICVnGo2KM5s63mhGylrmXUxK/IAXSIf87QIxVfZldWf4QsOafY6vV3bX8aMHSvNrA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-builder-binary-assignment-operator-visitor": "^7.12.13",
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-for-of": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-for-of/-/plugin-transform-for-of-7.13.0.tgz",
      "integrity": "sha512-IHKT00mwUVYE0zzbkDgNRP6SRzvfGCYsOxIRz8KsiaaHCcT9BWIkO+H9QRJseHBLOGBZkHUdHiqj6r0POsdytg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-function-name": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-function-name/-/plugin-transform-function-name-7.12.13.tgz",
      "integrity": "sha512-6K7gZycG0cmIwwF7uMK/ZqeCikCGVBdyP2J5SKNCXO5EOHcqi+z7Jwf8AmyDNcBgxET8DrEtCt/mPKPyAzXyqQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-function-name": "^7.12.13",
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-literals": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-literals/-/plugin-transform-literals-7.12.13.tgz",
      "integrity": "sha512-FW+WPjSR7hiUxMcKqyNjP05tQ2kmBCdpEpZHY1ARm96tGQCCBvXKnpjILtDplUnJ/eHZ0lALLM+d2lMFSpYJrQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-member-expression-literals": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-member-expression-literals/-/plugin-transform-member-expression-literals-7.12.13.tgz",
      "integrity": "sha512-kxLkOsg8yir4YeEPHLuO2tXP9R/gTjpuTOjshqSpELUN3ZAg2jfDnKUvzzJxObun38sw3wm4Uu69sX/zA7iRvg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-modules-amd": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-amd/-/plugin-transform-modules-amd-7.13.0.tgz",
      "integrity": "sha512-EKy/E2NHhY/6Vw5d1k3rgoobftcNUmp9fGjb9XZwQLtTctsRBOTRO7RHHxfIky1ogMN5BxN7p9uMA3SzPfotMQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-module-transforms": "^7.13.0",
        "@babel/helper-plugin-utils": "^7.13.0",
        "babel-plugin-dynamic-import-node": "^2.3.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-modules-commonjs": {
      "version": "7.13.8",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-commonjs/-/plugin-transform-modules-commonjs-7.13.8.tgz",
      "integrity": "sha512-9QiOx4MEGglfYZ4XOnU79OHr6vIWUakIj9b4mioN8eQIoEh+pf5p/zEB36JpDFWA12nNMiRf7bfoRvl9Rn79Bw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-module-transforms": "^7.13.0",
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/helper-simple-access": "^7.12.13",
        "babel-plugin-dynamic-import-node": "^2.3.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-modules-systemjs": {
      "version": "7.13.8",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-systemjs/-/plugin-transform-modules-systemjs-7.13.8.tgz",
      "integrity": "sha512-hwqctPYjhM6cWvVIlOIe27jCIBgHCsdH2xCJVAYQm7V5yTMoilbVMi9f6wKg0rpQAOn6ZG4AOyvCqFF/hUh6+A==",
      "dev": true,
      "dependencies": {
        "@babel/helper-hoist-variables": "^7.13.0",
        "@babel/helper-module-transforms": "^7.13.0",
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/helper-validator-identifier": "^7.12.11",
        "babel-plugin-dynamic-import-node": "^2.3.3"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-modules-umd": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-modules-umd/-/plugin-transform-modules-umd-7.13.0.tgz",
      "integrity": "sha512-D/ILzAh6uyvkWjKKyFE/W0FzWwasv6vPTSqPcjxFqn6QpX3u8DjRVliq4F2BamO2Wee/om06Vyy+vPkNrd4wxw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-module-transforms": "^7.13.0",
        "@babel/helper-plugin-utils": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-named-capturing-groups-regex": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-named-capturing-groups-regex/-/plugin-transform-named-capturing-groups-regex-7.12.13.tgz",
      "integrity": "sha512-Xsm8P2hr5hAxyYblrfACXpQKdQbx4m2df9/ZZSQ8MAhsadw06+jW7s9zsSw6he+mJZXRlVMyEnVktJo4zjk1WA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-create-regexp-features-plugin": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/plugin-transform-new-target": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-new-target/-/plugin-transform-new-target-7.12.13.tgz",
      "integrity": "sha512-/KY2hbLxrG5GTQ9zzZSc3xWiOy379pIETEhbtzwZcw9rvuaVV4Fqy7BYGYOWZnaoXIQYbbJ0ziXLa/sKcGCYEQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-object-super": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-object-super/-/plugin-transform-object-super-7.12.13.tgz",
      "integrity": "sha512-JzYIcj3XtYspZDV8j9ulnoMPZZnF/Cj0LUxPOjR89BdBVx+zYJI9MdMIlUZjbXDX+6YVeS6I3e8op+qQ3BYBoQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13",
        "@babel/helper-replace-supers": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-parameters": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-parameters/-/plugin-transform-parameters-7.13.0.tgz",
      "integrity": "sha512-Jt8k/h/mIwE2JFEOb3lURoY5C85ETcYPnbuAJ96zRBzh1XHtQZfs62ChZ6EP22QlC8c7Xqr9q+e1SU5qttwwjw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-property-literals": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-property-literals/-/plugin-transform-property-literals-7.12.13.tgz",
      "integrity": "sha512-nqVigwVan+lR+g8Fj8Exl0UQX2kymtjcWfMOYM1vTYEKujeyv2SkMgazf2qNcK7l4SDiKyTA/nHCPqL4e2zo1A==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-regenerator": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-regenerator/-/plugin-transform-regenerator-7.12.13.tgz",
      "integrity": "sha512-lxb2ZAvSLyJ2PEe47hoGWPmW22v7CtSl9jW8mingV4H2sEX/JOcrAj2nPuGWi56ERUm2bUpjKzONAuT6HCn2EA==",
      "dev": true,
      "dependencies": {
        "regenerator-transform": "^0.14.2"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-reserved-words": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-reserved-words/-/plugin-transform-reserved-words-7.12.13.tgz",
      "integrity": "sha512-xhUPzDXxZN1QfiOy/I5tyye+TRz6lA7z6xaT4CLOjPRMVg1ldRf0LHw0TDBpYL4vG78556WuHdyO9oi5UmzZBg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-shorthand-properties": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-shorthand-properties/-/plugin-transform-shorthand-properties-7.12.13.tgz",
      "integrity": "sha512-xpL49pqPnLtf0tVluuqvzWIgLEhuPpZzvs2yabUHSKRNlN7ScYU7aMlmavOeyXJZKgZKQRBlh8rHbKiJDraTSw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-spread": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-spread/-/plugin-transform-spread-7.13.0.tgz",
      "integrity": "sha512-V6vkiXijjzYeFmQTr3dBxPtZYLPcUfY34DebOU27jIl2M/Y8Egm52Hw82CSjjPqd54GTlJs5x+CR7HeNr24ckg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/helper-skip-transparent-expression-wrappers": "^7.12.1"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-sticky-regex": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-sticky-regex/-/plugin-transform-sticky-regex-7.12.13.tgz",
      "integrity": "sha512-Jc3JSaaWT8+fr7GRvQP02fKDsYk4K/lYwWq38r/UGfaxo89ajud321NH28KRQ7xy1Ybc0VUE5Pz8psjNNDUglg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-template-literals": {
      "version": "7.13.0",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-template-literals/-/plugin-transform-template-literals-7.13.0.tgz",
      "integrity": "sha512-d67umW6nlfmr1iehCcBv69eSUSySk1EsIS8aTDX4Xo9qajAh6mYtcl4kJrBkGXuxZPEgVr7RVfAvNW6YQkd4Mw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.13.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-typeof-symbol": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-typeof-symbol/-/plugin-transform-typeof-symbol-7.12.13.tgz",
      "integrity": "sha512-eKv/LmUJpMnu4npgfvs3LiHhJua5fo/CysENxa45YCQXZwKnGCQKAg87bvoqSW1fFT+HA32l03Qxsm8ouTY3ZQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-unicode-escapes": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-unicode-escapes/-/plugin-transform-unicode-escapes-7.12.13.tgz",
      "integrity": "sha512-0bHEkdwJ/sN/ikBHfSmOXPypN/beiGqjo+o4/5K+vxEFNPRPdImhviPakMKG4x96l85emoa0Z6cDflsdBusZbw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-unicode-regex": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-unicode-regex/-/plugin-transform-unicode-regex-7.12.13.tgz",
      "integrity": "sha512-mDRzSNY7/zopwisPZ5kM9XKCfhchqIYwAKRERtEnhYscZB79VRekuRSoYbN0+KVe3y8+q1h6A4svXtP7N+UoCA==",
      "dev": true,
      "dependencies": {
        "@babel/helper-create-regexp-features-plugin": "^7.12.13",
        "@babel/helper-plugin-utils": "^7.12.13"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/preset-env": {
      "version": "7.13.12",
      "resolved": "https://registry.npmjs.org/@babel/preset-env/-/preset-env-7.13.12.tgz",
      "integrity": "sha512-JzElc6jk3Ko6zuZgBtjOd01pf9yYDEIH8BcqVuYIuOkzOwDesoa/Nz4gIo4lBG6K861KTV9TvIgmFuT6ytOaAA==",
      "dev": true,
      "dependencies": {
        "@babel/compat-data": "^7.13.12",
        "@babel/helper-compilation-targets": "^7.13.10",
        "@babel/helper-plugin-utils": "^7.13.0",
        "@babel/helper-validator-option": "^7.12.17",
        "@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining": "^7.13.12",
        "@babel/plugin-proposal-async-generator-functions": "^7.13.8",
        "@babel/plugin-proposal-class-properties": "^7.13.0",
        "@babel/plugin-proposal-dynamic-import": "^7.13.8",
        "@babel/plugin-proposal-export-namespace-from": "^7.12.13",
        "@babel/plugin-proposal-json-strings": "^7.13.8",
        "@babel/plugin-proposal-logical-assignment-operators": "^7.13.8",
        "@babel/plugin-proposal-nullish-coalescing-operator": "^7.13.8",
        "@babel/plugin-proposal-numeric-separator": "^7.12.13",
        "@babel/plugin-proposal-object-rest-spread": "^7.13.8",
        "@babel/plugin-proposal-optional-catch-binding": "^7.13.8",
        "@babel/plugin-proposal-optional-chaining": "^7.13.12",
        "@babel/plugin-proposal-private-methods": "^7.13.0",
        "@babel/plugin-proposal-unicode-property-regex": "^7.12.13",
        "@babel/plugin-syntax-async-generators": "^7.8.4",
        "@babel/plugin-syntax-class-properties": "^7.12.13",
        "@babel/plugin-syntax-dynamic-import": "^7.8.3",
        "@babel/plugin-syntax-export-namespace-from": "^7.8.3",
        "@babel/plugin-syntax-json-strings": "^7.8.3",
        "@babel/plugin-syntax-logical-assignment-operators": "^7.10.4",
        "@babel/plugin-syntax-nullish-coalescing-operator": "^7.8.3",
        "@babel/plugin-syntax-numeric-separator": "^7.10.4",
        "@babel/plugin-syntax-object-rest-spread": "^7.8.3",
        "@babel/plugin-syntax-optional-catch-binding": "^7.8.3",
        "@babel/plugin-syntax-optional-chaining": "^7.8.3",
        "@babel/plugin-syntax-top-level-await": "^7.12.13",
        "@babel/plugin-transform-arrow-functions": "^7.13.0",
        "@babel/plugin-transform-async-to-generator": "^7.13.0",
        "@babel/plugin-transform-block-scoped-functions": "^7.12.13",
        "@babel/plugin-transform-block-scoping": "^7.12.13",
        "@babel/plugin-transform-classes": "^7.13.0",
        "@babel/plugin-transform-computed-properties": "^7.13.0",
        "@babel/plugin-transform-destructuring": "^7.13.0",
        "@babel/plugin-transform-dotall-regex": "^7.12.13",
        "@babel/plugin-transform-duplicate-keys": "^7.12.13",
        "@babel/plugin-transform-exponentiation-operator": "^7.12.13",
        "@babel/plugin-transform-for-of": "^7.13.0",
        "@babel/plugin-transform-function-name": "^7.12.13",
        "@babel/plugin-transform-literals": "^7.12.13",
        "@babel/plugin-transform-member-expression-literals": "^7.12.13",
        "@babel/plugin-transform-modules-amd": "^7.13.0",
        "@babel/plugin-transform-modules-commonjs": "^7.13.8",
        "@babel/plugin-transform-modules-systemjs": "^7.13.8",
        "@babel/plugin-transform-modules-umd": "^7.13.0",
        "@babel/plugin-transform-named-capturing-groups-regex": "^7.12.13",
        "@babel/plugin-transform-new-target": "^7.12.13",
        "@babel/plugin-transform-object-super": "^7.12.13",
        "@babel/plugin-transform-parameters": "^7.13.0",
        "@babel/plugin-transform-property-literals": "^7.12.13",
        "@babel/plugin-transform-regenerator": "^7.12.13",
        "@babel/plugin-transform-reserved-words": "^7.12.13",
        "@babel/plugin-transform-shorthand-properties": "^7.12.13",
        "@babel/plugin-transform-spread": "^7.13.0",
        "@babel/plugin-transform-sticky-regex": "^7.12.13",
        "@babel/plugin-transform-template-literals": "^7.13.0",
        "@babel/plugin-transform-typeof-symbol": "^7.12.13",
        "@babel/plugin-transform-unicode-escapes": "^7.12.13",
        "@babel/plugin-transform-unicode-regex": "^7.12.13",
        "@babel/preset-modules": "^0.1.4",
        "@babel/types": "^7.13.12",
        "babel-plugin-polyfill-corejs2": "^0.1.4",
        "babel-plugin-polyfill-corejs3": "^0.1.3",
        "babel-plugin-polyfill-regenerator": "^0.1.2",
        "core-js-compat": "^3.9.0",
        "semver": "^6.3.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/preset-modules": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/@babel/preset-modules/-/preset-modules-0.1.4.tgz",
      "integrity": "sha512-J36NhwnfdzpmH41M1DrnkkgAqhZaqr/NBdPfQ677mLzlaXo+oDiv1deyCDtgAhz8p328otdob0Du7+xgHGZbKg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.0.0",
        "@babel/plugin-proposal-unicode-property-regex": "^7.4.4",
        "@babel/plugin-transform-dotall-regex": "^7.4.4",
        "@babel/types": "^7.4.4",
        "esutils": "^2.0.2"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.13.10",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.13.10.tgz",
      "integrity": "sha512-4QPkjJq6Ns3V/RgpEahRk+AGfL0eO6RHHtTWoNNr5mO49G6B5+X6d6THgWEAvTrznU5xYpbAlVKRYcsCgh/Akw==",
      "dev": true,
      "dependencies": {
        "regenerator-runtime": "^0.13.4"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.12.13",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.12.13.tgz",
      "integrity": "sha512-/7xxiGA57xMo/P2GVvdEumr8ONhFOhfgq2ihK3h1e6THqzTAkHbkXgB0xI9yeTfIUoH3+oAeHhqm/I43OTbbjA==",
      "dev": true,
      "dependencies": {
        "@babel/code-frame": "^7.12.13",
        "@babel/parser": "^7.12.13",
        "@babel/types": "^7.12.13"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.13.13",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.13.13.tgz",
      "integrity": "sha512-CblEcwmXKR6eP43oQGG++0QMTtCjAsa3frUuzHoiIJWpaIIi8dwMyEFUJoXRLxagGqCK+jALRwIO+o3R9p/uUg==",
      "dev": true,
      "dependencies": {
        "@babel/code-frame": "^7.12.13",
        "@babel/generator": "^7.13.9",
        "@babel/helper-function-name": "^7.12.13",
        "@babel/helper-split-export-declaration": "^7.12.13",
        "@babel/parser": "^7.13.13",
        "@babel/types": "^7.13.13",
        "debug": "^4.1.0",
        "globals": "^11.1.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.13.14",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.13.14.tgz",
      "integrity": "sha512-A2aa3QTkWoyqsZZFl56MLUsfmh7O0gN41IPvXAE/++8ojpbz12SszD7JEGYVdn4f9Kt4amIei07swF1h4AqmmQ==",
      "dev": true,
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.12.11",
        "lodash": "^4.17.19",
        "to-fast-properties": "^2.0.0"
      }
    },
    "node_modules/@discoveryjs/json-ext": {
      "version": "0.5.2",
      "resolved": "https://registry.npmjs.org/@discoveryjs/json-ext/-/json-ext-0.5.2.tgz",
      "integrity": "sha512-HyYEUDeIj5rRQU2Hk5HTB2uHsbRQpF70nvMhVzi+VJR0X+xNEhjPui4/kBf3VeH/wqD28PT4sVOm8qqLjBrSZg==",
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/@types/ammo.js": {
      "version": "1.0.3",
      "resolved": "https://codeload.github.com/osman-turan/ammo.js-typings/tar.gz/4270a20c9f992969ffbd3e989aaa0efbe10fd5c4",
      "integrity": "sha512-cdnG5dDRDifgBrpOAfS4a9y3DAET/tQkMH/AkEyoIdfUpLOGvBTk3ohRADv8LXasNCI14BfbN6scyw5D0oyxnQ=="
    },
    "node_modules/@types/anymatch": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/@types/anymatch/-/anymatch-1.3.1.tgz",
      "integrity": "sha512-/+CRPXpBDpo2RK9C68N3b2cOvO0Cf5B9aPijHsoDQTHivnGSObdOF2BRQOYjojWTDy6nQvMjmqRXIxH55VjxxA==",
      "dev": true
    },
    "node_modules/@types/eslint": {
      "version": "7.2.8",
      "resolved": "https://registry.npmjs.org/@types/eslint/-/eslint-7.2.8.tgz",
      "integrity": "sha512-RTKvBsfz0T8CKOGZMfuluDNyMFHnu5lvNr4hWEsQeHXH6FcmIDIozOyWMh36nLGMwVd5UFNXC2xztA8lln22MQ==",
      "dependencies": {
        "@types/estree": "*",
        "@types/json-schema": "*"
      }
    },
    "node_modules/@types/eslint-scope": {
      "version": "3.7.0",
      "resolved": "https://registry.npmjs.org/@types/eslint-scope/-/eslint-scope-3.7.0.tgz",
      "integrity": "sha512-O/ql2+rrCUe2W2rs7wMR+GqPRcgB6UiqN5RhrR5xruFlY7l9YLMn0ZkDzjoHLeiFkR8MCQZVudUuuvQ2BLC9Qw==",
      "dependencies": {
        "@types/eslint": "*",
        "@types/estree": "*"
      }
    },
    "node_modules/@types/estree": {
      "version": "0.0.46",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-0.0.46.tgz",
      "integrity": "sha512-laIjwTQaD+5DukBZaygQ79K1Z0jb1bPEMRrkXSLjtCcZm+abyp5YbrqpSLzD42FwWW6gK/aS4NYpJ804nG2brg=="
    },
    "node_modules/@types/glob": {
      "version": "7.1.3",
      "resolved": "https://registry.npmjs.org/@types/glob/-/glob-7.1.3.tgz",
      "integrity": "sha512-SEYeGAIQIQX8NN6LDKprLjbrd5dARM5EXsd8GI/A5l0apYI1fGMWgPHSe4ZKL4eozlAyI+doUE9XbYS4xCkQ1w==",
      "dev": true,
      "dependencies": {
        "@types/minimatch": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/html-minifier-terser": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/@types/html-minifier-terser/-/html-minifier-terser-5.1.1.tgz",
      "integrity": "sha512-giAlZwstKbmvMk1OO7WXSj4OZ0keXAcl2TQq4LWHiiPH2ByaH7WeUzng+Qej8UPxxv+8lRTuouo0iaNDBuzIBA==",
      "dev": true
    },
    "node_modules/@types/json-schema": {
      "version": "7.0.7",
      "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.7.tgz",
      "integrity": "sha512-cxWFQVseBm6O9Gbw1IWb8r6OS4OhSt3hPZLkFApLjM8TEXROBuQGLAH2i2gZpcXdLBIrpXuTDhH7Vbm1iXmNGA=="
    },
    "node_modules/@types/minimatch": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/minimatch/-/minimatch-3.0.4.tgz",
      "integrity": "sha512-1z8k4wzFnNjVK/tlxvrWuK5WMt6mydWWP7+zvH5eFep4oj+UkrfiJTRtjCeBXNpwaA/FYqqtb4/QS4ianFpIRA==",
      "dev": true
    },
    "node_modules/@types/node": {
      "version": "14.14.37",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-14.14.37.tgz",
      "integrity": "sha512-XYmBiy+ohOR4Lh5jE379fV2IU+6Jn4g5qASinhitfyO71b/sCo6MKsMLF5tc7Zf2CE8hViVQyYSobJNke8OvUw=="
    },
    "node_modules/@types/source-list-map": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/@types/source-list-map/-/source-list-map-0.1.2.tgz",
      "integrity": "sha512-K5K+yml8LTo9bWJI/rECfIPrGgxdpeNbj+d53lwN4QjW1MCwlkhUms+gtdzigTeUyBr09+u8BwOIY3MXvHdcsA==",
      "dev": true
    },
    "node_modules/@types/tapable": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/@types/tapable/-/tapable-1.0.7.tgz",
      "integrity": "sha512-0VBprVqfgFD7Ehb2vd8Lh9TG3jP98gvr8rgehQqzztZNI7o8zS8Ad4jyZneKELphpuE212D8J70LnSNQSyO6bQ==",
      "dev": true
    },
    "node_modules/@types/uglify-js": {
      "version": "3.13.0",
      "resolved": "https://registry.npmjs.org/@types/uglify-js/-/uglify-js-3.13.0.tgz",
      "integrity": "sha512-EGkrJD5Uy+Pg0NUR8uA4bJ5WMfljyad0G+784vLCNUkD+QwOJXUbBYExXfVGf7YtyzdQp3L/XMYcliB987kL5Q==",
      "dev": true,
      "dependencies": {
        "source-map": "^0.6.1"
      }
    },
    "node_modules/@types/uglify-js/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/@types/webpack": {
      "version": "4.41.27",
      "resolved": "https://registry.npmjs.org/@types/webpack/-/webpack-4.41.27.tgz",
      "integrity": "sha512-wK/oi5gcHi72VMTbOaQ70VcDxSQ1uX8S2tukBK9ARuGXrYM/+u4ou73roc7trXDNmCxCoerE8zruQqX/wuHszA==",
      "dev": true,
      "dependencies": {
        "@types/anymatch": "*",
        "@types/node": "*",
        "@types/tapable": "^1",
        "@types/uglify-js": "*",
        "@types/webpack-sources": "*",
        "source-map": "^0.6.0"
      }
    },
    "node_modules/@types/webpack-sources": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@types/webpack-sources/-/webpack-sources-2.1.0.tgz",
      "integrity": "sha512-LXn/oYIpBeucgP1EIJbKQ2/4ZmpvRl+dlrFdX7+94SKRUV3Evy3FsfMZY318vGhkWUS5MPhtOM3w1/hCOAOXcg==",
      "dev": true,
      "dependencies": {
        "@types/node": "*",
        "@types/source-list-map": "*",
        "source-map": "^0.7.3"
      }
    },
    "node_modules/@types/webpack-sources/node_modules/source-map": {
      "version": "0.7.3",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.7.3.tgz",
      "integrity": "sha512-CkCj6giN3S+n9qrYiBTX5gystlENnRW5jZeNLHpe6aue+SrHcG5VYwujhW9s4dY31mEGsxBDrHR6oI69fTXsaQ==",
      "dev": true,
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@types/webpack/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/@webassemblyjs/ast": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/ast/-/ast-1.11.0.tgz",
      "integrity": "sha512-kX2W49LWsbthrmIRMbQZuQDhGtjyqXfEmmHyEi4XWnSZtPmxY0+3anPIzsnRb45VH/J55zlOfWvZuY47aJZTJg==",
      "dependencies": {
        "@webassemblyjs/helper-numbers": "1.11.0",
        "@webassemblyjs/helper-wasm-bytecode": "1.11.0"
      }
    },
    "node_modules/@webassemblyjs/floating-point-hex-parser": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/floating-point-hex-parser/-/floating-point-hex-parser-1.11.0.tgz",
      "integrity": "sha512-Q/aVYs/VnPDVYvsCBL/gSgwmfjeCb4LW8+TMrO3cSzJImgv8lxxEPM2JA5jMrivE7LSz3V+PFqtMbls3m1exDA=="
    },
    "node_modules/@webassemblyjs/helper-api-error": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/helper-api-error/-/helper-api-error-1.11.0.tgz",
      "integrity": "sha512-baT/va95eXiXb2QflSx95QGT5ClzWpGaa8L7JnJbgzoYeaA27FCvuBXU758l+KXWRndEmUXjP0Q5fibhavIn8w=="
    },
    "node_modules/@webassemblyjs/helper-buffer": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/helper-buffer/-/helper-buffer-1.11.0.tgz",
      "integrity": "sha512-u9HPBEl4DS+vA8qLQdEQ6N/eJQ7gT7aNvMIo8AAWvAl/xMrcOSiI2M0MAnMCy3jIFke7bEee/JwdX1nUpCtdyA=="
    },
    "node_modules/@webassemblyjs/helper-numbers": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/helper-numbers/-/helper-numbers-1.11.0.tgz",
      "integrity": "sha512-DhRQKelIj01s5IgdsOJMKLppI+4zpmcMQ3XboFPLwCpSNH6Hqo1ritgHgD0nqHeSYqofA6aBN/NmXuGjM1jEfQ==",
      "dependencies": {
        "@webassemblyjs/floating-point-hex-parser": "1.11.0",
        "@webassemblyjs/helper-api-error": "1.11.0",
        "@xtuc/long": "4.2.2"
      }
    },
    "node_modules/@webassemblyjs/helper-wasm-bytecode": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/helper-wasm-bytecode/-/helper-wasm-bytecode-1.11.0.tgz",
      "integrity": "sha512-MbmhvxXExm542tWREgSFnOVo07fDpsBJg3sIl6fSp9xuu75eGz5lz31q7wTLffwL3Za7XNRCMZy210+tnsUSEA=="
    },
    "node_modules/@webassemblyjs/helper-wasm-section": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/helper-wasm-section/-/helper-wasm-section-1.11.0.tgz",
      "integrity": "sha512-3Eb88hcbfY/FCukrg6i3EH8H2UsD7x8Vy47iVJrP967A9JGqgBVL9aH71SETPx1JrGsOUVLo0c7vMCN22ytJew==",
      "dependencies": {
        "@webassemblyjs/ast": "1.11.0",
        "@webassemblyjs/helper-buffer": "1.11.0",
        "@webassemblyjs/helper-wasm-bytecode": "1.11.0",
        "@webassemblyjs/wasm-gen": "1.11.0"
      }
    },
    "node_modules/@webassemblyjs/ieee754": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/ieee754/-/ieee754-1.11.0.tgz",
      "integrity": "sha512-KXzOqpcYQwAfeQ6WbF6HXo+0udBNmw0iXDmEK5sFlmQdmND+tr773Ti8/5T/M6Tl/413ArSJErATd8In3B+WBA==",
      "dependencies": {
        "@xtuc/ieee754": "^1.2.0"
      }
    },
    "node_modules/@webassemblyjs/leb128": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/leb128/-/leb128-1.11.0.tgz",
      "integrity": "sha512-aqbsHa1mSQAbeeNcl38un6qVY++hh8OpCOzxhixSYgbRfNWcxJNJQwe2rezK9XEcssJbbWIkblaJRwGMS9zp+g==",
      "dependencies": {
        "@xtuc/long": "4.2.2"
      }
    },
    "node_modules/@webassemblyjs/utf8": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/utf8/-/utf8-1.11.0.tgz",
      "integrity": "sha512-A/lclGxH6SpSLSyFowMzO/+aDEPU4hvEiooCMXQPcQFPPJaYcPQNKGOCLUySJsYJ4trbpr+Fs08n4jelkVTGVw=="
    },
    "node_modules/@webassemblyjs/wasm-edit": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/wasm-edit/-/wasm-edit-1.11.0.tgz",
      "integrity": "sha512-JHQ0damXy0G6J9ucyKVXO2j08JVJ2ntkdJlq1UTiUrIgfGMmA7Ik5VdC/L8hBK46kVJgujkBIoMtT8yVr+yVOQ==",
      "dependencies": {
        "@webassemblyjs/ast": "1.11.0",
        "@webassemblyjs/helper-buffer": "1.11.0",
        "@webassemblyjs/helper-wasm-bytecode": "1.11.0",
        "@webassemblyjs/helper-wasm-section": "1.11.0",
        "@webassemblyjs/wasm-gen": "1.11.0",
        "@webassemblyjs/wasm-opt": "1.11.0",
        "@webassemblyjs/wasm-parser": "1.11.0",
        "@webassemblyjs/wast-printer": "1.11.0"
      }
    },
    "node_modules/@webassemblyjs/wasm-gen": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/wasm-gen/-/wasm-gen-1.11.0.tgz",
      "integrity": "sha512-BEUv1aj0WptCZ9kIS30th5ILASUnAPEvE3tVMTrItnZRT9tXCLW2LEXT8ezLw59rqPP9klh9LPmpU+WmRQmCPQ==",
      "dependencies": {
        "@webassemblyjs/ast": "1.11.0",
        "@webassemblyjs/helper-wasm-bytecode": "1.11.0",
        "@webassemblyjs/ieee754": "1.11.0",
        "@webassemblyjs/leb128": "1.11.0",
        "@webassemblyjs/utf8": "1.11.0"
      }
    },
    "node_modules/@webassemblyjs/wasm-opt": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/wasm-opt/-/wasm-opt-1.11.0.tgz",
      "integrity": "sha512-tHUSP5F4ywyh3hZ0+fDQuWxKx3mJiPeFufg+9gwTpYp324mPCQgnuVKwzLTZVqj0duRDovnPaZqDwoyhIO8kYg==",
      "dependencies": {
        "@webassemblyjs/ast": "1.11.0",
        "@webassemblyjs/helper-buffer": "1.11.0",
        "@webassemblyjs/wasm-gen": "1.11.0",
        "@webassemblyjs/wasm-parser": "1.11.0"
      }
    },
    "node_modules/@webassemblyjs/wasm-parser": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/wasm-parser/-/wasm-parser-1.11.0.tgz",
      "integrity": "sha512-6L285Sgu9gphrcpDXINvm0M9BskznnzJTE7gYkjDbxET28shDqp27wpruyx3C2S/dvEwiigBwLA1cz7lNUi0kw==",
      "dependencies": {
        "@webassemblyjs/ast": "1.11.0",
        "@webassemblyjs/helper-api-error": "1.11.0",
        "@webassemblyjs/helper-wasm-bytecode": "1.11.0",
        "@webassemblyjs/ieee754": "1.11.0",
        "@webassemblyjs/leb128": "1.11.0",
        "@webassemblyjs/utf8": "1.11.0"
      }
    },
    "node_modules/@webassemblyjs/wast-printer": {
      "version": "1.11.0",
      "resolved": "https://registry.npmjs.org/@webassemblyjs/wast-printer/-/wast-printer-1.11.0.tgz",
      "integrity": "sha512-Fg5OX46pRdTgB7rKIUojkh9vXaVN6sGYCnEiJN1GYkb0RPwShZXp6KTDqmoMdQPKhcroOXh3fEzmkWmCYaKYhQ==",
      "dependencies": {
        "@webassemblyjs/ast": "1.11.0",
        "@xtuc/long": "4.2.2"
      }
    },
    "node_modules/@webpack-cli/configtest": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/@webpack-cli/configtest/-/configtest-1.0.2.tgz",
      "integrity": "sha512-3OBzV2fBGZ5TBfdW50cha1lHDVf9vlvRXnjpVbJBa20pSZQaSkMJZiwA8V2vD9ogyeXn8nU5s5A6mHyf5jhMzA==",
      "peerDependencies": {
        "webpack": "4.x.x || 5.x.x",
        "webpack-cli": "4.x.x"
      }
    },
    "node_modules/@webpack-cli/info": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/@webpack-cli/info/-/info-1.2.3.tgz",
      "integrity": "sha512-lLek3/T7u40lTqzCGpC6CAbY6+vXhdhmwFRxZLMnRm6/sIF/7qMpT8MocXCRQfz0JAh63wpbXLMnsQ5162WS7Q==",
      "dependencies": {
        "envinfo": "^7.7.3"
      },
      "peerDependencies": {
        "webpack-cli": "4.x.x"
      }
    },
    "node_modules/@webpack-cli/serve": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/@webpack-cli/serve/-/serve-1.3.1.tgz",
      "integrity": "sha512-0qXvpeYO6vaNoRBI52/UsbcaBydJCggoBBnIo/ovQQdn6fug0BgwsjorV1hVS7fMqGVTZGcVxv8334gjmbj5hw==",
      "peerDependencies": {
        "webpack-cli": "4.x.x"
      },
      "peerDependenciesMeta": {
        "webpack-dev-server": {
          "optional": true
        }
      }
    },
    "node_modules/@xtuc/ieee754": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/@xtuc/ieee754/-/ieee754-1.2.0.tgz",
      "integrity": "sha512-DX8nKgqcGwsc0eJSqYt5lwP4DH5FlHnmuWWBRy7X0NcaGR0ZtuyeESgMwTYVEtxmsNGY+qit4QYT/MIYTOTPeA=="
    },
    "node_modules/@xtuc/long": {
      "version": "4.2.2",
      "resolved": "https://registry.npmjs.org/@xtuc/long/-/long-4.2.2.tgz",
      "integrity": "sha512-NuHqBY1PB/D8xU6s/thBgOAiAP7HOYDQ32+BFZILJ8ivkUkAHQnWfn6WhL79Owj1qmUnoN/YPhktdIoucipkAQ=="
    },
    "node_modules/accepts": {
      "version": "1.3.7",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.7.tgz",
      "integrity": "sha512-Il80Qs2WjYlJIBNzNkK6KYqlVMTbZLXgHx2oT0pU/fjRHyEp+PEfEPY0R3WCwAGVOtauxh1hOxNgIf5bv7dQpA==",
      "dev": true,
      "dependencies": {
        "mime-types": "~2.1.24",
        "negotiator": "0.6.2"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/acorn": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.1.0.tgz",
      "integrity": "sha512-LWCF/Wn0nfHOmJ9rzQApGnxnvgfROzGilS8936rqN/lfcYkY9MYZzdMqN+2NJ4SlTc+m5HiSa+kNfDtI64dwUA==",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/ajv": {
      "version": "6.12.6",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.12.6.tgz",
      "integrity": "sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==",
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ajv-errors": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/ajv-errors/-/ajv-errors-1.0.1.tgz",
      "integrity": "sha512-DCRfO/4nQ+89p/RK43i8Ezd41EqdGIU4ld7nGF8OQ14oc/we5rEntLCUa7+jrn3nn83BosfwZA0wb4pon2o8iQ==",
      "dev": true,
      "peerDependencies": {
        "ajv": ">=5.0.0"
      }
    },
    "node_modules/ajv-keywords": {
      "version": "3.5.2",
      "resolved": "https://registry.npmjs.org/ajv-keywords/-/ajv-keywords-3.5.2.tgz",
      "integrity": "sha512-5p6WTN0DdTGVQk6VjcEju19IgaHudalcfabD7yhDGeA6bcQnmL+CpveLJq/3hvfwd1aof6L386Ougkx6RfyMIQ==",
      "peerDependencies": {
        "ajv": "^6.9.1"
      }
    },
    "node_modules/ammo.js": {
      "version": "0.0.2",
      "resolved": "https://codeload.github.com/kripken/ammo.js/tar.gz/05a9b87a560c40cfebbcfc9b5ec871278dfb73c0",
      "integrity": "sha512-8tnv8Noiz7raOM0sKowY2C+i/Z9iw3FVRMPziOQjp+g9LU+0IJjPgh655r3BXsyeo07sYjrGC+SUgd8cspla+Q=="
    },
    "node_modules/ansi-colors": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/ansi-colors/-/ansi-colors-4.1.1.tgz",
      "integrity": "sha512-JoX0apGbHaUJBNl6yF+p6JAFYZ666/hhCGKN5t9QFjbJQKUU/g8MNbFDbvfrgKXvI1QpZplPOnwIo99lX/AAmA==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/ansi-html": {
      "version": "0.0.7",
      "resolved": "https://registry.npmjs.org/ansi-html/-/ansi-html-0.0.7.tgz",
      "integrity": "sha1-gTWEAhliqenm/QOflA0S9WynhZ4= sha512-JoAxEa1DfP9m2xfB/y2r/aKcwXNlltr4+0QSBC4TrLfcxyvepX2Pv0t/xpgGV5bGsDzCYV8SzjWgyCW0T9yYbA==",
      "dev": true,
      "engines": [
        "node >= 0.8.0"
      ],
      "bin": {
        "ansi-html": "bin/ansi-html"
      }
    },
    "node_modules/ansi-regex": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-2.1.1.tgz",
      "integrity": "sha1-w7M6te42DYbg5ijwRorn7yfWVN8= sha512-TIGnTpdo+E3+pCyAluZvtED5p5wCqLdezCyhPZzKPcxvFplEt4i+W7OONCKgeZFT3+y5NZZfOOS/Bdcanm1MYA==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/ansi-styles": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-3.2.1.tgz",
      "integrity": "sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==",
      "dev": true,
      "dependencies": {
        "color-convert": "^1.9.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/anymatch": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-2.0.0.tgz",
      "integrity": "sha512-5teOsQWABXHHBFP9y3skS5P3d/WfWXpv3FUpy+LorMrNYaT9pI4oLMQX7jzQ2KklNpGpWHzdCXTDT2Y3XGlZBw==",
      "dev": true,
      "dependencies": {
        "micromatch": "^3.1.4",
        "normalize-path": "^2.1.1"
      }
    },
    "node_modules/anymatch/node_modules/normalize-path": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-2.1.1.tgz",
      "integrity": "sha1-GrKLVW4Zg2Oowab35vogE3/mrtk= sha512-3pKJwH184Xo/lnH6oyP1q2pMd7HcypqqmRs91/6/i2CGtWwIKGCkOOMTm/zXbgTEWHw1uNpNi/igc3ePOYHb6w==",
      "dev": true,
      "dependencies": {
        "remove-trailing-separator": "^1.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/arr-diff": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/arr-diff/-/arr-diff-4.0.0.tgz",
      "integrity": "sha1-1kYQdP6/7HHn4VI1dhoyml3HxSA= sha512-YVIQ82gZPGBebQV/a8dar4AitzCQs0jjXwMPZllpXMaGjXPYVUawSxQrRsjhjupyVxEvbHgUmIhKVlND+j02kA==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/arr-flatten": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/arr-flatten/-/arr-flatten-1.1.0.tgz",
      "integrity": "sha512-L3hKV5R/p5o81R7O02IGnwpDmkp6E982XhtbuwSe3O4qOtMMMtodicASA1Cny2U+aCXcNpml+m4dPsvsJ3jatg==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/arr-union": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/arr-union/-/arr-union-3.1.0.tgz",
      "integrity": "sha1-45sJrqne+Gao8gbiiK9jkZuuOcQ= sha512-sKpyeERZ02v1FeCZT8lrfJq5u6goHCtpTAzPwJYe7c8SPFOboNjNg1vz2L4VTn9T4PQxEx13TbXLmYUcS6Ug7Q==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/array-flatten": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-2.1.2.tgz",
      "integrity": "sha512-hNfzcOV8W4NdualtqBFPyVO+54DSJuZGY9qT4pRroB6S9e3iiido2ISIC5h9R2sPJ8H3FHCIiEnsv1lPXO3KtQ==",
      "dev": true
    },
    "node_modules/array-union": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/array-union/-/array-union-1.0.2.tgz",
      "integrity": "sha1-mjRBDk9OPaI96jdb5b5w8kd47Dk= sha512-Dxr6QJj/RdU/hCaBjOfxW+q6lyuVE6JFWIrAUpuOOhoJJoQ99cUn3igRaHVB5P9WrgFVN0FfArM3x0cueOU8ng==",
      "dev": true,
      "dependencies": {
        "array-uniq": "^1.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/array-uniq": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/array-uniq/-/array-uniq-1.0.3.tgz",
      "integrity": "sha1-r2rId6Jcx/dOBYiUdThY39sk/bY= sha512-MNha4BWQ6JbwhFhj03YK552f7cb3AzoE8SzeljgChvL1dl3IcvggXVz1DilzySZkCja+CXuZbdW7yATchWn8/Q==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/array-unique": {
      "version": "0.3.2",
      "resolved": "https://registry.npmjs.org/array-unique/-/array-unique-0.3.2.tgz",
      "integrity": "sha1-qJS3XUvE9s1nnvMkSp/Y9Gri1Cg= sha512-SleRWjh9JUud2wH1hPs9rZBZ33H6T9HOiL0uwGnGx9FpE6wKGyfWugmbkEOIs6qWrZhg0LWeLziLrEwQJhs5mQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/assign-symbols": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/assign-symbols/-/assign-symbols-1.0.0.tgz",
      "integrity": "sha1-WWZ/QfrdTyDMvCu5a41Pf3jsA2c= sha512-Q+JC7Whu8HhmTdBph/Tq59IoRtoy6KAm5zzPv00WdujX82lbAL8K7WVjne7vdCsAmbF4AYaDOPyO3k0kl8qIrw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/async": {
      "version": "2.6.3",
      "resolved": "https://registry.npmjs.org/async/-/async-2.6.3.tgz",
      "integrity": "sha512-zflvls11DCy+dQWzTW2dzuilv8Z5X/pjfmZOWba6TNIVDm+2UDaJmXSOXlasHKfNBs8oo3M0aT50fDEWfKZjXg==",
      "dev": true,
      "dependencies": {
        "lodash": "^4.17.14"
      }
    },
    "node_modules/async-each": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/async-each/-/async-each-1.0.3.tgz",
      "integrity": "sha512-z/WhQ5FPySLdvREByI2vZiTWwCnF0moMJ1hK9YQwDTHKh6I7/uSckMetoRGb5UBZPC1z0jlw+n/XCgjeH7y1AQ==",
      "dev": true
    },
    "node_modules/async-limiter": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/async-limiter/-/async-limiter-1.0.1.tgz",
      "integrity": "sha512-csOlWGAcRFJaI6m+F2WKdnMKr4HhdhFVBk0H/QbJFMCr+uO2kwohwXQPxw/9OCxp05r5ghVBFSyioixx3gfkNQ==",
      "dev": true
    },
    "node_modules/atob": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/atob/-/atob-2.1.2.tgz",
      "integrity": "sha512-Wm6ukoaOGJi/73p/cl2GvLjTI5JM1k/O14isD73YML8StrH/7/lRFgmg8nICZgD3bZZvjwCGxtMOD3wWNAu8cg==",
      "dev": true,
      "bin": {
        "atob": "bin/atob.js"
      },
      "engines": {
        "node": ">= 4.5.0"
      }
    },
    "node_modules/babel-loader": {
      "version": "8.2.2",
      "resolved": "https://registry.npmjs.org/babel-loader/-/babel-loader-8.2.2.tgz",
      "integrity": "sha512-JvTd0/D889PQBtUXJ2PXaKU/pjZDMtHA9V2ecm+eNRmmBCMR09a+fmpGTNwnJtFmFl5Ei7Vy47LjBb+L0wQ99g==",
      "dev": true,
      "dependencies": {
        "find-cache-dir": "^3.3.1",
        "loader-utils": "^1.4.0",
        "make-dir": "^3.1.0",
        "schema-utils": "^2.6.5"
      },
      "engines": {
        "node": ">= 8.9"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0",
        "webpack": ">=2"
      }
    },
    "node_modules/babel-plugin-dynamic-import-node": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/babel-plugin-dynamic-import-node/-/babel-plugin-dynamic-import-node-2.3.3.tgz",
      "integrity": "sha512-jZVI+s9Zg3IqA/kdi0i6UDCybUI3aSBLnglhYbSSjKlV7yF1F/5LWv8MakQmvYpnbJDS6fcBL2KzHSxNCMtWSQ==",
      "dev": true,
      "dependencies": {
        "object.assign": "^4.1.0"
      }
    },
    "node_modules/babel-plugin-polyfill-corejs2": {
      "version": "0.1.10",
      "resolved": "https://registry.npmjs.org/babel-plugin-polyfill-corejs2/-/babel-plugin-polyfill-corejs2-0.1.10.tgz",
      "integrity": "sha512-DO95wD4g0A8KRaHKi0D51NdGXzvpqVLnLu5BTvDlpqUEpTmeEtypgC1xqesORaWmiUOQI14UHKlzNd9iZ2G3ZA==",
      "dev": true,
      "dependencies": {
        "@babel/compat-data": "^7.13.0",
        "@babel/helper-define-polyfill-provider": "^0.1.5",
        "semver": "^6.1.1"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/babel-plugin-polyfill-corejs3": {
      "version": "0.1.7",
      "resolved": "https://registry.npmjs.org/babel-plugin-polyfill-corejs3/-/babel-plugin-polyfill-corejs3-0.1.7.tgz",
      "integrity": "sha512-u+gbS9bbPhZWEeyy1oR/YaaSpod/KDT07arZHb80aTpl8H5ZBq+uN1nN9/xtX7jQyfLdPfoqI4Rue/MQSWJquw==",
      "dev": true,
      "dependencies": {
        "@babel/helper-define-polyfill-provider": "^0.1.5",
        "core-js-compat": "^3.8.1"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/babel-plugin-polyfill-regenerator": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/babel-plugin-polyfill-regenerator/-/babel-plugin-polyfill-regenerator-0.1.6.tgz",
      "integrity": "sha512-OUrYG9iKPKz8NxswXbRAdSwF0GhRdIEMTloQATJi4bDuFqrXaXcCUT/VGNrr8pBcjMh1RxZ7Xt9cytVJTJfvMg==",
      "dev": true,
      "dependencies": {
        "@babel/helper-define-polyfill-provider": "^0.1.5"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.0.tgz",
      "integrity": "sha1-ibTRmasr7kneFk6gK4nORi1xt2c= sha512-9Y0g0Q8rmSt+H33DfKv7FOc3v+iRI+o1lbzt8jGcIosYW37IIW/2XVYq5NPdmaD5NQ59Nk26Kl/vZbwW9Fr8vg==",
      "dev": true
    },
    "node_modules/base": {
      "version": "0.11.2",
      "resolved": "https://registry.npmjs.org/base/-/base-0.11.2.tgz",
      "integrity": "sha512-5T6P4xPgpp0YDFvSWwEZ4NoE3aM4QBQXDzmVbraCkFj8zHM+mba8SyqB5DbZWyR7mYHo6Y7BdQo3MoA4m0TeQg==",
      "dev": true,
      "dependencies": {
        "cache-base": "^1.0.1",
        "class-utils": "^0.3.5",
        "component-emitter": "^1.2.1",
        "define-property": "^1.0.0",
        "isobject": "^3.0.1",
        "mixin-deep": "^1.2.0",
        "pascalcase": "^0.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/base/node_modules/define-property": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/define-property/-/define-property-1.0.0.tgz",
      "integrity": "sha1-dp66rz9KY6rTr56NMEybvnm/sOY= sha512-cZTYKFWspt9jZsMscWo8sc/5lbPC9Q0N5nBLgb+Yd915iL3udB1uFgS3B8YCx66UVHq018DAVFoee7x+gxggeA==",
      "dev": true,
      "dependencies": {
        "is-descriptor": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/batch": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/batch/-/batch-0.6.1.tgz",
      "integrity": "sha1-3DQxT05nkxgJP8dgJyUl+UvyXBY= sha512-x+VAiMRL6UPkx+kudNvxTl6hB2XNNCG2r+7wixVfIYwu/2HKRXimwQyaumLjMveWvT2Hkd/cAJw+QBMfJ/EKVw==",
      "dev": true
    },
    "node_modules/big.js": {
      "version": "5.2.2",
      "resolved": "https://registry.npmjs.org/big.js/-/big.js-5.2.2.tgz",
      "integrity": "sha512-vyL2OymJxmarO8gxMr0mhChsO9QGwhynfuu4+MHTAW6czfq9humCB7rKpUjDd9YUiDPU4mzpyupFSvOClAwbmQ==",
      "dev": true,
      "engines": {
        "node": "*"
      }
    },
    "node_modules/binary-extensions": {
      "version": "1.13.1",
      "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-1.13.1.tgz",
      "integrity": "sha512-Un7MIEDdUC5gNpcGDV97op1Ywk748MpHcFTHoYs6qnj1Z3j7I53VG3nwZhKzoBZmbdRNnb6WRdFlwl7tSDuZGw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/bindings": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/bindings/-/bindings-1.5.0.tgz",
      "integrity": "sha512-p2q/t/mhvuOj/UeLlV6566GD/guowlr0hHxClI0W9m7MWYkL1F0hLo+0Aexs9HSPCtR1SXQ0TD3MMKrXZajbiQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "file-uri-to-path": "1.0.0"
      }
    },
    "node_modules/body-parser": {
      "version": "1.19.0",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.19.0.tgz",
      "integrity": "sha512-dhEPs72UPbDnAQJ9ZKMNTP6ptJaionhP5cBb541nXPlW60Jepo9RV/a4fX4XWW9CuFNK22krhrj1+rgzifNCsw==",
      "dev": true,
      "dependencies": {
        "bytes": "3.1.0",
        "content-type": "~1.0.4",
        "debug": "2.6.9",
        "depd": "~1.1.2",
        "http-errors": "1.7.2",
        "iconv-lite": "0.4.24",
        "on-finished": "~2.3.0",
        "qs": "6.7.0",
        "raw-body": "2.4.0",
        "type-is": "~1.6.17"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/body-parser/node_modules/bytes": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.0.tgz",
      "integrity": "sha512-zauLjrfCG+xvoyaqLoV8bLVXXNGC4JqlxFCutSDWA6fJrTo2ZuvLYTqZ7aHBLZSMOopbzwv8f+wZcVzfVTI2Dg==",
      "dev": true,
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/body-parser/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/body-parser/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g= sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true
    },
    "node_modules/bonjour": {
      "version": "3.5.0",
      "resolved": "https://registry.npmjs.org/bonjour/-/bonjour-3.5.0.tgz",
      "integrity": "sha1-jokKGD2O6aI5OzhExpGkK897yfU= sha512-RaVTblr+OnEli0r/ud8InrU7D+G0y6aJhlxaLa6Pwty4+xoxboF1BsUI45tujvRpbj9dQVoglChqonGAsjEBYg==",
      "dev": true,
      "dependencies": {
        "array-flatten": "^2.1.0",
        "deep-equal": "^1.0.1",
        "dns-equal": "^1.0.0",
        "dns-txt": "^2.0.2",
        "multicast-dns": "^6.0.1",
        "multicast-dns-service-types": "^1.1.0"
      }
    },
    "node_modules/boolbase": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/boolbase/-/boolbase-1.0.0.tgz",
      "integrity": "sha1-aN/1++YMUes3cl6p4+0xDcwed24= sha512-JZOSA7Mo9sNGB8+UjSgzdLtokWAky1zbztM3WRLCbZ70/3cTANmQmOdR7y2g+J0e2WXywy1yS468tY+IruqEww==",
      "dev": true
    },
    "node_modules/brace-expansion": {
      "version": "1.1.11",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.11.tgz",
      "integrity": "sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==",
      "dev": true,
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/braces/-/braces-2.3.2.tgz",
      "integrity": "sha512-aNdbnj9P8PjdXU4ybaWLK2IF3jc/EoDYbC7AazW6to3TRsfXxscC9UXOB5iDiEQrkyIbWp2SLQda4+QAa7nc3w==",
      "dev": true,
      "dependencies": {
        "arr-flatten": "^1.1.0",
        "array-unique": "^0.3.2",
        "extend-shallow": "^2.0.1",
        "fill-range": "^4.0.0",
        "isobject": "^3.0.1",
        "repeat-element": "^1.1.2",
        "snapdragon": "^0.8.1",
        "snapdragon-node": "^2.0.1",
        "split-string": "^3.0.2",
        "to-regex": "^3.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/browserslist": {
      "version": "4.16.3",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.16.3.tgz",
      "integrity": "sha512-vIyhWmIkULaq04Gt93txdh+j02yX/JzlyhLYbV3YQCn/zvES3JnY7TifHHvvr1w5hTDluNKMkV05cs4vy8Q7sw==",
      "dependencies": {
        "caniuse-lite": "^1.0.30001181",
        "colorette": "^1.2.1",
        "electron-to-chromium": "^1.3.649",
        "escalade": "^3.1.1",
        "node-releases": "^1.1.70"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/browserslist"
      }
    },
    "node_modules/buffer-from": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/buffer-from/-/buffer-from-1.1.1.tgz",
      "integrity": "sha512-MQcXEUbCKtEo7bhqEs6560Hyd4XaovZlO/k9V3hjVUF/zwW7KBVdSK4gIt/bzwS9MbR5qob+F5jusZsb0YQK2A=="
    },
    "node_modules/buffer-indexof": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/buffer-indexof/-/buffer-indexof-1.1.1.tgz",
      "integrity": "sha512-4/rOEg86jivtPTeOUUT61jJO1Ya1TrR/OkqCSZDyq84WJh3LuuiphBYJN+fm5xufIk4XAFcEwte/8WzC8If/1g==",
      "dev": true
    },
    "node_modules/bytes": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.0.0.tgz",
      "integrity": "sha1-0ygVQE1olpn4Wk6k+odV3ROpYEg= sha512-pMhOfFDPiv9t5jjIXkHosWmkSyQbvsgEVNkz0ERHbuLh2T/7j4Mqqpz523Fe8MVY89KC6Sh/QfS2sM+SjgFDcw==",
      "dev": true,
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/cache-base": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/cache-base/-/cache-base-1.0.1.tgz",
      "integrity": "sha512-AKcdTnFSWATd5/GCPRxr2ChwIJ85CeyrEyjRHlKxQ56d4XJMGym0uAiKn0xbLOGOl3+yRpOTi484dVCEc5AUzQ==",
      "dev": true,
      "dependencies": {
        "collection-visit": "^1.0.0",
        "component-emitter": "^1.2.1",
        "get-value": "^2.0.6",
        "has-value": "^1.0.0",
        "isobject": "^3.0.1",
        "set-value": "^2.0.0",
        "to-object-path": "^0.3.0",
        "union-value": "^1.0.0",
        "unset-value": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/call-bind": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.2.tgz",
      "integrity": "sha512-7O+FbCihrB5WGbFYesctwmTKae6rOiIzmz1icreWJ+0aA7LJfuqhEso2T9ncpcFtzMQtzXf2QGGueWJGTYsqrA==",
      "dev": true,
      "dependencies": {
        "function-bind": "^1.1.1",
        "get-intrinsic": "^1.0.2"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/camel-case": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/camel-case/-/camel-case-4.1.2.tgz",
      "integrity": "sha512-gxGWBrTT1JuMx6R+o5PTXMmUnhnVzLQ9SNutD4YqKtI6ap897t3tKECYla6gCWEkplXnlNybEkZg9GEGxKFCgw==",
      "dev": true,
      "dependencies": {
        "pascal-case": "^3.1.2",
        "tslib": "^2.0.3"
      }
    },
    "node_modules/camelcase": {
      "version": "5.3.1",
      "resolved": "https://registry.npmjs.org/camelcase/-/camelcase-5.3.1.tgz",
      "integrity": "sha512-L28STB170nwWS63UjtlEOE3dldQApaJXZkOI1uMFfzf3rRuPegHaHesyee+YxQ+W6SvRDQV6UrdOdRiR153wJg==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001207",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001207.tgz",
      "integrity": "sha512-UPQZdmAsyp2qfCTiMU/zqGSWOYaY9F9LL61V8f+8MrubsaDGpaHD9HRV/EWZGULZn0Hxu48SKzI5DgFwTvHuYw=="
    },
    "node_modules/chalk": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-2.4.2.tgz",
      "integrity": "sha512-Mti+f9lpJNcwF4tWV8/OrTTtF1gZi+f8FqlyAdouralcFWFQWF2+NgCHShjkCb+IFBLq9buZwE1xckQU4peSuQ==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^3.2.1",
        "escape-string-regexp": "^1.0.5",
        "supports-color": "^5.3.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/chokidar": {
      "version": "2.1.8",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-2.1.8.tgz",
      "integrity": "sha512-ZmZUazfOzf0Nve7duiCKD23PFSCs4JPoYyccjUFF3aQkQadqBhfzhjkwBH2mNOG9cTBwhamM37EIsIkZw3nRgg==",
      "dev": true,
      "dependencies": {
        "anymatch": "^2.0.0",
        "async-each": "^1.0.1",
        "braces": "^2.3.2",
        "glob-parent": "^3.1.0",
        "inherits": "^2.0.3",
        "is-binary-path": "^1.0.0",
        "is-glob": "^4.0.0",
        "normalize-path": "^3.0.0",
        "path-is-absolute": "^1.0.0",
        "readdirp": "^2.2.1",
        "upath": "^1.1.1"
      },
      "optionalDependencies": {
        "fsevents": "^1.2.7"
      }
    },
    "node_modules/chrome-trace-event": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/chrome-trace-event/-/chrome-trace-event-1.0.2.tgz",
      "integrity": "sha512-9e/zx1jw7B4CO+c/RXoCsfg/x1AfUBioy4owYH0bJprEYAx5hRFLRhWBqHAG57D0ZM4H7vxbP7bPe0VwhQRYDQ==",
      "dependencies": {
        "tslib": "^1.9.0"
      },
      "engines": {
        "node": ">=6.0"
      }
    },
    "node_modules/chrome-trace-event/node_modules/tslib": {
      "version": "1.14.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-1.14.1.tgz",
      "integrity": "sha512-Xni35NKzjgMrwevysHTCArtLDpPvye8zV/0E4EyYn43P7/7qvQwPh9BGkHewbMulVntbigmcT7rdX3BNo9wRJg=="
    },
    "node_modules/class-utils": {
      "version": "0.3.6",
      "resolved": "https://registry.npmjs.org/class-utils/-/class-utils-0.3.6.tgz",
      "integrity": "sha512-qOhPa/Fj7s6TY8H8esGu5QNpMMQxz79h+urzrNYN6mn+9BnxlDGf5QZ+XeCDsxSjPqsSR56XOZOJmpeurnLMeg==",
      "dev": true,
      "dependencies": {
        "arr-union": "^3.1.0",
        "define-property": "^0.2.5",
        "isobject": "^3.0.0",
        "static-extend": "^0.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/class-utils/node_modules/define-property": {
      "version": "0.2.5",
      "resolved": "https://registry.npmjs.org/define-property/-/define-property-0.2.5.tgz",
      "integrity": "sha1-w1se+RjsPJkPmlvFe+BKrOxcgRY= sha512-Rr7ADjQZenceVOAKop6ALkkRAmH1A4Gx9hV/7ZujPUN2rkATqFO0JZLZInbAjpZYoJ1gUx8MRMQVkYemcbMSTA==",
      "dev": true,
      "dependencies": {
        "is-descriptor": "^0.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/class-utils/node_modules/is-accessor-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-accessor-descriptor/-/is-accessor-descriptor-0.1.6.tgz",
      "integrity": "sha1-qeEss66Nh2cn7u84Q/igiXtcmNY= sha512-e1BM1qnDbMRG3ll2U9dSK0UMHuWOs3pY3AtcFsmvwPtKL3MML/Q86i+GilLfvqEs4GW+ExB91tQ3Ig9noDIZ+A==",
      "deprecated": "Please upgrade to v0.1.7",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/class-utils/node_modules/is-data-descriptor": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/is-data-descriptor/-/is-data-descriptor-0.1.4.tgz",
      "integrity": "sha1-C17mSDiOLIYCgueT8YVv7D8wG1Y= sha512-+w9D5ulSoBNlmw9OHn3U2v51SyoCd0he+bB3xMl62oijhrspxowjU+AIcDY0N3iEJbUEkB15IlMASQsxYigvXg==",
      "deprecated": "Please upgrade to v0.1.5",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/class-utils/node_modules/is-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-descriptor/-/is-descriptor-0.1.6.tgz",
      "integrity": "sha512-avDYr0SB3DwO9zsMov0gKCESFYqCnE4hq/4z3TdUlukEy5t9C0YRq7HLrsN52NAcqXKaepeCD0n+B0arnVG3Hg==",
      "dev": true,
      "dependencies": {
        "is-accessor-descriptor": "^0.1.6",
        "is-data-descriptor": "^0.1.4",
        "kind-of": "^5.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/class-utils/node_modules/is-descriptor/node_modules/kind-of": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-5.1.0.tgz",
      "integrity": "sha512-NGEErnH6F2vUuXDh+OlbcKW7/wOcfdRHaZ7VWtqCztfHri/++YKmP51OdWeGPuqCOba6kk2OTe5d02VmTB80Pw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/clean-css": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/clean-css/-/clean-css-4.2.3.tgz",
      "integrity": "sha512-VcMWDN54ZN/DS+g58HYL5/n4Zrqe8vHJpGA8KdgUXFU4fuP/aHNw8eld9SyEIyabIMJX/0RaY/fplOo5hYLSFA==",
      "dev": true,
      "dependencies": {
        "source-map": "~0.6.0"
      },
      "engines": {
        "node": ">= 4.0"
      }
    },
    "node_modules/clean-css/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/cliui": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-5.0.0.tgz",
      "integrity": "sha512-PYeGSEmmHM6zvoef2w8TPzlrnNpXIjTipYK780YswmIP9vjxmd6Y2a3CB2Ks6/AU8NHjZugXvo8w3oWM2qnwXA==",
      "dev": true,
      "dependencies": {
        "string-width": "^3.1.0",
        "strip-ansi": "^5.2.0",
        "wrap-ansi": "^5.1.0"
      }
    },
    "node_modules/cliui/node_modules/ansi-regex": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-4.1.0.tgz",
      "integrity": "sha512-1apePfXM1UOSqw0o9IiFAovVz9M5S1Dg+4TrDwfMewQ6p/rmMueb7tWZjQ1rx4Loy1ArBggoqGpfqqdI4rondg==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/cliui/node_modules/strip-ansi": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-5.2.0.tgz",
      "integrity": "sha512-DuRs1gKbBqsMKIZlrffwlug8MHkcnpjs5VPmL1PAh+mA30U0DTotfDZ0d2UUsXpPmPmMMJ6W773MaA3J+lbiWA==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^4.1.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/clone-deep": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/clone-deep/-/clone-deep-4.0.1.tgz",
      "integrity": "sha512-neHB9xuzh/wk0dIHweyAXv2aPGZIVk3pLMe+/RNzINf17fe0OG96QroktYAUm7SM1PBnzTabaLboqqxDyMU+SQ==",
      "dependencies": {
        "is-plain-object": "^2.0.4",
        "kind-of": "^6.0.2",
        "shallow-clone": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/clone-deep/node_modules/kind-of": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-6.0.3.tgz",
      "integrity": "sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/collection-visit": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/collection-visit/-/collection-visit-1.0.0.tgz",
      "integrity": "sha1-S8A3PBZLwykbTTaMgpzxqApZ3KA= sha512-lNkKvzEeMBBjUGHZ+q6z9pSJla0KWAQPvtzhEV9+iGyQYG+pBpl7xKDhxoNSOZH2hhv0v5k0y2yAM4o4SjoSkw==",
      "dev": true,
      "dependencies": {
        "map-visit": "^1.0.0",
        "object-visit": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/color-convert": {
      "version": "1.9.3",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-1.9.3.tgz",
      "integrity": "sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==",
      "dev": true,
      "dependencies": {
        "color-name": "1.1.3"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.3.tgz",
      "integrity": "sha1-p9BVi9icQveV3UIyj3QIMcpTvCU= sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==",
      "dev": true
    },
    "node_modules/colorette": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/colorette/-/colorette-1.2.2.tgz",
      "integrity": "sha512-MKGMzyfeuutC/ZJ1cba9NqcNpfeqMUcYmyF1ZFY6/Cn7CNSAKx6a+s48sqLqyAiZuaP2TcqMhoo+dlwFnVxT9w=="
    },
    "node_modules/commander": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz",
      "integrity": "sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==",
      "dev": true,
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/commondir": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/commondir/-/commondir-1.0.1.tgz",
      "integrity": "sha1-3dgA2gxmEnOTzKWVDqloo6rxJTs= sha512-W9pAhw0ja1Edb5GVdIF1mjZw/ASI0AlShXM83UUGe2DVr5TdAPEA1OA8m/g8zWp9x6On7gqufY+FatDbC3MDQg==",
      "dev": true
    },
    "node_modules/component-emitter": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/component-emitter/-/component-emitter-1.3.0.tgz",
      "integrity": "sha512-Rd3se6QB+sO1TwqZjscQrurpEPIfO0/yYnSin6Q/rD3mOutHvUrCAhJub3r90uNb+SESBuE0QYoB90YdfatsRg==",
      "dev": true
    },
    "node_modules/compressible": {
      "version": "2.0.18",
      "resolved": "https://registry.npmjs.org/compressible/-/compressible-2.0.18.tgz",
      "integrity": "sha512-AF3r7P5dWxL8MxyITRMlORQNaOA2IkAFaTr4k7BUumjPtRpGDTZpl0Pb1XCO6JeDCBdp126Cgs9sMxqSjgYyRg==",
      "dev": true,
      "dependencies": {
        "mime-db": ">= 1.43.0 < 2"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/compression": {
      "version": "1.7.4",
      "resolved": "https://registry.npmjs.org/compression/-/compression-1.7.4.tgz",
      "integrity": "sha512-jaSIDzP9pZVS4ZfQ+TzvtiWhdpFhE2RDHz8QJkpX9SIpLq88VueF5jJw6t+6CUQcAoA6t+x89MLrWAqpfDE8iQ==",
      "dev": true,
      "dependencies": {
        "accepts": "~1.3.5",
        "bytes": "3.0.0",
        "compressible": "~2.0.16",
        "debug": "2.6.9",
        "on-headers": "~1.0.2",
        "safe-buffer": "5.1.2",
        "vary": "~1.1.2"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/compression/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/compression/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g= sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha1-2Klr13/Wjfd5OnMDajug1UBdR3s= sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true
    },
    "node_modules/connect-history-api-fallback": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/connect-history-api-fallback/-/connect-history-api-fallback-1.6.0.tgz",
      "integrity": "sha512-e54B99q/OUoH64zYYRf3HBP5z24G38h5D3qXu23JGRoigpX5Ss4r9ZnDk3g0Z8uQC2x2lPaJ+UlWBc1ZWBWdLg==",
      "dev": true,
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/content-disposition": {
      "version": "0.5.3",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-0.5.3.tgz",
      "integrity": "sha512-ExO0774ikEObIAEV9kDo50o+79VCUdEB6n6lzKgGwupcVeRlhrj3qGAfwq8G6uBJjkqLrhT0qEYFcWng8z1z0g==",
      "dev": true,
      "dependencies": {
        "safe-buffer": "5.1.2"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.4.tgz",
      "integrity": "sha512-hIP3EEPs8tB9AT1L+NUqtwOAps4mk2Zob89MWXMHjHWg9milF/j4osnnQLXBCBFBk/tvIG/tUc9mOUJiPBhPXA==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/convert-source-map": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-1.7.0.tgz",
      "integrity": "sha512-4FJkXzKXEDB1snCFZlLP4gpC3JILicCpGbzG9f9G7tGqGCzETQ2hWPrcinA9oU4wtf2biUaEH5065UnMeR33oA==",
      "dev": true,
      "dependencies": {
        "safe-buffer": "~5.1.1"
      }
    },
    "node_modules/cookie": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.4.0.tgz",
      "integrity": "sha512-+Hp8fLp57wnUSt0tY0tHEXh4voZRDnoIrZPqlo3DPiI4y9lwg/jqx+1Om94/W6ZaPDOUbnjOt/99w66zk+l1Xg==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.0.6.tgz",
      "integrity": "sha1-4wOogrNCzD7oylE6eZmXNNqzriw= sha512-QADzlaHc8icV8I7vbaJXJwod9HWYp8uCqf1xa4OfNu1T7JVxQIrUgOWtHdNDtPiywmFbiS12VjotIXLrKM3orQ==",
      "dev": true
    },
    "node_modules/copy-descriptor": {
      "version": "0.1.1",
      "resolved": "https://registry.npmjs.org/copy-descriptor/-/copy-descriptor-0.1.1.tgz",
      "integrity": "sha1-Z29us8OZl8LuGsOpJP1hJHSPV40= sha512-XgZ0pFcakEUlbwQEVNg3+QAis1FyTL3Qel9FYy8pSkQqoG3PNoT0bOCQtOXcOkur21r2Eq2kI+IE+gsmAEVlYw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/core-js-compat": {
      "version": "3.10.0",
      "resolved": "https://registry.npmjs.org/core-js-compat/-/core-js-compat-3.10.0.tgz",
      "integrity": "sha512-9yVewub2MXNYyGvuLnMHcN1k9RkvB7/ofktpeKTIaASyB88YYqGzUnu0ywMMhJrDHOMiTjSHWGzR+i7Wb9Z1kQ==",
      "dev": true,
      "dependencies": {
        "browserslist": "^4.16.3",
        "semver": "7.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/core-js"
      }
    },
    "node_modules/core-js-compat/node_modules/semver": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.0.0.tgz",
      "integrity": "sha512-+GB6zVA9LWh6zovYQLALHwv5rb2PHGlJi3lfiqIHxR0uuwCgefcOJc59v9fv1w8GbStwxuuqqAjI9NMAOOgq1A==",
      "dev": true,
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/core-util-is": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.2.tgz",
      "integrity": "sha1-tf1UIgqivFq1eqtxQMlAdUUDwac= sha512-3lqz5YjWTYnW6dlDa5TLaTCcShfar1e40rmcJVwCBJC6mWlFuj0eCHIElmG1g5kyuJ/GD+8Wn4FFCcz4gJPfaQ==",
      "dev": true
    },
    "node_modules/cross-spawn": {
      "version": "7.0.3",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.3.tgz",
      "integrity": "sha512-iRDPJKUPVEND7dHPO8rkbOnPpyDygcDFtWjpeWNCgy8WP2rXcxXL8TskReQl6OrB2G7+UJrags1q15Fudc7G6w==",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/css-select": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/css-select/-/css-select-2.1.0.tgz",
      "integrity": "sha512-Dqk7LQKpwLoH3VovzZnkzegqNSuAziQyNZUcrdDM401iY+R5NkGBXGmtO05/yaXQziALuPogeG0b7UAgjnTJTQ==",
      "dev": true,
      "dependencies": {
        "boolbase": "^1.0.0",
        "css-what": "^3.2.1",
        "domutils": "^1.7.0",
        "nth-check": "^1.0.2"
      }
    },
    "node_modules/css-what": {
      "version": "3.4.2",
      "resolved": "https://registry.npmjs.org/css-what/-/css-what-3.4.2.tgz",
      "integrity": "sha512-ACUm3L0/jiZTqfzRM3Hi9Q8eZqd6IK37mMWPLz9PJxkLWllYeRf+EHUSHYEtFop2Eqytaq1FizFVh7XfBnXCDQ==",
      "dev": true,
      "engines": {
        "node": ">= 6"
      },
      "funding": {
        "url": "https://github.com/sponsors/fb55"
      }
    },
    "node_modules/debug": {
      "version": "4.3.1",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.3.1.tgz",
      "integrity": "sha512-doEwdvm4PCeK4K3RQN2ZC2BYUBaxwLARCqZmMjtF8a51J2Rb0xpVloFRnCODwqjpwnAoao4pelN8l3RJdv3gRQ==",
      "dev": true,
      "dependencies": {
        "ms": "2.1.2"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decamelize": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/decamelize/-/decamelize-1.2.0.tgz",
      "integrity": "sha1-9lNNFRSCabIDUue+4m9QH5oZEpA= sha512-z2S+W9X73hAUUki+N+9Za2lBlun89zigOyGrsax+KUQ6wKW4ZoWpEYBkGhQjwAjjDCkWxhY0VKEhk8wzY7F5cA==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/decode-uri-component": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/decode-uri-component/-/decode-uri-component-0.2.0.tgz",
      "integrity": "sha1-6zkTMzRYd1y4TNGh+uBiEGu4dUU= sha512-hjf+xovcEn31w/EUYdTXQh/8smFL/dzYjohQGEIgjyNavaJfBY2p5F527Bo1VPATxv0VYTUC2bOcXvqFwk78Og==",
      "dev": true,
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/deep-equal": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/deep-equal/-/deep-equal-1.1.1.tgz",
      "integrity": "sha512-yd9c5AdiqVcR+JjcwUQb9DkhJc8ngNr0MahEBGvDiJw8puWab2yZlh+nkasOnZP+EGTAP6rRp2JzJhJZzvNF8g==",
      "dev": true,
      "dependencies": {
        "is-arguments": "^1.0.4",
        "is-date-object": "^1.0.1",
        "is-regex": "^1.0.4",
        "object-is": "^1.0.1",
        "object-keys": "^1.1.1",
        "regexp.prototype.flags": "^1.2.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/default-gateway": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/default-gateway/-/default-gateway-4.2.0.tgz",
      "integrity": "sha512-h6sMrVB1VMWVrW13mSc6ia/DwYYw5MN6+exNu1OaJeFac5aSAvwM7lZ0NVfTABuSkQelr4h5oebg3KB1XPdjgA==",
      "dev": true,
      "dependencies": {
        "execa": "^1.0.0",
        "ip-regex": "^2.1.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/default-gateway/node_modules/cross-spawn": {
      "version": "6.0.5",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-6.0.5.tgz",
      "integrity": "sha512-eTVLrBSt7fjbDygz805pMnstIs2VTBNkRm0qxZd+M7A5XDdxVRWO5MxGBXZhjY4cqLYLdtrGqRf8mBPmzwSpWQ==",
      "dev": true,
      "dependencies": {
        "nice-try": "^1.0.4",
        "path-key": "^2.0.1",
        "semver": "^5.5.0",
        "shebang-command": "^1.2.0",
        "which": "^1.2.9"
      },
      "engines": {
        "node": ">=4.8"
      }
    },
    "node_modules/default-gateway/node_modules/execa": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/execa/-/execa-1.0.0.tgz",
      "integrity": "sha512-adbxcyWV46qiHyvSp50TKt05tB4tK3HcmF7/nxfAdhnox83seTDbwnaqKO4sXRy7roHAIFqJP/Rw/AuEbX61LA==",
      "dev": true,
      "dependencies": {
        "cross-spawn": "^6.0.0",
        "get-stream": "^4.0.0",
        "is-stream": "^1.1.0",
        "npm-run-path": "^2.0.0",
        "p-finally": "^1.0.0",
        "signal-exit": "^3.0.0",
        "strip-eof": "^1.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/default-gateway/node_modules/get-stream": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/get-stream/-/get-stream-4.1.0.tgz",
      "integrity": "sha512-GMat4EJ5161kIy2HevLlr4luNjBgvmj413KaQA7jt4V8B4RDsfpHk7WQ9GVqfYyyx8OS/L66Kox+rJRNklLK7w==",
      "dev": true,
      "dependencies": {
        "pump": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/default-gateway/node_modules/is-stream": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-stream/-/is-stream-1.1.0.tgz",
      "integrity": "sha1-EtSj3U5o4Lec6428hBc66A2RykQ= sha512-uQPm8kcs47jx38atAcWTVxyltQYoPT68y9aWYdV6yWXSyW8mzSat0TL6CiWdZeCdF3KrAvpVtnHbTv4RN+rqdQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/default-gateway/node_modules/npm-run-path": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/npm-run-path/-/npm-run-path-2.0.2.tgz",
      "integrity": "sha1-NakjLfo11wZ7TLLd8jV7GHFTbF8= sha512-lJxZYlT4DW/bRUtFh1MQIWqmLwQfAxnqWG4HhEdjMlkrJYnJn0Jrr2u3mgxqaWsdiBc76TYkTG/mhrnYTuzfHw==",
      "dev": true,
      "dependencies": {
        "path-key": "^2.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/default-gateway/node_modules/path-key": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-2.0.1.tgz",
      "integrity": "sha1-QRyttXTFoUDTpLGRDUDYDMn0C0A= sha512-fEHGKCSmUSDPv4uoj8AlD+joPlq3peND+HRYyxFz4KPw4z926S/b8rIuFs2FYJg3BwsxJf6A9/3eIdLaYC+9Dw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/default-gateway/node_modules/semver": {
      "version": "5.7.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-5.7.1.tgz",
      "integrity": "sha512-sauaDf/PZdVgrLTNYHRtpXa1iRiKcaebiKQ1BJdpQlWH2lCvexQdX55snPFyK7QzpudqbCI0qXFfOasHdyNDGQ==",
      "dev": true,
      "bin": {
        "semver": "bin/semver"
      }
    },
    "node_modules/default-gateway/node_modules/shebang-command": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-1.2.0.tgz",
      "integrity": "sha1-RKrGW2lbAzmJaMOfNj/uXer98eo= sha512-EV3L1+UQWGor21OmnvojK36mhg+TyIKDh3iFBKBohr5xeXIhNBcx8oWdgkTEEQ+BEFFYdLRuqMfd5L84N1V5Vg==",
      "dev": true,
      "dependencies": {
        "shebang-regex": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/default-gateway/node_modules/shebang-regex": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-1.0.0.tgz",
      "integrity": "sha1-2kL0l0DAtC2yypcoVxyxkMmO/qM= sha512-wpoSFAxys6b2a2wHZ1XpDSgD7N9iVjg29Ph9uV/uaP9Ex/KXlkTZTeddxDPSYQpgvzKLGJke2UU0AzoGCjNIvQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/default-gateway/node_modules/which": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/which/-/which-1.3.1.tgz",
      "integrity": "sha512-HxJdYWq1MTIQbJ3nw0cqssHoTNU267KlrDuGZ1WYlxDStUtKUhOaJmh112/TZmHxxUfuJqPXSOm7tDyas0OSIQ==",
      "dev": true,
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "which": "bin/which"
      }
    },
    "node_modules/define-properties": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.1.3.tgz",
      "integrity": "sha512-3MqfYKj2lLzdMSf8ZIZE/V+Zuy+BgD6f164e8K2w7dgnpKArBDerGYpM46IYYcjnkdPNMjPk9A6VFB8+3SKlXQ==",
      "dev": true,
      "dependencies": {
        "object-keys": "^1.0.12"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/define-property": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/define-property/-/define-property-2.0.2.tgz",
      "integrity": "sha512-jwK2UV4cnPpbcG7+VRARKTZPUWowwXA8bzH5NP6ud0oeAxyYPuGZUAC7hMugpCdz4BeSZl2Dl9k66CHJ/46ZYQ==",
      "dev": true,
      "dependencies": {
        "is-descriptor": "^1.0.2",
        "isobject": "^3.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/del": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/del/-/del-4.1.1.tgz",
      "integrity": "sha512-QwGuEUouP2kVwQenAsOof5Fv8K9t3D8Ca8NxcXKrIpEHjTXK5J2nXLdP+ALI1cgv8wj7KuwBhTwBkOZSJKM5XQ==",
      "dev": true,
      "dependencies": {
        "@types/glob": "^7.1.1",
        "globby": "^6.1.0",
        "is-path-cwd": "^2.0.0",
        "is-path-in-cwd": "^2.0.0",
        "p-map": "^2.0.0",
        "pify": "^4.0.1",
        "rimraf": "^2.6.3"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/depd": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/depd/-/depd-1.1.2.tgz",
      "integrity": "sha1-m81S4UwJd2PnSbJ0xDRu0uVgtak= sha512-7emPTl6Dpo6JRXOXjLRxck+FlLRX5847cLKEn00PLAgc3g2hTZZgr+e4c2v6QpSmLeFP3n5yUo7ft6avBK/5jQ==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/destroy": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/destroy/-/destroy-1.0.4.tgz",
      "integrity": "sha1-l4hXRCxEdJ5CBmE+N5RiBYJqvYA= sha512-3NdhDuEXnfun/z7x9GOElY49LoqVHoGScmOKwmxhsS8N5Y+Z8KyPPDnaSzqWgYt/ji4mqwfTS34Htrk0zPIXVg==",
      "dev": true
    },
    "node_modules/detect-node": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/detect-node/-/detect-node-2.0.5.tgz",
      "integrity": "sha512-qi86tE6hRcFHy8jI1m2VG+LaPUR1LhqDa5G8tVjuUXmOrpuAgqsA1pN0+ldgr3aKUH+QLI9hCY/OcRYisERejw==",
      "dev": true
    },
    "node_modules/dns-equal": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/dns-equal/-/dns-equal-1.0.0.tgz",
      "integrity": "sha1-s55/HabrCnW6nBcySzR1PEfgZU0= sha512-z+paD6YUQsk+AbGCEM4PrOXSss5gd66QfcVBFTKR/HpFL9jCqikS94HYwKww6fQyO7IxrIIyUu+g0Ka9tUS2Cg==",
      "dev": true
    },
    "node_modules/dns-packet": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/dns-packet/-/dns-packet-1.3.1.tgz",
      "integrity": "sha512-0UxfQkMhYAUaZI+xrNZOz/as5KgDU0M/fQ9b6SpkyLbk3GEswDi6PADJVaYJradtRVsRIlF1zLyOodbcTCDzUg==",
      "dev": true,
      "dependencies": {
        "ip": "^1.1.0",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/dns-txt": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/dns-txt/-/dns-txt-2.0.2.tgz",
      "integrity": "sha1-uR2Ab10nGI5Ks+fRB9iBocxGQrY= sha512-Ix5PrWjphuSoUXV/Zv5gaFHjnaJtb02F2+Si3Ht9dyJ87+Z/lMmy+dpNHtTGraNK958ndXq2i+GLkWsWHcKaBQ==",
      "dev": true,
      "dependencies": {
        "buffer-indexof": "^1.0.0"
      }
    },
    "node_modules/dom-converter": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/dom-converter/-/dom-converter-0.2.0.tgz",
      "integrity": "sha512-gd3ypIPfOMr9h5jIKq8E3sHOTCjeirnl0WK5ZdS1AW0Odt0b1PaWaHdJ4Qk4klv+YB9aJBS7mESXjFoDQPu6DA==",
      "dev": true,
      "dependencies": {
        "utila": "~0.4"
      }
    },
    "node_modules/dom-serializer": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/dom-serializer/-/dom-serializer-0.2.2.tgz",
      "integrity": "sha512-2/xPb3ORsQ42nHYiSunXkDjPLBaEj/xTwUO4B7XCZQTRk7EBtTOPaygh10YAAh2OI1Qrp6NWfpAhzswj0ydt9g==",
      "dev": true,
      "dependencies": {
        "domelementtype": "^2.0.1",
        "entities": "^2.0.0"
      }
    },
    "node_modules/dom-serializer/node_modules/domelementtype": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/domelementtype/-/domelementtype-2.2.0.tgz",
      "integrity": "sha512-DtBMo82pv1dFtUmHyr48beiuq792Sxohr+8Hm9zoxklYPfa6n0Z3Byjj2IV7bmr2IyqClnqEQhfgHJJ5QF0R5A==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fb55"
        }
      ]
    },
    "node_modules/domelementtype": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/domelementtype/-/domelementtype-1.3.1.tgz",
      "integrity": "sha512-BSKB+TSpMpFI/HOxCNr1O8aMOTZ8hT3pM3GQ0w/mWRmkhEDSFJkkyzz4XQsBV44BChwGkrDfMyjVD0eA2aFV3w==",
      "dev": true
    },
    "node_modules/domhandler": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/domhandler/-/domhandler-2.4.2.tgz",
      "integrity": "sha512-JiK04h0Ht5u/80fdLMCEmV4zkNh2BcoMFBmZ/91WtYZ8qVXSKjiw7fXMgFPnHcSZgOo3XdinHvmnDUeMf5R4wA==",
      "dev": true,
      "dependencies": {
        "domelementtype": "1"
      }
    },
    "node_modules/domutils": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/domutils/-/domutils-1.7.0.tgz",
      "integrity": "sha512-Lgd2XcJ/NjEw+7tFvfKxOzCYKZsdct5lczQ2ZaQY8Djz7pfAD3Gbp8ySJWtreII/vDlMVmxwa6pHmdxIYgttDg==",
      "dev": true,
      "dependencies": {
        "dom-serializer": "0",
        "domelementtype": "1"
      }
    },
    "node_modules/dot-case": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/dot-case/-/dot-case-3.0.4.tgz",
      "integrity": "sha512-Kv5nKlh6yRrdrGvxeJ2e5y2eRUpkUosIW4A2AS38zwSz27zu7ufDwQPi5Jhs3XAlGNetl3bmnGhQsMtkKJnj3w==",
      "dev": true,
      "dependencies": {
        "no-case": "^3.0.4",
        "tslib": "^2.0.3"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha1-WQxhFWsK4vTwJVcyoViyZrxWsh0= sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "dev": true
    },
    "node_modules/electron-to-chromium": {
      "version": "1.3.707",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.3.707.tgz",
      "integrity": "sha512-BqddgxNPrcWnbDdJw7SzXVzPmp+oiyjVrc7tkQVaznPGSS9SKZatw6qxoP857M+HbOyyqJQwYQtsuFIMSTNSZA=="
    },
    "node_modules/emoji-regex": {
      "version": "7.0.3",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-7.0.3.tgz",
      "integrity": "sha512-CwBLREIQ7LvYFB0WyRvwhq5N5qPhc6PMjD6bYggFlI5YyDgl+0vxq5VHbMOFqLg7hfWzmu8T5Z1QofhmTIhItA==",
      "dev": true
    },
    "node_modules/emojis-list": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/emojis-list/-/emojis-list-3.0.0.tgz",
      "integrity": "sha512-/kyM18EfinwXZbno9FyUGeFh87KC8HRQBQGildHZbEuRyWFOmv1U10o9BBp8XVZDVNNuQKyIGIu5ZYAAXJ0V2Q==",
      "dev": true,
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/encodeurl": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-1.0.2.tgz",
      "integrity": "sha1-rT/0yG7C0CkyL1oCw6mmBslbP1k= sha512-TPJXq8JqFaVYm2CWmPvnP2Iyo4ZSM7/QKcSmuMLDObfpH5fi7RUGmd/rTDf+rut/saiDiQEeVTNgAmJEdAOx0w==",
      "dev": true,
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/end-of-stream": {
      "version": "1.4.4",
      "resolved": "https://registry.npmjs.org/end-of-stream/-/end-of-stream-1.4.4.tgz",
      "integrity": "sha512-+uw1inIHVPQoaVuHzRyXd21icM+cnt4CzD5rW+NC1wjOUSTOs+Te7FOv7AhN7vS9x/oIyhLP5PR1H+phQAHu5Q==",
      "dev": true,
      "dependencies": {
        "once": "^1.4.0"
      }
    },
    "node_modules/enhanced-resolve": {
      "version": "5.7.0",
      "resolved": "https://registry.npmjs.org/enhanced-resolve/-/enhanced-resolve-5.7.0.tgz",
      "integrity": "sha512-6njwt/NsZFUKhM6j9U8hzVyD4E4r0x7NQzhTCbcWOJ0IQjNSAoalWmb0AE51Wn+fwan5qVESWi7t2ToBxs9vrw==",
      "dependencies": {
        "graceful-fs": "^4.2.4",
        "tapable": "^2.2.0"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/enhanced-resolve/node_modules/tapable": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/tapable/-/tapable-2.2.0.tgz",
      "integrity": "sha512-FBk4IesMV1rBxX2tfiK8RAmogtWn53puLOQlvO8XuwlgxcYbP4mVPS9Ph4aeamSyyVjOl24aYWAuc8U5kCVwMw==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/enquirer": {
      "version": "2.3.6",
      "resolved": "https://registry.npmjs.org/enquirer/-/enquirer-2.3.6.tgz",
      "integrity": "sha512-yjNnPr315/FjS4zIsUxYguYUPP2e1NK4d7E7ZOLiyYCcbFBiTMyID+2wvm2w6+pZ/odMA7cRkjhsPbltwBOrLg==",
      "dependencies": {
        "ansi-colors": "^4.1.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/entities": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/entities/-/entities-2.2.0.tgz",
      "integrity": "sha512-p92if5Nz619I0w+akJrLZH0MX0Pb5DX39XOwQTtXSdQQOaYH03S1uIQp4mhOZtAXrxq4ViO67YTiLBo2638o9A==",
      "dev": true,
      "funding": {
        "url": "https://github.com/fb55/entities?sponsor=1"
      }
    },
    "node_modules/envinfo": {
      "version": "7.7.4",
      "resolved": "https://registry.npmjs.org/envinfo/-/envinfo-7.7.4.tgz",
      "integrity": "sha512-TQXTYFVVwwluWSFis6K2XKxgrD22jEv0FTuLCQI+OjH7rn93+iY0fSSFM5lrSxFY+H1+B0/cvvlamr3UsBivdQ==",
      "bin": {
        "envinfo": "dist/cli.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/errno": {
      "version": "0.1.8",
      "resolved": "https://registry.npmjs.org/errno/-/errno-0.1.8.tgz",
      "integrity": "sha512-dJ6oBr5SQ1VSd9qkk7ByRgb/1SH4JZjCHSW/mr63/QcXO9zLVxvJ6Oy13nio03rxpSnVDDjFor75SjVeZWPW/A==",
      "dev": true,
      "dependencies": {
        "prr": "~1.0.1"
      },
      "bin": {
        "errno": "cli.js"
      }
    },
    "node_modules/es-abstract": {
      "version": "1.18.0",
      "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.18.0.tgz",
      "integrity": "sha512-LJzK7MrQa8TS0ja2w3YNLzUgJCGPdPOV1yVvezjNnS89D+VR08+Szt2mz3YB2Dck/+w5tfIq/RoUAFqJJGM2yw==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.2",
        "es-to-primitive": "^1.2.1",
        "function-bind": "^1.1.1",
        "get-intrinsic": "^1.1.1",
        "has": "^1.0.3",
        "has-symbols": "^1.0.2",
        "is-callable": "^1.2.3",
        "is-negative-zero": "^2.0.1",
        "is-regex": "^1.1.2",
        "is-string": "^1.0.5",
        "object-inspect": "^1.9.0",
        "object-keys": "^1.1.1",
        "object.assign": "^4.1.2",
        "string.prototype.trimend": "^1.0.4",
        "string.prototype.trimstart": "^1.0.4",
        "unbox-primitive": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-module-lexer": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/es-module-lexer/-/es-module-lexer-0.4.1.tgz",
      "integrity": "sha512-ooYciCUtfw6/d2w56UVeqHPcoCFAiJdz5XOkYpv/Txl1HMUozpXjz/2RIQgqwKdXNDPSF1W7mJCFse3G+HDyAA=="
    },
    "node_modules/es-to-primitive": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.2.1.tgz",
      "integrity": "sha512-QCOllgZJtaUo9miYBcLChTUaHNjJF3PYs1VidD7AwiEj1kYxKeQTctLAezAOH5ZKRH0g2IgPn6KwB4IT8iRpvA==",
      "dev": true,
      "dependencies": {
        "is-callable": "^1.1.4",
        "is-date-object": "^1.0.1",
        "is-symbol": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/escalade": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.1.1.tgz",
      "integrity": "sha512-k0er2gUkLf8O0zKJiAhmkTnJlTvINGv7ygDNPbeIsX/TJjGJZHuh9B2UxbsaEkmlEo9MfhrSzmhIlhRlI2GXnw==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha1-Aljq5NPQwJdN4cFpGI7wBR0dGYg= sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "dev": true
    },
    "node_modules/escape-string-regexp": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz",
      "integrity": "sha1-G2HAViGQqN/2rjuyzwIAyhMLhtQ= sha512-vbRorB5FUQWvla16U8R/qgaFIya2qGzwDrNmCZuYKrbdSUMG6I1ZCGQRefkRVhuOkIGVne7BQ35DSfo1qvJqFg==",
      "dev": true,
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/eslint-scope": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-5.1.1.tgz",
      "integrity": "sha512-2NxwbF/hZ0KpepYN0cNbo+FN6XoK7GaHlQhgx/hIZl6Va0bF45RQOOwhLIy8lQDbuCiadSLCBnH2CFYquit5bw==",
      "dependencies": {
        "esrecurse": "^4.3.0",
        "estraverse": "^4.1.1"
      },
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/esrecurse": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz",
      "integrity": "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==",
      "dependencies": {
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/esrecurse/node_modules/estraverse": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.2.0.tgz",
      "integrity": "sha512-BxbNGGNm0RyRYvUdHpIwv9IWzeM9XClbOxwoATuFdOE7ZE6wHL+HQ5T8hoPM+zHvmKzzsEqhgy0GrQ5X13afiQ==",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/estraverse": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-4.3.0.tgz",
      "integrity": "sha512-39nnKffWz8xN1BU/2c79n9nB9HDzo0niYUqx6xyqUnyoAnQyyWpOTdZEeiCch8BBu515t4wp9ZmgVfVhn9EBpw==",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/esutils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
      "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha1-Qa4u62XvpiJorr/qg6x9eSmbCIc= sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/eventemitter3": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/eventemitter3/-/eventemitter3-4.0.7.tgz",
      "integrity": "sha512-8guHBZCwKnFhYdHr2ysuRWErTwhoN2X8XELRlrRwpmfeY2jjuUN4taQMsULKUVo1K4DvZl+0pgfyoysHxvmvEw==",
      "dev": true
    },
    "node_modules/events": {
      "version": "3.3.0",
      "resolved": "https://registry.npmjs.org/events/-/events-3.3.0.tgz",
      "integrity": "sha512-mQw+2fkQbALzQ7V0MY0IqdnXNOeTtP4r0lN9z7AAawCXgqea7bDii20AYrIBrFd/Hx0M2Ocz6S111CaFkUcb0Q==",
      "engines": {
        "node": ">=0.8.x"
      }
    },
    "node_modules/eventsource": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/eventsource/-/eventsource-1.1.0.tgz",
      "integrity": "sha512-VSJjT5oCNrFvCS6igjzPAt5hBzQ2qPBFIbJ03zLI9SE0mxwZpMw6BfJrbFHm1a141AavMEB8JHmBhWAd66PfCg==",
      "dev": true,
      "dependencies": {
        "original": "^1.0.0"
      },
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/execa": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/execa/-/execa-5.0.0.tgz",
      "integrity": "sha512-ov6w/2LCiuyO4RLYGdpFGjkcs0wMTgGE8PrkTHikeUy5iJekXyPIKUjifk5CsE0pt7sMCrMZ3YNqoCj6idQOnQ==",
      "dependencies": {
        "cross-spawn": "^7.0.3",
        "get-stream": "^6.0.0",
        "human-signals": "^2.1.0",
        "is-stream": "^2.0.0",
        "merge-stream": "^2.0.0",
        "npm-run-path": "^4.0.1",
        "onetime": "^5.1.2",
        "signal-exit": "^3.0.3",
        "strip-final-newline": "^2.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/execa?sponsor=1"
      }
    },
    "node_modules/expand-brackets": {
      "version": "2.1.4",
      "resolved": "https://registry.npmjs.org/expand-brackets/-/expand-brackets-2.1.4.tgz",
      "integrity": "sha1-t3c14xXOMPa27/D4OwQVGiJEliI= sha512-w/ozOKR9Obk3qoWeY/WDi6MFta9AoMR+zud60mdnbniMcBxRuFJyDt2LdX/14A1UABeqk+Uk+LDfUpvoGKppZA==",
      "dev": true,
      "dependencies": {
        "debug": "^2.3.3",
        "define-property": "^0.2.5",
        "extend-shallow": "^2.0.1",
        "posix-character-classes": "^0.1.0",
        "regex-not": "^1.0.0",
        "snapdragon": "^0.8.1",
        "to-regex": "^3.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/expand-brackets/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/expand-brackets/node_modules/define-property": {
      "version": "0.2.5",
      "resolved": "https://registry.npmjs.org/define-property/-/define-property-0.2.5.tgz",
      "integrity": "sha1-w1se+RjsPJkPmlvFe+BKrOxcgRY= sha512-Rr7ADjQZenceVOAKop6ALkkRAmH1A4Gx9hV/7ZujPUN2rkATqFO0JZLZInbAjpZYoJ1gUx8MRMQVkYemcbMSTA==",
      "dev": true,
      "dependencies": {
        "is-descriptor": "^0.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/expand-brackets/node_modules/is-accessor-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-accessor-descriptor/-/is-accessor-descriptor-0.1.6.tgz",
      "integrity": "sha1-qeEss66Nh2cn7u84Q/igiXtcmNY= sha512-e1BM1qnDbMRG3ll2U9dSK0UMHuWOs3pY3AtcFsmvwPtKL3MML/Q86i+GilLfvqEs4GW+ExB91tQ3Ig9noDIZ+A==",
      "deprecated": "Please upgrade to v0.1.7",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/expand-brackets/node_modules/is-data-descriptor": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/is-data-descriptor/-/is-data-descriptor-0.1.4.tgz",
      "integrity": "sha1-C17mSDiOLIYCgueT8YVv7D8wG1Y= sha512-+w9D5ulSoBNlmw9OHn3U2v51SyoCd0he+bB3xMl62oijhrspxowjU+AIcDY0N3iEJbUEkB15IlMASQsxYigvXg==",
      "deprecated": "Please upgrade to v0.1.5",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/expand-brackets/node_modules/is-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-descriptor/-/is-descriptor-0.1.6.tgz",
      "integrity": "sha512-avDYr0SB3DwO9zsMov0gKCESFYqCnE4hq/4z3TdUlukEy5t9C0YRq7HLrsN52NAcqXKaepeCD0n+B0arnVG3Hg==",
      "dev": true,
      "dependencies": {
        "is-accessor-descriptor": "^0.1.6",
        "is-data-descriptor": "^0.1.4",
        "kind-of": "^5.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/expand-brackets/node_modules/is-descriptor/node_modules/kind-of": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-5.1.0.tgz",
      "integrity": "sha512-NGEErnH6F2vUuXDh+OlbcKW7/wOcfdRHaZ7VWtqCztfHri/++YKmP51OdWeGPuqCOba6kk2OTe5d02VmTB80Pw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/expand-brackets/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g= sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true
    },
    "node_modules/express": {
      "version": "4.17.1",
      "resolved": "https://registry.npmjs.org/express/-/express-4.17.1.tgz",
      "integrity": "sha512-mHJ9O79RqluphRrcw2X/GTh3k9tVv8YcoyY4Kkh4WDMUYKRZUq0h1o0w2rrrxBqM7VoeUVqgb27xlEMXTnYt4g==",
      "dev": true,
      "dependencies": {
        "accepts": "~1.3.7",
        "array-flatten": "1.1.1",
        "body-parser": "1.19.0",
        "content-disposition": "0.5.3",
        "content-type": "~1.0.4",
        "cookie": "0.4.0",
        "cookie-signature": "1.0.6",
        "debug": "2.6.9",
        "depd": "~1.1.2",
        "encodeurl": "~1.0.2",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "finalhandler": "~1.1.2",
        "fresh": "0.5.2",
        "merge-descriptors": "1.0.1",
        "methods": "~1.1.2",
        "on-finished": "~2.3.0",
        "parseurl": "~1.3.3",
        "path-to-regexp": "0.1.7",
        "proxy-addr": "~2.0.5",
        "qs": "6.7.0",
        "range-parser": "~1.2.1",
        "safe-buffer": "5.1.2",
        "send": "0.17.1",
        "serve-static": "1.14.1",
        "setprototypeof": "1.1.1",
        "statuses": "~1.5.0",
        "type-is": "~1.6.18",
        "utils-merge": "1.0.1",
        "vary": "~1.1.2"
      },
      "engines": {
        "node": ">= 0.10.0"
      }
    },
    "node_modules/express/node_modules/array-flatten": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz",
      "integrity": "sha1-ml9pkFGx5wczKPKgCJaLZOopVdI= sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==",
      "dev": true
    },
    "node_modules/express/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/express/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g= sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true
    },
    "node_modules/extend-shallow": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/extend-shallow/-/extend-shallow-2.0.1.tgz",
      "integrity": "sha1-Ua99YUrZqfYQ6huvu5idaxxWiQ8= sha512-zCnTtlxNoAiDc3gqY2aYAWFx7XWWiasuF2K8Me5WbN8otHKTUKBwjPtNpRs/rbUZm7KxWAaNj7P1a/p52GbVug==",
      "dev": true,
      "dependencies": {
        "is-extendable": "^0.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/extglob": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/extglob/-/extglob-2.0.4.tgz",
      "integrity": "sha512-Nmb6QXkELsuBr24CJSkilo6UHHgbekK5UiZgfE6UHD3Eb27YC6oD+bhcT+tJ6cl8dmsgdQxnWlcry8ksBIBLpw==",
      "dev": true,
      "dependencies": {
        "array-unique": "^0.3.2",
        "define-property": "^1.0.0",
        "expand-brackets": "^2.1.4",
        "extend-shallow": "^2.0.1",
        "fragment-cache": "^0.2.1",
        "regex-not": "^1.0.0",
        "snapdragon": "^0.8.1",
        "to-regex": "^3.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/extglob/node_modules/define-property": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/define-property/-/define-property-1.0.0.tgz",
      "integrity": "sha1-dp66rz9KY6rTr56NMEybvnm/sOY= sha512-cZTYKFWspt9jZsMscWo8sc/5lbPC9Q0N5nBLgb+Yd915iL3udB1uFgS3B8YCx66UVHq018DAVFoee7x+gxggeA==",
      "dev": true,
      "dependencies": {
        "is-descriptor": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q=="
    },
    "node_modules/fast-json-stable-stringify": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
      "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw=="
    },
    "node_modules/fastest-levenshtein": {
      "version": "1.0.12",
      "resolved": "https://registry.npmjs.org/fastest-levenshtein/-/fastest-levenshtein-1.0.12.tgz",
      "integrity": "sha512-On2N+BpYJ15xIC974QNVuYGMOlEVt4s0EOI3wwMqOmK1fdDY+FN/zltPV8vosq4ad4c/gJ1KHScUn/6AWIgiow=="
    },
    "node_modules/faye-websocket": {
      "version": "0.11.3",
      "resolved": "https://registry.npmjs.org/faye-websocket/-/faye-websocket-0.11.3.tgz",
      "integrity": "sha512-D2y4bovYpzziGgbHYtGCMjlJM36vAl/y+xUyn1C+FVx8szd1E+86KwVw6XvYSzOP8iMpm1X0I4xJD+QtUb36OA==",
      "dev": true,
      "dependencies": {
        "websocket-driver": ">=0.5.1"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/file-loader": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/file-loader/-/file-loader-6.2.0.tgz",
      "integrity": "sha512-qo3glqyTa61Ytg4u73GultjHGjdRyig3tG6lPtyX/jOEJvHif9uB0/OCI2Kif6ctF3caQTW2G5gym21oAsI4pw==",
      "dev": true,
      "dependencies": {
        "loader-utils": "^2.0.0",
        "schema-utils": "^3.0.0"
      },
      "engines": {
        "node": ">= 10.13.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      },
      "peerDependencies": {
        "webpack": "^4.0.0 || ^5.0.0"
      }
    },
    "node_modules/file-loader/node_modules/loader-utils": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/loader-utils/-/loader-utils-2.0.0.tgz",
      "integrity": "sha512-rP4F0h2RaWSvPEkD7BLDFQnvSf+nK+wr3ESUjNTyAGobqrijmW92zc+SO6d4p4B1wh7+B/Jg1mkQe5NYUEHtHQ==",
      "dev": true,
      "dependencies": {
        "big.js": "^5.2.2",
        "emojis-list": "^3.0.0",
        "json5": "^2.1.2"
      },
      "engines": {
        "node": ">=8.9.0"
      }
    },
    "node_modules/file-loader/node_modules/schema-utils": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/schema-utils/-/schema-utils-3.0.0.tgz",
      "integrity": "sha512-6D82/xSzO094ajanoOSbe4YvXWMfn2A//8Y1+MUqFAJul5Bs+yn36xbK9OtNDcRVSBJ9jjeoXftM6CfztsjOAA==",
      "dev": true,
      "dependencies": {
        "@types/json-schema": "^7.0.6",
        "ajv": "^6.12.5",
        "ajv-keywords": "^3.5.2"
      },
      "engines": {
        "node": ">= 10.13.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/file-uri-to-path": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/file-uri-to-path/-/file-uri-to-path-1.0.0.tgz",
      "integrity": "sha512-0Zt+s3L7Vf1biwWZ29aARiVYLx7iMGnEUl9x33fbB/j3jR81u/O2LbqK+Bm1CDSNDKVtJ/YjwY7TUd5SkeLQLw==",
      "dev": true,
      "optional": true
    },
    "node_modules/fill-range": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-4.0.0.tgz",
      "integrity": "sha1-1USBHUKPmOsGpj3EAtJAPDKMOPc= sha512-VcpLTWqWDiTerugjj8e3+esbg+skS3M9e54UuR3iCeIDMXCLTsAH8hTSzDQU/X6/6t3eYkOKoZSef2PlU6U1XQ==",
      "dev": true,
      "dependencies": {
        "extend-shallow": "^2.0.1",
        "is-number": "^3.0.0",
        "repeat-string": "^1.6.1",
        "to-regex-range": "^2.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/finalhandler": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-1.1.2.tgz",
      "integrity": "sha512-aAWcW57uxVNrQZqFXjITpW3sIUQmHGG3qSb9mUah9MgMC4NeWhNOlNjXEYq3HjRAvL6arUviZGGJsBg6z0zsWA==",
      "dev": true,
      "dependencies": {
        "debug": "2.6.9",
        "encodeurl": "~1.0.2",
        "escape-html": "~1.0.3",
        "on-finished": "~2.3.0",
        "parseurl": "~1.3.3",
        "statuses": "~1.5.0",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/finalhandler/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/finalhandler/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g= sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true
    },
    "node_modules/find-cache-dir": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/find-cache-dir/-/find-cache-dir-3.3.1.tgz",
      "integrity": "sha512-t2GDMt3oGC/v+BMwzmllWDuJF/xcDtE5j/fCGbqDD7OLuJkj0cfh1YSA5VKPvwMeLFLNDBkwOKZ2X85jGLVftQ==",
      "dev": true,
      "dependencies": {
        "commondir": "^1.0.1",
        "make-dir": "^3.0.2",
        "pkg-dir": "^4.1.0"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/avajs/find-cache-dir?sponsor=1"
      }
    },
    "node_modules/find-up": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-4.1.0.tgz",
      "integrity": "sha512-PpOwAdQ/YlXQ2vj8a3h8IipDuYRi3wceVQQGYWxNINccq40Anw7BlsEXCMbt1Zt+OLA6Fq9suIpIWD0OsnISlw==",
      "dependencies": {
        "locate-path": "^5.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/follow-redirects": {
      "version": "1.13.3",
      "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.13.3.tgz",
      "integrity": "sha512-DUgl6+HDzB0iEptNQEXLx/KhTmDb8tZUHSeLqpnjpknR70H0nC2t9N73BK6fN4hOvJ84pKlIQVQ4k5FFlBedKA==",
      "dev": true,
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/RubenVerborgh"
        }
      ],
      "engines": {
        "node": ">=4.0"
      },
      "peerDependenciesMeta": {
        "debug": {
          "optional": true
        }
      }
    },
    "node_modules/for-in": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/for-in/-/for-in-1.0.2.tgz",
      "integrity": "sha1-gQaNKVqBQuwKxybG4iAMMPttXoA= sha512-7EwmXrOjyL+ChxMhmG5lnW9MPt1aIeZEwKhQzoBUdTV0N3zuwWDZYVJatDvZ2OyzPUvdIAZDsCetk3coyMfcnQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/forwarded": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.1.2.tgz",
      "integrity": "sha1-mMI9qxF1ZXuMBXPozszZGw/xjIQ= sha512-Ua9xNhH0b8pwE3yRbFfXJvfdWF0UHNCdeyb2sbi9Ul/M+r3PTdrz7Cv4SCfZRMjmzEM9PhraqfZFbGTIg3OMyA==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fragment-cache": {
      "version": "0.2.1",
      "resolved": "https://registry.npmjs.org/fragment-cache/-/fragment-cache-0.2.1.tgz",
      "integrity": "sha1-QpD60n8T6Jvn8zeZxrxaCr//DRk= sha512-GMBAbW9antB8iZRHLoGw0b3HANt57diZYFO/HL1JGIC1MjKrdmhxvrJbupnVvpys0zsz7yBApXdQyfepKly2kA==",
      "dev": true,
      "dependencies": {
        "map-cache": "^0.2.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/fresh": {
      "version": "0.5.2",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-0.5.2.tgz",
      "integrity": "sha1-PYyt2Q2XZWn6g1qx+OSyOhBWBac= sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fs.realpath": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
      "integrity": "sha1-FQStJSMVjKpA20onh8sBQRmU6k8= sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==",
      "dev": true
    },
    "node_modules/fsevents": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-1.2.13.tgz",
      "integrity": "sha512-oWb1Z6mkHIskLzEJ/XWX0srkpkTQ7vaopMQkyaEIoq0fmtFVxOthb8cCxeT+p3ynTdkk/RZwbgG4brR5BeWECw==",
      "deprecated": "Upgrade to fsevents v2 to mitigate potential security issues",
      "dev": true,
      "hasInstallScript": true,
      "optional": true,
      "os": [
        "darwin"
      ],
      "dependencies": {
        "bindings": "^1.5.0",
        "nan": "^2.12.1"
      },
      "engines": {
        "node": ">= 4.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.1.tgz",
      "integrity": "sha512-yIovAzMX49sF8Yl58fSCWJ5svSLuaibPxXQJFLmBObTuCr0Mf1KiPopGM9NiFjiYBCbfaa2Fh6breQ6ANVTI0A=="
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "dev": true,
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.1.1.tgz",
      "integrity": "sha512-kWZrnVM42QCiEA2Ig1bG8zjoIMOgxWwYCEeNdwY6Tv/cOSeGpcoX4pXHfKUxNKVoArnrEr2e9srnAxxGIraS9Q==",
      "dev": true,
      "dependencies": {
        "function-bind": "^1.1.1",
        "has": "^1.0.3",
        "has-symbols": "^1.0.1"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-stream": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/get-stream/-/get-stream-6.0.0.tgz",
      "integrity": "sha512-A1B3Bh1UmL0bidM/YX2NsCOTnGJePL9rO/M+Mw3m9f2gUpfokS0hi5Eah0WSUEWZdZhIZtMjkIYS7mDfOqNHbg==",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/get-value": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/get-value/-/get-value-2.0.6.tgz",
      "integrity": "sha1-3BXKHGcjh8p2vTesCjlbogQqLCg= sha512-Ln0UQDlxH1BapMu3GPtf7CuYNwRZf2gwCuPqbyG6pB8WfmFpzqcy4xtAaAMUhnNqjMKTiCPZG2oMT3YSx8U2NA==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/glob": {
      "version": "7.1.6",
      "resolved": "https://registry.npmjs.org/glob/-/glob-7.1.6.tgz",
      "integrity": "sha512-LwaxwyZ72Lk7vZINtNNrywX0ZuLyStrdDtabefZKAY5ZGJhVtgdznluResxNmPitE0SAO+O26sWTHeKSI2wMBA==",
      "deprecated": "Glob versions prior to v9 are no longer supported",
      "dev": true,
      "dependencies": {
        "fs.realpath": "^1.0.0",
        "inflight": "^1.0.4",
        "inherits": "2",
        "minimatch": "^3.0.4",
        "once": "^1.3.0",
        "path-is-absolute": "^1.0.0"
      },
      "engines": {
        "node": "*"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/glob-parent": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-3.1.0.tgz",
      "integrity": "sha1-nmr2KZ2NO9K9QEMIMr0RPfkGxa4= sha512-E8Ak/2+dZY6fnzlR7+ueWvhsH1SjHr4jjss4YS/h4py44jY9MhK/VFdaZJAWDz6BbL21KeteKxFSFpq8OS5gVA==",
      "dev": true,
      "dependencies": {
        "is-glob": "^3.1.0",
        "path-dirname": "^1.0.0"
      }
    },
    "node_modules/glob-parent/node_modules/is-glob": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-3.1.0.tgz",
      "integrity": "sha1-e6WuJCF4BKxwcHuWkiVnSGzD6Eo= sha512-UFpDDrPgM6qpnFNI+rh/p3bUaq9hKLZN8bMUWzxmcnZVS3omf4IPK+BrewlnWjO1WmUsMYuSjKh4UJuV4+Lqmw==",
      "dev": true,
      "dependencies": {
        "is-extglob": "^2.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/glob-to-regexp": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/glob-to-regexp/-/glob-to-regexp-0.4.1.tgz",
      "integrity": "sha512-lkX1HJXwyMcprw/5YUZc2s7DrpAiHB21/V+E1rHUrVNokkvB6bqMzT0VfV6/86ZNabt1k14YOIaT7nDvOX3Iiw=="
    },
    "node_modules/globals": {
      "version": "11.12.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-11.12.0.tgz",
      "integrity": "sha512-WOBp/EEGUiIsJSp7wcv/y6MO+lV9UoncWqxuFfm8eBwzWNgyfBd6Gz+IeKQ9jCmyhoH99g15M3T+QaVHFjizVA==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/globby": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/globby/-/globby-6.1.0.tgz",
      "integrity": "sha1-9abXDoOV4hyFj7BInWTfAkJNUGw= sha512-KVbFv2TQtbzCoxAnfD6JcHZTYCzyliEaaeM/gH8qQdkKr5s0OP9scEgvdcngyk7AVdY6YVW/TJHd+lQ/Df3Daw==",
      "dev": true,
      "dependencies": {
        "array-union": "^1.0.1",
        "glob": "^7.0.3",
        "object-assign": "^4.0.1",
        "pify": "^2.0.0",
        "pinkie-promise": "^2.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/globby/node_modules/pify": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz",
      "integrity": "sha1-7RQaasBDqEnqWISY59yosVMw6Qw= sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.6",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.6.tgz",
      "integrity": "sha512-nTnJ528pbqxYanhpDYsi4Rd8MAeaBA67+RZ10CM1m3bTAVFEDcd5AuA4a6W5YkGZ1iNXHzZz8T6TBKLeBuNriQ=="
    },
    "node_modules/handle-thing": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/handle-thing/-/handle-thing-2.0.1.tgz",
      "integrity": "sha512-9Qn4yBxelxoh2Ow62nP+Ka/kMnOXRi8BXnRaUwezLNhqelnN49xKz4F/dPP8OYLxLxq6JDtZb2i9XznUQbNPTg==",
      "dev": true
    },
    "node_modules/has": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/has/-/has-1.0.3.tgz",
      "integrity": "sha512-f2dvO0VU6Oej7RkWJGrehjbzMAjFp5/VKPp5tTpWIV4JHHZK1/BxbFRtf/siA2SWTe09caDmVtYYzWEIbBS4zw==",
      "dependencies": {
        "function-bind": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/has-bigints": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/has-bigints/-/has-bigints-1.0.1.tgz",
      "integrity": "sha512-LSBS2LjbNBTf6287JEbEzvJgftkF5qFkmCo9hDRpAzKhUOlJ+hx8dd4USs00SgsUNwc4617J9ki5YtEClM2ffA==",
      "dev": true,
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-flag": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-3.0.0.tgz",
      "integrity": "sha1-tdRU3CGZriJWmfNGfloH87lVuv0= sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.0.2.tgz",
      "integrity": "sha512-chXa79rL/UC2KlX17jo3vRGz0azaWEx5tGqZg5pO3NUyEJVB17dMruQlzCCOfUvElghKcm5194+BCRvi2Rv/Gw==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-value": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/has-value/-/has-value-1.0.0.tgz",
      "integrity": "sha1-GLKB2lhbHFxR3vJMkw7SmgvmsXc= sha512-IBXk4GTsLYdQ7Rvt+GRBrFSVEkmuOUy4re0Xjd9kJSUQpnTrWR4/y9RpfexN9vkAPMFuQoeWKwqzPozRTlasGw==",
      "dev": true,
      "dependencies": {
        "get-value": "^2.0.6",
        "has-values": "^1.0.0",
        "isobject": "^3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/has-values": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/has-values/-/has-values-1.0.0.tgz",
      "integrity": "sha1-lbC2P+whRmGab+V/51Yo1aOe/k8= sha512-ODYZC64uqzmtfGMEAX/FvZiRyWLpAC3vYnNunURUnkGVTS+mI0smVsWaPydRBsE3g+ok7h960jChO8mFcWlHaQ==",
      "dev": true,
      "dependencies": {
        "is-number": "^3.0.0",
        "kind-of": "^4.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/has-values/node_modules/kind-of": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-4.0.0.tgz",
      "integrity": "sha1-IIE989cSkosgc3hpGkUGb65y3Vc= sha512-24XsCxmEbRwEDbz/qz3stgin8TTzZ1ESR56OMCN0ujYg+vRutNSiOj9bHH9u85DKgXguraugV5sFuvbD4FW/hw==",
      "dev": true,
      "dependencies": {
        "is-buffer": "^1.1.5"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/he": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/he/-/he-1.2.0.tgz",
      "integrity": "sha512-F/1DnUGPopORZi0ni+CvrCgHQ5FyEAHRLSApuYWMmrbSwoN2Mn/7k+Gl38gJnR7yyDZk6WLXwiGod1JOWNDKGw==",
      "dev": true,
      "bin": {
        "he": "bin/he"
      }
    },
    "node_modules/hpack.js": {
      "version": "2.1.6",
      "resolved": "https://registry.npmjs.org/hpack.js/-/hpack.js-2.1.6.tgz",
      "integrity": "sha1-h3dMCUnlE/QuhFdbPEVoH63ioLI= sha512-zJxVehUdMGIKsRaNt7apO2Gqp0BdqW5yaiGHXXmbpvxgBYVZnAql+BJb4RO5ad2MgpbZKn5G6nMnegrH1FcNYQ==",
      "dev": true,
      "dependencies": {
        "inherits": "^2.0.1",
        "obuf": "^1.0.0",
        "readable-stream": "^2.0.1",
        "wbuf": "^1.1.0"
      }
    },
    "node_modules/hpack.js/node_modules/readable-stream": {
      "version": "2.3.7",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-2.3.7.tgz",
      "integrity": "sha512-Ebho8K4jIbHAxnuxi7o42OrZgF/ZTNcsZj6nRKyUmkhLFq8CHItp/fy6hQZuZmP/n3yZ9VBUbp4zz/mX8hmYPw==",
      "dev": true,
      "dependencies": {
        "core-util-is": "~1.0.0",
        "inherits": "~2.0.3",
        "isarray": "~1.0.0",
        "process-nextick-args": "~2.0.0",
        "safe-buffer": "~5.1.1",
        "string_decoder": "~1.1.1",
        "util-deprecate": "~1.0.1"
      }
    },
    "node_modules/hpack.js/node_modules/string_decoder": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.1.1.tgz",
      "integrity": "sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==",
      "dev": true,
      "dependencies": {
        "safe-buffer": "~5.1.0"
      }
    },
    "node_modules/html-entities": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/html-entities/-/html-entities-1.4.0.tgz",
      "integrity": "sha512-8nxjcBcd8wovbeKx7h3wTji4e6+rhaVuPNpMqwWgnHh+N9ToqsCs6XztWRBPQ+UtzsoMAdKZtUENoVzU/EMtZA==",
      "dev": true
    },
    "node_modules/html-minifier-terser": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/html-minifier-terser/-/html-minifier-terser-5.1.1.tgz",
      "integrity": "sha512-ZPr5MNObqnV/T9akshPKbVgyOqLmy+Bxo7juKCfTfnjNniTAMdy4hz21YQqoofMBJD2kdREaqPPdThoR78Tgxg==",
      "dev": true,
      "dependencies": {
        "camel-case": "^4.1.1",
        "clean-css": "^4.2.3",
        "commander": "^4.1.1",
        "he": "^1.2.0",
        "param-case": "^3.0.3",
        "relateurl": "^0.2.7",
        "terser": "^4.6.3"
      },
      "bin": {
        "html-minifier-terser": "cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/html-webpack-plugin": {
      "version": "4.5.2",
      "resolved": "https://registry.npmjs.org/html-webpack-plugin/-/html-webpack-plugin-4.5.2.tgz",
      "integrity": "sha512-q5oYdzjKUIPQVjOosjgvCHQOv9Ett9CYYHlgvJeXG0qQvdSojnBq4vAdQBwn1+yGveAwHCoe/rMR86ozX3+c2A==",
      "dev": true,
      "dependencies": {
        "@types/html-minifier-terser": "^5.0.0",
        "@types/tapable": "^1.0.5",
        "@types/webpack": "^4.41.8",
        "html-minifier-terser": "^5.0.1",
        "loader-utils": "^1.2.3",
        "lodash": "^4.17.20",
        "pretty-error": "^2.1.1",
        "tapable": "^1.1.3",
        "util.promisify": "1.0.0"
      },
      "engines": {
        "node": ">=6.9"
      },
      "peerDependencies": {
        "webpack": "^4.0.0 || ^5.0.0"
      }
    },
    "node_modules/htmlparser2": {
      "version": "3.10.1",
      "resolved": "https://registry.npmjs.org/htmlparser2/-/htmlparser2-3.10.1.tgz",
      "integrity": "sha512-IgieNijUMbkDovyoKObU1DUhm1iwNYE/fuifEoEHfd1oZKZDaONBSkal7Y01shxsM49R4XaMdGez3WnF9UfiCQ==",
      "dev": true,
      "dependencies": {
        "domelementtype": "^1.3.1",
        "domhandler": "^2.3.0",
        "domutils": "^1.5.1",
        "entities": "^1.1.1",
        "inherits": "^2.0.1",
        "readable-stream": "^3.1.1"
      }
    },
    "node_modules/htmlparser2/node_modules/entities": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/entities/-/entities-1.1.2.tgz",
      "integrity": "sha512-f2LZMYl1Fzu7YSBKg+RoROelpOaNrcGmE9AZubeDfrCEia483oW4MI4VyFd5VNHIgQ/7qm1I0wUHK1eJnn2y2w==",
      "dev": true
    },
    "node_modules/http-deceiver": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/http-deceiver/-/http-deceiver-1.2.7.tgz",
      "integrity": "sha1-+nFolEq5pRnTN8sL7HKE3D5yPYc= sha512-LmpOGxTfbpgtGVxJrj5k7asXHCgNZp5nLfp+hWc8QQRqtb7fUy6kRY3BO1h9ddF6yIPYUARgxGOwB42DnxIaNw==",
      "dev": true
    },
    "node_modules/http-errors": {
      "version": "1.7.2",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-1.7.2.tgz",
      "integrity": "sha512-uUQBt3H/cSIVfch6i1EuPNy/YsRSOUBXTVfZ+yR7Zjez3qjBz6i9+i4zjNaoqcoFVI4lQJ5plg63TvGfRSDCRg==",
      "dev": true,
      "dependencies": {
        "depd": "~1.1.2",
        "inherits": "2.0.3",
        "setprototypeof": "1.1.1",
        "statuses": ">= 1.5.0 < 2",
        "toidentifier": "1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/http-errors/node_modules/inherits": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.3.tgz",
      "integrity": "sha1-Yzwsg+PaQqUC9SRmAiSA9CCCYd4= sha512-x00IRNXNy63jwGkJmzPigoySHbaqpNuzKbBOmzK+g2OdZpQ9w+sxCN+VSB3ja7IAge2OP2qpfxTjeNcyjmW1uw==",
      "dev": true
    },
    "node_modules/http-parser-js": {
      "version": "0.5.3",
      "resolved": "https://registry.npmjs.org/http-parser-js/-/http-parser-js-0.5.3.tgz",
      "integrity": "sha512-t7hjvef/5HEK7RWTdUzVUhl8zkEu+LlaE0IYzdMuvbSDipxBRpOn4Uhw8ZyECEa808iVT8XCjzo6xmYt4CiLZg==",
      "dev": true
    },
    "node_modules/http-proxy": {
      "version": "1.18.1",
      "resolved": "https://registry.npmjs.org/http-proxy/-/http-proxy-1.18.1.tgz",
      "integrity": "sha512-7mz/721AbnJwIVbnaSv1Cz3Am0ZLT/UBwkC92VlxhXv/k/BBQfM2fXElQNC27BVGr0uwUpplYPQM9LnaBMR5NQ==",
      "dev": true,
      "dependencies": {
        "eventemitter3": "^4.0.0",
        "follow-redirects": "^1.0.0",
        "requires-port": "^1.0.0"
      },
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/http-proxy-middleware": {
      "version": "0.19.1",
      "resolved": "https://registry.npmjs.org/http-proxy-middleware/-/http-proxy-middleware-0.19.1.tgz",
      "integrity": "sha512-yHYTgWMQO8VvwNS22eLLloAkvungsKdKTLO8AJlftYIKNfJr3GK3zK0ZCfzDDGUBttdGc8xFy1mCitvNKQtC3Q==",
      "dev": true,
      "dependencies": {
        "http-proxy": "^1.17.0",
        "is-glob": "^4.0.0",
        "lodash": "^4.17.11",
        "micromatch": "^3.1.10"
      },
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/human-signals": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/human-signals/-/human-signals-2.1.0.tgz",
      "integrity": "sha512-B4FFZ6q/T2jhhksgkbEW3HBvWIfDW85snkQgawt07S7J5QXTk6BkNV+0yAeZrM5QpMAdYlocGoljn0sJ/WQkFw==",
      "engines": {
        "node": ">=10.17.0"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.4.24",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.4.24.tgz",
      "integrity": "sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==",
      "dev": true,
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/import-local": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/import-local/-/import-local-3.0.2.tgz",
      "integrity": "sha512-vjL3+w0oulAVZ0hBHnxa/Nm5TAurf9YLQJDhqRZyqb+VKGOB6LU8t9H1Nr5CIo16vh9XfJTOoHwU0B71S557gA==",
      "dependencies": {
        "pkg-dir": "^4.2.0",
        "resolve-cwd": "^3.0.0"
      },
      "bin": {
        "import-local-fixture": "fixtures/cli.js"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/inflight": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
      "integrity": "sha1-Sb1jMdfQLQwJvJEKEHW6gWW1bfk= sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==",
      "deprecated": "This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.",
      "dev": true,
      "dependencies": {
        "once": "^1.3.0",
        "wrappy": "1"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "dev": true
    },
    "node_modules/internal-ip": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/internal-ip/-/internal-ip-4.3.0.tgz",
      "integrity": "sha512-S1zBo1D6zcsyuC6PMmY5+55YMILQ9av8lotMx447Bq6SAgo/sDK6y6uUKmuYhW7eacnIhFfsPmCNYdDzsnnDCg==",
      "dev": true,
      "dependencies": {
        "default-gateway": "^4.2.0",
        "ipaddr.js": "^1.9.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/interpret": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/interpret/-/interpret-2.2.0.tgz",
      "integrity": "sha512-Ju0Bz/cEia55xDwUWEa8+olFpCiQoypjnQySseKtmjNrnps3P+xfpUmGr90T7yjlVJmOtybRvPXhKMbHr+fWnw==",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/ip": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/ip/-/ip-1.1.5.tgz",
      "integrity": "sha1-vd7XARQpCCjAoDnnLvJfWq7ENUo= sha512-rBtCAQAJm8A110nbwn6YdveUnuZH3WrC36IwkRXxDnq53JvXA2NVQvB7IHyKomxK1MJ4VDNw3UtFDdXQ+AvLYA==",
      "dev": true
    },
    "node_modules/ip-regex": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/ip-regex/-/ip-regex-2.1.0.tgz",
      "integrity": "sha1-+ni/XS5pE8kRzp+BnuUUa7bYROk= sha512-58yWmlHpp7VYfcdTwMTvwMmqx/Elfxjd9RXTDyMsbL7lLWmhMylLEqiYVLKuLzOZqVgiWXD9MfR62Vv89VRxkw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "dev": true,
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-absolute-url": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/is-absolute-url/-/is-absolute-url-3.0.3.tgz",
      "integrity": "sha512-opmNIX7uFnS96NtPmhWQgQx6/NYFgsUXYMllcfzwWKUMwfo8kku1TvE6hkNcH+Q1ts5cMVrsY7j0bxXQDciu9Q==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-accessor-descriptor": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-accessor-descriptor/-/is-accessor-descriptor-1.0.0.tgz",
      "integrity": "sha512-m5hnHTkcVsPfqx3AKlyttIPb7J+XykHvJP2B9bZDjlhLIoEq4XoK64Vg7boZlVWYK6LUY94dYPEE7Lh0ZkZKcQ==",
      "deprecated": "Please upgrade to v1.0.1",
      "dev": true,
      "dependencies": {
        "kind-of": "^6.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-accessor-descriptor/node_modules/kind-of": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-6.0.3.tgz",
      "integrity": "sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-arguments": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-arguments/-/is-arguments-1.1.0.tgz",
      "integrity": "sha512-1Ij4lOMPl/xB5kBDn7I+b2ttPMKa8szhEIrXDuXQD/oe3HJLTLhqhgGspwgyGd6MOywBUqVvYicF72lkgDnIHg==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bigint": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/is-bigint/-/is-bigint-1.0.1.tgz",
      "integrity": "sha512-J0ELF4yHFxHy0cmSxZuheDOz2luOdVvqjwmEcj8H/L1JHeuEDSDbeRP+Dk9kFVk5RTFzbucJ2Kb9F7ixY2QaCg==",
      "dev": true,
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-binary-path": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-1.0.1.tgz",
      "integrity": "sha1-dfFmQrSA8YenEcgUFh/TpKdlWJg= sha512-9fRVlXc0uCxEDj1nQzaWONSpbTfx0FmJfzHF7pwlI8DkWGoHBBea4Pg5Ky0ojwwxQmnSifgbKkI06Qv0Ljgj+Q==",
      "dev": true,
      "dependencies": {
        "binary-extensions": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-boolean-object": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.1.0.tgz",
      "integrity": "sha512-a7Uprx8UtD+HWdyYwnD1+ExtTgqQtD2k/1yJgtXP6wnMm8byhkoTZRl+95LLThpzNZJ5aEvi46cdH+ayMFRwmA==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-buffer": {
      "version": "1.1.6",
      "resolved": "https://registry.npmjs.org/is-buffer/-/is-buffer-1.1.6.tgz",
      "integrity": "sha512-NcdALwpXkTm5Zvvbk7owOUSvVvBKDgKP5/ewfXEznmQFfs4ZRmanOeKBTjRVjka3QFoN6XJ+9F3USqfHqTaU5w==",
      "dev": true
    },
    "node_modules/is-callable": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.3.tgz",
      "integrity": "sha512-J1DcMe8UYTBSrKezuIUTUwjXsho29693unXM2YhJUTR2txK/eG47bvNa/wipPFmZFgr/N6f1GA66dv0mEyTIyQ==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.2.0.tgz",
      "integrity": "sha512-XRAfAdyyY5F5cOXn7hYQDqh2Xmii+DEfIcQGxK/uNwMHhIkPWO0g8msXcbzLe+MpGoR951MlqM/2iIlU4vKDdQ==",
      "dependencies": {
        "has": "^1.0.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-data-descriptor": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-data-descriptor/-/is-data-descriptor-1.0.0.tgz",
      "integrity": "sha512-jbRXy1FmtAoCjQkVmIVYwuuqDFUbaOeDjmed1tOGPrsMhtJA4rD9tkgA0F1qJ3gRFRXcHYVkdeaP50Q5rE/jLQ==",
      "deprecated": "Please upgrade to v1.0.1",
      "dev": true,
      "dependencies": {
        "kind-of": "^6.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-data-descriptor/node_modules/kind-of": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-6.0.3.tgz",
      "integrity": "sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-date-object": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.0.2.tgz",
      "integrity": "sha512-USlDT524woQ08aoZFzh3/Z6ch9Y/EWXEHQ/AaRN0SkKq4t2Jw2R2339tSXmwuVoY7LLlBCbOIlx2myP/L5zk0g==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-descriptor": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-descriptor/-/is-descriptor-1.0.2.tgz",
      "integrity": "sha512-2eis5WqQGV7peooDyLmNEPUrps9+SXX5c9pL3xEB+4e9HnGuDa7mB7kHxHw4CbqS9k1T2hOH3miL8n8WtiYVtg==",
      "dev": true,
      "dependencies": {
        "is-accessor-descriptor": "^1.0.0",
        "is-data-descriptor": "^1.0.0",
        "kind-of": "^6.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-descriptor/node_modules/kind-of": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-6.0.3.tgz",
      "integrity": "sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-extendable": {
      "version": "0.1.1",
      "resolved": "https://registry.npmjs.org/is-extendable/-/is-extendable-0.1.1.tgz",
      "integrity": "sha1-YrEQ4omkcUGOPsNqYX1HLjAd/Ik= sha512-5BMULNob1vgFX6EjQw5izWDxrecWK9AM72rugNr0TFldMOi0fj6Jk+zeKIt0xGj4cEfQIJth4w3OKWOJ4f+AFw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha1-qIwCU1eR8C7TfHahueqXc8gz+MI= sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-2.0.0.tgz",
      "integrity": "sha1-o7MKXE8ZkYMWeqq5O+764937ZU8= sha512-VHskAKYM8RfSFXwee5t5cbN5PZeq1Wrh6qd5bkyiXIf6UQcN6w/A0eXM9r6t8d+GYOh+o6ZhiEnb88LN/Y8m2w==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.1.tgz",
      "integrity": "sha512-5G0tKtBTFImOqDnLB2hG6Bp2qcKEFduo4tZu9MT/H6NQv/ghhy30o55ufafxJ/LdH79LLs2Kfrn85TLKyA7BUg==",
      "dev": true,
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-negative-zero": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.1.tgz",
      "integrity": "sha512-2z6JzQvZRa9A2Y7xC6dQQm4FSTSTNWjKIYYTt4246eMTJmIo0Q+ZyOsU66X8lxK1AbB92dFeglPLrhwpeRKO6w==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-number": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-3.0.0.tgz",
      "integrity": "sha1-JP1iAaR4LPUFYcgQJ2r8fRLXEZU= sha512-4cboCqIpliH+mAvFNegjZQ4kgKc3ZUhQVr3HvWbSh5q3WH2v82ct+T2Y1hdU5Gdtorx/cLifQjqCbL7bpznLTg==",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-number-object": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/is-number-object/-/is-number-object-1.0.4.tgz",
      "integrity": "sha512-zohwelOAur+5uXtk8O3GPQ1eAcu4ZX3UwxQhUlfFFMNpUd83gXgjbhJh6HmB6LUNV/ieOLQuDwJO3dWJosUeMw==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-path-cwd": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/is-path-cwd/-/is-path-cwd-2.2.0.tgz",
      "integrity": "sha512-w942bTcih8fdJPJmQHFzkS76NEP8Kzzvmw92cXsazb8intwLqPibPPdXf4ANdKV3rYMuuQYGIWtvz9JilB3NFQ==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/is-path-in-cwd": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-path-in-cwd/-/is-path-in-cwd-2.1.0.tgz",
      "integrity": "sha512-rNocXHgipO+rvnP6dk3zI20RpOtrAM/kzbB258Uw5BWr3TpXi861yzjo16Dn4hUox07iw5AyeMLHWsujkjzvRQ==",
      "dev": true,
      "dependencies": {
        "is-path-inside": "^2.1.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/is-path-inside": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-path-inside/-/is-path-inside-2.1.0.tgz",
      "integrity": "sha512-wiyhTzfDWsvwAW53OBWF5zuvaOGlZ6PwYxAbPVDhpm+gM09xKQGjBq/8uYN12aDvMxnAnq3dxTyoSoRNmg5YFg==",
      "dev": true,
      "dependencies": {
        "path-is-inside": "^1.0.2"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/is-plain-object": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/is-plain-object/-/is-plain-object-2.0.4.tgz",
      "integrity": "sha512-h5PpgXkWitc38BBMYawTYMWJHFZJVnBquFE57xFpjB8pJFiF6gZ+bU+WyI/yqXiFR5mdLsgYNaPe8uao6Uv9Og==",
      "dependencies": {
        "isobject": "^3.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-regex": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.1.2.tgz",
      "integrity": "sha512-axvdhb5pdhEVThqJzYXwMlVuZwC+FF2DpcOhTS+y/8jVq4trxyPgfcwIxIKiyeuLlSQYKkmUaPQJ8ZE4yNKXDg==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.2",
        "has-symbols": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-stream": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-stream/-/is-stream-2.0.0.tgz",
      "integrity": "sha512-XCoy+WlUr7d1+Z8GgSuXmpuUFC9fOhRXglJMx+dwLKTkL44Cjd4W1Z5P+BQZpr+cR93aGP4S/s7Ftw6Nd/kiEw==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-string": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/is-string/-/is-string-1.0.5.tgz",
      "integrity": "sha512-buY6VNRjhQMiF1qWDouloZlQbRhDPCebwxSjxMjxgemYT46YMd2NR0/H+fBhEfWX4A/w9TBJ+ol+okqJKFE6vQ==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-symbol": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.0.3.tgz",
      "integrity": "sha512-OwijhaRSgqvhm/0ZdAcXNZt9lYdKFpcRDT5ULUuYXPoT794UNOdU+gpT6Rzo7b4V2HUl/op6GqY894AZwv9faQ==",
      "dev": true,
      "dependencies": {
        "has-symbols": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-windows": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-windows/-/is-windows-1.0.2.tgz",
      "integrity": "sha512-eXK1UInq2bPmjyX6e3VHIzMLobc4J94i4AWn+Hpq3OU5KkrRC96OAcR3PRJ/pGu6m8TRnBHP9dkXQVsT/COVIA==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-wsl": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-wsl/-/is-wsl-1.1.0.tgz",
      "integrity": "sha1-HxbkqiKwTRM2tmGIpmrzxgDDpm0= sha512-gfygJYZ2gLTDlmbWMI0CE2MwnFzSN/2SZfkMlItC4K/JBlsWVDB0bO6XhqcY13YXE7iMcAJnzTCJjPiTeJJ0Mw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/isarray": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/isarray/-/isarray-1.0.0.tgz",
      "integrity": "sha1-u5NdSFgsuhaMBoNJV6VKPgcSTxE= sha512-VLghIWNM6ELQzo7zwmcg0NmTVyWKYjvIeM83yjp0wRDTmUnrM678fQbcKBo6n2CJEF0szoG//ytg+TKla89ALQ==",
      "dev": true
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha1-6PvzdNxVb/iUehDcsFctYz8s+hA= sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw=="
    },
    "node_modules/isobject": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/isobject/-/isobject-3.0.1.tgz",
      "integrity": "sha1-TkMekrEalzFjaqH5yNHMvP2reN8= sha512-WhB9zCku7EGTj/HQQRz5aUQEUeoQZH2bWcltRErOpymJ4boYE6wL9Tbr23krRPSZ+C5zqNSrSw+Cc7sZZ4b7vg==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/jest-worker": {
      "version": "26.6.2",
      "resolved": "https://registry.npmjs.org/jest-worker/-/jest-worker-26.6.2.tgz",
      "integrity": "sha512-KWYVV1c4i+jbMpaBC+U++4Va0cp8OisU185o73T1vo99hqi7w8tSJfUXYswwqqrjzwxa6KpRK54WhPvwf5w6PQ==",
      "dependencies": {
        "@types/node": "*",
        "merge-stream": "^2.0.0",
        "supports-color": "^7.0.0"
      },
      "engines": {
        "node": ">= 10.13.0"
      }
    },
    "node_modules/jest-worker/node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/jest-worker/node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "dev": true
    },
    "node_modules/jsesc": {
      "version": "2.5.2",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-2.5.2.tgz",
      "integrity": "sha512-OYu7XEzjkCQ3C5Ps3QIZsQfNpqoJyZZA99wd9aWd05NCtC5pWOkShK2mkL6HXQR6/Cy2lbNdPlZBpuQHXE63gA==",
      "dev": true,
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/json-parse-better-errors": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/json-parse-better-errors/-/json-parse-better-errors-1.0.2.tgz",
      "integrity": "sha512-mrqyZKfX5EhL7hvqcV6WG1yYjnjeuYDzDhhcAAUrq8Po85NBQBJP+ZDUT75qZQ98IkUoBqdkExkukOU7Ts2wrw=="
    },
    "node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg=="
    },
    "node_modules/json3": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/json3/-/json3-3.3.3.tgz",
      "integrity": "sha512-c7/8mbUsKigAbLkD5B010BK4D9LZm7A1pNItkEwiUZRpIN66exu/e7YQWysGun+TRKaJp8MhemM+VkfWv42aCA==",
      "dev": true
    },
    "node_modules/json5": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.0.tgz",
      "integrity": "sha512-f+8cldu7X/y7RAJurMEJmdoKXGB/X550w2Nr3tTbezL6RwEE/iMcm+tZnXeoZtKuOq6ft8+CqzEkrIgx1fPoQA==",
      "dev": true,
      "dependencies": {
        "minimist": "^1.2.5"
      },
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/killable": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/killable/-/killable-1.0.1.tgz",
      "integrity": "sha512-LzqtLKlUwirEUyl/nicirVmNiPvYs7l5n8wOPP7fyJVpUPkvCnW/vuiXGpylGUlnPDnB7311rARzAt3Mhswpjg==",
      "dev": true
    },
    "node_modules/kind-of": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-3.2.2.tgz",
      "integrity": "sha1-MeohpzS6ubuw8yRm2JOupR5KPGQ= sha512-NOW9QQXMoZGg/oqnVNoNTTIFEIid1627WCffUBJEdMxYApq7mNE7CpzucIPc+ZQg25Phej7IJSmX3hO+oblOtQ==",
      "dev": true,
      "dependencies": {
        "is-buffer": "^1.1.5"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/loader-runner": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/loader-runner/-/loader-runner-4.2.0.tgz",
      "integrity": "sha512-92+huvxMvYlMzMt0iIOukcwYBFpkYJdpl2xsZ7LrlayO7E8SOv+JJUEK17B/dJIHAOLMfh2dZZ/Y18WgmGtYNw==",
      "engines": {
        "node": ">=6.11.5"
      }
    },
    "node_modules/loader-utils": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loader-utils/-/loader-utils-1.4.0.tgz",
      "integrity": "sha512-qH0WSMBtn/oHuwjy/NucEgbx5dbxxnxup9s4PVXJUDHZBQY+s0NWA9rJf53RBnQZxfch7euUui7hpoAPvALZdA==",
      "dev": true,
      "dependencies": {
        "big.js": "^5.2.2",
        "emojis-list": "^3.0.0",
        "json5": "^1.0.1"
      },
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/loader-utils/node_modules/json5": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/json5/-/json5-1.0.1.tgz",
      "integrity": "sha512-aKS4WQjPenRxiQsC93MNfjx+nbF4PAdYzmd/1JIj8HYzqfbu86beTuNgXDzPknWk0n0uARlyewZo4s++ES36Ow==",
      "dev": true,
      "dependencies": {
        "minimist": "^1.2.0"
      },
      "bin": {
        "json5": "lib/cli.js"
      }
    },
    "node_modules/locate-path": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-5.0.0.tgz",
      "integrity": "sha512-t7hw9pI+WvuwNJXwk5zVHpyhIqzg2qTlklJOf0mVxGSbe3Fp2VieZcduNYjaLDoy6p9uGpQEGWG87WpMKlNq8g==",
      "dependencies": {
        "p-locate": "^4.1.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/lodash": {
      "version": "4.17.21",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==",
      "dev": true
    },
    "node_modules/lodash.debounce": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/lodash.debounce/-/lodash.debounce-4.0.8.tgz",
      "integrity": "sha1-gteb/zCmfEAF/9XiUVMArZyk168= sha512-FT1yDzDYEoYWhnSGnpE/4Kj1fLZkDFyqRb7fNt6FdYOSxlUWAtp42Eh6Wb0rGIv/m9Bgo7x4GhQbm5Ys4SG5ow==",
      "dev": true
    },
    "node_modules/loglevel": {
      "version": "1.7.1",
      "resolved": "https://registry.npmjs.org/loglevel/-/loglevel-1.7.1.tgz",
      "integrity": "sha512-Hesni4s5UkWkwCGJMQGAh71PaLUmKFM60dHvq0zi/vDhhrzuk+4GgNbTXJ12YYQJn6ZKBDNIjYcuQGKudvqrIw==",
      "dev": true,
      "engines": {
        "node": ">= 0.6.0"
      },
      "funding": {
        "type": "tidelift",
        "url": "https://tidelift.com/funding/github/npm/loglevel"
      }
    },
    "node_modules/lower-case": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/lower-case/-/lower-case-2.0.2.tgz",
      "integrity": "sha512-7fm3l3NAF9WfN6W3JOmf5drwpVqX78JtoGJ3A6W0a6ZnldM41w2fV5D490psKFTpMds8TJse/eHLFFsNHHjHgg==",
      "dev": true,
      "dependencies": {
        "tslib": "^2.0.3"
      }
    },
    "node_modules/make-dir": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/make-dir/-/make-dir-3.1.0.tgz",
      "integrity": "sha512-g3FeP20LNwhALb/6Cz6Dd4F2ngze0jz7tbzrD2wAV+o9FeNHe4rL+yK2md0J/fiSf1sa1ADhXqi5+oVwOM/eGw==",
      "dev": true,
      "dependencies": {
        "semver": "^6.0.0"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/map-cache": {
      "version": "0.2.2",
      "resolved": "https://registry.npmjs.org/map-cache/-/map-cache-0.2.2.tgz",
      "integrity": "sha1-wyq9C9ZSXZsFFkW7TyasXcmKDb8= sha512-8y/eV9QQZCiyn1SprXSrCmqJN0yNRATe+PO8ztwqrvrbdRLA3eYJF0yaR0YayLWkMbsQSKWS9N2gPcGEc4UsZg==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/map-visit": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/map-visit/-/map-visit-1.0.0.tgz",
      "integrity": "sha1-7Nyo8TFE5mDxtb1B8S80edmN+48= sha512-4y7uGv8bd2WdM9vpQsiQNo41Ln1NvhvDRuVt0k2JZQ+ezN2uaQes7lZeZ+QQUHOLQAtDaBJ+7wCbi+ab/KFs+w==",
      "dev": true,
      "dependencies": {
        "object-visit": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/media-typer": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-0.3.0.tgz",
      "integrity": "sha1-hxDXrwqmJvj/+hzgAWhUUmMlV0g= sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/memory-fs": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/memory-fs/-/memory-fs-0.4.1.tgz",
      "integrity": "sha1-OpoguEYlI+RHz7x+i7gO1me/xVI= sha512-cda4JKCxReDXFXRqOHPQscuIYg1PvxbE2S2GP45rnwfEK+vZaXC8C1OFvdHIbgw0DLzowXGVoxLaAmlgRy14GQ==",
      "dev": true,
      "dependencies": {
        "errno": "^0.1.3",
        "readable-stream": "^2.0.1"
      }
    },
    "node_modules/memory-fs/node_modules/readable-stream": {
      "version": "2.3.7",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-2.3.7.tgz",
      "integrity": "sha512-Ebho8K4jIbHAxnuxi7o42OrZgF/ZTNcsZj6nRKyUmkhLFq8CHItp/fy6hQZuZmP/n3yZ9VBUbp4zz/mX8hmYPw==",
      "dev": true,
      "dependencies": {
        "core-util-is": "~1.0.0",
        "inherits": "~2.0.3",
        "isarray": "~1.0.0",
        "process-nextick-args": "~2.0.0",
        "safe-buffer": "~5.1.1",
        "string_decoder": "~1.1.1",
        "util-deprecate": "~1.0.1"
      }
    },
    "node_modules/memory-fs/node_modules/string_decoder": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.1.1.tgz",
      "integrity": "sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==",
      "dev": true,
      "dependencies": {
        "safe-buffer": "~5.1.0"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-1.0.1.tgz",
      "integrity": "sha1-sAqqVW3YtEVoFQ7J0blT8/kMu2E= sha512-cCi6g3/Zr1iqQi6ySbseM1Xvooa98N0w31jzUYrXPX2xqObmFGHJ0tQ5u74H3mVh7wLouTseZyYIq39g8cNp1w==",
      "dev": true
    },
    "node_modules/merge-stream": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-stream/-/merge-stream-2.0.0.tgz",
      "integrity": "sha512-abv/qOcuPfk3URPfDzmZU1LKmuw8kT+0nIHvKrKgFrwifol/doWcdA4ZqsWQ8ENrFKkd67Mfpo/LovbIUsbt3w=="
    },
    "node_modules/methods": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/methods/-/methods-1.1.2.tgz",
      "integrity": "sha1-VSmk1nZUE07cxSZmVoNbD4Ua/O4= sha512-iclAHeNqNm68zFtnZ0e+1L2yUIdvzNoauKU4WBA3VvH/vPFieF7qfRlwUZU+DA9P9bPXIS90ulxoUoCH23sV2w==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/micromatch": {
      "version": "3.1.10",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-3.1.10.tgz",
      "integrity": "sha512-MWikgl9n9M3w+bpsY3He8L+w9eF9338xRl8IAO5viDizwSzziFEyUzo2xrrloB64ADbTf8uA8vRqqttDTOmccg==",
      "dev": true,
      "dependencies": {
        "arr-diff": "^4.0.0",
        "array-unique": "^0.3.2",
        "braces": "^2.3.1",
        "define-property": "^2.0.2",
        "extend-shallow": "^3.0.2",
        "extglob": "^2.0.4",
        "fragment-cache": "^0.2.1",
        "kind-of": "^6.0.2",
        "nanomatch": "^1.2.9",
        "object.pick": "^1.3.0",
        "regex-not": "^1.0.0",
        "snapdragon": "^0.8.1",
        "to-regex": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/micromatch/node_modules/extend-shallow": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend-shallow/-/extend-shallow-3.0.2.tgz",
      "integrity": "sha1-Jqcarwc7OfshJxcnRhMcJwQCjbg= sha512-BwY5b5Ql4+qZoefgMj2NUmx+tehVTH/Kf4k1ZEtOHNFcm2wSxMRo992l6X3TIgni2eZVTZ85xMOjF31fwZAj6Q==",
      "dev": true,
      "dependencies": {
        "assign-symbols": "^1.0.0",
        "is-extendable": "^1.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/micromatch/node_modules/is-extendable": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/is-extendable/-/is-extendable-1.0.1.tgz",
      "integrity": "sha512-arnXMxT1hhoKo9k1LZdmlNyJdDDfy2v0fXjFlmok4+i8ul/6WlbVge9bhM74OpNPQPMGUToDtz+KXa1PneJxOA==",
      "dev": true,
      "dependencies": {
        "is-plain-object": "^2.0.4"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/micromatch/node_modules/kind-of": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-6.0.3.tgz",
      "integrity": "sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/mime": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-1.6.0.tgz",
      "integrity": "sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==",
      "dev": true,
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/mime-db": {
      "version": "1.47.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.47.0.tgz",
      "integrity": "sha512-QBmA/G2y+IfeS4oktet3qRZ+P5kPhCKRXxXnQEudYqUaEioAU1/Lq2us3D/t1Jfo4hE9REQPrbB7K5sOczJVIw==",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.30",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.30.tgz",
      "integrity": "sha512-crmjA4bLtR8m9qLpHvgxSChT+XoSlZi8J4n/aIdn3z92e/U47Z0V/yl+Wh9W046GgFVAmoNR/fmdbZYcSSIUeg==",
      "dependencies": {
        "mime-db": "1.47.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mimic-fn": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/mimic-fn/-/mimic-fn-2.1.0.tgz",
      "integrity": "sha512-OqbOk5oEQeAZ8WXWydlu9HJjz9WVdEIvamMCcXmuqUYjTknH/sqsWvhQ3vgwKFRR1HpjvNBKQ37nbJgYzGqGcg==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/minimalistic-assert": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/minimalistic-assert/-/minimalistic-assert-1.0.1.tgz",
      "integrity": "sha512-UtJcAD4yEaGtjPezWuO9wC4nwUnVH/8/Im3yEHQP4b67cXlD/Qr9hdITCU1xDbSEXg2XKNaP8jsReV7vQd00/A==",
      "dev": true
    },
    "node_modules/minimatch": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.0.4.tgz",
      "integrity": "sha512-yJHVQEhyqPLUTgt9B83PXu6W3rx4MvvHvSUvToogpwoGDOUQ+yDrR0HRot+yOCdCO7u4hX3pWft6kWBBcqh0UA==",
      "dev": true,
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.5.tgz",
      "integrity": "sha512-FM9nNUYrRBAELZQT3xeZQ7fmMOBg6nWNmJKTcgsJeaLstP/UODVpGsr5OhXhhXg6f+qtJ8uiZ+PUxkDWcgIXLw==",
      "dev": true
    },
    "node_modules/mixin-deep": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/mixin-deep/-/mixin-deep-1.3.2.tgz",
      "integrity": "sha512-WRoDn//mXBiJ1H40rqa3vH0toePwSsGb45iInWlTySa+Uu4k3tYUSxa2v1KqAiLtvlrSzaExqS1gtk96A9zvEA==",
      "dev": true,
      "dependencies": {
        "for-in": "^1.0.2",
        "is-extendable": "^1.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/mixin-deep/node_modules/is-extendable": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/is-extendable/-/is-extendable-1.0.1.tgz",
      "integrity": "sha512-arnXMxT1hhoKo9k1LZdmlNyJdDDfy2v0fXjFlmok4+i8ul/6WlbVge9bhM74OpNPQPMGUToDtz+KXa1PneJxOA==",
      "dev": true,
      "dependencies": {
        "is-plain-object": "^2.0.4"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/mkdirp": {
      "version": "0.5.5",
      "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-0.5.5.tgz",
      "integrity": "sha512-NKmAlESf6jMGym1++R0Ra7wvhV+wFW63FaSOFPwRahvea0gMUcGUhVeAg/0BC0wiv9ih5NYPB1Wn1UEI1/L+xQ==",
      "dev": true,
      "dependencies": {
        "minimist": "^1.2.5"
      },
      "bin": {
        "mkdirp": "bin/cmd.js"
      }
    },
    "node_modules/ms": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.2.tgz",
      "integrity": "sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==",
      "dev": true
    },
    "node_modules/multicast-dns": {
      "version": "6.2.3",
      "resolved": "https://registry.npmjs.org/multicast-dns/-/multicast-dns-6.2.3.tgz",
      "integrity": "sha512-ji6J5enbMyGRHIAkAOu3WdV8nggqviKCEKtXcOqfphZZtQrmHKycfynJ2V7eVPUA4NhJ6V7Wf4TmGbTwKE9B6g==",
      "dev": true,
      "dependencies": {
        "dns-packet": "^1.3.1",
        "thunky": "^1.0.2"
      },
      "bin": {
        "multicast-dns": "cli.js"
      }
    },
    "node_modules/multicast-dns-service-types": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/multicast-dns-service-types/-/multicast-dns-service-types-1.1.0.tgz",
      "integrity": "sha1-iZ8R2WhuXgXLkbNdXw5jt3PPyQE= sha512-cnAsSVxIDsYt0v7HmC0hWZFwwXSh+E6PgCrREDuN/EsjgLwA5XRmlMHhSiDPrt6HxY1gTivEa/Zh7GtODoLevQ==",
      "dev": true
    },
    "node_modules/nan": {
      "version": "2.14.2",
      "resolved": "https://registry.npmjs.org/nan/-/nan-2.14.2.tgz",
      "integrity": "sha512-M2ufzIiINKCuDfBSAUr1vWQ+vuVcA9kqx8JJUsbQi6yf1uGRyb7HfpdfUr5qLXf3B/t8dPvcjhKMmlfnP47EzQ==",
      "dev": true,
      "optional": true
    },
    "node_modules/nanomatch": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/nanomatch/-/nanomatch-1.2.13.tgz",
      "integrity": "sha512-fpoe2T0RbHwBTBUOftAfBPaDEi06ufaUai0mE6Yn1kacc3SnTErfb/h+X94VXzI64rKFHYImXSvdwGGCmwOqCA==",
      "dev": true,
      "dependencies": {
        "arr-diff": "^4.0.0",
        "array-unique": "^0.3.2",
        "define-property": "^2.0.2",
        "extend-shallow": "^3.0.2",
        "fragment-cache": "^0.2.1",
        "is-windows": "^1.0.2",
        "kind-of": "^6.0.2",
        "object.pick": "^1.3.0",
        "regex-not": "^1.0.0",
        "snapdragon": "^0.8.1",
        "to-regex": "^3.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/nanomatch/node_modules/extend-shallow": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend-shallow/-/extend-shallow-3.0.2.tgz",
      "integrity": "sha1-Jqcarwc7OfshJxcnRhMcJwQCjbg= sha512-BwY5b5Ql4+qZoefgMj2NUmx+tehVTH/Kf4k1ZEtOHNFcm2wSxMRo992l6X3TIgni2eZVTZ85xMOjF31fwZAj6Q==",
      "dev": true,
      "dependencies": {
        "assign-symbols": "^1.0.0",
        "is-extendable": "^1.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/nanomatch/node_modules/is-extendable": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/is-extendable/-/is-extendable-1.0.1.tgz",
      "integrity": "sha512-arnXMxT1hhoKo9k1LZdmlNyJdDDfy2v0fXjFlmok4+i8ul/6WlbVge9bhM74OpNPQPMGUToDtz+KXa1PneJxOA==",
      "dev": true,
      "dependencies": {
        "is-plain-object": "^2.0.4"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/nanomatch/node_modules/kind-of": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-6.0.3.tgz",
      "integrity": "sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/negotiator": {
      "version": "0.6.2",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.2.tgz",
      "integrity": "sha512-hZXc7K2e+PgeI1eDBe/10Ard4ekbfrrqG8Ep+8Jmf4JID2bNg7NvCPOZN+kfF574pFQI7mum2AUqDidoKqcTOw==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/neo-async": {
      "version": "2.6.2",
      "resolved": "https://registry.npmjs.org/neo-async/-/neo-async-2.6.2.tgz",
      "integrity": "sha512-Yd3UES5mWCSqR+qNT93S3UoYUkqAZ9lLg8a7g9rimsWmYGK8cVToA4/sF3RrshdyV3sAGMXVUmpMYOw+dLpOuw=="
    },
    "node_modules/nice-try": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/nice-try/-/nice-try-1.0.5.tgz",
      "integrity": "sha512-1nh45deeb5olNY7eX82BkPO7SSxR5SSYJiPTrTdFUVYwAl8CKMA5N9PjTYkHiRjisVcxcQ1HXdLhx2qxxJzLNQ==",
      "dev": true
    },
    "node_modules/no-case": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/no-case/-/no-case-3.0.4.tgz",
      "integrity": "sha512-fgAN3jGAh+RoxUGZHTSOLJIqUc2wmoBwGR4tbpNAKmmovFoWq0OdRkb0VkldReO2a2iBT/OEulG9XSUc10r3zg==",
      "dev": true,
      "dependencies": {
        "lower-case": "^2.0.2",
        "tslib": "^2.0.3"
      }
    },
    "node_modules/node-forge": {
      "version": "0.10.0",
      "resolved": "https://registry.npmjs.org/node-forge/-/node-forge-0.10.0.tgz",
      "integrity": "sha512-PPmu8eEeG9saEUvI97fm4OYxXVB6bFvyNTyiUOBichBpFG8A1Ljw3bY62+5oOjDEMHRnd0Y7HQ+x7uzxOzC6JA==",
      "dev": true,
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/node-releases": {
      "version": "1.1.71",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-1.1.71.tgz",
      "integrity": "sha512-zR6HoT6LrLCRBwukmrVbHv0EpEQjksO6GmFcZQQuCAy139BEsoVKPYnf3jongYW83fAa1torLGYwxxky/p28sg=="
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
      "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/npm-run-path": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/npm-run-path/-/npm-run-path-4.0.1.tgz",
      "integrity": "sha512-S48WzZW777zhNIrn7gxOlISNAqi9ZC/uQFnRdbeIHhZhCA6UqpkOT8T1G7BvfdgP4Er8gF4sUbaS0i7QvIfCWw==",
      "dependencies": {
        "path-key": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/nth-check": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/nth-check/-/nth-check-1.0.2.tgz",
      "integrity": "sha512-WeBOdju8SnzPN5vTUJYxYUxLeXpCaVP5i5e0LF8fg7WORF2Wd7wFX/pk0tYZk7s8T+J7VLy0Da6J1+wCT0AtHg==",
      "dev": true,
      "dependencies": {
        "boolbase": "~1.0.0"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha1-IQmtx5ZYh8/AXLvUQsrIv7s2CGM= sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-copy": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/object-copy/-/object-copy-0.1.0.tgz",
      "integrity": "sha1-fn2Fi3gb18mRpBupde04EnVOmYw= sha512-79LYn6VAb63zgtmAteVOWo9Vdj71ZVBy3Pbse+VqxDpEP83XuujMrGqHIwAXJ5I/aM0zU7dIyIAhifVTPrNItQ==",
      "dev": true,
      "dependencies": {
        "copy-descriptor": "^0.1.0",
        "define-property": "^0.2.5",
        "kind-of": "^3.0.3"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-copy/node_modules/define-property": {
      "version": "0.2.5",
      "resolved": "https://registry.npmjs.org/define-property/-/define-property-0.2.5.tgz",
      "integrity": "sha1-w1se+RjsPJkPmlvFe+BKrOxcgRY= sha512-Rr7ADjQZenceVOAKop6ALkkRAmH1A4Gx9hV/7ZujPUN2rkATqFO0JZLZInbAjpZYoJ1gUx8MRMQVkYemcbMSTA==",
      "dev": true,
      "dependencies": {
        "is-descriptor": "^0.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-copy/node_modules/is-accessor-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-accessor-descriptor/-/is-accessor-descriptor-0.1.6.tgz",
      "integrity": "sha1-qeEss66Nh2cn7u84Q/igiXtcmNY= sha512-e1BM1qnDbMRG3ll2U9dSK0UMHuWOs3pY3AtcFsmvwPtKL3MML/Q86i+GilLfvqEs4GW+ExB91tQ3Ig9noDIZ+A==",
      "deprecated": "Please upgrade to v0.1.7",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-copy/node_modules/is-data-descriptor": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/is-data-descriptor/-/is-data-descriptor-0.1.4.tgz",
      "integrity": "sha1-C17mSDiOLIYCgueT8YVv7D8wG1Y= sha512-+w9D5ulSoBNlmw9OHn3U2v51SyoCd0he+bB3xMl62oijhrspxowjU+AIcDY0N3iEJbUEkB15IlMASQsxYigvXg==",
      "deprecated": "Please upgrade to v0.1.5",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-copy/node_modules/is-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-descriptor/-/is-descriptor-0.1.6.tgz",
      "integrity": "sha512-avDYr0SB3DwO9zsMov0gKCESFYqCnE4hq/4z3TdUlukEy5t9C0YRq7HLrsN52NAcqXKaepeCD0n+B0arnVG3Hg==",
      "dev": true,
      "dependencies": {
        "is-accessor-descriptor": "^0.1.6",
        "is-data-descriptor": "^0.1.4",
        "kind-of": "^5.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-copy/node_modules/is-descriptor/node_modules/kind-of": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-5.1.0.tgz",
      "integrity": "sha512-NGEErnH6F2vUuXDh+OlbcKW7/wOcfdRHaZ7VWtqCztfHri/++YKmP51OdWeGPuqCOba6kk2OTe5d02VmTB80Pw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.9.0",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.9.0.tgz",
      "integrity": "sha512-i3Bp9iTqwhaLZBxGkRfo5ZbE07BQRT7MGu8+nNgwW9ItGp1TzCTw2DLEoWwjClxBjOFI/hWljTAmYGCEwmtnOw==",
      "dev": true,
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object-is": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/object-is/-/object-is-1.1.5.tgz",
      "integrity": "sha512-3cyDsyHgtmi7I7DfSSI2LDp6SK2lwvtbg0p0R1e0RvTqF5ceGx+K2dfSjm1bKDMVCFEDAQvy+o8c6a7VujOddw==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.2",
        "define-properties": "^1.1.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object-keys": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
      "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
      "dev": true,
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object-visit": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/object-visit/-/object-visit-1.0.1.tgz",
      "integrity": "sha1-95xEk68MU3e1n+OdOV5BBC3QRbs= sha512-GBaMwwAVK9qbQN3Scdo0OyvgPW7l3lnaVMj84uTOZlswkX0KpF6fyDBJhtTthf7pymztoN36/KEr1DyhF96zEA==",
      "dev": true,
      "dependencies": {
        "isobject": "^3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object.assign": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.2.tgz",
      "integrity": "sha512-ixT2L5THXsApyiUPYKmW+2EHpXXe5Ii3M+f4e+aJFAHao5amFRW6J0OO6c/LU8Be47utCx2GL89hxGB6XSmKuQ==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.0",
        "define-properties": "^1.1.3",
        "has-symbols": "^1.0.1",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.getownpropertydescriptors": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/object.getownpropertydescriptors/-/object.getownpropertydescriptors-2.1.2.tgz",
      "integrity": "sha512-WtxeKSzfBjlzL+F9b7M7hewDzMwy+C8NRssHd1YrNlzHzIDrXcXiNOMrezdAEM4UXixgV+vvnyBeN7Rygl2ttQ==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.2",
        "define-properties": "^1.1.3",
        "es-abstract": "^1.18.0-next.2"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.pick": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/object.pick/-/object.pick-1.3.0.tgz",
      "integrity": "sha1-h6EKxMFpS9Lhy/U1kaZhQftd10c= sha512-tqa/UMy/CCoYmj+H5qc07qvSL9dqcs/WZENZ1JbtWBlATP+iVOe778gE6MSijnyCnORzDuX6hU+LA4SZ09YjFQ==",
      "dev": true,
      "dependencies": {
        "isobject": "^3.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/obuf": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/obuf/-/obuf-1.1.2.tgz",
      "integrity": "sha512-PX1wu0AmAdPqOL1mWhqmlOd8kOIZQwGZw6rh7uby9fTc5lhaOWFLX3I6R1hrF9k3zUY40e6igsLGkDXK92LJNg==",
      "dev": true
    },
    "node_modules/on-finished": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.3.0.tgz",
      "integrity": "sha1-IPEzZIGwg811M3mSoWlxqi2QaUc= sha512-ikqdkGAAyf/X/gPhXGvfgAytDZtDbr+bkNUJ0N9h5MI/dmdgCs3l6hoHrcUv41sRKew3jIwrp4qQDXiK99Utww==",
      "dev": true,
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/on-headers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/on-headers/-/on-headers-1.0.2.tgz",
      "integrity": "sha512-pZAE+FJLoyITytdqK0U5s+FIpjN0JP3OzFi/u8Rx+EV5/W+JTWGXG8xFzevE7AjBfDqHv/8vL8qQsIhHnqRkrA==",
      "dev": true,
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha1-WDsap3WWHUsROsF9nFC6753Xa9E= sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "dev": true,
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/onetime": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/onetime/-/onetime-5.1.2.tgz",
      "integrity": "sha512-kbpaSSGJTWdAY5KPVeMOKXSrPtr8C8C7wodJbcsd51jRnmD+GZu8Y0VoU6Dm5Z4vWr0Ig/1NKuWRKf7j5aaYSg==",
      "dependencies": {
        "mimic-fn": "^2.1.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/opn": {
      "version": "5.5.0",
      "resolved": "https://registry.npmjs.org/opn/-/opn-5.5.0.tgz",
      "integrity": "sha512-PqHpggC9bLV0VeWcdKhkpxY+3JTzetLSqTCWL/z/tFIbI6G8JCjondXklT1JinczLz2Xib62sSp0T/gKT4KksA==",
      "dev": true,
      "dependencies": {
        "is-wsl": "^1.1.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/original": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/original/-/original-1.0.2.tgz",
      "integrity": "sha512-hyBVl6iqqUOJ8FqRe+l/gS8H+kKYjrEndd5Pm1MfBtsEKA038HkkdbAl/72EAXGyonD/PFsvmVG+EvcIpliMBg==",
      "dev": true,
      "dependencies": {
        "url-parse": "^1.4.3"
      }
    },
    "node_modules/p-finally": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/p-finally/-/p-finally-1.0.0.tgz",
      "integrity": "sha1-P7z7FbiZpEEjs0ttzBi3JDNqLK4= sha512-LICb2p9CB7FS+0eR1oqWnHhp0FljGLZCWBE9aix0Uye9W8LTQPwMTYVGWQWIw9RdQiDg4+epXQODwIYJtSJaow==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/p-limit": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-2.3.0.tgz",
      "integrity": "sha512-//88mFWSJx8lxCzwdAABTJL2MyWB12+eIY7MDL2SqLmAkeKU9qxRvWuSyTjm3FUmpBEMuFfckAIqEaVGUDxb6w==",
      "dependencies": {
        "p-try": "^2.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-4.1.0.tgz",
      "integrity": "sha512-R79ZZ/0wAxKGu3oYMlz8jy/kbhsNrS7SKZ7PxEHBgJ5+F2mtFW2fK2cOtBh1cHYkQsbzFV7I+EoRKe6Yt0oK7A==",
      "dependencies": {
        "p-limit": "^2.2.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/p-map": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/p-map/-/p-map-2.1.0.tgz",
      "integrity": "sha512-y3b8Kpd8OAN444hxfBbFfj1FY/RjtTd8tzYwhUqNYXx0fXx2iX4maP4Qr6qhIKbQXI02wTLAda4fYUbDagTUFw==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/p-retry": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/p-retry/-/p-retry-3.0.1.tgz",
      "integrity": "sha512-XE6G4+YTTkT2a0UWb2kjZe8xNwf8bIbnqpc/IS/idOBVhyves0mK5OJgeocjx7q5pvX/6m23xuzVPYT1uGM73w==",
      "dev": true,
      "dependencies": {
        "retry": "^0.12.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/p-try": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/p-try/-/p-try-2.2.0.tgz",
      "integrity": "sha512-R4nPAVTAU0B9D35/Gk3uJf/7XYbQcyohSKdvAxIRSNghFl4e71hVoGnBNQz9cWaXxO2I10KTC+3jMdvvoKw6dQ==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/param-case": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/param-case/-/param-case-3.0.4.tgz",
      "integrity": "sha512-RXlj7zCYokReqWpOPH9oYivUzLYZ5vAPIfEmCTNViosC78F8F0H9y7T7gG2M39ymgutxF5gcFEsyZQSph9Bp3A==",
      "dev": true,
      "dependencies": {
        "dot-case": "^3.0.4",
        "tslib": "^2.0.3"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "dev": true,
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/pascal-case": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/pascal-case/-/pascal-case-3.1.2.tgz",
      "integrity": "sha512-uWlGT3YSnK9x3BQJaOdcZwrnV6hPpd8jFH1/ucpiLRPh/2zCVJKS19E4GvYHvaCcACn3foXZ0cLB9Wrx1KGe5g==",
      "dev": true,
      "dependencies": {
        "no-case": "^3.0.4",
        "tslib": "^2.0.3"
      }
    },
    "node_modules/pascalcase": {
      "version": "0.1.1",
      "resolved": "https://registry.npmjs.org/pascalcase/-/pascalcase-0.1.1.tgz",
      "integrity": "sha1-s2PlXoAGym/iF4TS2yK9FdeRfxQ= sha512-XHXfu/yOQRy9vYOtUDVMN60OEJjW013GoObG1o+xwQTpB9eYJX/BjXMsdW13ZDPruFhYYn0AG22w0xgQMwl3Nw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/path-dirname": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/path-dirname/-/path-dirname-1.0.2.tgz",
      "integrity": "sha1-zDPSTVJeCZpTiMAzbG4yuRYGCeA= sha512-ALzNPpyNq9AqXMBjeymIjFDAkAFH06mHJH/cSBHAgU0s4vfpBn6b2nf8tiRLvagKD8RbTpq2FKTBg7cl9l3c7Q==",
      "dev": true
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-is-absolute": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
      "integrity": "sha1-F0uSaHNVNP+8es5r9TpanhtcX18= sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/path-is-inside": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/path-is-inside/-/path-is-inside-1.0.2.tgz",
      "integrity": "sha1-NlQX3t5EQw0cEa9hAn+s8HS9/FM= sha512-DUWJr3+ULp4zXmol/SZkFf3JGsS9/SIv+Y3Rt93/UjPpDpklB5f1er4O3POIbUuUJ3FXgqte2Q7SrU6zAqwk8w==",
      "dev": true
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.6",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.6.tgz",
      "integrity": "sha512-GSmOT2EbHrINBf9SR7CDELwlJ8AENk3Qn7OikK4nFYAu3Ote2+JYNVvkpAEQm3/TLNEJFD/xZJjzyxg3KBWOzw=="
    },
    "node_modules/path-to-regexp": {
      "version": "0.1.7",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-0.1.7.tgz",
      "integrity": "sha1-32BBeABfUi8V60SQ5yR6G/qmf4w= sha512-5DFkuoqlv1uYQKxy8omFBeJPQcdoE07Kv2sferDCrAq1ohOU+MSDswDIbnx3YAM60qIOnYa53wBhXW0EbMonrQ==",
      "dev": true
    },
    "node_modules/pify": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/pify/-/pify-4.0.1.tgz",
      "integrity": "sha512-uB80kBFb/tfd68bVleG9T5GGsGPjJrLAUpR5PZIrhBnIaRTQRjqdJSsIKkOP6OAIFbj7GOrcudc5pNjZ+geV2g==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/pinkie": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/pinkie/-/pinkie-2.0.4.tgz",
      "integrity": "sha1-clVrgM+g1IqXToDnckjoDtT3+HA= sha512-MnUuEycAemtSaeFSjXKW/aroV7akBbY+Sv+RkyqFjgAe73F+MR0TBWKBRDkmfWq/HiFmdavfZ1G7h4SPZXaCSg==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/pinkie-promise": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/pinkie-promise/-/pinkie-promise-2.0.1.tgz",
      "integrity": "sha1-ITXW36ejWMBprJsXh3YogihFD/o= sha512-0Gni6D4UcLTbv9c57DfxDGdr41XfgUjqWZu492f0cIGr16zDU06BWP/RAEvOuo7CQ0CNjHaLlM59YJJFm3NWlw==",
      "dev": true,
      "dependencies": {
        "pinkie": "^2.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/pkg-dir": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/pkg-dir/-/pkg-dir-4.2.0.tgz",
      "integrity": "sha512-HRDzbaKjC+AOWVXxAU/x54COGeIv9eb+6CkDSQoNTt4XyWoIJvuPsXizxu/Fr23EiekbtZwmh1IcIG/l/a10GQ==",
      "dependencies": {
        "find-up": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/portfinder": {
      "version": "1.0.28",
      "resolved": "https://registry.npmjs.org/portfinder/-/portfinder-1.0.28.tgz",
      "integrity": "sha512-Se+2isanIcEqf2XMHjyUKskczxbPH7dQnlMjXX6+dybayyHvAf/TCgyMRlzf/B6QDhAEFOGes0pzRo3by4AbMA==",
      "dev": true,
      "dependencies": {
        "async": "^2.6.2",
        "debug": "^3.1.1",
        "mkdirp": "^0.5.5"
      },
      "engines": {
        "node": ">= 0.12.0"
      }
    },
    "node_modules/portfinder/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/posix-character-classes": {
      "version": "0.1.1",
      "resolved": "https://registry.npmjs.org/posix-character-classes/-/posix-character-classes-0.1.1.tgz",
      "integrity": "sha1-AerA/jta9xoqbAL+q7jB/vfgDqs= sha512-xTgYBc3fuo7Yt7JbiuFxSYGToMoz8fLoE6TC9Wx1P/u+LfeThMOAqmuyECnlBaaJb+u1m9hHiXUEtwW4OzfUJg==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/pretty-error": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/pretty-error/-/pretty-error-2.1.2.tgz",
      "integrity": "sha512-EY5oDzmsX5wvuynAByrmY0P0hcp+QpnAKbJng2A2MPjVKXCxrDSUkzghVJ4ZGPIv+JC4gX8fPUWscC0RtjsWGw==",
      "dev": true,
      "dependencies": {
        "lodash": "^4.17.20",
        "renderkid": "^2.0.4"
      }
    },
    "node_modules/process-nextick-args": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/process-nextick-args/-/process-nextick-args-2.0.1.tgz",
      "integrity": "sha512-3ouUOpQhtgrbOa17J7+uxOTpITYWaGP7/AhoR3+A+/1e9skrzelGi/dXzEYyvbxubEF6Wn2ypscTKiKJFFn1ag==",
      "dev": true
    },
    "node_modules/proxy-addr": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.6.tgz",
      "integrity": "sha512-dh/frvCBVmSsDYzw6n926jv974gddhkFPfiN8hPOi30Wax25QZyZEGveluCgliBnqmuM+UJmBErbAUFIoDbjOw==",
      "dev": true,
      "dependencies": {
        "forwarded": "~0.1.2",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/prr": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/prr/-/prr-1.0.1.tgz",
      "integrity": "sha1-0/wRS6BplaRexok/SEzrHXj19HY= sha512-yPw4Sng1gWghHQWj0B3ZggWUm4qVbPwPFcRG8KyxiU7J2OHFSoEHKS+EZ3fv5l1t9CyCiop6l/ZYeWbrgoQejw==",
      "dev": true
    },
    "node_modules/pump": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/pump/-/pump-3.0.0.tgz",
      "integrity": "sha512-LwZy+p3SFs1Pytd/jYct4wpv49HiYCqd9Rlc5ZVdk0V+8Yzv6jR5Blk3TRmPL1ft69TxP0IMZGJ+WPFU2BFhww==",
      "dev": true,
      "dependencies": {
        "end-of-stream": "^1.1.0",
        "once": "^1.3.1"
      }
    },
    "node_modules/punycode": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.1.1.tgz",
      "integrity": "sha512-XRsRjdf+j5ml+y/6GKHPZbrF/8p2Yga0JPtdqTIY2Xe5ohJPD9saDJJLPvp9+NSBprVvevdXZybnj2cv8OEd0A==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/qs": {
      "version": "6.7.0",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.7.0.tgz",
      "integrity": "sha512-VCdBRNFTX1fyE7Nb6FYoURo/SPe62QCaAyzJvUjwRaIsc+NePBEniHlvxFmmX56+HZphIGtV0XeCirBtpDrTyQ==",
      "dev": true,
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/querystring": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/querystring/-/querystring-0.2.0.tgz",
      "integrity": "sha1-sgmEkgO7Jd+CDadW50cAWHhSFiA= sha512-X/xY82scca2tau62i9mDyU9K+I+djTMUsvwf7xnUX5GLvVzgJybOJf4Y6o9Zx3oJK/LSXg5tTZBjwzqVPaPO2g==",
      "deprecated": "The querystring API is considered Legacy. new code should use the URLSearchParams API instead.",
      "dev": true,
      "engines": {
        "node": ">=0.4.x"
      }
    },
    "node_modules/querystringify": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/querystringify/-/querystringify-2.2.0.tgz",
      "integrity": "sha512-FIqgj2EUvTa7R50u0rGsyTftzjYmv/a3hO345bZNrqabNqjtgiDMgmo4mkUjd+nzU5oF3dClKqFIPUKybUyqoQ==",
      "dev": true
    },
    "node_modules/randombytes": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/randombytes/-/randombytes-2.1.0.tgz",
      "integrity": "sha512-vYl3iOX+4CKUWuxGi9Ukhie6fsqXqS9FE2Zaic4tNFD2N2QQaXOMFbuKK4QmDHC0JO6B1Zp41J0LpT0oR68amQ==",
      "dependencies": {
        "safe-buffer": "^5.1.0"
      }
    },
    "node_modules/range-parser": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
      "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/raw-body": {
      "version": "2.4.0",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-2.4.0.tgz",
      "integrity": "sha512-4Oz8DUIwdvoa5qMJelxipzi/iJIi40O5cGV1wNYp5hvZP8ZN0T+jiNkL0QepXs+EsQ9XJ8ipEDoiH70ySUJP3Q==",
      "dev": true,
      "dependencies": {
        "bytes": "3.1.0",
        "http-errors": "1.7.2",
        "iconv-lite": "0.4.24",
        "unpipe": "1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/raw-body/node_modules/bytes": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.0.tgz",
      "integrity": "sha512-zauLjrfCG+xvoyaqLoV8bLVXXNGC4JqlxFCutSDWA6fJrTo2ZuvLYTqZ7aHBLZSMOopbzwv8f+wZcVzfVTI2Dg==",
      "dev": true,
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/raw-loader": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/raw-loader/-/raw-loader-4.0.2.tgz",
      "integrity": "sha512-ZnScIV3ag9A4wPX/ZayxL/jZH+euYb6FcUinPcgiQW0+UBtEv0O6Q3lGd3cqJ+GHH+rksEv3Pj99oxJ3u3VIKA==",
      "dev": true,
      "dependencies": {
        "loader-utils": "^2.0.0",
        "schema-utils": "^3.0.0"
      },
      "engines": {
        "node": ">= 10.13.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      },
      "peerDependencies": {
        "webpack": "^4.0.0 || ^5.0.0"
      }
    },
    "node_modules/raw-loader/node_modules/loader-utils": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/loader-utils/-/loader-utils-2.0.0.tgz",
      "integrity": "sha512-rP4F0h2RaWSvPEkD7BLDFQnvSf+nK+wr3ESUjNTyAGobqrijmW92zc+SO6d4p4B1wh7+B/Jg1mkQe5NYUEHtHQ==",
      "dev": true,
      "dependencies": {
        "big.js": "^5.2.2",
        "emojis-list": "^3.0.0",
        "json5": "^2.1.2"
      },
      "engines": {
        "node": ">=8.9.0"
      }
    },
    "node_modules/raw-loader/node_modules/schema-utils": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/schema-utils/-/schema-utils-3.0.0.tgz",
      "integrity": "sha512-6D82/xSzO094ajanoOSbe4YvXWMfn2A//8Y1+MUqFAJul5Bs+yn36xbK9OtNDcRVSBJ9jjeoXftM6CfztsjOAA==",
      "dev": true,
      "dependencies": {
        "@types/json-schema": "^7.0.6",
        "ajv": "^6.12.5",
        "ajv-keywords": "^3.5.2"
      },
      "engines": {
        "node": ">= 10.13.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/readable-stream": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.0.tgz",
      "integrity": "sha512-BViHy7LKeTz4oNnkcLJ+lVSL6vpiFeX6/d3oSH8zCW7UxP2onchk+vTGB143xuFjHS3deTgkKoXXymXqymiIdA==",
      "dev": true,
      "dependencies": {
        "inherits": "^2.0.3",
        "string_decoder": "^1.1.1",
        "util-deprecate": "^1.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/readdirp": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-2.2.1.tgz",
      "integrity": "sha512-1JU/8q+VgFZyxwrJ+SVIOsh+KywWGpds3NTqikiKpDMZWScmAYyKIgqkO+ARvNWJfXeXR1zxz7aHF4u4CyH6vQ==",
      "dev": true,
      "dependencies": {
        "graceful-fs": "^4.1.11",
        "micromatch": "^3.1.10",
        "readable-stream": "^2.0.2"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/readdirp/node_modules/readable-stream": {
      "version": "2.3.7",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-2.3.7.tgz",
      "integrity": "sha512-Ebho8K4jIbHAxnuxi7o42OrZgF/ZTNcsZj6nRKyUmkhLFq8CHItp/fy6hQZuZmP/n3yZ9VBUbp4zz/mX8hmYPw==",
      "dev": true,
      "dependencies": {
        "core-util-is": "~1.0.0",
        "inherits": "~2.0.3",
        "isarray": "~1.0.0",
        "process-nextick-args": "~2.0.0",
        "safe-buffer": "~5.1.1",
        "string_decoder": "~1.1.1",
        "util-deprecate": "~1.0.1"
      }
    },
    "node_modules/readdirp/node_modules/string_decoder": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.1.1.tgz",
      "integrity": "sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==",
      "dev": true,
      "dependencies": {
        "safe-buffer": "~5.1.0"
      }
    },
    "node_modules/rechoir": {
      "version": "0.7.0",
      "resolved": "https://registry.npmjs.org/rechoir/-/rechoir-0.7.0.tgz",
      "integrity": "sha512-ADsDEH2bvbjltXEP+hTIAmeFekTFK0V2BTxMkok6qILyAJEXV0AFfoWcAq4yfll5VdIMd/RVXq0lR+wQi5ZU3Q==",
      "dependencies": {
        "resolve": "^1.9.0"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/regenerate": {
      "version": "1.4.2",
      "resolved": "https://registry.npmjs.org/regenerate/-/regenerate-1.4.2.tgz",
      "integrity": "sha512-zrceR/XhGYU/d/opr2EKO7aRHUeiBI8qjtfHqADTwZd6Szfy16la6kqD0MIUs5z5hx6AaKa+PixpPrR289+I0A==",
      "dev": true
    },
    "node_modules/regenerate-unicode-properties": {
      "version": "8.2.0",
      "resolved": "https://registry.npmjs.org/regenerate-unicode-properties/-/regenerate-unicode-properties-8.2.0.tgz",
      "integrity": "sha512-F9DjY1vKLo/tPePDycuH3dn9H1OTPIkVD9Kz4LODu+F2C75mgjAJ7x/gwy6ZcSNRAAkhNlJSOHRe8k3p+K9WhA==",
      "dev": true,
      "dependencies": {
        "regenerate": "^1.4.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/regenerator-runtime": {
      "version": "0.13.7",
      "resolved": "https://registry.npmjs.org/regenerator-runtime/-/regenerator-runtime-0.13.7.tgz",
      "integrity": "sha512-a54FxoJDIr27pgf7IgeQGxmqUNYrcV338lf/6gH456HZ/PhX+5BcwHXG9ajESmwe6WRO0tAzRUrRmNONWgkrew==",
      "dev": true
    },
    "node_modules/regenerator-transform": {
      "version": "0.14.5",
      "resolved": "https://registry.npmjs.org/regenerator-transform/-/regenerator-transform-0.14.5.tgz",
      "integrity": "sha512-eOf6vka5IO151Jfsw2NO9WpGX58W6wWmefK3I1zEGr0lOD0u8rwPaNqQL1aRxUaxLeKO3ArNh3VYg1KbaD+FFw==",
      "dev": true,
      "dependencies": {
        "@babel/runtime": "^7.8.4"
      }
    },
    "node_modules/regex-not": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/regex-not/-/regex-not-1.0.2.tgz",
      "integrity": "sha512-J6SDjUgDxQj5NusnOtdFxDwN/+HWykR8GELwctJ7mdqhcyy1xEc4SRFHUXvxTp661YaVKAjfRLZ9cCqS6tn32A==",
      "dev": true,
      "dependencies": {
        "extend-shallow": "^3.0.2",
        "safe-regex": "^1.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/regex-not/node_modules/extend-shallow": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend-shallow/-/extend-shallow-3.0.2.tgz",
      "integrity": "sha1-Jqcarwc7OfshJxcnRhMcJwQCjbg= sha512-BwY5b5Ql4+qZoefgMj2NUmx+tehVTH/Kf4k1ZEtOHNFcm2wSxMRo992l6X3TIgni2eZVTZ85xMOjF31fwZAj6Q==",
      "dev": true,
      "dependencies": {
        "assign-symbols": "^1.0.0",
        "is-extendable": "^1.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/regex-not/node_modules/is-extendable": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/is-extendable/-/is-extendable-1.0.1.tgz",
      "integrity": "sha512-arnXMxT1hhoKo9k1LZdmlNyJdDDfy2v0fXjFlmok4+i8ul/6WlbVge9bhM74OpNPQPMGUToDtz+KXa1PneJxOA==",
      "dev": true,
      "dependencies": {
        "is-plain-object": "^2.0.4"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/regexp.prototype.flags": {
      "version": "1.3.1",
      "resolved": "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.3.1.tgz",
      "integrity": "sha512-JiBdRBq91WlY7uRJ0ds7R+dU02i6LKi8r3BuQhNXn+kmeLN+EfHhfjqMRis1zJxnlu88hq/4dx0P2OP3APRTOA==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.2",
        "define-properties": "^1.1.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/regexpu-core": {
      "version": "4.7.1",
      "resolved": "https://registry.npmjs.org/regexpu-core/-/regexpu-core-4.7.1.tgz",
      "integrity": "sha512-ywH2VUraA44DZQuRKzARmw6S66mr48pQVva4LBeRhcOltJ6hExvWly5ZjFLYo67xbIxb6W1q4bAGtgfEl20zfQ==",
      "dev": true,
      "dependencies": {
        "regenerate": "^1.4.0",
        "regenerate-unicode-properties": "^8.2.0",
        "regjsgen": "^0.5.1",
        "regjsparser": "^0.6.4",
        "unicode-match-property-ecmascript": "^1.0.4",
        "unicode-match-property-value-ecmascript": "^1.2.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/regjsgen": {
      "version": "0.5.2",
      "resolved": "https://registry.npmjs.org/regjsgen/-/regjsgen-0.5.2.tgz",
      "integrity": "sha512-OFFT3MfrH90xIW8OOSyUrk6QHD5E9JOTeGodiJeBS3J6IwlgzJMNE/1bZklWz5oTg+9dCMyEetclvCVXOPoN3A==",
      "dev": true
    },
    "node_modules/regjsparser": {
      "version": "0.6.9",
      "resolved": "https://registry.npmjs.org/regjsparser/-/regjsparser-0.6.9.tgz",
      "integrity": "sha512-ZqbNRz1SNjLAiYuwY0zoXW8Ne675IX5q+YHioAGbCw4X96Mjl2+dcX9B2ciaeyYjViDAfvIjFpQjJgLttTEERQ==",
      "dev": true,
      "dependencies": {
        "jsesc": "~0.5.0"
      },
      "bin": {
        "regjsparser": "bin/parser"
      }
    },
    "node_modules/regjsparser/node_modules/jsesc": {
      "version": "0.5.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-0.5.0.tgz",
      "integrity": "sha1-597mbjXW/Bb3EP6R1c9p9w8IkR0= sha512-uZz5UnB7u4T9LvwmFqXii7pZSouaRPorGs5who1Ip7VO0wxanFvBL7GkM6dTHlgX+jhBApRetaWpnDabOeTcnA==",
      "dev": true,
      "bin": {
        "jsesc": "bin/jsesc"
      }
    },
    "node_modules/relateurl": {
      "version": "0.2.7",
      "resolved": "https://registry.npmjs.org/relateurl/-/relateurl-0.2.7.tgz",
      "integrity": "sha1-VNvzd+UUQKypCkzSdGANP/LYiKk= sha512-G08Dxvm4iDN3MLM0EsP62EDV9IuhXPR6blNz6Utcp7zyV3tr4HVNINt6MpaRWbxoOHT3Q7YN2P+jaHX8vUbgog==",
      "dev": true,
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/remove-trailing-separator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/remove-trailing-separator/-/remove-trailing-separator-1.1.0.tgz",
      "integrity": "sha1-wkvOKig62tW8P1jg1IJJuSN52O8= sha512-/hS+Y0u3aOfIETiaiirUFwDBDzmXPvO+jAfKTitUngIPzdKc6Z0LoFjM/CK5PL4C+eKwHohlHAb6H0VFfmmUsw==",
      "dev": true
    },
    "node_modules/renderkid": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/renderkid/-/renderkid-2.0.5.tgz",
      "integrity": "sha512-ccqoLg+HLOHq1vdfYNm4TBeaCDIi1FLt3wGojTDSvdewUv65oTmI3cnT2E4hRjl1gzKZIPK+KZrXzlUYKnR+vQ==",
      "dev": true,
      "dependencies": {
        "css-select": "^2.0.2",
        "dom-converter": "^0.2",
        "htmlparser2": "^3.10.1",
        "lodash": "^4.17.20",
        "strip-ansi": "^3.0.0"
      }
    },
    "node_modules/repeat-element": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/repeat-element/-/repeat-element-1.1.3.tgz",
      "integrity": "sha512-ahGq0ZnV5m5XtZLMb+vP76kcAM5nkLqk0lpqAuojSKGgQtn4eRi4ZZGm2olo2zKFH+sMsWaqOCW1dqAnOru72g==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/repeat-string": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/repeat-string/-/repeat-string-1.6.1.tgz",
      "integrity": "sha1-jcrkcOHIirwtYA//Sndihtp15jc= sha512-PV0dzCYDNfRi1jCDbJzpW7jNNDRuCOG/jI5ctQcGKt/clZD+YcPS3yIlWuTJMmESC8aevCFmWJy5wjAFgNqN6w==",
      "dev": true,
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha1-jGStX9MNqxyXbiNE/+f3kqam30I= sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/require-main-filename": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/require-main-filename/-/require-main-filename-2.0.0.tgz",
      "integrity": "sha512-NKN5kMDylKuldxYLSUfrbo5Tuzh4hd+2E8NPPX02mZtn1VuREQToYe/ZdlJy+J3uCpfaiGF05e7B8W0iXbQHmg==",
      "dev": true
    },
    "node_modules/requires-port": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/requires-port/-/requires-port-1.0.0.tgz",
      "integrity": "sha1-kl0mAdOaxIXgkc8NpcbmlNw9yv8= sha512-KigOCHcocU3XODJxsu8i/j8T9tzT4adHiecwORRQ0ZZFcp7ahwXuRU1m+yuO90C5ZUyGeGfocHDI14M3L3yDAQ==",
      "dev": true
    },
    "node_modules/resolve": {
      "version": "1.20.0",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.20.0.tgz",
      "integrity": "sha512-wENBPt4ySzg4ybFQW2TT1zMQucPK95HSh/nq2CFTZVOGut2+pQvSsgtda4d26YrYcr067wjbmzOG8byDPBX63A==",
      "dependencies": {
        "is-core-module": "^2.2.0",
        "path-parse": "^1.0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve-cwd": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/resolve-cwd/-/resolve-cwd-3.0.0.tgz",
      "integrity": "sha512-OrZaX2Mb+rJCpH/6CpSqt9xFVpN++x01XnN2ie9g6P5/3xelLAkXWVADpdz1IHD/KFfEXyE6V0U01OQ3UO2rEg==",
      "dependencies": {
        "resolve-from": "^5.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/resolve-from": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-5.0.0.tgz",
      "integrity": "sha512-qYg9KP24dD5qka9J47d0aVky0N+b4fTU89LN9iDnjB5waksiC49rvMB0PrUJQGoTmH50XPiqOvAjDfaijGxYZw==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/resolve-url": {
      "version": "0.2.1",
      "resolved": "https://registry.npmjs.org/resolve-url/-/resolve-url-0.2.1.tgz",
      "integrity": "sha1-LGN/53yJOv0qZj/iGqkIAGjiBSo= sha512-ZuF55hVUQaaczgOIwqWzkEcEidmlD/xl44x1UZnhOXcYuFN2S6+rcxpG+C1N3So0wvNI3DmJICUFfu2SxhBmvg==",
      "deprecated": "https://github.com/lydell/resolve-url#deprecated",
      "dev": true
    },
    "node_modules/ret": {
      "version": "0.1.15",
      "resolved": "https://registry.npmjs.org/ret/-/ret-0.1.15.tgz",
      "integrity": "sha512-TTlYpa+OL+vMMNG24xSlQGEJ3B/RzEfUlLct7b5G/ytav+wPrplCpVMFuwzXbkecJrb6IYo1iFb0S9v37754mg==",
      "dev": true,
      "engines": {
        "node": ">=0.12"
      }
    },
    "node_modules/retry": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/retry/-/retry-0.12.0.tgz",
      "integrity": "sha1-G0KmJmoh8HQh0bC1S33BZ7AcATs= sha512-9LkiTwjUh6rT555DtE9rTX+BKByPfrMzEAtnlEtdEwr3Nkffwiihqe2bWADg+OQRjt9gl6ICdmB/ZFDCGAtSow==",
      "dev": true,
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/rimraf": {
      "version": "2.7.1",
      "resolved": "https://registry.npmjs.org/rimraf/-/rimraf-2.7.1.tgz",
      "integrity": "sha512-uWjbaKIK3T1OSVptzX7Nl6PvQ3qAGtKEtVRjRuazjfL3Bx5eI409VZSqgND+4UNnmzLVdPj9FqFJNPqBZFve4w==",
      "deprecated": "Rimraf versions prior to v4 are no longer supported",
      "dev": true,
      "dependencies": {
        "glob": "^7.1.3"
      },
      "bin": {
        "rimraf": "bin.js"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.1.2.tgz",
      "integrity": "sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g=="
    },
    "node_modules/safe-regex": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/safe-regex/-/safe-regex-1.1.0.tgz",
      "integrity": "sha1-QKNmnzsHfR6UPURinhV91IAjvy4= sha512-aJXcif4xnaNUzvUuC5gcb46oTS7zvg4jpMTnuqtrEPlR3vFr4pxtdTwaF1Qs3Enjn9HK+ZlwQui+a7z0SywIzg==",
      "dev": true,
      "dependencies": {
        "ret": "~0.1.10"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "dev": true
    },
    "node_modules/schema-utils": {
      "version": "2.7.1",
      "resolved": "https://registry.npmjs.org/schema-utils/-/schema-utils-2.7.1.tgz",
      "integrity": "sha512-SHiNtMOUGWBQJwzISiVYKu82GiV4QYGePp3odlY1tuKO7gPtphAT5R/py0fA6xtbgLL/RvtJZnU9b8s0F1q0Xg==",
      "dev": true,
      "dependencies": {
        "@types/json-schema": "^7.0.5",
        "ajv": "^6.12.4",
        "ajv-keywords": "^3.5.2"
      },
      "engines": {
        "node": ">= 8.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/select-hose": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/select-hose/-/select-hose-2.0.0.tgz",
      "integrity": "sha1-Yl2GWPhlr0Psliv8N2o3NZpJlMo= sha512-mEugaLK+YfkijB4fx0e6kImuJdCIt2LxCRcbEYPqRGCs4F2ogyfZU5IAZRdjCP8JPq2AtdNoC/Dux63d9Kiryg==",
      "dev": true
    },
    "node_modules/selfsigned": {
      "version": "1.10.8",
      "resolved": "https://registry.npmjs.org/selfsigned/-/selfsigned-1.10.8.tgz",
      "integrity": "sha512-2P4PtieJeEwVgTU9QEcwIRDQ/mXJLX8/+I3ur+Pg16nS8oNbrGxEso9NyYWy8NAmXiNl4dlAp5MwoNeCWzON4w==",
      "dev": true,
      "dependencies": {
        "node-forge": "^0.10.0"
      }
    },
    "node_modules/semver": {
      "version": "6.3.0",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.0.tgz",
      "integrity": "sha512-b39TBaTSfV6yBrapU89p5fKekE2m/NwnDocOVruQFS1/veMgdzuPcnOM34M6CwxW8jH/lxEa5rBoDeUwu5HHTw==",
      "dev": true,
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/send": {
      "version": "0.17.1",
      "resolved": "https://registry.npmjs.org/send/-/send-0.17.1.tgz",
      "integrity": "sha512-BsVKsiGcQMFwT8UxypobUKyv7irCNRHk1T0G680vk88yf6LBByGcZJOTJCrTP2xVN6yI+XjPJcNuE3V4fT9sAg==",
      "dev": true,
      "dependencies": {
        "debug": "2.6.9",
        "depd": "~1.1.2",
        "destroy": "~1.0.4",
        "encodeurl": "~1.0.2",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "fresh": "0.5.2",
        "http-errors": "~1.7.2",
        "mime": "1.6.0",
        "ms": "2.1.1",
        "on-finished": "~2.3.0",
        "range-parser": "~1.2.1",
        "statuses": "~1.5.0"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/send/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/send/node_modules/debug/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g= sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true
    },
    "node_modules/send/node_modules/ms": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.1.tgz",
      "integrity": "sha512-tgp+dl5cGk28utYktBsrFqA7HKgrhgPsg6Z/EfhWI4gl1Hwq8B/GmY/0oXZ6nF8hDVesS/FpnYaD/kOWhYQvyg==",
      "dev": true
    },
    "node_modules/serialize-javascript": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/serialize-javascript/-/serialize-javascript-5.0.1.tgz",
      "integrity": "sha512-SaaNal9imEO737H2c05Og0/8LUXG7EnsZyMa8MzkmuHoELfT6txuj0cMqRj6zfPKnmQ1yasR4PCJc8x+M4JSPA==",
      "dependencies": {
        "randombytes": "^2.1.0"
      }
    },
    "node_modules/serve-index": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/serve-index/-/serve-index-1.9.1.tgz",
      "integrity": "sha1-03aNabHn2C5c4FD/9bRTvqEqkjk= sha512-pXHfKNP4qujrtteMrSBb0rc8HJ9Ms/GrXwcUtUtD5s4ewDJI8bT3Cz2zTVRMKtri49pLx2e0Ya8ziP5Ya2pZZw==",
      "dev": true,
      "dependencies": {
        "accepts": "~1.3.4",
        "batch": "0.6.1",
        "debug": "2.6.9",
        "escape-html": "~1.0.3",
        "http-errors": "~1.6.2",
        "mime-types": "~2.1.17",
        "parseurl": "~1.3.2"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/serve-index/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/serve-index/node_modules/http-errors": {
      "version": "1.6.3",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-1.6.3.tgz",
      "integrity": "sha1-i1VoC7S+KDoLW/TqLjhYC+HZMg0= sha512-lks+lVC8dgGyh97jxvxeYTWQFvh4uw4yC12gVl63Cg30sjPX4wuGcdkICVXDAESr6OJGjqGA8Iz5mkeN6zlD7A==",
      "dev": true,
      "dependencies": {
        "depd": "~1.1.2",
        "inherits": "2.0.3",
        "setprototypeof": "1.1.0",
        "statuses": ">= 1.4.0 < 2"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/serve-index/node_modules/inherits": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.3.tgz",
      "integrity": "sha1-Yzwsg+PaQqUC9SRmAiSA9CCCYd4= sha512-x00IRNXNy63jwGkJmzPigoySHbaqpNuzKbBOmzK+g2OdZpQ9w+sxCN+VSB3ja7IAge2OP2qpfxTjeNcyjmW1uw==",
      "dev": true
    },
    "node_modules/serve-index/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g= sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true
    },
    "node_modules/serve-index/node_modules/setprototypeof": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.1.0.tgz",
      "integrity": "sha512-BvE/TwpZX4FXExxOxZyRGQQv651MSwmWKZGqvmPcRIjDqWub67kTKuIMx43cZZrS/cBBzwBcNDWoFxt2XEFIpQ==",
      "dev": true
    },
    "node_modules/serve-static": {
      "version": "1.14.1",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-1.14.1.tgz",
      "integrity": "sha512-JMrvUwE54emCYWlTI+hGrGv5I8dEwmco/00EvkzIIsR7MqrHonbD9pO2MOfFnpFntl7ecpZs+3mW+XbQZu9QCg==",
      "dev": true,
      "dependencies": {
        "encodeurl": "~1.0.2",
        "escape-html": "~1.0.3",
        "parseurl": "~1.3.3",
        "send": "0.17.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/set-blocking": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/set-blocking/-/set-blocking-2.0.0.tgz",
      "integrity": "sha1-BF+XgtARrppoA93TgrJDkrPYkPc= sha512-KiKBS8AnWGEyLzofFfmvKwpdPzqiy16LvQfK3yv/fVH7Bj13/wl3JSR1J+rfgRE9q7xUJK4qvgS8raSOeLUehw==",
      "dev": true
    },
    "node_modules/set-value": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/set-value/-/set-value-2.0.1.tgz",
      "integrity": "sha512-JxHc1weCN68wRY0fhCoXpyK55m/XPHafOmK4UWD7m2CI14GMcFypt4w/0+NV5f/ZMby2F6S2wwA7fgynh9gWSw==",
      "dev": true,
      "dependencies": {
        "extend-shallow": "^2.0.1",
        "is-extendable": "^0.1.1",
        "is-plain-object": "^2.0.3",
        "split-string": "^3.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.1.1.tgz",
      "integrity": "sha512-JvdAWfbXeIGaZ9cILp38HntZSFSo3mWg6xGcJJsd+d4aRMOqauag1C63dJfDw7OaMYwEbHMOxEZ1lqVRYP2OAw==",
      "dev": true
    },
    "node_modules/shallow-clone": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/shallow-clone/-/shallow-clone-3.0.1.tgz",
      "integrity": "sha512-/6KqX+GVUdqPuPPd2LxDDxzX6CAbjJehAAOKlNpqqUpAqPM6HeL8f+o3a+JsyGjn2lv0WY8UsTgUJjU9Ok55NA==",
      "dependencies": {
        "kind-of": "^6.0.2"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shallow-clone/node_modules/kind-of": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-6.0.3.tgz",
      "integrity": "sha512-dcS1ul+9tmeD95T+x28/ehLgd9mENa3LsvDTtzm3vyBEO7RPptvAD+t44WVXaUjTBRcrpFeFlC8WCruUR456hw==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/signal-exit": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.3.tgz",
      "integrity": "sha512-VUJ49FC8U1OxwZLxIbTTrDvLnf/6TDgxZcK8wxR8zs13xpx7xbG60ndBlhNrFi2EMuFRoeDoJO7wthSLq42EjA=="
    },
    "node_modules/snapdragon": {
      "version": "0.8.2",
      "resolved": "https://registry.npmjs.org/snapdragon/-/snapdragon-0.8.2.tgz",
      "integrity": "sha512-FtyOnWN/wCHTVXOMwvSv26d+ko5vWlIDD6zoUJ7LW8vh+ZBC8QdljveRP+crNrtBwioEUWy/4dMtbBjA4ioNlg==",
      "dev": true,
      "dependencies": {
        "base": "^0.11.1",
        "debug": "^2.2.0",
        "define-property": "^0.2.5",
        "extend-shallow": "^2.0.1",
        "map-cache": "^0.2.2",
        "source-map": "^0.5.6",
        "source-map-resolve": "^0.5.0",
        "use": "^3.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/snapdragon-node": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/snapdragon-node/-/snapdragon-node-2.1.1.tgz",
      "integrity": "sha512-O27l4xaMYt/RSQ5TR3vpWCAB5Kb/czIcqUFOM/C4fYcLnbZUc1PkjTAMjof2pBWaSTwOUd6qUHcFGVGj7aIwnw==",
      "dev": true,
      "dependencies": {
        "define-property": "^1.0.0",
        "isobject": "^3.0.0",
        "snapdragon-util": "^3.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/snapdragon-node/node_modules/define-property": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/define-property/-/define-property-1.0.0.tgz",
      "integrity": "sha1-dp66rz9KY6rTr56NMEybvnm/sOY= sha512-cZTYKFWspt9jZsMscWo8sc/5lbPC9Q0N5nBLgb+Yd915iL3udB1uFgS3B8YCx66UVHq018DAVFoee7x+gxggeA==",
      "dev": true,
      "dependencies": {
        "is-descriptor": "^1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/snapdragon-util": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/snapdragon-util/-/snapdragon-util-3.0.1.tgz",
      "integrity": "sha512-mbKkMdQKsjX4BAL4bRYTj21edOf8cN7XHdYUJEe+Zn99hVEYcMvKPct1IqNe7+AZPirn8BCDOQBHQZknqmKlZQ==",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.2.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/snapdragon/node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "dev": true,
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/snapdragon/node_modules/define-property": {
      "version": "0.2.5",
      "resolved": "https://registry.npmjs.org/define-property/-/define-property-0.2.5.tgz",
      "integrity": "sha1-w1se+RjsPJkPmlvFe+BKrOxcgRY= sha512-Rr7ADjQZenceVOAKop6ALkkRAmH1A4Gx9hV/7ZujPUN2rkATqFO0JZLZInbAjpZYoJ1gUx8MRMQVkYemcbMSTA==",
      "dev": true,
      "dependencies": {
        "is-descriptor": "^0.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/snapdragon/node_modules/is-accessor-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-accessor-descriptor/-/is-accessor-descriptor-0.1.6.tgz",
      "integrity": "sha1-qeEss66Nh2cn7u84Q/igiXtcmNY= sha512-e1BM1qnDbMRG3ll2U9dSK0UMHuWOs3pY3AtcFsmvwPtKL3MML/Q86i+GilLfvqEs4GW+ExB91tQ3Ig9noDIZ+A==",
      "deprecated": "Please upgrade to v0.1.7",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/snapdragon/node_modules/is-data-descriptor": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/is-data-descriptor/-/is-data-descriptor-0.1.4.tgz",
      "integrity": "sha1-C17mSDiOLIYCgueT8YVv7D8wG1Y= sha512-+w9D5ulSoBNlmw9OHn3U2v51SyoCd0he+bB3xMl62oijhrspxowjU+AIcDY0N3iEJbUEkB15IlMASQsxYigvXg==",
      "deprecated": "Please upgrade to v0.1.5",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/snapdragon/node_modules/is-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-descriptor/-/is-descriptor-0.1.6.tgz",
      "integrity": "sha512-avDYr0SB3DwO9zsMov0gKCESFYqCnE4hq/4z3TdUlukEy5t9C0YRq7HLrsN52NAcqXKaepeCD0n+B0arnVG3Hg==",
      "dev": true,
      "dependencies": {
        "is-accessor-descriptor": "^0.1.6",
        "is-data-descriptor": "^0.1.4",
        "kind-of": "^5.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/snapdragon/node_modules/is-descriptor/node_modules/kind-of": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-5.1.0.tgz",
      "integrity": "sha512-NGEErnH6F2vUuXDh+OlbcKW7/wOcfdRHaZ7VWtqCztfHri/++YKmP51OdWeGPuqCOba6kk2OTe5d02VmTB80Pw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/snapdragon/node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g= sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "dev": true
    },
    "node_modules/sockjs": {
      "version": "0.3.21",
      "resolved": "https://registry.npmjs.org/sockjs/-/sockjs-0.3.21.tgz",
      "integrity": "sha512-DhbPFGpxjc6Z3I+uX07Id5ZO2XwYsWOrYjaSeieES78cq+JaJvVe5q/m1uvjIQhXinhIeCFRH6JgXe+mvVMyXw==",
      "dev": true,
      "dependencies": {
        "faye-websocket": "^0.11.3",
        "uuid": "^3.4.0",
        "websocket-driver": "^0.7.4"
      }
    },
    "node_modules/sockjs-client": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/sockjs-client/-/sockjs-client-1.5.1.tgz",
      "integrity": "sha512-VnVAb663fosipI/m6pqRXakEOw7nvd7TUgdr3PlR/8V2I95QIdwT8L4nMxhyU8SmDBHYXU1TOElaKOmKLfYzeQ==",
      "dev": true,
      "dependencies": {
        "debug": "^3.2.6",
        "eventsource": "^1.0.7",
        "faye-websocket": "^0.11.3",
        "inherits": "^2.0.4",
        "json3": "^3.3.3",
        "url-parse": "^1.5.1"
      }
    },
    "node_modules/sockjs-client/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/source-list-map": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/source-list-map/-/source-list-map-2.0.1.tgz",
      "integrity": "sha512-qnQ7gVMxGNxsiL4lEuJwe/To8UnK7fAnmbGEEH8RpLouuKbeEm0lhbQVFIrNSuB+G7tVrAlVsZgETT5nljf+Iw=="
    },
    "node_modules/source-map": {
      "version": "0.5.7",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.5.7.tgz",
      "integrity": "sha1-igOdLRAh0i0eoUyA2OpGi6LvP8w= sha512-LbrmJOMUSdEVxIKvdcJzQC+nQhe8FUZQTXQy6+I75skNgn3OoQ0DZA8YnFa7gp8tqtL3KPf1kmo0R5DoApeSGQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-resolve": {
      "version": "0.5.3",
      "resolved": "https://registry.npmjs.org/source-map-resolve/-/source-map-resolve-0.5.3.tgz",
      "integrity": "sha512-Htz+RnsXWk5+P2slx5Jh3Q66vhQj1Cllm0zvnaY98+NFx+Dv2CF/f5O/t8x+KaNdrdIAsruNzoh/KpialbqAnw==",
      "deprecated": "See https://github.com/lydell/source-map-resolve#deprecated",
      "dev": true,
      "dependencies": {
        "atob": "^2.1.2",
        "decode-uri-component": "^0.2.0",
        "resolve-url": "^0.2.1",
        "source-map-url": "^0.4.0",
        "urix": "^0.1.0"
      }
    },
    "node_modules/source-map-support": {
      "version": "0.5.19",
      "resolved": "https://registry.npmjs.org/source-map-support/-/source-map-support-0.5.19.tgz",
      "integrity": "sha512-Wonm7zOCIJzBGQdB+thsPar0kYuCIzYvxZwlBa87yi/Mdjv7Tip2cyVbLj5o0cFPN4EVkuTwb3GDDyUx2DGnGw==",
      "dependencies": {
        "buffer-from": "^1.0.0",
        "source-map": "^0.6.0"
      }
    },
    "node_modules/source-map-support/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-url": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/source-map-url/-/source-map-url-0.4.1.tgz",
      "integrity": "sha512-cPiFOTLUKvJFIg4SKVScy4ilPPW6rFgMgfuZJPNoDuMs3nC1HbMUycBoJw77xFIp6z1UJQJOfx6C9GMH80DiTw==",
      "deprecated": "See https://github.com/lydell/source-map-url#deprecated",
      "dev": true
    },
    "node_modules/spdy": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/spdy/-/spdy-4.0.2.tgz",
      "integrity": "sha512-r46gZQZQV+Kl9oItvl1JZZqJKGr+oEkB08A6BzkiR7593/7IbtuncXHd2YoYeTsG4157ZssMu9KYvUHLcjcDoA==",
      "dev": true,
      "dependencies": {
        "debug": "^4.1.0",
        "handle-thing": "^2.0.0",
        "http-deceiver": "^1.2.7",
        "select-hose": "^2.0.0",
        "spdy-transport": "^3.0.0"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/spdy-transport": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/spdy-transport/-/spdy-transport-3.0.0.tgz",
      "integrity": "sha512-hsLVFE5SjA6TCisWeJXFKniGGOpBgMLmerfO2aCyCU5s7nJ/rpAepqmFifv/GCbSbueEeAJJnmSQ2rKC/g8Fcw==",
      "dev": true,
      "dependencies": {
        "debug": "^4.1.0",
        "detect-node": "^2.0.4",
        "hpack.js": "^2.1.6",
        "obuf": "^1.1.2",
        "readable-stream": "^3.0.6",
        "wbuf": "^1.7.3"
      }
    },
    "node_modules/split-string": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/split-string/-/split-string-3.1.0.tgz",
      "integrity": "sha512-NzNVhJDYpwceVVii8/Hu6DKfD2G+NrQHlS/V/qgv763EYudVwEcMQNxd2lh+0VrUByXN/oJkl5grOhYWvQUYiw==",
      "dev": true,
      "dependencies": {
        "extend-shallow": "^3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/split-string/node_modules/extend-shallow": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend-shallow/-/extend-shallow-3.0.2.tgz",
      "integrity": "sha1-Jqcarwc7OfshJxcnRhMcJwQCjbg= sha512-BwY5b5Ql4+qZoefgMj2NUmx+tehVTH/Kf4k1ZEtOHNFcm2wSxMRo992l6X3TIgni2eZVTZ85xMOjF31fwZAj6Q==",
      "dev": true,
      "dependencies": {
        "assign-symbols": "^1.0.0",
        "is-extendable": "^1.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/split-string/node_modules/is-extendable": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/is-extendable/-/is-extendable-1.0.1.tgz",
      "integrity": "sha512-arnXMxT1hhoKo9k1LZdmlNyJdDDfy2v0fXjFlmok4+i8ul/6WlbVge9bhM74OpNPQPMGUToDtz+KXa1PneJxOA==",
      "dev": true,
      "dependencies": {
        "is-plain-object": "^2.0.4"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/static-extend": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/static-extend/-/static-extend-0.1.2.tgz",
      "integrity": "sha1-YICcOcv/VTNyJv1eC1IPNB8ftcY= sha512-72E9+uLc27Mt718pMHt9VMNiAL4LMsmDbBva8mxWUCkT07fSzEGMYUCk0XWY6lp0j6RBAG4cJ3mWuZv2OE3s0g==",
      "dev": true,
      "dependencies": {
        "define-property": "^0.2.5",
        "object-copy": "^0.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/static-extend/node_modules/define-property": {
      "version": "0.2.5",
      "resolved": "https://registry.npmjs.org/define-property/-/define-property-0.2.5.tgz",
      "integrity": "sha1-w1se+RjsPJkPmlvFe+BKrOxcgRY= sha512-Rr7ADjQZenceVOAKop6ALkkRAmH1A4Gx9hV/7ZujPUN2rkATqFO0JZLZInbAjpZYoJ1gUx8MRMQVkYemcbMSTA==",
      "dev": true,
      "dependencies": {
        "is-descriptor": "^0.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/static-extend/node_modules/is-accessor-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-accessor-descriptor/-/is-accessor-descriptor-0.1.6.tgz",
      "integrity": "sha1-qeEss66Nh2cn7u84Q/igiXtcmNY= sha512-e1BM1qnDbMRG3ll2U9dSK0UMHuWOs3pY3AtcFsmvwPtKL3MML/Q86i+GilLfvqEs4GW+ExB91tQ3Ig9noDIZ+A==",
      "deprecated": "Please upgrade to v0.1.7",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/static-extend/node_modules/is-data-descriptor": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/is-data-descriptor/-/is-data-descriptor-0.1.4.tgz",
      "integrity": "sha1-C17mSDiOLIYCgueT8YVv7D8wG1Y= sha512-+w9D5ulSoBNlmw9OHn3U2v51SyoCd0he+bB3xMl62oijhrspxowjU+AIcDY0N3iEJbUEkB15IlMASQsxYigvXg==",
      "deprecated": "Please upgrade to v0.1.5",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/static-extend/node_modules/is-descriptor": {
      "version": "0.1.6",
      "resolved": "https://registry.npmjs.org/is-descriptor/-/is-descriptor-0.1.6.tgz",
      "integrity": "sha512-avDYr0SB3DwO9zsMov0gKCESFYqCnE4hq/4z3TdUlukEy5t9C0YRq7HLrsN52NAcqXKaepeCD0n+B0arnVG3Hg==",
      "dev": true,
      "dependencies": {
        "is-accessor-descriptor": "^0.1.6",
        "is-data-descriptor": "^0.1.4",
        "kind-of": "^5.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/static-extend/node_modules/is-descriptor/node_modules/kind-of": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/kind-of/-/kind-of-5.1.0.tgz",
      "integrity": "sha512-NGEErnH6F2vUuXDh+OlbcKW7/wOcfdRHaZ7VWtqCztfHri/++YKmP51OdWeGPuqCOba6kk2OTe5d02VmTB80Pw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/statuses": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-1.5.0.tgz",
      "integrity": "sha1-Fhx9rBd2Wf2YEfQ3cfqZOBR4Yow= sha512-OpZ3zP+jT1PI7I8nemJX4AKmAX070ZkYPVWV/AaKTJl+tXCTGyVdC1a4SL8RUQYEwk/f34ZX8UTykN68FwrqAA==",
      "dev": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "dev": true,
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/string_decoder/node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ]
    },
    "node_modules/string-width": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-3.1.0.tgz",
      "integrity": "sha512-vafcv6KjVZKSgz06oM/H6GDBrAtz8vdhQakGjFIvNrHA6y3HCF1CInLy+QLq8dTJPQ1b+KDUqDFctkdRW44e1w==",
      "dev": true,
      "dependencies": {
        "emoji-regex": "^7.0.1",
        "is-fullwidth-code-point": "^2.0.0",
        "strip-ansi": "^5.1.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/string-width/node_modules/ansi-regex": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-4.1.0.tgz",
      "integrity": "sha512-1apePfXM1UOSqw0o9IiFAovVz9M5S1Dg+4TrDwfMewQ6p/rmMueb7tWZjQ1rx4Loy1ArBggoqGpfqqdI4rondg==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/string-width/node_modules/strip-ansi": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-5.2.0.tgz",
      "integrity": "sha512-DuRs1gKbBqsMKIZlrffwlug8MHkcnpjs5VPmL1PAh+mA30U0DTotfDZ0d2UUsXpPmPmMMJ6W773MaA3J+lbiWA==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^4.1.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/string.prototype.trimend": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.4.tgz",
      "integrity": "sha512-y9xCjw1P23Awk8EvTpcyL2NIr1j7wJ39f+k6lvRnSMz+mz9CGz9NYPelDk42kOz6+ql8xjfK8oYzy3jAP5QU5A==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.2",
        "define-properties": "^1.1.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimstart": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.4.tgz",
      "integrity": "sha512-jh6e984OBfvxS50tdY2nRZnoC5/mLFKOREQfw8t5yytkoUsJRNxvI/E39qu1sD0OtWI3OC0XgKSmcWwziwYuZw==",
      "dev": true,
      "dependencies": {
        "call-bind": "^1.0.2",
        "define-properties": "^1.1.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/strip-ansi": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-3.0.1.tgz",
      "integrity": "sha1-ajhfuIU9lS1f8F0Oiq+UJ43GPc8= sha512-VhumSSbBqDTP8p2ZLKj40UjBCV4+v8bUSEpUb4KjRgWk9pbqGF4REFj6KEagidb2f/M6AzC0EmFyDNGaw9OCzg==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^2.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/strip-eof": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/strip-eof/-/strip-eof-1.0.0.tgz",
      "integrity": "sha1-u0P/VZim6wXYm1n80SnJgzE2Br8= sha512-7FCwGGmx8mD5xQd3RPUvnSpUXHM3BWuzjtpD4TXsfcZ9EL4azvVVUscFYwD9nx8Kh+uCBC00XBtAykoMHwTh8Q==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/strip-final-newline": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/strip-final-newline/-/strip-final-newline-2.0.0.tgz",
      "integrity": "sha512-BrpvfNAE3dcvq7ll3xVumzjKjZQ5tI1sEUIKr3Uoks0XUl45St3FlatVqef9prk4jRDzhW6WZg+3bk93y6pLjA==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/supports-color": {
      "version": "5.5.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-5.5.0.tgz",
      "integrity": "sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==",
      "dev": true,
      "dependencies": {
        "has-flag": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/tapable": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/tapable/-/tapable-1.1.3.tgz",
      "integrity": "sha512-4WK/bYZmj8xLr+HUCODHGF1ZFzsYffasLUgEiMBY4fgtltdO6B4WJtlSbPaDTLpYTcGVwM2qLnFTICEcNxs3kA==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/terser": {
      "version": "4.8.0",
      "resolved": "https://registry.npmjs.org/terser/-/terser-4.8.0.tgz",
      "integrity": "sha512-EAPipTNeWsb/3wLPeup1tVPaXfIaU68xMnVdPafIL1TV05OhASArYyIfFvnvJCNrR2NIOvDVNNTFRa+Re2MWyw==",
      "dev": true,
      "dependencies": {
        "commander": "^2.20.0",
        "source-map": "~0.6.1",
        "source-map-support": "~0.5.12"
      },
      "bin": {
        "terser": "bin/terser"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/terser-webpack-plugin": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/terser-webpack-plugin/-/terser-webpack-plugin-5.1.1.tgz",
      "integrity": "sha512-5XNNXZiR8YO6X6KhSGXfY0QrGrCRlSwAEjIIrlRQR4W8nP69TaJUlh3bkuac6zzgspiGPfKEHcY295MMVExl5Q==",
      "dependencies": {
        "jest-worker": "^26.6.2",
        "p-limit": "^3.1.0",
        "schema-utils": "^3.0.0",
        "serialize-javascript": "^5.0.1",
        "source-map": "^0.6.1",
        "terser": "^5.5.1"
      },
      "engines": {
        "node": ">= 10.13.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      },
      "peerDependencies": {
        "webpack": "^5.1.0"
      }
    },
    "node_modules/terser-webpack-plugin/node_modules/commander": {
      "version": "2.20.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz",
      "integrity": "sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ=="
    },
    "node_modules/terser-webpack-plugin/node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/terser-webpack-plugin/node_modules/schema-utils": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/schema-utils/-/schema-utils-3.0.0.tgz",
      "integrity": "sha512-6D82/xSzO094ajanoOSbe4YvXWMfn2A//8Y1+MUqFAJul5Bs+yn36xbK9OtNDcRVSBJ9jjeoXftM6CfztsjOAA==",
      "dependencies": {
        "@types/json-schema": "^7.0.6",
        "ajv": "^6.12.5",
        "ajv-keywords": "^3.5.2"
      },
      "engines": {
        "node": ">= 10.13.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/terser-webpack-plugin/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/terser-webpack-plugin/node_modules/terser": {
      "version": "5.6.1",
      "resolved": "https://registry.npmjs.org/terser/-/terser-5.6.1.tgz",
      "integrity": "sha512-yv9YLFQQ+3ZqgWCUk+pvNJwgUTdlIxUk1WTN+RnaFJe2L7ipG2csPT0ra2XRm7Cs8cxN7QXmK1rFzEwYEQkzXw==",
      "dependencies": {
        "commander": "^2.20.0",
        "source-map": "~0.7.2",
        "source-map-support": "~0.5.19"
      },
      "bin": {
        "terser": "bin/terser"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/terser-webpack-plugin/node_modules/terser/node_modules/source-map": {
      "version": "0.7.3",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.7.3.tgz",
      "integrity": "sha512-CkCj6giN3S+n9qrYiBTX5gystlENnRW5jZeNLHpe6aue+SrHcG5VYwujhW9s4dY31mEGsxBDrHR6oI69fTXsaQ==",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/terser/node_modules/commander": {
      "version": "2.20.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz",
      "integrity": "sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==",
      "dev": true
    },
    "node_modules/terser/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/three": {
      "version": "0.127.0",
      "resolved": "https://registry.npmjs.org/three/-/three-0.127.0.tgz",
      "integrity": "sha512-wtgrn+mhYUbobxT7QN3GPdu3SRpSBQvwY6uOzLChWS7QE//f7paDU/+wlzbg+ngeIvBBqjBHSRuywTh8A99Jng=="
    },
    "node_modules/three-pathfinding": {
      "version": "0.14.1",
      "resolved": "https://registry.npmjs.org/three-pathfinding/-/three-pathfinding-0.14.1.tgz",
      "integrity": "sha512-lBXt+GLlgCz/ppakGDj6L/JJH2JmZ8ZFiFHqey4v47V8SrzhKRuXfrsHo6IPF1Z/MDki/ahIf7uquW+jy/3hAg==",
      "peerDependencies": {
        "three": "0.x.x"
      }
    },
    "node_modules/thunky": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/thunky/-/thunky-1.1.0.tgz",
      "integrity": "sha512-eHY7nBftgThBqOyHGVN+l8gF0BucP09fMo0oO/Lb0w1OF80dJv+lDVpXG60WMQvkcxAkNybKsrEIE3ZtKGmPrA==",
      "dev": true
    },
    "node_modules/to-fast-properties": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/to-fast-properties/-/to-fast-properties-2.0.0.tgz",
      "integrity": "sha1-3F5pjL0HkmW8c+A3doGk5Og/YW4= sha512-/OaKK0xYrs3DmxRYqL/yDc+FxFUVYhDlXMhRmv3z915w2HF1tnN1omB354j8VUGO/hbRzyD6Y3sA7v7GS/ceog==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/to-object-path": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/to-object-path/-/to-object-path-0.3.0.tgz",
      "integrity": "sha1-KXWIt7Dn4KwI4E5nL4XB9JmeF68= sha512-9mWHdnGRuh3onocaHzukyvCZhzvr6tiflAy/JRFXcJX0TjgfWA9pk9t8CMbzmBE4Jfw58pXbkngtBtqYxzNEyg==",
      "dev": true,
      "dependencies": {
        "kind-of": "^3.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/to-regex": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/to-regex/-/to-regex-3.0.2.tgz",
      "integrity": "sha512-FWtleNAtZ/Ki2qtqej2CXTOayOH9bHDQF+Q48VpWyDXjbYxA4Yz8iDB31zXOBUlOHHKidDbqGVrTUvQMPmBGBw==",
      "dev": true,
      "dependencies": {
        "define-property": "^2.0.2",
        "extend-shallow": "^3.0.2",
        "regex-not": "^1.0.2",
        "safe-regex": "^1.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/to-regex-range": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-2.1.1.tgz",
      "integrity": "sha1-fIDBe53+vlmeJzZ+DU3VWQFB2zg= sha512-ZZWNfCjUokXXDGXFpZehJIkZqq91BcULFq/Pi7M5i4JnxXdhMKAK682z8bCW3o8Hj1wuuzoKcW3DfVzaP6VuNg==",
      "dev": true,
      "dependencies": {
        "is-number": "^3.0.0",
        "repeat-string": "^1.6.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/to-regex/node_modules/extend-shallow": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend-shallow/-/extend-shallow-3.0.2.tgz",
      "integrity": "sha1-Jqcarwc7OfshJxcnRhMcJwQCjbg= sha512-BwY5b5Ql4+qZoefgMj2NUmx+tehVTH/Kf4k1ZEtOHNFcm2wSxMRo992l6X3TIgni2eZVTZ85xMOjF31fwZAj6Q==",
      "dev": true,
      "dependencies": {
        "assign-symbols": "^1.0.0",
        "is-extendable": "^1.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/to-regex/node_modules/is-extendable": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/is-extendable/-/is-extendable-1.0.1.tgz",
      "integrity": "sha512-arnXMxT1hhoKo9k1LZdmlNyJdDDfy2v0fXjFlmok4+i8ul/6WlbVge9bhM74OpNPQPMGUToDtz+KXa1PneJxOA==",
      "dev": true,
      "dependencies": {
        "is-plain-object": "^2.0.4"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.0.tgz",
      "integrity": "sha512-yaOH/Pk/VEhBWWTlhI+qXxDFXlejDGcQipMlyxda9nthulaxLZUNcUqFxokp0vcYnvteJln5FNQDRrxj3YcbVw==",
      "dev": true,
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/tslib": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.1.0.tgz",
      "integrity": "sha512-hcVC3wYEziELGGmEEXue7D75zbwIIVUMWAVbHItGPx0ziyXxrOMQx4rQEVEV45Ut/1IotuEvwqPopzIOkDMf0A==",
      "dev": true
    },
    "node_modules/type-is": {
      "version": "1.6.18",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-1.6.18.tgz",
      "integrity": "sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==",
      "dev": true,
      "dependencies": {
        "media-typer": "0.3.0",
        "mime-types": "~2.1.24"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/unbox-primitive": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.0.1.tgz",
      "integrity": "sha512-tZU/3NqK3dA5gpE1KtyiJUrEB0lxnGkMFHptJ7q6ewdZ8s12QrODwNbhIJStmJkd1QDXa1NRA8aF2A1zk/Ypyw==",
      "dev": true,
      "dependencies": {
        "function-bind": "^1.1.1",
        "has-bigints": "^1.0.1",
        "has-symbols": "^1.0.2",
        "which-boxed-primitive": "^1.0.2"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/unicode-canonical-property-names-ecmascript": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/unicode-canonical-property-names-ecmascript/-/unicode-canonical-property-names-ecmascript-1.0.4.tgz",
      "integrity": "sha512-jDrNnXWHd4oHiTZnx/ZG7gtUTVp+gCcTTKr8L0HjlwphROEW3+Him+IpvC+xcJEFegapiMZyZe02CyuOnRmbnQ==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/unicode-match-property-ecmascript": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/unicode-match-property-ecmascript/-/unicode-match-property-ecmascript-1.0.4.tgz",
      "integrity": "sha512-L4Qoh15vTfntsn4P1zqnHulG0LdXgjSO035fEpdtp6YxXhMT51Q6vgM5lYdG/5X3MjS+k/Y9Xw4SFCY9IkR0rg==",
      "dev": true,
      "dependencies": {
        "unicode-canonical-property-names-ecmascript": "^1.0.4",
        "unicode-property-aliases-ecmascript": "^1.0.4"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/unicode-match-property-value-ecmascript": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/unicode-match-property-value-ecmascript/-/unicode-match-property-value-ecmascript-1.2.0.tgz",
      "integrity": "sha512-wjuQHGQVofmSJv1uVISKLE5zO2rNGzM/KCYZch/QQvez7C1hUhBIuZ701fYXExuufJFMPhv2SyL8CyoIfMLbIQ==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/unicode-property-aliases-ecmascript": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/unicode-property-aliases-ecmascript/-/unicode-property-aliases-ecmascript-1.1.0.tgz",
      "integrity": "sha512-PqSoPh/pWetQ2phoj5RLiaqIk4kCNwoV3CI+LfGmWLKI3rE3kl1h59XpX2BjgDrmbxD9ARtQobPGU1SguCYuQg==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/union-value": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/union-value/-/union-value-1.0.1.tgz",
      "integrity": "sha512-tJfXmxMeWYnczCVs7XAEvIV7ieppALdyepWMkHkwciRpZraG/xwT+s2JN8+pr1+8jCRf80FFzvr+MpQeeoF4Xg==",
      "dev": true,
      "dependencies": {
        "arr-union": "^3.1.0",
        "get-value": "^2.0.6",
        "is-extendable": "^0.1.1",
        "set-value": "^2.0.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha1-sr9O6FFKrmFltIF4KdIbLvSZBOw= sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "dev": true,
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/unset-value": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unset-value/-/unset-value-1.0.0.tgz",
      "integrity": "sha1-g3aHP30jNRef+x5vw6jtDfyKtVk= sha512-PcA2tsuGSF9cnySLHTLSh2qrQiJ70mn+r+Glzxv2TWZblxsxCC52BDlZoPCsz7STd9pN7EZetkWZBAvk4cgZdQ==",
      "dev": true,
      "dependencies": {
        "has-value": "^0.3.1",
        "isobject": "^3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/unset-value/node_modules/has-value": {
      "version": "0.3.1",
      "resolved": "https://registry.npmjs.org/has-value/-/has-value-0.3.1.tgz",
      "integrity": "sha1-ex9YutpiyoJ+wKIHgCVlSEWZXh8= sha512-gpG936j8/MzaeID5Yif+577c17TxaDmhuyVgSwtnL/q8UUTySg8Mecb+8Cf1otgLoD7DDH75axp86ER7LFsf3Q==",
      "dev": true,
      "dependencies": {
        "get-value": "^2.0.3",
        "has-values": "^0.1.4",
        "isobject": "^2.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/unset-value/node_modules/has-value/node_modules/isobject": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/isobject/-/isobject-2.1.0.tgz",
      "integrity": "sha1-8GVWEJaj8dou9GJy+BXIQNh+DIk= sha512-+OUdGJlgjOBZDfxnDjYYG6zp487z0JGNQq3cYQYg5f5hKR+syHMsaztzGeml/4kGG55CSpKSpWTY+jYGgsHLgA==",
      "dev": true,
      "dependencies": {
        "isarray": "1.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/unset-value/node_modules/has-values": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/has-values/-/has-values-0.1.4.tgz",
      "integrity": "sha1-bWHeldkd/Km5oCCJrThL/49it3E= sha512-J8S0cEdWuQbqD9//tlZxiMuMNmxB8PlEwvYwuxsTmR1G5RXUePEX/SJn7aD0GMLieuZYSwNH0cQuJGwnYunXRQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/upath": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/upath/-/upath-1.2.0.tgz",
      "integrity": "sha512-aZwGpamFO61g3OlfT7OQCHqhGnW43ieH9WZeP7QxN/G/jS4jfqUkZxoryvJgVPEcrl5NL/ggHsSmLMHuH64Lhg==",
      "dev": true,
      "engines": {
        "node": ">=4",
        "yarn": "*"
      }
    },
    "node_modules/uri-js": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
      "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
      "dependencies": {
        "punycode": "^2.1.0"
      }
    },
    "node_modules/urix": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/urix/-/urix-0.1.0.tgz",
      "integrity": "sha1-2pN/emLiH+wf0Y1Js1wpNQZ6bHI= sha512-Am1ousAhSLBeB9cG/7k7r2R0zj50uDRlZHPGbazid5s9rlF1F/QKYObEKSIunSjIOkJZqwRRLpvewjEkM7pSqg==",
      "deprecated": "Please see https://github.com/lydell/urix#deprecated",
      "dev": true
    },
    "node_modules/url": {
      "version": "0.11.0",
      "resolved": "https://registry.npmjs.org/url/-/url-0.11.0.tgz",
      "integrity": "sha1-ODjpfPxgUh63PFJajlW/3Z4uKPE= sha512-kbailJa29QrtXnxgq+DdCEGlbTeYM2eJUxsz6vjZavrCYPMIFHMKQmSKYAIuUK2i7hgPm28a8piX5NTUtM/LKQ==",
      "dev": true,
      "dependencies": {
        "punycode": "1.3.2",
        "querystring": "0.2.0"
      }
    },
    "node_modules/url-parse": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/url-parse/-/url-parse-1.5.1.tgz",
      "integrity": "sha512-HOfCOUJt7iSYzEx/UqgtwKRMC6EU91NFhsCHMv9oM03VJcVo2Qrp8T8kI9D7amFf1cu+/3CEhgb3rF9zL7k85Q==",
      "dev": true,
      "dependencies": {
        "querystringify": "^2.1.1",
        "requires-port": "^1.0.0"
      }
    },
    "node_modules/url/node_modules/punycode": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-1.3.2.tgz",
      "integrity": "sha1-llOgNvt8HuQjQvIyXM7v6jkmxI0= sha512-RofWgt/7fL5wP1Y7fxE7/EmTLzQVnB0ycyibJ0OOHIlJqTNzglYFxVwETOcIoJqJmpDXJ9xImDv+Fq34F/d4Dw==",
      "dev": true
    },
    "node_modules/use": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/use/-/use-3.1.1.tgz",
      "integrity": "sha512-cwESVXlO3url9YWlFW/TA9cshCEhtu7IKJ/p5soJ/gGpj7vbvFrAY/eIioQ6Dw23KjZhYgiIo8HOs1nQ2vr/oQ==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha1-RQ1Nyfpw3nMnYvvS1KKJgUGaDM8= sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "dev": true
    },
    "node_modules/util.promisify": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/util.promisify/-/util.promisify-1.0.0.tgz",
      "integrity": "sha512-i+6qA2MPhvoKLuxnJNpXAGhg7HphQOSUq2LKMZD0m15EiskXUkMvKdF4Uui0WYeCUGea+o2cw/ZuwehtfsrNkA==",
      "dev": true,
      "dependencies": {
        "define-properties": "^1.1.2",
        "object.getownpropertydescriptors": "^2.0.3"
      }
    },
    "node_modules/utila": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/utila/-/utila-0.4.0.tgz",
      "integrity": "sha1-ihagXURWV6Oupe7MWxKk+lN5dyw= sha512-Z0DbgELS9/L/75wZbro8xAnT50pBVFQZ+hUEueGDU5FN51YSCYM+jdxsfCiHjwNP/4LCDD0i/graKpeBnOXKRA==",
      "dev": true
    },
    "node_modules/utils-merge": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/utils-merge/-/utils-merge-1.0.1.tgz",
      "integrity": "sha1-n5VxD1CiZ5R7LMwSR0HBAoQn5xM= sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==",
      "dev": true,
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/uuid": {
      "version": "3.4.0",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-3.4.0.tgz",
      "integrity": "sha512-HjSDRw6gZE5JMggctHBcjVak08+KEVhSIiDzFnT9S9aegmp85S/bReBVTb4QTFaRNptJ9kuYaNhnbNEOkbKb/A==",
      "deprecated": "Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.",
      "dev": true,
      "bin": {
        "uuid": "bin/uuid"
      }
    },
    "node_modules/v8-compile-cache": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/v8-compile-cache/-/v8-compile-cache-2.3.0.tgz",
      "integrity": "sha512-l8lCEmLcLYZh4nbunNZvQCJc5pv7+RCwa8q/LdUx8u7lsWvPDKmpodJAJNwkAhJC//dFY48KuIEmjtd4RViDrA=="
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha1-IpnwLG3tMNSllhsLn3RSShj2NPw= sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "dev": true,
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/watchpack": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/watchpack/-/watchpack-2.1.1.tgz",
      "integrity": "sha512-Oo7LXCmc1eE1AjyuSBmtC3+Wy4HcV8PxWh2kP6fOl8yTlNS7r0K9l1ao2lrrUza7V39Y3D/BbJgY8VeSlc5JKw==",
      "dependencies": {
        "glob-to-regexp": "^0.4.1",
        "graceful-fs": "^4.1.2"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/wbuf": {
      "version": "1.7.3",
      "resolved": "https://registry.npmjs.org/wbuf/-/wbuf-1.7.3.tgz",
      "integrity": "sha512-O84QOnr0icsbFGLS0O3bI5FswxzRr8/gHwWkDlQFskhSPryQXvrTMxjxGP4+iWYoauLoBvfDpkrOauZ+0iZpDA==",
      "dev": true,
      "dependencies": {
        "minimalistic-assert": "^1.0.0"
      }
    },
    "node_modules/webpack": {
      "version": "5.30.0",
      "resolved": "https://registry.npmjs.org/webpack/-/webpack-5.30.0.tgz",
      "integrity": "sha512-Zr9NIri5yzpfmaMea2lSMV1UygbW0zQsSlGLMgKUm63ACXg6alhd1u4v5UBSBjzYKXJN6BNMGVM7w165e7NxYA==",
      "dependencies": {
        "@types/eslint-scope": "^3.7.0",
        "@types/estree": "^0.0.46",
        "@webassemblyjs/ast": "1.11.0",
        "@webassemblyjs/wasm-edit": "1.11.0",
        "@webassemblyjs/wasm-parser": "1.11.0",
        "acorn": "^8.0.4",
        "browserslist": "^4.14.5",
        "chrome-trace-event": "^1.0.2",
        "enhanced-resolve": "^5.7.0",
        "es-module-lexer": "^0.4.0",
        "eslint-scope": "^5.1.1",
        "events": "^3.2.0",
        "glob-to-regexp": "^0.4.1",
        "graceful-fs": "^4.2.4",
        "json-parse-better-errors": "^1.0.2",
        "loader-runner": "^4.2.0",
        "mime-types": "^2.1.27",
        "neo-async": "^2.6.2",
        "schema-utils": "^3.0.0",
        "tapable": "^2.1.1",
        "terser-webpack-plugin": "^5.1.1",
        "watchpack": "^2.0.0",
        "webpack-sources": "^2.1.1"
      },
      "bin": {
        "webpack": "bin/webpack.js"
      },
      "engines": {
        "node": ">=10.13.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      },
      "peerDependenciesMeta": {
        "webpack-cli": {
          "optional": true
        }
      }
    },
    "node_modules/webpack-cli": {
      "version": "4.6.0",
      "resolved": "https://registry.npmjs.org/webpack-cli/-/webpack-cli-4.6.0.tgz",
      "integrity": "sha512-9YV+qTcGMjQFiY7Nb1kmnupvb1x40lfpj8pwdO/bom+sQiP4OBMKjHq29YQrlDWDPZO9r/qWaRRywKaRDKqBTA==",
      "dependencies": {
        "@discoveryjs/json-ext": "^0.5.0",
        "@webpack-cli/configtest": "^1.0.2",
        "@webpack-cli/info": "^1.2.3",
        "@webpack-cli/serve": "^1.3.1",
        "colorette": "^1.2.1",
        "commander": "^7.0.0",
        "enquirer": "^2.3.6",
        "execa": "^5.0.0",
        "fastest-levenshtein": "^1.0.12",
        "import-local": "^3.0.2",
        "interpret": "^2.2.0",
        "rechoir": "^0.7.0",
        "v8-compile-cache": "^2.2.0",
        "webpack-merge": "^5.7.3"
      },
      "bin": {
        "webpack-cli": "bin/cli.js"
      },
      "engines": {
        "node": ">=10.13.0"
      },
      "peerDependencies": {
        "webpack": "4.x.x || 5.x.x"
      },
      "peerDependenciesMeta": {
        "@webpack-cli/generators": {
          "optional": true
        },
        "@webpack-cli/migrate": {
          "optional": true
        },
        "webpack-bundle-analyzer": {
          "optional": true
        },
        "webpack-dev-server": {
          "optional": true
        }
      }
    },
    "node_modules/webpack-cli/node_modules/commander": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/commander/-/commander-7.2.0.tgz",
      "integrity": "sha512-QrWXB+ZQSVPmIWIhtEO9H+gwHaMGYiF5ChvoJ+K9ZGHG/sVsa6yiesAD1GC/x46sET00Xlwo1u49RVVVzvcSkw==",
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/webpack-dev-middleware": {
      "version": "3.7.3",
      "resolved": "https://registry.npmjs.org/webpack-dev-middleware/-/webpack-dev-middleware-3.7.3.tgz",
      "integrity": "sha512-djelc/zGiz9nZj/U7PTBi2ViorGJXEWo/3ltkPbDyxCXhhEXkW0ce99falaok4TPj+AsxLiXJR0EBOb0zh9fKQ==",
      "dev": true,
      "dependencies": {
        "memory-fs": "^0.4.1",
        "mime": "^2.4.4",
        "mkdirp": "^0.5.1",
        "range-parser": "^1.2.1",
        "webpack-log": "^2.0.0"
      },
      "engines": {
        "node": ">= 6"
      },
      "peerDependencies": {
        "webpack": "^4.0.0 || ^5.0.0"
      }
    },
    "node_modules/webpack-dev-middleware/node_modules/mime": {
      "version": "2.5.2",
      "resolved": "https://registry.npmjs.org/mime/-/mime-2.5.2.tgz",
      "integrity": "sha512-tqkh47FzKeCPD2PUiPB6pkbMzsCasjxAfC62/Wap5qrUWcb+sFasXUC5I3gYM5iBM8v/Qpn4UK0x+j0iHyFPDg==",
      "dev": true,
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/webpack-dev-server": {
      "version": "3.11.2",
      "resolved": "https://registry.npmjs.org/webpack-dev-server/-/webpack-dev-server-3.11.2.tgz",
      "integrity": "sha512-A80BkuHRQfCiNtGBS1EMf2ChTUs0x+B3wGDFmOeT4rmJOHhHTCH2naNxIHhmkr0/UillP4U3yeIyv1pNp+QDLQ==",
      "dev": true,
      "dependencies": {
        "ansi-html": "0.0.7",
        "bonjour": "^3.5.0",
        "chokidar": "^2.1.8",
        "compression": "^1.7.4",
        "connect-history-api-fallback": "^1.6.0",
        "debug": "^4.1.1",
        "del": "^4.1.1",
        "express": "^4.17.1",
        "html-entities": "^1.3.1",
        "http-proxy-middleware": "0.19.1",
        "import-local": "^2.0.0",
        "internal-ip": "^4.3.0",
        "ip": "^1.1.5",
        "is-absolute-url": "^3.0.3",
        "killable": "^1.0.1",
        "loglevel": "^1.6.8",
        "opn": "^5.5.0",
        "p-retry": "^3.0.1",
        "portfinder": "^1.0.26",
        "schema-utils": "^1.0.0",
        "selfsigned": "^1.10.8",
        "semver": "^6.3.0",
        "serve-index": "^1.9.1",
        "sockjs": "^0.3.21",
        "sockjs-client": "^1.5.0",
        "spdy": "^4.0.2",
        "strip-ansi": "^3.0.1",
        "supports-color": "^6.1.0",
        "url": "^0.11.0",
        "webpack-dev-middleware": "^3.7.2",
        "webpack-log": "^2.0.0",
        "ws": "^6.2.1",
        "yargs": "^13.3.2"
      },
      "bin": {
        "webpack-dev-server": "bin/webpack-dev-server.js"
      },
      "engines": {
        "node": ">= 6.11.5"
      },
      "peerDependencies": {
        "webpack": "^4.0.0 || ^5.0.0"
      },
      "peerDependenciesMeta": {
        "webpack-cli": {
          "optional": true
        }
      }
    },
    "node_modules/webpack-dev-server/node_modules/find-up": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-3.0.0.tgz",
      "integrity": "sha512-1yD6RmLI1XBfxugvORwlck6f75tYL+iR0jqwsOrOxMZyGYqUuDhJ0l4AXdO1iX/FTs9cBAMEk1gWSEx1kSbylg==",
      "dev": true,
      "dependencies": {
        "locate-path": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/webpack-dev-server/node_modules/import-local": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/import-local/-/import-local-2.0.0.tgz",
      "integrity": "sha512-b6s04m3O+s3CGSbqDIyP4R6aAwAeYlVq9+WUWep6iHa8ETRf9yei1U48C5MmfJmV9AiLYYBKPMq/W+/WRpQmCQ==",
      "dev": true,
      "dependencies": {
        "pkg-dir": "^3.0.0",
        "resolve-cwd": "^2.0.0"
      },
      "bin": {
        "import-local-fixture": "fixtures/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/webpack-dev-server/node_modules/locate-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-3.0.0.tgz",
      "integrity": "sha512-7AO748wWnIhNqAuaty2ZWHkQHRSNfPVIsPIfwEOWO22AmaoVrWavlOcMR5nzTLNYvp36X220/maaRsrec1G65A==",
      "dev": true,
      "dependencies": {
        "p-locate": "^3.0.0",
        "path-exists": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/webpack-dev-server/node_modules/p-locate": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-3.0.0.tgz",
      "integrity": "sha512-x+12w/To+4GFfgJhBEpiDcLozRJGegY+Ei7/z0tSLkMmxGZNybVMSfWj9aJn8Z5Fc7dBUNJOOVgPv2H7IwulSQ==",
      "dev": true,
      "dependencies": {
        "p-limit": "^2.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/webpack-dev-server/node_modules/path-exists": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-3.0.0.tgz",
      "integrity": "sha1-zg6+ql94yxiSXqfYENe1mwEP1RU= sha512-bpC7GYwiDYQ4wYLe+FA8lhRjhQCMcQGuSgGGqDkg/QerRWw9CmGRT0iSOVRSZJ29NMLZgIzqaljJ63oaL4NIJQ==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/webpack-dev-server/node_modules/pkg-dir": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/pkg-dir/-/pkg-dir-3.0.0.tgz",
      "integrity": "sha512-/E57AYkoeQ25qkxMj5PBOVgF8Kiu/h7cYS30Z5+R7WaiCCBfLq58ZI/dSeaEKb9WVJV5n/03QwrN3IeWIFllvw==",
      "dev": true,
      "dependencies": {
        "find-up": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/webpack-dev-server/node_modules/resolve-cwd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/resolve-cwd/-/resolve-cwd-2.0.0.tgz",
      "integrity": "sha1-AKn3OHVW4nA46uIyyqNypqWbZlo= sha512-ccu8zQTrzVr954472aUVPLEcB3YpKSYR3cg/3lo1okzobPBM+1INXBbBZlDbnI/hbEocnf8j0QVo43hQKrbchg==",
      "dev": true,
      "dependencies": {
        "resolve-from": "^3.0.0"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/webpack-dev-server/node_modules/resolve-from": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-3.0.0.tgz",
      "integrity": "sha1-six699nWiBvItuZTM17rywoYh0g= sha512-GnlH6vxLymXJNMBo7XP1fJIzBFbdYt49CuTwmB/6N53t+kMPRMFKz783LlQ4tv28XoQfMWinAJX6WCGf2IlaIw==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/webpack-dev-server/node_modules/schema-utils": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/schema-utils/-/schema-utils-1.0.0.tgz",
      "integrity": "sha512-i27Mic4KovM/lnGsy8whRCHhc7VicJajAjTrYg11K9zfZXnYIt4k5F+kZkwjnrhKzLic/HLU4j11mjsz2G/75g==",
      "dev": true,
      "dependencies": {
        "ajv": "^6.1.0",
        "ajv-errors": "^1.0.0",
        "ajv-keywords": "^3.1.0"
      },
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/webpack-dev-server/node_modules/supports-color": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-6.1.0.tgz",
      "integrity": "sha512-qe1jfm1Mg7Nq/NSh6XE24gPXROEVsWHxC1LIx//XNlD9iw7YZQGjZNjYN7xGaEG6iKdA8EtNFW6R0gjnVXp+wQ==",
      "dev": true,
      "dependencies": {
        "has-flag": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/webpack-log": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/webpack-log/-/webpack-log-2.0.0.tgz",
      "integrity": "sha512-cX8G2vR/85UYG59FgkoMamwHUIkSSlV3bBMRsbxVXVUk2j6NleCKjQ/WE9eYg9WY4w25O9w8wKP4rzNZFmUcUg==",
      "dev": true,
      "dependencies": {
        "ansi-colors": "^3.0.0",
        "uuid": "^3.3.2"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/webpack-log/node_modules/ansi-colors": {
      "version": "3.2.4",
      "resolved": "https://registry.npmjs.org/ansi-colors/-/ansi-colors-3.2.4.tgz",
      "integrity": "sha512-hHUXGagefjN2iRrID63xckIvotOXOojhQKWIPUZ4mNUZ9nLZW+7FMNoE1lOkEhNWYsx/7ysGIuJYCiMAA9FnrA==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/webpack-merge": {
      "version": "5.7.3",
      "resolved": "https://registry.npmjs.org/webpack-merge/-/webpack-merge-5.7.3.tgz",
      "integrity": "sha512-6/JUQv0ELQ1igjGDzHkXbVDRxkfA57Zw7PfiupdLFJYrgFqY5ZP8xxbpp2lU3EPwYx89ht5Z/aDkD40hFCm5AA==",
      "dependencies": {
        "clone-deep": "^4.0.1",
        "wildcard": "^2.0.0"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/webpack-sources": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/webpack-sources/-/webpack-sources-2.2.0.tgz",
      "integrity": "sha512-bQsA24JLwcnWGArOKUxYKhX3Mz/nK1Xf6hxullKERyktjNMC4x8koOeaDNTA2fEJ09BdWLbM/iTW0ithREUP0w==",
      "dependencies": {
        "source-list-map": "^2.0.1",
        "source-map": "^0.6.1"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/webpack-sources/node_modules/source-map": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.6.1.tgz",
      "integrity": "sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/webpack/node_modules/schema-utils": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/schema-utils/-/schema-utils-3.0.0.tgz",
      "integrity": "sha512-6D82/xSzO094ajanoOSbe4YvXWMfn2A//8Y1+MUqFAJul5Bs+yn36xbK9OtNDcRVSBJ9jjeoXftM6CfztsjOAA==",
      "dependencies": {
        "@types/json-schema": "^7.0.6",
        "ajv": "^6.12.5",
        "ajv-keywords": "^3.5.2"
      },
      "engines": {
        "node": ">= 10.13.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/webpack/node_modules/tapable": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/tapable/-/tapable-2.2.0.tgz",
      "integrity": "sha512-FBk4IesMV1rBxX2tfiK8RAmogtWn53puLOQlvO8XuwlgxcYbP4mVPS9Ph4aeamSyyVjOl24aYWAuc8U5kCVwMw==",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/websocket-driver": {
      "version": "0.7.4",
      "resolved": "https://registry.npmjs.org/websocket-driver/-/websocket-driver-0.7.4.tgz",
      "integrity": "sha512-b17KeDIQVjvb0ssuSDF2cYXSg2iztliJ4B9WdsuB6J952qCPKmnVq4DyW5motImXHDC1cBT/1UezrJVsKw5zjg==",
      "dev": true,
      "dependencies": {
        "http-parser-js": ">=0.5.1",
        "safe-buffer": ">=5.1.0",
        "websocket-extensions": ">=0.1.1"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/websocket-extensions": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/websocket-extensions/-/websocket-extensions-0.1.4.tgz",
      "integrity": "sha512-OqedPIGOfsDlo31UNwYbCFMSaO9m9G/0faIHj5/dZFDMFqPTcx6UwqyOy3COEaEOg/9VsGIpdqn62W5KhoKSpg==",
      "dev": true,
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/which-boxed-primitive": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.0.2.tgz",
      "integrity": "sha512-bwZdv0AKLpplFY2KZRX6TvyuN7ojjr7lwkg6ml0roIy9YeuSr7JS372qlNW18UQYzgYK9ziGcerWqZOmEn9VNg==",
      "dev": true,
      "dependencies": {
        "is-bigint": "^1.0.1",
        "is-boolean-object": "^1.1.0",
        "is-number-object": "^1.0.4",
        "is-string": "^1.0.5",
        "is-symbol": "^1.0.3"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-module": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/which-module/-/which-module-2.0.0.tgz",
      "integrity": "sha1-2e8H3Od7mQK4o6j6SzHD4/fm6Ho= sha512-B+enWhmw6cjfVC7kS8Pj9pCrKSc5txArRyaYGe088shv/FGWH+0Rjx/xPgtsWfsUtS27FkP697E4DDhgrgoc0Q==",
      "dev": true
    },
    "node_modules/wildcard": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/wildcard/-/wildcard-2.0.0.tgz",
      "integrity": "sha512-JcKqAHLPxcdb9KM49dufGXn2x3ssnfjbcaQdLlfZsL9rH9wgDQjUtDxbo8NE0F6SFvydeu1VhZe7hZuHsB2/pw=="
    },
    "node_modules/wrap-ansi": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-5.1.0.tgz",
      "integrity": "sha512-QC1/iN/2/RPVJ5jYK8BGttj5z83LmSKmvbvrXPNCLZSEb32KKVDJDl/MOt2N01qU2H/FkzEa9PKto1BqDjtd7Q==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^3.2.0",
        "string-width": "^3.0.0",
        "strip-ansi": "^5.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/wrap-ansi/node_modules/ansi-regex": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-4.1.0.tgz",
      "integrity": "sha512-1apePfXM1UOSqw0o9IiFAovVz9M5S1Dg+4TrDwfMewQ6p/rmMueb7tWZjQ1rx4Loy1ArBggoqGpfqqdI4rondg==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/wrap-ansi/node_modules/strip-ansi": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-5.2.0.tgz",
      "integrity": "sha512-DuRs1gKbBqsMKIZlrffwlug8MHkcnpjs5VPmL1PAh+mA30U0DTotfDZ0d2UUsXpPmPmMMJ6W773MaA3J+lbiWA==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^4.1.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8= sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "dev": true
    },
    "node_modules/ws": {
      "version": "6.2.1",
      "resolved": "https://registry.npmjs.org/ws/-/ws-6.2.1.tgz",
      "integrity": "sha512-GIyAXC2cB7LjvpgMt9EKS2ldqr0MTrORaleiOno6TweZ6r3TKtoFQWay/2PceJ3RuBasOHzXNn5Lrw1X0bEjqA==",
      "dev": true,
      "dependencies": {
        "async-limiter": "~1.0.0"
      }
    },
    "node_modules/y18n": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-4.0.1.tgz",
      "integrity": "sha512-wNcy4NvjMYL8gogWWYAO7ZFWFfHcbdbE57tZO8e4cbpj8tfUcwrwqSl3ad8HxpYWCdXcJUCeKKZS62Av1affwQ==",
      "dev": true
    },
    "node_modules/yargs": {
      "version": "13.3.2",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-13.3.2.tgz",
      "integrity": "sha512-AX3Zw5iPruN5ie6xGRIDgqkT+ZhnRlZMLMHAs8tg7nRruy2Nb+i5o9bwghAogtM08q1dpr2LVoS8KSTMYpWXUw==",
      "dev": true,
      "dependencies": {
        "cliui": "^5.0.0",
        "find-up": "^3.0.0",
        "get-caller-file": "^2.0.1",
        "require-directory": "^2.1.1",
        "require-main-filename": "^2.0.0",
        "set-blocking": "^2.0.0",
        "string-width": "^3.0.0",
        "which-module": "^2.0.0",
        "y18n": "^4.0.0",
        "yargs-parser": "^13.1.2"
      }
    },
    "node_modules/yargs-parser": {
      "version": "13.1.2",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-13.1.2.tgz",
      "integrity": "sha512-3lbsNRf/j+A4QuSZfDRA7HRSfWrzO0YjqTJd5kjAq37Zep1CEgaYmrH9Q3GwPiB9cHyd1Y1UwggGhJGoxipbzg==",
      "dev": true,
      "dependencies": {
        "camelcase": "^5.0.0",
        "decamelize": "^1.2.0"
      }
    },
    "node_modules/yargs/node_modules/find-up": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-3.0.0.tgz",
      "integrity": "sha512-1yD6RmLI1XBfxugvORwlck6f75tYL+iR0jqwsOrOxMZyGYqUuDhJ0l4AXdO1iX/FTs9cBAMEk1gWSEx1kSbylg==",
      "dev": true,
      "dependencies": {
        "locate-path": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/yargs/node_modules/locate-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-3.0.0.tgz",
      "integrity": "sha512-7AO748wWnIhNqAuaty2ZWHkQHRSNfPVIsPIfwEOWO22AmaoVrWavlOcMR5nzTLNYvp36X220/maaRsrec1G65A==",
      "dev": true,
      "dependencies": {
        "p-locate": "^3.0.0",
        "path-exists": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/yargs/node_modules/p-locate": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-3.0.0.tgz",
      "integrity": "sha512-x+12w/To+4GFfgJhBEpiDcLozRJGegY+Ei7/z0tSLkMmxGZNybVMSfWj9aJn8Z5Fc7dBUNJOOVgPv2H7IwulSQ==",
      "dev": true,
      "dependencies": {
        "p-limit": "^2.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/yargs/node_modules/path-exists": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-3.0.0.tgz",
      "integrity": "sha1-zg6+ql94yxiSXqfYENe1mwEP1RU= sha512-bpC7GYwiDYQ4wYLe+FA8lhRjhQCMcQGuSgGGqDkg/QerRWw9CmGRT0iSOVRSZJ29NMLZgIzqaljJ63oaL4NIJQ==",
      "dev": true,
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    }
  }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/package.json

```json
{
  "name": "three-fps-demo",
  "version": "0.9.0",
  "description": "Three.js FPS Demo",
  "keywords": [
    "webgl",
    "boilerplate",
    "three.js",
    "es6",
    "webpack"
  ],
  "scripts": {
    "start": "NODE_OPTIONS=--openssl-legacy-provider webpack serve",
    "prebuild": "npx rimraf ./build && npx mkdirp ./build",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "@types/ammo.js": "github:osman-turan/ammo.js-typings",
    "ammo.js": "kripken/ammo.js",
    "three": "^0.127.0",
    "three-pathfinding": "^0.14.1",
    "webpack-cli": "^4.3.1"
  },
  "devDependencies": {
    "@babel/core": "^7.12.10",
    "@babel/preset-env": "^7.12.11",
    "babel-loader": "^8.2.2",
    "file-loader": "^6.2.0",
    "html-webpack-plugin": "^4.5.1",
    "raw-loader": "^4.0.2",
    "webpack": "^5.14.0",
    "webpack-dev-server": "^3.11.2"
  },
  "engines": {
    "node": ">=8.0.0"
  },
  "browserslist": [
    "since 2017-06"
  ]
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/WOW.md

````md
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
````

## File: /Users/saint/Desktop/game-dev/three-fps/src/index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Text&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body{
        margin: 0;
        font-family: 'Roboto', sans-serif;
        color: white;
      }
      #crosshair{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2%;
        transform: translate(-50%, -50%);
      }
      #ammo_container{
        position: absolute;
        right: 5%;
        bottom: 5%;
        font-size: 3em;
      }
      #progress{
        position: absolute;
        bottom: 9%;
        left: 0;
        width: 0;
        height: 2%;
        background-color: white;
      }
      #health_container{
        position: absolute;
        bottom: 8%;
        left: 5%;
        width: 18%;
        height: 2%;
        border: 1px solid #ffffff;
      }
      #health_progress{
        position: absolute;
        background-color: #ffffff;
        width: 100%;
        height: 100%;
      }
      #game_hud{
        visibility: hidden;
      }
      #menu{
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: black;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        visibility: hidden;
      }
      h1{
        font-family: 'Libre Barcode 39 Text', cursive;
        font-size: 4em;
      }
      button{
        background-color: rgba(0,0,0,0);
        color: rgb(221, 221, 221);
        font-size: 1.5em;
        border: none;
        cursor: pointer;
        margin-top: 10%;
        font-weight: 700;
      }
      #debug{
        position: absolute;
        right: 5%;
        top: 5%;
      }
    </style>
  </head>

  <body>
    <div id="debug"></div>
    <div id="menu">
      <h1>Shooter Game Demo</h1>
      <button id="start_game">NEW GAME</button>
    </div>
    <div id="game_hud">
      <img id="crosshair" src="<%=require('./ui/crosshair.png')%>" />
      <div id="ammo_container">
        <span id="current_ammo">0</span>
        <span>|</span>
        <span id="max_ammo">0</span>
      </div>
      <div id="health_container">
        <div id="health_progress"></div>
      </div>
    </div>
    <div id="progress"></div>
    <my-app></my-app>
  </body>
</html>
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/EntityManager.js

```js
export default class EntityManager{
    constructor(){
        this.ids = 0;
        this.entities = [];
    }

    Get(name){
        return this.entities.find(el=>el.Name===name);
    }

    Add(entity){
        if(!entity.Name){
            entity.SetName(this.ids);
        }
        entity.id = this.ids;
        this.ids++;
        entity.SetParent(this);
        this.entities.push(entity);
    }

    EndSetup(){
        for(const ent of this.entities){
            for(const key in ent.components){
                ent.components[key].Initialize();
            }
        }
    }

    PhysicsUpdate(world, timeStep){
        for (const entity of this.entities) {
            entity.PhysicsUpdate(world, timeStep);
        }
    }

    Update(timeElapsed){
        for (const entity of this.entities) {
            entity.Update(timeElapsed);
        }
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/FiniteStateMachine.js

```js


class FiniteStateMachine {
    constructor() {
        this.states = {};
        this.currentState = null;
    }

    AddState(name, instance) {
        this.states[name] = instance;
    }

    SetState(name) {
        const prevState = this.currentState;
        
        if (prevState) {
        if (prevState.Name == name) {
            return;
        }
        prevState.Exit();
        }

        this.currentState = this.states[name];
        this.currentState.Enter(prevState);
    }

    Update(timeElapsed) {
        this.currentState && this.currentState.Update(timeElapsed);
    }
};

class State {
    constructor(parent) {
        this.parent = parent;
    }

    Enter() {}
    Exit() {}
    Update() {}
};

export {State, FiniteStateMachine}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/AmmoLib.js

```js
import * as _Ammo from "ammo.js"
import * as THREE from 'three'
import {ConvexHull} from '../node_modules/three/examples/jsm/math/ConvexHull'

let Ammo = null;
let rayOrigin = null;
let rayDest = null;
let closestRayResultCallback = null;

const CollisionFlags = { CF_NO_CONTACT_RESPONSE: 4 }
const CollisionFilterGroups = { 
  DefaultFilter: 1,
  StaticFilter: 2,
  KinematicFilter: 4,
  DebrisFilter: 8,
  SensorTrigger: 16,
  CharacterFilter: 32,
  AllFilter: -1 //all bits sets: DefaultFilter | StaticFilter | KinematicFilter | DebrisFilter | SensorTrigger
};

function createConvexHullShape(object) {
    const geometry = createConvexGeom(object);
    let coords = geometry.attributes.position.array;
    let tempVec = new Ammo.btVector3(0, 0, 0);
    let shape = new Ammo.btConvexHullShape();
    for (let i = 0, il = coords.length; i < il; i+= 3) {
      tempVec.setValue(coords[i], coords[i + 1], coords[i + 2]);
      let lastOne = (i >= (il - 3));
      shape.addPoint(tempVec, lastOne);
    }
    return shape;
}
  
function createConvexGeom (object) {
  // Compute the 3D convex hull.
  let hull = new ConvexHull().setFromObject(object);
  let faces = hull.faces;
  let vertices = [];
  let normals = [];

  for ( var i = 0; i < faces.length; i ++ ) {
    var face = faces[ i ];
    var edge = face.edge;
    do {
      var point = edge.head().point;
      vertices.push( point.x, point.y, point.z);
      normals.push( face.normal.x, face.normal.y, face.normal.z );
      edge = edge.next;
    } while ( edge !== face.edge );
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  geom.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );

  return geom;
}

class AmmoHelper{

  static Init(callback = ()=>{}){
    _Ammo().then((ammo)=>{
        Ammo = ammo;
        callback();
    });
  }

  static CreateTrigger(shape, position, rotation){
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    position && transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
    rotation && transform.setRotation(new Ammo.btQuaternion(rotation.x, rotation.y, rotation.z, rotation.w));
  
    const ghostObj = new Ammo.btPairCachingGhostObject();
    ghostObj.setCollisionShape(shape);
    ghostObj.setCollisionFlags(CollisionFlags.CF_NO_CONTACT_RESPONSE);
    ghostObj.setWorldTransform(transform);
  
    return ghostObj;
  }

  static IsTriggerOverlapping(ghostObj, rigidBody){
    for(let i = 0; i < ghostObj.getNumOverlappingObjects(); i++)
    {
        const body = Ammo.castObject( ghostObj.getOverlappingObject(i), Ammo.btRigidBody );
        if(body == rigidBody){
            return true;
        }
    }
  
    return false;
  }

  static CastRay(world, origin, dest, result={}, collisionFilterMask=CollisionFilterGroups.AllFilter){
    if(!rayOrigin){
        rayOrigin = new Ammo.btVector3();
        rayDest = new Ammo.btVector3();
        closestRayResultCallback = new Ammo.ClosestRayResultCallback( rayOrigin, rayDest );
    }

    // Reset closestRayResultCallback to reuse it
    const rayCallBack = Ammo.castObject( closestRayResultCallback, Ammo.RayResultCallback );
    rayCallBack.set_m_closestHitFraction( 1 );
    rayCallBack.set_m_collisionObject( null );

    rayCallBack.m_collisionFilterMask = collisionFilterMask;
  
    // Set closestRayResultCallback origin and dest
    rayOrigin.setValue( origin.x, origin.y, origin.z );
    rayDest.setValue( dest.x, dest.y, dest.z );
    closestRayResultCallback.get_m_rayFromWorld().setValue( origin.x, origin.y, origin.z );
    closestRayResultCallback.get_m_rayToWorld().setValue( dest.x, dest.y, dest.z );

    // Perform ray test
    world.rayTest( rayOrigin, rayDest, closestRayResultCallback );
  
    if ( closestRayResultCallback.hasHit() ) {

        if(result.intersectionPoint){
            const point = closestRayResultCallback.get_m_hitPointWorld();
            result.intersectionPoint.set( point.x(), point.y(), point.z() );
        }

        if (result.intersectionNormal) {
            const normal = closestRayResultCallback.get_m_hitNormalWorld();
            result.intersectionNormal.set( normal.x(), normal.y(), normal.z() );
        }

        result.collisionObject = rayCallBack.get_m_collisionObject();
        return true;
    }
    else {
        return false;
    }
  }

}

export {AmmoHelper, Ammo, createConvexHullShape, CollisionFlags, CollisionFilterGroups}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/DebugDrawer.js

```js
/**
 * @author       Yannick Deubel (https://github.com/yandeu)
 * @copyright    Copyright (c) 2020 Yannick Deubel; Project Url: https://github.com/enable3d/enable3d
 * @description  This is a modified version of the original code from Kevin Lee
 */

/**
 * @author       Kevin Lee (https://github.com/InfiniteLee)
 * @copyright    Copyright (c) 2019 Kevin Lee; Project Url: https://github.com/InfiniteLee/ammo-debug-drawer
 * @license      {@link https://github.com/InfiniteLee/ammo-debug-drawer/blob/master/LICENSE|MPL-2.0}
 */

 import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, Scene, StaticDrawUsage } from 'three'

 const AmmoDebugConstants = {
   NoDebug: 0,
   DrawWireframe: 1,
   DrawAabb: 2,
   DrawFeaturesText: 4,
   DrawContactPoints: 8,
   NoDeactivation: 16,
   NoHelpText: 32,
   DrawText: 64,
   ProfileTimings: 128,
   EnableSatComparison: 256,
   DisableBulletLCP: 512,
   EnableCCD: 1024,
   DrawConstraints: 1 << 11, //2048
   DrawConstraintLimits: 1 << 12, //4096
   FastWireframe: 1 << 13, //8192
   DrawNormals: 1 << 14, //16384
   DrawOnTop: 1 << 15, //32768
   MAX_DEBUG_DRAW_MODE: 0xffffffff
 }
 
 /**
  * An implementation of the btIDebugDraw interface in Ammo.js, for debug rendering of Ammo shapes
  */
 class DebugDrawer {

   constructor(scene, world, options = {}) {
     this.scene = scene;
     this.world = world;
     this.options = options;
     this.debugDrawMode = options.debugDrawMode || AmmoDebugConstants.DrawWireframe;
     const drawOnTop = this.debugDrawMode & AmmoDebugConstants.DrawOnTop || false;
     const maxBufferSize = options.maxBufferSize || 1000000;
 
     this.geometry = new BufferGeometry()
     const vertices = new Float32Array(maxBufferSize * 3)
     const colors = new Float32Array(maxBufferSize * 3)
 
     /*
     I do not know the difference, just using the first one.
     export const StaticDrawUsage: Usage;
     export const DynamicDrawUsage: Usage;
     export const StreamDrawUsage: Usage;
     export const StaticReadUsage: Usage;
     export const DynamicReadUsage: Usage;
     export const StreamReadUsage: Usage;
     export const StaticCopyUsage: Usage;
     export const DynamicCopyUsage: Usage;
     export const StreamCopyUsage: Usage;
      */
     this.geometry.setAttribute('position', new BufferAttribute(vertices, 3).setUsage(StaticDrawUsage))
     this.geometry.setAttribute('color', new BufferAttribute(colors, 3).setUsage(StaticDrawUsage))
 
     this.index = 0
 
     const material = new LineBasicMaterial({
       vertexColors: true,
       depthTest: !drawOnTop
     });
 
     this.mesh = new LineSegments(this.geometry, material);
     if (drawOnTop) this.mesh.renderOrder = 999;
     this.mesh.frustumCulled = false;
 
     this.enabled = false;
 
     this.debugDrawer = new Ammo.DebugDrawer();
     this.debugDrawer.drawLine = this.drawLine.bind(this);
     this.debugDrawer.drawContactPoint = this.drawContactPoint.bind(this);
     this.debugDrawer.reportErrorWarning = this.reportErrorWarning.bind(this);
     this.debugDrawer.draw3dText = this.draw3dText.bind(this);
     this.debugDrawer.setDebugMode = this.setDebugMode.bind(this);
     this.debugDrawer.getDebugMode = this.getDebugMode.bind(this);
 
     this.world.setDebugDrawer(this.debugDrawer);
   }
 
   enable() {
     this.enabled = true;
     this.scene.add(this.mesh);
   }
 
   disable() {
     this.enabled = false;
     this.scene.remove(this.mesh);
   }
 
   update() {
     if (!this.enabled) {
       return;
     }
 
     if (this.index != 0) {
       // @ts-ignore
       this.geometry.attributes.position.needsUpdate = true;
       // @ts-ignore
       this.geometry.attributes.color.needsUpdate = true;
     }
 
     this.index = 0;
     this.world.debugDrawWorld();
     this.geometry.setDrawRange(0, this.index);
   }
 
   drawLine(from, to, color) {
     // @ts-ignore
     const heap = Ammo.HEAPF32;
     const r = heap[(color + 0) / 4];
     const g = heap[(color + 4) / 4];
     const b = heap[(color + 8) / 4];
 
     const fromX = heap[(from + 0) / 4];
     const fromY = heap[(from + 4) / 4];
     const fromZ = heap[(from + 8) / 4];
     this.geometry.attributes.position.setXYZ(this.index, fromX, fromY, fromZ);
     this.geometry.attributes.color.setXYZ(this.index++, r, g, b);
 
     const toX = heap[(to + 0) / 4];
     const toY = heap[(to + 4) / 4];
     const toZ = heap[(to + 8) / 4];
     this.geometry.attributes.position.setXYZ(this.index, toX, toY, toZ);
     this.geometry.attributes.color.setXYZ(this.index++, r, g, b);
   }
 
   //TODO: figure out how to make lifeTime work
   drawContactPoint(pointOnB, normalOnB, distance, _lifeTime, color) {
     // @ts-ignore
     const heap = Ammo.HEAPF32;
     const r = heap[(color + 0) / 4];
     const g = heap[(color + 4) / 4];
     const b = heap[(color + 8) / 4];
 
     const x = heap[(pointOnB + 0) / 4];
     const y = heap[(pointOnB + 4) / 4];
     const z = heap[(pointOnB + 8) / 4];
     this.geometry.attributes.position.setXYZ(this.index, x, y, z);
     this.geometry.attributes.color.setXYZ(this.index++, r, g, b);
 
     const dx = heap[(normalOnB + 0) / 4] * distance;
     const dy = heap[(normalOnB + 4) / 4] * distance;
     const dz = heap[(normalOnB + 8) / 4] * distance;
     this.geometry.attributes.position.setXYZ(this.index, x + dx, y + dy, z + dz);
     this.geometry.attributes.color.setXYZ(this.index++, r, g, b);
   }
 
   reportErrorWarning(warningString) {
     // eslint-disable-next-line no-prototype-builtins
     if (Ammo.hasOwnProperty('Pointer_stringify')) {
       // @ts-ignore
       console.warn(Ammo.Pointer_stringify(warningString));
     } else if (!this.warnedOnce) {
       this.warnedOnce = true;
       console.warn("Cannot print warningString, please rebuild Ammo.js using 'debug' flag");
     }
   }
 
   draw3dText(_location, _textString) {
     //TODO
     console.warn('TODO: draw3dText');
   }
 
   setDebugMode(debugMode) {
     this.debugDrawMode = debugMode;
   }
 
   getDebugMode() {
     return this.debugDrawMode;
   }
 }
 
 export default DebugDrawer
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/DebugShapes.js

```js
import * as THREE from 'three'

export default class DebugShapes{
    constructor(scene){
        this.scene = scene;
        this.meshes = [];
        this.pointGeom = new THREE.SphereGeometry( 0.3, 8, 8 );
    }

    AddPoint(position, color){
        const material = new THREE.MeshBasicMaterial( {color, wireframe: true} );
        const sphere = new THREE.Mesh( this.pointGeom, material );
        sphere.position.copy(position);
        this.scene.add( sphere );
        this.meshes.push(sphere);
    }
    
    Clear(){
        for(const mesh of this.meshes){
            this.scene.remove(mesh);
        }
    
        this.meshes.length = 0;
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/Component.js

```js
export default class Component{
    constructor(){
        this.parent = null;
    }

    Initialize(){}

    SetParent(parent){
        this.parent = parent;
    }

    GetComponent(name) {
        return this.parent.GetComponent(name);
    }

    FindEntity(name) {
        return this.parent.FindEntity(name);
    }

    Broadcast(msg){
        this.parent.Broadcast(msg);
    }

    Update(_) {}

    PhysicsUpdate(_){}
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/assets/navmesh.obj

```obj
# Blender v2.79 (sub 0) OBJ File: ''
# www.blender.org
o Navmesh_Navmesh.001
v -5.769411 0.199995 41.820972
v -5.769411 0.199995 39.120972
v -0.969411 0.199995 39.120972
v -0.969411 0.199995 41.520973
v 5.930590 0.199995 41.520973
v 3.230590 0.199995 23.520973
v 18.230591 0.199995 21.720972
v 23.030590 0.199995 22.020971
v 23.030590 0.199995 26.820972
v 25.130592 0.199995 27.120972
v 25.130592 0.199995 37.620972
v 22.430592 0.199995 37.620972
v 22.130589 0.199995 40.020973
v 16.730591 0.199995 40.020973
v 16.430592 0.199995 37.620972
v 8.630589 0.199995 37.620972
v 8.330589 0.199995 40.020973
v 7.130589 0.199995 40.020973
v 6.830589 0.199995 37.620972
v 0.530590 0.199995 37.620972
v 0.530590 0.199995 31.320972
v 3.230590 0.199995 31.020973
v -6.069411 5.199996 37.620972
v -6.069411 5.199996 36.420975
v -0.969411 5.199996 36.420975
v -0.969411 5.199996 37.620972
v 33.830593 0.199995 27.120972
v 34.130592 0.199995 25.920973
v 35.330593 0.199995 26.220972
v 35.330593 0.199995 33.120972
v 32.630592 0.199995 34.920975
v 29.330593 0.199995 34.920975
v 29.030590 0.199995 37.620972
v 35.630592 0.199995 33.720974
v 39.530590 0.199995 33.420975
v 39.530590 0.199995 27.720972
v 41.030590 0.199995 27.420973
v 41.030590 0.199995 37.620972
v 32.930592 0.199995 37.620972
v 33.230591 0.199995 35.220974
v -6.069411 2.599996 35.220974
v -6.069411 2.599996 31.320972
v -0.969411 2.599996 31.320972
v -0.969411 2.599996 35.220974
v -5.769411 0.199995 29.820972
v -5.769411 0.199995 23.520973
v -5.769411 0.199995 16.920973
v -5.769411 0.199995 10.620972
v -5.769411 0.199995 4.020973
v -0.669411 0.199995 4.020973
v -0.669411 0.199995 9.120972
v -3.369411 0.199995 9.420971
v -3.369411 0.199995 19.620972
v -3.369411 0.199995 29.820972
v -1.869411 5.199996 29.820972
v -1.869411 5.199996 20.220972
v -1.869411 5.199996 10.620972
v -0.969411 5.199996 10.620972
v -0.969411 5.199996 17.220972
v -0.669411 5.199996 23.520973
v -0.969411 5.199996 29.820972
v 0.530590 2.599996 29.820972
v 0.530590 2.599996 24.420973
v 1.730590 2.599996 24.420973
v 1.730590 2.599996 29.820972
v 34.130592 0.199995 19.020971
v 33.530590 0.199995 18.720972
v 34.430592 0.199995 17.520971
v 41.030590 0.199995 17.820972
v 39.230591 0.199995 25.320972
v 35.630592 0.199995 25.320972
v 24.530590 2.599996 25.620972
v 24.530590 2.599996 24.720972
v 31.130592 2.599996 24.720972
v 31.430592 2.599996 20.220972
v 32.630592 2.599996 20.220972
v 32.630592 2.599996 25.620972
v 42.530594 5.199996 24.120972
v 42.530594 5.199996 22.920973
v 47.630592 5.199996 22.920973
v 47.630592 5.199996 24.120972
v 2.930590 0.199995 22.920973
v 0.530590 0.199995 22.920973
v 0.530590 0.199995 10.920971
v 5.630589 0.199995 10.920971
v 5.930590 0.199995 6.420971
v 11.930591 0.199995 6.720970
v 18.230591 0.199995 6.420971
v 18.230591 0.199995 14.220970
v 42.530594 2.599996 21.420973
v 42.530594 2.599996 17.820972
v 47.630592 2.599996 17.820972
v 47.630592 2.599996 21.420973
v 24.530590 0.199995 7.620972
v 31.730591 0.199995 7.620972
v 31.730591 0.199995 15.120972
v 34.430592 0.199995 15.420971
v 30.230591 0.199995 18.720972
v 29.930592 0.199995 20.820972
v 24.530590 0.199995 20.820972
v 24.530590 0.199995 14.220970
v 19.730591 5.199996 13.620972
v 19.730591 5.199996 8.520973
v 23.030590 5.199996 8.520973
v 23.030590 5.199996 20.520971
v 22.130589 5.199996 20.520971
v 22.130589 5.199996 14.220970
v 21.530590 5.199996 13.620972
v 38.330593 0.199995 2.220970
v 42.830593 0.199995 1.920971
v 42.830593 0.199995 8.220970
v 42.830593 0.199995 14.220970
v 35.930592 0.199995 13.920971
v 35.930592 0.199995 8.520973
v 38.330593 0.199995 8.220970
v 3.230590 2.599996 9.420971
v 3.230590 2.599996 4.020973
v 11.330590 2.599996 4.020973
v 11.330590 2.599996 4.920971
v 5.330589 2.599996 4.920971
v 4.430590 2.599996 5.820972
v 4.430590 2.599996 9.420971
v 21.830589 0.199995 0.120972
v 22.730591 0.199995 -1.079029
v 26.330593 0.199995 -1.379028
v 26.330593 0.199995 -5.279030
v 32.030590 0.199995 -5.279030
v 31.730591 0.199995 1.320972
v 34.430592 0.199995 1.620972
v 34.430592 0.199995 7.020973
v 32.030590 0.199995 7.020973
v 24.230591 0.199995 7.020973
v 22.130589 0.199995 7.020973
v 18.530590 0.199995 0.120972
v 18.230591 0.199995 2.520973
v 9.230590 0.199995 2.520973
v 0.530590 0.199995 2.520973
v 0.530590 0.199995 -5.279030
v 11.330590 0.199995 -5.279030
v 22.430592 0.199995 -5.279030
v 38.030590 0.199995 0.120972
v 35.930592 0.199995 0.120972
v 35.630592 0.199995 -6.779030
v 42.830593 0.199995 -6.779030
v -5.769411 0.199995 0.120972
v -5.769411 0.199995 -6.779030
v -3.069411 0.199995 -6.779030
v -3.369411 0.199995 0.120972
v 0.830589 2.599996 -6.779030
v 0.830589 2.599996 -11.879028
v 1.730590 2.599996 -11.879028
v 1.730590 2.599996 -8.279030
v 2.330589 2.599996 -7.679028
v 8.630589 2.599996 -7.679028
v 8.630589 2.599996 -6.779030
v 10.130589 5.199996 -6.779030
v 10.130589 5.199996 -7.679028
v 16.130589 5.199996 -7.679028
v 22.430592 5.199996 -7.679028
v 22.430592 5.199996 -6.779030
v 16.130589 5.199996 -6.779030
vn 0.0000 1.0000 0.0000
s off
f 1//1 5//1 4//1
f 1//1 4//1 2//1
f 2//1 4//1 3//1
f 19//1 18//1 16//1
f 16//1 18//1 17//1
f 22//1 19//1 16//1
f 9//1 15//1 12//1
f 12//1 15//1 13//1
f 13//1 15//1 14//1
f 9//1 7//1 15//1
f 15//1 7//1 16//1
f 16//1 7//1 22//1
f 22//1 7//1 6//1
f 9//1 8//1 7//1
f 19//1 22//1 20//1
f 20//1 22//1 21//1
f 9//1 12//1 10//1
f 10//1 12//1 11//1
f 26//1 25//1 23//1
f 23//1 25//1 24//1
f 30//1 29//1 27//1
f 27//1 29//1 28//1
f 10//1 11//1 32//1
f 32//1 11//1 33//1
f 27//1 10//1 30//1
f 30//1 10//1 31//1
f 31//1 10//1 32//1
f 34//1 30//1 40//1
f 40//1 30//1 31//1
f 38//1 37//1 35//1
f 35//1 37//1 36//1
f 38//1 35//1 39//1
f 39//1 35//1 34//1
f 39//1 34//1 40//1
f 44//1 43//1 41//1
f 41//1 43//1 42//1
f 49//1 52//1 50//1
f 50//1 52//1 51//1
f 47//1 46//1 53//1
f 52//1 49//1 48//1
f 53//1 46//1 54//1
f 54//1 46//1 45//1
f 53//1 52//1 47//1
f 47//1 52//1 48//1
f 59//1 56//1 60//1
f 60//1 56//1 61//1
f 61//1 56//1 55//1
f 56//1 59//1 57//1
f 57//1 59//1 58//1
f 65//1 64//1 62//1
f 62//1 64//1 63//1
f 68//1 67//1 66//1
f 66//1 28//1 71//1
f 71//1 28//1 29//1
f 69//1 70//1 37//1
f 37//1 70//1 36//1
f 71//1 70//1 66//1
f 66//1 70//1 68//1
f 68//1 70//1 69//1
f 77//1 76//1 74//1
f 74//1 76//1 75//1
f 77//1 74//1 72//1
f 72//1 74//1 73//1
f 81//1 80//1 78//1
f 78//1 80//1 79//1
f 87//1 86//1 85//1
f 89//1 88//1 87//1
f 85//1 84//1 82//1
f 82//1 84//1 83//1
f 7//1 89//1 6//1
f 6//1 89//1 82//1
f 82//1 89//1 85//1
f 85//1 89//1 87//1
f 93//1 92//1 90//1
f 90//1 92//1 91//1
f 96//1 98//1 97//1
f 97//1 98//1 68//1
f 68//1 98//1 67//1
f 96//1 101//1 98//1
f 98//1 101//1 100//1
f 94//1 101//1 95//1
f 95//1 101//1 96//1
f 100//1 99//1 98//1
f 104//1 103//1 108//1
f 108//1 103//1 102//1
f 104//1 107//1 105//1
f 105//1 107//1 106//1
f 104//1 108//1 107//1
f 112//1 111//1 113//1
f 113//1 111//1 115//1
f 113//1 115//1 114//1
f 115//1 111//1 109//1
f 109//1 111//1 110//1
f 117//1 116//1 121//1
f 121//1 116//1 122//1
f 117//1 120//1 118//1
f 118//1 120//1 119//1
f 117//1 121//1 120//1
f 125//1 124//1 123//1
f 128//1 131//1 129//1
f 129//1 131//1 130//1
f 123//1 133//1 132//1
f 95//1 131//1 128//1
f 128//1 127//1 125//1
f 125//1 127//1 126//1
f 128//1 125//1 95//1
f 95//1 125//1 94//1
f 94//1 125//1 132//1
f 132//1 125//1 123//1
f 140//1 139//1 124//1
f 124//1 139//1 123//1
f 123//1 139//1 134//1
f 139//1 136//1 134//1
f 134//1 136//1 135//1
f 139//1 138//1 136//1
f 136//1 138//1 137//1
f 141//1 109//1 110//1
f 143//1 142//1 141//1
f 110//1 144//1 141//1
f 141//1 144//1 143//1
f 145//1 148//1 146//1
f 146//1 148//1 147//1
f 149//1 152//1 150//1
f 150//1 152//1 151//1
f 149//1 155//1 153//1
f 153//1 155//1 154//1
f 153//1 152//1 149//1
f 161//1 158//1 156//1
f 156//1 158//1 157//1
f 161//1 160//1 158//1
f 158//1 160//1 159//1
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/Entity.js

```js
import { Vector3, Quaternion } from 'three';

export default class Entity{
    constructor(){
        this.name = null;
        this.components = {};
        this.position = new Vector3();
        this.rotation = new Quaternion();
        this.parent = null;
        this.eventHandlers = {};
    }

    AddComponent(component){
        component.SetParent(this);
        this.components[component.name] = component;
    }

    SetParent(parent){
        this.parent = parent;
    }

    SetName(name){
        this.name = name;
    }

    get Name(){
        return this.name;
    }

    GetComponent(name){
        return this.components[name];
    }

    SetPosition(position){
        this.position.copy(position);
    }

    get Position(){
        return this.position;
    }

    SetRotation(rotation){
        this.rotation.copy(rotation);
    }

    get Rotation(){
        return this.rotation;
    }

    FindEntity(name) {
        return this.parent.Get(name);
    }

    RegisterEventHandler(handler, topic){
        if(!this.eventHandlers.hasOwnProperty(topic)){
            this.eventHandlers[topic] = [];
        }

        this.eventHandlers[topic].push(handler);
    }

    Broadcast(msg){
        if(!this.eventHandlers.hasOwnProperty(msg.topic)){
            return;
        }

        for(const handler of this.eventHandlers[msg.topic]){
            handler(msg);
        }
    }

    PhysicsUpdate(world, timeStep){
        for (let k in this.components) {
            this.components[k].PhysicsUpdate(world, timeStep);
        }
    }

    Update(timeElapsed) {
        for (let k in this.components) {
          this.components[k].Update(timeElapsed);
        }
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/Input.js

```js


class Input{
    constructor(){
        this._keyMap = {};
        this.events = [];

        this.AddKeyDownListner(this._onKeyDown);
        this.AddKeyUpListner(this._onKeyUp);
    }

    _addEventListner(element, type, callback){
        element.addEventListener(type, callback);
        this.events.push({element, type, callback});
    }

    AddKeyDownListner(callback){
        this._addEventListner(document, 'keydown', callback);
    }

    AddKeyUpListner(callback){
        this._addEventListner(document, 'keyup', callback);
    }

    AddMouseMoveListner(callback){
        this._addEventListner(document, 'mousemove', callback);
    }

    AddClickListner(callback){
        this._addEventListner(document.body, 'click', callback);
    }

    AddMouseDownListner(callback){
        this._addEventListner(document.body, 'mousedown', callback);
    }

    AddMouseUpListner(callback){
        this._addEventListner(document.body, 'mouseup', callback);
    }

    _onKeyDown = (event) => {
        this._keyMap[event.code] = 1;
    }

    _onKeyUp = (event) => {
        this._keyMap[event.code] = 0;
    }

    GetKeyDown(code){
        return this._keyMap[code] === undefined ? 0 : this._keyMap[code];
    }

    ClearEventListners(){
        this.events.forEach(e=>{
            e.element.removeEventListener(e.type, e.callback);
        });

        this.events = [];
        this.AddKeyDownListner(this._onKeyDown);
        this.AddKeyUpListner(this._onKeyUp);
    }
}

const inputInstance = new Input();
export default inputInstance;
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entry.js

```js
/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene, Physics and Entities. It also starts the render loop and 
 * handles window resizes.
 * 
 */

import * as THREE from 'three'
import {AmmoHelper, Ammo, createConvexHullShape} from './AmmoLib'
import EntityManager from './EntityManager'
import Entity from './Entity'
import Sky from './entities/Sky/Sky2'
import LevelSetup from './entities/Level/LevelSetup'
import PlayerControls from './entities/Player/PlayerControls'
import PlayerPhysics from './entities/Player/PlayerPhysics'
import Stats from 'three/examples/jsm/libs/stats.module'
import {  FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import {  GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {  OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import {  SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'
import NpcCharacterController from './entities/NPC/CharacterController'
import Input from './Input'

import level from './assets/level.glb'
import navmesh from './assets/navmesh.obj'

import mutant from './assets/animations/mutant.fbx'
import idleAnim from './assets/animations/mutant breathing idle.fbx'
import attackAnim from './assets/animations/Mutant Punch.fbx'
import walkAnim from './assets/animations/mutant walking.fbx'
import runAnim from './assets/animations/mutant run.fbx'
import dieAnim from './assets/animations/mutant dying.fbx'

//AK47 Model and textures
import ak47 from './assets/guns/ak47/ak47.glb'
import muzzleFlash from './assets/muzzle_flash.glb'
//Shot sound
import ak47Shot from './assets/sounds/ak47_shot.wav'

//Ammo box
import ammobox from './assets/ammo/AmmoBox.fbx'
import ammoboxTexD from './assets/ammo/AmmoBox_D.tga.png'
import ammoboxTexN from './assets/ammo/AmmoBox_N.tga.png'
import ammoboxTexM from './assets/ammo/AmmoBox_M.tga.png'
import ammoboxTexR from './assets/ammo/AmmoBox_R.tga.png'
import ammoboxTexAO from './assets/ammo/AmmoBox_AO.tga.png'

//Bullet Decal
import decalColor from './assets/decals/decal_c.jpg'
import decalNormal from './assets/decals/decal_n.jpg'
import decalAlpha from './assets/decals/decal_a.jpg'

//Sky
import skyTex from './assets/sky.jpg'

import DebugDrawer from './DebugDrawer'
import Navmesh from './entities/Level/Navmesh'
import AttackTrigger from './entities/NPC/AttackTrigger'
import DirectionDebug from './entities/NPC/DirectionDebug'
import CharacterCollision from './entities/NPC/CharacterCollision'
import Weapon from './entities/Player/Weapon'
import UIManager from './entities/UI/UIManager'
import AmmoBox from './entities/AmmoBox/AmmoBox'
import LevelBulletDecals from './entities/Level/BulletDecals'
import PlayerHealth from './entities/Player/PlayerHealth'

class FPSGameApp{

  constructor(){
    this.lastFrameTime = null;
    this.assets = {};
    this.animFrameId = 0;

    AmmoHelper.Init(()=>{this.Init();});
  }

  Init(){
    this.LoadAssets();
    this.SetupGraphics();
    this.SetupStartButton();
  }

  SetupGraphics(){
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = THREE.ReinhardToneMapping;
		this.renderer.toneMappingExposure = 1;
		this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.camera = new THREE.PerspectiveCamera();
    this.camera.near = 0.01;

    // create an AudioListener and add it to the camera
    this.listener = new THREE.AudioListener();
    this.camera.add( this.listener );

    // renderer
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.WindowResizeHanlder();
    window.addEventListener('resize', this.WindowResizeHanlder);

    document.body.appendChild( this.renderer.domElement );

    // Stats.js
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  SetupPhysics() {
    // Physics configuration
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    const broadphase = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
    this.physicsWorld.setGravity( new Ammo.btVector3( 0.0, -9.81, 0.0 ) );
    const fp = Ammo.addFunction(this.PhysicsUpdate);
    this.physicsWorld.setInternalTickCallback(fp);
    this.physicsWorld.getBroadphase().getOverlappingPairCache().setInternalGhostPairCallback(new Ammo.btGhostPairCallback());

    //Physics debug drawer
    //this.debugDrawer = new DebugDrawer(this.scene, this.physicsWorld);
    //this.debugDrawer.enable();
  }

  SetAnim(name, obj){
    const clip = obj.animations[0];
    this.mutantAnims[name] = clip;
  }

  PromiseProgress(proms, progress_cb){
    let d = 0;
    progress_cb(0);
    for (const p of proms) {
      p.then(()=> {    
        d++;
        progress_cb( (d / proms.length) * 100 );
      });
    }
    return Promise.all(proms);
  }

  AddAsset(asset, loader, name){
    return loader.loadAsync(asset).then( result =>{
      this.assets[name] = result;
    });
  }

  OnProgress(p){
    const progressbar = document.getElementById('progress');
    progressbar.style.width = `${p}%`;
  }

  HideProgress(){
    this.OnProgress(0);
  }

  SetupStartButton(){
    document.getElementById('start_game').addEventListener('click', this.StartGame);
  }

  ShowMenu(visible=true){
    document.getElementById('menu').style.visibility = visible?'visible':'hidden';
  }

  async LoadAssets(){
    const gltfLoader = new GLTFLoader();
    const fbxLoader = new FBXLoader();
    const objLoader = new OBJLoader();
    const audioLoader = new THREE.AudioLoader();
    const texLoader = new THREE.TextureLoader();
    const promises = [];

    //Level
    promises.push(this.AddAsset(level, gltfLoader, "level"));
    promises.push(this.AddAsset(navmesh, objLoader, "navmesh"));
    //Mutant
    promises.push(this.AddAsset(mutant, fbxLoader, "mutant"));
    promises.push(this.AddAsset(idleAnim, fbxLoader, "idleAnim"));
    promises.push(this.AddAsset(walkAnim, fbxLoader, "walkAnim"));
    promises.push(this.AddAsset(runAnim, fbxLoader, "runAnim"));
    promises.push(this.AddAsset(attackAnim, fbxLoader, "attackAnim"));
    promises.push(this.AddAsset(dieAnim, fbxLoader, "dieAnim"));
    //AK47
    promises.push(this.AddAsset(ak47, gltfLoader, "ak47"));
    promises.push(this.AddAsset(muzzleFlash, gltfLoader, "muzzleFlash"));
    promises.push(this.AddAsset(ak47Shot, audioLoader, "ak47Shot"));
    //Ammo box
    promises.push(this.AddAsset(ammobox, fbxLoader, "ammobox"));
    promises.push(this.AddAsset(ammoboxTexD, texLoader, "ammoboxTexD"));
    promises.push(this.AddAsset(ammoboxTexN, texLoader, "ammoboxTexN"));
    promises.push(this.AddAsset(ammoboxTexM, texLoader, "ammoboxTexM"));
    promises.push(this.AddAsset(ammoboxTexR, texLoader, "ammoboxTexR"));
    promises.push(this.AddAsset(ammoboxTexAO, texLoader, "ammoboxTexAO"));
    //Decal
    promises.push(this.AddAsset(decalColor, texLoader, "decalColor"));
    promises.push(this.AddAsset(decalNormal, texLoader, "decalNormal"));
    promises.push(this.AddAsset(decalAlpha, texLoader, "decalAlpha"));

    promises.push(this.AddAsset(skyTex, texLoader, "skyTex"));

    await this.PromiseProgress(promises, this.OnProgress);

    this.assets['level'] = this.assets['level'].scene;
    this.assets['muzzleFlash'] = this.assets['muzzleFlash'].scene;

    //Extract mutant anims
    this.mutantAnims = {};
    this.SetAnim('idle', this.assets['idleAnim']);
    this.SetAnim('walk', this.assets['walkAnim']);
    this.SetAnim('run', this.assets['runAnim']);
    this.SetAnim('attack', this.assets['attackAnim']);
    this.SetAnim('die', this.assets['dieAnim']);

    this.assets['ak47'].scene.animations = this.assets['ak47'].animations;
    
    //Set ammo box textures and other props
    this.assets['ammobox'].scale.set(0.01, 0.01, 0.01);
    this.assets['ammobox'].traverse(child =>{
      child.castShadow = true;
      child.receiveShadow = true;
      
      child.material = new THREE.MeshStandardMaterial({
        map: this.assets['ammoboxTexD'],
        aoMap: this.assets['ammoboxTexAO'],
        normalMap: this.assets['ammoboxTexN'],
        metalness: 1,
        metalnessMap: this.assets['ammoboxTexM'],
        roughnessMap: this.assets['ammoboxTexR'],
        color: new THREE.Color(0.4, 0.4, 0.4)
      });
      
    });

    this.assets['ammoboxShape'] = createConvexHullShape(this.assets['ammobox']);

    this.HideProgress();
    this.ShowMenu();
  }

  EntitySetup(){
    this.entityManager = new EntityManager();

    const levelEntity = new Entity();
    levelEntity.SetName('Level');
    levelEntity.AddComponent(new LevelSetup(this.assets['level'], this.scene, this.physicsWorld));
    levelEntity.AddComponent(new Navmesh(this.scene, this.assets['navmesh']));
    levelEntity.AddComponent(new LevelBulletDecals(this.scene, this.assets['decalColor'], this.assets['decalNormal'], this.assets['decalAlpha']));
    this.entityManager.Add(levelEntity);

    const skyEntity = new Entity();
    skyEntity.SetName("Sky");
    skyEntity.AddComponent(new Sky(this.scene, this.assets['skyTex']));
    this.entityManager.Add(skyEntity);

    const playerEntity = new Entity();
    playerEntity.SetName("Player");
    playerEntity.AddComponent(new PlayerPhysics(this.physicsWorld, Ammo));
    playerEntity.AddComponent(new PlayerControls(this.camera, this.scene));
    playerEntity.AddComponent(new Weapon(this.camera, this.assets['ak47'].scene, this.assets['muzzleFlash'], this.physicsWorld, this.assets['ak47Shot'], this.listener ));
    playerEntity.AddComponent(new PlayerHealth());
    playerEntity.SetPosition(new THREE.Vector3(2.14, 1.48, -1.36));
    playerEntity.SetRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI * 0.5));
    this.entityManager.Add(playerEntity);

    const npcLocations = [
      [10.8, 0.0, 22.0],
    ];

    npcLocations.forEach((v,i)=>{
      const npcEntity = new Entity();
      npcEntity.SetPosition(new THREE.Vector3(v[0], v[1], v[2]));
      npcEntity.SetName(`Mutant${i}`);
      npcEntity.AddComponent(new NpcCharacterController(SkeletonUtils.clone(this.assets['mutant']), this.mutantAnims, this.scene, this.physicsWorld));
      npcEntity.AddComponent(new AttackTrigger(this.physicsWorld));
      npcEntity.AddComponent(new CharacterCollision(this.physicsWorld));
      npcEntity.AddComponent(new DirectionDebug(this.scene));
      this.entityManager.Add(npcEntity);
    });

    const uimanagerEntity = new Entity();
    uimanagerEntity.SetName("UIManager");
    uimanagerEntity.AddComponent(new UIManager());
    this.entityManager.Add(uimanagerEntity);

    const ammoLocations = [
       [14.37, 0.0, 10.45],
       [32.77, 0.0, 33.84],
    ];

    ammoLocations.forEach((loc, i) => {
      const box = new Entity();
      box.SetName(`AmmoBox${i}`);
      box.AddComponent(new AmmoBox(this.scene, this.assets['ammobox'].clone(), this.assets['ammoboxShape'], this.physicsWorld));
      box.SetPosition(new THREE.Vector3(loc[0], loc[1], loc[2]));
      this.entityManager.Add(box);
    });

    this.entityManager.EndSetup();

    this.scene.add(this.camera);
    this.animFrameId = window.requestAnimationFrame(this.OnAnimationFrameHandler);
  }

  StartGame = ()=>{
    window.cancelAnimationFrame(this.animFrameId);
    Input.ClearEventListners();

    //Create entities and physics
    this.scene.clear();
    this.SetupPhysics();
    this.EntitySetup();
    this.ShowMenu(false);
  }

  // resize
  WindowResizeHanlder = () => { 
    const { innerHeight, innerWidth } = window;
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  // render loop
  OnAnimationFrameHandler = (t) => {
    if(this.lastFrameTime===null){
      this.lastFrameTime = t;
    }

    const delta = t-this.lastFrameTime;
    let timeElapsed = Math.min(1.0 / 30.0, delta * 0.001);
    this.Step(timeElapsed);
    this.lastFrameTime = t;

    this.animFrameId = window.requestAnimationFrame(this.OnAnimationFrameHandler);
  }

  PhysicsUpdate = (world, timeStep)=>{
    this.entityManager.PhysicsUpdate(world, timeStep);
  }

  Step(elapsedTime){
    this.physicsWorld.stepSimulation( elapsedTime, 10 );
    //this.debugDrawer.update();

    this.entityManager.Update(elapsedTime);

    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

}

let _APP = null;
window.addEventListener('DOMContentLoaded', () => {
  _APP = new FPSGameApp();
});
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/UI/UIManager.js

```js
import Component from '../../Component'

export default class UIManager extends Component{
    constructor(){
        super();
        this.name = 'UIManager';
    }

    SetAmmo(mag, rest){
        document.getElementById("current_ammo").innerText = mag;
        document.getElementById("max_ammo").innerText = rest;
    }

    SetHealth(health){
        document.getElementById("health_progress").style.width = `${health}%`;
    }

    Initialize(){
        document.getElementById("game_hud").style.visibility = 'visible';
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Sky/Sky.js

```js
import * as THREE from 'three';
import Component from '../../Component'

const _VS = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

const _FS = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vWorldPosition;
void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;


export default class Sky extends Component{
    constructor(scene){
        super();
        this.scene = scene;
    }

    Initialize(){
        const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFFF, 0.6);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.scene.add(hemiLight);

        const uniforms = {
            "topColor": { value: new THREE.Color(0x0077ff) },
            "bottomColor": { value: new THREE.Color(0xffffff) },
            "offset": { value: 33 },
            "exponent": { value: 0.6 }
        };
        uniforms["topColor"].value.copy(hemiLight.color);

        this.scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);
        this.scene.fog.color.copy(uniforms["bottomColor"].value);

        const skyGeo = new THREE.SphereBufferGeometry(1000, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: _VS,
            fragmentShader: _FS,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Sky/Sky2.js

```js
import * as THREE from 'three';
import Component from '../../Component'


export default class Sky extends Component{
    constructor(scene, skyTexture){
        super();
        this.scene = scene;
        this.name = 'Sky';
        this.texture = skyTexture;
    }

    Initialize(){
        const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFFF, 1);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.scene.add(hemiLight);

        const skyGeo = new THREE.SphereGeometry(1000, 25, 25); 
        const skyMat = new THREE.MeshBasicMaterial({
             map: this.texture, 
             side: THREE.BackSide, 
             depthWrite: false,
             toneMapped: false
            });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        sky.rotateY(THREE.MathUtils.degToRad(-60));
        this.scene.add(sky);
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/AmmoBox/AmmoBox.js

```js
import Component from '../../Component'
import {Ammo, AmmoHelper, CollisionFilterGroups} from '../../AmmoLib'


export default class AmmoBox extends Component{
    constructor(scene, model, shape, physicsWorld){
        super();
        this.name = 'AmmoBox';
        this.model = model;
        this.shape = shape;
        this.scene = scene;
        this.world = physicsWorld;

        this.quat = new Ammo.btQuaternion();
        this.update = true;
    }

    Initialize(){
        this.player = this.FindEntity('Player');
        this.playerPhysics = this.player.GetComponent('PlayerPhysics');

        this.trigger = AmmoHelper.CreateTrigger(this.shape);

        this.world.addCollisionObject(this.trigger, CollisionFilterGroups.SensorTrigger);
        this.scene.add(this.model);
    }

    Disable(){
        this.update = false;
        this.scene.remove(this.model);
        this.world.removeCollisionObject(this.trigger);
    }

    Update(t){
        if(!this.update){
            return;
        }

        const entityPos = this.parent.position;
        const entityRot = this.parent.rotation;

        this.model.position.copy(entityPos);
        this.model.quaternion.copy(entityRot);

        const transform = this.trigger.getWorldTransform();

        this.quat.setValue(entityRot.x, entityRot.y, entityRot.z, entityRot.w);
        transform.setRotation(this.quat);
        transform.getOrigin().setValue(entityPos.x, entityPos.y, entityPos.z);

        if(AmmoHelper.IsTriggerOverlapping(this.trigger, this.playerPhysics.body)){
            this.player.Broadcast({topic: 'AmmoPickup'});
            this.Disable();
        }
    }

}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Level/BulletDecals.js

```js
import * as THREE from 'three'
import { Ammo } from "../../AmmoLib";
import Component from "../../Component";
import {  DecalGeometry  } from 'three/examples/jsm/geometries/DecalGeometry'


export default class LevelBulletDecals extends Component{
    constructor(scene, colorMap, normalMap, alphaMap){
        super();
        this.name = "LevelBulletDecals";
        this.scene = scene;


        this.rot = new THREE.Euler();
        this.mat4 = new THREE.Matrix4();
        this.position = new THREE.Vector3(0,0,0);
        this.up =  new THREE.Vector3(0,1,0);
        this.scale = new THREE.Vector3(1,1,1);
        this.material = new THREE.MeshStandardMaterial( { 
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: - 4,
            alphaMap,
            normalMap,
            map: colorMap,
            transparent: true,
        } );
    }

    Hit = e => {
        this.mat4.lookAt(this.position, e.hitResult.intersectionNormal, this.up);
        this.rot.setFromRotationMatrix(this.mat4);
        
        const size = Math.random() * 0.3 + 0.2;
        this.scale.set(size, size, 1.0);

        const rigidBody = Ammo.castObject( e.hitResult.collisionObject, Ammo.btRigidBody ); 
        const mesh = rigidBody.mesh;

        const m = new THREE.Mesh( new DecalGeometry( mesh, e.hitResult.intersectionPoint, this.rot, this.scale ), this.material );
        this.scene.add(m);
    }

    Initialize(){
        this.parent.RegisterEventHandler(this.Hit, "hit");
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Level/Navmesh.js

```js
import * as THREE from 'three';
import Component from '../../Component'

import {Pathfinding} from 'three-pathfinding'


export default class Navmesh extends Component{
    constructor(scene, mesh){
        super();
        this.scene = scene;
        this.name = "Navmesh";
        this.zone = "level1";
        this.mesh = mesh;
    }

    Initialize(){
        this.pathfinding = new Pathfinding();

        this.mesh.traverse( ( node ) => {
            if(node.isMesh){ 
                this.pathfinding.setZoneData(this.zone, Pathfinding.createZone(node.geometry));
            }
        });
    }

    GetRandomNode(p, range){
        const groupID = this.pathfinding.getGroup(this.zone, p);
        return this.pathfinding.getRandomNode(this.zone, groupID, p, range);
    }

    FindPath(a, b){
        const groupID = this.pathfinding.getGroup(this.zone, a);
        return this.pathfinding.findPath(a, b, this.zone, groupID);
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Level/LevelSetup.js

```js
import Component from '../../Component'
import * as THREE from 'three'
import {Ammo, createConvexHullShape} from '../../AmmoLib'

export default class LevelSetup extends Component{
    constructor(mesh, scene, physicsWorld){
        super();
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.name = 'LevelSetup';
        this.mesh = mesh;
    }

    LoadScene(){
        
        this.mesh.traverse( ( node ) => {
            if ( node.isMesh || node.isLight ) { node.castShadow = true; }
            if(node.isMesh){ 
                node.receiveShadow = true; 
                //node.material.wireframe = true;
                this.SetStaticCollider(node);
            }

            if(node.isLight){
                node.intensity = 3;
                const shadow = node.shadow;
                const lightCam = shadow.camera;

                shadow.mapSize.width = 1024 * 3;
                shadow.mapSize.height = 1024 * 3;
                shadow.bias = -0.00007;

                const dH = 35, dV = 35;
                lightCam.left = -dH;
                lightCam.right = dH;
                lightCam.top = dV;
                lightCam.bottom = -dV;

                //const cameraHelper = new THREE.CameraHelper(lightCam);
                //this.scene.add(cameraHelper);
            }
        });

        this.scene.add( this.mesh );
    }


    SetStaticCollider(mesh){
        const shape = createConvexHullShape(mesh);
        const mass = 0;
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        const motionState = new Ammo.btDefaultMotionState(transform);

        const localInertia = new Ammo.btVector3(0,0,0);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const object = new Ammo.btRigidBody(rbInfo);
        object.parentEntity = this.parent;
        object.mesh = mesh;
  
        this.physicsWorld.addRigidBody(object);
    }

    Initialize(){
        this.LoadScene();
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/NPC/CharacterController.js

```js
import * as THREE from 'three'
import Component from '../../Component'
import {Ammo, AmmoHelper, CollisionFilterGroups} from '../../AmmoLib'
import CharacterFSM from './CharacterFSM'

import DebugShapes from '../../DebugShapes'


export default class CharacterController extends Component{
    constructor(model, clips, scene, physicsWorld){
        super();
        this.name = 'CharacterController';
        this.physicsWorld = physicsWorld;
        this.scene = scene;
        this.mixer = null;
        this.clips = clips;
        this.animations = {};
        this.model = model;
        this.dir = new THREE.Vector3();
        this.forwardVec = new THREE.Vector3(0,0,1);
        this.pathDebug = new DebugShapes(scene);
        this.path = [];
        this.tempRot = new THREE.Quaternion();

        this.viewAngle = Math.cos(Math.PI / 4.0);
        this.maxViewDistance = 20.0 * 20.0;
        this.tempVec = new THREE.Vector3();
        this.attackDistance = 2.2;

        this.canMove = true;
        this.health = 100;
    }

    SetAnim(name, clip){
        const action = this.mixer.clipAction(clip);
        this.animations[name] = {clip, action};
    }

    SetupAnimations(){
        Object.keys(this.clips).forEach(key=>{this.SetAnim(key, this.clips[key])});
    }

    Initialize(){
        this.stateMachine = new CharacterFSM(this);
        this.navmesh = this.FindEntity('Level').GetComponent('Navmesh');
        this.hitbox = this.GetComponent('AttackTrigger');
        this.player = this.FindEntity("Player");

        this.parent.RegisterEventHandler(this.TakeHit, 'hit');

        const scene = this.model;

        scene.scale.setScalar(0.01);
        scene.position.copy(this.parent.position);
        
        this.mixer = new THREE.AnimationMixer( scene );

        scene.traverse(child => {
            if ( !child.isSkinnedMesh  ) {
                return;
            }

            child.frustumCulled = false;
            child.castShadow = true;
            child.receiveShadow = true;
            this.skinnedmesh = child;
            this.rootBone = child.skeleton.bones.find(bone => bone.name == 'MutantHips');
            this.rootBone.refPos = this.rootBone.position.clone();
            this.lastPos = this.rootBone.position.clone();
        });

        this.SetupAnimations();

        this.scene.add(scene);
        this.stateMachine.SetState('idle');
    }

    UpdateDirection(){
        this.dir.copy(this.forwardVec);
        this.dir.applyQuaternion(this.parent.rotation);
    }

    CanSeeThePlayer(){
        const playerPos = this.player.Position.clone();
        const modelPos = this.model.position.clone();
        modelPos.y += 1.35;
        const charToPlayer = playerPos.sub(modelPos);

        if(playerPos.lengthSq() > this.maxViewDistance){
            return;
        }

        charToPlayer.normalize();
        const angle = charToPlayer.dot(this.dir);

        if(angle < this.viewAngle){
            return false;
        }

        const rayInfo = {};
        const collisionMask = CollisionFilterGroups.AllFilter & ~CollisionFilterGroups.SensorTrigger;
        
        if(AmmoHelper.CastRay(this.physicsWorld, modelPos, this.player.Position, rayInfo, collisionMask)){
            const body = Ammo.castObject( rayInfo.collisionObject, Ammo.btRigidBody );

            if(body == this.player.GetComponent('PlayerPhysics').body){
                return true;
            }
        }

        return false;
    }

    NavigateToRandomPoint(){
        const node = this.navmesh.GetRandomNode(this.model.position, 50);
        this.path = this.navmesh.FindPath(this.model.position, node);
    }

    NavigateToPlayer(){
        this.tempVec.copy(this.player.Position);
        this.tempVec.y = 0.5;
        this.path = this.navmesh.FindPath(this.model.position, this.tempVec);

        /*
        if(this.path){
            this.pathDebug.Clear();
            for(const point of this.path){
                this.pathDebug.AddPoint(point, "blue");
            }
        }
        */
    }

    FacePlayer(t, rate = 3.0){
        this.tempVec.copy(this.player.Position).sub(this.model.position);
        this.tempVec.y = 0.0;
        this.tempVec.normalize();

        this.tempRot.setFromUnitVectors(this.forwardVec, this.tempVec);
        this.model.quaternion.rotateTowards(this.tempRot, rate * t);
    }

    get IsCloseToPlayer(){
        this.tempVec.copy(this.player.Position).sub(this.model.position);

        if(this.tempVec.lengthSq() <= this.attackDistance * this.attackDistance){
            return true;
        }

        return false;
    }

    get IsPlayerInHitbox(){
        return this.hitbox.overlapping;
    }

    HitPlayer(){
        this.player.Broadcast({topic: 'hit'});
    }

    TakeHit = msg => {
        // Apply damage
        console.warn("ENEMY HIT DETECTED!", msg);
        
        this.health = Math.max(0, this.health - msg.amount);
        
        // Debug log with more visibility
        console.error(`*** ENEMY TOOK ${msg.amount} DAMAGE. HEALTH: ${this.health} ***`);

        // Visual feedback for hit - make enemy flash red
        if (this.skinnedmesh) {
            this.skinnedmesh.material.emissive = new THREE.Color(0xff0000);
            setTimeout(() => {
                this.skinnedmesh.material.emissive = new THREE.Color(0x000000);
            }, 100);
        }

        if(this.health <= 0){
            // Enemy died
            console.error("ENEMY DIED!");
            this.stateMachine.SetState('dead');
            // Optional: Add death animation or effects
            this.Broadcast({topic: 'enemy_died'});
        } else {
            // Enemy is still alive
            const stateName = this.stateMachine.currentState.Name;
            if(stateName === 'idle' || stateName === 'patrol'){
                // Switch to chase state when hit
                this.stateMachine.SetState('chase');
            }
            // Add hit reaction animation
            this.Broadcast({topic: 'enemy_hit'});
        }
    }

    MoveAlongPath(t){
        if(!this.path?.length) return;

        // Debug the path
        console.warn("Moving along path", this.path);

        // Get the next point in the path
        const target = this.path[0].clone().sub(this.model.position);
        target.y = 0.0;
        
        // Check if we need to move to the next point (if we're close enough to current target)
        if (target.lengthSq() > 0.1 * 0.1) {
            // Not yet at target point, move towards it
            target.normalize();
            
            // Rotate towards target
            this.tempRot.setFromUnitVectors(this.forwardVec, target);
            this.model.quaternion.slerp(this.tempRot, 4.0 * t);
            
            // Force move the model if root motion isn't working
            // This is a direct position update to ensure movement
            if (this.canMove) {
                const moveSpeed = 2.5; // Adjust speed as needed
                const movement = target.clone().multiplyScalar(moveSpeed * t);
                this.model.position.add(movement);
            }
        } else {
            // Reached current target, move to next point in path
            console.warn("Reached path point, moving to next");
            this.path.shift();

            if(this.path.length === 0){
                console.warn("Reached end of path");
                this.Broadcast({topic: 'nav.end', agent: this});
            }
        }
    }

    ClearPath(){
        if(this.path){
            this.path.length = 0;
        }
    }

    ApplyRootMotion(){
        if(this.canMove && this.stateMachine?.currentState?.Name !== 'chase'){
            const vel = this.rootBone.position.clone();
            vel.sub(this.lastPos).multiplyScalar(0.01);
            vel.y = 0;

            vel.applyQuaternion(this.model.quaternion);

            if(vel.lengthSq() < 0.1 * 0.1){
                this.model.position.add(vel);
            }
        }

        // Reset the root bone horizontal position
        this.lastPos.copy(this.rootBone.position);
        this.rootBone.position.z = this.rootBone.refPos.z;
        this.rootBone.position.x = this.rootBone.refPos.x;
    }

    Update(t){
        this.mixer && this.mixer.update(t);
        this.ApplyRootMotion();

        this.UpdateDirection();
        this.MoveAlongPath(t);
        this.stateMachine.Update(t);

        this.parent.SetRotation(this.model.quaternion);
        this.parent.SetPosition(this.model.position);
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/NPC/CharacterFSM.js

```js
import {FiniteStateMachine, State} from '../../FiniteStateMachine'
import * as THREE from 'three'

export default class CharacterFSM extends FiniteStateMachine{
    constructor(proxy){
        super();
        this.proxy = proxy;
        this.Init();
    }

    Init(){
        this.AddState('idle', new IdleState(this));
        this.AddState('patrol', new PatrolState(this));
        this.AddState('chase', new ChaseState(this));
        this.AddState('attack', new AttackState(this));
        this.AddState('dead', new DeadState(this));
    }
}

class IdleState extends State{
    constructor(parent){
        super(parent);
        this.maxWaitTime = 5.0;
        this.minWaitTime = 1.0;
        this.waitTime = 0.0;
    }

    get Name(){return 'idle'}
    get Animation(){return this.parent.proxy.animations['idle']; }

    Enter(prevState){
        this.parent.proxy.canMove = false;
        const action = this.Animation.action;

        if(prevState){
            action.time = 0.0;
            action.enabled = true;
            action.crossFadeFrom(prevState.Animation.action, 0.5, true);
        }

        action.play();

        this.waitTime = Math.random() * (this.maxWaitTime - this.minWaitTime) + this.minWaitTime;
    }

    Update(t){
        if(this.waitTime <= 0.0){
            this.parent.SetState('patrol');
            return;
        }

        this.waitTime -= t;

        if(this.parent.proxy.CanSeeThePlayer()){
            this.parent.SetState('chase');
        }
    }
}

class PatrolState extends State{
    constructor(parent){
        super(parent);
    }

    get Name(){return 'patrol'}
    get Animation(){return this.parent.proxy.animations['walk']; }

    PatrolEnd = ()=>{
        this.parent.SetState('idle');
    }

    Enter(prevState){
        this.parent.proxy.canMove = true;
        const action = this.Animation.action;

        if(prevState){
            action.time = 0.0;
            action.enabled = true;
            action.crossFadeFrom(prevState.Animation.action, 0.5, true);
        }

        action.play();

        this.parent.proxy.NavigateToRandomPoint();
    }

    Update(t){
        if(this.parent.proxy.CanSeeThePlayer()){
            this.parent.SetState('chase');
        }else if(this.parent.proxy.path && this.parent.proxy.path.length == 0){
            this.parent.SetState('idle');
        }
    }
}

class ChaseState extends State{
    constructor(parent){
        super(parent);
        this.updateFrequency = 0.5;
        this.updateTimer = 0.0;
        this.attackDistance = 2.0;
        this.shouldRotate = false;
        this.switchDelay = 0.2;
    }

    get Name(){return 'chase'}
    get Animation(){return this.parent.proxy.animations['run']; }

    RunToPlayer(prevState){
        this.parent.proxy.canMove = true;
        const action = this.Animation.action;
        this.updateTimer = 0.0;
        
        if(prevState){
            action.time = 0.0;
            action.enabled = true;
            action.setEffectiveTimeScale(1.0);
            action.setEffectiveWeight(1.0);
            action.crossFadeFrom(prevState.Animation.action, 0.2, true);
        }

        action.timeScale = 1.5;
        action.play();
    }

    Enter(prevState){
        this.RunToPlayer(prevState);
    }

    Update(t){
        if(this.updateTimer <= 0.0){
            this.parent.proxy.NavigateToPlayer();
            this.updateTimer = this.updateFrequency;
        }

        if(this.parent.proxy.IsCloseToPlayer){
            if(this.switchDelay <= 0.0){
                this.parent.SetState('attack');
            }

            this.parent.proxy.ClearPath();
            this.switchDelay -= t;
        }else{
            this.switchDelay = 0.1;
        }

        this.updateTimer -= t;
    }
}

class AttackState extends State{
    constructor(parent){
        super(parent);
        this.attackTime = 0.0;
        this.canHit = true;
    }

    get Name(){return 'attack'}
    get Animation(){return this.parent.proxy.animations['attack']; }

    Enter(prevState){
        this.parent.proxy.canMove = false;
        const action = this.Animation.action;
        this.attackTime = this.Animation.clip.duration;
        this.attackEvent = this.attackTime * 0.85;

        if(prevState){
            action.time = 0.0;
            action.enabled = true;
            action.crossFadeFrom(prevState.Animation.action, 0.1, true);
        }

        action.play();
    }

    Update(t){
        this.parent.proxy.FacePlayer(t);

        if(!this.parent.proxy.IsCloseToPlayer && this.attackTime <= 0.0){
            this.parent.SetState('chase');
            return;
        }

        if(this.canHit && this.attackTime <= this.attackEvent && this.parent.proxy.IsPlayerInHitbox){
            this.parent.proxy.HitPlayer();
            this.canHit = false;
        }

        if(this.attackTime <= 0.0){
            this.attackTime = this.Animation.clip.duration;
            this.canHit = true;
        }

        this.attackTime -= t;
    }
}

class DeadState extends State{
    constructor(parent){
        super(parent);
    }

    get Name(){return 'dead'}
    get Animation(){return this.parent.proxy.animations['die']; }

    Enter(prevState){
        const action = this.Animation.action;
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;

        if(prevState){
            action.time = 0.0;
            action.enabled = true;
            action.crossFadeFrom(prevState.Animation.action, 0.1, true);
        }

        action.play();
    }

    Update(t){}
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/NPC/CharacterCollision.js

```js
import * as THREE from 'three'
import Component from '../../Component'
import {Ammo, AmmoHelper, CollisionFilterGroups} from '../../AmmoLib'

export default class CharacterCollision extends Component{
    constructor(physicsWorld){
        super();
        this.world = physicsWorld;
        this.bonePos = new THREE.Vector3();
        this.boneRot = new THREE.Quaternion();
        this.globalRot = new Ammo.btQuaternion();

        // Simplified collision setup - just one main body collision
        this.collisions = {
            'MutantSpine':{
                rotation: {x: 0.0, y: 0.0, z: 0.0},
                position: {x: 0.0, y: 0.25, z: 0.0},
                radius: 0.4,
                height: 1.5
            }
        };
    }

    Initialize(){
        this.controller = this.GetComponent('CharacterController');

        this.controller.model.traverse(child =>{
            if ( !child.isSkinnedMesh  ) {
                return;
            }
            this.mesh = child;
        });

        Object.keys(this.collisions).forEach(key=>{
            const collision = this.collisions[key];

            collision.bone = this.mesh.skeleton.bones.find(bone => bone.name == key);

            const shape = new Ammo.btCapsuleShape(collision.radius, collision.height);
            
            const transform = new Ammo.btTransform();
            transform.setIdentity();
            
            const motionState = new Ammo.btDefaultMotionState(transform);
            const localInertia = new Ammo.btVector3(0, 0, 0);
            shape.calculateLocalInertia(0, localInertia);
            
            const rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, shape, localInertia);
            collision.object = new Ammo.btRigidBody(rbInfo);
            
            // Set as kinematic but ensure it can be hit
            collision.object.setCollisionFlags(collision.object.getCollisionFlags() | 2); // CF_KINEMATIC_OBJECT
            collision.object.setActivationState(4); // DISABLE_DEACTIVATION
            collision.object.parentEntity = this.parent;

            const localRot = new Ammo.btQuaternion();
            localRot.setEulerZYX(collision.rotation.z, collision.rotation.y, collision.rotation.x);
            collision.localTransform = new Ammo.btTransform();
            collision.localTransform.setIdentity();
            collision.localTransform.setRotation(localRot);
            collision.localTransform.getOrigin().setValue(collision.position.x, collision.position.y, collision.position.z);

            // Add to world with proper collision filtering
            this.world.addRigidBody(
                collision.object,
                CollisionFilterGroups.CharacterFilter,
                CollisionFilterGroups.AllFilter & ~CollisionFilterGroups.SensorTrigger
            );
        });
    }

    Update(t){
        Object.keys(this.collisions).forEach(key=>{
            const collision = this.collisions[key];
            
            const transform = collision.object.getWorldTransform();

            collision.bone.getWorldPosition(this.bonePos);
            collision.bone.getWorldQuaternion(this.boneRot);

            this.globalRot.setValue(this.boneRot.x, this.boneRot.y, this.boneRot.z, this.boneRot.w);
            transform.getOrigin().setValue(this.bonePos.x, this.bonePos.y, this.bonePos.z);
            transform.setRotation(this.globalRot);

            transform.op_mul(collision.localTransform);
            
            // Activate the body to ensure collision detection works
            collision.object.activate(true);
        });
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/NPC/AttackTrigger.js

```js
import Component from '../../Component'
import {Ammo, AmmoHelper, CollisionFilterGroups} from '../../AmmoLib'

export default class AttackTrigger extends Component{
    constructor(physicsWorld){
        super();
        this.name = 'AttackTrigger';
        this.physicsWorld = physicsWorld;

        //Relative to parent
        this.localTransform = new Ammo.btTransform();
        this.localTransform.setIdentity();
        this.localTransform.getOrigin().setValue(0.0, 1.0, 1.5); // Extend reach slightly

        this.quat = new Ammo.btQuaternion();

        this.overlapping = false;
    }

    SetupTrigger(){
        // Increase size of attack trigger to make detection more reliable
        const shape = new Ammo.btSphereShape(0.8); 
        this.ghostObj = AmmoHelper.CreateTrigger(shape);

        // Add to physics world with proper collision filtering
        this.physicsWorld.addCollisionObject(this.ghostObj, CollisionFilterGroups.SensorTrigger);
        
        // Store reference to parent entity for event handling
        this.ghostObj.parentEntity = this.parent;
    }

    Initialize(){
        this.playerPhysics = this.FindEntity('Player').GetComponent('PlayerPhysics');
        this.SetupTrigger();
    }

    PhysicsUpdate(world, t){
        // Check if we're overlapping with player
        this.overlapping = AmmoHelper.IsTriggerOverlapping(this.ghostObj, this.playerPhysics.body);
        
        // Debug logging
        if (this.overlapping) {
            console.warn("Player in attack range!");
        }
    }
    
    Update(t){
        const entityPos = this.parent.position;
        const entityRot = this.parent.rotation;
        const transform = this.ghostObj.getWorldTransform();

        this.quat.setValue(entityRot.x, entityRot.y, entityRot.z, entityRot.w);
        transform.setRotation(this.quat);
        transform.getOrigin().setValue(entityPos.x, entityPos.y, entityPos.z);
        transform.op_mul(this.localTransform);
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/NPC/DirectionDebug.js

```js
import * as THREE from 'three'
import Component from '../../Component'


export default class DirectionDebug extends Component{
    constructor(scene){
        super();
        this.name = 'DirectionDebug';
        this.scene = scene;
 
        this.dir = new THREE.Vector3();
        this.forwardVec = new THREE.Vector3(0,0,1);
    }
    
    Initialize(){
        this.arrowHelper = new THREE.ArrowHelper();
        this.scene.add( this.arrowHelper );
    }

    Update(t){
        this.dir.copy(this.forwardVec);
        this.dir.applyQuaternion(this.parent.rotation);
        this.arrowHelper.position.copy(this.parent.position);
        this.arrowHelper.position.y += 1;
        this.arrowHelper.setDirection(this.dir);
        this.arrowHelper.setLength(1);
        this.arrowHelper.setColor(0xffff00);
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Player/PlayerPhysics.js

```js
import Component from '../../Component'
import {Ammo} from '../../AmmoLib'

//Bullet enums
const CF_KINEMATIC_OBJECT = 2;
const DISABLE_DEACTIVATION = 4;

export default class PlayerPhysics extends Component{
    constructor(world){
        super();
        this.world = world;
        this.body = null;
        this.name = "PlayerPhysics";
        this.canJump = false;
        this.up = new Ammo.btVector3(0,1,0);
        this.tempVec = new Ammo.btVector3();
    }

    Initialize(){
        const height = 1.3,
              radius = 0.3,
              mass = 5;

        const transform = new Ammo.btTransform();
        transform.setIdentity();
        const pos = this.parent.Position;
        transform.setOrigin(new Ammo.btVector3(pos.x,pos.y,pos.z));
        const motionState = new Ammo.btDefaultMotionState(transform);

        const shape = new Ammo.btCapsuleShape(radius, height);
        const localInertia = new Ammo.btVector3(0,0,0);
        const bodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        this.body = new Ammo.btRigidBody(bodyInfo);
        this.body.setFriction(0);
        
        //this.body.setCollisionFlags(this.body.getCollisionFlags() | CF_KINEMATIC_OBJECT);
        this.body.setActivationState(DISABLE_DEACTIVATION);

        this.world.addRigidBody(this.body);
    }

    QueryJump(){
        const dispatcher = this.world.getDispatcher();
        const numManifolds = dispatcher.getNumManifolds();

        for ( let i = 0; i < numManifolds; i++ ) {
            const contactManifold = dispatcher.getManifoldByIndexInternal( i );
            const rb0 = Ammo.castObject( contactManifold.getBody0(), Ammo.btRigidBody );
            const rb1 = Ammo.castObject( contactManifold.getBody1(), Ammo.btRigidBody );

            if(rb0 != this.body && rb1 != this.body){
                continue;
            }

            const numContacts = contactManifold.getNumContacts();

            for ( let j = 0; j < numContacts; j++ ) {
                const contactPoint = contactManifold.getContactPoint( j );

                const normal = contactPoint.get_m_normalWorldOnB();
                this.tempVec.setValue(normal.x(),normal.y(),normal.z());

                if(rb1 == this.body){
                    this.tempVec.setValue(-this.tempVec.x(),-this.tempVec.y(),-this.tempVec.z());
                }

                const angle = this.tempVec.dot(this.up);
                this.canJump = angle > 0.5;

                if(this.canJump){
                    return;
                }
            }
        }
    }

    PhysicsUpdate(){
        this.QueryJump();
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Player/PlayerHealth.js

```js
import Component from "../../Component";

export default class PlayerHealth extends Component{
    constructor(){
        super();

        this.health = 100;
    }

    TakeHit = e =>{
        this.health = Math.max(0, this.health - 10);
        this.uimanager.SetHealth(this.health);
    }

    Initialize(){
        this.uimanager = this.FindEntity("UIManager").GetComponent("UIManager");
        this.parent.RegisterEventHandler(this.TakeHit, "hit");
        this.uimanager.SetHealth(this.health);
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Player/Weapon.js

```js
import * as THREE from 'three'
import Component from '../../Component'
import Input from '../../Input'
import {Ammo, AmmoHelper, CollisionFilterGroups} from '../../AmmoLib'

import WeaponFSM from './WeaponFSM';


export default class Weapon extends Component{
    constructor(camera, model, flash, world, shotSoundBuffer, listner){
        super();
        this.name = 'Weapon';
        this.camera = camera;
        this.world = world;
        this.model = model;
        this.flash = flash;
        this.animations = {};
        this.shoot = false;
        this.fireRate = 0.1;
        this.shootTimer = 0.0;

        this.shotSoundBuffer = shotSoundBuffer;
        this.audioListner = listner;

        this.magAmmo = 30;
        this.ammoPerMag = 30;
        this.ammo = 100;
        this.damage = 25;
        this.uimanager = null;
        this.reloading = false;
        this.hitResult = {intersectionPoint: new THREE.Vector3(), intersectionNormal: new THREE.Vector3()};

    }

    SetAnim(name, clip){
        const action = this.mixer.clipAction(clip);
        this.animations[name] = {clip, action};
    }

    SetAnimations(){
        this.mixer = new THREE.AnimationMixer( this.model );
        this.SetAnim('idle', this.model.animations[1]);
        this.SetAnim('reload', this.model.animations[2]);
        this.SetAnim('shoot', this.model.animations[0]);
    }

    SetMuzzleFlash(){
        this.flash.position.set(-0.3, -0.5, 8.3);
        this.flash.rotateY(Math.PI);
        this.model.add(this.flash);
        this.flash.life = 0.0;

        this.flash.children[0].material.blending = THREE.AdditiveBlending;
    }

    SetSoundEffect(){
        this.shotSound = new THREE.Audio(this.audioListner);
        this.shotSound.setBuffer(this.shotSoundBuffer);
        this.shotSound.setLoop(false);
    }

    AmmoPickup = (e) => {
        this.ammo += 30;
        this.uimanager.SetAmmo(this.magAmmo, this.ammo);
    }

    Initialize(){
        const scene = this.model;
        scene.scale.set(0.05, 0.05, 0.05);
        scene.position.set(0.04, -0.02, 0.0);
        scene.setRotationFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(5), THREE.MathUtils.degToRad(185), 0));

        scene.traverse(child=>{
            if(!child.isSkinnedMesh){
                return;
            }

            child.receiveShadow = true;
        });

        this.camera.add(scene);

        this.SetAnimations();
        this.SetMuzzleFlash();
        this.SetSoundEffect();

        this.stateMachine = new WeaponFSM(this);
        this.stateMachine.SetState('idle');

        this.uimanager = this.FindEntity("UIManager").GetComponent("UIManager");
        this.uimanager.SetAmmo(this.magAmmo, this.ammo);

        this.SetupInput();

        //Listen to ammo pickup event
        this.parent.RegisterEventHandler(this.AmmoPickup, "AmmoPickup");
    }

    SetupInput(){
        Input.AddMouseDownListner( e => {
            if(e.button != 0 || this.reloading){
                return;
            }

            this.shoot = true;
            this.shootTimer = 0.0;
        });

        Input.AddMouseUpListner( e => {
            if(e.button != 0){
                return;
            }

            this.shoot = false;
        });

        Input.AddKeyDownListner(e => {
            if(e.repeat) return;

            if(e.code == "KeyR"){
                this.Reload();
            }
        });
    }

    Reload(){
        if(this.reloading || this.magAmmo == this.ammoPerMag || this.ammo == 0){
            return;
        }

        this.reloading = true;
        this.stateMachine.SetState('reload');
    }

    ReloadDone(){
        this.reloading = false;
        const bulletsNeeded = this.ammoPerMag - this.magAmmo;
        this.magAmmo = Math.min(this.ammo + this.magAmmo, this.ammoPerMag);
        this.ammo = Math.max(0, this.ammo - bulletsNeeded);
        this.uimanager.SetAmmo(this.magAmmo, this.ammo);
    }

    Raycast(){
        // Get ray from camera center
        const start = new THREE.Vector3(0.0, 0.0, -1.0);
        start.unproject(this.camera);
        const end = new THREE.Vector3(0.0, 0.0, 1.0);
        end.unproject(this.camera);
        
        // Debug line to show the ray
        console.warn("Firing weapon ray from", start, "to", end);

        // Make sure we include enemy collision objects
        const collisionMask = CollisionFilterGroups.AllFilter;
        
        // Cast the ray and check for hits
        if(AmmoHelper.CastRay(this.world, start, end, this.hitResult, collisionMask)){
            console.warn("Hit detected!", this.hitResult);
            
            try {
                // Try to get the hit object - use both ghost and rigid body casting
                const ghostBody = Ammo.castObject(this.hitResult.collisionObject, Ammo.btPairCachingGhostObject);
                const rigidBody = Ammo.castObject(this.hitResult.collisionObject, Ammo.btRigidBody);
                
                // Get the parent entity from either ghost or rigid body
                let entity = null;
                if (ghostBody && ghostBody.parentEntity) {
                    entity = ghostBody.parentEntity;
                } else if (rigidBody && rigidBody.parentEntity) {
                    entity = rigidBody.parentEntity;
                }
                
                console.warn("Entity found:", entity);
                
                if (entity) {
                    // Apply damage with higher value
                    entity.Broadcast({
                        'topic': 'hit',
                        from: this.parent,
                        amount: this.damage * 5, // Increase damage for testing
                        hitResult: this.hitResult
                    });
                    
                    // Add visual feedback
                    this.Broadcast({topic: 'hit_feedback'});
                }
            } catch (e) {
                console.error("Error in raycast processing:", e);
            }
        } else {
            console.warn("No hit detected");
        }
    }

    Shoot(t){
        if(!this.shoot){
            return;
        }

        if(!this.magAmmo){
            //Reload automatically
            this.Reload();
            return;
        }

        if(this.shootTimer <= 0.0 ){
            //Shoot
            this.flash.life = this.fireRate;
            this.flash.rotateZ(Math.PI * Math.random());
            const scale = Math.random() * (1.5 - 0.8) + 0.8;
            this.flash.scale.set(scale, 1, 1);
            this.shootTimer = this.fireRate;
            this.magAmmo = Math.max(0, this.magAmmo - 1);
            this.uimanager.SetAmmo(this.magAmmo, this.ammo);

            this.Raycast();
            this.Broadcast({topic: 'ak47_shot'});
            
            this.shotSound.isPlaying && this.shotSound.stop();
            this.shotSound.play();
        }

        this.shootTimer = Math.max(0.0, this.shootTimer - t);
    }

    AnimateMuzzle(t){
        const mat = this.flash.children[0].material;
        const ratio = this.flash.life / this.fireRate;
        mat.opacity = ratio;
        this.flash.life = Math.max(0.0, this.flash.life - t);
    }

    Update(t){
        this.mixer.update(t);
        this.stateMachine.Update(t);
        this.Shoot(t);
        this.AnimateMuzzle(t);
    }

}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Player/PlayerControls.js

```js
import * as THREE from 'three'
import Component from '../../Component'
import Input from '../../Input'
import {Ammo} from '../../AmmoLib'

import DebugShapes from '../../DebugShapes'


export default class PlayerControls extends Component{
    constructor(camera){
        super();
        this.name = 'PlayerControls';
        this.camera = camera;

        this.timeZeroToMax = 0.08;

        this.maxSpeed = 7.0;
        this.speed = new THREE.Vector3();
        this.acceleration = this.maxSpeed / this.timeZeroToMax;
        this.decceleration = -7.0;

        this.mouseSpeed = 0.002;
        this.physicsComponent = null;
        this.isLocked = false;

        this.angles = new THREE.Euler();
        this.pitch = new THREE.Quaternion();
        this.yaw = new THREE.Quaternion();

        this.jumpVelocity = 5;
        this.yOffset = 0.5;
        this.tempVec = new THREE.Vector3();
        this.moveDir = new THREE.Vector3();
        this.xAxis = new THREE.Vector3(1.0, 0.0, 0.0);
        this.yAxis = new THREE.Vector3(0.0, 1.0, 0.0);
    }

    Initialize(){
        this.physicsComponent = this.GetComponent("PlayerPhysics");
        this.physicsBody = this.physicsComponent.body;
        this.transform = new Ammo.btTransform();
        this.zeroVec = new Ammo.btVector3(0.0, 0.0, 0.0);
        this.angles.setFromQuaternion(this.parent.Rotation);
        this.UpdateRotation();

        Input.AddMouseMoveListner(this.OnMouseMove);

        document.addEventListener('pointerlockchange', this.OnPointerlockChange)

        Input.AddClickListner( () => {
            if(!this.isLocked){
                document.body.requestPointerLock();
            }
        });
    }

    OnPointerlockChange = () => {
        if (document.pointerLockElement) {
            this.isLocked = true;
            return;
        }

        this.isLocked = false;
    }

    OnMouseMove = (event) => {
        if (!this.isLocked) {
          return;
        }
    
        const { movementX, movementY } = event
    
        this.angles.y -= movementX * this.mouseSpeed;
        this.angles.x -= movementY * this.mouseSpeed;

        this.angles.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.angles.x));

        this.UpdateRotation();
    }

    UpdateRotation(){
        this.pitch.setFromAxisAngle(this.xAxis, this.angles.x);
        this.yaw.setFromAxisAngle(this.yAxis, this.angles.y);

        this.parent.Rotation.multiplyQuaternions(this.yaw, this.pitch).normalize();

        this.camera.quaternion.copy(this.parent.Rotation);
    }

    Accelarate = (direction, t) => {
        const accel = this.tempVec.copy(direction).multiplyScalar(this.acceleration * t);
        this.speed.add(accel);
        this.speed.clampLength(0.0, this.maxSpeed);
    }

    Deccelerate = (t) => {
        const frameDeccel = this.tempVec.copy(this.speed).multiplyScalar(this.decceleration * t);
        this.speed.add(frameDeccel);
    }

    Update(t){
        const forwardFactor = Input.GetKeyDown("KeyS") - Input.GetKeyDown("KeyW");
        const rightFactor = Input.GetKeyDown("KeyD") - Input.GetKeyDown("KeyA");
        const direction = this.moveDir.set(rightFactor, 0.0, forwardFactor).normalize();

        const velocity = this.physicsBody.getLinearVelocity();

        if(Input.GetKeyDown('Space') && this.physicsComponent.canJump){
            velocity.setY(this.jumpVelocity);
            this.physicsComponent.canJump = false;
        }
        
        this.Deccelerate(t);
        this.Accelarate(direction, t);

        const moveVector = this.tempVec.copy(this.speed);
        moveVector.applyQuaternion(this.yaw);
        
        velocity.setX(moveVector.x);
        velocity.setZ(moveVector.z);

        this.physicsBody.setLinearVelocity(velocity);
        this.physicsBody.setAngularVelocity(this.zeroVec);

        const ms = this.physicsBody.getMotionState();
        if(ms){
            ms.getWorldTransform(this.transform);
            const p = this.transform.getOrigin();
            this.camera.position.set(p.x(), p.y() + this.yOffset, p.z());
            this.parent.SetPosition(this.camera.position);
        }
        
    }
}
```

## File: /Users/saint/Desktop/game-dev/three-fps/src/entities/Player/WeaponFSM.js

```js
import {FiniteStateMachine, State} from '../../FiniteStateMachine'
import * as THREE from 'three'

export default class WeaponFSM extends FiniteStateMachine{
    constructor(proxy){
        super();
        this.proxy = proxy;
        this.Init();
    }

    Init(){
        this.AddState('idle', new IdleState(this));
        this.AddState('shoot', new ShootState(this));
        this.AddState('reload', new ReloadState(this));
    }
}

class IdleState extends State{
    constructor(parent){
        super(parent);
    }

    get Name(){return 'idle'}
    get Animation(){return this.parent.proxy.animations['idle']; }

    Enter(prevState){
        const action = this.Animation.action;

        if(prevState){
            action.time = 0.0;
            action.enabled = true;
            action.setEffectiveTimeScale(1.0);
            action.crossFadeFrom(prevState.Animation.action, 0.1, true);
        }

        action.play();
    }

    Update(t){
        if(this.parent.proxy.shoot && this.parent.proxy.magAmmo > 0){
            this.parent.SetState('shoot');
        }
    }
}

class ShootState extends State{
    constructor(parent){
        super(parent);
    }

    get Name(){return 'shoot'}
    get Animation(){return this.parent.proxy.animations['shoot']; }

    Enter(prevState){
        const action = this.Animation.action;

        if(prevState){
            action.time = 0.0;
            action.enabled = true;
            action.setEffectiveTimeScale(1.0);
            action.crossFadeFrom(prevState.Animation.action, 0.1, true);
        }

        action.timeScale = 3.0;
        action.play();
    }

    Update(t){
        if(!this.parent.proxy.shoot || this.parent.proxy.magAmmo == 0){
            this.parent.SetState('idle');
        }
    }
}

class ReloadState extends State{
    constructor(parent){
        super(parent);

        this.parent.proxy.mixer.addEventListener( 'finished', this.AnimationFinished);
    }

    get Name(){ return 'reload'; }
    get Animation(){ return this.parent.proxy.animations['reload']; }

    AnimationFinished = e => {
        if(e.action != this.Animation.action){
            return;
        }

        this.parent.proxy.ReloadDone();
        this.parent.SetState('idle');
    }

    Enter(prevState){
        const action = this.Animation.action;
        action.loop = THREE.LoopOnce;

        if(prevState){
            action.time = 0.0;
            action.enabled = true;
            action.setEffectiveTimeScale(1.0);
            action.crossFadeFrom(prevState.Animation.action, 0.1, true);
        }

        action.play();
    }
}
```



---

> 📸 Generated with [Jockey CLI](https://github.com/saint0x/jockey-cli)
