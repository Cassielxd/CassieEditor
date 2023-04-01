import { Extensions } from "@tiptap/vue-3";
import { CassieKit } from "@/extension";
import { BuildRender } from "@/default";
import * as Y from "yjs";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { HocuspocusProvider } from "@hocuspocus/provider";

/**
 * describes: 用于构建Extensions
 * @param props
 * @param hook
 */
export function buildExtensions(props: any, hook: () => void) {
  const extensions: Extensions = [];
  extensions.push(
    CassieKit.configure({
      textAlign: { types: ["heading", "paragraph"] },
      mention: {
        HTMLAttributes: {
          class: "bg-gray-300"
        },
        clickSuggestion: BuildRender(props.menuList)
      },
      page: { ...props },
      focus: { mode: "Node", className: "has-focus" },
      history: false
    })
  );
  if (props.collaborationUrl) {
    const ydoc = new Y.Doc();
    extensions.push(
      Collaboration.configure({
        document: ydoc
      })
    );
    extensions.push(
      CollaborationCursor.configure({
        provider: new HocuspocusProvider({
          url: props.collaborationUrl,
          name: "1",
          document: ydoc,
          onSynced: (data) => {
            hook();
          }
        }),
        //这里应该使用当前你的登录用户
        user: props.user
      })
    );
  }
  return extensions;
}

export function getRandomColor() {
  return getRandomElement(["#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8", "#94FADB", "#B9F18D"]);
}
const getRandomElement = (list: any) => {
  return list[Math.floor(Math.random() * list.length)];
};

export function getRandomName() {
  return getRandomElement(["吴承恩(老师)", "曹雪芹(老师)", "张三(学生)", "李白(老师)", "杜甫(老师)", "李四(学生)", "李刚(学生)", "彦龙(学生)", "老马(老师)"]);
}
