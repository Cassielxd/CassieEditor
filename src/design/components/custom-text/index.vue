<template>
  <div ref="inputtext" :style="styles" @input="inputText" @blur="inputBlur" @focus="inputFocus">
    {{ value }}
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "custom-text",
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
      isBlur: true
    };
  },
  watch: {
    value(val) {
      if (this.isBlur) {
        this.$refs.inputtext.innerHTML = val;
      }
    }
  },
  methods: {
    // 监听输入框内容
    inputText() {
      this.$emit("inpuvalue", this.$refs.inputtext.innerHTML);
    },
    inputFocus() {
      this.isBlur = false;
    },
    inputBlur() {
      this.isBlur = true;
    }
  }
});
</script>

<style lang="less" scoped></style>
