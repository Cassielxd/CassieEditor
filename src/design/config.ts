// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as dft from "./default";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as styleFormConfig from "./style-form-config";

export type WidgetOptions = {
  id: number;
  x: number;
  y: number;
  focused: boolean;
  type: string;
  component: string;
  label: string;
  w: number;
  h: number;
  value: any;
  styles: any;
  styleForm: any;
  handles: [any];
};

// 组件列表的配置项
export const WIDGET_BASE_LIST = [
  {
    type: "logo",
    component: "custom-logo",
    label: "logo",
    default: {
      w: 50,
      h: 50,
      value: ""
    },
    styles: {},
    styleForm: {}
  },
  {
    type: "text",
    component: "page-count",
    label: "页码",
    default: dft.PAGE_COUNT_DATA,
    styles: dft.TEXT_STYLE,
    styleForm: styleFormConfig.TEXT
  },
  {
    type: "text",
    component: "custom-text",
    label: "文字",
    default: dft.TEXT_DATA,
    styles: dft.TEXT_STYLE,
    styleForm: styleFormConfig.TEXT
  },
  {
    type: "select",
    component: "custom-select",
    label: "下拉",
    default: {
      w: 100,
      h: 32,
      value: ""
    },
    styles: {},
    styleForm: {}
  },
  {
    type: "image",
    component: "custom-image",
    label: "图片",
    default: {
      w: 50,
      h: 50,
      value: ""
    },
    styles: {},
    styleForm: {}
  },

  {
    type: "hline",
    component: "custom-hline",
    label: "横线",
    default: {
      w: 100,
      h: 4
    },
    styles: {},
    styleForm: []
  },
  {
    type: "vline",
    component: "custom-vline",
    label: "竖线",
    default: {
      w: 4,
      h: 100,
      value: ""
    },
    styles: {},
    styleForm: []
  }
];
