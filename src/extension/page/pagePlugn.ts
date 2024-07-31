import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, EditorView } from "@tiptap/pm/view";
import { PAGE } from "@/extension/nodeNames";
import { getDefault, removeAbsentHtmlH } from "@/extension/page/core";
import { findParentDomRefOfType } from "@/utils/index";
import { defaultNodesComputed, PageComputedContext } from "@/extension/page/computed";
import { Editor } from "@tiptap/core";
// @ts-ignore
import { PageState, PageOptions } from "@/extension/page/types";
import { findParentNode,getNodeType } from "@tiptap/core";
import { getId } from "@/utils/id";

let composition =false;
class PageDetector {
  #editor: Editor;
  #bodyOption: PageOptions;
  #pageClass: string;
  constructor(editor: Editor, bodyOption: PageOptions, pageClass = ".PageContent") {
    this.#bodyOption = bodyOption;
    this.#editor = editor;
    this.#pageClass = pageClass;
  }
  /**
   * @author Cassie
   * @method isOverflown
   * @param pageBody  当前需要分页的 dom
   * @param bodyOption 需要分页的条件
   */
  isOverflown(pageBody: Element) {
    return pageBody.scrollHeight>this.#bodyOption.bodyHeight;
  }
  update(view: EditorView, prevState: EditorState) {
    if(composition)return;
    const { selection, schema, tr } = view.state;
    if (view.state.doc.eq(prevState.doc)) return;
    const domAtPos = view.domAtPos.bind(view);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const deleting = window.stepStatus ? window.stepStatus : false;
    const pageDOM = findParentDomRefOfType(schema.nodes[PAGE], domAtPos)(selection);
    if (!pageDOM) return;
    const pageBody = (pageDOM as HTMLElement).querySelector(this.#pageClass);
    if (pageBody) {
      const inserting = this.isOverflown(pageBody);
      if (inserting) {
        const curPage = findParentNode((n) => n.type.name == PAGE)(selection);
        if (curPage) {
          const { childCount, firstChild } = curPage.node;
          if (childCount == 1 && firstChild?.type.name == "table" && firstChild.childCount == 1) {
            return;
          }
        }
      }
      if (inserting || deleting) {
        if (inserting) tr.setMeta("inserting", inserting);
        if (deleting) {
          tr.setMeta("deleting", true);
          /*防止多次触发没完没了的 进行分割处理*/
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.stepStatus = false;
        }
        view.dispatch(tr);
      }
    }
  }
}
export const paginationPluginKey = new PluginKey("pagination");
export const pagePlugin = (editor: Editor, bodyOption: PageOptions) => {

  const plugin: Plugin = new Plugin<PageState>({
    key: paginationPluginKey,
    view: () => {
      return new PageDetector(editor, bodyOption);
    },
    state: {
      init: (): PageState => {
        return new PageState(bodyOption, false, false, false);
      },
      /*判断标志位是否存在  如果存在 则修改 state 值
       * Meta数据是一个事务级别的 一个事务结束 meta消失
       * state则在整个生命周期里都存在的
       * */
      apply: (tr, prevState): PageState => {
        return prevState.transform(tr);
      }
    },
    /**
     * @description 根据apply 方法里 设置的 state 进行判断 如果需要分页 则执行分页逻辑
     * @author Cassie
     * @method appendTransaction 添加一个新的Transaction
     * @param newTr 新的 Transaction
     * @param _prevState
     * @param state
     */
    appendTransaction([newTr], _prevState, state) {
      removeAbsentHtmlH();
/*      let tr =state.tr;
      let selection = state.selection;
      let ok =false ;
      if(state.doc.child(0).childCount>10){
        debugger
        const type = getNodeType(PAGE, state.schema);
        tr = tr.split(selection.$from.pos,2,[{type}])
        ok= true;
      }
      return ok?tr:null;*/
      const page = new PageComputedContext(editor, defaultNodesComputed, this.getState(state), state);
      let tr =page.run();
      return tr.docChanged?tr:null;
    },
    props: {
      handleDOMEvents: {
        compositionstart(view, event) {
          composition=true;
        },

        compositionend(view, event) {
          composition=false;
        }
      },
      //复制粘贴的时候 把节点id 进行重置
      transformPasted(slice, view) {
        slice.content.descendants((node) => {
          // @ts-ignore
          node.attrs.id = getId();
        });
        return slice;
      },
      handleKeyDown(view, event) {
        if (event.code == "Backspace") {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.stepStatus = true;
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.stepStatus = false;
        }
        return false;
      }
    }
  });
  return plugin;
};
export const idPluginKey = new PluginKey("attrkey");
export const idPlugin = (types:string[]) => {
  const plugin: Plugin = new Plugin({
    key:idPluginKey,
    state:{
      init: (): boolean => {
        return false;
      },

      apply: (tr, prevState): any => {
        let data = tr.getMeta("splitPage")
        return data!!;
      }
    },
    appendTransaction(transactions, _prevState, nextState) {
      const tr = nextState.tr;
      let modified = false;
      let init =idPluginKey.getState(nextState)
      if (init||transactions.some((transaction) => transaction.docChanged)) {
        nextState.doc.descendants((node, pos) => {
          const attrs = node.attrs;
          if(types.includes(node.type.name)&&!attrs.id){
            tr.setNodeMarkup(pos, undefined, {...attrs, "id": getId()});
            modified = true;
          }
        });
      }
      return modified ? tr : null;
    },
  })
  return plugin;
}
