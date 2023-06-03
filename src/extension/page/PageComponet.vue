<template>
  <node-view-wrapper oncontextmenu="return false;" @mousemove="mousemove" @mousedown="mousedown" class="Page text-base relative" :id="node.attrs.id" :style="{ width: options.bodyWidth + 'px' }">
    <div class="relative" :style="{ height: options.headerHeight + 'px', width: options.bodyWidth + 'px' }">
      <div class="absolute" v-for="(item, i) in headerlist" :key="i" :style="{ width: item.w + 'px', height: item.h + 'px', top: item.y + 'px', left: item.x + 'px' }">
        <component class="min-w-full min-h-full" :is="item.component" @inpuvalue="(v: any) => updateValue(i, item, v, true)" :value="item.value" :styles="item.styles" :editor="editor" :node="node" :extension="extension" />
      </div>
    </div>
    <node-view-content class="PageContent" :style="{ minHeight: options.bodyHeight - options.bodyPadding * 2 + 'px', padding: options.bodyPadding + 'px' }" />
    <div class="relative" :style="{ height: options.footerHeight + 'px', width: options.bodyWidth + 'px' }">
      <div class="absolute" v-for="(item, i) in footerlist" :key="i" :style="{ width: item.w + 'px', height: item.h + 'px', top: item.y + 'px', left: item.x + 'px' }">
        <component class="min-w-full min-h-full" @inpuvalue="(v: any) => updateValue(i, item, v, false)" :is="item.component" :value="item.value" :styles="item.styles" :editor="editor" :node="node" :extension="extension" />
      </div>
    </div>
    <div class="absolute patterns pt3 flex place-content-center" v-if="!editor.options.editable" :style="{ width: '100%', height: maskheight + 'px', top: '0px', left: '0px', opacity: '0.7' }"></div>
  </node-view-wrapper>
</template>

<script lang="ts">
import { WidgetOptions } from "@/design/config";
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { reactive, ref } from "vue";
export default {
  components: {
    NodeViewWrapper,
    NodeViewContent
  },
  props: nodeViewProps,
  setup(props: any, _ctx: any) {
    let options = reactive({
      headerHeight: 100,
      footerHeight: 100,
      bodyHeight: 350,
      bodyWidth: 700,
      bodyPadding: 5,
      SystemAttributes: {}
    });
    let editor = reactive(props.editor);
    let node = reactive(props.node);
    let decorations = reactive(props.decorations);
    let extension = reactive(props.extension);
    if (extension.options.bodyHeight) {
      options = extension.options;
    }
    let headerlist = editor.storage.PageExtension.headerData;
    let footerlist = editor.storage.PageExtension.footerData;
    let updateValue = (index: number, item: WidgetOptions, v: any, header: boolean) => {
      item.value = v;
      if (header) {
        editor.storage.PageExtension.headerData[index] = item;
      } else {
        editor.storage.PageExtension.footerData[index] = item;
      }
    };
    let ok = true;
    let maskheight = ref(0);
    let mousemove = (e: any) => {
      if (!editor.options.editable) {
        if (!ok) return;
        let page = document.getElementById(node.attrs.id);
        if (page) maskheight.value = e.pageY - page.offsetTop;
      }
    };

    let mousedown = (e: any) => {
      if (!editor.options.editable) ok = !ok;
    };
    return {
      footerlist,
      headerlist,
      options,
      editor,
      node,
      decorations,
      extension,
      updateValue,
      mousemove,
      mousedown,
      maskheight
    };
  }
};
</script>
<style>
.patterns {
  box-shadow: 0 1px 8px #666;
  background-size: 50px 50px;
  background-color: #dadfe1;
  background-image: -webkit-linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
  background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);
}
</style>
