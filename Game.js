const mode = localStorage.getItem("gameMode");
let audioUnlocked = false;
let pendingJumpscare = null;
const timerBox = document.querySelector("#timerBox");
const scoreBox = document.querySelector("#scoreBox");

function setSurvivalHUDVisible(isVisible) {
  if (timerBox) timerBox.classList.toggle("hidden", !isVisible);
  if (scoreBox) scoreBox.classList.toggle("hidden", !isVisible);
}

setSurvivalHUDVisible(mode === "survival");
const BUNNY_FBX_SRC = "Assets/bunny.fbx";
const KEY_FBX_SRC = "Assets/key.fbx";

let bunnyShownThisRun = false;
// -------------------- 3D (Three.js FBX) --------------------

// 3D overlay bindings (separate from hotspot overlay)
const overlay3DPanel = document.querySelector("#overlay3DPanel");
const overlay3DItems = document.querySelector("#overlay3DItems");

// 3D overlay bindings (separate from hotspot overlay)
let room3d = {
  renderer: null,
  scene: null,
  camera: null,
  loader: null,
  modelCache: new Map(),
  activeRoomModel: null,
  animId: null
};

let overlay3d = {
  renderer: null,
  scene: null,
  camera: null,
  loader: null,
  model: null,
  animId: null,
  active: false
};
const THREE = window.THREE;
const FBXLoader = window.FBXLoader;

if (!THREE || !FBXLoader) {
  console.error("THREE/FBXLoader not ready. Check HTML script loading order.");
}


function initRoom3DOnce() {
  const canvas = document.querySelector("#room3d");
  if (!canvas || room3d.renderer) return;

  room3d.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  room3d.renderer.setPixelRatio(window.devicePixelRatio || 1);

  room3d.scene = new THREE.Scene();
  room3d.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
  room3d.camera.position.set(0, 0, 10);

  room3d.loader = new window.FBXLoader();

  // lighting
  const amb = new THREE.AmbientLight(0xffffff, 0.9);
  room3d.scene.add(amb);

  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(2, 4, 6);
  room3d.scene.add(dir);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    room3d.camera.aspect = rect.width / rect.height;
    room3d.camera.updateProjectionMatrix();
    room3d.renderer.setSize(rect.width, rect.height, false);
  }

  window.addEventListener("resize", resize);
  resize();
}

function loadFBXCached(src, cb) {
  if (!room3d.loader) return;
  if (room3d.modelCache.has(src)) {
    cb(room3d.modelCache.get(src).clone(true));
    return;
  }
  room3d.loader.load(
    src,
    (obj) => {
      room3d.modelCache.set(src, obj);
      cb(obj.clone(true));
    },
    undefined,
    (err) => console.error("FBX load failed:", src, err)
  );
}

function clearRoom3DModel() {
  if (room3d.activeRoomModel) {
    room3d.scene.remove(room3d.activeRoomModel);
    room3d.activeRoomModel = null;
  }
}

function renderRoomBunnyIfNeeded() {
  initRoom3DOnce();
  clearRoom3DModel();

  // Only show bunny in startingBedroom, only the first visit per run
  if (currentRoomID !== "startingBedroom") return;
  if (bunnyShownThisRun) return;

  loadFBXCached(BUNNY_FBX_SRC, (model) => {

    const texLoader = new THREE.TextureLoader();

    const bunBase = texLoader.load("Assets/bun_low_standardSurface1_BaseMap.1001.png");
    bunBase.colorSpace = THREE.SRGBColorSpace;

    const bunNormal = texLoader.load("Assets/bun_low_standardSurface1_Normal.1001.png");
    const bunMask = texLoader.load("Assets/bun_low_standardSurface1_MaskMap.1001.png");

    const bunMat = new THREE.MeshStandardMaterial({
      map: bunBase,
      normalMap: bunNormal,
      roughnessMap: bunMask,
      metalnessMap: bunMask,
      metalness: 1,
      roughness: 1
    });

    model.traverse((child) => {
      if (child.isMesh) {
        child.material = bunMat;
      }
    });

    model.scale.set(0.15, 0.15, 0.15);
    model.position.set(0.3, -1.6, 0);
    model.rotation.set(0, 0, 0);

    room3d.activeRoomModel = model;
    room3d.scene.add(model);

    bunnyShownThisRun = true;
  });

  // animate (simple idle spin, optional)
  if (!room3d.animId) {
    const tick = () => {
      room3d.animId = requestAnimationFrame(tick);
      if (room3d.renderer && room3d.scene && room3d.camera) {
        room3d.renderer.render(room3d.scene, room3d.camera);
      }
    };
    tick();
  }
}

// Overlay 3D (Key)
function initOverlay3DOnce() {
  const canvas = document.querySelector("#overlay3d");
  if (!canvas || overlay3d.renderer) return;

  overlay3d.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  overlay3d.renderer.setPixelRatio(window.devicePixelRatio || 1);

  overlay3d.scene = new THREE.Scene();
  overlay3d.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);


  overlay3d.camera.position.set(0, 0, 14);

  overlay3d.loader = new window.FBXLoader();

  overlay3d.scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(2, 4, 6);
  overlay3d.scene.add(dir);

  overlay3d.resize = function () {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    overlay3d.camera.aspect = rect.width / rect.height;
    overlay3d.camera.updateProjectionMatrix();
    overlay3d.renderer.setSize(rect.width, rect.height, false);
  };

  window.addEventListener("resize", overlay3d.resize);
  overlay3d.resize();

  if (!overlay3d._clickBound) {
    overlay3d._clickBound = true;
    canvas.addEventListener("click", (e) => {
      if (!overlay3d.active) return;
      e.stopPropagation();

      collectItem({
        id: "key",
        img: "Assets/keyreplacement.png"
      });

      hideOverlayKey3D();
      renderOverlayItems(overlay3d.lastHotspot);
    });
  }
}


function showOverlayKey3D(hotspot) {
  initOverlay3DOnce();

  if (overlay3DPanel) overlay3DPanel.classList.remove("hidden");
  overlay3d.resize?.();

  const canvas = document.querySelector("#overlay3d");
  if (!canvas) return;

  overlay3d.lastHotspot = hotspot;
  overlay3d.active = true;

  canvas.style.pointerEvents = "auto";

  // Clear old model
  if (overlay3d.model) {
    overlay3d.scene.remove(overlay3d.model);
    overlay3d.model = null;
  }

  overlay3d.loader.load(
    KEY_FBX_SRC,
    (obj) => {
      //textures
      const texLoader = new THREE.TextureLoader();

      const baseColor = texLoader.load("Assets/key_low_openPBR_shader1_BaseColor.1001.png");
      baseColor.colorSpace = THREE.SRGBColorSpace;

      const normalMap = texLoader.load("Assets/key_low_openPBR_shader1_Normal.1001.png");
      normalMap.colorSpace = THREE.NoColorSpace;

      const roughnessMap = texLoader.load("Assets/key_low_openPBR_shader1_Roughness.1001.png");
      roughnessMap.colorSpace = THREE.NoColorSpace;

      const metalnessMap = texLoader.load("Assets/key_low_openPBR_shader1_Metalness.1001.png");
      metalnessMap.colorSpace = THREE.NoColorSpace;

      const heightMap = texLoader.load("Assets/key_low_openPBR_shader1_Height.1001.png");
      heightMap.colorSpace = THREE.NoColorSpace;

      const keyMat = new THREE.MeshStandardMaterial({
        map: baseColor,
        normalMap,
        roughnessMap,
        metalnessMap,
        metalness: 1,
        roughness: 1
      });

      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = keyMat;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      console.log("KEY LOADED", obj);

      // -------- CENTER MODEL --------
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      obj.position.sub(center);


      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const targetSize = 3.0;
      const scale = targetSize / maxDim;
      obj.scale.setScalar(scale);

      obj.rotation.set(0, 0, 0);


      const depth = -8;
      obj.position.z = depth;


      const fovRad = THREE.MathUtils.degToRad(overlay3d.camera.fov);
      const distance = overlay3d.camera.position.z - obj.position.z;
      const halfHeight = Math.tan(fovRad / 2) * distance;
      const halfWidth = halfHeight * overlay3d.camera.aspect;


      obj.position.x = halfWidth * 0.2;   // increase to 0.95 if needed
      obj.position.y = 1.85;

      overlay3d.model = obj;
      overlay3d.scene.add(obj);
    },
    undefined,
    (err) => console.error("FBX load failed:", KEY_FBX_SRC, err)
  );

  if (!overlay3d.animId) {
    const tick = () => {
      overlay3d.animId = requestAnimationFrame(tick);

      if (overlay3d.active && overlay3d.model) {
        overlay3d.model.rotation.y += 0.01;
      }

      if (overlay3d.renderer && overlay3d.scene && overlay3d.camera) {
        overlay3d.renderer.render(overlay3d.scene, overlay3d.camera);
      }
    };
    tick();
  }
}


function hideOverlayKey3D() {
  if (overlay3DPanel) overlay3DPanel.classList.add("hidden");
  overlay3d.active = false;

  if (overlay3d.model) {
    overlay3d.scene.remove(overlay3d.model);
    overlay3d.model = null;
  }

  if (overlay3d.axes) {
    overlay3d.scene.remove(overlay3d.axes);
    overlay3d.axes = null;
  }
}

if (overlay3DPanel) {
  overlay3DPanel.addEventListener("click", (e) => {
    // Only close when clicking the dark background panel
    if (e.target.id === "overlay3DPanel") {
      hideOverlayKey3D();
    }
  });
}

// -----------------------------------------------------------

//Pause system
let isPaused = false;

function showPauseOverlay() {
  const p = document.querySelector("#pauseOverlay");
  if (p) p.classList.remove("hidden");
}

function hidePauseOverlay() {
  const p = document.querySelector("#pauseOverlay");
  if (p) p.classList.add("hidden");
}

function pauseGame() {
  if (isPaused) return;
  isPaused = true;
  pauseSurvivalTimer();
  stopBossFightLoop();
  closeOverlay();
  showPauseOverlay();
}

function resumeGame() {
  if (!isPaused) return;
  isPaused = false;
  resumeSurvivalTimer();
  hidePauseOverlay();

  // resume boss damage only if currently in a boss room
  const room = Rooms[currentRoomID];
  if (room?.boss) startBossFightLoop();
}

function togglePause() {
  if (isPaused) resumeGame();
  else pauseGame();
}

function resetStoryRun() {
  bunnyShownThisRun = false;

  dialogueLocked = false;
  stopBossFightLoop();
  stopWhispers();
  closeOverlay();
  hideOverlayKey3D?.();

  playerHP = playerMaxHP;
  updatePlayerHPUI();

  save.inventory = [];
  save.collected = {};
  save.equippedSlot = null;

  save.bosses = {};
  save.jumpscaresPlayed = {};

  save.story = {
    currentPhase: PHASES.BEDROOM,
    completedPhases: {},
    dialoguesPlayed: {},
    lastRoomID: null,
    keyFound: false
  };

  setupStoryWorld();

  currentRoomID = "startingBedroom";

  saveGame();
  renderInventory();
  bindArrowControlsOnce(); 

  playEyeOpeningAnimation(() => {
    startPhase(PHASES.BEDROOM);
    renderRoom();
  });
}


