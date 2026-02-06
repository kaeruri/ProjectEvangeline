const storyRooms = {

    startingBedroom: {
        bg: "Assets/ProjectEvangelineBedroomPOV.png",
        exits: {
            left: "livingRoom"}
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
        bg: "ProjectEvangelineToilet.png",
        exits: {
            left: "kitchen"
        }
    },

    exitHallway: {
        bg: "ProjectEvangelineExit.png",
        exits: {
            left: "livingRoom",
            right: "parentsBedroom",
            forward: "EXIT"
        }
    },

    parentsBedroom: {
        bg: "ProjectEvangelineParentsBedroom.png",
        exits: {
            back: "exitHallway"
        }
    }

};





const mode = localStorage.getItem("gameMode");

if (mode === "story") {

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