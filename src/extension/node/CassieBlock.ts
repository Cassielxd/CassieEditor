import { Node } from "@tiptap/core";
import { CASSIE_BLOCK } from "../nodeNames";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
// @ts-ignore
import CassieBlockComponet from "@/extension/node/CassieBlockComponet.vue";
export default Node.create({
  name: `${CASSIE_BLOCK}`,
  group: "block",
  isolating: true,
  content: "block*",
  selectable: false,
  addAttributes() {
    return {
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
    return ["Node", HTMLAttributes, 0];
  },
  addNodeView() {
    return VueNodeViewRenderer(CassieBlockComponet);
  }
});
