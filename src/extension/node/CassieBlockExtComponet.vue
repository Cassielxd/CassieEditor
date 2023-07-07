<template>
  <node-view-wrapper :id="this.node.attrs.id">
    <node-view-content class="content" />
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  props: nodeViewProps
};
</script>
<style>
.content {
  margin-block-start: 4px;
  margin-block-end: 4px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
</style>
