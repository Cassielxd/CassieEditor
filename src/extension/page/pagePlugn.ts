import { EditorState, Plugin, PluginKey, Transaction } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
import { PAGE } from "@/extension/nodeNames";
import { removeAbsentHtmlH } from "@/extension/page/core";
import { findParentDomRefOfType } from "@/utils/index";
import { defaultNodesComputed, PageComputedContext } from "@/extension/page/computed";
import { Editor } from "@tiptap/core/dist/packages/core/src/Editor";
import { PageState, PageOptions } from "@/extension/page/types";

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
    return pageBody.scrollHeight > this.#bodyOption.bodyHeight;
  }
  update(view: EditorView, prevState: EditorState) {
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
      if (inserting || deleting) {
        if (inserting) tr.setMeta("inserting", inserting);
        if (deleting) {
          tr.setMeta("deleting", true);
          /*防止多次触发没完没了的 进行分割处理*/
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.stepStatus = false;
        }
        const state = view.state.apply(tr);
        view.updateState(state);
      }
      /*检验 node节点完整性*/
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (window.checkNode) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.checkNode = false;
        tr.setMeta("checkNode", true);
        const state = view.state.apply(tr);
        view.updateState(state);
      }
    }
  }
}
class TransfromPageState {
  #state: PageState;
  #tr: Transaction;
  constructor(state: PageState, tr: Transaction) {
    this.#state = state;
    this.#tr = tr;
  }
  transform() {
    const next: PageState = { ...this.#state };
    const splitPage: boolean = this.#tr.getMeta("splitPage");
    const checkNode: boolean = this.#tr.getMeta("checkNode");
    const deleting: boolean = this.#tr.getMeta("deleting");
    const inserting: boolean = this.#tr.getMeta("inserting");
    next.splitPage = splitPage ? splitPage : false;
    next.inserting = inserting ? inserting : false;
    next.deleting = deleting ? deleting : false;
    next.checkNode = checkNode ? checkNode : false;
    return next;
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
      init: (): PageState => ({
        bodyOptions: null,
        deleting: false,
        inserting: false,
        checkNode: false,
        splitPage: false
      }),
      /*判断标志位是否存在  如果存在 则修改 state 值
       * Meta数据是一个事务级别的 一个事务结束 meta消失
       * state则在整个生命周期里都存在的
       * */
      apply: (tr, prevState): PageState => {
        prevState.bodyOptions = bodyOption;
        return new TransfromPageState(prevState, tr).transform();
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
      const page = new PageComputedContext(editor, defaultNodesComputed, this.getState(state), state);
      return page.run().scrollIntoView();
    },
    props: {
      handleTextInput(view, form, to, text) {
        view.focus();
        return false;
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
