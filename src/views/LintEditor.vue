<template>
  <div class="main">
    <div class="page" style="width: 780px">
      <editor-content :editor="editor" class="editor" />
    </div>
  </div>
</template>

<script lang="ts">
import { CassieKit } from "../extension/CassieKit";
import Linter, { BadWords, HeadingLevel, Punctuation } from "../extension/linter";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { onBeforeUnmount, reactive } from "vue";

export default {
  components: { EditorContent },
  setup() {
    let editor = reactive(
      new Editor({
        content: `<page>
                      <h1>
                      这是一个h1标签
                      </h1>
                       <pp> 这个单词有问题 clearly </pp>
                      <pp> <br class="ProseMirror-trailingBreak"> </pp>
                       <h3>我是一个h3标题</h3>
                 </page>`, //初始化编辑器内容

        injectCSS: false,
        extensions: [
          CassieKit.configure({
            focus: false,
            page: {
              bodyHeight: 400,
              bodyWidth: 780,
              bodyPadding: 10
            }
          }),
          Linter.configure({
            plugins: [BadWords, Punctuation, HeadingLevel]
          })
        ]
      })
    );
    onBeforeUnmount(() => {
      editor.destroy();
    });
    return { editor };
  }
};
</script>

<style lang="scss"></style>
