import { mergeAttributes, Node, NodeViewRenderer, NodeViewRendererProps } from "@tiptap/core";
import { PAGE } from "../nodeNames";
import { PageOptions } from "@/extension/page/types";

import { getId } from "@/utils/id";
import { NodeView } from "@tiptap/pm/view";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import PageDesignComponet from "@/extension/page/PageDesignComponet.vue";
import PageComponet from "@/extension/page/PageComponet.vue";
import PageViewVueComponet from "@/extension/page/PageViewVueComponet.vue";
export const Page = Node.create<PageOptions>({
  priority: 2,
  /* 标签名称 */
  name: `${PAGE}`,
  content: `block*`,
  group: "block",
  isolating: true,
  selectable: false,
  addOptions() {
    return {
      footerHeight: 100,
      headerHeight: 100,
      bodyHeight: 0,
      bodyWidth: 0,
      bodyPadding: 0,
      isPaging: false,
      design: false,
      SystemAttributes: {}
    };
  },
  /* 自定义操作 */
  addAttributes() {
    return {
      HTMLAttributes: {},
      pageNumber: {
        default: 1
      },
      id: {
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            id: attributes.id
          };
        }
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "page"
      }
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const pid = getId();
    if (!node.attrs.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = pid;
    }
    return ["page", mergeAttributes(HTMLAttributes, { id: pid }), 0];
  },
  addNodeView() {
    const options = this.options;
    //return VueNodeViewRenderer(PageViewVueComponet, {});
    return defaultPageViewRenderer(options);
    //return this.options.design ? VueNodeViewRenderer(PageDesignComponet, {}) : VueNodeViewRenderer(PageComponet);
  }
});

export function defaultPageViewRenderer(options: PageOptions): NodeViewRenderer {
  return (props: NodeViewRendererProps) => {
    return new PageView(props, options);
  };
}

/**
 * 分页组件PageView默认实现
 * 使用vue框架实现可以参考 VueNodeViewRenderer(PageComponet)
 */
export class PageView implements NodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  options: PageOptions;
  props: NodeViewRendererProps;
  constructor(props: NodeViewRendererProps, options: PageOptions) {
    this.options = options;
    this.props = props;
    this.dom = document.createElement("div");
    this.contentDOM = document.createElement("div");
    this.buildDom();
    this.buildCorners();
    this.buildContentDOM();
  }
  buildDom() {
    const { node } = this.props;
    this.dom.setAttribute("class", "Page text-editor relative");
    this.dom.setAttribute("style", "max-width:" + this.options.bodyWidth + "px;width:" + this.options.bodyWidth + "px;");
    this.dom.setAttribute("id", node.attrs.id);
    this.dom.oncontextmenu = () => false;
  }
  buildHeaderAndFooter() {
    //TODO 页眉页脚的实现
  }
  buildCorners() {
    const corners = ["corner-top-left", "corner-top-right", "corner-bottom-left", "corner-bottom-right"];
    corners.forEach((corner) => {
      const cornerDiv = document.createElement("div");
      cornerDiv.setAttribute("class", corner);
      this.dom.append(cornerDiv);
    });
  }
  buildContentDOM() {
    this.contentDOM.classList.add("PageContent"); //计算使用的也是这个class 不可随意更改
    this.contentDOM.setAttribute("style", "min-height: " + this.options.bodyHeight + "px;padding:" + this.options.bodyPadding + "px");
    this.dom.append(this.contentDOM);
  }
}
