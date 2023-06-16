import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideFirebaseApp, getApp, initializeApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { firebaseConfig } from "./firebase.config";

import { routes } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { TableState } from "./stores/states/table.state";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(NgxsModule.forRoot([TableState])),
    importProvidersFrom(NgxsReduxDevtoolsPluginModule.forRoot()),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(firebaseConfig))
    ),
    importProvidersFrom(provideFirestore(() => getFirestore(getApp()))),
  ],
};
