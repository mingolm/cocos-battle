import { _decorator, Component, Node, Sprite, resources, SpriteFrame, UITransform, Layers, v3 } from 'cc';
import DataManager from '../runtime/DataManager';
import ResourceManager from '../runtime/ResourceManager';
import { createUINode, randomByRange } from '../util';
import { TileManager } from './TileManager';
const { ccclass, property } = _decorator;


@ccclass('TileMapManager')
export class TileMapManager extends Component {

  async init() {
    const { mapInfo } = DataManager.Instance
    const sfs = await ResourceManager.Instance.loadDir("texture/tile/tile")

    for (let i = 0; i < mapInfo.length; i++) {
      const cloumn = mapInfo[i];
      for (let j = 0; j < cloumn.length; j++) {
        const row = cloumn[j];
        if (row.src == null || row.type == null) {
          continue
        }

        // 随机取瓦片
        let number = row.src
        if ((number === 1 || number === 5 || number === 9) && i % 2 === 0 && j % 2 === 0) {
          number += randomByRange(0, 4)
        }

        const node = createUINode()
        const tileManager = node.addComponent(TileManager)
        const sf = sfs.find(v => v.name == `tile (${number})`) || sfs[0]
        tileManager.init(sf, i, j)
        node.setParent(this.node)
      }
    }
  }

  start() {

  }

  update(deltaTime: number) {

  }


}

