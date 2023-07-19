// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { EditorState, Plugin, PluginKey, Selection, Transaction } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { getNodeType } from "@tiptap/core";
import { CASSIE_BLOCK_EXTEND, EXTEND, PAGE, PARAGRAPH } from "@/extension/nodeNames";
import { Node, Slice } from "@tiptap/pm/model";
import { splitPage } from "@/extension/page/splitPage";
import { getNodeHeight, PageOptions, SplitInfo } from "@/extension/page/core";
import { findParentDomRefOfType } from "@/utils/index";
import { Editor } from "@tiptap/core";
import { ReplaceStep } from "@tiptap/pm/transform";

type PluginState = {
  bodyOptions: PageOptions | null;
  deleting: boolean;
  inserting: boolean;
  checkNode: boolean;
  splitPage: boolean;
};
export const paginationPluginKey = new PluginKey("pagination");
export const pagePlugin = (editor: Editor, bodyOption: PageOptions) => {
  const plugin: Plugin = new Plugin<PluginState>({
    key: paginationPluginKey,
    view: () => {
      return {
        /*
         * 1:获取当前鼠标所在的page
         * 2：判断当前的page div高度是否超过了 固定高度
         * 3：超过固定高度则设置标志位setMeta   Meta 只在一个tr有效
         * */
        update: (view: EditorView, prevState: EditorState) => {
          const { selection, schema, tr } = view.state;
          if (view.state.doc.eq(prevState.doc)) return;
          const domAtPos = view.domAtPos.bind(view);
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
                window.stepStatus = false;
              }
              const state = view.state.apply(tr);
              view.updateState(state);
            }
            /*检验 node节点完整性*/
            if (window.checkNode) {
              window.checkNode = false;
              tr.setMeta("checkNode", true);
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
        inserting: false,
        checkNode: false,
        splitPage: false
      }),
      /*判断标志位是否存在  如果存在 则修改 state 值
       * Meta数据是一个事务级别的 一个事务结束 meta消失
       * state则在整个生命周期里都存在的
       * */
      apply: (tr, prev): PluginState => {
        const next: PluginState = { ...prev };
        const splitPage: boolean = tr.getMeta("splitPage");
        const checkNode: boolean = tr.getMeta("checkNode");
        const deleting: boolean = tr.getMeta("deleting");
        const inserting: boolean = tr.getMeta("inserting");
        next.splitPage = splitPage ? splitPage : false;
        next.inserting = inserting ? inserting : false;
        next.deleting = deleting ? deleting : false;
        next.bodyOptions = bodyOption;
        next.checkNode = checkNode ? checkNode : false;
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
      const { inserting, deleting, checkNode, splitPage } = this.getState(state);
      if (!deleting && !inserting) {
        if (checkNode) {
          tr = checkNodeAndFix(tr, state);
          return tr.scrollIntoView();
        }
        if (splitPage) {
          tr = mergeDocument(tr, 1);
          tr = splitDocument(tr, state);
          return tr.scrollIntoView();
        }
        return;
      }
      /*如果是删除并且在最后一页 则不做任何处理*/
      if (!inserting && deleting && selection.$head.node(1) === doc.lastChild) {
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
      window.checkNode = true;
      return tr.scrollIntoView();
    },
    props: {
      handleKeyDown(view, event) {
        if (event.code == "Backspace") {
          window.stepStatus = true;
        } else {
          window.stepStatus = false;
        }
        return false;
      }
    }
  });
  return plugin;
};

/**
 * desc:匹配中文
 * @param text
 */
function chineseMatches(text: string) {
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const chineseMatches = text.match(chineseRegex);
  return chineseMatches != null;
}

/**
 * @description:递归寻找 curnode是不是node 的最后一个节点
 * @param node 被查找的节点
 * @param curnode  查找的节点
 */
function findLastNode(node: Node, curnode: Node): boolean {
  return !!node.lastChild && (node.lastChild == curnode || findLastNode(node.lastChild, curnode));
}

/**
 * @param desc 检查并修正分页造成的段落分行问题
 * @param tr
 * @param state
 */
function checkNodeAndFix(tr: Transaction, state: EditorState) {
  const { doc } = tr;
  const { schema } = state;
  let beforeBolck: Node = null;
  let beforePos = 0;
  doc.descendants((node: Node, pos: number, parentNode: Node | null, i) => {
    if (node.type === schema.nodes[PARAGRAPH] && node.attrs.extend == "true") {
      if (beforeBolck == null) {
        beforeBolck = node;
        beforePos = pos;
      } else {
        const mappedPos = tr.mapping.map(pos);
        tr = tr.step(new ReplaceStep(mappedPos - 1, mappedPos + 1, Slice.empty));
        return false;
      }
    }
    //如果进入了新的扩展块 直接 清除 上次的 记录
    if (node.type === schema.nodes[CASSIE_BLOCK_EXTEND]) {
      beforeBolck = null;
      beforePos = 0;
      return true;
    }
  });
  return tr;
}

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
    //如果 前一页的最后一个node 和后一页的node 是同类 则合并
    if (tr.doc.content.lastChild && tr.doc.content.lastChild.firstChild && tr.doc.content.lastChild.firstChild.type.name.includes(EXTEND)) {
      depth = 2;
    }
    tr.join(tr.doc.content.size - nodesize, depth);
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
  console.log(pageBody.scrollHeight + "|" + bodyOption.bodyHeight);

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
