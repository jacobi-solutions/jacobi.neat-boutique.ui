import { Route } from "@angular/router";

// ====================================================================== types
export type FirebaseConfig = {
    apiKey: string,
    authDomain: string,
};

export type AuthSplitScreenVersionConfig = {
    images: {
        signIn?: string,
        signUp?: string,
        resetPasswordInit?: string,
        resetPasswordFinal?: string,
        changeEmailInit?: string,
        changeEmailFinal?: string,
        deleteAccountInit?: string,
        deleteAccountFinal?: string
    },
};


// ====================================================================== interface
export interface IAuthConfig {
    // required
    firebaseConfig: FirebaseConfig;
    appUiBaseUrl: string;
    appApiBaseUrl: string;
    signInRedirectUrl: string;
    signUpRedirectUrl: string;
    unauthenticatedRedirect: string;

    // optional
    logoUrl?: string;
    appSharedComponents?: any;
    legalLinks?: { privacyPolicy: string, termsAndConditions: string };
    hasFacebookButton?: boolean;
    hasAppleButton?: boolean;
    appleClientId?: string;
    splitScreenOptions?: AuthSplitScreenVersionConfig;
};


// ====================================================================== class
export class AuthConfig implements IAuthConfig {
    // required
    public firebaseConfig: FirebaseConfig;
    public appUiBaseUrl: string;
    public appApiBaseUrl: string;
    public signInRedirectUrl: string = '/';
    public signUpRedirectUrl: string = '/';
    public unauthenticatedRedirect: string = '/';
    // optional
    public legalLinks: { privacyPolicy: string, termsAndConditions: string };
    public logoUrl: string;
    public appSharedComponents: any;
    public splitScreenOptions: AuthSplitScreenVersionConfig;
    public hasFacebookButton: boolean;
    public hasAppleButton: boolean;
    public appleClientId: string;

    constructor(appConfig?: IAuthConfig) {
        if (appConfig) {
            for (var property in appConfig) {
                if (appConfig.hasOwnProperty(property))
                    (<any>this)[property] = (<any>appConfig)[property];
            }
        }
    }
};