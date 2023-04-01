import { Node as ProsemirrorNode } from "@tiptap/pm/model";

export interface Result {
  message: string;
  from: number;
  to: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  fix?: Function;
}

export default class LinterPlugin {
  protected doc;

  private results: Array<Result> = [];

  constructor(doc: ProsemirrorNode) {
    this.doc = doc;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  record(message: string, from: number, to: number, fix?: Function) {
    this.results.push({
      message,
      from,
      to,
      fix
    });
  }

  scan() {
    return this;
  }

  getResults() {
    return this.results;
  }
}
