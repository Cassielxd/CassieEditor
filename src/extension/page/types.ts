import { Attrs, Node, NodeType, Schema } from "@tiptap/pm/model";
import { SplitContext } from "@/extension/page/computed";

/**
 * The computed function for the page extension a node.
 * @param splitContex 分割上下文.
 * @param node 当前需要计算的节点.
 * @param pos 当前计算节点的位置.
 * @param parent 当前计算节点的父节点.
 * @param dom 当前计算节点的 dom.
 * @returns 如果返回 true 则会会进入当前节点的 子标签计算.
 */
export type ComputedFn = (splitContex: SplitContext, node: Node, pos: number, parent: Node | null, dom: HTMLElement) => boolean;
export type NodesComputed = Record<string, ComputedFn>;
export type PageState = {
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

export type PageOptions = {
  footerHeight: number;
  headerHeight: number;
  bodyHeight: number;
  bodyWidth: number;
  bodyPadding: number;
  isPaging?: boolean;
  design?: boolean;
  headerData?: any[];
  footerData?: any[];
  NodesComputed?: NodesComputed;
  SystemAttributes?: Record<string, any>;
};

export type SplitInfo = {
  pos: number;
  depth: number;
};
