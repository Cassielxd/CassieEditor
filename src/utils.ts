export function getRandomColor() {
  return getRandomElement(["#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8", "#94FADB", "#B9F18D"]);
}
const getRandomElement = (list: any) => {
  return list[Math.floor(Math.random() * list.length)];
};

export function getRandomName() {
  return getRandomElement(["吴承恩(老师)", "曹雪芹(老师)", "张三(学生)", "李白(老师)", "杜甫(老师)", "李四(学生)", "李刚(学生)", "彦龙(学生)", "老马(老师)"]);
}