function startNewStoryRun() {
  bunnyShownThisRun = false;
  isPaused = false;
  hidePauseOverlay?.();
  closeOverlay();

  playerHP = playerMaxHP;
  updatePlayerHPUI();

  save.inventory = [];
  save.collected = {};
  save.equippedSlot = null;

  save.bosses = {};
  save.jumpscaresPlayed = {};

  save.story = {
    currentPhase: PHASES.BEDROOM,
    completedPhases: {},
    dialoguesPlayed: {},
    lastRoomID: null,
    keyFound: false
  };

  restoreStoryBosses?.();

  currentRoomID = "startingBedroom";

  saveGame();
  renderInventory();
}

//survival
function wipeSurvivalProgress() {
 
  stopBossFightLoop();
  stopWhispers();
  stopSurvivalTimer?.();
  closeOverlay();
  hideOverlayKey3D?.();


  stopMainBGM?.();
  stopEndingBGM?.();


  localStorage.removeItem("save_survival");


  save.inventory = [];
  save.collected = {};
  save.equippedSlot = null;

  save.bosses = {};
  save.jumpscaresPlayed = {};

  save.survival = {
    keyFound: false,
    weaponUnlocked: false,
    bossPlacements: {},
    bossesDefeated: {}
  };


  playerHP = playerMaxHP;
  updatePlayerHPUI();


}

const Rooms = {

  startingBedroom: {
    bg: "Assets/ProjectEvangelineBedroomPOV.png",
     exits: {
      left: {}
    },
    hotspots: [{
    id: "SdrawerR1",
    overlay: "drawer",
      left: 84,
      top: 62,
      width: 13,
      height: 10,
      rotate: 22
    },
    {
      id: "SdrawerL1",
      overlay: "drawer",
      left: 22,
      top: 43,
      width: 4.5,
      height: 5,
      rotate: 165
    },
    { 
      id: "SdrawerL2",
      overlay: "drawer",
      left: 22,
      top: 50,
      width: 5,
      height: 4,
      rotate: 160
    },
    {   
      id: "SdrawerL3",
      overlay: "drawer",
      left: 22,
      top: 56,
      width: 5,
      height: 4.5,
      rotate: 155
    },
    {   
      id: "SdrawerR2",
      overlay: "drawer",
      left: 76,
      top: 62.5,
      width: 6,
      height: 3,
      rotate: 27
    },
    {
      id: "SdrawerR3",
      overlay: "drawer",
      left: 77,
      top: 39.5,
      width: 5,
      height: 3,
      rotate: 12
    },
    {   
      id: "SdrawerR4",
      overlay: "drawer",
      left: 89,
      top: 44,
      width: 5,
      height: 3,
      rotate: 11
    }]

  },

  livingRoom: {
    bg: "Assets/ProjectEvangelineLivingRoom.png",
    exits: {
      back: {},
      left: {},
      right: {}
    },
    hotspots:[{
      id: "LcabinetL1",
      overlay: "cabinet",
      left: 15.5,
      top: 58,
      width: 5,
      height: 9,
      rotate: -14
    },
    {   
      id:"LcabinetL2",
      overlay: "cabinet",
      left: 21,
      top: 55,
      width: 4,
      height: 9,
      rotate: -14 
    }]
  },

  diningArea: {
    bg: "Assets/ProjectEvangelineDiningArea.png",
    exits: {
      left: {},
      right: {}
    },
    hotspots: [{
      id: "Dcabinet1",
      overlay: "cabinet",
      left: 43.75,
      top: 11,
      width: 9,
      height: 7.5
    },
    {   
      id: "Dcabinet2",
      overlay: "cabinet",
      left: 35.5,
      top: 11,
      width: 7,
      height: 12
    },
    {   
      id: "Dcabinet3",
      overlay: "cabinet",
      left: 54,
      top: 11,
      width: 7,
      height: 12
    },
    {   
      id: "Ddrawer1",
      overlay: "drawer",
      left: 48.5,
      top: 35.5,
      width: 5,
      height: 3
    },
    {   
      id: "Ddrawer2",
      overlay: "drawer",
      left: 60.5,
      top: 35.5,
      width: 5,
      height: 3
    },
    {   
      id: "Ddrawer3",
      overlay: "drawer",
      left: 37.5,
      top: 35.5,
      width: 5.5,
      height: 3
    },
    {   
      id: "Ddrawer4",
      overlay: "drawer",
      left: 29.5,
      top: 36,
      width: 3.5,
      height: 2.5,
      rotate: -7
    }]
  },

  kitchen: {
    bg: "Assets/ProjectEvangelineKitchen.png",
    exits: {
      back: {},
      right: {}
    },
    hotspots: [{
      id: "Kcabinet1",
      overlay: "cabinet",
      left: 10,
      top: 10,
      width: 9,
      height: 18,
      rotate: 1
    },
    {   
      id: "Kcabinet2",
      overlay: "cabinet",
      left: 31.5,
      top: 12,
      width: 5,
      height: 18,
      rotate: 1.5
    },
    {   
      id: "Kcabinet3",
      overlay: "cabinet",
      left: 45,
      top: 14,
      width: 8,
      height: 15,
      rotate: -1
    },
    {   
      id: "Kcabinet4",
      overlay: "cabinet",
      left: 49,
      top: 48,
      width: 10,
      height: 20,
      rotate: 4
    },
    {   
      id: "Kcabinet5",
      overlay: "cabinet",
      left: 13,
      top: 52,
      width: 10,
      height: 10,
      rotate: -5
    },
    {   
      id: "Kdrawer1",
      overlay: "drawer",
      left: 13,
      top: 46,
      width: 10,
      height: 4,
      rotate: -4
    },
    {   
      id: "Kdrawer2",
      overlay: "drawer",
      left: 37,
      top: 44.5,
      width: 3.5,
      height: 3,
      rotate: 4
    }]
  },

  toilet: {
    bg: "Assets/ProjectEvangelineToilet.png",
    exits: {
      left: {}
    },
    hotspots: [{
      id: "Tcabinet1",
      overlay: "cabinet",
      left: 53.5,
      top: 55.5,
      width: 10,
      height: 21,
      rotate: 14,
    },
    {
      id: "Tdrawer1",
      overlay: "drawer",
      left: 65.5,
      top: 60,
      width: 7,
      height: 5,
      rotate: 14
    }]
  },

  exitHallway: {
    bg: "Assets/ProjectEvangelineExit.png",
    exits: {
      left: {},
      right: {}
    },
  },

  parentsBedroom: {
    bg: "Assets/ProjectEvangelineParentsBedroom.png",
    exits: {
      back: {}
    },
    hotspots: [{
      id: "Pdrawer1",
      overlay: "drawer",
      left: 19.5,
      top: 49.5,
      width: 4,
      height: 3,
      rotate: -4,
    },
    {   
      id: "Pdrawer2",
      overlay: "drawer",
      left: 19.5,
      top: 54,
      width: 4,
      height: 3,
      rotate: -4
    },
    {   
      id: "Pdrawer3",
      overlay: "drawer",
      left: 19.5,
      top: 58,
      width: 4,
      height: 3,
      rotate: -4
    },
    {   
      id: "Pdrawer4",
      overlay: "drawer",
      left: 57,
      top: 46,
      width: 4,
      height: 2.5,
      rotate: -4.5
    }]
  },

  EXIT: {
    bg: "Assets/ProjectEvangelineLogin.png",
    exits: {}
  }

};

//win
Rooms.endingRoom = {
  bg: "Assets/ProjectEvangelineLogin.png",
  exits: {},
  hotspots: []
};


//items

const ITEM_EFFECTS = {
  bandages: {
    type: "heal",
    heal: 30
  },
  medkit: {
    type: "heal",
    heal: 100
  },
  injection: {
    type: "heal",
    heal: 50
  },
  gun: {
    type: "weapon",
    damage: 10
  },
  knife: {
    type: "weapon",
    damage: 8
  },
  scissors: {
    type: "weapon",
    damage: 5
  },
  needle: {
    type: "weapon",
    damage: 3
  },
  key: {
    type: "key"
  }
};

const STORY_ITEMS = new Set([
  "needle",
  "knife",
  "bandages",
  "medkit",
  "key"
]);

function findHotspot(roomID, hotspotID) {
  const room = Rooms[roomID];
  if (!room?.hotspots) return null;
  return room.hotspots.find(h => h.id === hotspotID) || null;
}

function applyStoryContent() {
  // bosses
  Rooms.kitchen.boss = {
    id: "boss1",
    name: "FEMALE BOSS",
    maxHP: 500,
    img: "Assets/Boss1.png",
    jumpscareImg: "Assets/Boss1jumpscare.png",
    attackDamage: 3
  };

  Rooms.toilet.boss = {
    id: "boss2",
    name: "MALE BOSS",
    maxHP: 500,
    img: "Assets/Boss2.png",
    jumpscareImg: "Assets/Boss2jumpscare.png",
    attackDamage: 5
  };

  Rooms.exitHallway.boss = {
    id: "boss3",
    name: "FINAL BOSS",
    maxHP: 1000,
    img: "Assets/Boss3.png",
    jumpscareImg: "Assets/Boss3jumpscare.png",
    attackDamage: 6
  };

  // items in hotspots (story)
  const dining1 = findHotspot("diningArea", "Dcabinet1");
  if (dining1) {
    dining1.items = [{
      id: "needle",
      img: "Assets/ProjectEvangelineNeedle.png",
      left: 35,
      top: 68,
      width: 15
    }];
  }

  const kdrawer1 = findHotspot("kitchen", "Kdrawer1");
  if (kdrawer1) {
    kdrawer1.items = [{
      id: "knife",
      img: "Assets/ProjectEvangelineKnife.png",
      left: 53,
      top: 20,
      width: 20
    },{
      id: "bandages",
      img: "Assets/ProjectEvangelineBandages.png",
      left: 22,
      top: 50,
      width: 20
    }];
  }

  const tcab1 = findHotspot("toilet", "Tcabinet1");
  if (tcab1) {
    tcab1.items = [{
      id: "bandages",
      img: "Assets/ProjectEvangelineBandages.png",
      left: 51,
      top: 63,
      width: 20
    },{
      id: "medkit",
      img: "Assets/ProjectEvangelineMedkit.png",
      left: 30,
      top: 60,
      width: 20
    }];
  }

  const pdrawer1 = findHotspot("parentsBedroom", "Pdrawer1");
  if (pdrawer1) {
    pdrawer1.items = [{
      id: "key",
      img: "Assets/keyreplacement.png",
      left: 53,
      top: 20,
      width: 15
    }];
  }
}

function clearDynamicRoomContent() {
  // remove bosses
  for (const room of Object.values(Rooms)) {
    if (room?.boss) delete room.boss;
  }

  // remove hotspot items
  for (const room of Object.values(Rooms)) {
    room.hotspots?.forEach(h => {
      if (h.items) delete h.items;
    });
  }
}


const PHASES = {
  BEDROOM: 1,
  LIVING_ROOM: 2,
  DINING_NEEDLE: 3,
  BOSS_1: 4,
  BOSS_2: 5,
  BOSS_3: 6,
  FREE_ROAM: 7,
  ENDING: 8
};

