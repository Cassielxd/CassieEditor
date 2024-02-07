import { mergeAttributes, Node } from "@tiptap/core";
import { getId, idAttributes } from "@/utils/id";
import { ListItem, ListItemOptions } from "@tiptap/extension-list-item";
export const EmrListItem = ListItem.extend({
  addAttributes() {
    return idAttributes;
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
