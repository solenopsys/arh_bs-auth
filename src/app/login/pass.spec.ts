import {Clipper} from "./pass";


describe('Encrypt', () => {

    it('should encrypt', async () => {
        const clipper = new Clipper('AES-CBC');
        const pass="blabla";
        const protectText = "Hello, world!";
        const encrypted = await clipper.encryptText(protectText, pass);
        const decryptText =  await clipper.decryptText(encrypted, pass);
        expect(protectText).toBe(decryptText);
    });
})