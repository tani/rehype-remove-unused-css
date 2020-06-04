const uncss = require("uncss")
const toHtml = require("hast-util-to-html")
const { selectAll } = require("unist-util-select")

module.exports = function purify(options) {
    return async (tree) => {
        const html = toHtml(tree)
        const nodes = selectAll("[tagName=style]", tree)
        await Promise.all(nodes.map((node)=>new Promise((resolve, reject)=>{
            const raw = node.children.map(c=>c.value).join()
            uncss(html, {...options, raw}, (err, value)=>{
                if(err) reject(err)
                node.children = [{
                    value,
                    type: "text",
                    position: {
                        start: node.children[0].position.start,
                        end: node.children[node.children.length - 1].position.end
                    }
                }]
                resolve()
            })
        })))
    }
}