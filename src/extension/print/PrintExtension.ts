import { Extension, findParentNode } from "@tiptap/core";
export const PrintExtension = Extension.create({
  name: "PrintExtension",
  addStorage() {
    return {
      currentNumber: 0,
      height: 0,
      print: false,
      pageId: ""
    };
  }
});
