import { mergeAttributes } from "@tiptap/core";
import { BulletList } from "@tiptap/extension-bullet-list";
import { idAttributes } from "@/utils/id";

export const EmrBulletList = BulletList.extend({
  //修改listItem+ 为listItem* 满足分页的需求
  content: `listItem*`,
  addAttributes() {
    return idAttributes;
  },
  renderHTML({ node, HTMLAttributes }) {
    if (HTMLAttributes.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = HTMLAttributes.id;
    }
    return ["ul", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
