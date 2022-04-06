import { Component } from "react";
class MySuspense extends Component {
  constructor() {
    super();
    this.state = {
      isRender: true,
    };
  }

  componentDidCatch(event) {
    this.setState({
      isRender: false,
    });
    event.value.then((res) => {
      this.setState({
        isRender: true,
      });
    });
    console.log("componentDidCatch event is", event);
  }

  render() {
    const { fallback, children } = this.props;
    const { isRender } = this.state;

    return isRender ? children : fallback;
  }
}

export default MySuspense;
