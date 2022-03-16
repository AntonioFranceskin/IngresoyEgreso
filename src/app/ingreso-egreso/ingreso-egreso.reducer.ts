import { Action, createReducer, on } from '@ngrx/store';
import * as accion  from './ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso';

export interface State {
    items: IngresoEgreso[]; 
}

export const initialState: State = {
   items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,

    on( accion.setItems, (state, { items }) => ({ ...state, items:  [...items]  })),
    on( accion.unSetItems, state => ({ ...state, items: []  }))
);


export function ingresoEgresoReducer(state: State, action: Action) {
    return _ingresoEgresoReducer(state, action);
}