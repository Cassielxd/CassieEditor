import { TableRow } from "@tiptap/extension-table-row";
import { mergeAttributes } from "@tiptap/core";

import { getId, idAttributes } from "@/utils/id";
export const CassieTableRow = TableRow.extend({
  addAttributes() {
    return idAttributes;
  },
  parseHTML() {
    return [{ tag: `tr` }];
  },

  renderHTML({ node, HTMLAttributes }) {
    if (!node.attrs.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = getId();
      HTMLAttributes.id = node.attrs.id;
    }
    return ["tr", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
