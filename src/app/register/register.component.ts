import {Component, OnDestroy, OnInit} from '@angular/core';
import { generateMnemonic, generatePrivateKeyFromSeed, generatePublicKeyPrivate, genHash, SeedClipper} from '@solenopsys/fl-crypto';
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
import { RegisterData} from "../model";
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
    privateKey: Uint8Array;

    constructor(private httpClient: HttpClient) {

    }

    async sendCode() {






        //this.decryptedKey = await this.clipper.decryptText(this.encryptedKey, this.password)

        const tr = this.transport.uid;

        const hash = await genHash(this.password,this.login);



        //string to buffer
       // const mnemonicBuffer:Buffer=  Buffer.from(this.mnemonic, 'utf-8')
      //   const privateKey = await generatePrivateKeyFromSeed(this.mnemonic);
        const publicKey = await generatePublicKeyPrivate(this.privateKey);
        const pubkeyHex =  Buffer.from( publicKey).toString('hex');
        const registerData: RegisterData = {
            transport: tr,
            login: this.login,
            encryptedKey: this.encryptedKey,
            publicKey:pubkeyHex,
            hash: hash
        }

        console.log(registerData)


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
             this.privateKey = await generatePrivateKeyFromSeed(this.mnemonic);
            this.encryptedKey = await this.clipper.encryptData(this.privateKey, this.password)
        });
    }


}
