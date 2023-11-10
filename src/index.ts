import { Scene2D, View2D } from '@motion-canvas/2d';
import {
  createSceneMetadata,
  DescriptionOf,
  ThreadGeneratorFactory,
} from '@motion-canvas/core/lib/scenes';

export function makeScene3D(
  runner: ThreadGeneratorFactory<View3D>,
): DescriptionOf<Scene3D> {
  return {
    klass: Scene2D,
    config: runner,
    stack: new Error().stack,
    meta: createSceneMetadata(),
  };
}
