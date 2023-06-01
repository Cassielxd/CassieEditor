import { Node } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";
import { CASSIE_BLOCK, CASSIE_BLOCK_EXTEND, PAGE, PARAGRAPH } from "@/extension/nodeNames";
import { paginationPluginKey } from "@/extension/page/pagePlugn";

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
  const width = bodyOptions.bodyWidth - bodyOptions.bodyPadding * 2;
  let curBlock: Node;
  let curPos = 0;
  const fulldoc = state.doc;
  doc.descendants((node: Node, pos: number) => {
    if (node.type === schema.nodes[PAGE] && node !== lastChild) {
      return false;
    }
    if (node.type === schema.nodes[PARAGRAPH]) {
      //如果p标签没有子标签直接返回默认高度 否则计算高度
      const pHeight = node.childCount > 0 ? getBlockHeight(node) : 24;
      accumolatedHeight += pHeight;
      /*如果当前段落已经 超出分页高度直接拆分 skip 设置为false 循环到下一个段落时 禁止重复进入*/
      if (accumolatedHeight > height && skip) {
        const $pos = fulldoc.resolve(pos);
        let depth = $pos.depth;
        if (pHeight > 24) {
          const point = getBreakPos(node);
          if (point) {
            depth += 1;
            pos += point;
          }
        }
        pageBoundary = {
          pos,
          depth: depth
        };
        skip = false; //禁止进入下一个循环
      }
      return false;
    }
    //如果是以 CASSIE_BLOCK块为节点的话则 拆分到最细 以pp标签为单位进行拆分
    if (node.type === schema.nodes[CASSIE_BLOCK]) {
      const pHeight = getBlockHeight(node);
      const h = accumolatedHeight + pHeight;
      if (h > height && skip) {
        curBlock = node;
        curPos = pos;
        accumolatedHeight += 28;
        return true;
      }
      accumolatedHeight += pHeight;
      return false;
    }
    if (node.type === schema.nodes[CASSIE_BLOCK_EXTEND]) {
      const pHeight = getBlockHeight(node);
      const h = accumolatedHeight + pHeight;
      if (h > height && skip) {
        curBlock = node;
        curPos = pos;
        accumolatedHeight += 8;
        return true;
      }
      accumolatedHeight += pHeight;
      return false;
    }
  });
  return pageBoundary ? pageBoundary : null;
}

/**
 *获取段落里最后一个需要分页的地方
 * @param node
 * @param width
 */
function getBreakPos(node: Node) {
  const test = node.textContent;
  const paragraphDOM = document.getElementById(node.attrs.id);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const width = paragraphDOM.offsetWidth;
  if (test) {
    let strLength = 0;
    let index = 0;
    for (let i = 0; i < test.length; i++) {
      const wordl = getStrPx(test.charAt(i));
      if (strLength + wordl > width) {
        strLength = wordl;
        index = i;
      } else {
        strLength += wordl;
      }
    }
    return index;
  }
  return null;
}
/**
 * 系统设置默认fontsize 16px 一个中文字符占16px 一个英文字符占8px
 * @param text
 */
function getStrPx(text: string) {
  const strlength = text.length;
  const chinese = text.match(/[\u4e00-\u9fa5]/g); //匹配中文，match返回包含中文的数组
  const length = strlength + (chinese ? chinese.length : 0);
  return length ? length * 8 : 0;
}

/**
 * @description 获取节点高度 根据id获取dom高度
 * @author Cassie
 * @method getBlockHeight
 */
function getBlockHeight(node: Node): number {
  const parsedPoints = 18;
  const paragraphDOM = document.getElementById(node.attrs.id);
  if (paragraphDOM) {
    return paragraphDOM.offsetHeight;
  }
  return parsedPoints;
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
