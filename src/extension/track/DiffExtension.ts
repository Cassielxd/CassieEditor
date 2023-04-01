import { Extension } from "@tiptap/core";
import { trackChangesPlugin } from "@/extension/track/track-changes/track-changes-plugin";

export const DiffExtension = Extension.create({
  name: "DiffExtension",
  /*添加分页插件*/
  addProseMirrorPlugins() {
    return [trackChangesPlugin()];
  }
});
