<template>
  <ul class="card shadow-xl menu menu-compact bg-base-100 rounded-box">
    <template v-if="items.length">
      <li v-for="(item, index) in items" :key="index" @click="onClick(index)">
        <a>{{ item.name }}</a>
      </li>
    </template>
    <li class="item" v-else>没有数据</li>
  </ul>
</template>
<script>
export default {
  props: {
    command: {
      type: Function,
      required: true
    },
    onExit: {
      type: Function
    }
  },

  data() {
    return {
      items: [
        {
          name: "单选1",
          value: "select"
        },
        {
          name: "单选2",
          value: "select"
        },
        {
          name: "单选3",
          value: "select"
        },
        {
          name: "单选4",
          value: "select"
        }
      ],
      selectedIndex: 0
    };
  },

  watch: {
    items() {
      this.selectedIndex = 0;
    }
  },

  methods: {
    onClick(index) {
      this.selectedIndex = index;
      this.selectItem(this.selectedIndex);
    },
    selectItem(index) {
      const item = this.items[index];
      if (item) {
        this.command({ classify: "radio", label: item.name });
        if (this.onExit) {
          this.onExit();
        }
      }}
  }
};
</script>
