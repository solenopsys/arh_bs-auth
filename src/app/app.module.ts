import {NgModule} from "@angular/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

import {Route, RouterModule} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {AppComponent} from "./app.component";
import {environment} from "../environments/environment";
import {StatusComponent} from './status/status.component';
import {UIControlsModule} from "@solenopsys/ui-controls";
import {UIFormsModule} from "@solenopsys/ui-forms";
import {UIQrModule} from "@solenopsys/ui-qr";
import {createNgxs} from "@solenopsys/fl-storage";
import {RegisterComponent} from './register/register.component';

import {BootstrapComponent, UITemplatesModule, InterfaceState, MenuState, SetTabs} from "@solenopsys/ui-templates";
import {Store} from "@ngxs/store";

export const PROVIDERS_CONF = [
    {provide: "assets_dir", useValue: ""},
    {provide: "mod_name", useValue: "exhibition"},
    {provide: 'logo', useValue: "logo"},
];

const ROUTERS: Route[] = [
    {
        path: "",
        redirectTo: "status",
        pathMatch: 'full'
    },
    {
        path: "status",
        component: StatusComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    }

]

const PROVIDERS = [...PROVIDERS_CONF];

// noinspection AngularInvalidEntryComponent
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        StatusComponent,
        RegisterComponent,
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        BrowserModule.withServerTransition({appId: "solenopsys"}),
        BrowserModule,
        RouterModule.forRoot(ROUTERS, {initialNavigation: "enabledBlocking"}),
        UIQrModule,
        UIFormsModule,
        UIControlsModule,
        UITemplatesModule,
        ...createNgxs(!environment.production, [InterfaceState, MenuState], true),

    ],
    providers: PROVIDERS,
    bootstrap: [BootstrapComponent],
})
export class AppModule {
    constructor(store: Store, private http: HttpClient) {
        store.dispatch(new SetTabs(
            [
                {id: 'status', title: 'Status'},
                {id: 'login', title: 'Login'},
                {id: 'register', title: 'Register'}
            ]
        ))
    }
}
