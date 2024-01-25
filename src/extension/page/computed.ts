import { CASSIE_BLOCK_EXTEND, EXTEND, PAGE, PARAGRAPH } from "@/extension/nodeNames";
import { NodesComputed, PluginState, SplitParams } from "@/extension/page/types";
import { Fragment, Node, Slice } from "@tiptap/pm/model";
import { EditorState, Transaction } from "@tiptap/pm/state";
import { getNodeHeight, SplitInfo } from "@/extension/page/core";
import { getNodeType } from "@tiptap/core";
import { ReplaceStep } from "@tiptap/pm/transform";
import { Selection } from "@tiptap/pm/state";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuid } from "uuid";

//默认计算方法
export const defaultNodesComputed: NodesComputed = {
  [PARAGRAPH]: (node, parent, index) => {
    return true;
  }
};
/*
 * PageComputedContext 分页核心计算class
 * */
export class PageComputedContext {
  nodesComputed: NodesComputed;
  state: EditorState;
  tr: Transaction;
  pluginState: PluginState;

  constructor(nodesComputed: NodesComputed, pluginState: PluginState, state: EditorState) {
    this.nodesComputed = nodesComputed;
    this.tr = state.tr;
    this.state = state;
    this.pluginState = pluginState;
  }
  //核心执行逻辑
  run() {
    const { selection, doc } = this.state;
    const { inserting, deleting, checkNode, splitPage }: PluginState = this.pluginState;
    if (splitPage) return this.initComputed();
    if (checkNode) return this.checkNodeAndFix();
    if (!inserting && deleting && selection.$head.node(1) === doc.lastChild) return this.tr;
    this.computed();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.checkNode = true;
    return this.tr;
  }

  computed() {
    const tr = this.tr;
    const { selection } = this.state;
    const curNunmber = tr.doc.content.findIndex(selection.head).index + 1;
    if (tr.doc.childCount > 1 && tr.doc.content.childCount != curNunmber) {
      this.mergeDocument();
    }
    this.splitDocument();
    return this.tr;
  }

  /**
   * 文档开始加载的时候进行初始化分页
   */
  initComputed() {
    this.mergeDefaultDocument(1);
    this.splitDocument();
    return this.tr;
  }
  /**
   * @description 递归分割page
   */
  splitDocument() {
    const { schema } = this.state;
    /*获取最后一个page计算高度 如果返回值存在的话证明需要分割*/
    const splitInfo: SplitInfo | null = getNodeHeight(this.tr.doc, this.state);
    if (!splitInfo) return;
    const type = getNodeType(PAGE, schema);
    this.splitPage({
      pos: splitInfo.pos,
      depth: splitInfo.depth,
      typesAfter: [{ type }],
      schema: schema
    });
    this.splitDocument();
  }

  /**
   * 重第count页开始合并page
   * @param count
   */
  mergeDefaultDocument(count: number) {
    const tr = this.tr;
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
    this.tr = tr;
  }
  /**
   * @method mergeDocument
   * @description  合并剩余文档 将剩余文档进行分页
   *  深度判断：如果剩余页的 第一个子标签是 扩展类型(是主类型的拆分类型) 进行合并的时候 深度为2
   *  如果第一个标签不是扩展类型 则深度为1
   */
  mergeDocument() {
    const tr = this.tr;
    const { selection } = this.state;
    const count = tr.doc.content.findIndex(selection.head).index + 1;
    //把所有的page 合并成一个 page
    this.mergeDefaultDocument(count);
  }
  /**
   * @description 分页主要逻辑 修改系统tr split方法 添加默认 extend判断 默认id重新生成
   * @author Cassie
   * @method splitPage 分割页面
   * @param pos
   * @param depth
   * @param typesAfter
   * @param schema
   */
  splitPage({ pos, depth = 1, typesAfter, schema }: SplitParams) {
    const tr = this.tr;
    const $pos = tr.doc.resolve(pos);
    let before = Fragment.empty;
    let after = Fragment.empty;
    for (let d = $pos.depth, e = $pos.depth - depth, i = depth - 1; d > e; d--, i--) {
      //新建一个和 $pos.node(d) 一样的节点 内容是 before
      before = Fragment.from($pos.node(d).copy(before));
      const typeAfter = typesAfter && typesAfter[i];
      const n = $pos.node(d);
      let na: Node | null = $pos.node(d).copy(after);
      if (schema.nodes[n.type.name + EXTEND]) {
        const attr = Object.assign({}, n.attrs, { id: uuid() });
        na = schema.nodes[n.type.name + EXTEND].createAndFill(attr, after);
      } else {
        //处理id重复的问题
        if (na && na.attrs.id) {
          let extend = {};
          if (na.attrs.extend == "false") {
            extend = { extend: "true" };
          }
          //重新生成id
          const attr = Object.assign({}, n.attrs, { id: uuid(), ...extend });
          na = schema.nodes[n.type.name].createAndFill(attr, after);
        }
      }
      after = Fragment.from(
        typeAfter
          ? typeAfter.type.create(
              {
                id: uuid(),
                pageNumber: na?.attrs.pageNumber + 1
              },
              after
            )
          : na
      );
    }
    tr.step(new ReplaceStep(pos, pos, new Slice(before.append(after), depth, depth)));
    this.tr = tr;
  }
  /**
   * desc 检查并修正分页造成的段落分行问题
   */
  checkNodeAndFix() {
    let tr = this.tr;
    const { doc } = tr;
    const { schema } = this.state;
    let beforeBolck: Node | null = null;
    let beforePos = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    this.tr = tr;
    return this.tr;
  }
}
