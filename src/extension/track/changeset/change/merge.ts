/* eslint-disable */

import { Span } from './span'
import { Change } from './change'
import type { IChange } from './types'

// : ([Change], [Change], (any, any) → any) → [Change]
// This merges two changesets (the end document of x should be the
// start document of y) into a single one spanning the start of x to
// the end of y.
export function merge(x: IChange[], y: IChange[], combine: (a: any, b: any) => any) : IChange[] {
  if (x.length == 0) return y
  if (y.length == 0) return x

  let result = []
  // Iterate over both sets in parallel, using the middle coordinate
  // system (B in x, A in y) to synchronize.
  for (let iX = 0, iY = 0, curX: IChange = x[0], curY: IChange = y[0];;) {
    if (!curX && !curY) {
      return result
    } else if (curX && (!curY || curX.toB < curY.fromA)) { // curX entirely in front of curY
      let off = iY ? y[iY - 1].toB - y[iY - 1].toA : 0
      result.push(curX.createNewWithOffset(off, true))
      // result.push(off == 0 ? curX :
      //             new Change(curX.fromA, curX.toA, curX.fromB + off, curX.toB + off,
      //                         curX.deleted, curX.inserted))
      // @ts-ignore
      curX = iX++ == x.length ? null : x[iX]
    } else if (curY && (!curX || curY.toA < curX.fromB)) { // curY entirely in front of curX
      let off = iX ? x[iX - 1].toB - x[iX - 1].toA : 0
      result.push(curY.createNewWithOffset(off, false))
      // result.push(off == 0 ? curY :
      //             new Change(curY.fromA - off, curY.toA - off, curY.fromB, curY.toB,
      //                         curY.deleted, curY.inserted))
      // @ts-ignore
      curY = iY++ == y.length ? null : y[iY]
    } else if (curX.isBlockChange() && curY.isBlockChange() || curX.isBlockChange() && curY.isChange()) {
      let off = iY ? y[iY - 1].toB - y[iY - 1].toA : 0
      result.push(curX.createNewWithOffset(off, true))
      off = iX ? x[iX - 1].toB - x[iX - 1].toA : 0
      result.push(curY.createNewWithOffset(off, false))
      // @ts-ignore
      curX = iX++ == x.length ? null : x[iX]
      // @ts-ignore
      curY = iY++ == y.length ? null : y[iY]
    } else if (curX.isChange() && curY.isBlockChange()) {
      throw Error('TODO')
    } else { // Touch, need to merge
      // The rules for merging ranges are that deletions from the
      // old set and insertions from the new are kept. Areas of the
      // middle document covered by a but not by b are insertions
      // from a that need to be added, and areas covered by b but
      // not a are deletions from b that need to be added.
      let pos = Math.min(curX.fromB, curY.fromA)
      let fromA = Math.min(curX.fromA, curY.fromA - (iX ? x[iX - 1].toB - x[iX - 1].toA : 0)), toA = fromA
      let fromB = Math.min(curY.fromB, curX.fromB + (iY ? y[iY - 1].toB - y[iY - 1].toA : 0)), toB = fromB
      let deleted = Span.none, inserted = Span.none

      // Used to prevent appending ins/del range for the same Change twice
      let enteredX = false, enteredY = false

      // Need to have an inner loop since any number of further
      // ranges might be touching this group
      for (;;) {
        let nextX = !curX ? 2e8 : pos >= curX.fromB ? curX.toB : curX.fromB
        let nextY = !curY ? 2e8 : pos >= curY.fromA ? curY.toA : curY.fromA
        let next = Math.min(nextX, nextY)
        let inX = curX && pos >= curX.fromB, inY = curY && pos >= curY.fromA
        if (!inX && !inY) break
        if (inX && pos == curX.fromB && !enteredX) {
          deleted = Span.join(deleted, curX.deleted, combine)
          toA += curX.lenA
          enteredX = true
        }
        if (inX && !inY) {
          inserted = Span.join(inserted, Span.slice(curX.inserted, pos - curX.fromB, next - curX.fromB), combine)
          toB += next - pos
        }
        if (inY && pos == curY.fromA && !enteredY) {
          inserted = Span.join(inserted, curY.inserted, combine)
          toB += curY.lenB
          enteredY = true
        }
        if (inY && !inX) {
          deleted = Span.join(deleted, Span.slice(curY.deleted, pos - curY.fromA, next - curY.fromA), combine)
          toA += next - pos
        }

        if (inX && next == curX.toB) {
          // @ts-ignore
          curX = iX++ == x.length ? null : x[iX]
          enteredX = false
        }
        if (inY && next == curY.toA) {
          // @ts-ignore
          curY = iY++ == y.length ? null : y[iY]
          enteredY = false
        }
        pos = next
      }
      if (fromA < toA || fromB < toB)
        result.push(new Change(fromA, toA, fromB, toB, deleted, inserted))
    }
  }
}
