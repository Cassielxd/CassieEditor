import { Node } from "@tiptap/pm/model";
import { generateHTML } from "@tiptap/html";
import { CassieKit } from "@/extension";
import { NodesComputed } from "@/extension/page/types";

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
  NodesComputed?: NodesComputed;
  SystemAttributes?: Record<string, any>;
};

export type SplitInfo = {
  pos: number;
  depth: number;
};

export function getFlag(cnode: Node) {
  const paragraphDOM = document.getElementById(cnode.attrs.id);
  if (!paragraphDOM) return null;
  const width = paragraphDOM.getBoundingClientRect().width;
  const html = generateHTML(getJsonFromDoc(cnode), getExtentions());
  const wordl = computedWidth(html, false);
  //证明一行都没填满 应当执行 合并
  if (width >= wordl) {
    return false;
  }
  let strLength = 0;
  //多行计算最后一行是不是满行
  cnode.descendants((node: Node, pos: number, _: Node | null, _i: number) => {
    if (node.isText) {
      const nodeText = node.text;
      if (nodeText) {
        for (let i = 0; i < nodeText.length; i++) {
          const wl = computedWidth(nodeText.charAt(i));
          if (strLength + wl > width) {
            strLength = wl;
          } else {
            strLength += wl;
          }
        }
      }
    } else {
      const html = generateHTML(getJsonFromDoc(node), getExtentions());
      const wordl = computedWidth(html);
      if (strLength + wordl > width) {
        strLength = wordl;
      } else {
        strLength += wordl;
      }
    }
  });
  const space = parseFloat(window.getComputedStyle(paragraphDOM).getPropertyValue("font-size"));
  return Math.abs(strLength - width) < space;
}

/**
 *获取段落里最后一个需要分页的地方
 * 行内中文字符和英文字符宽度超过 段落宽度 计算
 * 没有超过直接返回null
 * 由于行内有可能含有图片 不需要计算图片
 * @param cnode
 * @param dom
 */
