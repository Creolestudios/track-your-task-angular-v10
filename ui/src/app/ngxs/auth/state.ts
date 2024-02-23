import { State, Action, StateContext, Selector } from '@ngxs/store';

import { AuthData, Resource } from './models';

import { SetAuthData, SetAuthResources } from './actions';


export class AuthDataModel {
    token: AuthData;
    resources: Resource[];
}


@State<AuthDataModel>({
    name: 'auth',
    defaults: {
        token: null,
        resources: []
    }
})

export class AuthState {
    @Selector()
    static getAuthResponse(state: AuthDataModel) {
        return state.token;
    }

    @Action(SetAuthData)
    setAuthData({getState, patchState }: StateContext<AuthDataModel>, { payload }: SetAuthData) {
        const state = getState();
        const authData = {...state.token, ...payload};

        patchState({ token: authData });
    }

    @Action(SetAuthResources)
    setAuthResources({ patchState }: StateContext<AuthDataModel>, { payload }: SetAuthResources) {
        patchState({ resources: [...payload] });
    }
}
