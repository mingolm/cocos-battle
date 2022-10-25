import { _decorator, Component, AnimationClip, Animation, SpriteFrame, AnimationComponent } from "cc";
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from "../enum";
import { State } from "./State";

const { ccclass } = _decorator

type ParamValueType = number | boolean

export interface IParamValue {
  type: FSM_PARAMS_TYPE_ENUM,
  value: ParamValueType,
}

@ccclass("StateMachine")
export abstract class StateMachine extends Component {
  _currentState: State = null;
  params: Map<string, IParamValue> = new Map()
  stateMachines: Map<string, State> = new Map()
  animationComponent: Animation
  waitingPromiseList: Array<Promise<SpriteFrame[]>> = []

  getParam(paramName: PARAMS_NAME_ENUM) {
    if (this.params.get(paramName)) {
      return this.params.get(paramName).value
    }
  }

  setParam(paramName: PARAMS_NAME_ENUM, value: ParamValueType) {
    if (this.params.has(paramName)) {
      this.params.get(paramName).value = value
      this.run()
      this.resetTrigger()
    }
  }

  get currentState() {
    return this._currentState
  }

  set currentState(newData: State) {
    this._currentState = newData
    this._currentState.run()
  }

  resetTrigger() {
    for (const [_, item] of this.params) {
      if (item.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        item.value = false
      }
    }
  }

  abstract init()
  abstract run()
}