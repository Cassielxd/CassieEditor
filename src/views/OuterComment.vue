<template>
  <div class="divide-y">
    <div v-for="(comment, i) in allComments" :key="i + 'external_comment'" class="card bg-base-100 scale-95" :class="[`${comment.jsonComments.uuid === activeCommentsInstance.uuid ? 'active' : 'cursor-pointer'}`]" @click.stop.prevent="focusContent({ from: comment.from, to: comment.to })">
      <div v-for="(jsonComment, j) in comment.jsonComments.comments" :key="`${j}_${Math.random()}`" class="grid p-2.5">

          <strong class="text-md">{{ jsonComment.userName }} 日期：{{ formatDate(jsonComment.time) }}</strong>

        <span class="content">评论：{{ jsonComment.content }}</span>
      </div>
      <div >
        <div v-if="comment.jsonComments.uuid === activeCommentsInstance.uuid" class="card-body p-2.5" :class="[`${comment.jsonComments.uuid === activeCommentsInstance.uuid ? 'border-blue-900' : 'max-h-0 border-blue-300'}`]">
          <textarea
            class="textarea textarea-bordered"
            :ref="
              (el) => {
                textareaRefs[comment.jsonComments.uuid] = el;
              }
            "
            v-model="commentText"
            cols="30"
            rows="3"
            placeholder="添加批注"
            @keypress.enter.stop.prevent="setComment"
          />
          <div class="card-actions">
            <button class="btn btn-outline btn-xs" @click="setComment">添加</button>
            <button class="btn btn-outline btn-xs" @click="() => (commentText = '')">清空</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed, defineComponent } from "vue";

interface CommentInstance {
  uuid?: string;
  comments?: any[];
}
export default defineComponent({
  name: "outer-comment",
  props: {
    allComments: {
      type: Array,
      required: true
    },
    activeCommentsInstance: {
      type: Object,
      required: true
    },
    focusContent: {
      type: Function,
      required: true
    },
    formatDate: {
      type: Function,
      required: true
    },
    isCommentModeOn: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const commentText = ref<string>("");
    const textareaRefs = ref<Record<string, any>>({});

    const activeCommentInstanceUuid = computed(() => props.activeCommentsInstance.uuid);

    const setComment = () => {
      emit("setComment", commentText.value);
      commentText.value = "";
    };

    watch(activeCommentInstanceUuid, (val) => {
      setTimeout(() => {
        if (!val || !props.isCommentModeOn) return;

        const activeTextArea: HTMLTextAreaElement = textareaRefs.value[val];

        if (activeTextArea) activeTextArea.focus();
      }, 100);
    });
    return { emit, commentText, textareaRefs, setComment };
  }
});
</script>
