import { TableRow } from "@tiptap/extension-table-row";
import { mergeAttributes } from "@tiptap/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuid } from "uuid";
export const CassieTableRow = TableRow.extend({
  addAttributes() {
    return {
      id: {
        parseHTML: (element) => element.getAttribute("id")
      }
    };
  },
  parseHTML() {
    return [{ tag: `tr` }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const pid = uuid();

    if (!node.attrs.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = pid;
    }

    return ["tr", mergeAttributes(this.options.HTMLAttributes, { id: pid }, HTMLAttributes), 0];
  }
});
