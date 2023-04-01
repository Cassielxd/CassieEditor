<template>
  <select class="appearance-none" v-model="defaultvalue" @change="change">
    <option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </select>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "custom-select",
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
    let defaultvalue = ref(props.value);
    let isEditor = false;
    if (props.node) {
      isEditor = props.node.attrs.pageNumber == 1 ? true : false;
    }
    return { isEditor, defaultvalue };
  },
  data() {
    return {
      options: [
        {
          value: "Option1",
          label: "科室1"
        },
        {
          value: "Option2",
          label: "科室2"
        },
        {
          value: "Option3",
          label: "科室3"
        },
        {
          value: "Option4",
          label: "科室4"
        },
        {
          value: "Option5",
          label: "科室5"
        }
      ]
    };
  },
  methods: {
    change(e: any) {
      this.$emit("inpuvalue", this.defaultvalue);
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    remoteMethod(query: string) {}
  }
});
</script>

<style scoped></style>
