import mitt, { Emitter } from "mitt";

type Events = {
  print: {
    currentNumber: number;
    height: number;
    openSet: boolean;
    pageId: string;
  };
};

export default mitt<Events>();
