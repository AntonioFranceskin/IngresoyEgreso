import { Action, createReducer, on } from '@ngrx/store';
import * as accion  from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
    user: Usuario; 
}

export const initialState: State = {
   user: null,
}

const _authReducer = createReducer(initialState,

    on( accion.setUser, (state, { user }) => ({ ...state, user: { ...user }  })),
    on( accion.unSetUser, state => ({ ...state, user: null  })),

);

export function authReducer(state: State, action: Action) {
    return _authReducer(state, action);
}