import { Extension, findParentNode } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { CASSIE_BLOCK } from "../nodeNames";

export interface FocusOptions {
  className: string;
  mode: string;
}

export const FocusClasses = Extension.create<FocusOptions>({
  name: "focus",

  addOptions() {
    return {
      className: "has-focus",
      mode: `${CASSIE_BLOCK}`
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("focus"),
        props: {
          /**
           * desc: 点击选中 给边框添加 className样式
           * @param doc
           * @param selection
           */
          decorations: ({ doc, selection }) => {
            const { isEditable, isFocused } = this.editor;
            const decorations: Decoration[] = [];

            if (!isEditable || !isFocused) {
              return DecorationSet.create(doc, []);
            }
            const cunNode = findParentNode((n: any) => n.type.name == this.options.mode)(selection);
            if (cunNode) {
              decorations.push(
                Decoration.node(cunNode.pos, cunNode.pos + cunNode.node.nodeSize, {
                  class: this.options.className
                })
              );
            }
            return DecorationSet.create(doc, decorations);
          }
        }
      })
    ];
  }
});