const PHASE_START_ROOMS = {
  [PHASES.BEDROOM]: "startingBedroom",
  [PHASES.LIVING_ROOM]: "livingRoom",
  [PHASES.DINING_NEEDLE]: "diningArea",
  [PHASES.BOSS_1]: "kitchen",
  [PHASES.BOSS_2]: "toilet",
  [PHASES.FREE_ROAM]: "livingRoom"
};


//save
const SAVE_KEY = (mode === "survival") ? "save_survival" : "save_story";

let save = (() => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (e) {
    return null;
  }
})() || {
  inventory: [],
  collected: {},
  equippedSlot: null
};

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

save.story = save.story || {
  currentPhase: PHASES.BEDROOM,
  completedPhases: {},
  dialoguesPlayed: {},
  lastRoomID: null
};

save.survival = save.survival || {
  keyFound: false,
  keySpawned: false,
  weaponUnlocked: false,
  bossPlacements: {},
  bossesDefeated: {}
};


save.story.keyFound = save.story.keyFound || false;

//story phases

let phaseItemsCollected = [];

function startPhase(phaseNumber) {
  save.story.currentPhase = phaseNumber;
  phaseItemsCollected = [];

  saveGame();
}

function resetCurrentPhase() {
  const phase = save.story.currentPhase;

    phaseItemsCollected.forEach(itemId => {
    delete save.collected[itemId];
    });


  save.inventory = save.inventory.filter(
    item => !phaseItemsCollected.includes(item.id)
  );

  phaseItemsCollected = [];

  const room = Rooms[currentRoomID];
  if (room?.boss) {
    currentBossHP = room.boss.maxHP;
  }

  saveGame();
  renderInventory();
  renderRoom();
}

function handlePhaseProgression(prevRoomID) {
  const phase = save.story.currentPhase;

  // Phase 1 → Phase 2: bedroom → living room
  if (
    phase === PHASES.BEDROOM &&
    prevRoomID === "startingBedroom" &&
    currentRoomID === "livingRoom"
  ) {
    startPhase(PHASES.LIVING_ROOM);
    return;
  }

  // Phase 2 → Phase 3: living room → dining area
  if (
    phase === PHASES.LIVING_ROOM &&
    prevRoomID === "livingRoom" &&
    currentRoomID === "diningArea"
  ) {
    startPhase(PHASES.DINING_NEEDLE);
    return;
  }

  // Phase 3 → Phase 4: dining → LEFT AFTER needle
  if (
    phase === PHASES.DINING_NEEDLE &&
    save.collected["needle"] &&
    prevRoomID === "diningArea" &&
    currentRoomID === "kitchen"
  ) {
    startPhase(PHASES.BOSS_1);
    return;
  }

    if (
    phase === PHASES.BOSS_1 &&
    prevRoomID === "kitchen" &&   
    currentRoomID === "toilet" &&
    save.collected["knife"] &&
    save.collected["bandages"]
  ) {
    startPhase(PHASES.BOSS_2);
    return;
  }
}

function canMove(direction) {
  if (isPaused) return false;
  if (dialogueLocked) return false;

  // Survival
  if (mode !== "story") {
    const room = Rooms[currentRoomID];
    if (room?.boss) return false;

    return true;
  }

  // Story
  const phase = save.story.currentPhase;

  if (phase === PHASES.BEDROOM) {
    return direction === "left";
  }

  if (phase === PHASES.LIVING_ROOM) {
    return direction === "left";
  }

  if (phase === PHASES.DINING_NEEDLE) {
    if (!save.collected["needle"]) return false;
    return direction === "left";
  }

  if (phase === PHASES.BOSS_1) {
    const hasItems = save.collected["knife"] && save.collected["bandages"];
    if (!hasItems) return false;
    return direction === "right";
  }

  if (phase === PHASES.BOSS_2) {
    return false;
  }

  if (phase === PHASES.FREE_ROAM) {
    return true;
  }

  return true;
}


function setupPhaseContent() {
  if (mode !== "story") return;

  const phase = save.story.currentPhase;
}





//Dialogue

const dialogueBox = document.querySelector("#dialogueBox");
const dialogueText = document.querySelector("#dialogueText");
const dialogueHint = document.querySelector("#dialogueHint");

let dialogueLocked = false;
let activeDialogue = null;
let dialogueIndex = 0;

save.story.dialoguesPlayed = save.story.dialoguesPlayed || {};
save.story.lastRoomID = save.story.lastRoomID || null;

function startDialogue(dialogueKey, lines, onComplete = null) {
  if (!lines || lines.length === 0) return;

  dialogueLocked = true;
  activeDialogue = { key: dialogueKey, lines, onComplete };
  dialogueIndex = 0;

  dialogueBox.classList.remove("hidden");
  renderDialogueLine();
}

function renderDialogueLine() {
  const line = activeDialogue.lines[dialogueIndex];
  dialogueText.textContent = `${line.speaker}: ${line.text}`;
  if (dialogueHint) dialogueHint.textContent = "(click on dialogue box to continue)";
}

function endDialogue() {
  dialogueBox.classList.add("hidden");
  dialogueLocked = false;

  const finished = activeDialogue; 

  if (finished?.key) {
    save.story.dialoguesPlayed[finished.key] = true;
    saveGame();
  }

  activeDialogue = null;
  dialogueIndex = 0;

  if (typeof finished?.onComplete === "function") {
    finished.onComplete();
  }
}

function advanceDialogue() {
  if (!activeDialogue) return;

  dialogueIndex++;

  if (dialogueIndex >= activeDialogue.lines.length) {
    endDialogue();
    return;
  }

  renderDialogueLine();
}


dialogueBox.addEventListener("click", (e) => {
  if (!dialogueLocked) return;

  e.preventDefault();
  e.stopPropagation();

  advanceDialogue();
});

const DIALOGUES = {
  phase1_bedroom_enter: [
    { speaker: "YOU", text: "..." },
    { speaker: "YOU", text: "Where am I?"},
    { speaker: "YOU", text: "Is this my house?"},
    { speaker: "BUNNY", text: "Well no, not really." },
    { speaker: "YOU", text: "AHH! My bunny plush is talking?!"},
    { speaker: "BUNNY", text: "Me being able to speak should be the least of your concerns right now." },
    { speaker: "YOU", text: "..."},
    { speaker: "YOU", text: "What do you mean by that...and what do you mean this isn't my house?"},
    { speaker: "BUNNY", text: "It definitely looks like your house...doesn't mean it actually is though." },
    { speaker: "BUNNY", text: "If I were you, I'd find the way out right now." },
    { speaker: "BUNNY", text: "This isn't the type of place you'd like to stay in." },
    { speaker: "YOU", text: "W-what?"},
    { speaker: "BUNNY", text: "Let's just say there are not so pleasant things in this house with you right now." },
    { speaker: "BUNNY", text: "You're not safe here. I suggest you leave this room and start looking for things that could help you."},
    { speaker: "BUNNY", text: "Exit through the left door. NOW." },
  ],
  phase2_living_enter: [
    { speaker: "YOU", text: "This house… it feels wrong." },
    { speaker: "BUNNY", text: "We could run into something unpleasant at any moment, try looking through the furniture in the house, we might find something of use." },
    { speaker: "BUNNY", text: "Let's head to the left for now. Be careful." }
  ],
  phase3_dining_enter: [
    { speaker: "YOU", text: "This place actually looks exactly like my house...just much scarier..."},
    { speaker: "BUNNY", text: "Well you should be scared, afterall you could just die here." },
    { speaker: "YOU", text: "..."},
    { speaker: "BUNNY", text: "I have a feeling something is closing in. Quick, try opening the cabinets, look for anything that might help us." }
  ],
  phase3_needle_pickup: [
    { speaker: "YOU", text: "A needle...?" },
    { speaker: "BUNNY", text: "Not ideal, but it’s better than nothing." },
    { speaker: "SYSTEM", text: "(CLICK ON ITEM SLOT IN INVENTORY ON THE RIGHT TO EQUIP)" },
    { speaker: "SYSTEM", text: "(CLICK ON BOSSES TO DEAL DAMAGE)" },
    { speaker: "SYSTEM", text: "(YOU CANNOT ATTACK BOSSES WITHOUT EQUIPPING A WEAPON)" },
    { speaker: "BUNNY", text: "We should keep moving...before something finds us..."}
  ],
  phase4_boss1_defeat: [
    { speaker: "BUNNY", text: "Oh my, that was certainly scary..." },
    { speaker: "YOU", text: "..." },
    { speaker: "YOU", text: "WHAT WAS THAT?! THAT WAS HORRIFYING" },
    { speaker: "BUNNY", text: "I guess that was one of the unpleasant things in this house with you." },
    { speaker: "YOU", text: "...(shaking)" },
    { speaker: "YOU", text: "You did well, you're braver than I thought." },
    { speaker: "YOU", text: "Can we turn back? I don't want to do this anymore" },
    { speaker: "BUNNY", text: "If you turn back now, there is an equal chance of you running into something unpleasant."},
    { speaker: "YOU", text: "..." },
    { speaker: "YOU", text: "Alright...let's move on..." },
    { speaker: "BUNNY", text: "Remember to look through the furiture, anything could be of great help to us." }
  ],
  phase4_items_ready: [
    { speaker: "BUNNY", text: "Aren't you lucky." },
    { speaker: "BUNNY", text: "A knife and Bandages, those will definitely be of great help to us." },
    { speaker: "BUNNY", text: "You should use those bandages now...or you could use them later...better late than never I guess." },
    { speaker: "SYSTEM", text: "(EQUIP HEALING ITEMS THEN PRESS 'E' TO HEAL)" },
    { speaker: "BUNNY", text: "We should get moving now."}
  ],
  phase5_boss2_defeat: [
    { speaker: "YOU", text: "..."},
    { speaker: "BUNNY", text: "What luck you must have. Thats two in a row."},
    { speaker: "YOU", text: "I really want to get out of here..."},
    { speaker: "BUNNY", text: "Then I suggest we move on, quickly."},
    { speaker: "YOU", text: "Let's try to search for a way out."},
    { speaker: "BUNNY", text: "Lead the way...this is your 'house' afterall."},
  ],
  phase6_boss3_defeat: [
    { speaker: "YOU", text: "*cries*"},
    { speaker: "YOU", text: "I want to get out of here..."},
    { speaker: "BUNNY", text: "At least we have gone through the worst possible senario..."},
    { speaker: "YOU", text: "Well thanks for doing almost nothing"},
    { speaker: "BUNNY", text: "Rude much"},
    { speaker: "BUNNY", text: "My guess is we should be looking for a key and an exit right now rather than crying and complaining."},
    { speaker: "YOU", text: "Easy for you to say..."},
    { speaker: "BUNNY", text: "The longer you take to start looking, the longer you'll stay with these unpleasant tings."},
    { speaker: "YOU", text: "...I'll go look for them right now"},
  ],
  phase6_key_found: [ 
    { speaker: "YOU", text: "A key?"}, 
    { speaker: "BUNNY", text: "Good News, if there's a key that means there's an exit."}, 
    { speaker: "BUNNY", text: "This 'house' is not your real house, it does not follow logic and common sense either."}, 
    { speaker: "BUNNY", text: "A new exit might have appeared somewhere."}, 
    { speaker: "YOU", text: "Let's hurry and look for it so we can get out of here..."}, 
  ],
  phase8_escape: [
    { speaker: "YOU", text: "Wait...what's going on?"},
    { speaker: "YOU", text: "What is this place?"},
    { speaker: "BUNNY", text: "You'll find out soon enough."},
    { speaker: "DOCTOR", text: "Update on patient 067?"},
    { speaker: "OTHER DOCTOR", text: "Her condition stabilised not long ago, however she is still unconcious."},
    { speaker: "DOCTOR", text: "Keep her under careful supervision. Patient 067, Evangeline, suffers from major trauma."},
    { speaker: "YOU", text: "Evangeline...?"},
    { speaker: "DOCTOR", text: "A car accident took the lives of her parents and sister...she's the lone survival of her family."}, 
    { speaker: "DOCTOR", text: "She often experiences severe hallucinations and manic episodes, this is the first time she has ended up losing conciousness."},
    { speaker: "DOCTOR", text: "We must be more careful."}, 
    { speaker: "YOU", text: "I'm starting to remember..."},
    { speaker: "YOU", text: "That...that's me..."},
    { speaker: "BUNNY", text: "It's finally coming back to you."},
    { speaker: "YOU", text: "This is a mental hospital..."},
    { speaker: "BUNNY", text: "You're still unconcious, we are currently still in your mind"},
    { speaker: "YOU", text: "So that house...it was all created by my mind...?"},
    { speaker: "BUNNY", text: "Everything here is a result of your unstable mental state"},
    { speaker: "YOU", text: "Those entities..."},
    { speaker: "YOU", text: "They were...my parents..."},
    { speaker: "YOU", text: "...and my sister"},
    { speaker: "BUNNY", text: "A word of advice, try not to have another episode"},
    { speaker: "BUNNY", text: "This 'place' is unpredictable and dangerous."},
    { speaker: "BUNNY", text: "It changes with the state of your mind"},
    { speaker: "BUNNY", text: "The next time you come back here it will be far worse"},
    { speaker: "BUNNY", text: "If you don't manage to get out, you may never regain conciousness."},
    { speaker: "YOU", text: "I..."},
    { speaker: "BUNNY", text: "It's time for you to wake up now."},
    { speaker: "YOU", text: "wait....bunny!"},

  ],
  survival_start_bedroom: [
  { speaker: "BUNNY", text: "Oh?" },
  { speaker: "BUNNY", text: "Back again?" },
  { speaker: "BUNNY", text: "I told you not to come back here." },
  { speaker: "BUNNY", text: "But since you decided to come back I'll give you a few warnings" },
  { speaker: "BUNNY", text: "This won't be like the last time you were here" },
  { speaker: "BUNNY", text: "This 'house' is now far more unstable...common logic doesn't apply here anymore" },
  { speaker: "YOU", text: "What...?" },
  { speaker: "BUNNY", text: "You'll find out soon enough" },
  { speaker: "BUNNY", text: "Try not to get lost." },
  { speaker: "SYSTEM", text: "(KEY WILL NOT SPAWN UNTIL ALL ENTITIES ARE KILLED)" },
  { speaker: "SYSTEM", text: "(GAME STARTS AFTER THIS DIALOGUE)" }
  ],

};

