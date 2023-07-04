<template>
  <div class="flex place-content-center">
    <div class="card drop-shadow-md border bg-white w-3/4">
      <table class="table">
        <thead>
          <tr>
            <th>功能</th>
            <th>描述</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list" :key="index">
            <th>{{ item.name }}</th>
            <td>{{ item.desc }}</td>
            <td>
              <label>
                <input type="checkbox" class="checkbox checkbox-info" checked disabled style="opacity: 1" />
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  setup() {
    const list = [
      {
        name: "页眉页脚",
        desc: "自定义页眉页脚",
        complate: true
      },
      {
        name: "编辑器分页",
        desc: "自定义编辑器高度,超出进行分页",
        complate: true
      },
      {
        name: "自定义光标",
        desc: "自定义光标样式",
        complate: true
      },
      {
        name: "自定义块",
        desc: "自定义业务属性模块",
        complate: true
      },
      {
        name: "气泡菜单",
        desc: "编辑器气泡菜单",
        complate: true
      },
      {
        name: "右键菜单",
        desc: "右键业务菜单",
        complate: true
      },
      {
        name: "修改痕迹",
        desc: "追踪更改记录可撤销",
        complate: true
      },
      {
        name: "批注/评论",
        desc: "添加文档批注评论功能",
        complate: true
      },
      {
        name: "协同编辑",
        desc: "多人在线协同编辑",
        complate: true
      },
      {
        name: "质控",
        desc: "自定义质控规则,不满足规则的文档内容会提示",
        complate: true
      },
      {
        name: "自定义控件",
        desc: "下拉 单选 多选 svg交互",
        complate: true
      },
      {
        name: "电子签名",
        desc: "手写签名（svg交互）",
        complate: true
      },
      {
        name: "版本比较",
        desc: "文档历史版本对比",
        complate: true
      },
      {
        name: "续打",
        desc: "设置续打位置，可续打",
        complate: true
      }
    ];
    return { list };
  }
};
</script>
