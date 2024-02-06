export const signContent = "这是一个签名示例 请右键插入操作";

export const pageContentHtml = `<page pagenumber="1">
    <h1 style="text-align: center"  extend="false">文档标题</h1>
    <p  extend="false" data-group="bb">这是一个使用prosemirror和tiptap构建的编辑器</p>
    <node  extend="false">
        <p  extend="false" data-group="p1">无标题自定义块</p>
    </node>
    <node  extend="false" title="自定义块标题一">
        <p  extend="false" data-group="p2">我是一个自定义块内容,我是一个自定义块内容,我是一个自定义块内容，我是一个自定义块内容，我是一个自定义块内容</p>
    </node>
    <node  extend="false" title="自定义块标题二">
        <p  extend="false" data-group="p3">我是一个自定义块内容,我是一个自定义块内容,我是一个自定义块内容,我是一个自定义块内容,我是一个自定义块内容</p>
    </node>
    <node  extend="false" title="自定义块标题三">
        <p  extend="false" data-group="p4">我是一个可删除的自定义单选按钮<span type="mention" class="mention" classify="radio" delete="true" label="单选2">单选2</span> 测试按钮</p>
        <p  extend="false" data-group="p5">我是一个不可删除的自定义单选按钮 <span type="mention" class="mention" classify="radio" delete="false" label="单选2">单选2</span> 测试按钮</p>
        <p  extend="false" data-group="p6">我是一个可删除的自定义多选按钮<span type="mention" class="mention" classify="checkbox" delete="true" label="请选择">请选择</span>测试按钮</p>
        <p  extend="false" data-group="p61">我是一个不可删除的自定义多选按钮<span type="mention" class="mention" classify="checkbox" delete="false" label="请选择">请选择</span>测试按钮</p>
        <p  extend="false" data-group="p7">我是一个自定义的日期组件<span type="mention" class="mention" classify="date" delete="false" label="请选择">请选择</span>测试按钮</p>
    </node>
    <p  extend="false" data-group="p21">我是一个独立的段落</p>
    <h3 extend="false">分页说明</h3>
    <p  extend="false" data-group="aa1">H标签支持,p标签支持，自定义块Node支持</p>
    <p  extend="false" data-group="aa2">核心分页逻辑已经完成，其他标签请照案例自行添加</p>
    <table class="border-collapse border border-slate-400" id="25" extend="false">
        <tbody>
            <tr  extend="false">
                <td class="border border-slate-300" colspan="1" rowspan="1">
                    <p  extend="false"></p>
                </td>
                <td class="border border-slate-300" colspan="1" rowspan="1">
                    <p  extend="false"></p>
                </td>
                <td class="border border-slate-300" colspan="1" rowspan="1">
                    <p  extend="false"></p>
                </td>
            </tr>
            <tr  extend="false">
                <td class="border border-slate-300" colspan="1" rowspan="1">
                    <p  extend="false"></p>
                </td>
                <td class="border border-slate-300" colspan="1" rowspan="1">
                    <p  extend="false"></p>
                </td>
                <td class="border border-slate-300" colspan="1" rowspan="1">
                    <p  extend="false"></p>
                </td>
            </tr>
            <tr  extend="false">
                <td class="border border-slate-300" colspan="1" rowspan="1">
                    <p  extend="false"></p>
                </td>
                <td class="border border-slate-300" colspan="1" rowspan="1">
                    <p  extend="false"></p>
                </td>
                <td class="border border-slate-300" colspan="1" rowspan="1">
                    <p  extend="false"></p>
                </td>
            </tr>
        </tbody>
    </table>
</page>`;
export const pageContent = {
  type: "doc",
  content: [
    {
      type: "page",
      attrs: {
        HTMLAttributes: null,
        pageNumber: 1,
        id: "6759fec0-05b7-4a5b-ae04-16bfb6fba9bc"
      },
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: "left",
            extend: "false",
            group: "bb"
          },
          content: [
            {
              type: "text",
              text: "3气管哮喘病史否认支,按国家计划接种"
            },
            {
              type: "text",
              text: "卡介苗、乙肝、脊髓灰质炎、百白破、麻疹及乙脑疫苗."
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_352165982dd",
            title: null,
            group: "title"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "0b4e04a4-51ea-47e7-ba20-a5042663c729",
                extend: "false",
                group: "p1"
              },
              content: [
                {
                  type: "text",
                  text: "记录时间： 日期"
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3954397982",
            title: "既往史",
            group: "body_before"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "fea620f0-dd3c-4ab5-8c85-752b51996a98",
                extend: "false",
                group: "p2"
              },
              content: [
                {
                  type: "text",
                  text: "气管哮喘病史否认支,按国家计划接种"
                },
                {
                  type: "text",
                  text: "卡介苗、乙肝、脊髓灰质炎、百白破、麻疹及乙脑疫苗."
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3521659828",
            title: "诊断结果",
            group: "body_result"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "bb1a5ec3-88ca-4a64-b69c-4a0361f5e434",
                extend: "false",
                group: "p3"
              },
              content: [
                {
                  type: "text",
                  text: "诊断结果正常 ,我是过渡语句 测试 日期 测试2"
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3808237023",
            title: "体格检查",
            group: "body_check"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "c5ae0525-bcaf-4117-8208-804f46612574",
                extend: "false",
                group: "p4"
              },
              content: [
                {
                  type: "text",
                  text: "发育正常，营养良好，神志清楚，主动体位，查体合作,步态正常，正常面容。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "c576357a-1eeb-49f3-8d12-ec214049ed83",
                extend: "false",
                group: "p5"
              },
              content: [
                {
                  type: "text",
                  text: "全身皮肤黏膜无黄染、无水肿，未见出血点、未见蜘蛛痣，全身浅"
                },
                {
                  type: "mention",
                  attrs: {
                    classify: "radio",
                    id: null,
                    delete: "true",
                    label: "单选2"
                  }
                },
                {
                  type: "text",
                  text: " 表淋巴结未扪及肿大， 未见瘘管。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "04f2c624-b004-46ac-a5c0-4d3b02abc2e3",
                extend: "false",
                group: "p6"
              },
              content: [
                {
                  type: "text",
                  text: "头颅形态大小无畸形，畸形颅,无压痛,无肿块。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "bed29b51-a49d-4ed4-866d-d35a42b472d8",
                extend: "false",
                group: "p7"
              },
              content: [
                {
                  type: "text",
                  text: "颜面及眼睑无浮肿，双侧瞳孔等大同圆直径约3mm，对光反应灵敏。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "20acbf06-1e2d-47c0-943b-262d5b33b3b0",
                extend: "false",
                group: "p8"
              },
              content: [
                {
                  type: "text",
                  text: "口腔无异味，口唇红润光泽，黏膜正常，伸舌居中,无震颤。 耳鼻喉科情况详见专科检查。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "04d77859-c088-4c4f-af8b-17500c235e97",
                extend: "false",
                group: "p9"
              },
              content: [
                {
                  type: "text",
                  text: "胸廓双侧对称正常，胸壁无压痛。呼吸运动自如，语音震颤双侧对称，胸壁无压痛。"
                }
              ]
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "left",
            extend: "false",
            group: "p21"
          },
          content: [
            {
              type: "text",
              text: "1气管哮喘病史否认支,按国家计划接种"
            },
            {
              type: "text",
              text: "卡介苗、乙肝、脊髓灰质炎、百白破、麻疹及乙脑疫苗."
            }
          ]
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: "left",
            extend: "false",
            group: "aa"
          },
          content: [
            {
              type: "text",
              text: "2气管哮喘病史否认支,按国家计划接种"
            },
            {
              type: "text",
              text: "卡介苗、乙肝、脊髓灰质炎、百白破、麻疹及乙脑疫苗."
            }
          ]
        }
      ]
    }
  ]
};

export const newContent = {
  type: "doc",
  content: [
    {
      type: "page",
      attrs: {
        HTMLAttributes: null,
        pageNumber: 1,
        id: "6759fec0-05b7-4a5b-ae04-16bfb6fba9bc"
      },
      content: [
        {
          type: "Node",
          attrs: {
            id: "pid_352165982dd",
            title: null,
            group: "title"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "0b4e04a4-51ea-47e7-ba20-a5042663c729",
                group: "p1"
              },
              content: [
                {
                  type: "text",
                  text: "记录时间： 日期"
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3954397982",
            title: "既往史",
            group: "body_before"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "fea620f0-dd3c-4ab5-8c85-752b51996a98",
                group: "p2"
              },
              content: [
                {
                  type: "text",
                  text: "气管哮喘病史否认支,按国家计划接种"
                },
                {
                  type: "text",
                  text: "卡介苗、乙肝、脊髓灰质炎、百白破、麻疹及乙脑疫苗."
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3521659828",
            title: "诊断结果",
            group: "body_result"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "bb1a5ec3-88ca-4a64-b69c-4a0361f5e434",
                group: "p3"
              },
              content: [
                {
                  type: "text",
                  text: "诊断结果正常 ,我是过渡语句 测试 日期 测试2"
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3808237023",
            title: "体格检查",
            group: "body_check"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "c5ae0525-bcaf-4117-8208-804f46612574",
                group: "p4"
              },
              content: [
                {
                  type: "text",
                  text: "发育正常，营养良好，神志清楚，主动体位，查体合作,步态正常，正常面容。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "c576357a-1eeb-49f3-8d12-ec214049ed83",
                group: "p5"
              },
              content: [
                {
                  type: "text",
                  text: "全身皮肤黏膜无黄染、无水肿，未见出血点、未见蜘蛛痣， 未见瘘管。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "04f2c624-b004-46ac-a5c0-4d3b02abc2e3",
                group: "p6"
              },
              content: [
                {
                  type: "text",
                  text: "头颅形态大小无畸形，无肿块。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "bed29b51-a49d-4ed4-866d-d35a42b472d8",
                group: "p7"
              },
              content: [
                {
                  type: "text",
                  text: "颜面及眼睑无浮肿，双侧瞳孔等大同圆直径约3mm，对光反应灵敏。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "20acbf06-1e2d-47c0-943b-262d5b33b3b0",
                group: "p8"
              },
              content: [
                {
                  type: "text",
                  text: "口腔无异味，口唇红润光泽，黏膜正常，伸舌居中,无震颤。 耳鼻喉科情况详见专科检查。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "04d77859-c088-4c4f-af8b-17500c235e97",
                group: "p9"
              },
              content: [
                {
                  type: "text",
                  text: "胸廓双侧对称正常，胸壁无压痛。呼吸运动自如，语音震颤双侧对称，胸壁无压痛。"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const pageOldContent = {
  type: "doc",
  content: [
    {
      type: "page",
      attrs: {
        HTMLAttributes: null,
        pageNumber: 1,
        id: "6759fec0-05b7-4a5b-ae04-16bfb6fba9bc"
      },
      content: [
        {
          type: "Node",
          attrs: {
            id: "pid_352165982dd",
            title: null,
            group: "title"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "0b4e04a4-51ea-47e7-ba20-a5042663c729",
                group: "p1"
              },
              content: [
                {
                  type: "text",
                  text: "记录时间： 日期"
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3954397982",
            title: "既往史",
            group: "body_before"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "fea620f0-dd3c-4ab5-8c85-752b51996a98",
                group: "p2"
              },
              content: [
                {
                  type: "text",
                  text: "气管哮喘病史否认支,按国家计划接种"
                },
                {
                  type: "text",
                  text: "卡介苗、乙肝、脊髓灰质炎."
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3521659828",
            title: "诊断结果",
            group: "body_result"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "bb1a5ec3-88ca-4a64-b69c-4a0361f5e434",
                group: "p3"
              },
              content: [
                {
                  type: "text",
                  text: "诊断结果正常 ,我是过渡语句 测试 日期 测试2"
                }
              ]
            }
          ]
        },
        {
          type: "Node",
          attrs: {
            id: "pid_3808237023",
            title: "体格检查",
            group: "body_check"
          },
          content: [
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "c5ae0525-bcaf-4117-8208-804f46612574",
                group: "p4"
              },
              content: [
                {
                  type: "text",
                  text: "发育正常，营养良好，神志清楚，主动体位，查体合作,步态正常，正常面容。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "c576357a-1eeb-49f3-8d12-ec214049ed83",
                group: "p5"
              },
              content: [
                {
                  type: "text",
                  text: "全身皮肤黏膜无黄染、无水肿，未见出血点、未见蜘蛛痣，全身浅表淋巴结未扪及肿大， 未见瘘管。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "04f2c624-b004-46ac-a5c0-4d3b02abc2e3",
                group: "p6"
              },
              content: [
                {
                  type: "text",
                  text: "头颅形态大小无畸形，畸形颅,无压痛,无肿块。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "bed29b51-a49d-4ed4-866d-d35a42b472d8",
                group: "p7"
              },
              content: [
                {
                  type: "text",
                  text: "颜面及眼睑无浮肿，双侧瞳孔等大同圆直径约3mm，对光反应灵敏。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "20acbf06-1e2d-47c0-943b-262d5b33b3b0",
                group: "p8"
              },
              content: [
                {
                  type: "text",
                  text: "口腔无异味，口唇红润光泽，黏膜正常，伸舌居中,无震颤。 耳鼻喉科情况详见专科检查。"
                }
              ]
            },
            {
              type: "paragraph",
              attrs: {
                textAlign: "left",
                id: "04d77859-c088-4c4f-af8b-17500c235e97",
                group: "p9"
              },
              content: [
                {
                  type: "text",
                  text: "胸廓双侧对称正常，呼吸运动自如，语音震颤双侧对称，胸壁无压痛。"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const headerlist = [
  {
    id: 2,
    x: 300,
    y: 24,
    w: 180,
    h: 26,
    focused: false,
    value: "XXXXXXXXXXXXX",
    label: "文字",
    component: "custom-text",
    type: "text",
    styles: {
      color: "#000000",
      fontSize: "18px",
      fontWeight: "bold"
    },
    handles: ["mr", "bm"]
  },
  {
    id: 1,
    x: 17,
    y: 68,
    w: 215,
    h: 25,
    value: "卡号：51132219980423191",
    label: "文字",
    focused: false,
    component: "custom-text",
    type: "text",
    styles: {}
  },
  {
    id: 2,
    x: 300,
    y: 69,
    w: 130,
    h: 25,
    value: "姓名：王一火",
    label: "文字",
    focused: false,
    component: "custom-text",
    type: "text",
    styles: {}
  },
  {
    id: 3,
    x: 500,
    y: 70,
    w: 81,
    h: 25,
    value: "性别：男",
    label: "文字",
    focused: false,
    component: "custom-text",
    type: "text",
    styles: {}
  },
  {
    id: 4,
    x: 650,
    y: 69,
    w: 89,
    h: 25,
    value: "年龄：24",
    label: "文字",
    focused: false,
    component: "custom-text",
    type: "text",
    styles: {}
  }
];
//页脚
export const footerlist = [
  {
    id: 3,
    x: 8,
    y: 5,
    w: 100,
    h: 26,
    focused: false,
    value: "科室：牙周科",
    label: "文字",
    component: "custom-text",
    type: "text",
    styles: {
      color: "#000000",
      fontSize: 18
    }
  },
  {
    id: 4,
    x: 656,
    y: 6,
    w: 100,
    h: 26,
    focused: false,
    value: "第一页",
    label: "页码",
    component: "page-count",
    type: "text",
    styles: {
      color: "#000000",
      fontSize: 18
    }
  },
  {
    id: 1,
    x: 143,
    y: 5,
    w: 131,
    h: 30,
    value: "医生：_____",
    label: "文字",
    focused: false,
    component: "custom-text",
    type: "text",
    styles: {}
  },
  {
    id: 2,
    x: 293,
    y: 8,
    w: 113,
    h: 25,
    value: "护士：魏晨曦",
    label: "文字",
    focused: false,
    component: "custom-text",
    type: "text",
    styles: {}
  },
  {
    id: 4,
    x: 444,
    y: 9,
    w: 202,
    h: 25,
    value: "时间：2023-03-27",
    label: "文字",
    focused: false,
    component: "custom-text",
    type: "text",
    styles: {}
  }
];
