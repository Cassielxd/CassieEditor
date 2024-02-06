let id = 1;

export function getId() {
  return id++;
}

export const idAttributes: any = {
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
  }
};
