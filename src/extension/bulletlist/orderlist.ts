import { mergeAttributes } from "@tiptap/core";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { idAttributes } from "@/utils/id";

export const EmrOrderedList = OrderedList.extend({
  //修改listItem+ 为listItem* 满足分页的需求
  content: `listItem*`,
  addAttributes() {
    return {
      ...this.parent?.(),
      ...idAttributes
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    const { start, ...attributesWithoutStart } = HTMLAttributes;
    if (HTMLAttributes.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = HTMLAttributes.id;
    }
    return start === 1 ? ["ol", mergeAttributes(this.options.HTMLAttributes, attributesWithoutStart), 0] : ["ol", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
