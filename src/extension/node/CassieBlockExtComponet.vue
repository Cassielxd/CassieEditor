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
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
