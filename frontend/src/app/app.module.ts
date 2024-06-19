import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NGXS_PLUGINS, NgxsModule } from '@ngxs/store';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorPageComponent } from './layout/error-page/error-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialSharedModule } from './shared/material-shared.module/material-shared.module';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AppState } from './store/app.state';
import { SnackBarMessageComponent } from './shared/components/snack-bar-message/snack-bar-message.component';
import { NotificationService } from './shared/services';
import { DialogConfirmComponent } from './shared/components/dialog-confirm/dialog-confirm.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { SharedModule } from './shared/shared.module';
import { ClearStatePlugin } from './store/clear-state-plugin.service';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

// Modules array
const angularModules = [
  BrowserModule,
  HttpClientModule,
  AppRoutingModule,
  LayoutModule,
  BrowserAnimationsModule,
  MaterialSharedModule,
];

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    SnackBarMessageComponent,
    DialogConfirmComponent,
  ],
  imports: [
    ...angularModules,
    SharedModule,
    NgxsModule.forRoot([AppState], {
      developmentMode: true, // For production, you need to set it to - false
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [
    NotificationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: NGXS_PLUGINS, useClass: ClearStatePlugin, multi: true },
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
