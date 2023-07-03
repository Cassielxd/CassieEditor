import { Extension } from "@tiptap/core";
import { versionComparePlugin } from "@/extension/track/version-compare/version-compare-plugin";
import { Transform } from "@tiptap/pm/transform";
import { ChangeSet } from "@/extension/track/changeset";
import { Node } from "@tiptap/pm/model";
export type CVOptions = {
  change: ChangeSet;
  doc: Node;
};
export const CVExtension = Extension.create<CVOptions>({
  name: "CVExtension",
  addProseMirrorPlugins() {
    return [versionComparePlugin(this.options.change, this.options.doc)];
  }
});
