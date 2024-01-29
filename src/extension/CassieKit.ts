import { Extension } from "@tiptap/core";
import { Blockquote, BlockquoteOptions } from "@tiptap/extension-blockquote";
import { Bold, BoldOptions } from "@tiptap/extension-bold";
import { BulletList, BulletListOptions } from "@tiptap/extension-bullet-list";
import { Code, CodeOptions } from "@tiptap/extension-code";
import { CodeBlock, CodeBlockOptions } from "@tiptap/extension-code-block";
import { Dropcursor, DropcursorOptions } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak, HardBreakOptions } from "@tiptap/extension-hard-break";
import { HeadingOptions } from "@tiptap/extension-heading";
import { History, HistoryOptions } from "@tiptap/extension-history";
import { HorizontalRule, HorizontalRuleOptions } from "@tiptap/extension-horizontal-rule";
import { Italic, ItalicOptions } from "@tiptap/extension-italic";
import { ListItem, ListItemOptions } from "@tiptap/extension-list-item";
import { OrderedList, OrderedListOptions } from "@tiptap/extension-ordered-list";
import { EmrParagraph } from "@/extension/paragraph/paragraph";
import { Strike, StrikeOptions } from "@tiptap/extension-strike";
import { CassieText } from "@/extension/text/CassieText";
import { PageExtension } from "@/extension/PageExtension";
import { FocusClasses, FocusOptions } from "@/extension/focus/focus";
import { EmrHeading } from "@/extension/heading/heading";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { CassieTableRow } from "@/extension/table/TableRow";
import { cursorPlugin } from "@/extension/cursor/cursor";
import { TableOptions } from "@tiptap/extension-table";
import { Mention, MentionOptions } from "@/extension/suggestion/mention";
import TextAlign, { TextAlignOptions } from "@tiptap/extension-text-align";
import { PageOptions } from "@/extension/page/core";
import { ParagraphOptions } from "@tiptap/extension-paragraph";
import Underline from "@tiptap/extension-underline";
import { StrikeThrough } from "@/extension/marks/strikethrough";
import { Insertion } from "@/extension/marks/insertion";
import { Deletion } from "@/extension/marks/deletion";
import { EmrDocument } from "@/extension/doc/document";
import { Document } from "@tiptap/extension-document";
import { PrintExtension } from "@/extension/print/PrintExtension";
import { CoolKeyMap } from "@/extension/keymap";
import Image from "@tiptap/extension-image";
export interface CassieKitOptions {
  blockquote: Partial<BlockquoteOptions> | false;
  bold: Partial<BoldOptions> | false;
  bulletList: Partial<BulletListOptions> | false;
  code: Partial<CodeOptions> | false;
  codeBlock: Partial<CodeBlockOptions> | false;
  page: Partial<PageOptions> | false;
  table: Partial<TableOptions> | false;
  focus: Partial<FocusOptions> | false;
  mention: Partial<MentionOptions> | false;
  cursor: boolean;
  dropcursor: Partial<DropcursorOptions> | false;
  gapcursor: false;
  hardBreak: Partial<HardBreakOptions> | false;
  heading: Partial<HeadingOptions> | false;
  history: Partial<HistoryOptions> | false;
  horizontalRule: Partial<HorizontalRuleOptions> | false;
  italic: Partial<ItalicOptions> | false;
  listItem: Partial<ListItemOptions> | false;
  orderedList: Partial<OrderedListOptions> | false;
  paragraph: Partial<ParagraphOptions> | false;
  strike: Partial<StrikeOptions> | false;
  text: false;
  textAlign: Partial<TextAlignOptions> | false;
}

export const CassieKit = Extension.create<CassieKitOptions>({
  name: "CassieKit",
  addProseMirrorPlugins() {
    const plungs: any[] = [];
    if (this.options.cursor) {
      plungs.push(cursorPlugin());
    }

    return plungs;
  },
  addExtensions() {
    const extensions: any[] = [];

    if (this.options.blockquote !== false) {
      extensions.push(Blockquote.configure(this.options?.blockquote));
    }

    if (this.options.bold !== false) {
      extensions.push(Bold.configure(this.options?.bold));
    }

    if (this.options.bulletList !== false) {
      extensions.push(BulletList.configure(this.options?.bulletList));
    }

    if (this.options.code !== false) {
      extensions.push(Code.configure(this.options?.code));
    }

    if (this.options.codeBlock !== false) {
      extensions.push(CodeBlock.configure(this.options?.codeBlock));
    }

    if (this.options.page !== false) {
      extensions.push(PageExtension.configure(this.options?.page));
      /*顶级文档*/
      extensions.push(EmrDocument);
    } else {
      extensions.push(Document);
    }

    if (this.options.dropcursor !== false) {
      extensions.push(Dropcursor.configure(this.options?.dropcursor));
    }

    if (this.options.gapcursor !== false) {
      extensions.push(Gapcursor.configure(this.options?.gapcursor));
    }

    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options?.hardBreak));
    }

    if (this.options.heading !== false) {
      extensions.push(EmrHeading.configure(this.options?.heading));
    }

    if (this.options.history !== false) {
      extensions.push(History.configure(this.options?.history));
    }

    if (this.options.horizontalRule !== false) {
      extensions.push(HorizontalRule.configure(this.options?.horizontalRule));
    }

    if (this.options.italic !== false) {
      extensions.push(Italic.configure(this.options?.italic));
    }

    if (this.options.listItem !== false) {
      extensions.push(ListItem.configure(this.options?.listItem));
    }

    if (this.options.orderedList !== false) {
      extensions.push(OrderedList.configure(this.options?.orderedList));
    }

    if (this.options.paragraph !== false) {
      extensions.push(EmrParagraph.configure(this.options?.paragraph));
    }
    if (this.options.strike !== false) {
      extensions.push(Strike.configure(this.options?.strike));
    }

    if (this.options.text !== false) {
      extensions.push(CassieText.configure(this.options?.text));
    }
    if (this.options.textAlign !== false) {
      extensions.push(TextAlign.configure(this.options?.textAlign));
    }

    if (this.options.table !== false) {
      extensions.push(Table.configure(this.options?.table));
      extensions.push(CassieTableRow);
      extensions.push(TableHeader);
      extensions.push(TableCell);
    }
    if (this.options.focus !== false) {
      extensions.push(FocusClasses.configure(this.options?.focus));
    }
    if (this.options.mention !== false) {
      extensions.push(Mention.configure(this.options?.mention));
    }
    extensions.push(Underline);
    extensions.push(StrikeThrough);
    extensions.push(Insertion);
    extensions.push(Deletion);
    extensions.push(PrintExtension);
    extensions.push(CoolKeyMap);
    extensions.push(Image.configure({ inline: true, allowBase64: true }));
    return extensions;
  }
});
