import {Component, OnDestroy, OnInit} from '@angular/core';
import {buf2hex, CryptoTools, CryptoWrapper, generateMnemonic, Hash, SeedClipper} from '@solenopsys/fl-crypto';
import {BehaviorSubject, debounceTime, map, Observable, Subject, Subscription} from "rxjs";
import {RegisterData} from "../model";
import {DataProvider, EntityTitle} from '@solenopsys/ui-utils';
import {KeysService} from "../keys.service";

const  cw = new CryptoWrapper(crypto);

const EMAIL = {uid: "email", title: "Email"};

class MessagersDataProvider implements DataProvider {



    privateKey: string;

    public fieldWidth = 400;

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
    styleUrls: ['./register.component.scss','../fields.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
    password: string;

    mnemonic: string;

    login: string;

    clipper: SeedClipper;
    encryptedKey: string;

    regenerate: Subject<void> = new Subject<void>();

    transport: EntityTitle = EMAIL

    messagersProvider = new MessagersDataProvider();

    publicKey: string;
    subscription!: Subscription;
    privateKey: Uint8Array;

    success = false

    error
    fieldWidth=  300;

    constructor(private ks: KeysService) {

    }

    async sendCode() {
        const tr = this.transport.uid;

        const h=new Hash(cw)
        const hash = await h.genHash(this.password, this.login);
        const publicKey = await new CryptoTools(cw).publicKeyFromPrivateKey(this.privateKey);
        const pubkeyHex = buf2hex(publicKey);
        const registerData: RegisterData = {
            transport: tr,
            login: this.login,
            encryptedKey: this.encryptedKey,
            publicKey: pubkeyHex,
            hash: hash
        }

        console.log(registerData)


        this.ks.register(registerData).then(res => {
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
        this.clipper = new SeedClipper('AES-CBC', cw);
        this.subscription = this.regenerate.asObservable().pipe(debounceTime(300)).subscribe(async () => {

            this.privateKey = await new CryptoTools(cw).privateKeyFromSeed(this.mnemonic);

            this.encryptedKey = await this.clipper.encryptData(this.privateKey, this.password)
        });
    }


}
