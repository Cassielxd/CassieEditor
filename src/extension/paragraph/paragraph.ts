import { mergeAttributes, Node } from "@tiptap/core";
import { Paragraph } from "@tiptap/extension-paragraph";
import { getId } from "@/utils/id";

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

      id: {
        parseHTML: (element: any) => element.getAttribute("id"),
        renderHTML: (attributes: any) => {
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
        parseHTML: (element: any) => element.getAttribute("data-group"),
        renderHTML: (attributes: any) => {
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
    return ["p", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
});
