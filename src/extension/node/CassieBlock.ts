import { Node } from "@tiptap/core";
import { CASSIE_BLOCK } from "../nodeNames";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import CassieBlockComponet from "@/extension/node/CassieBlockComponet.vue";
import { getId } from "@/utils/id";
export default Node.create({
  name: `${CASSIE_BLOCK}`,
  group: "block",
  isolating: true,
  content: "block*",
  selectable: false,
  addAttributes() {
    return {
      id: {
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return { id: getId() };
          }
          return {
            id: attributes.id
          };
        }
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          if (!attributes.title) {
            return {};
          }
          return {
            title: attributes.title
          };
        }
      },
      //主要用户业务分组 在分页的时候会把同一个块拆成多个 则需要这样拆分
      group: {
        default: null,
        parseHTML: (element) => element.getAttribute("group"),
        renderHTML: (attributes) => {
          if (!attributes.group) {
            return {};
          }
          return {
            group: attributes.group
          };
        }
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "Node"
      }
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    if (HTMLAttributes.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = HTMLAttributes.id;
    }
    return ["Node", HTMLAttributes, 0];
  },
  addNodeView() {
    return VueNodeViewRenderer(CassieBlockComponet);
  }
});
