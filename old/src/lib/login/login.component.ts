import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {SessionsService} from "../sessions.sevice";
import {CryptoWrapper, Hash, SeedClipper, Tokens} from "@solenopsys/fl-crypto";
import {KeysService} from "../keys.service";


const  cw = new CryptoWrapper(crypto);

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss','../fields.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class LoginComponent implements OnInit{
    login: string;
    password: string;

    error: any;
    clipper:SeedClipper ;

    result:string


    constructor(private ks: KeysService, private router: Router, private ss: SessionsService) {
    }


    async load() {
        const h=new Hash(cw)
        const hash = await h.genHash(this.password, this.login);
        try{
            const res = await this.ks.key(hash)
            const privateKey = await this.clipper.decryptData(res.encryptedKey, this.password)

            console.log("succesed", res, privateKey)

            const  dayMills = 24 * 60 * 60 * 1000;
            const expired = new Date().getMilliseconds()+ 14 * dayMills;

            const t=new Tokens(cw)
            const token=await t.createToken({user: res.publicKey, access: "simple",expired:expired+""}, privateKey);

            await this.ss.saveSession(res.publicKey, token);
            //navigate
            this.router.navigate(['/status/.'], {queryParams: {state: token}})
            console.log("succes token", token)



        } catch (e) {
            this.result="Error: "+e.message
            this.error= e
        }


    }

    ngOnInit(): void {
       this.clipper = new SeedClipper('AES-CBC',cw);
    }
}