export function getBreakPos(cnode: Node, dom: HTMLElement) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const paragraphDOM = dom;
  if (!paragraphDOM) return null;
  const width = paragraphDOM.offsetWidth;
  let strLength = 0;
  let index = 0;
  const html = generateHTML(getJsonFromDoc(cnode), getExtentions());
  const wordl = computedWidth(html, false);
  //如果高度超过默认了 但是宽度没有超过 证明 只有一行 只是里面有 行内元素 比如 图片
  if (width >= wordl) {
    return null;
  }
  cnode.descendants((node: Node, pos: number, _: Node | null, _i: number) => {
    //todo 文字计算的时候使用性能较低 需要使用二分查找提高性能
    if (node.isText) {
      const nodeText = node.text;
      if (nodeText) {
        for (let i = 0; i < nodeText.length; i++) {
          const wl = computedWidth(nodeText.charAt(i));
          if (strLength + wl > width) {
            strLength = wl;
            index = pos + i + 1;
          } else {
            strLength += wl;
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
export function getJsonFromDoc(node: Node) {
  return {
    type: "doc",
    content: [node.toJSON()]
  };
}

export function getExtentions() {
  return [
    CassieKit.configure({
      textAlign: { types: ["heading", "paragraph"] },
      highlight: {
        multicolor: true
      },
      table: {
        HTMLAttributes: {
          class: "border-collapse border border-slate-400"
        }
      },
      tableCell: {
        HTMLAttributes: {
          class: "border border-slate-300"
        }
      },
      tableHeader: {
        HTMLAttributes: {
          class: "border border-slate-300"
        }
      },
      page: false,
      focus: false,
      history: false
    })
  ];
}

/**
 * @description 获取节点高度 根据id获取dom高度
 * @author Cassie
 * @method getBlockHeight
 */
export function getBlockHeight(node: Node): number {
  const paragraphDOM = document.getElementById(node.attrs.id);
  if (paragraphDOM) {
    return paragraphDOM.offsetHeight;
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

const map = new Map();

export function computedWidth(html: string, cache = true) {
  if (map.has(html)) {
    return map.get(html);
  }
  const computedspan = document.getElementById("computedspan");
  if (html == " ") {
    html = "&nbsp;";
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (computedspan) {
    computedspan.innerHTML = html;
    const width = computedspan.getBoundingClientRect().width;
    if (cache) {
      map.set(html, width);
    }
    return width;
  }
  return 0;
}

export function getContentSpacing(dom: HTMLElement) {
  const content = dom.querySelector(".content");
  if (dom && content) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const contentStyle = window.getComputedStyle(content);
    const paddingTop = contentStyle.getPropertyValue("padding-top");
    const paddingBottom = contentStyle.getPropertyValue("padding-bottom");
    const marginTop = contentStyle.getPropertyValue("margin-top");
    const marginBottom = contentStyle.getPropertyValue("margin-bottom");
    const padding = parseFloat(paddingTop) + parseFloat(paddingBottom);
    const margin = parseFloat(marginTop) + parseFloat(marginBottom);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return padding + margin + (dom.offsetHeight - content.offsetHeight);
  }
  return 0;
}

export function getSpacing(dom: HTMLElement) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const contentStyle = window.getComputedStyle(dom);
  const paddingTop = contentStyle.getPropertyValue("padding-top");
  const paddingBottom = contentStyle.getPropertyValue("padding-bottom");
  const marginTop = contentStyle.getPropertyValue("margin-top");
  const marginBottom = contentStyle.getPropertyValue("margin-bottom");
  const padding = parseFloat(paddingTop) + parseFloat(paddingBottom);
  const margin = parseFloat(marginTop) + parseFloat(marginBottom);
  return padding + margin;
}

export function getDefault() {
  if (map.has("defaultheight")) {
    return map.get("defaultheight");
  }
  const computedspan = document.getElementById("computedspan");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const defaultheight = getDomHeight(computedspan);
  map.set("defaultheight", defaultheight);
  return defaultheight;
}

export function getDomHeight(dom: HTMLElement) {
  const contentStyle = window.getComputedStyle(dom);
  const paddingTop = contentStyle.getPropertyValue("padding-top");
  const paddingBottom = contentStyle.getPropertyValue("padding-bottom");
  const marginTop = contentStyle.getPropertyValue("margin-top");
  const marginBottom = contentStyle.getPropertyValue("margin-bottom");
  const padding = parseFloat(paddingTop) + parseFloat(paddingBottom);
  const margin = parseFloat(marginTop) + parseFloat(marginBottom);
  return padding + margin + dom?.offsetHeight + parseFloat(contentStyle.borderWidth);
}

export function getAbsentHtmlH(node: Node) {
  const html = generateHTML(getJsonFromDoc(node), getExtentions());
  const computeddiv = document.getElementById("computeddiv");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  computeddiv.innerHTML = html;
  const nodesom = document.getElementById(node.attrs.id);
  return nodesom;
}

export function removeAbsentHtmlH(dom: HTMLElement) {
  const computeddiv = document.getElementById("computeddiv");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  computeddiv.innerHTML = "";
}

export function buildComputedHtml(options: any) {
  const computedspan = document.getElementById("computedspan");
  if (!computedspan) {
    const p = document.createElement("p");
    p.classList.add("text-editor");
    p.setAttribute("style", "opacity: 0;position: absolute;z-index: -89;margin-left:-2003px;");
    p.setAttribute("id", "computedspan");
    p.innerHTML = "&nbsp;";
    document.body.append(p);
  }
  const computeddiv = document.getElementById("computeddiv");
  if (!computeddiv) {
    const dom = document.createElement("div");
    dom.setAttribute("class", "Page text-editor relative");
    dom.setAttribute("style", "opacity: 0;position: absolute;z-index: -9999;margin-left:-2003px;max-width:" + options.bodyWidth + "px;width:" + options.bodyWidth + "px;");
    const content = document.createElement("div");
    content.classList.add("PageContent");
    content.setAttribute("style", "min-height: " + options.bodyHeight + "px;padding:" + options.bodyPadding + "px");
    content.setAttribute("id", "computeddiv");
    dom.append(content);
    document.body.append(dom);
  }
}
