import { Extension } from "@tiptap/core";
import { Page } from "@/extension/page/page";
import { buildComputedHtml, PageOptions } from "@/extension/page/core";
import { pagePlugin } from "@/extension/page/pagePlugn";

export const PageExtension = Extension.create<PageOptions>({
  name: "PageExtension",
  onBeforeCreate() {
    buildComputedHtml(this.options);
  },
  /*添加分页插件*/
  addProseMirrorPlugins() {
    const plugins: any[] = [];
    if (this.options.design) return plugins;
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
    extensions.push(Page.configure(this.options));
    return extensions;
  }
});
