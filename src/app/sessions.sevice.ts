import {Injectable} from "@angular/core";
import {hex2buf, readToken} from "@solenopsys/fl-crypto";

const STORAGE_KEY = "auth";

export type Auth = {
    pubKey:string,
    expiredAd:Date,
}

@Injectable(
    { providedIn: 'root' }
)
export class SessionsService{

    async saveSession(pubKey: string,jwt:any) {


        let auth: any = localStorage.getItem(STORAGE_KEY);
       if (!auth) {
            auth = {}
        }
        auth[pubKey] = jwt
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
    }

    async getSessions() {
        const auth=localStorage.getItem(STORAGE_KEY);
        const obj=JSON.parse(auth)
        console.log("AUTH",)
        const items: Auth[] = [];
        if (obj) {
            const keys = Object.keys(obj);
            for (const key of keys) {
                const tokenBytes =obj[key];
                 const tokenData= readToken(tokenBytes, hex2buf(key));
                console.log("KEY", key, tokenData)
                items.push({pubKey: key, expiredAd: new Date(tokenData.exp*1000)})
            }

        }
        return items;
    }
}