import { Mark } from "@tiptap/core";
export const Insertion = Mark.create({
  name: "insertion",
  addAttributes() {
    return {
      dataTracked: {
        default: null
      }
    };
  },
  parseHTML() {
    return [{ tag: "span.insertion" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", { class: "insertion" }, 0];
  }
});
