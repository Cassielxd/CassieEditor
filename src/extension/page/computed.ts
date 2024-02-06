// @ts-noCheck
import { TABLE, CASSIE_BLOCK, CASSIE_BLOCK_EXTEND, EXTEND, HEADING, LISTITEM, PAGE, PARAGRAPH, TABLE_ROW } from "@/extension/nodeNames";
import { NodesComputed, PluginState, SplitParams } from "@/extension/page/types";
import { Fragment, Node, Slice } from "@tiptap/pm/model";
import { EditorState, Transaction } from "@tiptap/pm/state";
import { getAbsentHtmlH, getBreakPos, getContentSpacing, getDefault, getDomHeight, SplitInfo } from "@/extension/page/core";
import { getNodeType } from "@tiptap/core";
import { ReplaceStep } from "@tiptap/pm/transform";
import { Editor } from "@tiptap/core/dist/packages/core/src/Editor";
import { getId } from "@/utils/id";

//默认高度计算方法
export const defaultNodesComputed: NodesComputed = {
  [TABLE_ROW]: (splitContex, node, pos, parent, dom) => {
    const pHeight = getDomHeight(dom);
    if (splitContex.isOverflow(pHeight)) {
      const chunks = splitContex.splitResolve(pos);
      //如果当前行是table的第一行并且已经超过分页高度 直接返回上一层级的切割点 保证table不会被拆分
      if (parent?.firstChild == node) {
        splitContex.setBoundary(chunks[chunks.length - 2][2], chunks.length - 2);
        return false;
      }
      //如果不是第一行 直接返回当前行的切割点
      splitContex.setBoundary(pos, chunks.length - 1);
    } else {
      splitContex.addHeight(pHeight);
    }
    return false;
  },
  /**
   * table 分割算法  如果table的高度超过分页高度 直接返回继续循环 tr
   * @param splitContex
   * @param node
   * @param pos
   * @param parent
   * @param dom
   */
  [TABLE]: (splitContex, node, pos, parent, dom) => {
    const pHeight = getDomHeight(dom);
    //如果table的高度超过分页高度 直接返回继续循环 tr
    if (splitContex.isOverflow(pHeight)) return true;
    //没有超过分页高度 累加高度
    splitContex.addHeight(pHeight);
    return false;
  },
  /**
   * h1-h6 分割算法 如果heading的高度超过分页高度 直接返回当前heading
   * @param splitContex
   * @param node
   * @param pos
   * @param parent
   * @param dom
   */
  [HEADING]: (splitContex, node, pos, parent, dom) => {
    const pHeight = getDomHeight(dom);
    if (splitContex.isOverflow(pHeight)) {
      const chunks = splitContex.splitResolve(pos);
      //直接返回当前段落
      splitContex.setBoundary(pos, chunks.length - 1);
    }
    splitContex.addHeight(pHeight);
    return false;
  },
  /**
   * p 分割算法 如果段落标签没有超过 默认段落高度 则直接返回段落分割点，否则继续计算 段落内部分割点
   * @param splitContex
   * @param node
   * @param pos
   * @param parent
   * @param dom
   */
  [PARAGRAPH]: (splitContex, node, pos, parent, dom) => {
    //如果p标签没有子标签直接返回默认高度 否则计算高度
    const pHeight = node.childCount > 0 ? getDomHeight(dom) : splitContex.getDefaultHeight();
    if (!splitContex.isOverflow(pHeight)) {
      splitContex.addHeight(pHeight);
      return false;
    }
    /*如果当前段落已经 超出分页高度直接拆分 skip 设置为false 循环到下一个段落时 禁止重复进入*/
    const chunks = splitContex.splitResolve(pos);
    //判断段落是否需要拆分
    if (pHeight > splitContex.getDefaultHeight()) {
      const point = getBreakPos(node, dom);
      if (point) {
        splitContex.setBoundary(pos + point, chunks.length);
        return false;
      }
    }
    //如果段落是当前块的第一个节点直接返回上一层级的切割点
    if (parent?.firstChild == node) {
      splitContex.setBoundary(chunks[chunks.length - 2][2], chunks.length - 2);
      return false;
    }
    //直接返回当前段落
    splitContex.setBoundary(pos, chunks.length - 1);
    return false;
  },
  //自定义块
  [CASSIE_BLOCK]: (splitContex, node, pos, parent, dom) => {
    const pHeight = getDomHeight(dom);
    if (splitContex.isOverflow(pHeight)) {
      const contentHeight = getContentSpacing(dom);
      splitContex.addHeight(contentHeight);
      return true;
    }
    splitContex.addHeight(pHeight);
    return false;
  },
  [CASSIE_BLOCK_EXTEND]: (splitContex, node, pos, parent, dom) => {
    splitContex.addHeight(8);
    return true;
  },
  /**
   * page 分割算法 永远返回最后一个page进行分割
   * @param splitContex
   * @param node
   * @param pos
   * @param parent
   * @param dom
   */
  [PAGE]: (splitContex, node, pos, parent, dom) => {
    return node == splitContex.lastPage();
  }
};

