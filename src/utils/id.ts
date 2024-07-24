let gid = 1;

export function getId() {
  gid += 1;
  return Math.random().toString(36).substring(2, 10);
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
    default: false
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
