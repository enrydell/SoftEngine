import { Vector3 } from "@babylonjs/core";

export class Mesh {
  Position: Vector3;
  Rotation: Vector3;
  Vertices: Vector3[];

  constructor(public name: string, verticesCount: number) {
    this.Vertices = new Array(verticesCount);
    this.Rotation = Vector3.Zero();
    this.Position = Vector3.Zero();
  }
}