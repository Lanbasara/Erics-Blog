const Koa = require('koa');
const app = new Koa()
const fs = require('fs');
const path = require('path');
app.use((ctx) => {
    const html = fs.readFileSync(path.resolve(__dirname,'../output/index.html'))
    ctx.set('Content-type','text/html');
    ctx.body = html
})