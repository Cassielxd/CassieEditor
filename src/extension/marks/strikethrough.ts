import { Mark, markInputRule, markPasteRule, mergeAttributes } from "@tiptap/core";
export const StrikeThrough = Mark.create({
  name: "strikethrough",
  parseHTML() {
    return [{ tag: "s" }, { tag: "strike" }, { style: "text-decoration=line-through" }, { style: "text-decoration-line=line-through" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["s", 0];
  }
});
