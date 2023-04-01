<template>
  <node-view-wrapper class="Page" :id="node.attrs.id" :style="{ width: options.bodyWidth + 'px' }">
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
  </node-view-wrapper>
</template>

<script lang="ts">
import { WidgetOptions } from "@/design/config";
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { reactive } from "vue";
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
    return {
      footerlist,
      headerlist,
      options,
      editor,
      node,
      decorations,
      extension,
      updateValue
    };
  }
};
</script>
