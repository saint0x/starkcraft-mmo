// Fur shader for realistic fur without image textures
class FurShader {
  constructor(options = {}) {
    this.uniforms = {
      color: { value: options.color || new THREE.Color(0.8, 0.6, 0.2) },
      time: { value: options.time || 0 },
      sunPosition: { value: options.sunPosition || new THREE.Vector3(0, 1, 0) },
      windDirection: { value: options.windDirection || new THREE.Vector2(1, 0) },
      windStrength: { value: options.windStrength || 0.2 },
      furDepth: { value: options.furDepth || 0.3 }
    };

    // Define shader code
    const vertexShader = `
      uniform float time;
      uniform vec2 windDirection;
      uniform float windStrength;
      uniform float furDepth;
      
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      
      // Simple noise function
      float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0) * 0.5 + 0.5;
      }
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        // Calculate world position
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        // Calculate fur offset direction (along normal)
        vec3 furDirection = normal * furDepth;
        
        // Apply wind effect
        float windEffect = noise(position.xz * 0.1 + time * 0.1);
        
        // Apply swaying motion
        vec3 windOffset = vec3(
          windDirection.x * windEffect * windStrength,
          0.0,
          windDirection.y * windEffect * windStrength
        );
        
        // Apply fur offset and wind
        vec3 displacedPosition = position + furDirection + windOffset;
        
        // Transform position
        vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
        vViewPosition = -mvPosition.xyz;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 color;
      uniform float time;
      uniform vec3 sunPosition;
      
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      
      // Noise functions for fur texture
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        // Four corners of tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        
        // Smooth interpolation
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        // Mix the four corners
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      // FBM (Fractional Brownian Motion) for more natural textures
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        // Add multiple octaves of noise
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(st * frequency);
          st = st * 2.0 + time * 0.01;
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value;
      }
      
      void main() {
        // Normalize view and normal directions
        vec3 viewDir = normalize(vViewPosition);
        vec3 normal = normalize(vNormal);
        
        // Calculate light direction from sun
        vec3 lightDir = normalize(sunPosition);
        
        // Base fur color
        vec3 furColor = color;
        
        // Create fur strand pattern
        float strandPattern = fbm(vUv * 20.0);
        
        // Create fur with roots darker than tips
        float furDepth = fbm(vUv * 10.0 + time * 0.05);
        vec3 tipColor = furColor * 1.2;
        vec3 rootColor = furColor * 0.7;
        
        // Mix root and tip colors
        furColor = mix(rootColor, tipColor, furDepth);
        
        // Add some variation to the fur color
        float colorNoise = fbm(vUv * 5.0) * 0.2;
        furColor *= (1.0 + colorNoise);
        
        // Calculate fur strands - we'll discard some fragments to create the strand effect
        float strand = strandPattern * 0.5 + 0.5;
        
        // Discard pixels to create fur pattern
        if (strand < 0.3) {
          discard;
        }
        
        // Calculate basic lighting
        float diffuse = max(dot(normal, lightDir), 0.0);
        float ambient = 0.3;
        
        // Apply lighting to fur
        vec3 finalColor = furColor * (ambient + diffuse * 0.7);
        
        // Add slight rim lighting for fur effect
        float rimLight = 1.0 - max(dot(viewDir, normal), 0.0);
        rimLight = pow(rimLight, 3.0) * 0.3;
        
        finalColor += furColor * rimLight;
        
        // Output final color
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create the shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });
  }

  updateTime(time) {
    this.uniforms.time.value = time;
  }
  
  updateSunPosition(position) {
    this.uniforms.sunPosition.value = position;
  }
  
  updateWindDirection(direction) {
    this.uniforms.windDirection.value = direction;
  }
  
  updateWindStrength(strength) {
    this.uniforms.windStrength.value = strength;
  }

  // Apply fur material to object
  static applyToObject(object, color) {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = FurShader.getFurMaterial(color);
      }
    });
  }

  // Update time uniform for animation
  static updateTime(object, time, sunPosition) {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && 
          child.material instanceof THREE.ShaderMaterial) {
        child.material.uniforms.time.value = time;
        child.material.uniforms.sunPosition.value = sunPosition;
        
        // Update wind direction to create natural movement
        const windX = Math.sin(time * 0.3) * 0.5;
        const windZ = Math.cos(time * 0.5) * 0.5;
        child.material.uniforms.windDirection.value.set(windX, 0, windZ);
        
        // Adjust wind strength based on time
        child.material.uniforms.windStrength.value = 0.01 + Math.sin(time) * 0.01;
      }
    });
  }
} 