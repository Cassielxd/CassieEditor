<template>
  <div class="main">
    <v-style>
      body { box-shadow: none; } ::selection { background-color: rgb(186, 212, 253); } :root { --demo-font-color: #222; --demo-bars-bkg: rgb(255, 255, 255); --demo-bars-shadow: 0 1px 3px 1px rgba(60, 64, 67, 0.15); --demo-bars-padding: 5px; --demo-bars-border-radius: 1px; --demo-text-bkg-color:
      white; --demo-text-box-shadow: 0 1px 3px 1px rgba(60, 64, 67, 0.15); --bar-font-color: rgb(32, 33, 36); --bar-font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; --bar-font-size: 15px; --bar-font-weight: 500; --bar-letter-spacing: 0.2px; --bar-padding: 3px; --bar-button-icon-size:
      20px; --bar-button-padding: 4px 6px; --bar-button-radius: 4px; --bar-button-hover-bkg: rgb(241, 243, 244); --bar-button-active-color: rgb(26, 115, 232); --bar-button-active-bkg: rgb(232, 240, 254); --bar-button-open-color: rgb(32, 33, 36); --bar-button-open-bkg: rgb(232, 240, 254);
      --bar-menu-bkg: white; --bar-menu-border-radius: 0 0 3px 3px; --bar-menu-item-chevron-margin: 0; --bar-menu-item-hover-bkg: rgb(241, 243, 244); --bar-menu-item-padding: 5px 8px 5px 35px; --bar-menu-item-icon-size: 15px; --bar-menu-item-icon-margin: 0 9px 0 -25px; --bar-menu-padding: 6px 1px;
      --bar-menu-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15); --bar-menu-separator-height: 1px; --bar-menu-separator-margin: 5px 0 5px 34px; --bar-menu-separator-color: rgb(227, 229, 233); --bar-separator-color: rgb(218, 220, 224); --bar-separator-width: 1px; --bar-sub-menu-border-radius: 3px; }
      .bars > .bar:first-child { border-bottom: 1px solid rgb(218, 220, 224); margin-bottom: 3px; }
    </v-style>
    <div class="bars">
      <vue-file-toolbar-menu v-for="(content, index) in bars_content" :key="'bar-' + index" :content="content" />
    </div>
  </div>
</template>

<script>
import VueFileToolbarMenu from "vue-file-toolbar-menu";
import DemoCustomButton from "./DemoCustomButton.vue";
import DemoCustomMenuItem from "./DemoCustomMenuItem.vue";

import { Editor } from "@tiptap/vue-3";

