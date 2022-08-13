const { importEntry } = require("import-html-entry")

let entry = 'https://lanbasara-erics-blog-74qxqp9xfwp94-5500.githubpreview.dev/micro-fe/test.html'


// const { getExternalScripts, getExternalStyleSheets } = 
importEntry(entry).then(({ getExternalScripts, getExternalStyleSheets, }) => {
    const css = getExternalScripts()
    const js = getExternalStyleSheets()
    console.log(css)
    console.log(js)
})