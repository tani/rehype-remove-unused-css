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

const unified = require("unified")
const rehype = require("rehype-parse")
const stringify = require("rehype-stringify")
const { promisify } = require("util");
const uncss = require(".")
const processor = unified()
    .use(rehype)
    .use(uncss)
    .use(stringify)
test("Remove unused stylesheet", () => {
    const i = '<html><head><style>.button-active { color: green; }   .unused-class { display: block; }</style></head><body><button class="button-active"> Login </button></body></html>'
    const o = '<html><head><style>.button-active { color: green; }</style></head><body><button class="button-active"> Login </button></body></html>'
    return new Promise((resolve, reject) =>{
        processor.process(i, (err, file) => {
            if (err) reject(err)
            expect(file.toString()).toBe(o)
            resolve()
        })
    })
})

test("Failed to remove unused stylesheet", async () => {
    const i = '<html><head><style>.button-active { color: green;    .unused-class { display: block; }</style></head><body><button class="button-active"> Login </button></body></html>'
    await expect(promisify(processor.process)(i)).rejects.toThrow()
})