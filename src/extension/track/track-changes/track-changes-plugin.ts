import { DecorationSet } from "@tiptap/pm/view";
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { DOMSerializer } from "@tiptap/pm/model";
// import { Change, ChangeSet } from 'prosemirror-changeset'
import { Change, ChangeSet } from "../changeset";

import { acceptChange, rejectChange } from "./acceptChange";
import { renderDecorations } from "./renderDecorations";
import { ExampleSchema } from "./schema";
import { TrackedChangeType } from "./types";
import { Editor, Range } from "@tiptap/core";
import { SuggestionClickProps } from "@/extension/suggestion/mouseSuggestion";

export interface TrackChangesState {
  startState: EditorState;
  changeSet: ChangeSet;
  decorationSet: DecorationSet;
  userColors: Map<string, [string, string]>;
  userID: string;
}

export const trackChangesPluginKey = new PluginKey<TrackChangesState>("track-changes");

const colorScheme: [string, string][] = [
  ["greenyellow", "#ffa4a4"],
  ["#10c727", "#ff0707"],
  ["#7adcb8", "#f93aa2"]
];
export interface TrackChangesOptions<I = any> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  render?: () => {
    view?: (props: SuggestionClickProps) => boolean;
  };
}
export const trackChangesPlugin = () => {
  let renderedPopper:
    | {
        destroy: () => void;
      }
    | undefined;
  let domSerializer: DOMSerializer;

  return new Plugin<TrackChangesState>({
    key: trackChangesPluginKey,
    state: {
      init(config, state) {
        domSerializer = state.schema.cached?.domSerializer || DOMSerializer.fromSchema(state.schema);
        return {
          startState: state,
          changeSet: ChangeSet.create(state.doc),
          decorationSet: DecorationSet.empty,
          userColors: new Map(),
          userID: "1"
        };
      },

      apply(tr, value, oldState, newState) {
        if (tr.getMeta("set-userID")) {
          return { ...value, userID: tr.getMeta("set-userID") };
        }
        const { changeSet: oldChangeSet, startState: oldStartState, userColors, userID } = value;
        let changeSet: ChangeSet;
        let startState = oldStartState;
        const acceptedChangeIndex = Number(tr.getMeta("accept-change"));
        if (!Number.isNaN(acceptedChangeIndex)) {
          [changeSet, startState] = acceptChange(acceptedChangeIndex, oldChangeSet, startState, newState);
        } else {
          changeSet = oldChangeSet.addSteps(oldState.doc, tr.doc, tr.steps, { userID });
        }

        if (!userColors.has(userID)) {
          userColors.set(userID, colorScheme[userColors.size]);
        }
        const decorations = renderDecorations(changeSet, userColors, domSerializer, startState);
        return {
          startState,
          changeSet,
          decorationSet: DecorationSet.create(tr.doc, decorations),
          userColors,
          userID
        };
      }
    },
    appendTransaction(trs, _oldState, newState) {
      const rejectedChangeTr = trs.find((tr) => !Number.isNaN(tr.getMeta("reject-change")));
      const rejectedChangeIndex = Number(rejectedChangeTr?.getMeta("reject-change"));
      const trackState = trackChangesPluginKey.getState(newState);
      if (!Number.isNaN(rejectedChangeIndex) && trackState) {
        const { changeSet, startState } = trackState;
        return rejectChange(rejectedChangeIndex, changeSet, startState, newState);
      }
      return null;
    },
    props: {
      decorations(state) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return trackChangesPluginKey.getState(state).decorationSet;
      },
      handleClickOn(view, _pos, _node, _nodePos, event, _direct) {
        const el = event.target ? (event.target as HTMLElement) : undefined;
        const dataChangeIndex = el?.getAttribute("data-change-index");
        const dataChangeType = el?.getAttribute("data-change-type");

        if (el && dataChangeIndex && dataChangeType) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const changeSet = trackChangesPluginKey.getState(view.state).changeSet;
          const changeIndex = Number(dataChangeIndex);
          const change = changeSet.changes[changeIndex];
          const changeType = dataChangeType as TrackedChangeType;
          const inserted = changeType === "insert" || changeType === "insert+delete" ? view.state.doc.textBetween(change.fromB, change.toB) : undefined;
          const deleted = changeType === "delete" || changeType === "insert+delete" ? changeSet.startDoc.textBetween(change.fromA, change.toA) : undefined;

          const props = {
            change: {
              type: changeType,
              timeStr: "02-13-2019 11:20AM",
              inserted,
              deleted,
              author: {
                name: "李医生"
              }
            },
            comments: [],
            onClose: () => {
              renderedPopper?.destroy();
            },
            onAccept: () => {
              view.dispatch(view.state.tr.setMeta("accept-change", changeIndex));
              renderedPopper?.destroy();
            },
            onReject: () => {
              view.dispatch(view.state.tr.setMeta("reject-change", changeIndex));
              renderedPopper?.destroy();
            },
            onSubmitReply: (text: string) => {
              return Promise.resolve();
            }
          };
        }
        return false;
      }
    }
  });
};
