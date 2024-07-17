<template>
  <CassieEditor :content="''" @onCreate="onCreate" @onUpdate="onUpdate" :is-paging="false" :bodyWidth="1000" output="json" :menu-list="menulist" />
</template>

<script lang="ts">
import { getCurrentInstance } from "vue";
import CassieEditor from "../components/CassieEditor.vue";
import { pageContentHtml, headerlist, footerlist } from "./content";

export default {
  components: { CassieEditor },
  setup() {
    const { ctx } = getCurrentInstance();
    const menulist = [
      { classify: "radio", label: "单选", value: "radio" },
      {
        classify: "checkbox",
        label: "多选",
        value: "checkbox"
      },
      {
        classify: "date",
        label: "日期",
        value: "date"
      }
    ];
    const onUpdate = (output: any, editor: any) => {
      console.log(output);
      console.log(editor.getJSON());
    };
    const onCreate = (option: any) => {
      console.log(option);
    };
    return {  menulist, headerlist, footerlist, onUpdate, onCreate };
  }
};
</script>
<style scoped></style>
