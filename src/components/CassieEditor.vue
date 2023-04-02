<template>
  <div class="flex place-content-center bg-gray-200">
    <editor-content :editor="editor" :style="{ width: bodyWidth + 'px' }" />
  </div>
</template>

<script lang="ts">
import { EditorContent, Extensions, Editor } from "@tiptap/vue-3";
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, shallowRef, unref, watchEffect } from "vue";
import { BuildRender, ContextMenuOptions } from "@/default";
import { CassieKit } from "@/extension";
import * as Y from "yjs";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { HocuspocusProvider } from "@hocuspocus/provider";
export default defineComponent({
  name: "cassie-editor",
  components: {
    EditorContent
  },
  props: {
    content: {
      type: [Object, String]
    },
    menuList: {
      type: Array as PropType<ContextMenuOptions[]>
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
      default: 400
    },
    bodyWidth: {
      type: Number,
      default: 700
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
      default: "html"
    },
    class: {
      type: String,
      default: ""
    },
    spellcheck: {
      type: Boolean,
      default: false
    },
    collaborationUrl: {
      type: String,
      default: undefined
    },
    user: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: { name: "John Doe", color: "#ffcc00" }
    }
  },
  setup(props, { emit }) {
    const ydoc = new Y.Doc();
    const editor = shallowRef<Editor>();
    const provider = shallowRef<HocuspocusProvider>();
    onMounted(() => {
      provider.value = new HocuspocusProvider({
        url: props.collaborationUrl || "",
        name: "1",
        document: ydoc,
        onStatus: (data) => {
          emit("onStatus", data, editor);
        },
        onSynced: (data) => {
          if (editor.value && editor.value.storage.collaborationCursor.users.length == 1) {
            if (props.content) {
              editor.value.commands.setContent(props.content);
            }
          }
        }
      });
      editor.value = new Editor({
        content: props.collaborationUrl ? null : props.content,
        onCreate: (options) => {
          emit("onCreate", options);
        },
        onTransaction: (options) => {
          emit("onTransaction", options);
        },
        onFocus: (options) => {
          emit("onFocus", options);
        },
        onBlur: (options) => {
          emit("onBlur", options);
        },
        onDestroy: (options) => {
          emit("onDestroy", options);
        },
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
        onSelectionUpdate({ editor }) {
          emit("onSelectionUpdate", editor);
        },
        editorProps: {
          attributes: {
            class: props.class
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
              clickSuggestion: BuildRender(props.menuList)
            },
            page: { ...props },
            focus: { mode: "Node", className: "has-focus" },
            history: false
          }),
          Collaboration.configure({
            document: ydoc
          }),
          CollaborationCursor.configure({
            provider: provider.value,
            //这里应该使用当前你的登录用户
            user: props.user
          })
        ]
      });
    });

    onBeforeUnmount(() => {
      editor.value?.destroy();
      provider.value?.destroy();
    });

    watchEffect(() => {
      unref(editor)?.setOptions({
        editorProps: {
          attributes: {
            spellcheck: String(props.spellcheck)
          }
        }
      });
    });
    return { editor };
  }
});
</script>
<style scoped></style>
