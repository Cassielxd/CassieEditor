import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const ySyncPluginKey = new PluginKey("custom-cursor");
export const cursorPlugin = () => {
  return new Plugin({
    key: ySyncPluginKey,
    props: {
      decorations: (state) => {
        const { selection } = state;
        const decorations: Decoration[] = [];
        decorations.push(
          Decoration.widget(
            selection.head,
            () =>
              defaultCursorBuilder({
                name: "我是一个光标",
                color: "orange"
              }),
            {
              key: "default",
              side: 10
            }
          )
        );
        return DecorationSet.create(state.doc, decorations);
      }
    }
  });
};
export const defaultCursorBuilder = (user: any) => {
  const cursor = document.createElement("span");
  cursor.classList.add("custom-cursor");
  cursor.setAttribute("style", `border-color: ${user.color}`);
  const userDiv = document.createElement("div");
  userDiv.setAttribute("style", `background-color: ${user.color}`);
  userDiv.insertBefore(document.createTextNode(user.name), null);
  const nonbreakingSpace1 = document.createTextNode("\u2060");
  const nonbreakingSpace2 = document.createTextNode("\u2060");
  cursor.insertBefore(nonbreakingSpace1, null);
  cursor.insertBefore(userDiv, null);
  cursor.insertBefore(nonbreakingSpace2, null);
  return cursor;
};

export const defaultSelectionBuilder = (user: any) => {
  return {
    style: `background-color: ${user.color}70`,
    class: "ProseMirror-yjs-selection"
  };
};
