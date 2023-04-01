<template>
  <!-- 组件列表 -->
  <div class="content element-doc content">
    <ul class="icon-list">
      <li v-for="widget in list" :key="widget.type" draggable="true" @click="(e) => $emit('onWidgetMouseDown', e, widget)" @mousedown="(e) => $emit('onWidgetMouseDown', e, widget)">
        <span>{{ widget.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "WidgetList",
  // 变量通过props传参
  // 逻辑通过触发自定义事件来实现
  props: {
    list: Array
  }
});
</script>
<style>
.icon-list {
  overflow: hidden;
  list-style: none;
  padding: 0 !important;
  border: 1px solid #eaeefb;
  border-radius: 4px;
}

.icon-list li {
  float: left;
  width: 50%;
  text-align: center;
  height: 80px;
  line-height: 80px;
  color: #666;
  font-size: 13px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-right: -1px;
  margin-bottom: -1px;
}

.icon-list li:after,
.icon-list li span {
  display: inline-block;
  vertical-align: middle;
}
</style>
