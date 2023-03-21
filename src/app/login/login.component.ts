import {Component, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Buffer} from 'buffer';
import {SeedClipper} from "@solenopsys/fl-crypto";
import {firstValueFrom} from "rxjs";



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

    encryptedKey: string;
    decryptedKey: string;
    private publicKey: string;

    constructor(private httpClient: HttpClient) {
    }


}
