import ForceGraph3D from '3d-force-graph';

export const main = () => {
  const name = 'main';

  return name;
};

export class OM {
  root: string;

  constructor(root = '#root') {
    this.root = root
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
