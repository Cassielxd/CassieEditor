import { EditorState, Plugin, PluginKey, Transaction } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { getNodeType } from "@tiptap/core";
import { EXTEND, PAGE } from "@/extension/nodeNames";
import { Schema, Slice } from "@tiptap/pm/model";
import { splitPage } from "@/extension/page/splitPage";
import { getNodeHeight, PageOptions, SplitInfo } from "@/extension/page/core";
import {  findParentDomRefOfType } from  "@/utils/index"
import { findChildren } from "@tiptap/vue-3";
import { ReplaceStep } from "@tiptap/pm/transform";

type PluginState = {
  bodyOptions: PageOptions | null;
  deleting: boolean;
  inserting: boolean;
};

export const paginationPluginKey = new PluginKey("pagination");
export const paginationPlugin = (bodyOption: PageOptions) => {
  const plugin: Plugin = new Plugin<PluginState>({
    key: paginationPluginKey,

    view: () => {
      return {
        /*
         * 1:获取当前鼠标所在的page
         * 2：判断当前的page div高度是否超过了 固定高度
         * 3：超过固定高度则设置标志位setMeta
         * */
        update: (view: EditorView, prevState: EditorState) => {
          const { selection, schema, tr } = view.state;
          if (view.state.doc.eq(prevState.doc)) return;
          const domAtPos = view.domAtPos.bind(view);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const deleting = window.stepStatus ? window.stepStatus : false;
          const pageDOM = findParentDomRefOfType(schema.nodes[PAGE], domAtPos)(selection);
          if (!pageDOM) return;
          const pageBody = (pageDOM as HTMLElement).querySelector(".PageContent");
          if (pageBody) {
            const inserting = isOverflown(pageBody, bodyOption);
            if (inserting || deleting) {
              if (inserting) tr.setMeta("inserting", inserting);
              if (deleting) {
                tr.setMeta("deleting", true);
                /*防止多次触发没完没了的 进行分割处理*/
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                window.stepStatus = false;
              }
              tr.setMeta("bodyOptions", bodyOption);
              const state = view.state.apply(tr);
              view.updateState(state);
            }
          }
        }
      };
    },
    state: {
      init: (): PluginState => ({
        bodyOptions: null,
        deleting: false,
        inserting: false
      }),
      /*判断标志位是否存在  如果存在 则修改 state 值
       * Meta数据是一个事务级别的 一个事务结束 meta消失
       * state则在整个生命周期里都存在的
       * */
      apply: (tr, prev): PluginState => {
        const next: PluginState = { ...prev };
        const deleting: boolean = tr.getMeta("deleting");
        const inserting: boolean = tr.getMeta("inserting");
        const bodyOptions: PageOptions = tr.getMeta("bodyOptions");
        next.inserting = inserting ? inserting : false;
        next.deleting = deleting ? deleting : false;
        next.bodyOptions = bodyOptions;
        return next;
      }
    },
    /**
     * @description 根据apply 方法里 设置的 state 进行判断 如果需要分页 则执行分页逻辑
     * @author Cassie
     * @method appendTransaction 添加一个新的Transaction
     * @param newTr 新的 Transaction
     * @param _prevState
     * @param state
     */
    appendTransaction([newTr], _prevState, state) {
      // eslint-disable-next-line prefer-const
      let { selection, tr, doc, schema } = state;
      const { inserting, deleting } = this.getState(state);
      if (!deleting && !inserting) return;
      /*如果是删除并且在最后一页 则不做任何处理*/
      if (!inserting && deleting && selection.$head.node(1) === doc.lastChild) {
        return tr.scrollIntoView();
      }
      /*如果当前需要分页的是最后一页 并且是在最后一行*/
      const cpage = selection.$head.node(1);
      const cblock = state.selection.$head.node(2);
      if (cpage == doc.lastChild && cpage.lastChild == cblock && cblock.lastChild === state.selection.$head.node(3) && !deleting) {
        const type = getNodeType(PAGE, schema);
        if (tr.selection.$head.parentOffset === 0) {
          tr = tr.step(new ReplaceStep(tr.selection.head - 2, tr.selection.head, Slice.empty));
          tr = splitPage({ tr: tr, pos: tr.selection.head, depth: 3, typesAfter: [{ type }], schema: schema });
          return tr.scrollIntoView();
        }
        return splitPage({
          tr: tr,
          pos: tr.selection.head - 1,
          depth: 2,
          typesAfter: [{ type }],
          schema: schema
        }).scrollIntoView();
        return tr.scrollIntoView();
      }
      const curNunmber = tr.doc.content.findIndex(selection.head).index + 1;
      //如果只有一页的情况 或者 当前在最后一页的情况
      if (tr.doc.childCount == 1 || tr.doc.content.childCount == curNunmber) {
        tr = splitDocument(tr, state);
        return tr.scrollIntoView();
      }
      //合并当前页和剩下的 页面重新计算
      tr = mergeDocument(tr, curNunmber);
      tr = splitDocument(tr, state);
      return tr.scrollIntoView();
    },
    props: {
      handleKeyDown(view, event) {
        if (event.code == "Backspace") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.stepStatus = true;
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.stepStatus = false;
        }
        return false;
      }
    }
  });
  return plugin;
};

/**
 * @method mergeDocument
 * @param tr
 * @param count 当前需要分页的页码
 * @description  合并剩余文档 将剩余文档进行分页
 *  深度判断：如果剩余页的 第一个子标签是 扩展类型(是主类型的拆分类型) 进行合并的时候 深度为2
 *  如果第一个标签不是扩展类型 则深度为1
 */
function mergeDocument(tr: Transaction, count: number): Transaction {
  //把所有的page 合并成一个 page
  while (tr.doc.content.childCount > count) {
    const nodesize = tr.doc.content.lastChild ? tr.doc.content.lastChild.nodeSize : 0;
    let depth = 1;
    if (tr.doc.content.lastChild && tr.doc.content.lastChild.firstChild && tr.doc.content.lastChild.firstChild.type.name.includes(EXTEND)) {
      depth = 2;
    }
    tr.join(tr.doc.content.size - nodesize, depth);
  }
  if (tr.doc.lastChild) {
    let nodes = findChildren(tr.doc.lastChild, (child) => child.type.name.includes(EXTEND));
    while (nodes.length > 1) {
      const n = nodes[1];
      tr.join(n.pos, 1);
      nodes = findChildren(tr.doc, (child) => child.type.name.includes(EXTEND));
    }
  }
  return tr;
}

/**
 * @author Cassie
 * @method isOverflown
 * @param pageBody  当前需要分页的 dom
 * @param bodyOption 需要分页的条件
 */
const isOverflown = (pageBody: Element, bodyOption: PageOptions) => {
  return pageBody.scrollHeight > bodyOption.bodyHeight;
};

/**
 * @description 递归分割page
 * @author Cassie
 * @method splitDocument 分割文档
 * @param tr Transaction
 * @param state EditorState
 */
function splitDocument(tr: Transaction, state: EditorState): Transaction {
  const { schema } = state;
  /*获取最后一个page计算高度 如果返回值存在的话证明需要分割*/
  const splitInfo: SplitInfo | null = getNodeHeight(tr.doc, state);
  if (!splitInfo) return tr;
  const type = getNodeType(PAGE, schema);
  const newTr = splitPage({
    tr: tr,
    pos: splitInfo.pos,
    depth: splitInfo.depth,
    typesAfter: [{ type }],
    schema: schema
  });
  return splitDocument(newTr, state);
}
