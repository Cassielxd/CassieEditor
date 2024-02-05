import { Table } from "@tiptap/extension-table";
import { mergeAttributes } from "@tiptap/core";

import { getId } from "@/utils/id";
export const CassieTable = Table.extend({
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
    return [{ tag: "table" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    if (!node.attrs.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = getId();
      HTMLAttributes.id = node.attrs.id;
    }
    return ["table", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ["tbody", 0]];
  }
});
