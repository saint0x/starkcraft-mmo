export const PATHS = {
  CHARACTER: {
    MODEL: '../assets/character/fox-main.fbx',
    ANIMATIONS: '../assets/animations/sword-and-shield-pack/',
    ANIMATIONS_LIST: {
      IDLE: 'idle-2.fbx',
      WALK: 'walk.fbx',
      RUN: 'run.fbx',
      ATTACK: 'attack.fbx',
      BLOCK: 'block.fbx',
      DEATH: 'death.fbx',
      SLASH: 'slash.fbx',
      BLOCK_IDLE: 'block-idle.fbx',
      POWER_UP: 'power-up.fbx',
      JUMP: 'jump.fbx'
    }
  },
  WEAPONS: '../assets/weapons/'
};

export const CAMERA = {
  FOV: 75,
  NEAR: 0.1,
  FAR: 2000,
  INITIAL_POSITION: [0, 4, 8],
  MIN_DISTANCE: 2,
  MAX_DISTANCE: 20,
  DAMPING_FACTOR: 0.1
};

export const CHARACTER = {
  SCALE: 4,
  MOVE_SPEED: 5,
  ROTATION_SPEED: 5,
  INITIAL_HEALTH: 100
};

export const CONTROLS = {
  MOVEMENT: {
    FORWARD: 'w',
    BACKWARD: 's',
    LEFT: 'a',
    RIGHT: 'd',
    RUN: 'shift'
  },
  ACTIONS: {
    ATTACK: 'capslock',
    BLOCK: 'f',
    SPECIAL: 'e'
  }
};