import { autobind } from 'core-decorators';
import React from 'react'
import ReactDOM from 'react-dom'
import { observable, autorun, observer, computed } from "./lib/index";

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


@observer
@autobind
class Test extends React.Component{
  @observable counter = {
    value : 1,
    counter : 0
  }
  @computed
  get(){
    return this.counter.counter
  }
  cancle = autorun(() => {
    console.log('value is',this.counter.value)
  })
  cancle2 = autorun(() => {
    console.log('counter is',this.counter.counter)
  })
  plus(){
    this.counter.value++
    this.counter.counter++
  }

  render(){
    return <div onClick={this.plus}>{this.counter.value}</div>
  }
}


// use with react
function App(){
  return <div>
    <Test/>
  </div>
}

ReactDOM.render(<App/>,document.getElementById('root'))
