import { EditorView, Decoration } from "@tiptap/pm/view";
import { EditorState } from "@tiptap/pm/state";
import { DOMSerializer } from "@tiptap/pm/model";
import { ChangeSet } from "../changeset";

const deletedWidget = (html: DocumentFragment, attrs: { [key: string]: string }) => (view: EditorView, getPos: () => number) => {
  const element = document.createElement("span");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  element.innerHTML = html.textContent;
  Object.keys(attrs).forEach((key) => {
    element.setAttribute(key, attrs[key]);
  });
  return element;
};

export function renderDecorations(changeSet: ChangeSet, userColors: Map<string, [string, string]>, domSerializer: DOMSerializer, startState: EditorState) {
  const decorations: Decoration[] = [];
  let allDeletionsLength = 0;
  let allInsertsLength = 0;

  changeSet.changes.forEach((change, index) => {
    let insertFrom = change.fromB;
    const { inserted, deleted } = change;
    const changeType = change.deleted.length > 0 ? (change.inserted.length > 0 ? "insert+delete" : "delete") : "insert";
    inserted.forEach((span) => {
      const spanLength = span.length;
      if (change.isChange()) {
        const colors = userColors.get(span.data.userID);
        const style = `background: ${colors ? colors[0] : ""};`;

        decorations.push(
          Decoration.inline(insertFrom, change.toB, {
            style,
            "data-change-type": changeType,
            "data-change-index": index.toString()
          })
        );
      }
      insertFrom += spanLength;
      allInsertsLength += spanLength;
    });

    let deletionsLength = 0;
    deleted.forEach((span) => {
      const spanLength = span.length;
      if (change.isChange()) {
        const start = change.fromA + deletionsLength;
        const content = startState.doc.slice(start, start + spanLength);
        const html = domSerializer.serializeFragment(content.content);
        const colors = userColors.get(span.data.userID);
        const style = `background: ${colors ? colors[1] : ""};`;
        const attrs = {
          style,
          "data-change-type": changeType,
          "data-change-index": index.toString()
        };
        decorations.push(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          Decoration.widget(start + allDeletionsLength + allInsertsLength, deletedWidget(html, attrs), {
            side: 0,
            marks: [startState.schema.marks.strikethrough.create()]
          })
        );
      }
      allDeletionsLength -= spanLength;
      deletionsLength += spanLength;
    });
  });
  return decorations;
}
