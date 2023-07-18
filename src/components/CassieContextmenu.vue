<template>
  <div class="card join shadow-xl join-vertical border">
    <template v-if="items">
      <button v-for="(item, index) in items" :key="index" class="btn join-item" @click="onClick(index)">
        {{ item.label }}
      </button>
    </template>
  </div>
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
