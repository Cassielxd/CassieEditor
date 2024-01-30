import { mergeAttributes, Node } from "@tiptap/core";
import { getId } from "@/utils/id";
import { ListItem, ListItemOptions } from "@tiptap/extension-list-item";
export const EmrListItem = ListItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
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
        parseHTML: (element) => element.getAttribute("data-group"),
        renderHTML: (attributes) => {
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
  renderHTML({ node, HTMLAttributes }) {
    if (HTMLAttributes.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = HTMLAttributes.id;
    }
    return ["li", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
