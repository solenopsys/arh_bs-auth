import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

import {Buffer} from 'buffer';
import {SeedClipper,generateMnemonic} from "@solenopsys/fl-crypto";

async function encript(data: string, password: string) {
    // Generate a 256-bit salt;


// Encrypt some data using AES-GCM with the derived key


    //  console.log(decryptedText); // Output: "Hello, world!"
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.Buffer = Buffer;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class LoginComponent {
    email: string;
    code: string;
    mnemonic: string;
    clipper = new SeedClipper('AES-CBC');

    pr: string;
    dc: string;

    constructor(private httpClient: HttpClient) {
        this.initBip39();
    }


    async initBip39() {


        this.mnemonic=generateMnemonic()
    }


    sendCode() {
        this.clipper.encryptText(this.mnemonic, this.code).then((pr: string) => {
                this.pr = pr;
                this.clipper.decryptText(pr, this.code).then((dc: string) => {
                    this.dc=dc
                });
            }
        );
        // firstValueFrom(this.httpClient.post("/login", JSON.stringify({
        //     email: this.email,
        //     password: this.code
        // }))).then(res => {
        //     console.log(res)
        // })
    }

    sendLogin() {
        console.log("ok")
    }
}
