import { _decorator, Component, AnimationClip, Animation, SpriteFrame, AnimationComponent } from "cc";
import { State } from "../base/State";
import { StateMachine } from "../base/StateMachine";
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from "../enum";

const { ccclass } = _decorator

type ParamValueType = number | boolean

export interface IParamValue {
  type: FSM_PARAMS_TYPE_ENUM,
  value: ParamValueType,
}

@ccclass("PlayerStateMachine")
export class PlayerStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingPromiseList)
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false,
    })

    this.params.set(PARAMS_NAME_ENUM.TURNLEFT, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false,
    })
  }

  initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new State(this, 'texture/player/turnleft/top', AnimationClip.WrapMode.Normal))
  }

  initAnimationEvent() {
    const animationComponent = this.getComponent(Animation)
    animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = animationComponent.defaultClip.name
      const whiteList = ["turnleft"];
      if (whiteList.some(v => name.includes(v))) {
        this.setParam(PARAMS_NAME_ENUM.IDLE, true)
      }
    })
  }

  resetTrigger() {
    for (const [_, item] of this.params) {
      if (item.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        item.value = false
      }
    }
  }

  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
        if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        break
    }
  }

}

