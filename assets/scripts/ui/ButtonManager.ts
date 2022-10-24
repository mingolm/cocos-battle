import { _decorator, Component, Event } from "cc";
import { DIRECTION_ENUM, EVENT_ENUM } from "../enum";
import EventManager from "../runtime/EventManager";

const { ccclass, property } = _decorator

@ccclass("ButtonManager")
export default class ButtonManager extends Component {
  handleCtrl(event: Event, type: string) {
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, type as DIRECTION_ENUM)
  }
}