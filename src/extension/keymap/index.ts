import { Extension, findChildrenInRange, findParentNode } from "@tiptap/core";
import { getJsonFromDoc, getExtentions, computedWidth } from "@/extension/page/core";
import { Selection, TextSelection } from "@tiptap/pm/state";
import { EXTEND, PAGE, CASSIE_BLOCK } from "@/extension/nodeNames";
import { ReplaceStep } from "@tiptap/pm/transform";
import { Slice } from "@tiptap/pm/model";
import { generateHTML } from "@tiptap/html";
import * as commands from "@/extension/commands";
import { CommandProps } from "@tiptap/core/dist/packages/core/src/types";
export const CoolKeyMap = Extension.create({
  name: "CoolKeyMap",
  /*添加自定义命令*/
  addCommands() {
    return {
      ...commands
    };
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
        () => deleteSelection(commands),
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
              const curBlock = findParentNode((node) => node.type.name.endsWith(EXTEND))(selection);
              //如果光标在在当前页面 的第一个位置
              const isAtStart = pageNode.start + Selection.atStart(pageNode.node).from === pos;
              if (isAtStart) {
                const vm = TextSelection.create(doc, pos - 20, pos - 20);
                const beforePageNode = findParentNode((node) => node.type.name === PAGE)(vm);
                //找到上一个page 获取到最后一个点 然后设置 光标选中
                if (beforePageNode) {
                  const pos1 = Selection.atEnd(beforePageNode.node).from + beforePageNode.start;
                  //EXTEND 是扩展类型 是可以删除并合并的
                  const selection1 = TextSelection.create(doc, pos1, pos1);
                  if (curBlock) {
                    const parent = selection1.$anchor.parent;
                    const paragraphDOM = document.getElementById(parent.attrs.id);
                    const html = generateHTML(getJsonFromDoc(parent), getExtentions());
                    const wordl = computedWidth(html);
                    computedWidth(" ");
                    if (paragraphDOM && wordl >= paragraphDOM.getBoundingClientRect().width) {
                      tr.setSelection(selection1);
                    } else {
                      tr.step(new ReplaceStep(pos1, pos, Slice.empty));
                    }
                    //tr.step(new ReplaceStep(pos1, pos, Slice.empty));
                    return true;
                  }
                  tr.setSelection(selection1);
                }
                return true;
              }
            }
            return false;
          })
      ]);

    const handleDelete = () =>
      this.editor.commands.first(({ commands }) => [
        () => deleteSelection(commands),
        () =>
          commands.command(({ tr }) => {
            const { selection, doc } = tr;
            const { $anchor } = selection;
            const currentNode = $anchor.node();
            const blockNode = findParentNode((node) => node.type.name === CASSIE_BLOCK)(selection);
            if (blockNode) {
              const isBlockStart = blockNode.start + Selection.atStart(blockNode.node).from === $anchor.pos;
              if (isBlockStart && blockNode.node.childCount == 1) {
                if (currentNode.content.size == 0) {
                  return true;
                }
              }
            }
            return commands.joinForward();
          }),
        () => {
          const a = commands.selectNodeForward();
          console.log(a);
          return a;
        },
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
              //如果光标在在当前页面 的最后一个位置
              const isAtEnd = pageNode.start + Selection.atEnd(pageNode.node).from === pos;
              if (isAtEnd) {
                const vm = TextSelection.create(doc, pos + 6, pos + 6);
                const afterPageNode = findParentNode((node) => node.type.name === PAGE)(vm);
                //找到上一个page 获取到最后一个点 然后设置 光标选中
                if (afterPageNode) {
                  const pos1 = Selection.atStart(afterPageNode.node).from + afterPageNode.start;
                  //EXTEND 是扩展类型 是可以删除并合并的
                  const selection1 = TextSelection.create(doc, pos1, pos1);
                  const curBlock = findParentNode((node) => node.type.name.endsWith(EXTEND))(selection1);
                  if (curBlock) {
                    tr.step(new ReplaceStep(pos, pos1, Slice.empty));
                    return true;
                  }
                }
              }
            }
            return false;
          })
      ]);
    return {
      Enter: handleEnter,
      Backspace: handleBackspace,
      Delete: handleDelete
    };
  }
});

//处理Delete 和Backspace 选中时的删除逻辑
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const deleteSelection = (commands) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return commands.command(({ tr }) => {
    const { selection, doc } = tr;
    //查找选中范围内的所有块
    const nodesInChangedRanges = findChildrenInRange(doc, { from: selection.from, to: selection.to }, (node) => node.type.name == CASSIE_BLOCK);
    for (let i = 0; i < nodesInChangedRanges.length; i++) {
      const node = nodesInChangedRanges[i];
      const endPos = node.pos + node.node.nodeSize;
      if (selection.from < node.pos || selection.to > endPos) {
        return true;
      }
    }
    return commands.deleteSelection();
  });
};
