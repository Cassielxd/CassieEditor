<template>
  <node-view-wrapper oncontextmenu="return false;">
    <node-view-content class="PageContent" :style="{ minHeight: options.bodyHeight - options.bodyPadding * 2 + 'px', padding: options.bodyPadding + 'px' }" />
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent
  },

  props: nodeViewProps,
  mounted() {
    if (this.extension.options.bodyHeight) {
      this.options = this.extension.options;
    }
  },
  data() {
    /*user 代表患者信息  doctor代表医生信息  options 系统默认值*/
    return {
      options: {
        bodyHeight: 350,
        bodyWidth: 700,
        bodyPadding: 5,
        SystemAttributes: {}
      }
    };
  },
  methods: {
    print(val) {
      console.log(val);
    },
    headerClick: () => {
      console.log("我是标题");
    }
  }
};
</script>
