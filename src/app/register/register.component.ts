import {Component, OnDestroy, OnInit} from '@angular/core';
import {generateMnemonic, SeedClipper} from '@solenopsys/fl-crypto';
import {
    BehaviorSubject,
    debounceTime,
    filter,
    firstValueFrom,
    map,
    Observable,
    pipe,
    Subject,
    Subscription
} from "rxjs";
import {RegisterData} from "../model";
import {HttpClient} from "@angular/common/http";
import {DataProvider, EntityTitle} from '@solenopsys/ui-utils';


const EMAIL = {uid: "email", title: "Email"};

class MessagersDataProvider implements DataProvider {

    data: BehaviorSubject<EntityTitle[]> = new BehaviorSubject([
        {uid: "log", title: "Log"},
        EMAIL
    ]);

    initObserver(str: Observable<string>): Observable<EntityTitle[]> {
        return this.data;
    }

    byId(id: string): Observable<string> {
        return this.data.asObservable().pipe(map((list) => {
          return  list.find(i=>i.uid===id)?.title
        }))
    }

}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
    password: string;

    mnemonic: string;

    login: string;

    clipper = new SeedClipper('AES-CBC');
    encryptedKey: string;

    regenerate: Subject<void> = new Subject<void>();

    transport:EntityTitle = EMAIL

    messagersProvider = new MessagersDataProvider();

    private publicKey: string;
    private subscription!: Subscription;

    constructor(private httpClient: HttpClient) {

    }

    async sendCode() {




        //this.decryptedKey = await this.clipper.decryptText(this.encryptedKey, this.password)

        const tr = this.transport.uid;
        const hash = crypto.subtle.digest('SHA-256', new TextEncoder().encode(this.password + this.login + tr));
        const hexHash = Array.from(new Uint8Array(await hash)).map(b => b.toString(16).padStart(2, '0')).join('');


        const registerData: RegisterData = {
            transport: tr,
            login: this.login,
            encryptedKey: this.encryptedKey,
            publicKey: this.publicKey,
            hash: hexHash
        }

        console.log(registerData)

        //blah()
        // genJwt({data: "blabla"}).then((jwt) => {
        //     console.log("JWT RESP"+jwt);
        // })
        firstValueFrom(this.httpClient.post("/api/register", JSON.stringify(registerData))).then(res => {
            console.log(res)
        })
    }


    generateSeed() {
        this.mnemonic = generateMnemonic()
        this.regenerate.next()
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }

    ngOnInit(): void {
        this.subscription = this.regenerate.asObservable().pipe(debounceTime(300)).subscribe(async () => {
            this.encryptedKey = await this.clipper.encryptText(this.mnemonic, this.password)
        });
    }


}
