import { AuthData, Resource } from './models';

export class SetAuthData {
    static readonly type = '[Auth] SetAuthData';

    constructor(public payload: AuthData) {}
}

export class SetAuthResources {
    static readonly type = '[Auth] SetAuthResources';

    constructor(public payload: Resource[]) {}
}