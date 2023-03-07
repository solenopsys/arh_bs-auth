import {NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {createNgxs} from "@solenopsys/fl-storage";
import {LoginComponent} from "./login/login.component";
import {AppComponent} from "./app.component";
import {BaseLayoutComponent} from "./base-layout/base-layout.component";
import {environment} from "../environments/environment";
import {UIFormsModule} from "@solenopsys/ui-forms";
import {UIControlsModule} from "@solenopsys/ui-controls";
import { StatusComponent } from './status/status.component';
import { QrcodeComponent } from '../../../../uimatrix/ui-qr/src/lib/qrcode/qrcode.component';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        BaseLayoutComponent,
        StatusComponent,
        QrcodeComponent
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        BrowserModule.withServerTransition({ appId: "solenopsys" }),
        BrowserModule,
        RouterModule.forRoot([
            {
                path: "",
                component: BaseLayoutComponent,
                children: [
                    {
                        path: "",
                        component: StatusComponent
                    },
                     {
                        path: "login",
                        component: LoginComponent
                    }]
            }
        ], { initialNavigation: "enabledBlocking" }),

        ...createNgxs(!environment.production, [], true),
        UIFormsModule,
        UIControlsModule
    ],
    providers: [{ provide: "assets_dir", useValue: "" }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
