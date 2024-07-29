import { Attrs, Node, NodeType, Schema } from "@tiptap/pm/model";
import { SplitContext } from "@/extension/page/computed";
import { Transaction } from "@tiptap/pm/state";
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
export class PageState {
  bodyOptions: PageOptions;
  deleting: boolean;
  inserting: boolean;
  splitPage: boolean;
  constructor(bodyOptions: PageOptions, deleting: boolean, inserting: boolean, splitPage: boolean) {
    this.bodyOptions = bodyOptions;
    this.deleting = deleting;
    this.inserting = inserting;
    this.splitPage = splitPage;
  }
  transform(tr: Transaction) {
    const splitPage: boolean = tr.getMeta("splitPage");
    const deleting: boolean = tr.getMeta("deleting");
    const inserting: boolean = tr.getMeta("inserting");
    const splitPage1 = splitPage ? splitPage : false;
    const inserting2 = inserting ? inserting : false;
    const deleting3 = deleting ? deleting : false;
    return new PageState(this.bodyOptions, deleting3, inserting2, splitPage1);
  }
}

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
  mode?: 1 | 2 | 3;
  headerData?: any[];
  footerData?: any[];
  NodesComputed?: NodesComputed;
  SystemAttributes?: Record<string, any>;
  types?: string[];
};

export type SplitInfo = {
  pos: number;
  depth: number;
  attributes?: Record<string, any>;
};
