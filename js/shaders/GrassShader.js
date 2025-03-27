// Grass shader for realistic ground without image textures
class GrassShader {
  constructor(options = {}) {
    this.uniforms = {
      time: { value: options.time || 0 },
      sunPosition: { value: options.sunPosition || new THREE.Vector3(0, 1, 0) }
    };

    // Define shader code
    const vertexShader = `
      uniform float time;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      // Simple noise function
      float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0) * 0.5 + 0.5;
      }
      
      void main() {
        vUv = uv;
        vNormal = normal;
        vPosition = position;
        
        // Calculate wind effect
        float windStrength = 0.3;
        float windSpeed = time * 2.0;
        
        // Don't affect points at ground level (y=0)
        float height = position.y;
        
        // Apply wind sway effect (only to the top part of grass)
        vec3 pos = position;
        float swayFactor = pow(height, 2.0) * 0.1;
        
        // Create varied wind effect with noise
        float noiseValue = noise(pos.xz * 0.1 + windSpeed * 0.5);
        
        pos.x += sin(windSpeed + pos.z * 0.5) * swayFactor * windStrength * noiseValue;
        pos.z += cos(windSpeed + pos.x * 0.5) * swayFactor * windStrength * noiseValue;
        
        // Project vertex
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec3 sunPosition;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      // Simplex noise function for more natural looking grass
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        
        // Smooth interpolation
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        // Mix 4 corners
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        
        // Loop of octaves
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        
        return value;
      }
      
      void main() {
        // Create grass color variations
        vec3 baseGreen = vec3(0.18, 0.38, 0.18); // Darker grass color
        vec3 lightGreen = vec3(0.56, 0.78, 0.29); // Lighter grass color
        
        // Make grass color vary based on height
        float heightFactor = clamp(vPosition.y / 4.0, 0.0, 1.0);
        
        // Create random variations with noise
        float noiseFactor = fbm(vUv * 10.0 + time * 0.05);
        
        // Mix darker and lighter grass colors
        vec3 grassColor = mix(baseGreen, lightGreen, heightFactor * 0.5 + noiseFactor * 0.5);
        
        // Add some subtle yellow tint at the tips
        vec3 tipColor = vec3(0.85, 0.9, 0.35);
        float tipAmount = pow(heightFactor, 4.0) * 0.5;
        grassColor = mix(grassColor, tipColor, tipAmount);
        
        // Calculate lighting
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(sunPosition);
        float diffuse = max(dot(normal, lightDir), 0.0);
        
        // Add ambient light
        float ambient = 0.3;
        float lightIntensity = ambient + diffuse * 0.7;
        
        // Apply lighting to grass color
        vec3 finalColor = grassColor * lightIntensity;
        
        // Output final color
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create the shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      wireframe: false
    });
  }

  updateTime(time) {
    this.uniforms.time.value = time;
  }

  updateSunPosition(position) {
    this.uniforms.sunPosition.value = position;
  }
} 