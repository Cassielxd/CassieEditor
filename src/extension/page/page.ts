import { mergeAttributes, Node } from "@tiptap/core";
import { PAGE } from "../nodeNames";
import { PageOptions } from "@/extension/page/core";

import { getId } from "@/utils/id";

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
    return ({ editor, node, getPos }) => {
      const dom = document.createElement("div");
      dom.setAttribute("class", "Page text-editor relative");
      dom.setAttribute("style", "max-width:" + options.bodyWidth + "px;");
      dom.setAttribute("id", node.attrs.id);
      dom.oncontextmenu = () => false;
      const content = document.createElement("div");
      content.classList.add("PageContent");
      content.setAttribute("style", "min-height: " + options.bodyHeight + "px;padding:" + options.bodyPadding + "px");
      dom.append(content);
      return {
        dom,
        contentDOM: content
      };
    };
    //return this.options.design ? VueNodeViewRenderer(PageDesignComponet, {}) : VueNodeViewRenderer(PageComponet);
  }
});
