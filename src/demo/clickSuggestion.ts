import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";
import CassieContextmenu from "../components/CassieContextmenu.vue";

export type ContextMenuOptions = {
  type: string;
  label: string;
  value: string;
};

export type SuggestionOptions = {
  contextmenu?: ContextMenuOptions[];
  contextHook?: (editor: any, selectItem: ContextMenuOptions) => void;
};

export const BuildRender = (params: SuggestionOptions) => {
  return {
    render: () => {
      let component: any;
      let popup: any;

      return {
        /*左键点击事件 如果点击到 自定义的 block 会触发这个事件 */
        onHandleLiftClick: (props: any): boolean => {
          props.onExit = () => {
            popup[0].destroy();
            component.destroy();
          };
          const selectData = props.selectItem();

          /* switch (selectData.bustype) {
            case "date": {
              component = new VueRenderer(CassieDate, {
                props,
                editor: props.editor
              });
              break;
            }
            case "image": {
              component = new VueRenderer(CassieSigntaure, {
                props,
                editor: props.editor
              });
              break;
            }
            case "mutselect": {
              component = new VueRenderer(CassieCheckBox, {
                props,
                editor: props.editor
              });
              break;
            }
            case "select": {
              component = new VueRenderer(CassieRadio, {
                props,
                editor: props.editor
              });
              break;
            }
          }*/
          if (component) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore

            if (!props.clientRect) {
              return false;
            }
            popup = tippy("body", {
              getReferenceClientRect: props.clientRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: "manual",
              placement: "bottom-start"
            });
          }

          return true;
        },
        /*右键菜单处理方法*/
        onHandleRightClick: (props: any): boolean => {
          if (params?.contextmenu) {
            props.onExit = () => {
              popup[0].destroy();
              component.destroy();
            };
            component = new VueRenderer(CassieContextmenu, {
              props: {
                items: params?.contextmenu,
                contextHook: params?.contextHook,
                ...props
              },
              editor: props.editor
            });

            if (!props.clientRect) {
              return false;
            }
            popup = tippy("body", {
              getReferenceClientRect: props.clientRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: "manual",
              placement: "bottom-start"
            });
          }

          return true;
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        }
      };
    }
  };
};
