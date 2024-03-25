<template>
  <node-view-wrapper oncontextmenu="return false;" class="Page text-editor relative" :id="node.attrs.id" :style="{ width: options.bodyWidth + 'px' }">
    <div class="corner-top-left"></div>
    <div class="corner-top-right"></div>
    <div class="corner-bottom-left"></div>
    <div class="corner-bottom-right"></div>
    <node-view-content class="PageContent" :style="{ minHeight: options.bodyHeight + 'px', padding: options.bodyPadding + 'px' }" />
  </node-view-wrapper>
</template>

<script lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
export default {
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  props: nodeViewProps,
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({ extension, node }: any, _ctx: any) {
    let { options } = extension;
    return {
      node,
      options,
      extension
    };
  }
};
</script>
