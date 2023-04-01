/* eslint-disable */
import { Span } from './span';
// ::- A replaced range with metadata associated with it.
export class Change {
    fromA;
    toA;
    fromB;
    toB;
    deleted;
    inserted;
    type = 'change';
    constructor(fromA, toA, fromB, toB, deleted, inserted) {
        // :: number The start of the range deleted/replaced in the old
        // document.
        this.fromA = fromA;
        // :: number The end of the range in the old document.
        this.toA = toA;
        // :: number The start of the range inserted in the new document.
        this.fromB = fromB;
        // :: number The end of the range in the new document.
        this.toB = toB;
        // :: [Span] Data associated with the deleted content. The length
        // of these spans adds up to `this.toA - this.fromA`.
        this.deleted = deleted;
        // :: [Span] Data associated with the inserted content. Length
        // adds up to `this.toB - this.toA`.
        this.inserted = inserted;
    }
    get lenA() { return this.toA - this.fromA; }
    get lenB() { return this.toB - this.fromB; }
    get blockChange() {
        const blockInserted = this.inserted.find(s => s.data?.blockChange);
        const blockDeleted = this.deleted.find(s => s.data?.blockChange);
        if (blockInserted)
            return blockInserted.data.blockChange;
        if (blockDeleted)
            return blockDeleted.data.blockChange;
        return null;
    }
    get isBlockChangeStart() {
        const blockInserted = this.inserted.find(s => s.data?.blockChange);
        const blockDeleted = this.deleted.find(s => s.data?.blockChange);
        return blockInserted?.data?.blockChange === 'start' || blockDeleted?.data?.blockChange === 'start';
    }
    get isBlockChangeEnd() {
        const blockInserted = this.inserted.find(s => s.data?.blockChange);
        const blockDeleted = this.deleted.find(s => s.data?.blockChange);
        return blockInserted?.data?.blockChange === 'end' || blockDeleted?.data?.blockChange === 'end';
    }
    isChange() {
        return this.type === 'change';
    }
    isBlockChange() {
        return this.type === 'block-change';
    }
    create(fromA, toA, fromB, toB, deleted, inserted) {
        return new Change(fromA, toA, fromB, toB, deleted, inserted);
    }
    slice(startA, endA, startB, endB) {
        if (startA == 0 && startB == 0 && endA == this.toA - this.fromA &&
            endB == this.toB - this.fromB)
            return this;
        return this.create(this.fromA + startA, this.fromA + endA, this.fromB + startB, this.fromB + endB, Span.slice(this.deleted, startA, endA), Span.slice(this.inserted, startB, endB));
    }
    createNewWithOffset(offset, offsetNew) {
        if (offset === 0) {
            return this;
        }
        if (offsetNew) {
            return this.create(this.fromA, this.toA, this.fromB + offset, this.toB + offset, this.deleted, this.inserted);
        }
        return this.create(this.fromA - offset, this.toA - offset, this.fromB, this.toB, this.deleted, this.inserted);
    }
}
//# sourceMappingURL=change.js.map