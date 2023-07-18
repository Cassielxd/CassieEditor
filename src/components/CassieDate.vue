<template>
  <div class="card bg-base-100 shadow-xl border">
    <figure><v-calendar @dayclick="onClick" /></figure>
    <div class="card-actions justify-end px-4 py-2">
      <div class="badge badge-outline" @click="onSubmit">确定</div>
      <div class="badge badge-outline" @click="quit">取消</div>
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
