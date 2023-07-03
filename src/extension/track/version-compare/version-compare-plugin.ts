import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Change, ChangeSet } from "../changeset";
import { CassieKit } from "@/extension";
import { footerlist, headerlist } from "@/views/content";
import { CVExtension } from "@/extension/track/CompareVersionExtension";
import { renderDecorations } from "@/extension/track/track-changes/renderDecorations";
import { DOMSerializer, Node } from "@tiptap/pm/model";
import { trackChangesPluginKey } from "@/extension/track/track-changes/track-changes-plugin";
export const versionComparePluginKey = new PluginKey("version-compare");

const colorScheme: [string, string][] = [
  ["greenyellow", "#ffa4a4"],
  ["#10c727", "#ff0707"],
  ["#7adcb8", "#f93aa2"]
];

export interface VersionCompareState {
  changeSet: ChangeSet;
}
let domSerializer: DOMSerializer;
export const versionComparePlugin = (change: ChangeSet, doc: Node, startState: EditorState) => {
  return new Plugin<VersionCompareState>({
    key: versionComparePluginKey,
    state: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      init(config, state) {
        domSerializer = state.schema.cached?.domSerializer || DOMSerializer.fromSchema(state.schema);
        return {
          decorationSet: DecorationSet.empty
        };
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      apply(tr, value, oldState, newState) {
        const userColors = new Map();
        userColors.set("1", colorScheme[userColors.size]);
        const decorations = renderDecorations(change, userColors, domSerializer, startState);
        return {
          decorationSet: DecorationSet.create(tr.doc, decorations),
          newState
        };
      }
    },
    props: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      decorations(state) {
        return versionComparePluginKey.getState(state).decorationSet;
      }
    }
  });
};
