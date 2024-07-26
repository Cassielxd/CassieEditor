import { Table } from "@tiptap/extension-table";
import { Fragment, Schema, Node as ProsemirrorNode, NodeType } from "@tiptap/pm/model";
export const CassieTable = Table.extend({
  //tableRow+ 为tableRow* 满足分页的需求
  content: "tableRow*",
});


