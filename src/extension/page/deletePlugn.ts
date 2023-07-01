// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { EditorState, Plugin, PluginKey, Selection, TextSelection, Transaction } from "@tiptap/pm/state";
import { Editor, findParentNode } from "@tiptap/core";
import { PAGE, PARAGRAPH } from "@/extension/nodeNames";
import { ReplaceStep } from "@tiptap/pm/transform";
import { Schema, Slice } from "@tiptap/pm/model";
import { findParentNodeClosestToPos } from "@tiptap/core/src/helpers/findParentNodeClosestToPos";
type DeletePluginState = {
  specialdelete: boolean;
};

export const deletePluginKey = new PluginKey("delete-pagination");
export const deletePlugin = (editor: Editor) => {
  const plugin: Plugin = new Plugin<DeletePluginState>({
    key: deletePluginKey,
    state: {
      init: (): PluginState => ({
        specialdelete: false
      }),
      apply: (tr, prev): PluginState => {
        const next: DeletePluginState = { ...prev };
        const deleting: boolean = tr.getMeta("specialdelete");
        next.specialdelete = deleting ? deleting : false;
        return next;
      }
    },
    appendTransaction([newTr], _prevState, state) {
      const { specialdelete } = this.getState(state);
      let { tr } = state;
      const { $anchor } = state.selection;
      const { pos } = $anchor;
      if (specialdelete) {
        /*
         * 获取上一页的 的 最后一点 将光标设置过去
         * */
        const vm = TextSelection.create(state.doc, pos - 20, pos - 20);
        const beforePageNode = findParentNode((node) => node.type.name === PAGE)(vm);
        //找到上一个page 获取到最后一个点 然后设置 光标选中
        if (beforePageNode) {
          const pos1 = Selection.atEnd(beforePageNode.node).from + beforePageNode.start;
          tr.step(new ReplaceStep(pos1, pos, Slice.empty));
          return tr.scrollIntoView();
        }
      }
    }
  });
  return plugin;
};
