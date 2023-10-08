<template>
  <div class="flex w-full">
    <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
      <editor-content class="my-2" :editor="editor" />
      <BubbleMenu v-if="editor" :tippy-options="{ duration: 100, placement: 'bottom' }" :editor="editor" :should-show="({ editor }) => isCommentModeOn && !editor.state.selection.empty && !activeCommentsInstance.uuid" class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title">评论</h2>
          <textarea class="textarea textarea-primary" v-model="commentText" cols="30" rows="4" placeholder="添加新的批注" @keypress.enter.stop.prevent="() => setComment()" />
          <div class="card-actions">
            <button class="btn btn-accent btn-xs" @click="() => setComment()">添加</button>
            <button class="btn btn-ghost btn-xs" @click="() => (commentText = '')">清空</button>
          </div>
        </div>
      </BubbleMenu>
    </div>
    <div class="divider divider-horizontal">评论</div>
    <div class="grid flex-grow card bg-base-300 rounded-box">
      <OuterCommentVue :active-comments-instance="activeCommentsInstance" :all-comments="allComments" :format-date="formatDate" :focus-content="focusContent" :is-comment-mode-on="isCommentModeOn" @set-comment="setComment" />
    </div>
  </div>
</template>

<script lang="ts">
import OuterCommentVue from "./OuterComment.vue";
import { CassieKit, Comment } from "@/extension";
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { Editor as E } from "@tiptap/core";
import { UnitConversion } from "@/extension/page/core";
import { pageContent, headerlist, footerlist } from "./content";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import format from "date-fns/format";
import { DiffExtension } from "@/extension/track";
const unitConversion = new UnitConversion();
export default {
  components: {
    EditorContent,
    BubbleMenu,
    OuterCommentVue
  },
  setup() {
    const h = unitConversion.mmConversionPx(148);
    const w = unitConversion.mmConversionPx(210);

    const dateTimeFormat = "yyyy.MM.dd HH:mm";

    const formatDate = (d: any) => (d ? format(new Date(d), dateTimeFormat) : null);
    const currentUserName = ref("黄医生");

    const commentText = ref("");

    const showCommentMenu = ref(false);

    const isCommentModeOn = ref(false);

    const isTextSelected = ref(false);

    const showAddCommentSection = ref(true);

    interface CommentInstance {
      uuid?: string;
      comments?: any[];
    }

    const activeCommentsInstance = ref<CommentInstance>({});

    const allComments = ref<any[]>([]);

    const findCommentsAndStoreValues = (editor: E) => {
      const tempComments: any[] = [];

      editor.state.doc.descendants((node, pos) => {
        const { marks } = node;

        marks.forEach((mark) => {
          if (mark.type.name === "comment") {
            const markComments = mark.attrs.comment;

            const jsonComments = markComments ? JSON.parse(markComments) : null;

            if (jsonComments !== null) {
              tempComments.push({
                node,
                jsonComments,
                from: pos,
                to: pos + (node.text?.length || 0),
                text: node.text
              });
            }
          }
        });
      });

      allComments.value = tempComments;
    };

    const { log } = console;

    const setCurrentComment = (editor: E) => {
      const newVal = editor.isActive("comment");

      if (newVal) {
        setTimeout(() => (showCommentMenu.value = newVal), 50);

        showAddCommentSection.value = !editor.state.selection.empty;

        const parsedComment = JSON.parse(editor.getAttributes("comment").comment);

        parsedComment.comment = typeof parsedComment.comments === "string" ? JSON.parse(parsedComment.comments) : parsedComment.comments;

        activeCommentsInstance.value = parsedComment;
      } else {
        activeCommentsInstance.value = {};
      }
    };

    const getIsCommentModeOn = () => isCommentModeOn.value;
    const editor = shallowRef<Editor>();

    const setComment = (val?: string) => {
      const localVal = val || commentText.value;

      if (!localVal.trim().length) return;

      const activeCommentInstance: CommentInstance = JSON.parse(JSON.stringify(activeCommentsInstance.value));
      const commentsArray = typeof activeCommentInstance.comments === "string" ? JSON.parse(activeCommentInstance.comments) : activeCommentInstance.comments;

      if (commentsArray) {
        commentsArray.push({
          userName: currentUserName.value,
          time: Date.now(),
          content: localVal
        });

        const commentWithUuid = JSON.stringify({
          uuid: activeCommentsInstance.value.uuid || uuidv4(),
          comments: commentsArray
        });
        editor.value?.chain().setComment(commentWithUuid).run();
      } else {
        const commentWithUuid = JSON.stringify({
          uuid: uuidv4(),
          comments: [
            {
              userName: currentUserName.value,
              time: Date.now(),
              content: localVal
            }
          ]
        });
        editor.value?.chain().setComment(commentWithUuid).run();
      }

      setTimeout(() => (commentText.value = ""), 50);
    };

    const toggleCommentMode = () => {
      isCommentModeOn.value = !isCommentModeOn.value;
      if (isCommentModeOn.value) editor.value?.setEditable(false);
      else editor.value?.setEditable(true);
    };

    const focusContent = ({ from, to }: { from: number; to: number }) => {
      editor.value?.chain().setTextSelection({ from, to }).run();
    };
    onBeforeUnmount(() => {
      editor.value?.destroy();
    });
    onMounted(() => {
      toggleCommentMode();
      //编辑器实例
      editor.value = new Editor({
        onUpdate({ editor }) {
          findCommentsAndStoreValues(editor);
          setCurrentComment(editor);
        },
        onSelectionUpdate({ editor }) {
          setCurrentComment(editor);
          isTextSelected.value = !!editor.state.selection.content().size;
        },

        onCreate({ editor }) {
          findCommentsAndStoreValues(editor);
        },
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
            mention: {
              HTMLAttributes: {
                class: "bg-gray-300"
              }
            },
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
          DiffExtension,
          Comment.configure({ isCommentModeOn: getIsCommentModeOn })
        ]
      });
    });
    return {
      editor,
      focusContent,
      toggleCommentMode,
      setComment,
      getIsCommentModeOn,
      setCurrentComment,
      findCommentsAndStoreValues,
      commentText,
      isCommentModeOn,
      activeCommentsInstance,
      allComments,
      formatDate
    };
  }
};
</script>
<style>
.ProseMirror-focused {
}
.comment {
  background: rgba(250, 250, 0, 0.25);
  border-bottom: 2px rgb(255, 183, 0) solid;
  user-select: all;
  padding: 0 2px 0 2px;
  border-radius: 4px;
}
</style>
