import { Node } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";
import { generateHTML } from "@tiptap/html";
import { CASSIE_BLOCK, CASSIE_BLOCK_EXTEND, PAGE, PARAGRAPH } from "@/extension/nodeNames";
import { paginationPluginKey } from "@/extension/page/pagePlugn";
import { CassieKit } from "@/extension";
import { ResolvedPos } from "prosemirror-model";

export type PageOptions = {
  footerHeight: number;
  headerHeight: number;
  bodyHeight: number;
  bodyWidth: number;
  bodyPadding: number;
  isPaging?: boolean;
  design?: boolean;
  headerData?: any[];
  footerData?: any[];
  SystemAttributes?: Record<string, any>;
};

export type SplitInfo = {
  pos: number;
  depth: number;
};

/**
 * @description 获取需要分页的点 然后返回
 * @author Cassie
 * @method getNodeHeight 获取节点高度
 * @param doc 需要计算的doc
 * @param state
 */
export function getNodeHeight(doc: Node, state: EditorState): SplitInfo | null {
  const { schema } = state;
  const { lastChild } = doc;
  let accumolatedHeight = 5;
  let pageBoundary = null;
  let skip = true;
  const { bodyOptions } = paginationPluginKey.getState(state);
  const height = bodyOptions.bodyHeight - bodyOptions.bodyPadding * 4;
  const fulldoc = state.doc;
  const paragraphDefaultHeight = getDefault();
  let curBolck: Node;
  let curPos: ResolvedPos;
  let crudDepth = 0; //深度计数
  let pNode: Node | null;
  doc.descendants((node: Node, pos: number, parentNode: Node | null, i) => {
    if (pNode != null && pNode != parentNode) {
      crudDepth += 1;
    }
    pNode = parentNode;
    if (node.type === schema.nodes[PAGE] && node !== lastChild) {
      return false;
    }
    if (node.type === schema.nodes[PARAGRAPH]) {
      //如果p标签没有子标签直接返回默认高度 否则计算高度
      const pHeight = node.childCount > 0 ? getBlockHeight(node) : paragraphDefaultHeight;
      accumolatedHeight += pHeight;
      /*如果当前段落已经 超出分页高度直接拆分 skip 设置为false 循环到下一个段落时 禁止重复进入*/
      if (accumolatedHeight > height && skip) {
        skip = false; //禁止进入下一个循
        //判断段落是否需要拆分
        if (pHeight > paragraphDefaultHeight) {
          const point = getBreakPos(node);
          if (point) {
            pageBoundary = {
              pos: pos + point,
              depth: crudDepth + 1
            };
            return false;
          }
        }
        //如果段落是当前块的第一个节点直接返回上一层级的切割点
        if (curBolck.firstChild == node) {
          pageBoundary = {
            pos: curPos.pos,
            depth: crudDepth - 1
          };
          return false;
        }
        //直接返回当前段落
        pageBoundary = {
          pos,
          depth: crudDepth
        };
      }
      return false;
    }
    //如果是以 CASSIE_BLOCK块为节点的话则 拆分到最细 以pp标签为单位进行拆分
    if (node.type === schema.nodes[CASSIE_BLOCK]) {
      const pHeight = getBlockHeight(node);
      const h = accumolatedHeight + pHeight;
      if (h > height && skip) {
        const contentHeight = getContentHeight(node);
        accumolatedHeight = h - contentHeight;
        curBolck = node;
        curPos = fulldoc.resolve(pos);
        return true;
      }
      accumolatedHeight += pHeight;
      return false;
    }
    /*if (node.type === schema.nodes[CASSIE_BLOCK_EXTEND]) {
      const pHeight = getBlockHeight(node);
      const h = accumolatedHeight + pHeight;
      if (h > height && skip) {
        accumolatedHeight += 8;
        return true;
      }
      accumolatedHeight += pHeight;
      return false;
    }*/
  });
  return pageBoundary ? pageBoundary : null;
}

