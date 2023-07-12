import { Extension } from "@tiptap/core";
import * as _wasm from "@/../pkg";
import { Page } from "@/extension/page/page";
import CassieBlock from "@/extension/node/CassieBlock";
import { PageOptions } from "@/extension/page/core";
import { CassieBlockExt } from "@/extension/node/CassieBlockExt";
import { pagePlugin } from "@/extension/page/pagePlugn";
import Image from "@tiptap/extension-image";
export const PageExtension = Extension.create<PageOptions>({
  name: "PageExtension",

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
    /*自定节点*/
    extensions.push(CassieBlock);
    /*自定义扩展块*/
    extensions.push(CassieBlockExt);
    extensions.push(Image.configure({ inline: true, allowBase64: true }));
    return extensions;
  }
});