function handleRoomEnterDialogue() {
  if (mode !== "story") return;

  const phase = save.story.currentPhase;
  const roomID = currentRoomID;

  // PHASE 1 — Bedroom
  if (
    phase === PHASES.BEDROOM &&
    roomID === "startingBedroom"
  ) {
    const key = "phase1_bedroom_enter";
    if (!save.story.dialoguesPlayed[key]) {
      startDialogue(key, DIALOGUES[key]);
      save.story.lastRoomID = roomID;
      saveGame();
    }
    return;
  }

  // PHASE 2 — Living Room
  if (
    phase === PHASES.LIVING_ROOM &&
    roomID === "livingRoom"
  ) {
    const key = "phase2_living_enter";
    if (!save.story.dialoguesPlayed[key]) {
      startDialogue(key, DIALOGUES[key]);
      save.story.lastRoomID = roomID;
      saveGame();
    }
    return;
  }

  // PHASE 3 — Dining Area
  if (
    phase === PHASES.DINING_NEEDLE &&
    roomID === "diningArea"
  ) {
    const key = "phase3_dining_enter";
    if (!save.story.dialoguesPlayed[key]) {
      startDialogue(key, DIALOGUES[key]);
      save.story.lastRoomID = roomID;
      saveGame();
    }
    return;
  }

    // PHASE 8 — Ending (enter ending room)
  if (
    phase === PHASES.ENDING &&
    roomID === "endingRoom"
  ) {
    const key = "phase8_escape";
    if (!save.story.dialoguesPlayed[key]) {
      startDialogue(key, DIALOGUES[key], () => {
        showCompletedScreen();
      });

      save.story.lastRoomID = roomID;
      saveGame();
    }
    return;
  }

}

//fight bgm

const whisperSFX = new Audio("Audios/fightwhisperBGM.mp3");
whisperSFX.loop = true;
whisperSFX.volume = 0;   
whisperSFX.preload = "auto";

let whisperFadeTimer = null;

function fadeTo(audio, targetVolume, step = 0.02, intervalMs = 30) {
  clearInterval(whisperFadeTimer);

  whisperFadeTimer = setInterval(() => {
    const v = audio.volume;

    if (Math.abs(v - targetVolume) <= step) {
      audio.volume = targetVolume;
      clearInterval(whisperFadeTimer);

      if (targetVolume === 0) {
        audio.pause();
        audio.currentTime = 0;
      }
      return;
    }

    audio.volume = v + (v < targetVolume ? step : -step);
  }, intervalMs);
}

function startWhispers() {
  if (!audioUnlocked) return;

  if (whisperSFX.paused) {
    whisperSFX.currentTime = 0;
    whisperSFX.play().catch(() => {});
  }

  fadeTo(whisperSFX, 1);
}

function stopWhispers() {
  fadeTo(whisperSFX, 0);
}

//BGM

var bgm = new Audio("Audios/AreYouAloneBGM.mp3");
bgm.loop = true;
bgm.volume = 0.3;

var endingBGM = new Audio("Audios/HospitalBGM.mp3");
endingBGM.loop = true;
endingBGM.volume = 0.6;

function stopMainBGM() {
  if (!bgm) return;
  bgm.pause();
  bgm.currentTime = 0;
}

function stopEndingBGM() {
  if (!endingBGM) return;
  endingBGM.pause();
  endingBGM.currentTime = 0;
}

const gate = document.getElementById("audioGate");

function unlockAudio() {
  audioUnlocked = true;

  Object.values(sfx).forEach(a => {
    try {
      a.play().then(() => {
        a.pause();
        a.currentTime = 0;
      }).catch(() => {});
    } catch (err) {}
  });

  bgm.play().catch(() => {});

    if (pendingJumpscare) {
      pendingJumpscare();
      save.jumpscaresPlayed["boss1"] = true; // safe because it's first-time only
      saveGame();
      pendingJumpscare = null;
    }

  sessionStorage.setItem("audioUnlocked", "true");

  if (gate) gate.style.display = "none";

  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
  document.removeEventListener("touchstart", unlockAudio);

  [bgm, whisperSFX, ...Object.values(sfx)].forEach(a => {
  try {
        a.play().then(() => {
         a.pause();
         a.currentTime = 0;
        }).catch(() => {});
    } catch {}
  });

}

// If already unlocked this session, try to play + hide gate
if (sessionStorage.getItem("audioUnlocked") === "true") {
  audioUnlocked = true; 
  bgm.play().catch(() => {});
  whisperSFX.load();
  if (gate) gate.style.display = "none";
} else {
  // Need user gesture first
  document.addEventListener("click", unlockAudio);
  document.addEventListener("keydown", unlockAudio);
  document.addEventListener("touchstart", unlockAudio, { passive: true });
}

//SFX

const walkSFX = new Audio("Audios/Walkingsfx.mp3");
walkSFX.volume = 0.6;

const sfx = {
  cabinet: new Audio("Audios/CabinetSFX.wav"),
  drawer: new Audio("Audios/DrawerSFX.mp3"),
  jumpscare: new Audio("Audios/JumpscareSFX.wav")

};

sfx.cabinet.volume = 0.6;
sfx.drawer.volume = 0.6;
sfx.jumpscare.volume = 1.0; 

Object.values(sfx).forEach(a => {
  a.preload = "auto";
});

const playerHitSFX = new Audio("Audios/DamagedSFX.wav");
playerHitSFX.volume = 1.0;

const playerDeathSFX = new Audio("Audios/DeadSFX.wav");
playerDeathSFX.volume = 1.0;


//damage flash

function flashDamage() {
  const flash = document.getElementById("damageFlash");
  if (!flash) return;

  flash.classList.add("active");
  setTimeout(() => {
    flash.classList.remove("active");
  }, 200);
}


const currentBGimg = document.querySelector('#GameBackground');
let currentRoomID = "startingBedroom";

const bossHP = document.querySelector("#bossHP");
const bossHPlabel = document.querySelector("#bossHPlabel");
const bossHPfill = document.querySelector("#bossHPfill");
const bossHPtext = document.querySelector("#bossHPtext");
let currentBossHP = 0;
let currentBossMaxHP = 0;


//arrows
function updateArrows() {
  const currentRoom = Rooms[currentRoomID];

  const leftArrow = document.querySelector("#arrowLeft");
  const rightArrow = document.querySelector("#arrowRight");
  const backArrow = document.querySelector("#arrowBackward");
  const forwardArrow = document.querySelector("#arrowForward");


  leftArrow.classList.add("hidden");
  rightArrow.classList.add("hidden");
  backArrow.classList.add("hidden");
  forwardArrow.classList.add("hidden");


  if (currentRoom.exits.left) leftArrow.classList.remove("hidden");
  if (currentRoom.exits.right) rightArrow.classList.remove("hidden");
  if (currentRoom.exits.back) backArrow.classList.remove("hidden");
  if (currentRoom.exits.forward) forwardArrow.classList.remove("hidden");


  if (currentRoom.boss) {
    leftArrow.classList.add("hidden");
    rightArrow.classList.add("hidden");
    backArrow.classList.add("hidden");
    forwardArrow.classList.add("hidden");
    return;
  }

  // SURVIVAL
  if (
    mode === "survival" &&
    save.survival?.keyFound &&
    currentRoomID === "exitHallway"
  ) {
    forwardArrow.classList.remove("hidden");
    Rooms.exitHallway.exits.forward = "endingRoom";
  }
  if (mode === "survival" && (!save.survival?.keyFound || currentRoomID !== "exitHallway")) {
  delete Rooms.exitHallway.exits.forward;
  }


  if (mode !== "story") return;

  const phase = save.story.currentPhase;


  forwardArrow.classList.add("hidden");
  // FREE ROAM + KEY + EXIT HALLWAY
  if (
  phase === PHASES.FREE_ROAM &&
  save.story.keyFound &&
  currentRoomID === "exitHallway"
  ) {
  forwardArrow.classList.remove("hidden");
  Rooms.exitHallway.exits.forward = "endingRoom";
  }


}

