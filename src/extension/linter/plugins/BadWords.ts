import LinterPlugin from "../LinterPlugin";

export class BadWords extends LinterPlugin {
  public regex = /\b(obviously|clearly|evidently|simply)\b/gi;

  scan() {
    this.doc.descendants((node: any, position: number) => {
      if (!node.isText) {
        return;
      }
      ///简易的直接使用正则进行判断
      const matches = this.regex.exec(node.text);

      if (matches) {
        this.record(`不能说 '${matches[0]}'`, position + matches.index, position + matches.index + matches[0].length);
      }
    });

    return this;
  }
}
