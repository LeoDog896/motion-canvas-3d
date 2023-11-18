import { Node, NodeProps } from "@motion-canvas/2d";
import { SimpleSignal, createSignal } from "@motion-canvas/core/lib/signals";
import * as THREE from "three";

export interface ThreeCanvasProps extends NodeProps {
  canvasWidth: number;
  canvasHeight: number;
  fov?: number;
  near?: number;
  far?: number;
}

/**
 * Converts an axis and angle to a quaternion.
 * @param axis The axis to rotate around.
 * @param angle The angle to rotate by.
 * @returns The quaternion.
 */
export function axisAngle(
  axis: THREE.Vector3,
  angle: number,
): [number, number, number, number] {
  const st = Math.sin(angle / 2);
  const ct = Math.cos(angle / 2);

  return [ct, st * axis.x, st * axis.y, st * axis.z];
}

export class ThreeCanvas extends Node {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;

  /**
   * The actual three.js scene itself.
   * If you need to do something that isn't supported by this class,
   * you can use this property to access the scene directly.
   *
   * However, this may cause mutations, and any features should be requested
   * as a feature request.
   */
  public readonly threeScene: THREE.Scene;
  public readonly camera: SignalableObject3D;
  public readonly threeCamera: THREE.PerspectiveCamera;
  public readonly objects: SignalableObject3D[] = [];

  constructor(props: ThreeCanvasProps) {
    super(props);

    this.canvas = document.createElement("canvas");
    this.canvas.width = props.canvasWidth;
    this.canvas.height = props.canvasHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });

    this.threeScene = new THREE.Scene();
    this.threeCamera = new THREE.PerspectiveCamera(
      props.fov ?? 75,
      this.canvas.width / this.canvas.height,
      props.near ?? 0.1,
      props.far ?? 1000.0,
    );

    this.camera = signalableObject3D(this.threeCamera);

    this.renderer.clear(true);
  }

  addDynamicObject(o: SignalableObject3D) {
    this.objects.push(o);
  }

  push(...object: THREE.Object3D[]) {
    const signalable = object.map((o) => signalableObject3D(o));
    for (const obj of signalable) {
      this.threeScene.add(obj.object);
      this.addDynamicObject(obj);
    }
    return signalable;
  }

  create(...objectGenerators: (() => THREE.Object3D)[]) {
    return this.push(...objectGenerators.map((g) => g()));
  }

  render(context: CanvasRenderingContext2D): void {
    for (const obj of [this.camera, ...this.objects]) {
      obj.update();
    }

    this.renderer.render(this.threeScene, this.threeCamera);

    context.drawImage(
      this.canvas,
      this.position.x() - this.canvas.width / 2,
      this.position.y() - this.canvas.height / 2,
    );
  }
}

type Vector3 = [x: number, y: number, z: number];
type Quaternion = [x: number, y: number, z: number, w: number];

export interface SignalableObject3D {
  position: SimpleSignal<Vector3, void>;
  scale: SimpleSignal<Vector3, void>;
  quaternion: SimpleSignal<Quaternion, void>;
  object: THREE.Object3D;
  update(): void;
}

export function signalableObject3D(object: THREE.Object3D): SignalableObject3D {
  const positionSignal = createSignal<Vector3>([object.position.x, object.position.y, object.position.z]);
  const scaleSignal = createSignal<Vector3>([object.scale.x, object.scale.y, object.scale.z]);
  const quaternionSignal = createSignal<Quaternion>([object.quaternion.x, object.quaternion.y, object.quaternion.z, object.quaternion.w]);

  const update = () => {
    object.position.set(...positionSignal());
    object.scale.set(...scaleSignal());
    object.quaternion.set(...quaternionSignal());
  };

  return {
    object,
    position: positionSignal,
    scale: scaleSignal,
    quaternion: quaternionSignal,
    update,
  };
}
