/* eslint-disable */
import { Change } from './change';
export class BlockChange extends Change {
    type = 'block-change';
    isStart;
    constructor(fromA, toA, fromB, toB, deleted, inserted, isStart = true) {
        super(fromA, toA, fromB, toB, deleted, inserted);
        this.isStart = isStart;
    }
    get changeId() {
        const blockInserted = this.inserted.find(s => s.data?.changeId);
        const blockDeleted = this.deleted.find(s => s.data?.changeId);
        if (blockInserted)
            return blockInserted.data.changeId;
        if (blockDeleted)
            return blockDeleted.data.changeId;
        return null;
    }
    get nodeType() {
        const blockInserted = this.inserted.find(s => s.data?.nodeType);
        const blockDeleted = this.deleted.find(s => s.data?.nodeType);
        if (blockInserted)
            return blockInserted.data.nodeType;
        if (blockDeleted)
            return blockDeleted.data.nodeType;
        return null;
    }
    create(fromA, toA, fromB, toB, deleted, inserted) {
        return new BlockChange(fromA, toA, fromB, toB, deleted, inserted);
    }
}
//# sourceMappingURL=block-change.js.map