/**
 *获取段落里最后一个需要分页的地方
 * 行内中文字符和英文字符宽度超过 段落宽度 计算
 * 没有超过直接返回null
 * 由于行内有可能含有图片 不需要计算图片
 * @param node
 * @param width
 */
function getBreakPos(cnode: Node) {
  const paragraphDOM = document.getElementById(cnode.attrs.id);
  if (!paragraphDOM) return null;
  const width = paragraphDOM.offsetWidth;
  let strLength = 0;
  let index = 0;
  cnode.descendants((node: Node, pos: number, _: Node | null, _i: number) => {
    //todo 文字计算的时候使用性能较低 需要使用二分查找提高性能
    if (node.isText) {
      const nodeText = node.text;
      if (nodeText) {
        for (let i = 0; i < nodeText.length; i++) {
          const wordl = computedWidth(nodeText.charAt(i));
          if (strLength + wordl > width) {
            strLength = wordl;
            index = pos + i + 1;
          } else {
            strLength += wordl;
          }
        }
      }
    } else {
      const html = generateHTML(getJsonFromDoc(node), getExtentions());
      const wordl = computedWidth(html);
      if (strLength + wordl > width) {
        strLength = wordl;
        index = pos + 1;
      } else {
        strLength += wordl;
      }
    }
  });
  return index ? index : null;
}

/**
 * 工具类
 * @param node
 */
function getJsonFromDoc(node: Node) {
  return {
    type: "doc",
    content: [node.toJSON()]
  };
}

function getExtentions() {
  return [
    CassieKit.configure({
      textAlign: { types: ["heading", "paragraph"] },
      mention: {
        HTMLAttributes: {
          class: "bg-gray-300"
        }
      },
      page: false,
      focus: false,
      history: false
    })
  ];
}
function getDefault() {
  const div = document.getElementById("computedspan");
  if (!div) return 0;
  return div.offsetHeight;
}
function computedWidth(html: string) {
  const span = document.getElementById("computedspan");
  if (!span) return 0;
  span.innerHTML = html;
  const width = span.offsetWidth;
  return width;
}

/**
 * @description 获取节点高度 根据id获取dom高度
 * @author Cassie
 * @method getBlockHeight
 */
function getBlockHeight(node: Node): number {
  const paragraphDOM = document.getElementById(node.attrs.id);
  if (paragraphDOM) {
    return paragraphDOM.offsetHeight;
  }
  return 0;
}
function getContentHeight(node: Node): number {
  const nodeDOM = document.getElementById(node.attrs.id);
  if (nodeDOM) {
    const content = nodeDOM.querySelector(".content");
    if (content) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return content.offsetHeight;
    }
  }

  return 0;
}

export class UnitConversion {
  arrDPI: any[] = [];

  constructor() {
    const arr: any[] = [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.screen.deviceXDPI) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      arr.push(window.screen.deviceXDPI);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      arr.push(window.screen.deviceYDPI);
    } else {
      const tmpNode: HTMLElement = document.createElement("DIV");
      tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:-99;visibility:hidden";
      document.body.appendChild(tmpNode);
      arr.push(tmpNode.offsetWidth);
      arr.push(tmpNode.offsetHeight);
      if (tmpNode && tmpNode.parentNode) {
        tmpNode.parentNode.removeChild(tmpNode);
      }
    }
    this.arrDPI = arr;
  }

  /**
   * @description px to mm
   * @param value px值
   */
  pxConversionMm(value: number): number {
    const inch = value / this.arrDPI[0];
    const c_value = inch * 25.4;
    return Number(c_value.toFixed());
  }

  /**
   * @description mm to px
   * @param value px值
   */
  mmConversionPx(value: number) {
    const inch = value / 25.4;
    const c_value = inch * this.arrDPI[0];
    return Number(c_value.toFixed());
  }
}
