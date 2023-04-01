<template>
  <ul class="card shadow-xl menu menu-compact bg-base-100 rounded-box">
    <template v-if="items">
      <li v-for="(item, index) in items" :key="index" @click="onClick(index)">
        <a>{{ item.label }}</a>
      </li>
    </template>
    <li class="item" v-else>没有数据</li>
  </ul>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: false
    },
    contextHook: {
      type: Function,
      required: false
    },
    editor: {
      type: Object,
      required: true
    },
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
      const content = `XXXXX<span type="mention" class="bg-gray-300" classify="date"
                    data-label="日期" contenteditable="false">日期</span>XXXXX`;
      if (item) {
        this.command({ classify: item.classify, label: item.label, content: content });
        if (this.onExit) {
          this.onExit();
        }
      }
    }
  }
};
</script>
