import {TextGroupByPatchResolver, TextPageGroupComponent} from "@solenopsys/ui-publications";
import {NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {createNgxs} from "@solenopsys/fl-storage";
import {LoginComponent} from "./login/login.component";



@NgModule({
    declarations: [
        AppComponent,
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
                children: [{
                    path: "",
                    component: MainPageComponent
                }]
            }, {
                path: "login",
                component: LoginComponent
            }
        ], { initialNavigation: "enabledBlocking" }),

        ...createNgxs(!environment.production, [], true),
        UiFormsModule
    ],
    providers: [{ provide: "assets_dir", useValue: "" }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
