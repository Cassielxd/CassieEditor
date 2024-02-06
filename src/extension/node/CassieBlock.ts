import { Node } from "@tiptap/core";
import { CASSIE_BLOCK } from "../nodeNames";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import CassieBlockComponet from "@/extension/node/CassieBlockComponet.vue";
import { getId, idAttributes } from "@/utils/id";
export default Node.create({
  name: `${CASSIE_BLOCK}`,
  group: "block",
  isolating: true,
  content: "block*",
  selectable: false,
  addAttributes() {
    return {
      ...idAttributes,
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
