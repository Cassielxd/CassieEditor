import { HeadingLevel, ShadingType } from "docx";
import { DocxSerializer, MarkSerializer, NodeSerializer } from "./serializer";
import { getLatexFromNode } from "./utils";
/*
* 所有节点对应的 docx序列化方法
* 方法名称是node节点名称
* */
export const defaultNodes: NodeSerializer = {

  /**
   * 文本节点
   * @param state
   * @param node
   */
  text(state, node) {
    state.text(node.text ?? "");
  },

  /**
   * 段落节点
   * @param state
   * @param node
   */
  paragraph(state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },

  /**
   * 标题节点
   * @param state
   * @param node
   */
  heading(state, node) {
    state.renderInline(node);
    const heading = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6][node.attrs.level - 1];
    state.closeBlock(node, { heading });
  },

  /**
   * 自定义块节点
   * @param state
   * @param node
   */
  blockquote(state, node) {
    state.renderContent(node, { style: "IntenseQuote" });
  },
  /**
   * 代码块节点
   * @param state
   * @param node
   */
  code_block(state, node) {
    // TODO: something for code
    state.renderContent(node);
    state.closeBlock(node);
  },
  horizontal_rule(state, node) {
    // Kinda hacky, but this works to insert two paragraphs, the first with a break
    state.closeBlock(node, { thematicBreak: true });
    state.closeBlock(node);
  },
  hard_break(state) {
    state.addRunOptions({ break: 1 });
  },
  ordered_list(state, node) {
    state.renderList(node, "numbered");
  },
  bullet_list(state, node) {
    state.renderList(node, "bullets");
  },
  list_item(state, node) {
    state.renderListItem(node);
  },
  // Presentational
  /**
   * 图片序列化节点
   * @param state
   * @param node
   */
  image(state, node) {
    const { src } = node.attrs;
    state.image(src);
    state.closeBlock(node);
  },
  // Technical
  math(state, node) {
    state.math(getLatexFromNode(node), { inline: true });
  },
  equation(state, node) {
    const { id, numbered } = node.attrs;
    state.math(getLatexFromNode(node), { inline: false, numbered, id });
    state.closeBlock(node);
  },
  table(state, node) {
    state.table(node);
  },
  page(state, node) {
    state.page(node);
    state.closeBlock(node);
  },
  mention(state, node) {
    state.text(node.textContent);
  }
};

export const defaultMarks: MarkSerializer = {
  em() {
    return { italics: true };
  },
  strong() {
    return { bold: true };
  },
  link() {
    // Note, this is handled specifically in the serializer
    // Word treats links more like a Node rather than a mark
    return {};
  },
  code() {
    return {
      font: {
        name: "Monospace"
      },
      color: "000000",
      shading: {
        type: ShadingType.SOLID,
        color: "D2D3D2",
        fill: "D2D3D2"
      }
    };
  },
  abbr() {
    // TODO: abbreviation
    return {};
  },
  subscript() {
    return { subScript: true };
  },
  superscript() {
    return { superScript: true };
  },
  strikethrough() {
    // doubleStrike!
    return { strike: true };
  },
  underline() {
    return {
      underline: {}
    };
  },
  smallcaps() {
    return { smallCaps: true };
  },
  allcaps() {
    return { allCaps: true };
  }
};

export const defaultDocxSerializer = new DocxSerializer(defaultNodes, defaultMarks);
