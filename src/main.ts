import ForceGraph3D from '3d-force-graph';

export const main = () => {
  const name = 'main';

  return name;
};

export interface Size {
  width: number;
  height: number;
}

export interface IState {
  root: string;
  size?: Size;
}

export class OM {
  root: string;
  size: Size;

  constructor(state: IState) {
    this.root = state.root;
    this.size = state.size || {width: 700, height: 700}
  }

  getRandomTree(N: number) {
    return {
      nodes: [...Array(N).keys()].map(i => ({id: i})),
      links: [...Array(N).keys()]
        .filter(id => id)
        .map(id => ({
          source: id,
          target: Math.round(Math.random() * (id - 1))
        }))
    };
  }

  getRootElement() {
    return document.querySelector(this.root);
  }

  init() {
    const rootEl = this.getRootElement();
    if (rootEl === null) {
      console.error('no root');
    } else {
      const Graph = ForceGraph3D()
      (rootEl as HTMLElement)
        .width(this.size.width)
        .height(this.size.height)
        .graphData(this.getRandomTree(30));
    }
  }

  update() {
    console.log('update');
  }

  destroy() {
    console.log('destroy');
  }
}
