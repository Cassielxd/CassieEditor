import { DecorationSet } from "@tiptap/pm/view";
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { DOMSerializer } from "@tiptap/pm/model";
import { Change, ChangeSet } from "../changeset";

import { acceptChange, rejectChange } from "./acceptChange";
import { renderDecorations } from "./renderDecorations";
import { TrackedChangeType } from "./types";
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
      debugger;
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
      }
    }
  });
};
