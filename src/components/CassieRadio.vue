<template>
  <div class="card shadow-xl border join join-vertical bg-base-100">
    <template v-if="items.length">
      <button v-for="(item, index) in items" :key="index" class="btn btn-outline btn-info btn-sm" @click="onClick(index)">
        <a>{{ item.name }}</a>
      </button>
    </template>
  </div>
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
      }
    }
  }
};
</script>
