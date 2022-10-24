import Singleton from "../base/Singleton"
import { ITile } from "../level"

export default class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  mapInfo: Array<Array<ITile>>
  mapCloumnCount: number = 0
  mapRowCount: number = 0
  levelIndex: number = 1
}