import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {RegisterData} from "./model";

//const HOST = "https://keys.solenopsys.org"
//const HOST = "http://localhost:5373"
const HOST = "http://127.0.0.1:8899"

@Injectable({
    providedIn: 'root'
})
export class KeysService {
    constructor(private httpClient: HttpClient) {
    }

    register(registerData): Promise<any> {
        return firstValueFrom(this.httpClient.post(`${HOST}/api/register`, JSON.stringify(registerData)))
    }

    key(hash: string): Promise<RegisterData> {
        return firstValueFrom(this.httpClient.post<RegisterData>(`${HOST}/api/key`, hash))
    }
}