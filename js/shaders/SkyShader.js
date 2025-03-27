// Sky shader for realistic sky without image textures
class SkyShader {
  constructor(options = {}) {
    // Initialize uniforms with defaults
    this.uniforms = {
      // Atmospheric parameters
      luminance: { value: options.luminance || 1.0 },
      turbidity: { value: options.turbidity || 10.0 },
      rayleigh: { value: options.rayleigh || 2.0 },
      mieCoefficient: { value: options.mieCoefficient || 0.005 },
      mieDirectionalG: { value: options.mieDirectionalG || 0.8 },
      
      // Sun position and parameters
      sunPosition: { value: options.sunPosition || new THREE.Vector3(0, 1, 0) },
      sunIntensity: { value: options.sunIntensity || 1.0 },
      
      // Time for animation
      time: { value: options.time || 0.0 },
      
      // Moon parameters
      moonPosition: { value: options.moonPosition || new THREE.Vector3(0, -1, 0) },
      moonIntensity: { value: options.moonIntensity || 0.25 }
    };
    
    // Constants for atmospheric scattering
    const constants = {
      // Rayleigh scattering coefficients (why sky is blue)
      rayleighZenithLength: 8.4e3,
      mieZenithLength: 1.25e3,
      
      // primaries (adjusted for better looking sky)
      up: new THREE.Vector3(0, 1, 0),
      sunAngularDiameterCos: Math.cos(0.025),
      
      // Colors (adjustable to change sky appearance)
      skyColorTop: new THREE.Vector3(0.0, 0.1, 0.5),
      skyColorBottom: new THREE.Vector3(0.3, 0.6, 0.8),
      
      // Light extinction and out-scattering coefficients for atmosphere
      K: new THREE.Vector3(0.686, 0.678, 0.666)
    };

    // Vertex shader - handles atmospheric scattering calculations
    const vertexShader = `
      uniform vec3 sunPosition;
      uniform float rayleigh;
      uniform float turbidity;
      uniform float mieCoefficient;
      
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;
      
      // Constants
      const float PI = 3.141592653589793238462643383279502884197169;
      const float rayleighZenithLength = 8.4e3;
      const float mieZenithLength = 1.25e3;
      const vec3 up = vec3(0.0, 1.0, 0.0);
      
      // Color constants
      const vec3 K = vec3(0.686, 0.678, 0.666);
      
      // Atmosphere functions for scattering
      float rayleighPhase(float cosTheta) {
        return (3.0 / (16.0 * PI)) * (1.0 + pow(cosTheta, 2.0));
      }
      
      float hgPhase(float cosTheta, float g) {
        float g2 = pow(g, 2.0);
        return (1.0 / (4.0 * PI)) * ((1.0 - g2) / pow(1.0 - 2.0 * g * cosTheta + g2, 1.5));
      }
      
      void main() {
        // Calculate world position and sun vectors
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        // Calculate sun direction and angle
        vSunDirection = normalize(sunPosition);
        vSunE = sunPosition.y;
        vSunfade = 1.0 - clamp(1.0 - exp((sunPosition.y / 450000.0)), 0.0, 1.0);
        
        // Calculate normalized angle for sky gradients
        float zenithAngle = acos(max(0.0, dot(up, normalize(worldPosition.xyz))));
        
        // Calculate atmospheric scattering
        float rayleighCoefficient = rayleigh - (1.0 * (1.0 - vSunfade));
        
        // Extinction (out-scattering)
        vBetaR = K * rayleighCoefficient;
        vBetaM = K * mieCoefficient;
        
        // Optical depth (how much atmosphere light must pass through)
        float zenithAngleCos = cos(zenithAngle);
        float rayleighDepth = rayleighZenithLength / zenithAngleCos;
        float mieDepth = mieZenithLength / zenithAngleCos;
        
        // Calculate vertex position
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader - handles sky color rendering and sun/moon
    const fragmentShader = `
      uniform float luminance;
      uniform float mieDirectionalG;
      uniform vec3 sunPosition;
      uniform float time;
      uniform vec3 moonPosition;
      uniform float moonIntensity;
      
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;
      
      // Constants
      const float PI = 3.141592653589793238462643383279502884197169;
      const float sunAngularDiameterCos = 0.9999;
      
      // Simple noise function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        // Four corners
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        
        // Smooth interpolation
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        // Mix corners
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      // FBM (Fractional Brownian Motion)
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        
        // 5 octaves of noise
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        
        return value;
      }
      
      // Cloud generation
      float cloudNoise(vec2 uv, float time) {
        // Moving clouds
        vec2 movement = vec2(time * 0.01, time * 0.005);
        float clouds = fbm(uv + movement);
        
        // Make clouds more defined
        clouds = smoothstep(0.3, 0.7, clouds);
        
        return clouds;
      }
      
