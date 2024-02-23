export interface AuthData {
    firstName: string;
    lastName: string;
    token: TokenData;
}

interface TokenData {
    TOKEN: string;
    expiresHuman: string;
    expiresUnix: string;
    webapiVersion: string;
}

export interface ApiVersion {
    apiVersion: string;
}

export interface Resource {
    name: string;
    actions: string[];
}