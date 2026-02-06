
const mode = localStorage.getItem("gameMode");

if (mode === "story") {
    const storyRooms = {

        startingBedroom: {
            bg: "Assets/ProjectEvangelineBedroomPOV.png",
            exits: {
                left: "livingRoom"
            }
        },

        livingRoom: {
            bg: "Assets/ProjectEvangelineLivingRoom.png",
            exits: {
                back: "startingBedroom",
                left: "diningArea",
                right: "exitHallway"
            }
        },

        diningArea: {
            bg: "Assets/ProjectEvangelineDiningArea.png",
            exits: {
                left: "kitchen",
                right: "livingRoom"
            }
        },

        kitchen: {
            bg: "Assets/ProjectEvangelineKitchen.png",
            exits: {
                back: "diningArea",
                right: "toilet"
            }
        },

        toilet: {
            bg: "Assets/ProjectEvangelineToilet.png",
            exits: {
                left: "kitchen"
            }
        },

        exitHallway: {
            bg: "Assets/ProjectEvangelineExit.png",
            exits: {
                left: "livingRoom",
                right: "parentsBedroom"
            }
        },

        parentsBedroom: {
            bg: "Assets/ProjectEvangelineParentsBedroom.png",
            exits: {
                back: "exitHallway"
            }
        },

        EXIT: {
            bg: "Assets/ProjectEvangelineLogin.png",
            exits: {}
        }


    };

    const currentBGimg = document.querySelector('#GameBackground');
    let currentRoomID = "startingBedroom"

    function updateArrows() {
      const currentRoom = storyRooms[currentRoomID];

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

    function renderRoom() {
      const currentRoom = storyRooms[currentRoomID];
      currentBGimg.src = currentRoom.bg;
      updateArrows();
    }

    renderRoom();

    const leftArrow = document.querySelector("#arrowLeft");
    leftArrow.addEventListener("click", () => {
    const currentRoom = storyRooms[currentRoomID];
    const nextRoomID = currentRoom.exits.left;

    if (!nextRoomID) return;

    currentRoomID = nextRoomID;
    renderRoom();
    });

    const rightArrow = document.querySelector("#arrowRight")
    rightArrow.addEventListener("click", () => {
        const currentRoom = storyRooms[currentRoomID];
        const nextRoomID = currentRoom.exits.right;

        if (!nextRoomID) return;
        currentRoomID = nextRoomID
        renderRoom();
    });

    const backArrow = document.querySelector("#arrowBackward")
    backArrow.addEventListener("click", () => {
        const currentRoom = storyRooms[currentRoomID];
        const nextRoomID = currentRoom.exits.back;

        if (!nextRoomID) return;

        currentRoomID = nextRoomID
        renderRoom();
    });

    const forwardArrow = document.querySelector("#arrowForward")
    forwardArrow.addEventListener("click", () => {
        const currentRoom = storyRooms[currentRoomID];
        const nextRoomID = currentRoom.exits.forward;

        if (!nextRoomID) return;

        currentRoomID = nextRoomID
        renderRoom();
    });

}


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