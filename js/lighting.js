/**
 * Sets up high-quality professional lighting for the scene
 * Uses a combination of directional, ambient, and point lights for realistic rendering
 */
function setupLighting(scene) {
  // Create lights
  const lights = {};
  
  // Main directional light (sun)
  const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  sunLight.position.set(50, 100, 10);
  sunLight.castShadow = true;
  
  // Configure shadow properties
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 500;
  
  // Expand shadow camera frustum to cover more area
  const shadowSize = 100;
  sunLight.shadow.camera.left = -shadowSize;
  sunLight.shadow.camera.right = shadowSize;
  sunLight.shadow.camera.top = shadowSize;
  sunLight.shadow.camera.bottom = -shadowSize;
  
  // Add sun
  scene.add(sunLight);
  lights.sun = sunLight;
  
  // Add target for sun
  const sunTarget = new THREE.Object3D();
  sunTarget.position.set(0, 0, 0);
  scene.add(sunTarget);
  sunLight.target = sunTarget;
  scene.add(sunLight.target);
  lights.sunTarget = sunTarget;
  
  // Ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0x444466, 0.5);
  scene.add(ambientLight);
  lights.ambient = ambientLight;
  
  // Hemisphere light for sky/ground color
  const hemiLight = new THREE.HemisphereLight(0x6688FF, 0x884422, 0.5);
  scene.add(hemiLight);
  lights.hemi = hemiLight;
  
  // Rim light to highlight character edges
  const rimLight = new THREE.DirectionalLight(0x8888FF, 0.5);
  rimLight.position.set(-10, 5, -10);
  scene.add(rimLight);
  lights.rim = rimLight;
  
  // Fill light for softer shadows
  const fillLight = new THREE.DirectionalLight(0xFFCC88, 0.2);
  fillLight.position.set(-50, 20, 50);
  scene.add(fillLight);
  lights.fill = fillLight;
  
  // Add light probe for more realistic global illumination
  const lightProbe = new THREE.LightProbe();
  scene.add(lightProbe);
  lights.probe = lightProbe;
  
  return lights;
}

/**
 * Updates lighting to match the dynamic sky
 * Called during animation loop
 */
function updateLighting(lights, sunPosition, dayNightCycle) {
  // Day-night color temperatures
  const dayColor = new THREE.Color(1, 0.98, 0.92);    // Warm sunlight
  const sunsetColor = new THREE.Color(1, 0.7, 0.5);   // Orange sunset
  const nightColor = new THREE.Color(0.2, 0.3, 0.6);  // Blue moonlight
  
  // Position sun
  lights.sun.position.copy(sunPosition);
  
  // Calculate sun color based on height
  const sunHeight = sunPosition.y;
  
  // Determine light intensity based on sun height
  const sunIntensity = Math.max(0, Math.min(1, (sunHeight / 400) + 0.5));
  
  // Determine color based on time of day
  let sunColor = new THREE.Color();
  
  if (sunHeight > 200) {
    // Day
    sunColor.copy(dayColor);
  } else if (sunHeight > 0) {
    // Sunset/sunrise
    const t = sunHeight / 200; // 0-1 transition
    sunColor.copy(sunsetColor).lerp(dayColor, t);
  } else {
    // Night
    const t = Math.max(0, 1 + sunHeight / 200); // 0-1 transition
    sunColor.copy(nightColor).lerp(sunsetColor, t);
  }
  
  // Update directional light (sun)
  lights.sun.color.copy(sunColor);
  lights.sun.intensity = sunIntensity * 1.5;
  
  // Update hemisphere light
  lights.hemi.intensity = sunIntensity * 0.5;
  
  // Day-night sky color transitions
  const skyColor = new THREE.Color();
  const groundColor = new THREE.Color(0.5, 0.5, 0.5);
  
  if (sunHeight > 0) {
    // Day/sunset sky
    const t = Math.min(1, sunHeight / 400);
    skyColor.set(0.3, 0.6, 1.0).lerp(new THREE.Color(1.0, 0.6, 0.4), 1 - t);
  } else {
    // Night sky
    skyColor.set(0.05, 0.05, 0.2);
  }
  
  lights.hemi.skyColor.copy(skyColor);
  lights.hemi.groundColor.copy(groundColor);
  
  // Update ambient light
  const ambientIntensity = 0.2 + sunIntensity * 0.3;
  const ambientColor = new THREE.Color();
  ambientColor.copy(sunColor).multiplyScalar(0.5);
  
  lights.ambient.color.copy(ambientColor);
  lights.ambient.intensity = ambientIntensity;
  
  // Update rim light
  const rimColor = new THREE.Color();
  rimColor.copy(skyColor);
  lights.rim.color.copy(rimColor);
  lights.rim.intensity = sunIntensity * 0.5;
  
  // Position rim light opposite to sun
  lights.rim.position.set(-sunPosition.x * 0.2, 5, -sunPosition.z * 0.2);
  
  // Update fill light
  lights.fill.intensity = sunIntensity * 0.2;
  lights.fill.color.copy(sunColor);
  
  // Update light probe
  const probeIntensity = 0.2 + sunIntensity * 0.8;
  lights.probe.intensity = probeIntensity;
} 