      void main() {
        // Normalized world position for calculations
        vec3 direction = normalize(vWorldPosition);
        
        // Angle between viewing direction and sun
        float sunAngle = dot(direction, vSunDirection);
        
        // Scattering phase functions
        float rayleighPhase = (3.0 / (16.0 * PI)) * (1.0 + pow(sunAngle, 2.0));
        float miePhase = (1.0 / (4.0 * PI)) * ((1.0 - pow(mieDirectionalG, 2.0)) / pow(1.0 - 2.0 * mieDirectionalG * sunAngle + pow(mieDirectionalG, 2.0), 1.5));
        
        // Normalized sky color contribution
        vec3 betaRTheta = vBetaR * rayleighPhase;
        vec3 betaMTheta = vBetaM * miePhase;
        
        // Mix colors based on atmosphere
        float zenith = direction.y;
        float horizon = 1.0 - abs(zenith);
        
        // Base sky color - blends from deep blue at top to lighter blue at horizon
        vec3 skyColor = mix(
          vec3(0.0, 0.1, 0.5), // Top color
          vec3(0.3, 0.6, 0.8), // Horizon color
          pow(1.0 - max(zenith, 0.0), 3.0)
        );
        
        // Blend with sunset/sunrise colors when sun is near horizon
        float sunsetFactor = smoothstep(-0.1, 0.2, vSunDirection.y);
        vec3 sunsetColor = vec3(1.0, 0.6, 0.2);
        skyColor = mix(sunsetColor, skyColor, sunsetFactor);
        
        // Make night sky darker and more blueish
        float nightFactor = smoothstep(0.0, 0.3, -vSunDirection.y);
        vec3 nightColor = vec3(0.03, 0.05, 0.1);
        skyColor = mix(skyColor, nightColor, nightFactor);
        
        // Apply atmospheric scattering
        vec3 atmosphereColor = vec3(1.0) - exp(-(betaRTheta + betaMTheta));
        skyColor = skyColor * atmosphereColor;
        
        // Add clouds
        if (direction.y > 0.0) {
          // Project direction onto unit sphere for UV coordinates
          vec2 cloudUV = direction.xz / (direction.y + 0.1);
          
          // Generate cloud pattern
          float clouds = cloudNoise(cloudUV * 4.0, time);
          
          // Make clouds less visible at night
          clouds *= (1.0 - nightFactor * 0.7);
          
          // Mix clouds with sky color
          skyColor = mix(skyColor, vec3(1.0), clouds * 0.2 * vSunfade);
        }
        
        // Draw sun
        float sunIntensity = 0.0;
        if (sunAngle > sunAngularDiameterCos) {
          // Calculate sun disc and rays
          float sunDisk = smoothstep(sunAngularDiameterCos, sunAngularDiameterCos + 0.0001, sunAngle);
          
          // Sun rays through clouds/atmosphere
          float raySunFactor = 1.0 - clamp(pow(1.0 - vSunE, 3.0), 0.0, 1.0);
          float rayEffect = pow(max(0.0, sunAngle), 256.0) * raySunFactor;
          
          // Add sun to sky
          sunIntensity = rayEffect + sunDisk;
        }
        
        // Apply sun to sky color
        skyColor += vec3(1.0, 0.8, 0.6) * sunIntensity * 5.0 * vSunfade;
        
        // Draw moon at night
        if (nightFactor > 0.1) {
          float moonAngle = dot(direction, normalize(moonPosition));
          
          if (moonAngle > 0.9999) {
            // Moon disc
            float moonDisk = smoothstep(0.9999, 1.0, moonAngle);
            
            // Moon glow
            float moonGlow = pow(max(0.0, moonAngle), 32.0);
            
            // Add moon to sky
            vec3 moonColor = vec3(0.9, 0.9, 1.0) * (moonDisk + moonGlow * 0.2);
            
            // Apply moon brightness based on night factor
            skyColor += moonColor * moonIntensity * nightFactor;
          }
        }
        
        // Add stars at night
        if (nightFactor > 0.2) {
          // Create star pattern using noise
          vec2 starUV = direction.xz / (direction.y + 0.01);
          float stars = pow(random(floor(starUV * 1000.0)), 20.0);
          
          // Make stars twinkle
          stars *= 0.8 + 0.2 * sin(time * 2.0 + random(floor(starUV * 100.0)) * 20.0);
          
          // Only show stars looking up and at night
          stars *= smoothstep(-0.1, 0.5, direction.y);
          stars *= nightFactor;
          
          // Add stars to sky
          skyColor += vec3(0.8, 0.9, 1.0) * stars * 0.5;
        }
        
        // Apply luminance adjustment
        skyColor *= luminance;
        
        // Tonemapping
        skyColor = pow(skyColor, vec3(1.0 / 2.2)); // Simple gamma correction
        
        // Final color
        gl_FragColor = vec4(skyColor, 1.0);
      }
    `;

    // Create the shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide
    });
  }
  
  updateTime(time) {
    this.uniforms.time.value = time;
  }
  
  updateSunPosition(position) {
    this.uniforms.sunPosition.value = position;
    
    // Update moon position to be opposite the sun
    this.uniforms.moonPosition.value.set(-position.x, -position.y, -position.z);
    
    // Adjust intensities based on sun height
    const dayFactor = Math.max(0, position.y / 800);
    this.uniforms.sunIntensity.value = dayFactor;
    this.uniforms.moonIntensity.value = 0.25 * (1 - dayFactor);
  }
} 