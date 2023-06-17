import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideFirebaseApp, getApp, initializeApp } from "@angular/fire/app";
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from "@angular/fire/firestore";
import { firebaseConfig } from "./firebase.config";
import { getAuth, connectAuthEmulator, provideAuth } from "@angular/fire/auth";
import { routes } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { TableState } from "./stores/states/table.state";
import { AuthState } from "./stores/states/auth.state";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(NgxsModule.forRoot([TableState, AuthState])),
    importProvidersFrom(NgxsReduxDevtoolsPluginModule.forRoot()),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(firebaseConfig))
    ),
    importProvidersFrom(
      provideFirestore(() => {
        const firestore = getFirestore();
        connectFirestoreEmulator(firestore, "localhost", 8080);
        return firestore;
      })
    ),
    importProvidersFrom(
      provideAuth(() => {
        const auth = getAuth();
        connectAuthEmulator(auth, "http://localhost:9099");
        return auth;
      })
    ),
  ],
};
