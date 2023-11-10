import { Circle } from '@motion-canvas/2d';
import {makeScene3D} from "../../src"
import {waitFor} from '@motion-canvas/core/lib/flow';

export default makeScene3D(function* (view) {
  // Create your animations here
  view.add(<Circle x={0} y={0} size={50} fill="red" />);
  yield* waitFor(5);
});
