import { Extension } from "@tiptap/core";
import { Page } from "@/extension/page/page";
import { buildComputedHtml } from "@/extension/page/core";
import { PageOptions } from "@/extension/page/types";
import { pagePlugin } from "@/extension/page/pagePlugn";
import { CoolKeyMap } from "@/extension/keymap";
import { PasteRule } from "@tiptap/core/dist/packages/core/src/PasteRule";
import { nodePasteRule } from "@tiptap/vue-3";

export const PageExtension = Extension.create<PageOptions>({
  name: "PageExtension",
  onBeforeCreate() {
    if (this.options.isPaging) {
      buildComputedHtml(this.options);
    }
  },
  /*添加分页插件*/
  addProseMirrorPlugins() {
    const plugins: any[] = [];
    if (this.options.mode == 3) return plugins;
    if (this.options.isPaging) {
      plugins.push(pagePlugin(this.editor, this.options));
    }
    return plugins;
  },
  addStorage() {
    let headerData = [];
    let footerData = [];
    if (this.options) {
      if (this.options.headerData) {
        headerData = this.options.headerData;
      }
      if (this.options.footerData) {
        footerData = this.options.footerData;
      }
    }
    return {
      headerData: headerData,
      footerData: footerData
    };
  },
  /*添加自定义组件*/
  addExtensions() {
    const extensions: any[] = [];
    /*分页*/
    if (this.options.isPaging) {
      extensions.push(CoolKeyMap);
    }
    extensions.push(Page.configure(this.options));
    return extensions;
  }
});
