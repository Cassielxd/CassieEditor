<template>
  <div class="flex w-full">
    <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
      <div class="bg-white shadow p-2 bars">
        <vue-file-toolbar-menu v-for="(content, index) in menus" :key="'bar-' + index" :content="content" />
      </div>
      <editor-content class="bg-white" :editor="editor" style="width:800px; height: 1200px;" />
    </div>
  </div>
</template>

<script lang="ts">

import { StarterKit } from "@tiptap/starter-kit";
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import { onBeforeUnmount, onMounted, reactive, ref, shallowRef } from "vue";
import { Editor as E } from "@tiptap/core";
import { UnitConversion } from "@/extension/page/core";
import { pageContent, headerlist, footerlist } from "./content";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueFileToolbarMenu from "vue-file-toolbar-menu";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import format from "date-fns/format";
import { DiffExtension } from "@/extension/track";
import { defaultDocxSerializer, writeDocxForBlob } from "@/docx";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { saveAs } from "file-saver";
const unitConversion = new UnitConversion();
export default {
  components: {
    VueFileToolbarMenu,
    EditorContent
  },
  setup() {

    const { log } = console;


    const editor = shallowRef<Editor>();
    const opts = {
      getImageBuffer(src: string) {
        return "";
      }
    };
    const menus = reactive([
      [
        {
          icon: "save",
          text: "导出",
          title: "导出world",
          click() {
            let doc = editor.value?.state.doc;
            const wordDocument = defaultDocxSerializer.serialize(doc, opts);
            writeDocxForBlob(wordDocument, (blob) => {
              console.log(blob);
              saveAs(blob, "example.docx");
              console.log("Document created successfully");
            });
          }
        }
      ]
    ]);


    onBeforeUnmount(() => {
      editor.value?.destroy();
    });
    onMounted(() => {
      //编辑器实例
      editor.value = new Editor({
        editorProps: {
          attributes: {
            class: ""
          }
        },
        content: '<p>Example Text</p>', //初始化编辑器内容
        injectCSS: false,
        extensions: [StarterKit]
      });
    });
    return {
      editor,
      menus
    };
  }
};
</script>
<style>
</style>
