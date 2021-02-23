export const useSpeak = () => {
  const speakHuman = (speaker, filename, send) => {
    let audio = new Audio(
      require(`@assets/audio/${speaker}/${filename}.mp3`)
    );
    audio.play();
    send('PLAY')
    audio.addEventListener('ended', () => {
      send('END')
    })
  }

  const speakSynthetic = (speakerId = 3) => {
    if (!("speechSynthesis" in window)) {
      message.value = "Sorry, your device do not know how to talk";
      return;
    }
    let text = new SpeechSynthesisUtterance();
    let voices = window.speechSynthesis.getVoices();
    text.voice = voices[speakerId]; // Note: some voices don't support altering params
    text.voiceURI = "native";
    text.volume = 1; // 0 to 1
    text.rate = 0.7; // 0.1 to 10
    text.pitch = 1; //0 to 2
    text.text = questions.value[wordIndex.value].letters;
    text.lang = "en-US";
    window.speechSynthesis.speak(text);
  }

  return {
    speakHuman,
    speakSynthetic
  }
}