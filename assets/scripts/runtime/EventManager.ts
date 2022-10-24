import Singleton from "../base/Singleton";

export interface IItem {
  func: Function
  ctx: unknown
}

export default class EventManager extends Singleton {
  static get Instance() {
    return super.GetInstance<EventManager>()
  }

  private _eventDic: Map<string, Array<IItem>> = new Map()

  on(event: string, func: Function, ctx?: unknown) {
    if (this._eventDic.has(event)) {
      this._eventDic.get(event).push({ func, ctx })
      return
    }
    this._eventDic.set(event, [{ func, ctx }])
  }

  off(event: string, func: Function) {
    if (this._eventDic.has(event)) {
      const index = this._eventDic.get(event).findIndex(i => i.func === func)
      this._eventDic.get(event).splice(index, 1)
    }
  }

  emit(event: string, ...params: unknown[]) {
    if (!this._eventDic.has(event)) {
      return
    }

    this._eventDic.get(event).forEach(({ func, ctx }) => {
      ctx ? func.apply(ctx, params) : func(...params)
    })
  }

  clear() {
    this._eventDic.clear()
  }
}