import { Vector3 } from "@babylonjs/core";
import { Camera } from "./modules/Camera.js";
import { Device } from "./modules/Device.js";
import { Mesh } from "./modules/Mesh.js";

var canvas: HTMLCanvasElement;
var device: Device;
var meshes: Mesh[] = [];
var camera: Camera;
var rendersManyMeshes = false; // Flag to determine if we are rendering many meshes or just one

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
  device = new Device(canvas);

  if (rendersManyMeshes) {
    spawnThousandsOfCubes();
  } else {
    spawnACube();
  }

  // Calling the HTML5 rendering loop
  requestAnimationFrame(drawingLoop);
}

// Rendering loop handler
function drawingLoop(currentTime: number) {
  // Calculate FPS
  calculateFPS(currentTime);

  // Clearing the back buffer with black color
  device.clear();

  // Rotate each mesh on the CPU;
  for (let i = 0; i < meshes.length; i++) {
    var mesh = meshes[i];
    if (mesh) {
      mesh.Rotation.x += 0.01;
      mesh.Rotation.y += 0.01;
    }
  }

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

function spawnACube() {
  var mesh = new Mesh("Cube", 8);
  meshes.push(mesh);
  camera = new Camera();

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
}

function spawnThousandsOfCubes() {
  camera = new Camera();
  camera.Position = new Vector3(0, 0, -100); // Pull camera back to view the field
  camera.Target = new Vector3(0, 0, 0);

  // Define cube vertex template
  var cubeVertices = [
    new Vector3(-1, 1, 1),
    new Vector3(1, 1, 1),
    new Vector3(-1, -1, 1),
    new Vector3(-1, -1, -1),
    new Vector3(-1, 1, -1),
    new Vector3(1, 1, -1),
    new Vector3(1, -1, 1),
    new Vector3(1, -1, -1)
  ];

  // Spawn 2,000 Cubes
  for (let i = 0; i < 2000; i++) {
    var mesh = new Mesh(`Cube_${i}`, 8);
    mesh.Vertices = cubeVertices;

    // Spread cubes randomly in a 3D grid
    mesh.Position = new Vector3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );

    meshes.push(mesh);
  }
}