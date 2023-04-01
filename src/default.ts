import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";
import CassieContextmenu from "./components/CassieContextmenu.vue";
import CassieDate from "./components/CassieDate.vue";
import CassieSigntaure from "./components/CassieSigntaure.vue";
import CassieCheckBox from "./components/CassieCheckBox.vue";
import CassieRadio from "./components/CassieRadio.vue";
import { Editor } from "@tiptap/core";

export type ContextMenuOptions = {
  classify: string;
  label: string;
  value: string;
};
export type ContextHook = (editor: Editor, selectItem: ContextMenuOptions) => void;

export const BuildRender = (contextmenu?: ContextMenuOptions[]) => {
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
          switch (selectData.classify) {
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
            case "checkbox": {
              component = new VueRenderer(CassieCheckBox, {
                props,
                editor: props.editor
              });
              break;
            }
            case "radio": {
              component = new VueRenderer(CassieRadio, {
                props,
                editor: props.editor
              });
              break;
            }
          }
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
          if (contextmenu) {
            props.onExit = () => {
              popup[0].destroy();
              component.destroy();
            };
            component = new VueRenderer(CassieContextmenu, {
              props: {
                items: contextmenu,
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

export const pageContent = {
  type: "doc",
  content: [
    {
      type: "page",
      attrs: {
        HTMLAttributes: null,
        pageNumber: 1,
        id: "6759fec0-05b7-4a5b-ae04-16bfb6fba9bc"
      },
      content: [
        {
          type: "Node",
          attrs: {
            id: "pid_352165982dd",
            title: null,
            group: "title"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "0b4e04a4-51ea-47e7-ba20-a5042663c729",
                group: "p1"
              },
              content: [
                {
                  type: "text",
                  text: "记录时间： 日期"
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3954397982",
            title: "既往史",
            group: "body_before"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "fea620f0-dd3c-4ab5-8c85-752b51996a98",
                group: "p2"
              },
              content: [
                {
                  type: "text",
                  text: "气管哮喘病史否认支,按国家计划接种"
                },
                {
                  type: "hardBreak"
                },
                {
                  type: "text",
                  text: "卡介苗、乙肝、脊髓灰质炎、百白破、麻疹及乙脑疫苗."
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3521659828",
            title: "诊断结果",
            group: "body_result"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "bb1a5ec3-88ca-4a64-b69c-4a0361f5e434",
                group: "p3"
              },
              content: [
                {
                  type: "text",
                  text: "诊断结果正常 ,我是过渡语句 测试 日期 测试2"
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3808237023",
            title: "体格检查",
            group: "body_check"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "c5ae0525-bcaf-4117-8208-804f46612574",
                group: "p4"
              },
              content: [
                {
                  type: "text",
                  text: "发育正常，营养良好，神志清楚，主动体位，查体合作,步态正常，正常面容。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "c576357a-1eeb-49f3-8d12-ec214049ed83",
                group: "p5"
              },
              content: [
                {
                  type: "text",
                  text: "全身皮肤黏膜无黄染、无水肿，未见出血点、未见蜘蛛痣，全身浅表淋巴结未扪及肿大， 未见瘘管。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "04f2c624-b004-46ac-a5c0-4d3b02abc2e3",
                group: "p6"
              },
              content: [
                {
                  type: "text",
                  text: "头颅形态大小无畸形，畸形颅,无压痛,无肿块。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "bed29b51-a49d-4ed4-866d-d35a42b472d8",
                group: "p7"
              },
              content: [
                {
                  type: "text",
                  text: "颜面及眼睑无浮肿，双侧瞳孔等大同圆直径约3mm，对光反应灵敏。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "20acbf06-1e2d-47c0-943b-262d5b33b3b0",
                group: "p8"
              },
              content: [
                {
                  type: "text",
                  text: "口腔无异味，口唇红润光泽，黏膜正常，伸舌居中,无震颤。 耳鼻喉科情况详见专科检查。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "04d77859-c088-4c4f-af8b-17500c235e97",
                group: "p9"
              },
              content: [
                {
                  type: "text",
                  text: "胸廓双侧对称正常，胸壁无压痛。呼吸运动自如，语音震颤双侧对称正常"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
export const headerlist = [
  {
    id: 2,
    x: 312,
    y: 24,
    w: 100,
    h: 26,
    focused: false,
    value: "我是一个标题",
    label: "文字",
    component: "custom-text",
    type: "text",
    styles: {
      color: "#000000",
      fontSize: 18
    },
    handles: ["mr", "bm"]
  }
];
//页脚
export const footerlist = [
  {
    id: 3,
    x: 292,
    y: 19,
    w: 100,
    h: 26,
    focused: false,
    value: "我是一个页脚",
    label: "文字",
    component: "custom-text",
    type: "text",
    styles: {
      color: "#000000",
      fontSize: 18
    },
    handles: ["mr", "bm"]
  },
  {
    id: 4,
    x: 636,
    y: 43,
    w: 100,
    h: 26,
    focused: false,
    value: "第一页",
    label: "页码",
    component: "page-count",
    type: "text",
    styles: {
      color: "#000000",
      fontSize: 18
    },
    handles: ["mr", "bm"]
  }
];
