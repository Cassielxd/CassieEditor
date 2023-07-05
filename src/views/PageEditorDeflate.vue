<template>
  <div class="flex place-content-center bg-gray-200">
    <editor-content :editor="editor" :style="{ width: bodyWidth + 'px' }" />
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from "vue";
import { pageContent, headerlist, footerlist } from "./content";
import { UnitConversion } from "@/extension/page/core";
import { EditorContent, Editor } from "@tiptap/vue-3";
import { onBeforeUnmount, onMounted, PropType, ref, shallowRef, unref, watchEffect } from "vue";
import { BuildRender, ContextMenuOptions } from "@/default";
import { CassieKit } from "@/extension";
const unitConversion = new UnitConversion();
export default {
  components: {
    EditorContent
  },
  setup() {
    const { ctx } = getCurrentInstance();
    const h = unitConversion.mmConversionPx(148);
    const bodyWidth = unitConversion.mmConversionPx(210);
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
    const onUpdate = (output: any, editor: any) => {
      /*      console.log(output);
            console.log(editor);*/
    };
    const onCreate = (option: any) => {
      console.log(option);
    };
    const editor = shallowRef<Editor>();
    onMounted(() => {
      //如果是协作模式 设置 content需要滞后 否则会重复添加
      editor.value = new Editor({
        editable: true,
        content: pageContent,
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
              HTMLAttributes: {
                class: "bg-gray-300"
              },
              clickSuggestion: BuildRender(menulist) //编辑器右键菜单
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
      //applyDevTools(editor.value.view);
    });

    onBeforeUnmount(() => {
      editor.value?.destroy();
    });

    watchEffect(() => {
      unref(editor)?.setOptions({
        editorProps: {
          attributes: {
            spellcheck: String(false)
          }
        }
      });
    });

    return { pageContent, menulist, headerlist, footerlist, onUpdate, onCreate, editor, bodyWidth };
  }
};
</script>
<style scoped></style>
