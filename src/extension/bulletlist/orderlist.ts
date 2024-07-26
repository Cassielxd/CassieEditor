import { OrderedList } from "@tiptap/extension-ordered-list";

export const EmrOrderedList = OrderedList.extend({
  content: `listItem*`
});