export class SplitContex {
  #doc: Node; //文档
  #accumolatedHeight = 0; //累加高度
  #pageBoundary: SplitInfo | null = null; //返回的切割点
  #height = 0; //分页的高度
  #paragraphDefaultHeight = 0; //p标签的默认高度
  constructor(doc: Node, height: number, paragraphDefaultHeight: number) {
    this.#doc = doc;
    this.#height = height;
    this.#paragraphDefaultHeight = paragraphDefaultHeight;
  }
  getDefaultHeight() {
    return this.#paragraphDefaultHeight;
  }
  isOverflow(height: number) {
    return this.#accumolatedHeight + height > this.#height;
  }
  addHeight(height: number) {
    this.#accumolatedHeight += height;
  }
  setBoundary(pos: number, depth: number) {
    this.#pageBoundary = {
      pos,
      depth
    };
  }
  pageBoundary() {
    return this.#pageBoundary;
  }
  splitResolve(pos: number) {
    const array = this.#doc.resolve(pos).path;
    const chunks = [];
    if (array.length <= 3) return array;
    const size = 3;
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  lastPage() {
    return this.#doc.lastChild;
  }
}

/*
 * PageComputedContext 分页核心计算class
 * */
export class PageComputedContext {
  nodesComputed: NodesComputed;
  state: EditorState;
  tr: Transaction;
  pluginState: PluginState;
  editor: Editor;
  constructor(editor: Editor, nodesComputed: NodesComputed, pluginState: PluginState, state: EditorState) {
    this.editor = editor;
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
    if (inserting || deleting) {
      this.computed();
      window.checkNode = true;
    }
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
    const splitInfo: SplitInfo | null = this.getNodeHeight();
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
      if (tr.doc.content.lastChild != tr.doc.content.firstChild) {
        //获取倒数第二页
        const prePage = tr.doc.content.child(tr.doc.content.childCount - 2);
        //获取最后一页
        const lastPage = tr.doc.content.lastChild;
        //如果最后一页的第一个子标签和前一页的最后一个子标签类型一致 或者是扩展类型(是主类型的拆分类型) 进行合并的时候 深度为2
        if ((lastPage?.firstChild?.type == prePage?.lastChild?.type || lastPage?.firstChild?.type.name.includes(EXTEND)) && lastPage?.lastChild?.attrs?.extend) {
          depth = 2;
        }
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
        const attr = Object.assign({}, n.attrs, { id: getId() });
        na = schema.nodes[n.type.name + EXTEND].createAndFill(attr, after);
      } else {
        //处理id重复的问题
        if (na && na.attrs.id) {
          let extend = {};
          if (na.attrs.extend == false) {
            extend = { extend: true };
          }
          //重新生成id
          const attr = Object.assign({}, n.attrs, { id: getId(), ...extend });
          na = schema.nodes[n.type.name].createAndFill(attr, after);
        }
      }
      after = Fragment.from(
        typeAfter
          ? typeAfter.type.create(
              {
                id: getId(),
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

  /**
   * @description 获取需要分页的点 然后返回
   * @author Cassie
   * @method getNodeHeight 获取节点高度
   */
  getNodeHeight(): SplitInfo | null {
    const doc = this.tr.doc;
    const { bodyOptions } = this.pluginState;
    const splitContex = new SplitContex(doc, bodyOptions.bodyHeight - bodyOptions.bodyPadding * 2, getDefault());
    const nodesComputed = this.nodesComputed;
    doc.descendants((node: Node, pos: number, parentNode: Node | null, i) => {
      if (!splitContex.pageBoundary()) {
        let dom = document.getElementById(node.attrs.id);
        if (!dom && node.type.name != PAGE) dom = getAbsentHtmlH(node);
        return nodesComputed[node.type.name](splitContex, node, pos, parentNode, dom);
      }
      return false;
    });
    return splitContex.pageBoundary() ? splitContex.pageBoundary() : null;
  }
}
