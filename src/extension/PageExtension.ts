import { Extension, findParentNode } from "@tiptap/core";
import { EmrDocument } from "@/extension/doc/document";
import { Page } from "@/extension/page/page";
import CassieBlock from "@/extension/node/CassieBlock";
import { PageOptions } from "@/extension/page/core";
import { CassieBlockExt } from "@/extension/node/CassieBlockExt";
import * as commands from "@/extension/commands/index";
import { paginationPlugin } from "@/extension/page/pagePlugn";
import Image from "@tiptap/extension-image";
import { Selection, TextSelection } from "@tiptap/pm/state";
import { PAGE } from "./nodeNames";
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
    const handleBackspace = () =>
      this.editor.commands.first(({ commands }) => [
        () => {
          const ok = commands.undoInputRule();
          console.log(ok);
          return ok;
        },
        // maybe convert first text block node to default node
        () =>
          commands.command(({ tr }) => {
            const { selection, doc } = tr;
            const { empty, $anchor } = selection;
            const { pos, parent } = $anchor;
            const isAtStart = Selection.atStart(doc).from === pos;
            if (!empty || !isAtStart || !parent.type.isTextblock || parent.textContent.length) {
              return false;
            }
            const ok = commands.clearNodes();
            console.log(ok);
            return ok;
          }),
        () => {
          const ok = commands.deleteSelection();
          console.log(ok);
          return ok;
        },
        () => {
          const ok = commands.joinBackward();
          console.log(ok);
          return ok;
        },
        () => {
          const ok = commands.selectNodeBackward();
          console.log(ok);
          return ok;
        },
        () =>
          commands.command(({ tr }) => {
            const { selection, doc } = tr;
            const { $anchor } = selection;
            const { pos } = $anchor;
            if (doc.childCount == 1) return false;
            if (Selection.atEnd(doc).from === pos) {
              return commands.deleteNode(PAGE);
            }
            const pageNode = findParentNode((node) => node.type.name === PAGE)(selection);
            if (pageNode) {
              const isAtStart = pageNode.start + Selection.atStart(pageNode.node).from === pos;
              if (isAtStart) {
                const vm = TextSelection.create(doc, pos - 20, pos - 20);
                const beforePageNode = findParentNode((node) => node.type.name === PAGE)(vm);
                if (beforePageNode) {
                  const pos1 = Selection.atEnd(beforePageNode.node).from + beforePageNode.start;
                  const after = TextSelection.create(doc, pos1, pos1);
                  tr.setSelection(after);
                  return true;
                }
              }
            }

            return false;
          })
      ]);
    return {
      Enter: handleEnter,
      Backspace: handleBackspace
    };
  }
});
