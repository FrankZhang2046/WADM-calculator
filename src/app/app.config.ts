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
import { environment } from "../environments/environment";
import { HttpClientModule, provideHttpClient } from "@angular/common/http";
import { ApplicationState } from "./stores/states/app.state";
import {
  connectStorageEmulator,
  getStorage,
  provideStorage,
} from "@angular/fire/storage";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(
      NgxsModule.forRoot([TableState, AuthState, ApplicationState]),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideStorage(() => {
        const firebaseStorage = getStorage();
        if (!environment.production) {
          connectStorageEmulator(firebaseStorage, "localhost", 9199);
        }
        return firebaseStorage;
      }),
      provideFirestore(() => {
        const firestore = getFirestore();
        if (!environment.production) {
          connectFirestoreEmulator(firestore, "localhost", 8080);
        }
        return firestore;
      }),
      provideAuth(() => {
        const auth = getAuth();
        if (!environment.production) {
          connectAuthEmulator(auth, "http://localhost:9099", {
            disableWarnings: true,
          });
        }
        return auth;
      })
    ),
  ],
};
