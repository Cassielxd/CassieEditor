<template>
  <img src="../../../../assets/logi.jpg" />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "custom-image",
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
  data() {
    return {
      src: this.value
    };
  },
  methods: {}
});
</script>

<style lang="less" scoped></style>
