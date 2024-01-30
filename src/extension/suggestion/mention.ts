import { mergeAttributes, Node } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { PluginKey, TextSelection } from "@tiptap/pm/state";
import { SuggestionClick, SuggestionClickOptions } from "@/extension/suggestion/mouseSuggestion";


export type MentionOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: { options: MentionOptions; node: ProseMirrorNode }) => string;
  clickSuggestion: Omit<SuggestionClickOptions, "editor">;
};

export const MentionClickPluginKey = new PluginKey("mentionClick");

export const Mention = Node.create<MentionOptions>({
  name: "mention",

  addOptions() {
    return {
      HTMLAttributes: {
        class: "mention"
      },
      renderLabel({ options, node }) {
        return `${node.attrs.label ?? node.attrs.id}`;
      },
      clickSuggestion: {
        pluginKey: MentionClickPluginKey,
        command: ({ editor, range, props }) => {
          if (!editor.options.editable) return;
          editor
            .chain()
            .focus()
            .insertContent([
              {
                type: this.name,
                attrs: props
              }
            ])
            .run();
          window.getSelection()?.collapseToEnd();
        }
      }
    };
  },

  group: "inline",

  inline: true,
  //是否能选中
  selectable: true,
  atom: true,
  addAttributes() {
    return {
      classify: {
        default: "default",
        parseHTML: (element) => element.getAttribute("classify"),
        renderHTML: (attributes) => {
          if (!attributes.classify) {
            return {};
          }

          return {
            classify: attributes.classify
          };
        }
      },
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            id: attributes.id
          };
        }
      },
      delete: {
        default: "true",
        parseHTML: (element) => element.getAttribute("delete"),
        renderHTML: (attributes) => {
          if (!attributes.delete) {
            return {};
          }
          return {
            delete: attributes.delete
          };
        }
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute("label"),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            label: attributes.label
          };
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[type="${this.name}"]`
      }
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes({ type: this.name }, this.options.HTMLAttributes, HTMLAttributes),
      this.options.renderLabel({
        options: this.options,
        node
      })
    ];
  },

  renderText({ node }) {
    return this.options.renderLabel({
      options: this.options,
      node
    });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMention = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              /*根据配置看是否需要删除 默认是不删跳过的*/
              if (node.attrs.delete == "true") {
                tr.insertText("", pos, pos + node.nodeSize);
                isMention = true;
              } else {
                const after = TextSelection.create(tr.doc, pos - node.nodeSize, pos - node.nodeSize);
                tr.setSelection(after);
              }
              return false;
            }
          });

          return isMention;
        })
    };
  },
  addProseMirrorPlugins() {
    if (!this.editor.options.editable) return [];
    return [
      SuggestionClick({
        editor: this.editor,
        ...this.options.clickSuggestion
      })
    ];
  }
});
