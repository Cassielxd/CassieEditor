import { getMarkRange, Mark, mergeAttributes } from "@tiptap/vue-3";
import { Plugin, TextSelection } from "@tiptap/pm/state";

export interface CommentOptions {
  HTMLAttributes: Record<string, any>;
  isCommentModeOn: () => boolean;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    comment: {
      /**
       * Set a comment mark
       */
      setComment: (comment: string) => ReturnType;
      /**
       * Toggle a comment mark
       */
      toggleComment: () => ReturnType;
      /**
       * Unset a comment mark
       */
      unsetComment: () => ReturnType;
    };
  }
}

export const Comment = Mark.create<CommentOptions>({
  name: "comment",

  addOptions() {
    return {
      HTMLAttributes: {},
      isCommentModeOn: () => false
    };
  },

  addAttributes() {
    return {
      comment: {
        default: null,
        parseHTML: (el) => (el as HTMLSpanElement).getAttribute("data-comment"),
        renderHTML: (attrs) => ({ "data-comment": attrs.comment })
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "span.comment",
        getAttrs: (el) => !!(el as HTMLSpanElement).getAttribute("data-comment")?.trim() && null
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, { class: "comment" }, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setComment:
        (comment: string) =>
        ({ commands }) => {
          const t = commands.setMark(this.name, { comment });
          return t;
        },
      toggleComment:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
      unsetComment:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name)
    };
  },

  addProseMirrorPlugins() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const extensionThis = this;

    const plugins = [
      new Plugin({
        props: {
          handleClick(view, pos) {
            if (!extensionThis.options.isCommentModeOn()) return false;
            const { schema, doc, tr } = view.state;
            const range = getMarkRange(doc.resolve(pos), schema.marks.comment);
            if (!range) return false;
            const [$start, $end] = [doc.resolve(range.from), doc.resolve(range.to)];
            view.dispatch(tr.setSelection(new TextSelection($start, $end)));
            return true;
          }
        }
      })
    ];

    return plugins;
  }
});
