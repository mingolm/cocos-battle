import { _decorator, Component, Node, AnimationClip, animation, Sprite, SpriteFrame, AnimationComponent } from 'cc';
import { EVENT_ENUM } from '../enum';
import levels, { ILevel, } from '../level';
import { PlayerManager } from '../player/PlayerManager';
import DataManager from '../runtime/DataManager';
import EventManager from '../runtime/EventManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';
import { TileMapManager } from '../tile/TileMapManager';
import { createUINode } from '../util';
const { ccclass, property } = _decorator;

const ANIMATION_SPPED = 1 / 8

@ccclass('BattleManager')
export class BattleManager extends Component {
  stage: Node
  level: ILevel

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PREV_LEVEL, this.prevLevel, this)
  }

  start() {
    this.generateState()
    this.initLevel()
  }

  update(deltaTime: number) {

  }

  initLevel() {
    const levelIndex = DataManager.Instance.levelIndex
    const level = levels[`level${levelIndex}`]
    if (level) {
      this.level = level
      this.stage.removeAllChildren()

      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapCloumnCount = this.level.mapInfo.length
      DataManager.Instance.mapRowCount = this.level.mapInfo[0].length
      this.generateTileMap()
      this.generatePlayer()
    }
  }

  nextLevel() {
    DataManager.Instance.levelIndex++
    this.initLevel()
  }

  prevLevel() {
    if (DataManager.Instance.levelIndex <= 1) {
      return
    }
    DataManager.Instance.levelIndex--
    this.initLevel()
  }

  generateState() {
    this.stage = createUINode();
    this.stage.setParent(this.node)
  }

  generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)

    const playerManager = player.addComponent(PlayerManager)
    playerManager.init()
  }

  generateTileMap() {
    const tile = createUINode();
    tile.setParent(this.stage)

    const tileMapManager = tile.addComponent(TileMapManager)
    tileMapManager.init()

    this.adaptStagePos()
  }

  adaptStagePos() {
    const { mapCloumnCount, mapRowCount } = DataManager.Instance
    const disX = (mapCloumnCount * TILE_WIDTH) / 2 - TILE_WIDTH / 2
    const disY = (mapRowCount * TILE_HEIGHT) / 2
    this.stage.setPosition(-disX, disY + 80)
  }
}

