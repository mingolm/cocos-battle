import { _decorator, Component, Sprite, UITransform, Animation, SpriteFrame, AnimationClip, animation, Layers, math, Vec3 } from 'cc';
import { DIRECTION_ENUM, EVENT_ENUM } from '../enum';
import EventManager from '../runtime/EventManager';
import ResourceManager from '../runtime/ResourceManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';

const { ccclass, property } = _decorator;
const ANIMATION_SPPED = 1 / 8
const MOVE_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  private _position = new math.Vec3(2, -7);

  async init() {
    await this.render()
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this)
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

  move(inputDirection: DIRECTION_ENUM) {
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
    }
  }

  async render() {
    this.node.setPosition(this._position.x * TILE_WIDTH, this._position.y * TILE_HEIGHT)
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(4 * TILE_WIDTH, 4 * TILE_HEIGHT)

    const spriteFrames = await ResourceManager.Instance.loadDir("texture/player/idle/top")
    const animationComponent = this.addComponent(Animation)
    const animationClip = new AnimationClip();
    const track = new animation.ObjectTrack();
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPPED * index, item])


    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    track.channel.curve.assignSorted(frames)

    animationClip.addTrack(track); // 最后将轨道添加到动画剪辑以应用
    animationClip.duration = frames.length * ANIMATION_SPPED // 整个动画剪辑的周期
    animationClip.wrapMode = AnimationClip.WrapMode.Loop

    animationComponent.defaultClip = animationClip
    animationComponent.play()
  }
}