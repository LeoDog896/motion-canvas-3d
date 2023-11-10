import { View2D, View2DProps } from '@motion-canvas/2d';

export interface View3DProps extends View2DProps {

}

export class View3D extends View2D {
  
  public constructor(props: View3DProps) {
    super({
      ...props,
    });
    this.view2D = this;

    View3D.shadowRoot.append(this.element);
  }
}
