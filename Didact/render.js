const Didact = {
    createElement,
    render
}

function createTextElement(text){
    return {
        type : 'TEXT_ELEMENT',
        props : {
            nodeValue : text,
            children : []
        }
    }
}

function createElement(type,props,...children){
    return {
        type,
        props : {
            ...props,
            children : children.map((child) => (
                typeof child === 'object' ? child : createTextElement(child)
            ))
        }
    }
}

function createDom(fiber){
    const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);

    const isProperty = type => type !== 'children';

    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = fiber.props[name]
        })
    
    return dom
}

let nextUnitOfWork = null;
function render(element, container){
    nextUnitOfWork = {
        dom : container,
        props : {
            children : [element]
        }
    }
}

function workLoop(dealline){
    let shouldYield = false;
    while(nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = dealline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber){
    // step1 : create new dom node and append
    if(!fiber.dom){
        fiber.dom = createDom(fiber)
    }
    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }

    // step2: create new fibers for children
    const elements = fiber.props.children;
    let index = 0;
    while(index < elements.length){
        const element = elements[index];

        const newFiber = {
            type : element.type,
            props : element.props,
            parent : fiber,
            dom : null
        }

        if(index === 0){
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }
        let prevSibling = newFiber
        index++;
    }

    // step3: return nextUnitOfWork
    if(fiber.child){
        return fiber.child
    }
    let nextFiber = fiber;
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling
        } 
        nextFiber = nextFiber.parent
    }
}



/** @jsx Didact.createElement */
const element = (
    <div style="background : salmon">
        <h1>Hello world</h1>
        <h2 style="text-align:right">from Didact</h2>
    </div>
)

const container = document.getElementById('root');
Didact.render(element,container)