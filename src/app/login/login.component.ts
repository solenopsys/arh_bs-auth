import {Component, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {firstValueFrom} from "rxjs";
import {RegisterData} from "../model";
import {Router} from "@angular/router";
import {SessionsService} from "../sessions.sevice";
import {createToken, genHash, SeedClipper} from "@solenopsys/fl-crypto";



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class LoginComponent {
    login: string;
    password: string;

    clipper = new SeedClipper('AES-CBC',crypto);

    result:string


    constructor(private httpClient: HttpClient, private router: Router, private ss: SessionsService) {
    }


    async load() {
        const hash = await genHash(this.password, this.login);
        try{
            const res = await firstValueFrom(this.httpClient.post<RegisterData>("/api/key", hash))
            const privateKey = await this.clipper.decryptData(res.encryptedKey, this.password)

            console.log("succesed", res, privateKey)

            const token=createToken({user: res.publicKey, access: "simple",expired:"14d"}, privateKey);

            this.ss.saveSession(res.publicKey, token);
            //navigate
            this.router.navigate(['/status'], {queryParams: {state: token}})
            console.log("succes token", token)



        } catch (e) {
            this.result="Error: "+e.message
        }


    }
}
