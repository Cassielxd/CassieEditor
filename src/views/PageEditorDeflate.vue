<template>
  <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
    <div class="bars">
      <FileTools :editor="editor" v-if="editor"></FileTools>
    </div>
    <editor-content class="my-2" :editor="editor" />
  </div>
</template>

<script lang="ts">
import applyDevTools from "prosemirror-dev-tools";
import { pageContent, headerlist, footerlist, pageContentHtml } from "./content";
import { UnitConversion } from "@/extension/page/core";
import { EditorContent, Editor } from "@tiptap/vue-3";
import { onBeforeUnmount, onMounted, PropType, reactive, ref, shallowRef, unref, watchEffect } from "vue";
import { BuildRender, ContextMenuOptions } from "@/default";
import { CassieKit } from "@/extension";
import FileTools from "./filetools/FileTools.vue";
const unitConversion = new UnitConversion();
export default {
  components: {
    EditorContent,
    FileTools
  },
  setup() {
    let bodyWidth = unitConversion.mmConversionPx(210);
    let h = unitConversion.mmConversionPx(297);
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
    const onUpdate = (output: any, editor: any) => {};
    const onCreate = (option: any) => {
      console.log(option);
    };
    const editor = shallowRef<Editor>();
    onMounted(() => {
      //如果是协作模式 设置 content需要滞后 否则会重复添加
      editor.value = new Editor({
        onUpdate({ editor }) {
          console.log(editor.getHTML());
        },
        editable: true,
        content: pageContentHtml,
        editorProps: {
          attributes: {
            class: ""
          }
        },
        injectCSS: false,
        extensions: [
          CassieKit.configure({
            textAlign: { types: ["heading", "paragraph"] },
            mention: {
              clickSuggestion: BuildRender(menulist) //编辑器右键菜单
            },
            highlight: {
              multicolor: true
            },
            table: {
              HTMLAttributes: {
                class: "border-collapse border border-slate-400"
              }
            },
            tableCell: {
              HTMLAttributes: {
                class: "border border-slate-300"
              }
            },
            tableHeader: {
              HTMLAttributes: {
                class: "border border-slate-300"
              }
            },
            page: {
              bodyPadding: 10,
              bodyWidth: bodyWidth,
              headerHeight: 100,
              footerHeight: 60,
              bodyHeight: h - 100,
              headerData: headerlist,
              footerData: footerlist,
              isPaging: true
            },
            focus: false, //选中样式
            history: false //历史记录回退 协作模式禁止开启
          })
        ]
      });
      setTimeout(() => {
        editor.value?.view.dispatch(editor.value?.state.tr.setMeta("splitPage", true));
      }, 1000);
      //applyDevTools(editor.value.view);
    });

    onBeforeUnmount(() => {
      editor.value?.destroy();
    });
    return { pageContent, menulist, headerlist, footerlist, onUpdate, onCreate, editor, bodyWidth };
  }
};
</script>
<style scoped></style>
