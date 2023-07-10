<template>
  <node-view-wrapper class="node" :id="this.node.attrs.id" :title="this.node.attrs.title" :group="this.node.attrs.group">
    <span class="font-black title" contenteditable="false">{{ this.node.attrs.title }}</span>
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

<style lang="scss">
.node > .label {
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
}

.node > .content {
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
