<template>
  <div class="flex place-content-center bg-gray-200">
    <div>
      <div class="tabs">
        <a class="tab tab-lifted" :class="active == 1 ? 'tab-active' : ''" @click="change(1)">差异</a>
        <a class="tab tab-lifted" :class="active == 2 ? 'tab-active' : ''" @click="change(2)">新版</a>
        <a class="tab tab-lifted" :class="active == 3 ? 'tab-active' : ''" @click="change(3)">旧版</a>
      </div>

      <editor-content v-show="active == 1" :editor="diff" />
      <editor-content v-show="active == 2" :editor="newEditor" />
      <editor-content v-show="active == 3" :editor="oldEditor" />
    </div>
  </div>
</template>

<script lang="ts">
import { CassieKit } from "@/extension/CassieKit";

import { EditorContent } from "@tiptap/vue-3";

import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { UnitConversion } from "@/extension/page/core";

import { newContent, pageOldContent, headerlist, footerlist } from "./content";
import { getSchema } from "@tiptap/core";
import { DOMSerializer, Node } from "@tiptap/pm/model";
import { recreateTransform } from "@/extension/track/recreate-steps";
import { ChangeSet } from "@/extension/track/changeset";
import applyDevTools from "prosemirror-dev-tools";
import { Editor } from "@tiptap/vue-3";
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { renderDecorations } from "@/extension/track/track-changes/renderDecorations";
import { DecorationSet } from "@tiptap/pm/view";
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
    //核心方法 比较两个文档 并根据oldDoc 一步步生成 tr  steps 就是 痕迹
    const tr = recreateTransform(oldD, newD);
    const changeSet = ChangeSet.create(oldD).addSteps(oldD, tr.doc, tr.steps, { userID: "1" });
    const newEditor = shallowRef<Editor>();
    const oldEditor = shallowRef<Editor>();
    const diff = shallowRef<Editor>();

    onMounted(() => {
      newEditor.value = new Editor(Object.assign({}, option, { content: newContent, extensions: extensions }));
      oldEditor.value = new Editor(Object.assign({}, option, { content: pageOldContent, extensions: extensions }));
      let startState = EditorState.create({ doc: oldD });
      let domSerializer: DOMSerializer;
      diff.value = new Editor(Object.assign({}, option, { content: tr.doc.toJSON(), extensions: extensions }));
      diff.value.registerPlugin(
        new Plugin({
          props: {
            decorations(state) {
              domSerializer = state.schema.cached?.domSerializer || DOMSerializer.fromSchema(state.schema);
              const userColors = new Map();
              userColors.set("1", ["greenyellow", "#ffa4a4"]);
              const decorations = renderDecorations(changeSet, userColors, domSerializer, startState);
              return DecorationSet.create(tr.doc, decorations);
            }
          }
        })
      );
      applyDevTools(diff.value.view);
    });

    onBeforeUnmount(() => {
      newEditor.value?.destroy();
      oldEditor.value?.destroy();
      diff.value?.destroy();
    });
    return {
      diff,
      newEditor,
      oldEditor,
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
