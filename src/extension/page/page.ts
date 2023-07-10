import { mergeAttributes, Node } from "@tiptap/core";
import { CASSIE_BLOCK, CASSIE_BLOCK_EXTEND, PAGE } from "../nodeNames";
import { PageOptions } from "@/extension/page/core";
import PageComponet from "@/extension/page/PageComponet.vue";
import PageDesignComponet from "@/extension/page/PageDesignComponet.vue";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuid } from "uuid";

export const Page = Node.create<PageOptions>({
  priority: 2,
  /* 标签名称 */
  name: `${PAGE}`,
  content: `(${CASSIE_BLOCK}|${CASSIE_BLOCK_EXTEND})+`,
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
    const pid = uuid();
    if (!node.attrs.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = pid;
    }
    return ["page", mergeAttributes(HTMLAttributes, { id: pid }), 0];
  },
  addNodeView() {
    return this.options.design ? VueNodeViewRenderer(PageDesignComponet) : VueNodeViewRenderer(PageComponet);
  }
});
