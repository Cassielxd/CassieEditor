/* eslint-disable */

import { Node as PMNode } from "@tiptap/pm/model"
import { AddMarkStep, RemoveMarkStep, ReplaceAroundStep, ReplaceStep, Step, StepMap } from "@tiptap/pm/transform"

import {computeDiff} from "./diff"
import { Change, BlockChange, Span, merge } from './change'

import { IChange } from './change/types'

interface ChangeSetConfig {
  doc: PMNode
  combine: (data1: any, data2: any) => null | any
}

// ::- A change set tracks the changes to a document from a given
// point in the past. It condenses a number of step maps down to a
// flat sequence of replacements, and simplifies replacments that
// partially undo themselves by comparing their content.
export class ChangeSet {

  config: ChangeSetConfig
  changes: IChange[]

  constructor(config: ChangeSetConfig, changes: IChange[]) {
    this.config = config
    // :: [Change] Replaced regions.
    this.changes = changes
  }

  // :: (Node, [StepMap], union<[any], any>) → ChangeSet
  // Computes a new changeset by adding the given step maps and
  // metadata (either as an array, per-map, or as a single value to be
  // associated with all maps) to the current set. Will not mutate the
  // old set.
  //
  // Note that due to simplification that happens after each add,
  // incrementally adding steps might create a different final set
  // than adding all those changes at once, since different document
  // tokens might be matched during simplification depending on the
  // boundaries of the current changed ranges.
  addSteps(oldDoc: PMNode, newDoc: PMNode, steps: Step[], data?: any | any[]) {
    // This works by inspecting the position maps for the changes,
    // which indicate what parts of the document were replaced by new
    // content, and the size of that new content. It uses these to
    // build up Change objects.
    //
    // These change objects are put in sets and merged together using
    // Change.merge, giving us the changes created by the new steps.
    // Those changes can then be merged with the existing set of
    // changes.
    //
    // For each change that was touched by the new steps, we recompute
    // a diff to try to minimize the change by dropping matching
    // pieces of the old and new document from the change.
    ////---------------------------------------------start-----------------------------------------
    let stepChanges: IChange[] = []
    // Add spans for new steps.
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      let d = Array.isArray(data) ? data[i] : data
      let off = 0
      if (step instanceof ReplaceStep) {
        step.getMap().forEach((fromA: number, toA: number, fromB: number, toB: number) => {
          stepChanges.push(new Change(fromA + off, toA + off, fromB, toB,
                                      fromA == toA ? Span.none : [new Span(toA - fromA, d)],
                                      fromB == toB ? Span.none : [new Span(toB - fromB, d)]))
          off = (toB - fromB) - (toA - fromA)
        })
      } else if (step instanceof ReplaceAroundStep) {
        let insideReplaceAroundStep = false
        let changeId = Math.random().toString()
        let node: PMNode | null | undefined
        // @ts-ignore
        const { slice } = step
        const nodeDeleted = slice.size === 0
        step.getMap().forEach((fromA: number, toA: number, fromB: number, toB: number) => {
          if (!insideReplaceAroundStep) {
            node = nodeDeleted ? oldDoc.nodeAt(fromA) : newDoc.nodeAt(fromB)
            insideReplaceAroundStep = true
            d = { ...d, blockChange: 'start', changeId, nodeType: node?.type.name }
          } else {
            insideReplaceAroundStep = false
            d = { ...d, blockChange: 'end', changeId, nodeType: node?.type.name }
            changeId = Math.random().toString()
          }
          const inserted = fromA == toA ? Span.none : [new Span(toA - fromA, d)]
          const deleted = fromB == toB ? Span.none : [new Span(toB - fromB, d)]
          stepChanges.push(new BlockChange(fromA + off, toA + off, fromB, toB, inserted, deleted, insideReplaceAroundStep))
          off = (toB - fromB) - (toA - fromA)
        })
      } else if (step instanceof AddMarkStep) {
        console.log('add mark step', step)
      } else if (step instanceof RemoveMarkStep) {
        console.log('remove mark step', step)
      } else {
        console.error('Unknown step type! Change not tracked and possibly current changes have become inconsistent', step)
      }
    }
    ////---------------------------------------------end-----------------------------------------
    if (stepChanges.length == 0) return this
    let newChanges = mergeAll(stepChanges, this.config.combine)
    let changes = merge(this.changes, newChanges, this.config.combine)
    // Minimize changes when possible
    /*for (let i = 0; i < changes.length; i++) {
      let change = changes[i]
      if (change.fromA == change.toA || change.fromB == change.toB ||
          // Only look at changes that touch newly added changed ranges
          !newChanges.some(r => r.toB > change.fromB && r.fromB < change.toB)) continue
      let diff = computeDiff(this.config.doc.content, newDoc.content, change)

      // Fast path: If they are completely different, don't do anything
      if (diff.length == 1 && diff[0].fromB == 0 && diff[0].toB == change.toB - change.fromB)
        continue

      if (diff.length == 1) {
        changes[i] = diff[0]
      } else {
        changes.splice(i, 1, ...diff)
        i += diff.length - 1
      }
    }*/

