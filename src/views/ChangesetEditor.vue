<template>
  <div class="flex place-content-center bg-gray-200">
    <editor-content :editor="editor" class="my-2" />
  </div>
</template>

<script lang="ts">
import { CassieKit } from "@/extension/CassieKit";

import { useEditor, EditorContent } from "@tiptap/vue-3";

import { reactive } from "vue";
import { DiffExtension } from "@/extension/track/DiffExtension";
import { UnitConversion } from "@/extension/page/core";

import { pageContent, headerlist, footerlist } from "./content";
const unitConversion = new UnitConversion();
export default {
  components: {
    EditorContent
  },
  setup() {
    const h = unitConversion.mmConversionPx(148);
    const w = unitConversion.mmConversionPx(210);
    //编辑器实例
    let editor = useEditor({
      editorProps: {
        attributes: {
          class: "divide-y divide-black-600"
        }
      },
      content: pageContent, //初始化编辑器内容
      injectCSS: false,
      extensions: [
        CassieKit.configure({
          textAlign: { types: ["heading", "paragraph"] },
          mention: false,
          page: {
            bodyPadding: 10,
            bodyWidth: w,
            headerHeight: 100,
            footerHeight: 60,
            bodyHeight: h - 100,
            headerData: headerlist,
            footerData: footerlist
          },
          focus: false
        }),
        DiffExtension
      ]
    });
    const menus = reactive([
      [
        {
          icon: "save",
          text: "保存",
          title: "保存页眉页脚",
          click() {
            console.log("");
          }
        }
      ]
    ]);
    return {
      editor,
      menus
    };
  }
};
</script>
<style scoped>
.ProseMirror-focused {
}
</style>
