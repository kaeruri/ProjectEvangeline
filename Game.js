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
let save = JSON.parse(localStorage.getItem("save_story")) || {
  inventory: [],
  collected: {},
  equippedSlot: null
};

function saveGame() {
  localStorage.setItem("save_story", JSON.stringify(save));
}

save.story = save.story || {
  currentPhase: PHASES.BEDROOM,
  completedPhases: {},
  dialoguesPlayed: {},
  lastRoomID: null
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
  if (dialogueLocked) return false;

  const phase = save.story.currentPhase;

  // Phase 1: bedroom → only left
  if (phase === PHASES.BEDROOM) {
    return direction === "left";
  }

  // Phase 2: living room → only left
  if (phase === PHASES.LIVING_ROOM) {
    return direction === "left";
  }

  // Phase 3: dining → locked until needle, then only left
  if (phase === PHASES.DINING_NEEDLE) {
    if (!save.collected["needle"]) return false;
    return direction === "left";
  }

  // Phase 4: AFTER boss1 (item hunt)
  if (phase === PHASES.BOSS_1) {
    const hasItems =
      save.collected["knife"] &&
      save.collected["bandages"];

    if (!hasItems) return false;  
    return direction === "right";  
  }

  // Phase 5: Boss2 fight → no movement
  if (phase === PHASES.BOSS_2) {
    return false;
  }

    // FREE ROAM — allow movement
    if (phase === PHASES.FREE_ROAM) {
    return true;
    }

  return true;
}

function setupPhaseContent() {
  if (mode !== "story") return;

  const phase = save.story.currentPhase;


  if (phase === PHASES.BOSS_1) {
    const kitchen = Rooms.kitchen;

    if (!kitchen.boss && !save.bosses?.boss1) {
      kitchen.boss = {
        id: "boss1",
        name: "???",
        maxHP: 40,
        attackDamage: 8,
        img: "Assets/Boss1.png",
        jumpscareImg: "Assets/Boss1Jumpscare.png"
      };
    }
  }


  if (phase === PHASES.FREE_ROAM) {
    const exitHallway = Rooms.exitHallway;

    if (!exitHallway.boss && !save.bosses?.boss3) {
      exitHallway.boss = {
        id: "boss3",
        name: "???",
        maxHP: 100,
        attackDamage: 12,
        img: "Assets/Boss3.png",
        jumpscareImg: "Assets/Boss3Jumpscare.png"
      };
    }
  }
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
  if (dialogueHint) dialogueHint.textContent = "(click anywhere to continue)";
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


document.addEventListener(
  "click",
  (e) => {
    if (!dialogueLocked) return;

    e.preventDefault();
    e.stopPropagation();

    advanceDialogue();
  },
  true
);

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

  ]
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



//inventory

save.inventory = save.inventory || [];
if (save.equippedSlot === undefined) save.equippedSlot = null;
save.collected = save.collected || {};

function collectItem(item) {
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
  dialogueLocked = true;

  // hide UI
  bossHP.classList.add("hidden");
  bossImage.classList.add("hidden");

  // optional: fade screen / red overlay
  document.body.classList.add("dead");

  // disable movement
  stopBossFightLoop();

  // YOU decide what happens next:
  // - reload page
  // - show restart button
  // - return to menu
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

//completed screen
function showCompletedScreen() {
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

//animations
function playEyeOpeningAnimation(onComplete = null) {
  const overlay = document.getElementById("eyeOverlay");
  if (!overlay) return;

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



function renderRoom() {
  if (mode === "story") setupPhaseContent();

  const currentRoom = Rooms[currentRoomID];

  currentBGimg.src = currentRoom.bg;

  updateArrows();
  renderHotspots();

  if (mode === "story") handleRoomEnterDialogue();

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

    save.story.lastRoomID = null;
    saveGame();

    startPhase(save.story.currentPhase || PHASES.BEDROOM);
    renderRoom();

    // Only play if first phase + first room
    if (
    save.story.currentPhase === PHASES.BEDROOM &&
    currentRoomID === "startingBedroom"
    ) {
    playEyeOpeningAnimation();
    }

    handlePhaseProgression();


    const leftArrow = document.querySelector("#arrowLeft");
    leftArrow.addEventListener("click", () => {
      if (!canMove("left")) return;

      const prevRoomID = currentRoomID;
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
      handlePhaseProgression(prevRoomID);
      renderRoom();
    });

    const rightArrow = document.querySelector("#arrowRight")
    rightArrow.addEventListener("click", () => {
        if (!canMove("right")) return;

        const prevRoomID = currentRoomID;
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
        handlePhaseProgression(prevRoomID);
        renderRoom();
    });

    const backArrow = document.querySelector("#arrowBackward")
    backArrow.addEventListener("click", () => {
        if (!canMove("back")) return;

        const prevRoomID = currentRoomID;
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
        handlePhaseProgression(prevRoomID);
        renderRoom();
    });


    const forwardArrow = document.querySelector("#arrowForward");

    if (forwardArrow && !forwardArrow.dataset.bound) {
    forwardArrow.dataset.bound = "1";

    forwardArrow.addEventListener("click", () => {
        if (!canMove("forward")) return;

        const currentRoom = Rooms[currentRoomID];
        const nextRoomID = currentRoom?.exits?.forward;
        if (!nextRoomID) return;

        const prevRoomID = currentRoomID;
        currentRoomID = nextRoomID;

        // ENDING TRANSITION
        if (
        mode === "story" &&
        prevRoomID === "exitHallway" &&
        currentRoomID === "endingRoom"
        ) {
        stopBossFightLoop();       // safety
        stopWhispers();
        startPhase(PHASES.ENDING);
        } else {
        handlePhaseProgression(prevRoomID);
        }

        renderRoom();
    });
    }

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