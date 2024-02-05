import { TableRow } from "@tiptap/extension-table-row";
import { mergeAttributes } from "@tiptap/core";

import { getId } from "@/utils/id";
export const CassieTableRow = TableRow.extend({
  addAttributes() {
    return {
      id: {
        parseHTML: (element: any) => element.getAttribute("id"),
        renderHTML: (attributes: any) => {
          if (!attributes.id) {
            return { id: getId() };
          }
          return {
            id: attributes.id
          };
        }
      },
      extend: {
        default: "false"
      },
      group: {
        default: null,
        parseHTML: (element: any) => element.getAttribute("data-group"),
        renderHTML: (attributes: any) => {
          if (!attributes.group) {
            return {};
          }
          return {
            "data-group": attributes.group
          };
        }
      }
    };
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
