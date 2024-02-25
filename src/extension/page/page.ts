import { mergeAttributes, Node, NodeViewRendererProps } from "@tiptap/core";
import { PAGE } from "../nodeNames";
import { PageOptions } from "@/extension/page/types";

import { getId } from "@/utils/id";
import { NodeView } from "@tiptap/pm/view";
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
    return (props: NodeViewRendererProps) => {
      return new PageView(props, options);
    };
    //return this.options.design ? VueNodeViewRenderer(PageDesignComponet, {}) : VueNodeViewRenderer(PageComponet);
  }
});
export class PageView implements NodeView {
  dom: Element;
  contentDOM: HTMLElement;
  constructor({ node }: NodeViewRendererProps, options: PageOptions) {
    const dom = document.createElement("div");
    dom.setAttribute("class", "Page text-editor relative");
    dom.setAttribute("style", "max-width:" + options.bodyWidth + "px;width:" + options.bodyWidth + "px;");
    dom.setAttribute("id", node.attrs.id);
    dom.oncontextmenu = () => false;
    this.dom = dom;
    const corners = ["corner-top-left", "corner-top-right", "corner-bottom-left", "corner-bottom-right"];
    corners.forEach((corner) => {
      const cornerDiv = document.createElement("div");
      cornerDiv.setAttribute("class", corner);
      this.dom.append(cornerDiv);
    });
    const content = document.createElement("div");
    content.classList.add("PageContent");
    content.setAttribute("style", "min-height: " + options.bodyHeight + "px;padding:" + options.bodyPadding + "px");
    this.dom.append(content);
    this.contentDOM = content;
  }
}
