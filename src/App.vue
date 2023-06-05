<template>
  <div class="space-y-6">
    <div class="navbar">
      <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl">Cassie电子病历</a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li >
            <router-link to="/">基础编辑器</router-link>
          </li>
          <li>
            <router-link to="/page">设计模式</router-link>
          </li>
          <li>
            <router-link to="/page1">默认模式</router-link>
          </li>
          <li>
            <router-link to="/collaborativeeditor">多人协作</router-link>
          </li>
          <li>
            <router-link to="/commenteditor">评论/批注</router-link>
          </li>
          <li>
            <router-link to="/changeseteditor">操作记录</router-link>
          </li>
          <li>
            <router-link to="/print">续打</router-link>
          </li>
          <li>
            <router-link to="/sign">电子签名</router-link>
          </li>
          <li>
            <router-link to="/about">关于电子病历</router-link>
          </li>
        </ul>
      </div>
    </div>
    <router-view />
    <footer class="footer p-10 bg-neutral text-neutral-content">
      <div>
        <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" class="fill-current">
          <path
            d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"
          ></path>
        </svg>
        <p>电子病历</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useRoute } from "vue-router";

@Options({
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {
    handleSelect: (key: string) => {
      console.log(key);
    }
  }
})
export default class App extends Vue {}
</script>
<style>
.ProseMirror-focused {
  outline: none;
}
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0d0d0d;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}
img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
}
</style>
