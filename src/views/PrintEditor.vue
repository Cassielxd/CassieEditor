<template>
  <CassieEditor :body-height="h - 100" :editable="false" :body-width="w" footer-height="50" :content="pageContent" @onCreate="onCreate" :is-paging="true" @onUpdate="onUpdate" :bodyWidth="750" :menu-list="menulist" :header-data="headerlist" :footer-data="footerlist" />
</template>

<script lang="ts">
import { getCurrentInstance } from "vue";
import CassieEditor from "../components/CassieEditor.vue";
import { pageContent, headerlist, footerlist } from "./content";
import { UnitConversion } from "@/extension/page/core";
const unitConversion = new UnitConversion();
export default {
  components: { CassieEditor },
  setup() {
    const { ctx } = getCurrentInstance();
    const h = unitConversion.mmConversionPx(210);
    const w = unitConversion.mmConversionPx(297);
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
    const url = "ws://47.104.64.212:1234";
    return { h, w, pageContent, menulist, headerlist, footerlist, onUpdate, onCreate };
  }
};
</script>
<style scoped></style>
