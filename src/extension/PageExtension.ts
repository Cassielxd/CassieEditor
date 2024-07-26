import { Extension } from "@tiptap/core";
import { Page } from "@/extension/page/page";
import { buildComputedHtml, removeComputedHtml } from "@/extension/page/core";
import { PageOptions } from "@/extension/page/types";
import { idPlugin, pagePlugin } from "@/extension/page/pagePlugn";
import { CoolKeyMap } from "@/extension/keymap";
import { idAttributes } from "@/utils/id";
import {
  BULLETLIST,
  CASSIE_BLOCK,
  HEADING,
  LISTITEM,
  ORDEREDLIST,
  PARAGRAPH,
  TABLE,
  TABLE_ROW
} from "@/extension/nodeNames";

;

export const PageExtension = Extension.create<PageOptions>({
  name: "PageExtension",
  onBeforeCreate() {
    if (this.options.isPaging) {
      buildComputedHtml(this.options);
    }
  },
  onDestroy() {
    removeComputedHtml();
  },
  addGlobalAttributes(){
    return [
      {
        types:[HEADING,PARAGRAPH,BULLETLIST,LISTITEM,ORDEREDLIST,TABLE,TABLE_ROW,CASSIE_BLOCK],
        attributes: {
          id: {
            default: null
          },
          extend: {
            default: false
          }
        }
      }
    ];
  },
  /*添加分页插件*/
  addProseMirrorPlugins() {
    const plugins: any[] = [];
    if (this.options.mode == 3) return plugins;
    if (this.options.isPaging) {
      plugins.push(idPlugin());
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
