import {Component, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Buffer} from 'buffer';
import {genHash, genJwt, SeedClipper} from "@solenopsys/fl-crypto";
import {firstValueFrom} from "rxjs";
import {RegisterData} from "../model";
import {Router} from "@angular/router";
import {SessionsService} from "../sessions.sevice";


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

    result:string


    constructor(private httpClient: HttpClient, private router: Router, private ss: SessionsService) {
    }


    async load() {
        const hash = await genHash(this.password, this.login);
        try{
            const res = await firstValueFrom(this.httpClient.post<RegisterData>("/api/key", hash))
            const privateKey = await this.clipper.decryptData(res.encryptedKey, this.password)

            this.result="success"

            genJwt({user: res.publicKey, access: "simple"}, privateKey, '14d').then((jwt) => {
                this.ss.saveSession(res.publicKey, jwt);
                //navigate
                this.router.navigate(['/status'], {queryParams: {state: jwt}})
            });
        } catch (e) {
            this.result="Error: "+e.message
        }


    }
}