function bindArrowControlsOnce() {
  const leftArrow = document.querySelector("#arrowLeft");
  const rightArrow = document.querySelector("#arrowRight");
  const backArrow = document.querySelector("#arrowBackward");
  const forwardArrow = document.querySelector("#arrowForward");

  // LEFT
  if (leftArrow && !leftArrow.dataset.bound) {
    leftArrow.dataset.bound = "1";
    leftArrow.addEventListener("click", () => {
      if (!canMove("left")) return;

      const prevRoomID = currentRoomID;
      const currentRoom = Rooms[currentRoomID];
      const nextRoomID = currentRoom?.exits?.left;
      if (!nextRoomID) return;

      walkSFX.currentTime = 0;
      walkSFX.play().catch(() => {});
      setTimeout(() => {
        walkSFX.pause();
        walkSFX.currentTime = 0;
      }, 2150);

      currentRoomID = nextRoomID;

      if (mode === "story") handlePhaseProgression(prevRoomID);

      renderRoom();
    });
  }

  // RIGHT
  if (rightArrow && !rightArrow.dataset.bound) {
    rightArrow.dataset.bound = "1";
    rightArrow.addEventListener("click", () => {
      if (!canMove("right")) return;

      const prevRoomID = currentRoomID;
      const currentRoom = Rooms[currentRoomID];
      const nextRoomID = currentRoom?.exits?.right;
      if (!nextRoomID) return;

      walkSFX.currentTime = 0;
      walkSFX.play().catch(() => {});
      setTimeout(() => {
        walkSFX.pause();
        walkSFX.currentTime = 0;
      }, 2150);

      currentRoomID = nextRoomID;

      if (mode === "story") handlePhaseProgression(prevRoomID);

      renderRoom();
    });
  }

  // BACK
  if (backArrow && !backArrow.dataset.bound) {
    backArrow.dataset.bound = "1";
    backArrow.addEventListener("click", () => {
      if (!canMove("back")) return;

      const prevRoomID = currentRoomID;
      const currentRoom = Rooms[currentRoomID];
      const nextRoomID = currentRoom?.exits?.back;
      if (!nextRoomID) return;

      walkSFX.currentTime = 0;
      walkSFX.play().catch(() => {});
      setTimeout(() => {
        walkSFX.pause();
        walkSFX.currentTime = 0;
      }, 2150);

      currentRoomID = nextRoomID;

      if (mode === "story") handlePhaseProgression(prevRoomID);

      renderRoom();
    });
  }

  // FORWARD
  if (forwardArrow && !forwardArrow.dataset.bound) {
    forwardArrow.dataset.bound = "1";
    forwardArrow.addEventListener("click", () => {
      if (!canMove("forward")) return;

      const next = Rooms[currentRoomID].exits.forward;
      if (!next) return;

      const prevRoomID = currentRoomID;
      currentRoomID = next;

      renderRoom();
      updateArrows();

      if (prevRoomID === "exitHallway" && currentRoomID === "endingRoom") {
        stopBossFightLoop();
        stopWhispers();

        if (mode === "story") {
          startPhase(PHASES.ENDING);
        }

        if (mode === "survival") {
          stopSurvivalTimer?.();
          submitSurvivalRunToLeaderboard(survivalElapsedMs);
          showCompletedScreen();
        }

      } else if (mode === "story") {
        handlePhaseProgression(prevRoomID);
      }
    });
  }

}

//inventory

save.inventory = save.inventory || [];
if (save.equippedSlot === undefined) save.equippedSlot = null;
save.collected = save.collected || {};

function collectItem(item) {
if (isPaused) return;
if (dialogueLocked) return;
  if (save.collected[item.id]) return;

  if (save.inventory.length >= 4) {
    showToast("Inventory full");
    return;
  }

  const def = ITEM_EFFECTS[item.id];
  if (!def) {
    console.warn("No ITEM_EFFECTS entry for", item.id);
    return;
  }

  save.collected[item.id] = true;
  save.collected = { ...save.collected }; // forces update (prevents weird reference bugs)
  saveGame();


  save.inventory.push({
    id: item.id,
    img: item.img,
    type: def.type,
    heal: def.heal,
    damage: def.damage
  });
  
  phaseItemsCollected.push(item.id);

  saveGame();
  renderInventory();

  //survival
  if (mode === "survival") {
    const def = ITEM_EFFECTS[item.id];
    if (def?.type === "weapon" && !save.survival.weaponUnlocked) {
      save.survival.weaponUnlocked = true;
      saveGame();
      showToast("Something has awakened...");
      renderRoom(); 
    }
  }

  showToast("Item picked up");

    // Phase 3 — needle pickup dialogue
    if (
    mode === "story" &&
    save.story.currentPhase === PHASES.DINING_NEEDLE &&
    item.id === "needle"
    ) {
    const key = "phase3_needle_pickup";

    if (!save.story.dialoguesPlayed[key]) {
        startDialogue(key, DIALOGUES[key]);
    }
    }

    // Phase 4 — after boss1, both items collected
    if (
    mode === "story" &&
    save.story.currentPhase === PHASES.BOSS_1 &&
    save.collected["knife"] &&
    save.collected["bandages"]
    ) {
    const key = "phase4_items_ready";

    if (!save.story.dialoguesPlayed[key]) {
        startDialogue(key, DIALOGUES[key]);
    }
    }

    // FREE ROAM — key pickup
    if (
    mode === "story" &&
    save.story.currentPhase === PHASES.FREE_ROAM &&
    item.id === "key"
    ) {
    const keyDialogue = "phase6_key_found";

    // Always unlock exit
    save.story.keyFound = true;
    saveGame();
    updateArrows();

    // Only play dialogue once
    if (!save.story.dialoguesPlayed[keyDialogue]) {
        startDialogue(
        keyDialogue,
        DIALOGUES[keyDialogue]
        );
    }
    }

    // SURVIVAL — key pickup unlocks exitHallway forward
    if (mode === "survival" && item.id === "key") {
      save.survival = save.survival || {};
      save.survival.keyFound = true;
      saveGame();
      updateArrows();
    }
}


//toast
const toast = document.querySelector("#toast");
let toastTimer = null;

function showToast(message, ms = 900) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, ms);
}

const invSlots = Array.from(document.querySelectorAll(".inv-slot"));

function renderInventory() {
  invSlots.forEach((slotEl, i) => {
    slotEl.innerHTML = "";

    const item = save.inventory[i]; 
    if (item) {
      const img = document.createElement("img");
      img.src = item.img;
      img.alt = item.id;
      slotEl.appendChild(img);
    }

    slotEl.classList.toggle("equipped", save.equippedSlot === i);
  });
}

function setEquippedSlot(i) {

  if (!save.inventory[i]) return;


  if (save.equippedSlot === i) {
    save.equippedSlot = null;
    saveGame();
    renderInventory();
    showToast("Item unequipped");
    return;
  }

  save.equippedSlot = i;
  saveGame();
  renderInventory();
  showToast("Item equipped");
}

invSlots.forEach((slotEl, i) => {
  slotEl.addEventListener("click", () => setEquippedSlot(i));
});

function removeInventoryItemAt(index) {
  if (index < 0 || index >= save.inventory.length) return;

  if (save.equippedSlot === index) {
    save.equippedSlot = null;
  } else if (save.equippedSlot !== null && save.equippedSlot > index) {
    save.equippedSlot -= 1;
  }

  save.inventory.splice(index, 1);
  saveGame();
  renderInventory();
}


function useEquippedItem() {
  if (save.equippedSlot === null) {
    showToast("No item equipped");
    return;
  }

  const item = save.inventory[save.equippedSlot];
  if (!item) return;

  if (item.type !== "heal") {
    showToast("Can't use this now");
    return;
  }

  playerHP = Math.min(playerMaxHP, playerHP + item.heal);
  updatePlayerHPUI();
  showToast(`Healed +${item.heal}`);

  removeInventoryItemAt(save.equippedSlot);
}


renderInventory();


document.addEventListener("keydown", (e) => {
  if (isPaused) return;
  if (e.key.toLowerCase() === "e") {
    useEquippedItem();
  }
});

//fights (boss)
function attackBoss() {
  if (isPaused) return;
  const currentRoom = Rooms[currentRoomID];
  if (!currentRoom.boss) return;

  if (save.equippedSlot === null) {
    showToast("No weapon equipped");
    return;
  }

  const item = save.inventory[save.equippedSlot];
  if (!item || item.type !== "weapon") {
    showToast("That can't attack");
    return;
  }

  currentBossHP -= item.damage;
  if (currentBossHP < 0) currentBossHP = 0;

  bossHPtext.textContent = `${currentBossHP} / ${currentBossMaxHP}`;
  bossHPfill.style.width = `${(currentBossHP / currentBossMaxHP) * 100}%`;

  if (currentBossHP === 0) {
    onBossDefeated(currentRoom.boss);
  }
  console.log("ATTACK");

}

function onBossDefeated(boss) {
  showToast(`${boss.name} defeated`);

  if (mode === "survival") {
    save.survival = save.survival || {};
    save.survival.bossesDefeated = save.survival.bossesDefeated || {};
    save.survival.bossesDefeated[boss.id] = true;
    saveGame();
  }

  if (mode === "survival") {
    save.survival = save.survival || {};
    save.survival.bossesDefeated = save.survival.bossesDefeated || {};
    save.survival.bossesDefeated[boss.id] = true;
    saveGame();

    if (!save.survival.keySpawned && areAllSurvivalBossesDefeated()) {
      spawnSurvivalKeyNow();
    }
  }

  bossHP.classList.add("hidden");
  bossImage.classList.add("hidden");
  stopWhispers();

  const room = Rooms[currentRoomID];
  delete room.boss;

  save.bosses = save.bosses || {};
  save.bosses[boss.id] = true;
  saveGame();

  updateArrows();

  if (mode === "story" && boss.id === "boss1") {
    startDialogue(
      "phase4_boss1_defeat",
      DIALOGUES.phase4_boss1_defeat
    );
  }

  if (mode === "story" && boss.id === "boss2") {
    startDialogue(
      "phase5_boss2_defeat",
      DIALOGUES.phase5_boss2_defeat,
      () => {
        startPhase(PHASES.FREE_ROAM);
        updateArrows();
      }
    );
  }

    if (mode === "story" && boss.id === "boss3") {
    startDialogue(
        "phase6_boss3_defeat",
        DIALOGUES.phase6_boss3_defeat,
        () => {
        startPhase(PHASES.FREE_ROAM);   
        updateArrows();
        renderRoom();               
        }
    );
    }

}


document.addEventListener("click", (e) => {
  if (isPaused) return;
  const currentRoom = Rooms[currentRoomID];
  if (!currentRoom.boss) return;

  if (e.target.closest("#inventory")) return;
  if (e.target.closest("#overlay")) return;
  if (e.target.closest("#bossHP")) return;
  if (e.target.closest("#arrowLeft, #arrowRight, #arrowBackward, #arrowForward")) return;

  attackBoss();
});

//fights (player)

let playerMaxHP = 100;
let playerHP = 100;

const playerHPbar = document.querySelector("#playerHP");
const playerHPfill = document.querySelector("#playerHPfill");
const playerHPtext = document.querySelector("#playerHPtext");

function updatePlayerHPUI() {
  if (!playerHPbar) return;
  playerHPtext.textContent = `${playerHP} / ${playerMaxHP}`;
  playerHPfill.style.width = `${(playerHP / playerMaxHP) * 100}%`;
}

//boss attack pattern
let bossAttackTimer = null;

