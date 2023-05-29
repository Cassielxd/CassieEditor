import { Editor, posToDOMRect, Range } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export interface SuggestionClickOptions<I = any> {
  pluginKey?: PluginKey;
  editor: Editor;
  command?: (props: { editor: Editor; range: Range; props: I }) => void;
  render?: () => {
    onHandleRightClick?: (props: SuggestionClickProps) => boolean;
    onHandleLiftClick?: (props: SuggestionClickProps) => boolean;
  };
}

export interface SuggestionClickProps<I = any> {
  editor: Editor; //编辑器实例
  clientRect?: (() => DOMRect | null) | null; //鼠标所在的位置
  command: (props: I) => void; //命令执行方法
  selectItem?: () => any; //对应的item
}

export const SuggestionClickPluginKey = new PluginKey("suggestionClick");

export function SuggestionClick<I = any>({ pluginKey = SuggestionClickPluginKey, editor, command = () => null, render = () => ({}) }: SuggestionClickOptions<I>) {
  const renderer = render?.();

  const plugin: Plugin<any> = new Plugin({
    key: pluginKey,
    props: {
      /*鼠标单击事件 event.button 等于0  左键 等于2右键*/
      handleClick: (view, _, event: MouseEvent) => {
        const { state } = view;
        const { selection, tr } = state;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { ranges, node } = selection;
        const from = Math.min(...ranges.map((range) => range.$from.pos));
        const to = Math.max(...ranges.map((range) => range.$to.pos));
        switch (event.button) {
          case 0: {
            if (renderer.onHandleLiftClick && node) {
              const props: SuggestionClickProps<I> = {
                editor,
                clientRect: () => {
                  return posToDOMRect(view, from, to);
                },
                selectItem: () => node.attrs,
                command: (commandProps) => {
                  command({
                    editor,
                    range: {
                      from,
                      to
                    },
                    props: commandProps
                  });
                }
              };
              return renderer?.onHandleLiftClick?.(props) || false;
            }
            break;
          }
          case 2: {
            if (renderer.onHandleRightClick) {
              const props: SuggestionClickProps<I> = {
                editor,
                clientRect: () => {
                  return posToDOMRect(view, from, to);
                },
                command: (commandProps) => {
                  command({
                    editor,
                    range: {
                      from,
                      to
                    },
                    props: commandProps
                  });
                }
              };
              return renderer?.onHandleRightClick?.(props) || false;
            }
            break;
          }
        }

        return false;
      }
    }
  });

  return plugin;
}
