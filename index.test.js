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