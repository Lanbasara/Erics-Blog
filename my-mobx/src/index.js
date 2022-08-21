import { observable, autorun } from "./lib/index";

class Counter {
  @observable count = 0;
  increment() {
    this.count++;
  }
  @observable list = [1, 2, 3];
  changeList() {
    this.list[0] = 2;
  }
}
const counter = new Counter();
autorun(() => {
  console.log(`count=${counter.count}`);
});

autorun(() => {
  console.log(`list=${counter.list}`);
});

counter.increment();
counter.changeList();