export default {
  components: { VueFileToolbarMenu },
  props: {
    editor: {
      type: Editor,
      required: true
    }
  },
  data() {
    return {
      color: "rgb(74, 238, 164)",
      font: "Avenir",
      theme: "default",
      edit_mode: true,
      check1: false,
      check2: false,
      check3: true
    };
  },

  computed: {
    // Read the API documentation about the available menu content options

    bars_content() {
      return [
        [
          {
            text: "文件",
            menu: [
              {
                text: "New",
                click: () => {
                  console.log("New file!");
                }
              },
              { is: "separator" },
              {
                text: "Save...",
                click: () => {
                  console.log(this.editor.getHTML());
                }
              },
              { is: "separator" },
              {
                text: "Print...",
                click: () => {
                  console.log("New Print!");
                }
              },
              { is: "separator" },
              {
                text: "Close",
                click() {
                  console.log("Close");
                }
              }
            ]
          },
          {
            text: "编辑",
            menu: [
              { text: "Cut", click: () => console.log("Close") },
              { text: "Copy", click: () => console.log("Close") },
              {
                text: "Paste",
                click() {
                  navigator.clipboard.readText().then((text) => {
                    console.log(text);
                  });
                }
              }
            ]
          },
          {
            text: "格式化",
            menu: [
              { text: "Basic" },
              { text: "Disabled", disabled: true },
              {
                text: "Sub-menus",
                custom_chevron: this.theme != "default" ? "►" : false,
                menu: [
                  { text: "Hello!" },
                  {
                    text: "I'm a sub-menu",
                    custom_chevron: this.theme != "default" ? "►" : false,
                    menu: [
                      {
                        text: "And I'm another sub-menu!",
                        click: () => console.log("Sub-menu clicked!")
                      }
                    ],
                    menu_width: 240
                  }
                ],
                menu_width: 200
              },
              {
                text: "Hotkey",
                click() {
                  alert("Hotkey menu triggered either via clicking or shortcut.");
                }
              },
              { text: "Material icon", icon: "shopping_cart", click: () => console.log("") },
              { text: "Platform emoji", emoji: "call_me_hand", click: () => console.log("") },
              { text: "Menu text is wrapped when it is too long" },
              { is: DemoCustomMenuItem, text: "Your component", click: () => alert("Your custom action!") },
              { is: "separator" },
              {
                text: "Option 1",
                icon: this.check1 ? "radio_button_unchecked" : "radio_button_checked",
                click: (e) => {
                  e.stopPropagation(); // prevent menu close when clicking
                  this.check1 = false;
                }
              },
              {
                text: "Option 2",
                icon: this.check1 ? "radio_button_checked" : "radio_button_unchecked",
                click: (e) => {
                  e.stopPropagation(); // prevent menu close when clicking
                  this.check1 = true;
                }
              },
              { is: "separator" },
              {
                text: "Option 3",
                icon: this.check2 ? "check_box" : "check_box_outline_blank",
                click: (e) => {
                  e.stopPropagation(); // prevent menu close when clicking
                  this.check2 = !this.check2;
                }
              },
              {
                text: "Option 4",
                icon: this.check3 ? "check_box" : "check_box_outline_blank",
                click: (e) => {
                  e.stopPropagation(); // prevent menu close when clicking
                  this.check3 = !this.check3;
                }
              }
            ],
            menu_width: 220
          },
          {
            text: "帮助",
            menu: [
              { text: "About", icon: "help", click: () => alert("vue-file-toolbar-menu\nhttps://github.com/motla/vue-file-toolbar-menu\nby @motla\nMIT License") },
              { is: "separator" },
              { text: "Repository", icon: "exit_to_app", click: () => console.log("") },
              { text: "API", icon: "exit_to_app", click: () => console.log("") },
              { text: "Report Issue", icon: "exit_to_app", click: () => console.log("") },
              { text: "Release Notes", icon: "exit_to_app", click: () => console.log("") }
            ],
            menu_width: 220
          },
          { is: "spacer" },
          {
            icon: "table_view",
            menu: [
              {
                text: "表格",
                menu: [
                  {
                    text: "固定表格",
                    click: () => {
                      this.editor.chain().focus().fixTables().run();
                    }
                  },
                  {
                    text: "插入表格",
                    click: () => {
                      this.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run();
                    }
                  },
                  {
                    text: "删除表",
                    click: () => {
                      this.editor.chain().focus().deleteTable().run();
                    }
                  }
                ]
              },
              {
                text: "表头",
                menu: [
                  {
                    text: "自适应表头",
                    click: () => {
                      this.editor.chain().focus().toggleHeaderRow().run();
                    }
                  },
                  {
                    text: "设置成表头样式",
                    click: () => {
                      this.editor.chain().focus().toggleHeaderCell().run();
                    }
                  }
                ]
              },
              {
                text: "列操作",
                menu: [
                  {
                    text: "添加列(之前)",
                    click: () => {
                      this.editor.chain().focus().addColumnBefore().run();
                    }
                  },
                  {
                    text: "添加列(之后)",
                    click: () => {
                      this.editor.chain().focus().addColumnAfter().run();
                    }
                  },
                  {
                    text: "删除列",
                    click: () => {
                      this.editor.chain().focus().deleteColumn().run();
                    }
                  },
                  {
                    text: "设置第一列",
                    click: () => {
                      this.editor.chain().focus().toggleHeaderColumn().run();
                    }
                  }
                ]
              },
              {
                text: "行操作",
                menu: [
                  {
                    text: "添加行(之前)",
                    click: () => {
                      this.editor.chain().focus().addRowBefore().run();
                    }
                  },
                  {
                    text: " 添加行(之后)",
                    click: () => {
                      this.editor.chain().focus().addRowAfter().run();
                    }
                  },
                  {
                    text: "删除行",
                    click: () => {
                      this.editor.chain().focus().deleteRow.run();
                    }
                  }
                ]
              },
              {
                text: "单元格操作",
                menu: [
                  {
                    text: "合并单元格",
                    click: () => {
                      this.editor.chain().focus().mergeCells().run();
                    }
                  },
                  {
                    text: " 分割单元格",
                    click: () => {
                      this.editor.chain().focus().splitCell().run();
                    }
                  },
                  {
                    text: "合并或分割",
                    click: () => {
                      this.editor.chain().focus().mergeOrSplit().run();
                    }
                  },
                  {
                    text: "下一个单元格",
                    click: () => {
                      this.editor.chain().focus().goToNextCell().run();
                    }
                  },
                  {
                    text: "上一个单元格",
                    click: () => {
                      this.editor.chain().focus().goToPreviousCell().run();
                    }
                  }
                ]
              }
            ]
          },

          {
            icon: "format_align_left",
            title: "Align left",
            click: () => {
              this.editor.chain().focus().setTextAlign("left").run();
            }
          },
          {
            icon: "format_align_center",
            title: "Align center",
            click: () => {
              this.editor.chain().focus().setTextAlign("center").run();
            }
          },
          {
            icon: "format_align_right",
            title: "Align right",
            click: () => {
              this.editor.chain().focus().setTextAlign("right").run();
            }
          },
          {
            icon: "format_align_justify",
            title: "Justify content",
            click: () => {
              this.editor.chain().focus().setTextAlign("justify").run();
            }
          },
          { is: "separator" },
          {
            icon: "format_list_numbered",
            title: "编号列表",
            click: () => {
              this.editor.chain().focus().toggleOrderedList().run();
            }
          },
          {
            icon: "format_list_bulleted",
            title: "符号列表",
            click: () => {
              this.editor.chain().focus().toggleBulletList().run();
            }
          },
          { is: "separator" },
          {
            icon: "format_bold",
            title: "加粗",
            click: () => {
              this.editor.chain().focus().toggleBold().run();
            }
          },
          {
            icon: "format_italic",
            title: "斜体",
            click: () => {
              this.editor.chain().focus().toggleItalic().run();
            }
          },
          {
            icon: "format_underline",
            title: "下划线",
            click: () => {
              this.editor.chain().focus().toggleUnderline().run();
            }
          },
          {
            icon: "format_strikethrough",
            title: "中划线",
            click: () => {
              this.editor.chain().focus().toggleStrike().run();
            }
          },
          {
            is: "button-color",
            type: "compact",
            menu_class: "align-center",
            stay_open: false,
            color: this.color,
            update_color: (new_color) => {
              this.editor.chain().focus().toggleHighlight({ color: new_color.hex }).run();
            }
          },
          { is: "separator" },
          { is: DemoCustomButton, text: "自定义按钮", click: () => alert("Your custom action!") },
          { is: "separator" },
          {
            html: "<b>Heading</b>",
            title: "标题",
            chevron: true,
            menu: [
              {
                html: "<b>标题 H1</b>",
                title: "标题 1",
                click: () => {
                  this.editor.chain().focus().toggleHeading({ level: 1 }).run();
                }
              },
              {
                html: "<b>标题 H2</b>",
                title: "标题 2",
                click: () => {
                  this.editor.chain().focus().toggleHeading({ level: 2 }).run();
                }
              },
              {
                html: "<b>标题 H3</b>",
                title: "标题 H3",
                click: () => {
                  this.editor.chain().focus().toggleHeading({ level: 3 }).run();
                }
              },
              {
                html: "<b>标题 H4</b>",
                title: "标题 H4",
                click: () => {
                  this.editor.chain().focus().toggleHeading({ level: 4 }).run();
                }
              },
              {
                html: "<b>标题 H5</b>",
                title: "标题 H5",
                click: () => {
                  this.editor.chain().focus().toggleHeading({ level: 5 }).run();
                }
              },
              {
                html: "<b>标题 H6</b>",
                title: "标题 H6",
                click: () => {
                  this.editor.chain().focus().toggleHeading({ level: 6 }).run();
                }
              }
            ]
          },
          {
            icon: this.edit_mode ? "lock_open" : "lock",
            title: "切换模式",
            active: !this.edit_mode,
            click: () => {
              this.edit_mode = !this.edit_mode;
              this.editor.setEditable(this.edit_mode);
            }
          }
        ]
      ];
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap");
:root {
  --demo-font-color: rgb(74, 238, 164);
}
::selection {
  background-color: rgba(74, 238, 164, 0.2);
}
</style>

<style scoped>
a {
  color: inherit;
}
svg.github {
  fill: var(--demo-font-color);
  margin-right: 5px;
}

.main {
  width: 100%;
  height: 100%;
}
.bars {
  background-color: var(--demo-bars-bkg, white);
  border-radius: var(--demo-bars-border-radius, 5px);
  box-shadow: var(--demo-bars-shadow, 0 0 20px black);
  //padding: var(--demo-bars-padding, 8px);
  transition: 0.5s;
}
::v-deep(.bars) * {
  transition: font-size 0.1s linear, padding 0.1s linear, margin 0.1s linear;
}
</style>
