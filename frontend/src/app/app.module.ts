import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorPageComponent } from './layout/error-page/error-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialSharedModule } from './shared/material-shared.module/material-shared.module';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppState } from './store/app.state';
import { SnackBarMessageComponent } from './shared/components/snack-bar-message/snack-bar-message.component';
import { NotificationService } from './shared/notification.service';
import { DialogConfirmComponent } from './shared/components/dialog-confirm/dialog-confirm.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

// Modules array
const angularMaterialModules = [
  BrowserModule,
  HttpClientModule,
  AppRoutingModule,
  LayoutModule,
  BrowserAnimationsModule,
  MaterialSharedModule,
  NgxsModule.forRoot([AppState]),
  NgxsReduxDevtoolsPluginModule.forRoot(),
];

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    SnackBarMessageComponent,
    DialogConfirmComponent,
  ],
  imports: [
    ...angularMaterialModules, // Importing Modules
  ],
  providers: [
    NotificationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
