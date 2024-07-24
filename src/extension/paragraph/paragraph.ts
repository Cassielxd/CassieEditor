import { mergeAttributes, Node } from "@tiptap/core";
import { Paragraph } from "@tiptap/extension-paragraph";
import { getId, idAttributes } from "@/utils/id";
import { nodePasteRule } from "@tiptap/vue-3";
export const PARAGRAPH_REGEX_GLOBAL = /^(https?:\/\/)?(www\.|music\.)?(baidu\.com|baidu)(.+)?$/g;
export const EmrParagraph = Paragraph.extend({
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  group: "block",
  content: "inline*",
  addAttributes() {
    return idAttributes;
  },
  renderHTML({ node, HTMLAttributes }) {
    if (HTMLAttributes.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = HTMLAttributes.id;
    }
    return ["p", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
});
