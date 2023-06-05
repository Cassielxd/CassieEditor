import mitt, { Emitter } from "mitt";

type Events = {
  print: {
    currentNumber: number;
    height: number;
    openSet: boolean;
  };
};

export default mitt<Events>();
