<template>
  <div class="flex place-content-center bg-gray-200">
    <div class="p-2 divide-y">
      <div class="bg-white shadow p-2 divide-y divide-gray-400">
        <vue-file-toolbar-menu v-for="(content, index) in menus" :key="'bar-' + index" :content="content" />
      </div>
      <editor-content :editor="editor" :style="{ width: bodyWidth + 'px' }" />
    </div>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance, reactive } from "vue";
import applyDevTools from "prosemirror-dev-tools";
import { EditorContent, Editor } from "@tiptap/vue-3";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueFileToolbarMenu from "vue-file-toolbar-menu";
import { onBeforeUnmount, onMounted, shallowRef } from "vue";
import { BuildRender } from "@/default";
import { CassieKit } from "@/extension";
import { pageContent, headerlist, footerlist } from "./content";
import { UnitConversion } from "@/extension/page/core";
import emitter from "@/coolmitt";
const unitConversion = new UnitConversion();
export default {
  components: { EditorContent, VueFileToolbarMenu },
  setup() {
    const { ctx } = getCurrentInstance();
    const h = unitConversion.mmConversionPx(148);
    const w = unitConversion.mmConversionPx(210);
    let bodyWidth = w;
    const menulist = [
      { classify: "radio", label: "单选", value: "radio" },
      {
        classify: "checkbox",
        label: "多选",
        value: "checkbox"
      },
      {
        classify: "date",
        label: "日期",
        value: "date"
      }
    ];
    const editor = shallowRef<Editor>();
    const menus = shallowRef<any>();
    onMounted(() => {
      //如果是协作模式 设置 content需要滞后 否则会重复添加
      editor.value = new Editor({
        content: pageContent,
        injectCSS: false,
        extensions: [
          CassieKit.configure({
            textAlign: { types: ["heading", "paragraph"] },
            mention: {
              HTMLAttributes: {
                class: "bg-gray-300"
              },
              clickSuggestion: BuildRender(menulist) //编辑器右键菜单
            },
            page: {
              footerHeight: 100,
              headerHeight: 100,
              bodyHeight: h - 100,
              bodyWidth: bodyWidth,
              bodyPadding: 10,
              isPaging: true,
              design: false,
              headerData: headerlist,
              footerData: footerlist
            },
            focus: { mode: "Node", className: "has-focus" }, //选中样式
            history: false //历史记录回退 协作模式禁止开启
          })
        ]
      });
      menus.value = [
        [
          {
            icon: "settings_suggest",
            text: "续打设置",
            title: "连续打印设置",
            click() {
              editor.value?.setEditable(false, true);
            }
          },
          {
            icon: "print",
            text: "打印",
            title: "保存页眉页脚",
            click() {
              console.log("");
            }
          }
        ]
      ];
      applyDevTools(editor.value.view);
    });
    onBeforeUnmount(() => {
      editor.value?.destroy();
      emitter.all.clear();
    });

    return { h, w, pageContent, menulist, headerlist, footerlist, editor, bodyWidth, menus };
  }
};
</script>
<style scoped></style>
