import { Node } from "@tiptap/pm/model";
import { generateHTML } from "@tiptap/html";
import { CassieKit } from "@/extension";
import { SplitContext } from "@/extension/page/computed";
import { PARAGRAPH } from "@/extension/nodeNames";

/**
 * 计算最后一行是否填满
 * @param cnode
 */
export function getFlag(cnode: Node) {
  const paragraphDOM = document.getElementById(cnode.attrs.id)||iframeDoc.getElementById(cnode.attrs.id);
  if (!paragraphDOM) return null;
  const width = paragraphDOM.getBoundingClientRect().width;
  const html = generateHTML(getJsonFromDoc(cnode), getExtentions());
  const { width: wordl } = computedWidth(html, false);
  //证明一行都没填满 应当执行 合并
  if (width >= wordl) {
    return false;
  }
  let strLength = 0;
  cnode.descendants((node: Node, pos: number, _: Node | null, _i: number) => {
    //todo 文字计算的时候使用性能较低 需要使用二分查找提高性能
    if (node.isText) {
      const nodeText = node.text;
      if (nodeText) {
        for (let i = 0; i < nodeText.length; i++) {
          const { width: wl } = computedWidth(nodeText.charAt(i));
          if (strLength + wl > width) {
            strLength = wl;
          } else {
            strLength += wl;
          }
        }
      }
    } else {
      const html = generateHTML(getJsonFromDoc(node), getExtentions());
      const { width: wordl } = computedWidth(html);
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
 * 计算节点的宽度和超出的位置
 * @param node
 * @param width
 */
function calculateNodeOverflowWidthAndPoint(node: Node, width: number, splitContex: SplitContext) {
  let strLength = 0;
  let allHeight = 0;
  let maxHeight = 0;
  let index = 0;
  let isFlag = true;
  //默认type
  let nodeType = node.type, attrs = node.attrs, marks = node.marks;
  let defaultNode = node.type.create(attrs, [splitContex.schema.text("1")], marks);
  const htmlD = generateHTML(getJsonFromDoc(defaultNode), getExtentions());
  const { height: heightd } = computedWidth(htmlD);
  maxHeight = heightd;
  node.descendants((node: Node, pos: number, _: Node | null, _i: number) => {
    if (!isFlag) {
      return isFlag;
    }
    //todo 文字计算的时候使用性能较低 需要使用二分查找提高性能
    if (node.isText) {
      const nodeText = node.text;
      if (nodeText) {
        for (let i = 0; i < nodeText.length; i++) {
          let resource = nodeText.charAt(i);
          //fix bug #1 修复空格计算宽度问题和文本有样式的情况计算问题 例如加粗
          if (resource == " ") {
            resource = "&nbsp;";
          }
          resource = generateHTML(getJsonFromDoc(nodeType.create(attrs, [splitContex.schema.text(resource, node.marks)], marks)), getExtentions());
          const { width: wl, height } = computedWidth(resource);
          if (strLength + wl > width) {
            allHeight += height;
            if (splitContex.isOverflow(allHeight)) {
              debugger
              isFlag = false;
              return isFlag;
            }
            index = pos + i + 1;
            strLength = wl;
          } else {
            strLength += wl;
          }
        }
      }
    } else {
      if (node.type.name == "hardBreak") {
        allHeight += heightd;
        if (splitContex.isOverflow(allHeight)) {
          isFlag = false;
          return isFlag;
        }
        index = pos + 1;
      } else {
        const html = generateHTML(getJsonFromDoc(nodeType.create(attrs, [node], marks)), getExtentions());
        const { width: wordl, height } = computedWidth(html);
        if (strLength + wordl > width) {
          allHeight += (maxHeight > height ? maxHeight : height);
          if (splitContex.isOverflow(allHeight)) {
            isFlag = false;
            return isFlag;
          }
          index = pos + 1;
          strLength = wordl;
        } else {
          //if (height > maxHeight) maxHeight = height;
          strLength += wordl;
        }
      }

    }
  });
  return { strLength, index };
}

/**
 *获取段落里最后一个需要分页的地方
 * 行内中文字符和英文字符宽度超过 段落宽度 计算
 * 没有超过直接返回null
 * 由于行内有可能含有图片 不需要计算图片
 * @param cnode
 * @param dom
 */
export function getBreakPos(cnode: Node, dom: HTMLElement, splitContex: SplitContext) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const paragraphDOM = dom;
  if (!paragraphDOM) return null;
  const width = paragraphDOM.offsetWidth;

  const html = generateHTML(getJsonFromDoc(cnode), getExtentions());
  const { width: wordl } = computedWidth(html, false);
  //如果高度超过默认了 但是宽度没有超过 证明 只有一行 只是里面有 行内元素 比如 图片
  if (width >= wordl) {
    return null;
  }
  const { index } = calculateNodeOverflowWidthAndPoint(cnode, width, splitContex);
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

export function getJsonFromDocForJson(json: any) {
  return {
    type: "doc",
    content: [json]
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

let iframeComputed: any = null;
var iframeDoc: any = null;

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
  const computedspan = iframeDoc.getElementById("computedspan");
  if (html == " ") {
    html = "&nbsp;";
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (computedspan) {
    computedspan.innerHTML = html;
    const width = computedspan.getBoundingClientRect().width;
    const height = computedspan.getBoundingClientRect().height;
    if (cache) {
      map.set(html, { height, width });
    }
    computedspan.innerHTML = "&nbsp;";
    return { height, width };
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
  const computedspan = iframeDoc.getElementById("computedspan");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const defaultheight = getDomHeight(computedspan);
  map.set("defaultheight", defaultheight);
  return defaultheight;
}

export function getDomPaddingAndMargin(dom: HTMLElement) {
  const contentStyle = window.getComputedStyle(dom) || iframeComputed.contentWindow.getComputedStyle(dom);
  const paddingTop = contentStyle.getPropertyValue("padding-top");
  const paddingBottom = contentStyle.getPropertyValue("padding-bottom");
  const marginTop = contentStyle.getPropertyValue("margin-top");
  const marginBottom = contentStyle.getPropertyValue("margin-bottom");
  const padding = parseFloat(paddingTop) + parseFloat(paddingBottom);
  const margin = parseFloat(marginTop) + parseFloat(marginBottom);
  return padding + margin + parseFloat(contentStyle.borderWidth);
}

export function getDomHeight(dom: HTMLElement) {
  const contentStyle = window.getComputedStyle(dom) || iframeComputed.contentWindow.getComputedStyle(dom);
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
  if (node.type.name == PARAGRAPH) {
    const computeddiv = iframeDoc.getElementById("computedspan");
    if (computeddiv) {
      computeddiv.innerHTML = html;
    }
  } else {
    const computeddiv = iframeDoc.getElementById("computeddiv");
    if (computeddiv) {
      computeddiv.innerHTML = html;
    }
  }

  const nodesom = iframeDoc.getElementById(node.attrs.id);
  return nodesom;
}

export function removeAbsentHtmlH() {
  const computeddiv = iframeDoc.getElementById("computeddiv");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  computeddiv.innerHTML = "";
}

function iframeDocAddP() {
  const computedspan = iframeDoc.getElementById("computedspan");
  if (!computedspan) {
    const p = iframeDoc.createElement("p");
    p.classList.add("text-editor");
    p.setAttribute("id", "computedspan");
    p.setAttribute("style", "display: inline-block");
    p.innerHTML = "&nbsp;";
    iframeDoc.body.append(p);
  }
}

function iframeDocAddDiv(options: any) {
  const computeddiv = iframeDoc.getElementById("computeddiv");
  if (!computeddiv) {
    const dom = iframeDoc.createElement("div");
    dom.setAttribute("class", "Page text-editor relative");
    dom.setAttribute("style", "opacity: 0;position: absolute;max-width:" + options.bodyWidth + "px;width:" + options.bodyWidth + "px;");
    const content = iframeDoc.createElement("div");
    content.classList.add("PageContent");
    content.setAttribute("style", "min-height: " + options.bodyHeight + "px;padding:" + options.bodyPadding + "px");
    content.setAttribute("id", "computeddiv");
    dom.append(content);
    iframeDoc.body.append(dom);
  }
}

export function removeComputedHtml() {
  const iframeComputed1 = document.getElementById("computediframe");
  if (iframeComputed1) {
    document.body.removeChild(iframeComputed1);
    iframeComputed = null;
    iframeDoc = null;
  }
}

export function buildComputedHtml(options: any) {
  iframeComputed = document.getElementById("computediframe");
  if (!iframeComputed) {
    iframeComputed = document.createElement("iframe");
    document.body.appendChild(iframeComputed);
    //获得文档对象
    iframeDoc = iframeComputed.contentDocument || iframeComputed.contentWindow.document;
    iframeComputed.setAttribute("id", "computediframe");
    iframeComputed.setAttribute("style", "width: 100%;height: 100%;opacity: 0;position: absolute;z-index: -89;margin-left:-2003px;");
    copyStylesToIframe(iframeDoc);
    iframeDocAddP();
    iframeDocAddDiv(options);

  }
}

// @ts-ignore
function copyStylesToIframe(iframeContentDoc) {
  // 获取当前页面的所有样式表
  const styles = document.querySelectorAll("style");
  styles.forEach(style => {
    // 创建一个新的<style>标签
    const newStyle = iframeContentDoc.createElement("style");
    // 将样式内容复制到新标签中
    newStyle.textContent = style.textContent;
    // 将新标签插入到iframe的<head>中
    iframeContentDoc.head.appendChild(newStyle);
  });
  const elementsWithInlineStyles = document.querySelectorAll("[style]");
  elementsWithInlineStyles.forEach(element => {
    const styleAttr = element.getAttribute("style");
    const clonedElement = iframeContentDoc.createElement(element.tagName);
    clonedElement.setAttribute("style", styleAttr);
    // 这里只是创建了带有内联样式的元素，根据实际情况，你可能需要将它们添加到iframe的DOM树中
  });
}
