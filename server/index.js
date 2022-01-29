const Koa = require('koa');
const app = new Koa()
const fs = require('fs');
const path = require('path');

app.use(async (ctx, next) => {
    if(/.*\.js/.test(ctx.url)){
        ctx.set('Content-type','application/javascript');
        const js = fs.readFileSync(path.resolve(__dirname,`../output/${ctx.url}`))
        ctx.body = js;
        await next()
    } else {
        const html = fs.readFileSync(path.resolve(__dirname,'../output/index.html'))
        ctx.set('Content-type','text/html');
        ctx.body = html;
        await next();
    }

})
app.listen(3000)