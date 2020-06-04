/**
 * @license
 * Copyright (c) 2020 TANIGUCHI Masaya.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
                    position: node.children.every(c=>c.position) ? {
                        start: node.children[0].position.start,
                        end: node.children[node.children.length - 1].position.end
                    } : undefined
                }]
                resolve()
            })
        })))
    }
}