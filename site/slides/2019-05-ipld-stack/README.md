
::: slide
IPLD Authoring in JavaScript w/<br>
`ipld-stack`
:::

::: slide
What does an "IPLD Native" developer experience look like?
:::

::: slide
# Many people had different ideas that helped shaped this new library.
# Special thanks to: 
* @vmx
* @Gozala
* @rvagg
* @alexpotsides
* @olizilla
* @alanshaw
:::

::: slide
Goals:
* Writing IPLD should be fun! 🥳
* Authoring should be as codec agnostic as possible.
* All reads should be path based.
* Default performance should be quite good.
* The design should leave room for future codec specific perf improvements.
:::

::: slide
Authoring 😁
```javascript
const Block = require('@ipld/block') // soon
const { Block } = require('@ipld/stack') // now

let block = Block.encoder({hello: 'world'}, 'dag-json')
```
:::

::: slide
Expensive Operations happen lazily 😎 
```javascript
let buffer = await block.encode()
let cid = await block.cid()
```
:::

::: slide
Decoding data 🤨
```javascript
let block = Block.decoder(buffer, 'dag-json')
// OR
let block = Block.create(buffer, cid)

let obj = await block.decode()
```
:::

::: slide
Validation 😷
```javascript
assert.ok(await block.validate())
```
:::

::: slide
Reading data 😚
```javascript
let reader = await block.reader()

let value = reader.get('/some/path')

for (let [path, link] of reader.links()) {
  console.log(path, link.toBaseEncodedString())
}
for (let [path, value] of reader.tree()) {
  console.log(path, value)
}
```
:::

::: slide
# Path Level One 🤯
```javascript
const { resolve, find, blocks } = require('@ipld/path-level-one')
const get = async cid => { /* return block from storage */ }

let result = resolve('/one/two/three/hello', cid, get)
// result == "world"

result = find('/one/two/three/hello', cid, get)
// result.value == "world"
// result.block == Last block, contains value
// result.path == Path to value in last block

for (let block of blocks('/one/two/three/hello', cid, get)) {
  console.log(await block.cid())
}
```
:::

::: slide
Advanced: block source 🤩
```javascript
let block = Block.encoder({hello: 'world'}, 'dag-json')
let src = block.source()
// src == {hello: 'world'}
await block.cid() || await block.encode()
src = block.source()
// src == null
```
:::

::: slide
Advanced: maybeSync 🥰
```javascript
let block = Block.encoder({hello: 'world'}, 'dag-json')
let buffer = block.encodeMaybeSync()
// buffer == Buffer || Promise
```
:::

::: slide
Advanced: get-codec 🤫
```javascript
const getCodec = require('@ipld/get-codec') // soon
const { getCodec } = require('@ipld/stack') // now

let codec = await getCodec('dag-json')
let buffer = codec.encode({hello: 'world'})
let obj = codec.decode(buffer)
// obj == {hello: 'world'}
let block = Block.encoder(obj, 'dag-json')
// Note: codec's reader interface takes a block instance
// so that it can benefit from caching and other optimizations
let reader = codec.reader(block)
```
:::

::: slide
Advanced: codec-interface 😇
```javascript
const inter = require('@ipld/codec-interface') // now!

const encode = async obj => new Buffer()
const decode = async buffer => { /* native object */ }
// OR, sync
const encode = obj => new Buffer()
const decode = buffer => { /* native object */ }

const codec = inter.create(encode, decode, 'dag-nope')
// codec.encode()
// codec.decode()
// codec.reader()
```
:::

::: slide
https://github.com/ipld/js-ipld-stack

Come drink this koolaid 🤑
:::
