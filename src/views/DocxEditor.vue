<template>
  <div class="flex w-full">
    <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
      <div class="bg-white shadow p-2 bars">
        <vue-file-toolbar-menu v-for="(content, index) in menus" :key="'bar-' + index" :content="content" />
      </div>
      <editor-content class="bg-white" :editor="editor" :style="{ width: w + 'px', height: h + 'px' }" />
    </div>
  </div>
</template>

<script lang="ts">
import { StarterKit } from "@tiptap/starter-kit";
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import { onBeforeUnmount, onMounted, reactive, ref, shallowRef } from "vue";
import { UnitConversion } from "@/extension/page/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueFileToolbarMenu from "vue-file-toolbar-menu";
import { defaultDocxSerializer, writeDocxForBlob } from "@/docx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { saveAs } from "file-saver";

const unitConversion = new UnitConversion();
//210mm x 297mm。
let w = unitConversion.mmConversionPx(210);
let h = unitConversion.mmConversionPx(297);
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
        content: `
               <h1>title1</h1>
                <h2>title2</h2>
                 <h3>title3</h3>
                  <h4>title3</h4>
                   <h5>title3</h5>
                    <h6>title3</h6>
               <p>Example Text</p><p>Example Text</p><p>Example Text</p>`, //初始化编辑器内容

        extensions: [
          StarterKit.configure({
            heading: { levels: [1, 2, 3, 4, 5, 6] }
          })
        ]
      });
    });
    return {
      editor,
      menus,
      w,
      h
    };
  }
};
</script>
<style scoped></style>