function startBossFightLoop() {
  stopBossFightLoop();

  bossAttackTimer = setInterval(() => {
    const room = Rooms[currentRoomID];
    if (!room?.boss) return;

    const dmg = room.boss.attackDamage ?? 8;

    playerHP -= dmg;
    if (playerHP < 0) playerHP = 0;

    updatePlayerHPUI();

    flashDamage();

    if (audioUnlocked) {
      playerHitSFX.currentTime = 0;
      playerHitSFX.play().catch(() => {});
    }

    if (playerHP === 0) {
      onPlayerDied();
    }
  }, 1600);
}

function stopBossFightLoop() {
  if (bossAttackTimer) clearInterval(bossAttackTimer);
  bossAttackTimer = null;
}

function onPlayerDied() {
  stopBossFightLoop();
  stopWhispers();

  flashDamage();
  setTimeout(flashDamage, 180);

  if (audioUnlocked) {
    playerDeathSFX.currentTime = 0;
    playerDeathSFX.play().catch(() => {});
  }

  showToast("You died");

  if (mode === "story") {
    setTimeout(() => {
      respawnPlayer();
    }, 1200);
  } else {
    handleSurvivalDeath();
  }
}


//story respawn
function respawnPlayer() {
  const phase = save.story.currentPhase;

  // reset HP
  playerHP = playerMaxHP;
  updatePlayerHPUI();

  // reset phase items & boss
  resetCurrentPhase();

  // move player to phase start
  const startRoom = PHASE_START_ROOMS[phase];
  if (startRoom) {
    currentRoomID = startRoom;
  }

  renderRoom();
}

//survival
function handleSurvivalDeath() {
  if (mode !== "survival") return;
  showDeathScreen();
}


//hotspots

const overlay = document.querySelector("#overlay");
const overlayImage = document.querySelector("#overlayImage");
const overlayItems = document.querySelector("#overlayItems");


const overlayImages = {
  drawer: "Assets/ProjectEvangelineDrawer.png",
  cabinet: "Assets/ProjectEvangelineCabinet.png"
};

function renderOverlayItems(hotspot) {
  overlayItems.innerHTML = "";

  if (!hotspot?.items) return;

  save.collected = save.collected || {};

  hotspot.items.forEach(item => {
    if (save.collected[item.id]) return;
      // KEY uses 3D model instead of img
    if (item.id === "key") {
    // don’t create an image; show 3D key viewer instead
    showOverlayKey3D(hotspot);
    return;
    }
    const img = document.createElement("img");
    img.src = item.img;
    img.classList.add("overlay-item");

    img.style.left = item.left + "%";
    img.style.top = item.top + "%";
    img.style.width = item.width + "%";

    img.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isPaused) return;

    const before = !!save.collected[item.id];
    collectItem(item);
    const after = !!save.collected[item.id];

    // ONLY remove if item was actually collected
    if (!before && after) {
        img.remove();
    }
    });

    overlayItems.appendChild(img);
  });
}


function openOverlay(imageSrc, hotspot) {
  if (isPaused) return;
  overlayImage.src = imageSrc;
  overlay.classList.remove("hidden");
  renderOverlayItems(hotspot);
}


function closeOverlay() {
  overlay.classList.add("hidden");
  overlayImage.src = "";
  overlayItems.innerHTML = "";
  hideOverlayKey3D();
}


overlay.addEventListener("click", closeOverlay);

function renderHotspots() {
  const hotspotsContainer = document.querySelector("#hotspots");
  hotspotsContainer.innerHTML = "";

  const room = Rooms[currentRoomID];
  const hotspots = room.hotspots || [];
  let filteredHotspots = hotspots;

    if (mode === "story") {
    filteredHotspots = hotspots.filter(hotspot => {
        if (!hotspot.items) return false;

        return hotspot.items.some(item =>
        STORY_ITEMS.has(item.id)
        );
    });
    }

  filteredHotspots.forEach(hotspot => {

    const hotspotDiv = document.createElement("div");
    hotspotDiv.classList.add("hotspot");

    hotspotDiv.style.left = hotspot.left + "%";
    hotspotDiv.style.top = hotspot.top + "%";
    hotspotDiv.style.width = hotspot.width + "%";
    hotspotDiv.style.height = hotspot.height + "%";
    if (hotspot.rotate) {
      hotspotDiv.style.transform = `rotate(${hotspot.rotate}deg)`;
    }

    hotspotDiv.addEventListener("click", () => {
    if (isPaused) return;
    if (dialogueLocked) return;
    const imageSrc = overlayImages[hotspot.overlay];
    if (!imageSrc) return;

    if (hotspot.overlay === "cabinet") {
        sfx.cabinet.currentTime = 0;
        sfx.cabinet.play();
    }
    if (hotspot.overlay === "drawer") {
        sfx.drawer.currentTime = 0;
        sfx.drawer.play();
    }

    openOverlay(imageSrc, hotspot);
    });

    hotspotsContainer.appendChild(hotspotDiv);
  });

}

//clear hotspots
function clearAllHotspotItems() {
  for (const room of Object.values(Rooms)) {
    room.hotspots?.forEach(hotspot => {
      delete hotspot.items;
    });
  }
}

//jumpscares
const jumpscare = document.querySelector("#jumpscare");
const jumpscareImg = document.querySelector("#jumpscareImg");

const JUMPSCARE_POS = {
  boss1: "50% 20%",
  boss2: "50% 20%",
  boss3: "50% 60%"
};


function playJumpscare(imgSrc, durationMs = 600) {
  let didPlaySound = false;

  const playNow = () => {
    sfx.jumpscare.currentTime = 0;
    sfx.jumpscare.play().catch(() => {});
    didPlaySound = true;
  };

  if (audioUnlocked) {
    playNow();
  } else {
    pendingJumpscare = () => playNow();
  }

  jumpscareImg.src = imgSrc;
  jumpscare.classList.remove("hidden");

  setTimeout(() => {
    jumpscare.classList.add("hidden");
    jumpscareImg.src = "";
  }, durationMs);

  return didPlaySound;
}



save.jumpscaresPlayed = save.jumpscaresPlayed || {};

//bosses
const BOSS_STYLE = {
  boss1: { left: "50%", top: "60%", width: "20vw" },
  boss2: { left: "50%", top: "60%", width: "35vw"},
  boss3: { left: "50%", top: "60%", width: "20vw"},

  // survival bosses
  sb1: { left: "50%", top: "60%", width: "20vw" },
  sb2: { left: "50%", top: "60%", width: "35vw" },
  sb3: { left: "50%", top: "60%", width: "20vw" },
  sb4: { left: "50%", top: "60%", width: "28vw", scale: 0.9 },
  sb5: { left: "50%", top: "60%", width: "21vw", scale: 1 },
  sb6: { left: "50%", top: "60%", width: "28vw", scale: 0.8 },
  sb7: { left: "50%", top: "66%", width: "20vw", scale: 0.90 },
};

const bossImage = document.querySelector("#bossImage");


//clear bosses

function clearAllBosses() {
  save.bosses = {};
  save.jumpscaresPlayed = {};
  saveGame();
}


//restore bosses
function restoreStoryBosses() {
  Rooms.kitchen.boss = {
    id: "boss1",
    name: "FEMALE BOSS",
    maxHP: 500,
    img: "Assets/Boss1.png",
    jumpscareImg: "Assets/Boss1jumpscare.png",
    attackDamage: 3
  };

  Rooms.toilet.boss = {
    id: "boss2",
    name: "MALE BOSS",
    maxHP: 500,
    img: "Assets/Boss2.png",
    jumpscareImg: "Assets/Boss2jumpscare.png",
    attackDamage: 5
  };

  Rooms.exitHallway.boss = {
    id: "boss3",
    name: "FINAL BOSS",
    maxHP: 1000,
    img: "Assets/Boss3.png",
    jumpscareImg: "Assets/Boss3jumpscare.png",
    attackDamage: 6
  };
}


//completed screen
function showCompletedScreen() {
  if (mode === "survival") {
  stopSurvivalTimer();
  const score = getSurvivalScoreFromTime(survivalElapsedMs);
  console.log("SURVIVAL TIME MS:", survivalElapsedMs, "SCORE:", score);
  }

  // hard lock gameplay
  dialogueLocked = true;
  stopBossFightLoop();
  stopWhispers();



  // hide interactables
  document.querySelector("#hotspots")?.classList.add("hidden");
  document.querySelector("#arrowLeft")?.classList.add("hidden");
  document.querySelector("#arrowRight")?.classList.add("hidden");
  document.querySelector("#arrowBackward")?.classList.add("hidden");
  document.querySelector("#arrowForward")?.classList.add("hidden");

  const screen = document.querySelector("#completedScreen");
  if (screen) screen.classList.remove("hidden");

  const btn = document.querySelector("#completedBtn");
  if (btn && !btn.dataset.bound) {
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      window.location.href = "MainMenu.html"; 
    });
  }
}

//Death screen (survival)
function showDeathScreen() {
  if (mode !== "survival") return;

  isPaused = true;
  dialogueLocked = true;

  stopBossFightLoop();
  stopWhispers();
  stopSurvivalTimer();
  hidePauseOverlay();
  closeOverlay();
  hideOverlayKey3D?.();


  bossHP?.classList.add("hidden");
  bossImage?.classList.add("hidden");

  document.querySelector("#hotspots")?.classList.add("hidden");
  document.querySelector("#arrowLeft")?.classList.add("hidden");
  document.querySelector("#arrowRight")?.classList.add("hidden");
  document.querySelector("#arrowBackward")?.classList.add("hidden");
  document.querySelector("#arrowForward")?.classList.add("hidden");
  document.querySelector("#pauseButton")?.classList.add("hidden");

  const screen = document.querySelector("#deathScreen");
  if (!screen) {
    console.warn("deathScreen missing in HTML");
    return;
  }

  screen.classList.remove("hidden");

  const restartBtn = document.querySelector("#deathRestartBtn");
  const quitBtn = document.querySelector("#deathQuitBtn");

  if (restartBtn && !restartBtn.dataset.bound) {
    restartBtn.dataset.bound = "1";

    restartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      screen.classList.add("hidden");

      isPaused = false;
      dialogueLocked = false;


      document.querySelector("#pauseButton")?.classList.remove("hidden");
      document.querySelector("#hotspots")?.classList.remove("hidden");

      currentRoomID = "startingBedroom";

      initSurvivalBase();
    });
  }

  if (quitBtn && !quitBtn.dataset.bound) {
    quitBtn.dataset.bound = "1";

    quitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      wipeSurvivalRunState();
      window.location.href = "MainMenu.html";
    });
  }
}




//animations
function playEyeOpeningAnimation(onComplete = null) {
  const overlay = document.getElementById("eyeOverlay");
  if (!overlay) return;
  
  overlay.style.display = ""; 
  dialogueLocked = true; // lock player during animation


  setTimeout(() => {
    overlay.classList.add("open");
  }, 200);


  setTimeout(() => {
    overlay.style.display = "none";
    dialogueLocked = false;

    if (typeof onComplete === "function") {
      onComplete();
    }
  }, 2000);
}

