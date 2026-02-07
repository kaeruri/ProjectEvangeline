
const mode = localStorage.getItem("gameMode");

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
                id: "knife",
                img: "Assets/ProjectEvangelineKnife.png",
                left: 10,
                top: 10,
                width: 30
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
            rotate: -4

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
        hotspots: [{
            id: "Tcabinet1",
            overlay: "cabinet",
            left: 53.5,
            top: 55.5,
            width: 10,
            height: 21,
            rotate: 14
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
            rotate: -4
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

const currentBGimg = document.querySelector('#GameBackground');
let currentRoomID = "startingBedroom"

//arrows appearance
function updateArrows() {
  const currentRoom = Rooms[currentRoomID];

  let leftArrow = document.querySelector("#arrowLeft");
  let rightArrow = document.querySelector("#arrowRight");
  let backArrow = document.querySelector("#arrowBackward");
  let forwardArrow = document.querySelector("#arrowForward");

  if (currentRoom.exits["left"]) {
      leftArrow.classList.remove("hidden");
  } else {
      leftArrow.classList.add("hidden");
  }

  if (currentRoom.exits["right"]) {
      rightArrow.classList.remove("hidden");
  } else {
      rightArrow.classList.add("hidden");
  }

  if (currentRoom.exits["back"]) {
      backArrow.classList.remove("hidden");
  } else {
      backArrow.classList.add("hidden");
  }

  if (currentRoom.exits["forward"]) {
      forwardArrow.classList.remove("hidden");
  } else {
      forwardArrow.classList.add("hidden");
  }
}

//hotspots

const overlay = document.querySelector("#overlay");
const overlayImage = document.querySelector("#overlayImage");
const overlayItems = document.querySelector("#overlayItems");

// TEMP SAVE (story mode testing)
let save = JSON.parse(localStorage.getItem("save_story")) || {
  inventory: [],
  collected: {}
};

function saveGame() {
  localStorage.setItem("save_story", JSON.stringify(save));
}

function collectItem(item) {
  // mark as collected so it doesn't respawn
  save.collected[item.id] = true;

  // add to inventory (simple version for now)
  save.inventory.push({
    id: item.id,
    img: item.img
  });

  saveGame();
}

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
      openOverlay(imageSrc, hotspot);
    });

    hotspotsContainer.appendChild(hotspotDiv);
  });

}

//clear hotspots
function clearAllHotspotItems() {
  for (const room of Object.values(Rooms)) {
    room.hotspots?.forEach(h => delete h.items);
  }
}





//changing rooms
function renderRoom() {
  const currentRoom = Rooms[currentRoomID];
  currentBGimg.src = currentRoom.bg;
  updateArrows();
  renderHotspots();
}

//initial
renderRoom();

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
    if (mode === "arcade") {
  clearAllHotspotItems();
}

}

//SFX

const walkSFX = new Audio("Audios/Walkingsfx.mp3");
walkSFX.volume = 0.6;

//BGM

const bgm = new Audio("Audios/AreYouAloneBGM.mp3");
bgm.loop = true;
bgm.volume = 0.35;

const gate = document.getElementById("audioGate");

function unlockAudio() {
  bgm.play().catch(() => {});

  sessionStorage.setItem("audioUnlocked", "true");

  if (gate) gate.style.display = "none";

  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
  document.removeEventListener("touchstart", unlockAudio);
}

// If already unlocked this session, try to play + hide gate
if (sessionStorage.getItem("audioUnlocked") === "true") {
  bgm.play().catch(() => {});
  if (gate) gate.style.display = "none";
} else {
  // Need user gesture first
  document.addEventListener("click", unlockAudio);
  document.addEventListener("keydown", unlockAudio);
  document.addEventListener("touchstart", unlockAudio, { passive: true });
}