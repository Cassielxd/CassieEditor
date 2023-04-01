import { EditorState, Transaction } from "@tiptap/pm/state";
import { Node as PMNode, ResolvedPos } from "@tiptap/pm/model";
import { BlockChange, IChange, ChangeSet } from "../changeset";
import { findWrapping, liftTarget } from "@tiptap/pm/transform";

function updateChangesWithBlockChange(acceptedChange: BlockChange, changes: IChange[], changeIndex: number): IChange[] {
  const beforeChanges = changes.slice(0, changeIndex);
  let offset = acceptedChange.lenB - acceptedChange.lenA;
  const afterChanges = changes
    .slice(changeIndex + 1)
    .map((c) => {
      if (c.isBlockChange() && acceptedChange.changeId === c.changeId) {
        offset += acceptedChange.lenB - acceptedChange.lenA;
        return null;
      }
      return c.create(c.fromA + offset, c.toA + offset, c.fromB, c.toB, c.deleted, c.inserted);
    })
    .filter((c) => c !== null) as IChange[];
  return [...beforeChanges, ...afterChanges];
}

function updateChanges(acceptedChange: IChange, changes: IChange[], changeIndex: number): IChange[] {
  // The changes before the accepted change stay as previously, only the changes afterwards must be updated
  // to account for the changed startDoc
  const beforeChanges = changes.slice(0, changeIndex);
  const afterChanges = changes.slice(changeIndex + 1).map((c) => {
    const fromA = c.fromA - acceptedChange.lenA + acceptedChange.lenB;
    const toA = c.toA - acceptedChange.lenA + acceptedChange.lenB;
    return c.create(fromA, toA, c.fromB, c.toB, c.deleted, c.inserted);
  });
  return [...beforeChanges, ...afterChanges];
}

function wrapWithNode(pos: number, wrapperNode: PMNode, doc: PMNode, tr: Transaction) {
  const startPos = doc.resolve(pos);
  const node = doc.nodeAt(pos);
  if (!node) return undefined;
  const range = startPos.blockRange(doc.resolve(startPos.pos + node.nodeSize));
  const wrapping = range && findWrapping(range, wrapperNode.type, wrapperNode.attrs);
  if (range && wrapping) {
    return tr.wrap(range, wrapping).scrollIntoView();
  }
  return undefined;
}

function liftNode(pos: number, doc: PMNode, tr: Transaction) {
  const startPos = doc.resolve(pos);
  const node = doc.nodeAt(pos);
  if (!node) return undefined;
  const range = startPos.blockRange(doc.resolve(startPos.pos + node.nodeSize));
  if (range) {
    const targetDepth = Number(liftTarget(range));
    if (!Number.isNaN(targetDepth)) {
      return tr.lift(range, targetDepth);
    }
  }
  return undefined;
}

export function rejectChange(changeIndex: number, changeSet: ChangeSet, startState: EditorState, currentState: EditorState) {
  const change = changeSet.changes[changeIndex];
  const wasBlockChange = change.isBlockChange();
  const insertOnly = change.lenA === 0;
  const deleteOnly = change.lenB === 0;
  let tr;
  if (wasBlockChange && insertOnly) {
    tr = liftNode(change.fromB + 1, currentState.doc, currentState.tr);
  } else if (wasBlockChange && deleteOnly) {
    const node = startState.doc.nodeAt(change.fromA);
    if (!node) return undefined;
    tr = wrapWithNode(change.fromB, node, currentState.doc, currentState.tr);
  } else if (wasBlockChange) {
    throw Error("Unhandled mixed blockChange + text change");
  } else {
    const slice = startState.doc.slice(change.fromA, change.toA);
    tr = currentState.tr.replaceWith(change.fromB, change.toB, slice.content);
  }
  return tr;
}

export function acceptChange(changeIndex: number, oldChangeSet: ChangeSet, startState: EditorState, currentState: EditorState): [ChangeSet, EditorState] {
  const change = oldChangeSet.changes[changeIndex];
  const insertOnly = change.lenA === 0;
  let changes;
  if (change.isBlockChange() && change.lenA > 0 && change.lenB > 0) {
    throw Error("Unhandled mixed blockChange + text change");
  } else if (change.isBlockChange()) {
    let tr;
    if (insertOnly) {
      const node = currentState.doc.nodeAt(change.fromB);
      tr = wrapWithNode(change.fromA, node!, startState.doc, startState.tr);
    } else {
      tr = liftNode(change.fromA + 1, startState.doc, startState.tr);
    }
    if (!tr) return [oldChangeSet, startState];
    startState = startState.apply(tr);
    changes = updateChangesWithBlockChange(change, oldChangeSet.changes, changeIndex);
  } else {
    const slice = currentState.doc.slice(change.fromB, change.toB);
    startState = startState.apply(startState.tr.replaceWith(change.fromA, change.toA, slice.content));
    changes = updateChanges(change, oldChangeSet.changes, changeIndex);
  }
  return [new ChangeSet({ ...oldChangeSet.config, doc: startState.doc }, changes), startState];
}
