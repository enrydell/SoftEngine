import { Vector3 } from "@babylonjs/core";

export class Camera {
  Position: Vector3;
  Target: Vector3;

  constructor() {
    this.Position = Vector3.Zero();
    this.Target = Vector3.Zero();
  }
}