import { Extension } from "@tiptap/core";
import { trackChangesPlugin } from "@/extension/track/track-changes/track-changes-plugin";

export const DiffExtension = Extension.create({
  name: "DiffExtension",

  addProseMirrorPlugins() {
    return [trackChangesPlugin()];
  },
  addExtensions() {
    const extensions: any[] = [];

    return extensions;
  }
});
