<template>
  <CassieEditor :content="signContent" @onCreate="onCreate" :is-paging="true" @onUpdate="onUpdate" :bodyWidth="750" :menu-list="menulist" />
</template>

<script lang="ts">
import { getCurrentInstance } from "vue";
import CassieEditor from "../components/CassieEditor.vue";
import { signContent, headerlist, footerlist } from "./content";

export default {
  components: { CassieEditor },
  setup() {
    document.oncontextmenu = (e) => {
      e.preventDefault();
    };
    const { ctx } = getCurrentInstance();
    const menulist = [
      {
        classify: "image",
        label: "签名",
        value: "image"
      }
    ];
    const onUpdate = (output: any, editor: any) => {
      /*      console.log(output);
            console.log(editor);*/
    };
    const onCreate = (option: any) => {
      console.log(option);
    };
    return { signContent, menulist, headerlist, footerlist, onUpdate, onCreate };
  }
};
</script>
<style scoped></style>
