import { mergeAttributes, Node } from "@tiptap/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuid } from "uuid";

import { Paragraph } from "@tiptap/extension-paragraph";

export const EmrParagraph = Paragraph.extend({
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },

  group: "block",

  content: "inline*",
  addAttributes() {
    return {
      id: null,
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
    const pid = uuid();
    if (!node.attrs.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = pid;
    }
    return ["p", mergeAttributes(this.options.HTMLAttributes, { id: pid }, HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
});
