import { SpriteFrame, Node, UITransform, math, Layers } from "cc";

export const createUINode = (name: string = '') => {
  const node = new Node(name)
  const sprite = node.addComponent(UITransform)
  node.layer = 1 << Layers.nameToLayer('UI_2D')

  return node
}

export const randomByRange = (start: number, end: number) => {
  return start + Math.floor(Math.random() * (end - start))
}