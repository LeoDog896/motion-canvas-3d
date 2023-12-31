import { makeScene2D, useScene2D } from "@motion-canvas/2d";
import { ThreeCanvas, axisAngle } from "../../src";

import * as THREE from "three";
import { easeInOutCubic, tween, waitFor } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // Create your animations here

  const { x: canvasWidth, y: canvasHeight } = useScene2D().getSize();

  const c = new ThreeCanvas({ canvasWidth, canvasHeight });

  c.camera.position([0, 0, -2]);
  c.camera.quaternion([1, 0, 0, 0]);

  const [box] = c.push(
    new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: "white" }),
    ),
  );

  box.position([0, 0, 2]);

  view.add(c);

  c.threeScene.background = new THREE.Color("rgb(14, 14, 14)");

  c.create(() => {
    const light = new THREE.DirectionalLight("green", 1.0);
    light.position.set(-5, -5, -5);
    light.lookAt(new THREE.Vector3(0, 0, 0));
    return light;
  });

  c.create(() => {
    const light = new THREE.DirectionalLight("blue", 1.0);
    light.position.set(5, 5, -5);
    light.lookAt(new THREE.Vector3(0, 0, 0));
    return light;
  });

  yield* box.position([-2, -2, 2], 0.5);
  yield* box.position([2, -2, 2], 0.5);
  yield* box.position([2, 2, 2], 0.5);
  yield* box.position([-2, 2, 2], 0.5);
  yield* box.position([0, 0, 2], 0.5);

  yield* c.camera.position([0, 0, 0], 1);
  yield* c.camera.position([0, -2, -2], 1);
  yield* tween(1.0, (t) => {
    c.camera.quaternion(
      axisAngle(new THREE.Vector3(0, 0, 1), (Math.PI / 8) * easeInOutCubic(t)),
    );
  });
  yield* tween(1.0, (t) => {
    box.quaternion(
      axisAngle(new THREE.Vector3(0, 1, 0), Math.PI * easeInOutCubic(t)),
    );
  });

  yield* tween(1.0, (t) => {
    c.camera.quaternion(
      axisAngle(
        new THREE.Vector3(0, 0, 1),
        (Math.PI / 8) * easeInOutCubic(1.0 - t),
      ),
    );

    box.quaternion(
      axisAngle(new THREE.Vector3(0, 1, 0), Math.PI * easeInOutCubic(1.0 - t)),
    );

    c.camera.position([0, -2 * (1 - easeInOutCubic(t)), -2]);
  });

  yield* waitFor(1);
});
