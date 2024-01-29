import { mergeAttributes, Node } from "@tiptap/core";
import { Heading, HeadingOptions } from "@tiptap/extension-heading";
import { Level } from "@tiptap/extension-heading/src/heading";
import { getId } from "@/utils/id";

export const EmrHeading = Heading.extend({
  group: "block",
  content: "inline*",
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
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
  /* renderHTML({ node, HTMLAttributes }) {
    if (HTMLAttributes.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = HTMLAttributes.id;
    }
    return ["p", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
*/
  renderHTML({ node, HTMLAttributes }) {
    if (HTMLAttributes.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = HTMLAttributes.id;
    }
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
});
