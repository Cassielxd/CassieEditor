/* eslint-disable */

import { BlockChange } from './block-change'
import { Span } from './span'
import { IChange, ChangeType } from './types'

// ::- A replaced range with metadata associated with it.
export class Change implements IChange {
  
  fromA: number
  toA: number
  fromB: number
  toB: number
  deleted: Span[]
  inserted: Span[]
  readonly type: ChangeType = 'change'

  constructor(fromA: number, toA: number, fromB: number, toB: number, deleted: Span[], inserted: Span[]) {
    // :: number The start of the range deleted/replaced in the old
    // document.
    this.fromA = fromA
    // :: number The end of the range in the old document.
    this.toA = toA
    // :: number The start of the range inserted in the new document.
    this.fromB = fromB
    // :: number The end of the range in the new document.
    this.toB = toB
    // :: [Span] Data associated with the deleted content. The length
    // of these spans adds up to `this.toA - this.fromA`.
    this.deleted = deleted
    // :: [Span] Data associated with the inserted content. Length
    // adds up to `this.toB - this.toA`.
    this.inserted = inserted
  }

  get lenA() { return this.toA - this.fromA }
  get lenB() { return this.toB - this.fromB }

  get blockChange() {
    const blockInserted = this.inserted.find(s => s.data?.blockChange)
    const blockDeleted = this.deleted.find(s => s.data?.blockChange)
    if (blockInserted) return blockInserted.data.blockChange
    if (blockDeleted) return blockDeleted.data.blockChange
    return null
  }
  
  get isBlockChangeStart() {
    const blockInserted = this.inserted.find(s => s.data?.blockChange)
    const blockDeleted = this.deleted.find(s => s.data?.blockChange)
    return blockInserted?.data?.blockChange === 'start' || blockDeleted?.data?.blockChange === 'start'
  }

  get isBlockChangeEnd() {
    const blockInserted = this.inserted.find(s => s.data?.blockChange)
    const blockDeleted = this.deleted.find(s => s.data?.blockChange)
    return blockInserted?.data?.blockChange === 'end' || blockDeleted?.data?.blockChange === 'end'
  }

  isChange(): this is Change {
    return this.type === 'change'
  }

  isBlockChange(): this is BlockChange {
    return this.type === 'block-change'
  }

  create(fromA: number, toA: number, fromB: number, toB: number, deleted: Span[], inserted: Span[]) {
    return new Change(fromA, toA, fromB, toB, deleted, inserted)
  }

  slice(startA: number, endA: number, startB: number, endB: number) {
    if (startA == 0 && startB == 0 && endA == this.toA - this.fromA &&
        endB == this.toB - this.fromB) return this
    return this.create(this.fromA + startA, this.fromA + endA,
                      this.fromB + startB, this.fromB + endB,
                      Span.slice(this.deleted, startA, endA),
                      Span.slice(this.inserted, startB, endB))
  }

  createNewWithOffset(offset: number, offsetNew?: boolean) {
    if (offset === 0) {
      return this
    }
    if (offsetNew) {
      return this.create(
        this.fromA,
        this.toA,
        this.fromB + offset,
        this.toB + offset,
        this.deleted,
        this.inserted
      )
    }
    return this.create(
      this.fromA - offset,
      this.toA - offset,
      this.fromB,
      this.toB,
      this.deleted,
      this.inserted
    )
  }
}