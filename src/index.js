import "./styles.css";
import Peaks from "peaks.js";
import { saveAs } from 'file-saver';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const options = {
  containers: {
    overview: document.getElementById("zoomview-container"),
    zoomview: document.getElementById("overview-container")
  },
  mediaElement: document.querySelector("audio"),
  webAudio: {
    audioContext: audioContext
  },
  multiChannel: false,
  logger: console.error.bind(console),
  height: 200,
  keyboard: true,
  nudgeIncrement: 0.1,
};

Peaks.init(options, function(err, peaks) {
  document.getElementById('play-button').addEventListener('click', function() {
    peaks.player.play();
  });

  document.getElementById('pause-button').addEventListener('click', function() {
    peaks.player.pause();
  });

  document.getElementById('markAyah-button').addEventListener('click', function() {
    let currentTime = peaks.player.getCurrentTime()
    peaks.points.add({ 
      time: currentTime,
      editable: true,
      labelText: `Ayah ${peaks.points.getPoints().length + 1}`
    })
  });

  document.getElementById('export-button').addEventListener('click', function() {
    let points = peaks.points.getPoints()
    console.log(points)
    let pointsObj = {}
    points.map((point, index) => {
      let time = point.time 
      pointsObj[index] = time
    })
    console.log(pointsObj)
    // TODO: get surah name and reciter! or atleast a hash of the audio file? have inputs so user types? link to source of recording file? do we have a server we could store the OG file in?
    let filename = "ayahs.json"
    let blob = new Blob([JSON.stringify(pointsObj)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);

  });
});

function handleFiles(event) {
	var files = event.target.files;
	document.getElementById("audio-source").setAttribute("src", URL.createObjectURL(files[0]));
	document.getElementById("audio").load();
}

document.getElementById("file-input").addEventListener("change", handleFiles, false);