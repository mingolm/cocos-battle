import { _decorator, Component, Sprite, UITransform, Animation, SpriteFrame, AnimationClip, animation, Layers, math, Vec3 } from 'cc';
import { DIRECTION_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM } from '../enum';
import EventManager from '../runtime/EventManager';
import ResourceManager from '../runtime/ResourceManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';
import { PlayerStateMachine } from './PlayerStateMachine';

const { ccclass, property } = _decorator;
const MOVE_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  private _position = new math.Vec3(2, -7);
  private _fsm: PlayerStateMachine

  async init() {
    this.node.setPosition(new math.Vec3(
      this._position.x * TILE_WIDTH,
      this._position.y * TILE_HEIGHT
    ))

    const transform = this.getComponent(UITransform)
    transform.setContentSize(4 * TILE_WIDTH, 4 * TILE_HEIGHT)

    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    this._fsm = this.addComponent(PlayerStateMachine)
    await this._fsm.init()
    this._fsm.setParam(PARAMS_NAME_ENUM.IDLE, true)

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.ctrl, this)
  }

  update(deltaTime: number) {
    this.refreshPos()
  }

  refreshPos() {
    let x = this.node.getPosition().x / TILE_WIDTH
    let y = this.node.getPosition().y / TILE_HEIGHT
    if (Math.abs(this._position.x - x) <= MOVE_SPEED && Math.abs(this._position.y - y) <= MOVE_SPEED) {
      x = this._position.x
      y = this._position.y
    } else {
      if (this._position.x > x) {
        x += MOVE_SPEED
      } else if (this._position.x < x) {
        x -= MOVE_SPEED
      }
      if (this._position.y > y) {
        y += MOVE_SPEED
      } else if (this._position.y < y) {
        y -= MOVE_SPEED
      }
    }

    this.node.setPosition(x * TILE_WIDTH, y * TILE_HEIGHT)
  }

  ctrl(inputDirection: DIRECTION_ENUM) {
    switch (inputDirection) {
      case DIRECTION_ENUM.TOP:
        this._position.y++
        break
      case DIRECTION_ENUM.BOTTOM:
        this._position.y--
        break
      case DIRECTION_ENUM.LEFT:
        this._position.x--
        break
      case DIRECTION_ENUM.RIGHT:
        this._position.x++
        break
      case DIRECTION_ENUM.TURNLEFT:
        this._fsm.setParam(PARAMS_NAME_ENUM.TURNLEFT, true)
        break
      case DIRECTION_ENUM.TURNRIGHT:
        break
    }
  }

}