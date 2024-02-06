import { Table } from "@tiptap/extension-table";
import { mergeAttributes } from "@tiptap/core";

import { getId, idAttributes } from "@/utils/id";
import { TextSelection } from "@tiptap/pm/state";
import { Fragment, Schema, Node as ProsemirrorNode, NodeType } from "@tiptap/pm/model";
export const CassieTable = Table.extend({
  content: "tableRow*",
  addAttributes() {
    return idAttributes;
  },

  parseHTML() {
    return [{ tag: "table" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    if (!node.attrs.id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      node.attrs.id = getId();
      HTMLAttributes.id = node.attrs.id;
    }
    return ["table", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ["tbody", 0]];
  },
  addCommands() {
    return {
      ...this.parent?.(),
      insertTable:
        ({ rows = 3, cols = 3, withHeaderRow = true } = {}) =>
        ({ tr, dispatch, editor }) => {
          const node = createTable(editor.schema, rows, cols, withHeaderRow);
          if (dispatch) {
            const offset = tr.selection.anchor + 1;
            tr.replaceSelectionWith(node)
              .scrollIntoView()
              .setSelection(TextSelection.near(tr.doc.resolve(offset)));
          }
          return true;
        }
    };
  }
});

export function createTable(schema: Schema, rowsCount: number, colsCount: number, withHeaderRow: boolean, cellContent?: Fragment | ProsemirrorNode | Array<ProsemirrorNode>): ProsemirrorNode {
  const types = getTableNodeTypes(schema);
  const headerCells: ProsemirrorNode[] = [];
  const cells: ProsemirrorNode[] = [];
  for (let index = 0; index < colsCount; index += 1) {
    const cell = createCell(types.cell, cellContent);

    if (cell) {
      cells.push(cell);
    }
    if (withHeaderRow) {
      const headerCell = createCell(types.header_cell, cellContent);

      if (headerCell) {
        headerCells.push(headerCell);
      }
    }
  }
  const rows: ProsemirrorNode[] = [];

  for (let index = 0; index < rowsCount; index += 1) {
    rows.push(types.row.createChecked({ id: getId() }, withHeaderRow && index === 0 ? headerCells : cells));
  }
  return types.table.createChecked({ id: getId() }, rows);
}
export function getTableNodeTypes(schema: Schema): { [key: string]: NodeType } {
  if (schema.cached.tableNodeTypes) {
    return schema.cached.tableNodeTypes;
  }

  const roles: { [key: string]: NodeType } = {};

  Object.keys(schema.nodes).forEach((type) => {
    const nodeType = schema.nodes[type];

    if (nodeType.spec.tableRole) {
      roles[nodeType.spec.tableRole] = nodeType;
    }
  });

  schema.cached.tableNodeTypes = roles;

  return roles;
}

export function createCell(cellType: NodeType, cellContent?: Fragment | ProsemirrorNode | Array<ProsemirrorNode>): ProsemirrorNode | null | undefined {
  if (cellContent) {
    return cellType.createChecked(null, cellContent);
  }

  return cellType.createAndFill();
}
