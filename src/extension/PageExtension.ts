import { Extension } from "@tiptap/core";
import { EmrDocument } from "@/extension/doc/document";
import { Page } from "@/extension/page/page";
import CassieBlock from "@/extension/node/CassieBlock";
import { PageOptions } from "@/extension/page/core";
import { CassieBlockExt } from "@/extension/node/CassieBlockExt";
import * as commands from "@/extension/commands/index";
import { paginationPlugin } from "@/extension/page/pagePlugn";
import Image from "@tiptap/extension-image";

export const PageExtension = Extension.create<PageOptions>({
  name: "PageExtension",
  /*添加自定义命令*/
  addCommands() {
    return {
      ...commands
    };
  },
  /*添加分页插件*/
  addProseMirrorPlugins() {
    const plugins: any[] = [];
    if (this.options.design) return plugins;
    if (this.options.isPaging) {
      plugins.push(paginationPlugin(this.options));
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
    /*顶级文档*/
    extensions.push(EmrDocument);
    /*分页*/
    extensions.push(Page.configure(this.options));
    /*自定节点*/
    extensions.push(CassieBlock);
    /*自定义扩展块*/
    extensions.push(CassieBlockExt);
    extensions.push(Image.configure({ inline: true, allowBase64: true }));
    return extensions;
  },
  addKeyboardShortcuts() {
    /*修改系统默认的 回车拆分逻辑*/
    const handleEnter = () =>
      this.editor.commands.first(({ commands }) => {
        return [() => commands.newlineInCode(), () => commands.createParagraphNear(), () => commands.liftEmptyBlock(), () => commands.splitCBlock()];
      });
    return {
      Enter: handleEnter
    };
  }
});
