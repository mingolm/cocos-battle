import { resources, SpriteFrame } from "cc"
import Singleton from "../base/Singleton"
import { ITile } from "../level"

export default class ResourceManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ResourceManager>()
  }

  loadDir(dir: string, sf: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(dir, SpriteFrame, function (err, assets) {
        if (err) {
          reject(err)
          return
        }
        resolve(assets)
      })
    })
  }
}