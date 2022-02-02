const Koa = require('koa');
const app = new Koa();
const path = require('path')
const fs = require('fs')
app.use((ctx) => {
    console.log('ctx url is',ctx.url)
    if(ctx.url === '/render.js'){
        const script = fs.readFileSync(path.resolve(__dirname,'./render.js'))
        ctx.set('Content-type','application/javascript')
        ctx.body = script
    } else {
        const html = fs.readFileSync(path.resolve(__dirname,'./index.html'))
        ctx.set('Content-type','text/html');
        ctx.body = html
    }
})

app.listen(3000)