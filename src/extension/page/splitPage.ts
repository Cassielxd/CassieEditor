import { Fragment, Slice, Schema, Node, NodeType, Attrs } from "@tiptap/pm/model";
import { ReplaceStep } from "@tiptap/pm/transform";
import { Transaction } from "@tiptap/pm/state";
import { EXTEND, PARAGRAPH } from "@/extension/nodeNames";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { v4 as uuid } from "uuid";

export type SplitParams = {
  tr: Transaction;
  pos: number;
  depth?: number;
  typesAfter?: ({ type: NodeType; attrs?: Attrs | null } | null)[];
  schema: Schema<any, any>;
};

/**
 * @description 分页主要逻辑 修改系统tr split方法 添加默认 extend判断 默认id重新生成
 * @author Cassie
 * @method splitPage 分割页面
 * @param tr
 * @param pos
 * @param depth
 * @param typesAfter
 * @param schema
 */
export function splitPage({ tr, pos, depth = 1, typesAfter, schema }: SplitParams): Transaction {
  const $pos = tr.doc.resolve(pos);
  let before = Fragment.empty;
  let after = Fragment.empty;
  for (let d = $pos.depth, e = $pos.depth - depth, i = depth - 1; d > e; d--, i--) {
    //新建一个和 $pos.node(d) 一样的节点 内容是 before
    before = Fragment.from($pos.node(d).copy(before));
    const typeAfter = typesAfter && typesAfter[i];
    const n = $pos.node(d);
    let na: Node | null = $pos.node(d).copy(after);
    if (schema.nodes[n.type.name + EXTEND]) {
      const attr = Object.assign({}, n.attrs, { id: uuid() });
      na = schema.nodes[n.type.name + EXTEND].createAndFill(attr, after);
    } else {
      //处理id重复的问题
      if (na && na.attrs.id) {
        let extend = {};
        if (na.attrs.extend == "false") {
          extend = { extend: "true" };
        }
        const attr = Object.assign({}, n.attrs, { id: uuid(),...extend });
        na = schema.nodes[n.type.name].createAndFill(attr, after);
      }
    }
    after = Fragment.from(
      typeAfter
        ? typeAfter.type.create(
          {
            id: uuid(),
            pageNumber: na?.attrs.pageNumber + 1
          },
          after
        )
        : na
    );
  }
  tr.step(new ReplaceStep(pos, pos, new Slice(before.append(after), depth, depth)));
  return tr;
}