function setupStoryWorld() {
  Rooms.startingBedroom.exits = { left: "livingRoom" };

  Rooms.livingRoom.exits = {
    back: "startingBedroom",
    left: "diningArea",
    right: "exitHallway"
  };

  Rooms.diningArea.exits = { left: "kitchen", right: "livingRoom" };

  Rooms.kitchen.exits = { back: "diningArea", right: "toilet" };

  Rooms.toilet.exits = { left: "kitchen" };

  Rooms.exitHallway.exits = { left: "livingRoom", right: "parentsBedroom" };

  Rooms.parentsBedroom.exits = { back: "exitHallway" };

  delete Rooms.exitHallway.exits.forward;

  clearDynamicRoomContent();
  applyStoryContent();
}


function renderRoom() {
  if (mode === "story") setupPhaseContent();

  const currentRoom = Rooms[currentRoomID];

  if (mode === "survival") {
    if (Rooms[currentRoomID].boss) delete Rooms[currentRoomID].boss;

    const placements = save.survival?.bossPlacements || {};
    const bossesDefeated = save.survival?.bossesDefeated || {};

    if (save.survival?.weaponUnlocked) {
      const bossId = placements[currentRoomID];
      if (bossId && !bossesDefeated[bossId]) {
        const bossDef = getSurvivalBossById(bossId);
        if (bossDef) {
          
          Rooms[currentRoomID].boss = { ...bossDef };
        }
      }
    }
  }

  currentBGimg.src = currentRoom.bg;
  renderRoomBunnyIfNeeded();

  updateArrows();
  renderHotspots();

  if (mode === "story") handleRoomEnterDialogue();
  if (mode === "story") {

    if (save.story.currentPhase === PHASES.ENDING) {

      stopMainBGM(); 

      if (endingBGM.paused) {
        endingBGM.play().catch(() => {});
      }

    } else {

      stopEndingBGM(); 

      if (bgm.paused) {
        bgm.play().catch(() => {});
      }

    }
  }

  if (currentRoom.boss) {
    bossHP.classList.remove("hidden");

    currentBossMaxHP = currentRoom.boss.maxHP;
    currentBossHP = currentBossMaxHP;

    bossHPlabel.textContent = currentRoom.boss.name;
    bossHPtext.textContent = `${currentBossHP} / ${currentBossMaxHP}`;
    bossHPfill.style.width = "100%";

    bossImage.src = currentRoom.boss.img;
    bossImage.classList.remove("hidden");

    const st = BOSS_STYLE[currentRoom.boss.id];

    if (st) {
      if (st.left) bossImage.style.left = st.left;
      if (st.top) bossImage.style.top = st.top;
      if (st.width) bossImage.style.width = st.width;

      const scale = st.scale ?? 1;
      bossImage.style.transform = `translate(-50%, -50%) scale(${scale})`;
    } else {
      bossImage.style.left = "50%";
      bossImage.style.top = "55%";
      bossImage.style.width = "35vw";
      bossImage.style.transform = "translate(-50%, -50%)";
    }

    startBossFightLoop();

    if (mode === "story") {
      save.jumpscaresPlayed = save.jumpscaresPlayed || {};
      if (!save.jumpscaresPlayed[currentRoom.boss.id]) {
        playJumpscare(currentRoom.boss.jumpscareImg);
        save.jumpscaresPlayed[currentRoom.boss.id] = true;
        saveGame();
      }
    } else {
      playJumpscare(currentRoom.boss.jumpscareImg);
    }
  } else {
    bossHP.classList.add("hidden");
    bossImage.classList.add("hidden");
    stopBossFightLoop();
  }

  if (audioUnlocked) {
    if (currentRoom.boss) startWhispers();
    else stopWhispers();
  }
}

//creating timers
const survivalTimerBox = document.querySelector("#survivalTimer");
const survivalTimerValue = document.querySelector("#survivalTimerValue");
let survivalStartMs = 0;
let survivalTimerId = null;
let survivalElapsedMs = 0;
let survivalPaused = false;
let survivalPauseStartMs = 0;
let survivalPausedTotalMs = 0;

if (mode === "story") {
  // STARTING BEDROOM
  Rooms.startingBedroom.exits.left = "livingRoom";

  // LIVING ROOM
  Rooms.livingRoom.exits.back = "startingBedroom";
  Rooms.livingRoom.exits.left = "diningArea";
  Rooms.livingRoom.exits.right = "exitHallway";

  // DINING AREA
  Rooms.diningArea.exits.left = "kitchen";
  Rooms.diningArea.exits.right = "livingRoom";

  // KITCHEN
  Rooms.kitchen.exits.back = "diningArea";
  Rooms.kitchen.exits.right = "toilet";

  // TOILET
  Rooms.toilet.exits.left = "kitchen";

  // EXIT HALLWAY
  Rooms.exitHallway.exits.left = "livingRoom";
  Rooms.exitHallway.exits.right = "parentsBedroom";

  // PARENTS BEDROOM
  Rooms.parentsBedroom.exits.back = "exitHallway";

  setupStoryWorld();
  startNewStoryRun();
  bindArrowControlsOnce();

  
  startPhase(PHASES.BEDROOM);
  hideSurvivalTimerUI();
  stopSurvivalTimer();
  playEyeOpeningAnimation(() => {
    renderRoom();
  });

}

//survival room randomisation
function randomizeSurvivalLayoutNewRun() {
  const nodes = [
    "startingBedroom",
    "livingRoom",
    "diningArea",
    "kitchen",
    "toilet",
    "parentsBedroom",
    "exitHallway"
  ];

  nodes.forEach(id => (Rooms[id].exits = {}));

  const DIRS = ["left", "right", "back"];

  function firstFreeDir(roomId) {
    for (const d of DIRS) {
      if (!Rooms[roomId].exits[d]) return d;
    }
    return null;
  }

  function areConnected(a, b) {
    return Object.values(Rooms[a].exits).includes(b) || Object.values(Rooms[b].exits).includes(a);
  }

  function link(a, b) {
    if (a === b) return false;
    if (areConnected(a, b)) return false;

    const da = firstFreeDir(a);
    const db = firstFreeDir(b);
    if (!da || !db) return false;

    Rooms[a].exits[da] = b;
    Rooms[b].exits[db] = a;
    return true;
  }

  const others = shuffle(nodes.filter(r => r !== "startingBedroom"));
  let prev = "startingBedroom";

  for (const r of others) {
    if (!link(prev, r)) {
      let linked = false;
      for (const alt of shuffle(nodes)) {
        if (link(alt, r)) {
          linked = true;
          break;
        }
      }
      if (!linked) console.warn("Could not link room:", r);
    }
    prev = r;
  }

  const EXTRA_LINKS = 6;
  let attempts = 0;
  let added = 0;

  while (added < EXTRA_LINKS && attempts < 200) {
    attempts++;

    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const b = nodes[Math.floor(Math.random() * nodes.length)];

    if (link(a, b)) {
      added++;
    }
  }

  delete Rooms.exitHallway.exits.forward;
}



//Survival items
const SURVIVAL_ITEM_POOL = [
  { id: "needle", img: "Assets/ProjectEvangelineNeedle.png" },
  { id: "knife", img: "Assets/ProjectEvangelineKnife.png" },
  { id: "bandages", img: "Assets/ProjectEvangelineBandages.png" },
  { id: "medkit", img: "Assets/ProjectEvangelineMedkit.png" },
  { id: "gun", img: "Assets/ProjectEvangelineGun.png" },
  { id: "scissors", img: "Assets/ProjectEvangelineScissors.png" },
  { id: "injection", img: "Assets/ProjectEvangelineInjectionShot.png" }
];

const SURVIVAL_WEAPONS = new Set(["needle", "knife", "gun", "scissors"]);

//Survival Bosses
const SURVIVAL_BOSS_POOL = [
  { id: "sb1", name: "MOM", maxHP: 620, img: "Assets/Boss1.png", jumpscareImg: "Assets/Boss1jumpscare.png", attackDamage: 4 },
  { id: "sb2", name: "DAD", maxHP: 520, img: "Assets/Boss2.png", jumpscareImg: "Assets/Boss2jumpscare.png", attackDamage: 5 },
  { id: "sb3", name: "SISTER", maxHP: 580, img: "Assets/Boss3.png", jumpscareImg: "Assets/Boss3jumpscare.png", attackDamage: 4 },
  { id: "sb4", name: "ENTITY ?", maxHP: 600, img: "Assets/Boss4.png", jumpscareImg: "Assets/Boss4jumpscare.png", attackDamage: 6 },
  { id: "sb5", name: "ENTITY ??", maxHP: 950, img: "Assets/Boss5.png", jumpscareImg: "Assets/Boss5jumpscare.png", attackDamage: 4 },
  { id: "sb6", name: "ENTITY ???", maxHP: 700, img: "Assets/Boss6.png", jumpscareImg: "Assets/Boss6jumpscare.png", attackDamage: 6 },
  { id: "sb7", name: "ENTITY ????", maxHP: 560, img: "Assets/Boss7.png", jumpscareImg: "Assets/Boss7jumpscare.png", attackDamage: 5 },
];

function getSurvivalBossById(id) {
  return SURVIVAL_BOSS_POOL.find(b => b.id === id) || null;
}

function pickAndPlaceSurvivalBossesNewRun() {
  save.survival = save.survival || {};
  save.survival.weaponUnlocked = false;
  save.survival.keySpawned = false;
  save.survival.keyFound = false;
  save.survival.bossPlacements = {};
  save.survival.bossesDefeated = {};

  const picked = shuffle(SURVIVAL_BOSS_POOL).slice(0, 3).map(b => b.id);

  const candidateRooms = ["livingRoom", "diningArea", "kitchen", "toilet", "parentsBedroom", "exitHallway"];
  const chosenRooms = shuffle(candidateRooms).slice(0, 3);

  for (let i = 0; i < 3; i++) {
    save.survival.bossPlacements[chosenRooms[i]] = picked[i];
  }

  saveGame();
}

function areAllSurvivalBossesDefeated() {
  const placements = save.survival?.bossPlacements || {};
  const defeated = save.survival?.bossesDefeated || {};

  const bossIds = Object.values(placements).filter(Boolean);

  const EXPECTED = 3;

  if (bossIds.length !== EXPECTED) return false;

  return bossIds.every(id => defeated[id] === true);
}


//survival hotspots
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

//survival item placement
function getAllHotspots(roomIDs) {
  const out = [];
  roomIDs.forEach(roomID => {
    const room = Rooms[roomID];
    (room?.hotspots || []).forEach(h => out.push({ roomID, hotspot: h }));
  });
  return out;
}

function isDrawerHotspot(h) {
  return h?.overlay === "drawer";
}

function clearHotspotItems(roomIDs) {
  roomIDs.forEach(roomID => {
    Rooms[roomID]?.hotspots?.forEach(h => delete h.items);
  });
}

function defaultPlacement() {
  return { left: 45, top: 55, width: 18 };
}

