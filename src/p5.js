/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

let handPose;
let video;
var hands = [];

function preload() {
  // Load the handPose model
  const options = {
    maxHands: 2,
    flipped: false,
    runtime: "tfjs",
    modelType: "full",
    detectorModelUrl: undefined, //default to use the tf.hub model
    landmarkModelUrl: undefined, //default to use the tf.hub model
  };
  handPose = ml5.handPose(options);
}

function setup() {
  let cnv = createCanvas(640, 480);
  cnv.id("canvas");
  cnv.parent("canvasContainer");

  // Create the webcam video and hide it
  video = createCapture(video);
  video.size(640, 480);
  video.hide();

  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      text(j, keypoint.x + 10, keypoint.y); // Label the keypoints with their index`
      circle(keypoint.x, keypoint.y, 10);
    }
  }
  window.sharedData = { handPredictions: hands };
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}
