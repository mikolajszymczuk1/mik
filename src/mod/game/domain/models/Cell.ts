class Cell {
  private _x: number
  private _y: number
  private _active: boolean
  private _landNumber: number

  constructor(x: number, y: number) {
    this._x = x
    this._y = y
    this._active = false
    this._landNumber = -1
  }

  public get id(): string {
    return `${this._x}-${this._y}`
  }

  public get x(): number {
    return this._x
  }

  public get y(): number {
    return this._y
  }

  public get active(): boolean {
    return this._active
  }

  public get landNumber(): number {
    return this._landNumber
  }

  public set active(value: boolean) {
    this._active = value
  }

  public set landNumber(value: number) {
    this._landNumber = value
  }
}

export default Cell
