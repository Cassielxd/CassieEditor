<template>
  <div class="flex place-content-center bg-gray-200">
    <div>
      <div class="tabs">
        <a class="tab tab-lifted" :class="active == 1 ? 'tab-active' : ''" @click="change(1)">差异</a>
        <a class="tab tab-lifted" :class="active == 2 ? 'tab-active' : ''" @click="change(2)">新版</a>
        <a class="tab tab-lifted" :class="active == 3 ? 'tab-active' : ''" @click="change(3)">旧版</a>
      </div>

      <editor-content v-show="active == 1" :editor="diff" />
      <editor-content v-show="active == 2" :editor="editor1" />
      <editor-content v-show="active == 3" :editor="editor2" />
    </div>
  </div>
</template>

<script lang="ts">
import { CassieKit } from "@/extension/CassieKit";

import { useEditor, EditorContent } from "@tiptap/vue-3";

import { onBeforeUnmount, onMounted, reactive, ref, shallowRef } from "vue";
import { UnitConversion } from "@/extension/page/core";

import { newContent, pageOldContent, headerlist, footerlist } from "./content";
import { CVExtension } from "@/extension/track/CompareVersionExtension";
import { getSchema } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
import { recreateTransform } from "@/extension/track/recreate-steps";
import { ChangeSet } from "@/extension/track/changeset";
import applyDevTools from "prosemirror-dev-tools";
import { Editor } from "@tiptap/vue-3";
import { EditorState } from "@tiptap/pm/state";
const unitConversion = new UnitConversion();
export default {
  components: {
    EditorContent
  },
  setup() {
    const h = unitConversion.mmConversionPx(148);
    const w = unitConversion.mmConversionPx(210);
    let extensions = [
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
      })
    ];
    let option = {
      editorProps: {
        attributes: {
          class: "divide-y divide-black-600"
        }
      },
      content: "", //初始化编辑器内容
      injectCSS: false,
      extensions: extensions
    };
    const active = ref(1);
    const change = (i: number) => {
      active.value = i;
    };
    const schema = getSchema(extensions);
    const oldD = Node.fromJSON(schema, pageOldContent);
    const newD = Node.fromJSON(schema, newContent);
    const tr = recreateTransform(oldD, newD);
    const changeSet = ChangeSet.create(oldD).addSteps(oldD, tr.doc, tr.steps, { userID: "1" });
    const editor1 = shallowRef<Editor>();
    const editor2 = shallowRef<Editor>();
    const diff = shallowRef<Editor>();

    onMounted(() => {
      editor1.value = new Editor(Object.assign({}, option, { content: newContent, extensions: extensions }));
      editor2.value = new Editor(Object.assign({}, option, { content: pageOldContent, extensions: extensions }));
      let startState = EditorState.create({ doc: oldD });

      diff.value = new Editor(Object.assign({}, option, { content: tr.doc.toJSON(), extensions: extensions.concat([CVExtension.configure({ change: changeSet, doc: tr.doc, startState })]) }));
      applyDevTools(diff.value.view);
    });

    onBeforeUnmount(() => {
      editor1.value?.destroy();
      editor2.value?.destroy();
      diff.value?.destroy();
    });
    return {
      diff,
      editor1,
      editor2,
      active,
      change
    };
  }
};
</script>
<style scoped>
.ProseMirror-focused {
}
</style>
