import { mergeAttributes, Node } from "@tiptap/core";
import { CASSIE_BLOCK } from "../nodeNames";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuid } from "uuid";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import CassieBlockComponet from "@/extension/node/CassieBlockComponet.vue";
export default Node.create({
  name: `${CASSIE_BLOCK}`,
  group: "block",
  isolating: true,
  content: "block*",
  addAttributes() {
    return {
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
    return ["Node", mergeAttributes(HTMLAttributes, { id: node.attrs.id ? node.attrs.id : uuid() }), 0];
  },
  addNodeView() {
    return VueNodeViewRenderer(CassieBlockComponet);
  }
});
