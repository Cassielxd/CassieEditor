<template>
  <div class="card bg-base-100 shadow-xl">
    <v-calendar @dayclick="onClick" />
    <div class="card-actions justify-end">
      <button class="btn btn-accent btn-xs" @click="onSubmit">确定</button>
      <button class="btn btn-ghost btn-xs" @click="quit">取消</button>
    </div>
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
      value: null,
      selectedIndex: 0
    };
  },

  methods: {
    onSubmit() {
      if (this.value) {
        this.command({ classify: "date", label: this.value });
      }
      if (this.onExit) {
        this.onExit();
      }
    },
    onClick(day) {
      this.value = day.id;
    },
    quit() {
      this.onExit();
    }
  }
};
</script>

<style></style>
