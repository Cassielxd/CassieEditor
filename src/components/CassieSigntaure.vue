<template>
  <div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <VueSignaturePad id="signature" width="400px" height="100px" ref="signaturePad" :options="options" />
    </div>
    <div class="card-actions justify-end">
      <button class="btn btn-accent btn-xs" @click="save">确定</button>
      <button class="btn btn-ghost btn-xs" @click="quit">取消</button>
    </div>
  </div>
</template>

<script>
import { VueSignaturePad } from "vue-signature-pad";
export default {
  components: { VueSignaturePad },
  props: {
    selectItem: {
      type: Function,
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
  mounted() {
    //根据
    let selectData = this.selectItem();
    console.log(selectData);
  },
  data: () => ({
    penColor: "#100f10",
    isIndeterminate: true
  }),

  methods: {
    save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      this.$parent.editor.chain().focus().setImage({ src: data }).run();
      if (this.onExit) {
        this.onExit();
      }
    },
    quit() {
      this.onExit();
    }
  }
};
</script>

<style lang="scss"></style>
