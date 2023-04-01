import { Change } from "./change";
import { BlockChange } from "./block-change";
import { Span } from "./span";

export type ChangeType = "change" | "block-change";
export interface IChange {
  type: ChangeType;

  fromA: number;
  toA: number;
  fromB: number;
  toB: number;
  deleted: Span[];
  inserted: Span[];

  lenA: number;
  lenB: number;

  isChange(): this is Change;
  isBlockChange(): this is BlockChange;

  create(fromA: number, toA: number, fromB: number, toB: number, deleted: Span[], inserted: Span[]): IChange;
  createNewWithOffset(offset: number, offsetNew?: boolean): IChange;

  slice(startA: number, endA: number, startB: number, endB: number): IChange;
}
