<template>
  <CassieEditor :user="user" footer-height="50" :content="pageContent" @onCreate="onCreate" :collaboration-url="url"
                @onStatus="onStatus" @onUpdate="onUpdate" :bodyWidth="750" :menu-list="menulist"
                :header-data="headerlist" :footer-data="footerlist" />
  <footer class="footer footer-center p-4 bg-base-300 text-base-content">
    <div class="chat chat-start">
      <div class="chat-bubble chat-bubble-primary">在线人数+{{ userLenth.length }}</div>
    </div>
    <div class="avatar-group">
      <div class="avatar placeholder" v-for="(user, index) in userLenth" :key="index">
        <div class="bg-neutral-focus text-neutral-content rounded-full w-24">
          <span>{{ user.name }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { getCurrentInstance, ref } from "vue";
import CassieEditor from "../components/CassieEditor.vue";
import { pageContent, headerlist, footerlist } from "./content";
import { getRandomColor, getRandomName } from "@/denoutils";

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
    const onUpdate = (output: any, editor: any) => {
    };
    const onStatus = (data: any, editor: any) => {
      if(data.status=="connected"){
        userLenth.value = editor.value.storage.collaborationCursor.users;
      }
    };
    const onCreate = (option: any) => {
      console.log(option);
    };
    const user = { name: getRandomName(), color: getRandomColor() };
    const url = "ws://127.0.0.1:1234";
    return { user, pageContent, menulist, headerlist, footerlist, onUpdate, onStatus, onCreate, url, userLenth };
  }
};
</script>
<style scoped></style>
