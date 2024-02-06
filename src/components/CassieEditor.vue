<template>
  <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
    <div class="bars">
      <FileTools :editor="editor" v-if="editor"></FileTools>
    </div>
    <editor-content :editor="editor" class="my-2" />
  </div>
</template>

<script lang="ts">
//import applyDevTools from "prosemirror-dev-tools";
import { EditorContent, Editor } from "@tiptap/vue-3";
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, shallowRef, unref, watchEffect } from "vue";
import { BuildRender, ContextMenuOptions } from "@/default";
import { CassieKit } from "@/extension";
import * as Y from "yjs";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Extensions } from "@tiptap/core";
import FileTools from "@/views/filetools/FileTools.vue";
export default defineComponent({
  name: "cassie-editor",
  components: {
    FileTools,
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
      default: 1200
    },
    bodyPadding: {
      type: Number,
      default: 10
    },
    isPaging: {
      type: Boolean,
      default: true
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
    editable: {
      type: Boolean,
      default: true
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
      //协作编辑 ws url
      let extensions: Extensions = [
        CassieKit.configure({
          textAlign: { types: ["heading", "paragraph"] },
          mention: {
            clickSuggestion: BuildRender(props.menuList) //编辑器右键菜单
          },
          page: { ...props },
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
          focus: false, //选中样式
          history: false //历史记录回退 协作模式禁止开启
        })
      ];
      if (props.collaborationUrl) {
        provider.value = new HocuspocusProvider({
          url: props.collaborationUrl,
          name: "1", //这里需要修改 这里是文旦id
          document: ydoc,
          onStatus: (data) => {
            emit("onStatus", data, editor.value);
          },
          onConnect: () => {},
          onClose: (data) => {
            console.log(data);
          },
          onAwarenessChange: (data) => {
            emit("onAwarenessChange", data);
          },
          onSynced: (data) => {
            console.log(data);
            //如果当前协作文档 只有一个人 证明是第一个打开文档的 需要添加文档
            if (editor.value && editor.value.storage.collaborationCursor.users.length == 1) {
              if (props.content) {
                editor.value.commands.setContent(props.content);
              }
            }
          }
        });
        extensions.push(
          Collaboration.configure({
            document: ydoc
          })
        );
        extensions.push(
          CollaborationCursor.configure({
            provider: provider.value,
            //这里应该使用当前你的登录用户
            user: props.user
          })
        );
      }
      //如果是协作模式 设置 content需要滞后 否则会重复添加
      editor.value = new Editor({
        editable: props.editable,
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
        extensions
      });
      setTimeout(() => {
        editor.value?.view.dispatch(editor.value?.state.tr.setMeta("splitPage", true));
      }, 1000);
      //applyDevTools(editor.value.view);
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
