<template>
  <div class="flex place-content-center bg-gray-200">
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item v-for="(widget, index) in wlist" :key="index" @click="(e: any) => menuclick(e, widget)">
        {{ widget.label }}
      </v-contextmenu-item>
      <v-contextmenu-divider />
      <v-contextmenu-item v-if="currentindex < 10000" @click="onLayerRemove()">删除</v-contextmenu-item>
    </v-contextmenu>
    <v-contextmenu ref="componetmenu">
      <v-contextmenu-divider />
    </v-contextmenu>
    <div class="my-1">
      <div class="bg-white shadow p-2 divide-y divide-gray-400 bars">
        <vue-file-toolbar-menu v-for="(content, index) in menus" :key="'bar-' + index" :content="content" />
      </div>
      <div class="Page text-editor my-2" :style="{ width: bodyWidth + 'px' }">
        <div class="relative header" @mousedown.stop="unFocus(true)" v-contextmenu:contextmenu :style="{ height: headerHeight + 'px' }">
          <Vue3DraggableResizable
            v-for="(item, i) in headerlist"
            :key="i"
            :initW="item.w"
            :initH="item.h"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :active="item.focused"
            :parent="true"
            :draggable="true"
            :resizable="true"
            @mousedown.stop="onFocus(i, true)"
            @dragging="(e) => onDragStartCallback(e, item)"
            @resizing="(e) => onResize(e, item)"
          >
            <component class="min-w-full min-h-full" :is="item.component" :value="item.value" @inpuvalue="(v: any) => updateValue(item, v)" :styles="item.styles" />
          </Vue3DraggableResizable>
        </div>
        <editor-content :editor="editor" />
        <div class="relative footer" @mousedown.stop="unFocus(false)" v-contextmenu:contextmenu :style="{ height: footerHeight + 'px' }">
          <Vue3DraggableResizable
            v-for="(item, i) in footerlist"
            :key="i"
            :initW="item.w"
            :initH="item.h"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :active="item.focused"
            :parent="true"
            :draggable="true"
            :resizable="true"
            @mousedown.stop="onFocus(i, false)"
            @dragging="(e) => onDragStartCallback(e, item)"
            @resizing="(e) => onResize(e, item)"
          >
            <component class="min-w-full min-h-full" :is="item.component" :value="item.value" @inpuvalue="(v: any) => updateValue(item, v)" :styles="item.styles" />
          </Vue3DraggableResizable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CassieKit } from "@/extension/CassieKit";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { BuildRender } from "../demo/clickSuggestion";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Vue3DraggableResizable from "vue3-draggable-resizable";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueFileToolbarMenu from "vue-file-toolbar-menu";
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { directive, Contextmenu, ContextmenuItem, ContextmenuDivider, ContextmenuSubmenu } from "v-contextmenu";
import "v-contextmenu/dist/themes/default.css";

import { onBeforeUnmount, reactive, ref, defineComponent, PropType, defineExpose } from "vue";

