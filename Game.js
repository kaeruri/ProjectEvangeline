
const mode = localStorage.getItem("gameMode");

const Rooms = {

    startingBedroom: {
        bg: "Assets/ProjectEvangelineBedroomPOV.png",
        exits: {
            left: {}
        },
        hotspots: [{
            id: "drawerR1",
            overlay: "drawer",
            left: 84,
            top: 62,
            width: 13,
            height: 10,
            rotate: 22
        },
        {
            id: "drawerL1",
            overlay: "drawer",
            left: 22,
            top: 43,
            width: 4.5,
            height: 5,
            rotate: 165
        },
        {   id: "drawerL2",
            overlay: "drawer",
            left: 22,
            top: 50,
            width: 5,
            height: 4,
            rotate: 160
        },
        {   id: "drawerL3",
            overlay: "drawer",
            left: 22,
            top: 56,
            width: 5,
            height: 4.5,
            rotate: 155
        },
        {   id: "drawerR2",
            overlay: "drawer",
            left: 76,
            top: 62.5,
            width: 6,
            height: 3,
            rotate: 27
        },
        {
            id: "drawerR3",
            overlay: "drawer",
            left: 77,
            top: 39.5,
            width: 5,
            height: 3,
            rotate: 12
        },
        {   id: "drawerR4",
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
        }
    },

    diningArea: {
        bg: "Assets/ProjectEvangelineDiningArea.png",
        exits: {
            left: {},
            right: {}
        }
    },

    kitchen: {
        bg: "Assets/ProjectEvangelineKitchen.png",
        exits: {
            back: {},
            right: {}
        }
    },

    toilet: {
        bg: "Assets/ProjectEvangelineToilet.png",
        exits: {
            left: {}
        }
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
        }
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

const overlayImages = {
  drawer: "Assets/ProjectEvangelineDrawer.png",
  cabinet: "Assets/ProjectEvangelineCabinet.png"
};

function openOverlay(imageSrc) {
  overlayImage.src = imageSrc;
  overlay.classList.remove("hidden");
}

function closeOverlay() {
  overlay.classList.add("hidden");
  overlayImage.src = "";
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
      openOverlay(imageSrc);
    });

    hotspotsContainer.appendChild(hotspotDiv);
  });

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