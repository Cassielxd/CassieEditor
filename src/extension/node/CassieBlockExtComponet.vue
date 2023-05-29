<template>
  <node-view-wrapper :id="this.node.attrs.id">
    <node-view-content />
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
