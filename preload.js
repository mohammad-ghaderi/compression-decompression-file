const { contextBridge } = require('electron/renderer')
const { Codec } = require('./code.js')


contextBridge.exposeInMainWorld('api', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,

    compression: (texts) => compression(texts),
    deCompression: (texts, key) => deCompression(texts, key),
    encode: (data) => Codec.encode(data),
    decode: (data) => Codec.decode(data),
	getCodes : (node, curr_code)  => Codec.getCodes(node, curr_code),
	make_string: (node) => Codec.make_string(node),
	make_tree: (tree_string) => Codec.make_tree(tree_string)
})
