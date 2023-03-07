export class Clipper {
    const
    encoder = new TextEncoder();

    constructor(
        private algorithm: string,
    ) {
    }

    getPassData(password: string): Uint8Array {

        const passwordData = this.encoder.encode(password);
        const passData = new Uint8Array(32)
        passData.set(passwordData, 0);
        return passData
    }

    // Encrypt a text string using a password
    async encryptText(text: string, password: string): Promise<string> {

        const data = this.encoder.encode(text);
        const algorithm = {name: this.algorithm, length: 256};
        const key = await crypto.subtle.importKey('raw', this.getPassData(password), algorithm, false, ['encrypt']);
        const iv = crypto.getRandomValues(new Uint8Array(16));
        const encryptedData = await crypto.subtle.encrypt({name: this.algorithm, iv}, key, data);

        const buffer = new Uint8Array(iv.byteLength + encryptedData.byteLength);
        buffer.set(iv, 0);
        buffer.set(new Uint8Array(encryptedData), iv.byteLength);
        return Array.prototype.map.call(buffer, x => ('00' + x.toString(16)).slice(-2)).join('');
    }

// Decrypt an encrypted text string using a password
    async decryptText(encryptedText: string, password: string): Promise<string> {


        const algorithm = {name: this.algorithm, length: 256};
        const key = await crypto.subtle.importKey('raw',  this.getPassData(password), algorithm, false, ['decrypt']);
        const buffer = new Uint8Array(encryptedText.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)));
        const iv = buffer.slice(0, 16);
        const encryptedData = buffer.slice(16);
        const decryptedData = await crypto.subtle.decrypt({name: this.algorithm, iv}, key, encryptedData);

        const decoder = new TextDecoder();
        const decryptedText = decoder.decode(decryptedData);

        return decryptedText;
    }

}


