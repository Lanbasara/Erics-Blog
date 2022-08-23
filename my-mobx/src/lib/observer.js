import autorun from "./autorun";

export default function observer(target){
    let componentWillMount = target.prototype.componentWillMount;
    target.prototype.componentWillMount = function(){
        componentWillMount && componentWillMount.call(this)
        autorun(() => {
            this.render()
            this.forceUpdate()
        })
    }
}