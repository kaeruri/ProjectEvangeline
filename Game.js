localStorage.removeItem("save_story");

const mode = localStorage.getItem("gameMode");
let audioUnlocked = false;
let pendingJumpscare = null;


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
        {   id: "SdrawerL2",
            overlay: "drawer",
            left: 22,
            top: 50,
            width: 5,
            height: 4,
            rotate: 160
        },
        {   id: "SdrawerL3",
            overlay: "drawer",
            left: 22,
            top: 56,
            width: 5,
            height: 4.5,
            rotate: 155
        },
        {   id: "SdrawerR2",
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
        {   id: "SdrawerR4",
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
        {   id:"LcabinetL2",
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
            height: 7.5,
            items: [{
                id: "needle",
                img: "Assets/ProjectEvangelineNeedle.png",
                left: 35,
                top: 68,
                width: 15
            }]
        },
        {   id: "Dcabinet2",
            overlay: "cabinet",
            left: 35.5,
            top: 11,
            width: 7,
            height: 12
        },
        {   id: "Dcabinet3",
            overlay: "cabinet",
            left: 54,
            top: 11,
            width: 7,
            height: 12
        },
        {   id: "Ddrawer1",
            overlay: "drawer",
            left: 48.5,
            top: 35.5,
            width: 5,
            height: 3
        },
        {   id: "Ddrawer2",
            overlay: "drawer",
            left: 60.5,
            top: 35.5,
            width: 5,
            height: 3
        },
        {   id: "Ddrawer3",
            overlay: "drawer",
            left: 37.5,
            top: 35.5,
            width: 5.5,
            height: 3
        },
        {   id: "Ddrawer4",
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
        boss: { 
            id: "boss1",
            name: "FEMALE BOSS",
            maxHP: 500,
            img: "Assets/Boss1.png",
            jumpscareImg: "Assets/Boss1jumpscare.png",
            attackDamage: 3
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
        {   id: "Kcabinet2",
            overlay: "cabinet",
            left: 31.5,
            top: 12,
            width: 5,
            height: 18,
            rotate: 1.5
        },
        {   id: "Kcabinet3",
            overlay: "cabinet",
            left: 45,
            top: 14,
            width: 8,
            height: 15,
            rotate: -1
        },
        {   id: "Kcabinet4",
            overlay: "cabinet",
            left: 49,
            top: 48,
            width: 10,
            height: 20,
            rotate: 4
        },
        {   id: "Kcabinet5",
            overlay: "cabinet",
            left: 13,
            top: 52,
            width: 10,
            height: 10,
            rotate: -5
        },
        {   id: "Kdrawer1",
            overlay: "drawer",
            left: 13,
            top: 46,
            width: 10,
            height: 4,
            rotate: -4,
            items: [{
                id: "knife",
                img: "Assets/ProjectEvangelineKnife.png",
                left: 53,
                top: 20,
                width: 20
            },
            {   id: "bandages",
                img: "Assets/ProjectEvangelineBandages.png",
                left: 22,
                top: 50,
                width: 20
            }]

        },
        {   id: "Kdrawer2",
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
        boss: {
            id: "boss2",
            name: "MALE BOSS",
            maxHP: 500,
            img: "Assets/Boss2.png",
            jumpscareImg: "Assets/Boss2jumpscare.png",
            attackDamage: 5
        },
        hotspots: [{
            id: "Tcabinet1",
            overlay: "cabinet",
            left: 53.5,
            top: 55.5,
            width: 10,
            height: 21,
            rotate: 14,
            items:[{
                id: "bandages",
                img: "Assets/ProjectEvangelineBandages.png",
                left: 51,
                top: 63,
                width: 20
            },
            {   id: "medkit",
                img: "Assets/ProjectEvangelineMedkit.png",
                left: 30,
                top: 60,
                width: 20
            }]
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
        boss: {
            id: "boss3",
            name: "FINAL BOSS",
            maxHP: 1000,
            img: "Assets/Boss3.png",
            jumpscareImg: "Assets/Boss3jumpscare.png",
            attackDamage: 6
        }
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
            items: [{
                id: "key",
                img: "Assets/keyreplacement.png",
                left: 53,
                top: 20,
                width: 15
            }]
        },
        {   id: "Pdrawer2",
            overlay: "drawer",
            left: 19.5,
            top: 54,
            width: 4,
            height: 3,
            rotate: -4
        },
        {   id: "Pdrawer3",
            overlay: "drawer",
            left: 19.5,
            top: 58,
            width: 4,
            height: 3,
            rotate: -4
        },
        {   id: "Pdrawer4",
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
    damage: 5
  },
  scissors: {
    type: "weapon",
    damage: "3"
  },
  needle: {
    type: "weapon",
    damage: 2
  }
};

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




//arrows appearance
function updateArrows() {
  const currentRoom = Rooms[currentRoomID];

  const leftArrow = document.querySelector("#arrowLeft");
  const rightArrow = document.querySelector("#arrowRight");
  const backArrow = document.querySelector("#arrowBackward");
  const forwardArrow = document.querySelector("#arrowForward");

  if (currentRoom.exits.left) {
    leftArrow.classList.remove("hidden");
  } else {
    leftArrow.classList.add("hidden");
  }

  if (currentRoom.exits.right) {
    rightArrow.classList.remove("hidden");
  } else {
    rightArrow.classList.add("hidden");
  }

  if (currentRoom.exits.back) {
    backArrow.classList.remove("hidden");
  } else {
    backArrow.classList.add("hidden");
  }

  if (currentRoom.exits.forward) {
    forwardArrow.classList.remove("hidden");
  } else {
    forwardArrow.classList.add("hidden");
  }

  if (currentRoom.boss) {
    leftArrow.classList.add("hidden");
    rightArrow.classList.add("hidden");
    backArrow.classList.add("hidden");
    forwardArrow.classList.add("hidden");
  }
}


//inventory
let save = JSON.parse(localStorage.getItem("save_story")) || {
  inventory: [],
  collected: {},
  equippedSlot: null
};

save.inventory = save.inventory || [];
if (save.equippedSlot === undefined) save.equippedSlot = null;
save.collected = save.collected || {};


function saveGame() {
  localStorage.setItem("save_story", JSON.stringify(save));
}

function collectItem(item) {
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

  save.inventory.push({
    id: item.id,
    img: item.img,
    type: def.type,
    heal: def.heal,
    damage: def.damage
  });

  saveGame();
  renderInventory();
  showToast("Item picked up");
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
  if (e.key.toLowerCase() === "e") {
    useEquippedItem();
  }
});

//fights (boss)
function attackBoss() {
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

  showToast(`Hit for ${item.damage}`);

  if (currentBossHP === 0) {
    onBossDefeated(currentRoom.boss);
  }
  console.log("ATTACK");

}

function onBossDefeated(boss) {
  showToast(`${boss.name} defeated`);

  bossHP.classList.add("hidden");
  bossImage.classList.add("hidden");

  stopWhispers();

  const room = Rooms[currentRoomID];
  delete room.boss;

  save.bosses = save.bosses || {};
  save.bosses[boss.id] = true;
  saveGame();

  updateArrows();
}


document.addEventListener("click", (e) => {
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

    const img = document.createElement("img");
    img.src = item.img;
    img.classList.add("overlay-item");

    img.style.left = item.left + "%";
    img.style.top = item.top + "%";
    img.style.width = item.width + "%";

    img.addEventListener("click", (e) => {
      e.stopPropagation();
      collectItem(item);
      img.remove();
    });

    overlayItems.appendChild(img);
  });
}


function openOverlay(imageSrc, hotspot) {
  overlayImage.src = imageSrc;
  overlay.classList.remove("hidden");
  renderOverlayItems(hotspot);
}


function closeOverlay() {
  overlay.classList.add("hidden");
  overlayImage.src = "";
  overlayItems.innerHTML = "";
}


overlay.addEventListener("click", closeOverlay);

function renderHotspots() {
  const hotspotsContainer = document.querySelector("#hotspots");
  hotspotsContainer.innerHTML = "";

  const room = Rooms[currentRoomID];
  const hotspots = room.hotspots || [];

  hotspots.forEach(hotspot => {
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
  boss2: { left: "50%", top: "70%", width: "35vw"},
  boss3: { left: "50%", top: "60%", width: "20vw"}
};

const bossImage = document.querySelector("#bossImage");


//clear bosses
function clearAllBosses() {
  for (const room of Object.values(Rooms)) {
    if (room.boss) {
      delete room.boss;
    }
  }

  save.bosses = {};
  save.jumpscaresPlayed = {};
  saveGame();
}


function renderRoom() {
  const currentRoom = Rooms[currentRoomID];

  currentBGimg.src = currentRoom.bg;

  updateArrows();
  renderHotspots();

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

    if (currentRoom.boss) startBossFightLoop();
    else stopBossFightLoop();


    save.jumpscaresPlayed = save.jumpscaresPlayed || {};

    if (!save.jumpscaresPlayed[currentRoom.boss.id]) {
      playJumpscare(currentRoom.boss.jumpscareImg);
      save.jumpscaresPlayed[currentRoom.boss.id] = true;
      saveGame();
    }
  } else {
    bossHP.classList.add("hidden");
    bossImage.classList.add("hidden");
  }

  if (audioUnlocked) {
    if (currentRoom.boss) startWhispers();
    else stopWhispers();
  }
}





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

    renderRoom();

    const leftArrow = document.querySelector("#arrowLeft");
    leftArrow.addEventListener("click", () => {
      const currentRoom = Rooms[currentRoomID];
      const nextRoomID = currentRoom.exits.left;

      if (!nextRoomID) return;

      walkSFX.currentTime = 0;
      walkSFX.play();

        setTimeout(() => {
          walkSFX.pause();
          walkSFX.currentTime = 0;
        },  2150);

      currentRoomID = nextRoomID;
      renderRoom();
    });

    const rightArrow = document.querySelector("#arrowRight")
    rightArrow.addEventListener("click", () => {
        const currentRoom = Rooms[currentRoomID];
        const nextRoomID = currentRoom.exits.right;

        if (!nextRoomID) return;

        walkSFX.currentTime = 0;
        walkSFX.play();

        setTimeout(() => {
          walkSFX.pause();
          walkSFX.currentTime = 0;
        }, 2150);

        currentRoomID = nextRoomID
        renderRoom();
    });

    const backArrow = document.querySelector("#arrowBackward")
    backArrow.addEventListener("click", () => {
        const currentRoom = Rooms[currentRoomID];
        const nextRoomID = currentRoom.exits.back;

        if (!nextRoomID) return;

        walkSFX.currentTime = 0;
        walkSFX.play();

        setTimeout(() => {
          walkSFX.pause();
          walkSFX.currentTime = 0;
        }, 2150);

        currentRoomID = nextRoomID
        renderRoom();
    });

    const forwardArrow = document.querySelector("#arrowForward")
    forwardArrow.addEventListener("click", () => {
        const currentRoom = Rooms[currentRoomID];
        const nextRoomID = currentRoom.exits.forward;

        if (!nextRoomID) return;

        currentRoomID = nextRoomID
        renderRoom();
    });

}

if (mode === "survival") {
  clearAllHotspotItems();
  clearAllBosses();
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

const bgm = new Audio("Audios/AreYouAloneBGM.mp3");
bgm.loop = true;
bgm.volume = 0.25;

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