// 添加节点
const body = document.body
body.append('sdadsadasdas','hahahah')

// 新增节点
const div = document.createElement("div")

// 改变节点内容
div.innerText = "I'm div"
div.textContent = "I'm div 2"
body.append(div)

// 改变节点HTML
const div2 = document.createElement("div")
div2.innerHTML = "<strong>I'm div2</strong>"
body.append(div2)


// 删除节点
const divParent = document.querySelector('div')
const spanHello = document.querySelector('#hello')
const spanbye = document.querySelector('#bye')

spanbye.remove()
divParent.removeChild(spanHello)

// 修改节点属性
const divAttribute = document.querySelector("div#modify-attribute")
const spanHaha = document.querySelector('#haha')
console.log(spanHaha.getAttribute('title'))
spanHaha.setAttribute('title', 'spanHaha')
spanHaha.setAttribute('data-test','test')


// 修改data-属性
console.log(spanHaha.dataset)
console.log('divAttribute.dataset is',divAttribute.dataset)
// divAttribute.setAttribute('data-div-attribute','data-div-attribute')

divAttribute.dataset.longName = 'this is span attribute'


// 修改class
console.log('spanHaha.classList is',spanHaha.classList)
spanHaha.classList.toggle('span-back')
spanHaha.classList.toggle('span-up', true)