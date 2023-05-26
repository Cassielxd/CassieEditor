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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.stepStatus = true;
          return false;
        },
        () => commands.undoInputRule(),
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
            return commands.clearNodes();
          }),
        () => commands.deleteSelection(),
        () => commands.joinBackward(),
        () => commands.selectNodeBackward(),
        () =>
          commands.command(({ tr }) => {
            //以上系统所有默认操作 都没有成功的时候会进入这个分支
            const { selection, doc } = tr;
            const { $anchor } = selection;
            const { pos } = $anchor;
            //如果当前只有一页的情况不做处理
            if (doc.childCount == 1) return false;
            //如果是最后一页并且删除的点已经是 整个文档的 最后点位 证明最后一页啥都没了直接删除
            if (Selection.atEnd(doc).from === pos) {
              return commands.deleteNode(PAGE);
            }
            //找到当钱的page
            const pageNode = findParentNode((node) => node.type.name === PAGE)(selection);
            if (pageNode) {
              //如果光标在在当前页面 的第一个位置
              //todo 这里需要优化 能走到这肯定是光标的第一个位置 所以不需要判断
              const isAtStart = pageNode.start + Selection.atStart(pageNode.node).from === pos;
              if (isAtStart) {
                /*
                 * 获取上一页的 的 最后一点 将光标设置过去
                 * */
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
