/* eslint-disable */

import { Span } from './span'
import { Change } from './change'
import { IChange, ChangeType } from './types'

export class BlockChange extends Change implements IChange {

  readonly type = 'block-change'
  readonly isStart: boolean

  constructor(fromA: number, toA: number, fromB: number, toB: number, deleted: Span[], inserted: Span[], isStart = true) {
    super(fromA, toA, fromB, toB, deleted, inserted)
    this.isStart = isStart
  }

  get changeId() : string | null {
    const blockInserted = this.inserted.find(s => s.data?.changeId)
    const blockDeleted = this.deleted.find(s => s.data?.changeId)
    if (blockInserted) return blockInserted.data.changeId
    if (blockDeleted) return blockDeleted.data.changeId
    return null
  }

  get nodeType(): string | null {
    const blockInserted = this.inserted.find(s => s.data?.nodeType)
    const blockDeleted = this.deleted.find(s => s.data?.nodeType)
    if (blockInserted) return blockInserted.data.nodeType
    if (blockDeleted) return blockDeleted.data.nodeType
    return null
  }

  create(fromA: number, toA: number, fromB: number, toB: number, deleted: Span[], inserted: Span[]) {
    return new BlockChange(fromA, toA, fromB, toB, deleted, inserted)
  }
}
