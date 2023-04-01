<template>
  <div class="diagonal-fractions">页码 {{ page_count }}/{{ all_count }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "page-count",
  // 变量通过props传参
  // 逻辑通过触发自定义事件来实现
  props: {
    editor: {
      type: Object,
      required: false
    },
    node: {
      type: Object,
      required: false
    },
    extension: {
      type: Object,
      required: false
    },
    value: String,
    styles: Object
  },
  setup(props: any) {
    let page_count = ref(1);
    let all_count = ref(1);
    if (props.node) {
      page_count = ref(props.node.attrs.pageNumber);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    function pageCount({ editor }) {
      all_count.value = editor.view.state.tr.doc.childCount;
    }

    if (props.editor) {
      all_count = ref(props.editor.view.state.tr.doc.childCount);
      props.editor.on("update", pageCount);
    }
    return { page_count, all_count };
  }
});
</script>

<style scoped></style>
