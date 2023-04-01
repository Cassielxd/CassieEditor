<template>
  <div class="flex w-full">
    <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">
      <CassieEditor :content="baseContent" @onCreate="onCreate" @onUpdate="onUpdate" :bodyWidth="750" :menu-list="menulist" />
    </div>
    <div class="divider divider-horizontal">OR</div>
    <div class="grid flex-grow card bg-base-300 rounded-box place-items-center">content</div>
  </div>

</template>

<script lang="ts">
import { getCurrentInstance } from "vue";
import CassieEditor from "../components/CassieEditor.vue";
import { baseContent, headerlist, footerlist } from "./content";

export default {
  components: { CassieEditor },
  setup() {
    document.oncontextmenu = (e) => {
      e.preventDefault();
    };
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
      /*      console.log(output);
            console.log(editor);*/
    };
    const onCreate = (option: any) => {
      console.log(option);
    };
    return { baseContent, menulist, headerlist, footerlist, onUpdate, onCreate };
  }
};
</script>
<style scoped></style>
