class AudioManager {
  constructor() {
    // create an audio object
    this.startSound = new Audio("assets/audio/prompt1.mp3");
    this.stopSound = new Audio("assets/audio/prompt1.mp3");
    this.scrollSound = new Audio("assets/audio/lotter1.mp3");
    this.promptSound = new Audio("assets/audio/prompt2.mp3");
    // loop
    this.scrollSound.loop = true
  }

  // play start sound
  playStartSound() {
    this.startSound.currentTime = 0; // reset to the beginning
    this.startSound.play();
  }

  // play stop sound
  playStopSound() {
    this.stopSound.currentTime = 0;
    this.stopSound.play();
  }

  // play prompt sound
  playPromptSound() {
    this.promptSound.currentTime = 0;
    this.promptSound.play();
  }

  // play scroll sound
  playScrollSound() {
    this.scrollSound.play();
  }

  // stop scroll sound
  stopScrollSound() {
    this.scrollSound.pause();
  }
}


export default new AudioManager()