    return new ChangeSet(this.config, changes)
  }

  // :: Node
  // The starting document of the change set.
  get startDoc() { return this.config.doc }

  // :: (f: (range: Change) → any) → ChangeSet
  // Map the span's data values in the given set through a function
  // and construct a new set with the resulting data.
  map(f: (range: IChange) => any) {
    return new ChangeSet(this.config, this.changes.map(change => {
      let result = f(change)
      return result === change ? change :
        change.create(change.fromA, change.toA, change.fromB, change.toB, change.deleted, change.inserted)
    }))
  }

  // :: (ChangeSet, ?[StepMap]) → ?{from: number, to: number}
  // Compare two changesets and return the range in which they are
  // changed, if any. If the document changed between the maps, pass
  // the maps for the steps that changed it as second argument, and
  // make sure the method is called on the old set and passed the new
  // set. The returned positions will be in new document coordinates.
  changedRange(b: ChangeSet, maps?: StepMap[]) {
    if (b == this) return null
    let touched = maps && touchedRange(maps)
    let moved = touched ? (touched.toB - touched.fromB) - (touched.toA - touched.fromA) : 0
    function map(p: number) {
      return !touched || p <= touched.fromA ? p : p + moved
    }

    let from = touched ? touched.fromB : 2e8, to = touched ? touched.toB : -2e8
    function add(start: number, end = start) {
      from = Math.min(start, from); to = Math.max(end, to)
    }

    let rA = this.changes, rB = b.changes
    for (let iA = 0, iB = 0; iA < rA.length && iB < rB.length;) {
      let rangeA = rA[iA], rangeB = rB[iB]
      if (rangeA && rangeB && sameRanges(rangeA, rangeB, map)) { iA++; iB++ }
      else if (rangeB && (!rangeA || map(rangeA.fromB) >= rangeB.fromB)) { add(rangeB.fromB, rangeB.toB); iB++ }
      else { add(map(rangeA.fromB), map(rangeA.toB)); iA++ }
    }

    return from <= to ? {from, to} : null
  }

  // :: (Node, ?(a: any, b: any) → any) → ChangeSet
  // Create a changeset with the given base object and configuration.
  // The `combine` function is used to compare and combine metadata—it
  // should return null when metadata isn't compatible, and a combined
  // version for a merged range when it is.
  static create(doc: PMNode, combine = (a: any, b: any): any => a === b ? a : null) {
    return new ChangeSet({combine, doc}, [])
  }
}

// Exported for testing
// @ts-ignore
ChangeSet.computeDiff = computeDiff

// : ([[Change]], (any, any) → any, number, number) → [Change]
// Divide-and-conquer approach to merging a series of ranges.
function mergeAll(
  ranges: IChange[],
  combine: (data1: any, data2: any) => null | any,
  start = 0,
  end = ranges.length
) : IChange[] {
  if (end == start + 1) return [ranges[start]]
  let mid = (start + end) >> 1
  return merge(mergeAll(ranges, combine, start, mid),
                      mergeAll(ranges, combine, mid, end), combine)
}

function endRange(maps: StepMap[]) {
  let from = 2e8, to = -2e8
  for (let i = 0; i < maps.length; i++) {
    let map = maps[i]
    if (from != 2e8) {
      from = map.map(from, -1)
      to = map.map(to, 1)
    }
    map.forEach((_s, _e, start, end) => {
      from = Math.min(from, start)
      to = Math.max(to, end)
    })
  }
  return from == 2e8 ? null : {from, to}
}

function touchedRange(maps: StepMap[]) {
  let b = endRange(maps)
  if (!b) return null
  let a = endRange(maps.map(m => m.invert()).reverse())
  if (!a) throw Error('endRange was null!')
  return {fromA: a.from, toA: a.to, fromB: b.from, toB: b.to}
}

function sameRanges(a: IChange, b: IChange, map: (pos: number) => number) {
  return map(a.fromB) == b.fromB && map(a.toB) == b.toB &&
    sameSpans(a.deleted, b.deleted) && sameSpans(a.inserted, b.inserted)
}

function sameSpans(a: Span[], b: Span[]) {
  if (a.length != b.length) return false
  for (let i = 0; i < a.length; i++)
    if (a[i].length != b[i].length || a[i].data !== b[i].data) return false
  return true
}