let currentId = 1;
export default defineComponent({
  name: "CassieDesignEditor",
  directives: {
    contextmenu: directive
  },
  components: {
    EditorContent,
    // eslint-disable-next-line vue/no-unused-components
    VueFileToolbarMenu,
    // eslint-disable-next-line vue/no-unused-components
    Vue3DraggableResizable,
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
    [ContextmenuSubmenu.name]: ContextmenuSubmenu,
    [ContextmenuDivider.name]: ContextmenuDivider
  },
  props: {
    content: {
      type: Object,
      default: undefined
    },
    footerHeight: {
      type: Number,
      default: 100
    },
    headerHeight: {
      type: Number,
      default: 100
    },
    bodyHeight: {
      type: Number,
      default: 700
    },
    bodyWidth: {
      type: Number,
      default: 800
    },
    bodyPadding: {
      type: Number,
      default: 10
    },
    isPaging: {
      type: Boolean,
      default: false
    },
    headerData: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    footerData: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    output: {
      type: String,
      default: "json"
    },
    widgetList: {
      type: Array,
      default: undefined
    }
  },
  setup(props, { emit }) {
    let header = ref(true);
    let currentindex = ref(0);
    //页眉data
    let headerlist: any[] = reactive(props.headerData);
    //页脚
    let footerlist: any[] = reactive(props.footerData);
    //编辑器实例
    let editor = reactive(
      useEditor({
        onUpdate({ editor }) {
          let output;
          if (props.output === "html") {
            output = editor.getHTML();
          } else {
            output = editor.getJSON();
          }
          emit("update:content", output);
          emit("onUpdate", output, editor);
        },
        editorProps: {
          attributes: {
            class: "divide-y divide-black-600"
          }
        },
        content: props.content, //初始化编辑器内容
        injectCSS: false,
        extensions: [
          CassieKit.configure({
            textAlign: { types: ["heading", "paragraph"] },
            mention: {
              HTMLAttributes: {
                class: "bg-gray-300"
              },
              clickSuggestion: BuildRender({})
            },
            page: {
              mode: 3,
              ...props
            },
            focus: false
          })
        ]
      })
    );

    //子组件更新属性
    function updateValue(item: any, v: any) {
      item.value = v;
    }

    //失去焦点处理
    function unFocus(h: boolean) {
      header.value = h;
      currentindex.value = 10000;
    }

    //删除组画布上的组件
    function onLayerRemove() {
      if (header.value) {
        headerlist.splice(currentindex.value);
      } else {
        footerlist.splice(currentindex.value);
      }
      unFocus(header.value);
    }

    //选中组件
    function onFocus(c: number, h: boolean) {
      header.value = h;
      currentindex.value = c;
    }

    //TODO 改变组件大小方法
    function onResize(e: any, item: any) {
      item.x = e.x;
      item.y = e.y;
      item.w = e.w;
      item.h = e.h;
    }

    //TODO 组件拖拽方法
    function onDragStartCallback(e: any, item: any) {
      item.x = e.x;
      item.y = e.y;
    }

    //右键菜单点击按钮
    function menuclick(e: any, currentWidget: any) {
      const newItem = {
        id: currentId++,
        x: e.offsetX,
        y: e.offsetY,
        ...currentWidget.default, // 生成默认的宽高数据 w, h, value
        label: currentWidget.label,
        focused: false,
        component: currentWidget.component, // 新增的组件名
        type: currentWidget.type, // 新增组件的类型
        styles: {} // 新增组件的类型
      };
      if (header.value) {
        headerlist.push(newItem);
      } else {
        footerlist.push(newItem);
      }
    }

    const getHeaderAndFooter = () => {
      return { headerlist, footerlist };
    };
    defineExpose({
      getHeaderAndFooter
    });
    //系统组件相关
    let widgetList: any[] = reactive([]);
    if (props.widgetList) {
      widgetList = reactive(props.widgetList);
    }

    const menus = reactive([
      [
        {
          icon: "save",
          text: "保存",
          title: "保存页眉页脚",
          click() {
            console.log(getHeaderAndFooter());
          }
        }
      ]
    ]);
    return {
      wlist: widgetList,
      header,
      currentindex,
      headerlist,
      footerlist,
      editor,
      updateValue,
      onLayerRemove,
      unFocus,
      onFocus,
      onResize,
      onDragStartCallback,
      menuclick,
      menus
    };
  }
});
</script>
<style scoped>
.ProseMirror-focused {
}
.header {
  border-bottom: 1px solid;
}
.footer {
  border-top: 1px solid;
}

:root {
  --bar-font-color: rgb(32, 33, 36);
  --bar-font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
  --bar-font-size: 15px;
  --bar-font-weight: 500;
  --bar-letter-spacing: 0.2px;
  --bar-padding: 3px;
  --bar-button-icon-size: 20px;
  --bar-button-padding: 4px 6px;
  --bar-button-radius: 4px;
  --bar-button-hover-bkg: rgb(241, 243, 244);
  --bar-button-active-color: rgb(26, 115, 232);
  --bar-button-active-bkg: rgb(232, 240, 254);
  --bar-button-open-color: rgb(32, 33, 36);
  --bar-button-open-bkg: rgb(232, 240, 254);
  --bar-menu-bkg: white;
  --bar-menu-border-radius: 0 0 3px 3px;
  --bar-menu-item-chevron-margin: 0;
  --bar-menu-item-hover-bkg: rgb(241, 243, 244);
  --bar-menu-item-padding: 5px 8px 5px 35px;
  --bar-menu-item-icon-size: 15px;
  --bar-menu-item-icon-margin: 0 9px 0 -25px;
  --bar-menu-padding: 6px 1px;
  --bar-menu-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  --bar-menu-separator-height: 1px;
  --bar-menu-separator-margin: 5px 0 5px 34px;
  --bar-menu-separator-color: rgb(227, 229, 233);
  --bar-separator-color: rgb(218, 220, 224);
  --bar-separator-width: 1px;
  --bar-sub-menu-border-radius: 3px;
}
.bars > .bar:first-child {
  border-bottom: 1px solid rgb(218, 220, 224);
  margin-bottom: 3px;
}
</style>
