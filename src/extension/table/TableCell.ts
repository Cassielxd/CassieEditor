import { TableCell } from "@tiptap/extension-table-cell";
import { mergeAttributes } from "@tiptap/core";

import { getId, idAttributes } from "@/utils/id";
export const CassieTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...idAttributes
    };
  },
  parseHTML() {
    return [{ tag: `td` }];
  },

  renderHTML({ node, HTMLAttributes }) {
    if (!node.attrs.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = getId();
      HTMLAttributes.id = node.attrs.id;
    }
    return ["td", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
