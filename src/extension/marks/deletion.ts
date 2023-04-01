import { Mark } from "@tiptap/core";
export const Deletion = Mark.create({
  name: "deletion",
  addAttributes() {
    return {
      dataTracked: {
        default: null
      }
    };
  },
  parseHTML() {
    return [{ tag: "span.deletion" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", { class: "deletion" }, 0];
  }
});
