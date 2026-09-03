import { Vector3 } from "@babylonjs/core";
import { Camera } from "./modules/Camera.js";
import { Device } from "./modules/Device.js";
import { Mesh } from "./modules/Mesh.js";

var canvas: HTMLCanvasElement;
var device: Device;
var mesh: Mesh;
var meshes: Mesh[] = [];
var camera: Camera;

// FPS tracking variables
var fpsElement: HTMLElement | null;
var previousTime = performance.now();
var frameCount = 0;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, false);
} else {
  init();
}

function init() {
  canvas = <HTMLCanvasElement>document.getElementById("frontBuffer");
  fpsElement = document.getElementById("fpsCounter");

  mesh = new Mesh("Cube", 8);
  meshes.push(mesh);
  camera = new Camera();
  device = new Device(canvas);

  mesh.Vertices[0] = new Vector3(-1, 1, 1);
  mesh.Vertices[1] = new Vector3(1, 1, 1);
  mesh.Vertices[2] = new Vector3(-1, -1, 1);
  mesh.Vertices[3] = new Vector3(-1, -1, -1);
  mesh.Vertices[4] = new Vector3(-1, 1, -1);
  mesh.Vertices[5] = new Vector3(1, 1, -1);
  mesh.Vertices[6] = new Vector3(1, -1, 1);
  mesh.Vertices[7] = new Vector3(1, -1, -1);

  camera.Position = new Vector3(0, 0, 10);
  camera.Target = new Vector3(0, 0, 0);

  // Calling the HTML5 rendering loop
  requestAnimationFrame(drawingLoop);
}

// Rendering loop handler
function drawingLoop(currentTime: number) {
  // Calculate FPS
  calculateFPS(currentTime);

  // Clearing the back buffer with black color
  device.clear();

  // rotating slightly the cube during each frame rendered
  mesh.Rotation.x += 0.005;
  mesh.Rotation.y += 0.005;

  // Doing the various matrix operations
  device.render(camera, meshes);
  // Flushing the back buffer into the front buffer
  device.present();

  // Calling the HTML5 rendering loop recursively
  requestAnimationFrame(drawingLoop);
}

function calculateFPS(currentTime: number) {
  // Calculate FPS every second
  frameCount++;
  var delta = currentTime - previousTime;

  if (delta >= 1000) {
    var fps = Math.round((frameCount * 1000) / delta);
    if (fpsElement) {
      fpsElement.textContent = `FPS: ${fps}`;
    }
    previousTime = currentTime;
    frameCount = 0;
  }
}