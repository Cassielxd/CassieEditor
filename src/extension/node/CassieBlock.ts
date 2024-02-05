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
        parseHTML: (element: any) => element.getAttribute("id"),
        renderHTML: (attributes: any) => {
          if (!attributes.id) {
            return { id: getId() };
          }
          return {
            id: attributes.id
          };
        }
      },
      extend: {
        default: "false"
      },
      group: {
        default: null,
        parseHTML: (element: any) => element.getAttribute("data-group"),
        renderHTML: (attributes: any) => {
          if (!attributes.group) {
            return {};
          }
          return {
            "data-group": attributes.group
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
