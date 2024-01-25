import { Attrs, Node, NodeType, Schema } from "@tiptap/pm/model";
import { PageOptions } from "@/extension/page/core";
import { Transaction } from "@tiptap/pm/state";

export type NodesComputed = Record<string, (node: Node, parent: Node, index: number) => boolean>;
export type PluginState = {
  bodyOptions: PageOptions | null;
  deleting: boolean;
  inserting: boolean;
  checkNode: boolean;
  splitPage: boolean;
};
export type SplitParams = {
  pos: number;
  depth?: number;
  typesAfter?: ({ type: NodeType; attrs?: Attrs | null } | null)[];
  schema: Schema<any, any>;
};
