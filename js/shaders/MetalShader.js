// Metal shader for realistic metal materials without image textures
class MetalShader {
  constructor(options = {}) {
    this.uniforms = {
      color: { value: options.color || new THREE.Color(0.5, 0.5, 0.5) },
      roughness: { value: options.roughness || 0.5 },
      metalness: { value: options.metalness || 0.9 },
      time: { value: options.time || 0 },
      sunPosition: { value: options.sunPosition || new THREE.Vector3(0, 1, 0) }
    };

    // Define shader code
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        vec4 viewPosition = viewMatrix * worldPosition;
        vViewPosition = -viewPosition.xyz;
        
        gl_Position = projectionMatrix * viewPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 color;
      uniform float roughness;
      uniform float metalness;
      uniform float time;
      uniform vec3 sunPosition;
      
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      
      // Constants
      const float PI = 3.14159265359;
      
      // Noise functions adapted from classic Perlin noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      // Fractional Brownian Motion (fBm) noise
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 5; ++i) {
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value;
      }
      
      // Fresnel approximation
      float fresnel(float cosTheta, float F0) {
        return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
      }
      
      void main() {
        // Normalized view and normal directions
        vec3 viewDir = normalize(vViewPosition);
        vec3 normal = normalize(vNormal);
        
        // Calculate light direction from sun
        vec3 lightDir = normalize(sunPosition);
        
        // Add some normal variation with noise
        float normalNoise = fbm(vUv * 20.0 + time * 0.1) * 0.05;
        normal = normalize(normal + vec3(normalNoise));
        
        // Create detailed metal surface with noise patterns
        float grainNoise = fbm(vUv * 50.0) * 0.1;
        float largeNoise = fbm(vUv * 5.0) * 0.2;
        float combinedNoise = grainNoise + largeNoise;
        
        // Calculate specular reflection
        vec3 halfVector = normalize(lightDir + viewDir);
        float NdotH = max(0.0, dot(normal, halfVector));
        float NdotL = max(0.0, dot(normal, lightDir));
        float NdotV = max(0.0, dot(normal, viewDir));
        
        // Adjust roughness with noise for more realistic appearance
        float adjustedRoughness = roughness * (1.0 + combinedNoise * 0.5);
        adjustedRoughness = clamp(adjustedRoughness, 0.05, 0.95);
        
        // Specular power based on roughness (smoother surfaces have sharper highlights)
        float specPower = 2.0 / (adjustedRoughness * adjustedRoughness) - 2.0;
        
        // Basic Blinn-Phong specular
        float specular = pow(NdotH, specPower) * NdotL;
        
        // Fresnel effect (metals have high base reflectivity)
        float F0 = mix(0.04, 0.9, metalness); // Base reflectivity
        float fresnelFactor = fresnel(NdotV, F0);
        
        // Create metal color variation based on noise
        vec3 baseColor = color * (1.0 + combinedNoise * 0.3);
        
        // Ambient light + diffuse + specular
        float ambient = 0.2;
        float diffuse = NdotL * 0.6;
        
        // Combine lighting components
        vec3 finalColor = baseColor * (ambient + diffuse) + specular * fresnelFactor * baseColor;
        
        // Add slight color variation based on viewing angle (spectral shift)
        float specShift = pow(1.0 - NdotV, 3.0) * 0.1;
        finalColor.r += specShift;
        finalColor.b -= specShift;
        
        // Apply some very subtle scratches
        float scratchNoise = fbm(vUv * 100.0 + vec2(time * 0.01, 0.0)) * fbm(vUv * 120.0 - vec2(0.0, time * 0.008));
        float scratches = smoothstep(0.45, 0.55, scratchNoise) * 0.1;
        
        // Add scratches to final color
        finalColor = mix(finalColor, vec3(1.0), scratches * NdotL);
        
        // Simple tone mapping to avoid over-bright areas
        finalColor = finalColor / (finalColor + vec3(1.0));
        
        // Gamma correction
        finalColor = pow(finalColor, vec3(1.0/2.2));
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create the shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide
    });
  }

  updateTime(time) {
    this.uniforms.time.value = time;
  }
  
  updateSunPosition(position) {
    this.uniforms.sunPosition.value = position;
  }

  // Apply metal material to object
  static applyToObject(object, color) {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new MetalShader({ color: color }).material;
      }
    });
  }
} 