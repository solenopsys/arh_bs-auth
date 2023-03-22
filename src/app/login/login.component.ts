import {Component, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Buffer} from 'buffer';
import {genHash, genJwt, SeedClipper} from "@solenopsys/fl-crypto";
import {firstValueFrom} from "rxjs";
import {RegisterData} from "../model";


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
    login: string;
    password: string;

    clipper = new SeedClipper('AES-CBC');


    constructor(private httpClient: HttpClient) {
    }


    async load() {
        const hash = await genHash(this.password, this.login);
        const res = await firstValueFrom(this.httpClient.post<RegisterData>("/api/key", hash))
        const privateKey = await this.clipper.decryptData(res.encryptedKey, this.password)

        genJwt({user: res.publicKey, access: "simple"}, privateKey, '2h').then((jwt) => {
            console.log("JWT RESP" + jwt);
        });
    }
}
