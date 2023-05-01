import {Component, OnDestroy, OnInit} from '@angular/core';
import {CryptoTools, generateMnemonic, genHash, SeedClipper} from '@solenopsys/fl-crypto';
import {BehaviorSubject, debounceTime, firstValueFrom, map, Observable, Subject, Subscription} from "rxjs";
import {RegisterData} from "../model";
import {HttpClient} from "@angular/common/http";
import {DataProvider, EntityTitle} from '@solenopsys/ui-utils';


const EMAIL = {uid: "email", title: "Email"};

class MessagersDataProvider implements DataProvider {

    privateKey: string;

    data: BehaviorSubject<EntityTitle[]> = new BehaviorSubject([
        {uid: "log", title: "Log"},
        EMAIL
    ]);

    initObserver(str: Observable<string>): Observable<EntityTitle[]> {
        return this.data;
    }

    byId(id: string): Observable<string> {
        return this.data.asObservable().pipe(map((list) => {
            return list.find(i => i.uid === id)?.title
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

    clipper = new SeedClipper('AES-CBC',crypto);
    encryptedKey: string;

    regenerate: Subject<void> = new Subject<void>();

    transport: EntityTitle = EMAIL

    messagersProvider = new MessagersDataProvider();

    publicKey: string;
    subscription!: Subscription;
    privateKey: Uint8Array;

    success = false

    error

    constructor(private httpClient: HttpClient) {

    }

    async sendCode() {
        const tr = this.transport.uid;
        const hash = await genHash(this.password, this.login);
        const publicKey = await new CryptoTools().publicKeyFromPrivateKey(this.privateKey);
        const pubkeyHex =   Array.from(publicKey).map(b => b.toString().padStart(2, '0')).join('');
        const registerData: RegisterData = {
            transport: tr,
            login: this.login,
            encryptedKey: this.encryptedKey,
            publicKey: pubkeyHex,
            hash: hash
        }

        console.log(registerData)


        firstValueFrom(this.httpClient.post("/api/register", JSON.stringify(registerData))).then(res => {
            this.success = true
            console.log(res)
        }).catch(err => {
            this.error = err
            console.log(err)
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

            this.privateKey = await new CryptoTools().privateKeyFromSeed(this.mnemonic);

            this.encryptedKey = await this.clipper.encryptData(this.privateKey, this.password)
        });
    }


}