function placeSurvivalItemsNewRun() {
  const roomIDs = [
    "startingBedroom",
    "livingRoom",
    "diningArea",
    "kitchen",
    "toilet",
    "parentsBedroom",
    "exitHallway"
  ];

  clearHotspotItems(roomIDs);

  const all = getAllHotspots(roomIDs);

  const roomItemCount = {};
  roomIDs.forEach(r => (roomItemCount[r] = 0));

  const uniqueItems = shuffle(SURVIVAL_ITEM_POOL);

  const weaponCandidates = uniqueItems.filter(i => SURVIVAL_WEAPONS.has(i.id));
  if (weaponCandidates.length === 0) {
    console.warn("No weapons in SURVIVAL_ITEM_POOL — bosses can never unlock.");
  }

  const maxItemsToPlace = Math.min(6, uniqueItems.length); 

  const roomHotspots = {};
  roomIDs.forEach(r => (roomHotspots[r] = []));

  all.forEach(entry => {
    roomHotspots[entry.roomID].push(entry.hotspot);
  });

  Object.keys(roomHotspots).forEach(r => {
    roomHotspots[r] = shuffle(roomHotspots[r]);
  });

  const placedItemIds = new Set();

  function canPlaceInRoom(roomID) {
    return roomItemCount[roomID] < 2;
  }

  function placeIntoRoom(roomID, itemObj) {
    if (!canPlaceInRoom(roomID)) return false;

    const spots = roomHotspots[roomID];
    if (!spots || spots.length === 0) return false;

    const targetHotspot = spots.find(h => !h.items || h.items.length === 0);
    if (!targetHotspot) return false;

    targetHotspot.items = [{
      id: itemObj.id,
      img: itemObj.img,
      ...defaultPlacement()
    }];

    roomItemCount[roomID] += 1;
    placedItemIds.add(itemObj.id);
    return true;
  }

  if (weaponCandidates.length > 0) {
    const weapon = weaponCandidates[Math.floor(Math.random() * weaponCandidates.length)];
    const roomsShuffled = shuffle(roomIDs);

    let weaponPlaced = false;
    for (const r of roomsShuffled) {
      if (placeIntoRoom(r, weapon)) {
        weaponPlaced = true;
        break;
      }
    }

    if (!weaponPlaced) {
      console.warn("Could not place guaranteed weapon (no available hotspots).");
    }
  }

  let placedCount = 0;

  for (const item of uniqueItems) {
    if (placedCount >= maxItemsToPlace) break;
    if (placedItemIds.has(item.id)) continue;

    const roomsShuffled = shuffle(roomIDs);
    let placedThis = false;

    for (const r of roomsShuffled) {
      if (placeIntoRoom(r, item)) {
        placedThis = true;
        break;
      }
    }

    if (placedThis) placedCount++;
    else break; 
  }
}


//spawn key
function spawnSurvivalKeyNow() {
  if (mode !== "survival") return;
  if (save.survival?.keySpawned) return;
  if (save.survival?.keyFound) return;

  const roomIDs = [
    "startingBedroom",
    "livingRoom",
    "diningArea",
    "kitchen",
    "toilet",
    "parentsBedroom",
    "exitHallway"
  ];

  const roomItemCount = {};
  roomIDs.forEach(r => (roomItemCount[r] = 0));

  roomIDs.forEach(roomID => {
    const room = Rooms[roomID];
    room?.hotspots?.forEach(h => {
      const count = (h.items?.length || 0);
      roomItemCount[roomID] += count;
    });
  });

  const all = getAllHotspots(roomIDs);

  const eligibleDrawers = all.filter(x => {
    const h = x.hotspot;
    if (!isDrawerHotspot(h)) return false;

    if (h.items && h.items.length > 0) return false;

    if (roomItemCount[x.roomID] >= 2) return false;

    return true;
  });

  if (eligibleDrawers.length === 0) {
    console.warn("No eligible drawer hotspot to spawn survival key (room cap/full hotspots).");

    const fallback = all.filter(x => isDrawerHotspot(x.hotspot) && (!x.hotspot.items || x.hotspot.items.length === 0));
    if (fallback.length === 0) return;

    const pick = fallback[Math.floor(Math.random() * fallback.length)];
    pick.hotspot.items = [{
      id: "key",
      img: "Assets/keyreplacement.png",
      ...defaultPlacement()
    }];
  } else {
    const pick = eligibleDrawers[Math.floor(Math.random() * eligibleDrawers.length)];
    pick.hotspot.items = [{
      id: "key",
      img: "Assets/keyreplacement.png",
      ...defaultPlacement()
    }];
  }

  save.survival = save.survival || {};
  save.survival.keySpawned = true;
  saveGame();

  showToast("You hear a click somewhere...");
  renderRoom(); 
}

function removeKeyFromAllHotspots() {
  const roomIDs = [
    "startingBedroom",
    "livingRoom",
    "diningArea",
    "kitchen",
    "toilet",
    "parentsBedroom",
    "exitHallway"
  ];

  roomIDs.forEach(roomID => {
    Rooms[roomID]?.hotspots?.forEach(h => {
      if (!h.items) return;
      h.items = h.items.filter(it => it.id !== "key");
      if (h.items.length === 0) delete h.items;
    });
  });
}


//survival timer

function formatTimeMs(ms) {
  if (ms == null) return "—";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function updateSurvivalTimerUI(ms) {
  const val = document.querySelector("#survivalTimerValue");
  if (!val) return;
  val.textContent = formatTimeMs(ms);
}

function startSurvivalTimer() {
  if (mode !== "survival") return;

  survivalStartMs = Date.now();
  survivalPausedTotalMs = 0;
  survivalPaused = false;
  survivalPauseStartMs = 0;

  survivalElapsedMs = 0;

  if (survivalTimerBox) survivalTimerBox.classList.remove("hidden");
  updateSurvivalTimerUI(0);

  stopSurvivalTimer();

  survivalTimerId = setInterval(() => {
    if (survivalPaused) return;

    survivalElapsedMs = (Date.now() - survivalStartMs) - survivalPausedTotalMs;
    updateSurvivalTimerUI(survivalElapsedMs);
  }, 100);
}

function pauseSurvivalTimer() {
  if (mode !== "survival") return;
  if (survivalPaused) return;

  survivalPaused = true;
  survivalPauseStartMs = Date.now();
}

function resumeSurvivalTimer() {
  if (mode !== "survival") return;
  if (!survivalPaused) return;

  survivalPaused = false;
  survivalPausedTotalMs += (Date.now() - survivalPauseStartMs);
  survivalPauseStartMs = 0;
}


function stopSurvivalTimer() {
  if (!survivalStartMs) {
    if (survivalTimerId) clearInterval(survivalTimerId);
    survivalTimerId = null;
    survivalPaused = false;
    survivalPauseStartMs = 0;
    survivalPausedTotalMs = 0;
    return;
  }

  const now = Date.now();

  if (survivalPaused) {
    survivalElapsedMs = (survivalPauseStartMs - survivalStartMs) - survivalPausedTotalMs;
  } else {
    survivalElapsedMs = (now - survivalStartMs) - survivalPausedTotalMs;
  }

  if (survivalElapsedMs < 0) survivalElapsedMs = 0;

  if (survivalTimerId) clearInterval(survivalTimerId);
  survivalTimerId = null;

  survivalPaused = false;
  survivalPauseStartMs = 0;
  survivalPausedTotalMs = 0;

  updateSurvivalTimerUI(survivalElapsedMs);
}


function hideSurvivalTimerUI() {
  const box = document.querySelector("#survivalTimer");
  if (box) box.classList.add("hidden");
}


function getSurvivalScoreFromTime(ms) {
  const base = 100000;
  const penalty = Math.floor(ms / 10); 
  return Math.max(0, base - penalty);
}

//submit to leaderboard
function submitSurvivalRunToLeaderboard(timeMs) {
  const username = localStorage.getItem("currentUser") || "Unknown";

  const score = getSurvivalScoreFromTime(timeMs);

  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  leaderboard.push({
    username,
    timeMs,
    score
  });

 leaderboard.sort((a, b) => {
    const s = (b.score ?? 0) - (a.score ?? 0);
    if (s !== 0) return s;
    return (a.timeMs ?? Infinity) - (b.timeMs ?? Infinity);
  });

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0, 50)));

  const saveKey = "save_" + username;
  const saveData = JSON.parse(localStorage.getItem(saveKey)) || {};

  const prevHigh = saveData.highestScore ?? 0;
  const prevFast = saveData.fastestClearTimeMs ?? null;

  if (score > prevHigh) saveData.highestScore = score;
  if (prevFast == null || timeMs < prevFast) saveData.fastestClearTimeMs = timeMs;

  localStorage.setItem(saveKey, JSON.stringify(saveData));
}

function wipeSurvivalRunState() {
  // wipe inventory + progress
  save.inventory = [];
  save.collected = {};
  save.equippedSlot = null;

  save.survival = {
    keySpawned: false,
    keyFound: false,
    bossPlacements: {},
    bossesDefeated: {},
    weaponUnlocked: false
  };

  clearDynamicRoomContent();
  clearAllHotspotItems?.(); 
  removeKeyFromAllHotspots?.();

  saveGame();
  renderInventory();
}

//survival base
function initSurvivalBase() {
  wipeSurvivalRunState();

  playerHP = playerMaxHP;
  updatePlayerHPUI();

  bunnyShownThisRun = false;
  dialogueLocked = false;
  isPaused = false;
  hidePauseOverlay();
  closeOverlay();

  currentRoomID = "startingBedroom";

  const eye = document.getElementById("eyeOverlay");
  if (eye) eye.style.display = "none";

  randomizeSurvivalLayoutNewRun();
  placeSurvivalItemsNewRun();
  removeKeyFromAllHotspots();

  save.survival = save.survival || {};
  save.survival.keySpawned = false;
  save.survival.keyFound = false;
  saveGame();

  pickAndPlaceSurvivalBossesNewRun();

  hideSurvivalTimerUI();
  stopSurvivalTimer();

  renderRoom();

  startDialogue(
    "survival_start_bedroom",
    DIALOGUES.survival_start_bedroom,
    () => {
      startSurvivalTimer();
    }
  );
}


if (mode === "survival") {
  clearDynamicRoomContent();
  initSurvivalBase();
  bindArrowControlsOnce();
}

// Pause menu bindings
const pauseButton = document.querySelector("#pauseButton");
const pauseOverlay = document.querySelector("#pauseOverlay");
const resumeBtn = document.querySelector("#resume");
const restartBtn = document.querySelector("#restart");
const quitBtn = document.querySelector("#quit");

if (pauseButton && !pauseButton.dataset.bound) {
  pauseButton.dataset.bound = "1";
  pauseButton.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePause();
  });
}

if (pauseOverlay && !pauseOverlay.dataset.bound) {
  pauseOverlay.dataset.bound = "1";
  pauseOverlay.addEventListener("click", (e) => {
    e.stopPropagation();
    resumeGame();
  });

  const pauseMenu = document.querySelector("#pauseMenu");
  if (pauseMenu) {
    pauseMenu.addEventListener("click", (e) => e.stopPropagation());
  }
}

if (resumeBtn && !resumeBtn.dataset.bound) {
  resumeBtn.dataset.bound = "1";
  resumeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resumeGame();
  });
}

if (restartBtn && !restartBtn.dataset.bound) {
  restartBtn.dataset.bound = "1";
  restartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resumeGame();

    if (mode === "story") {
      resetStoryRun();
    } else {
      wipeSurvivalProgress();
      window.location.reload();
    }
  });
}

if (quitBtn && !quitBtn.dataset.bound) {
  quitBtn.dataset.bound = "1";
  quitBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (mode === "survival") {
      wipeSurvivalProgress();
    }

    window.location.href = "MainMenu.html";
  });
}

// toggles pause
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") togglePause();
});