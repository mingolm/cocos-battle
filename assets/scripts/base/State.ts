import { AnimationClip, animation, SpriteFrame, Sprite } from "cc";
import { PlayerStateMachine } from "../player/PlayerStateMachine";
import ResourceManager from "../runtime/ResourceManager";

const ANIMATION_SPPED = 1 / 8


export class State {
  animationClip: AnimationClip

  constructor(
    private fsm: PlayerStateMachine,
    private path: string,
    private warpMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal
  ) {
    this.init()
  }

  async init() {
    const promise = ResourceManager.Instance.loadDir(this.path)
    this.fsm.waitingPromiseList.push(promise)
    const spriteFrames = await promise

    const track = new animation.ObjectTrack();
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPPED * index, item])
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    track.channel.curve.assignSorted(frames)

    this.animationClip = new AnimationClip();
    this.animationClip.name = this.path
    this.animationClip.addTrack(track); // 最后将轨道添加到动画剪辑以应用
    this.animationClip.duration = frames.length * ANIMATION_SPPED // 整个动画剪辑的周期
    this.animationClip.wrapMode = this.warpMode
  }

  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }


}