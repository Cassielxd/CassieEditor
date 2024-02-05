import { Extension } from "@tiptap/core";
import { Page } from "@/extension/page/page";
import { PageOptions } from "@/extension/page/core";
import { pagePlugin } from "@/extension/page/pagePlugn";

export const PageExtension = Extension.create<PageOptions>({
  name: "PageExtension",
  onBeforeCreate() {
    const computedspan = document.getElementById("computedspan");
    if (!computedspan) {
      const p = document.createElement("p");
      p.classList.add("text-editor");
      p.setAttribute("style", "opacity: 0;position: absolute;z-index: -89;margin-left:-2003px;");
      p.setAttribute("id", "computedspan");
      p.innerHTML = "&nbsp;";
      document.body.append(p);
    }
    const computeddiv = document.getElementById("computeddiv");
    if (!computeddiv) {
      const dom = document.createElement("div");
      dom.setAttribute("class", "Page text-editor relative");
      dom.setAttribute("style", "opacity: 0;position: absolute;z-index: -9999;margin-left:-2003px;max-width:" + this.options.bodyWidth + "px;width:" + this.options.bodyWidth + "px;");
      const content = document.createElement("div");
      content.classList.add("PageContent");
      content.setAttribute("style", "min-height: " + this.options.bodyHeight + "px;padding:" + this.options.bodyPadding + "px");
      content.setAttribute("id", "computeddiv");
      dom.append(content);
      document.body.append(dom);
    }
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
