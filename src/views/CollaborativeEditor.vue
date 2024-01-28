<template>
  <footer class="footer footer-center p-4 bg-base-300 text-base-content">
    <div class="chat chat-start">
      <div class="chat-bubble chat-bubble-primary">在线人数+{{ userLenth.length }}</div>
    </div>
    <div class="avatar-group">
      <div class="avatar placeholder" v-for="(item, index) in userLenth" :key="index">
        <div :style="{ background: item.user.color ? item.user.color : '' }" class="text-neutral-content rounded-full w-24">
          <span>{{ item.user.name }}</span>
        </div>
      </div>
    </div>
  </footer>
  <CassieEditor :user="user" footer-height="50" :body-width="w" :body-height="h" :content="pageContent" @onCreate="onCreate" :collaboration-url="url" @onStatus="onStatus" @onAwarenessChange="onAwarenessChange" @onUpdate="onUpdate" :bodyWidth="750" :menu-list="menulist" :header-data="headerlist" :footer-data="footerlist" />

</template>

<script lang="ts">
import { getCurrentInstance, ref } from "vue";
import CassieEditor from "../components/CassieEditor.vue";
import { pageContent, headerlist, footerlist } from "./content";
import { getRandomColor, getRandomName } from "@/denoutils";
import { UnitConversion } from "@/extension/page/core";
const unitConversion = new UnitConversion();
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
    let userLenth = ref([]);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onUpdate = (output: any, editor: any) => {};
    const onStatus = (data: any, editor: any) => {};
    const onAwarenessChange = (data: any) => {
      userLenth.value = data.states;
    };
    const onCreate = (option: any) => {
      console.log(option);
    };
    const user = { name: getRandomName(), color: getRandomColor() };
    const url = "ws://127.0.0.1:1234";
    let w = unitConversion.mmConversionPx(210);
    let h = unitConversion.mmConversionPx(297);
    return { w, h, user, pageContent, menulist, headerlist, footerlist, onUpdate, onStatus, onCreate, url, userLenth, onAwarenessChange };
  }
};
</script>
<style scoped></style>
