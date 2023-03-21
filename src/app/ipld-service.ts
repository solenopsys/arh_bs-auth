import * as IPFS from 'ipfs-core'


export async function  blah() {
    const ipfs = await IPFS.create()
    const { cid } = await ipfs.add('Hello world')
    console.log(cid)
}