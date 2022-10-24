import { _decorator, Component, Node, Sprite, resources, SpriteFrame, UITransform, Layers, v3 } from 'cc';
import levels from '../level';
import { createUINode } from '../util';
const { ccclass, property } = _decorator;


export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {

  init(sf: SpriteFrame, x: number, y: number) {
    const sp = this.addComponent(Sprite)
    sp.spriteFrame = sf

    const uiTransform = this.getComponent(UITransform)
    uiTransform.setContentSize(TILE_WIDTH, TILE_HEIGHT)

    this.node.setPosition(x * TILE_WIDTH, -y * TILE_HEIGHT)
  }
}

