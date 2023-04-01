import { PAGE } from "../nodeNames";
import { Node } from "@tiptap/core";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DocumentOptions {}

export const EmrDocument = Node.create<DocumentOptions>({
  name: "doc",
  topNode: true,
  content: `${PAGE}+`
});
