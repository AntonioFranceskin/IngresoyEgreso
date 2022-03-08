import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';
//  Se  puede  ir  añadiendo  nuevos estados  que  necesiten otros  componentes
//  Este  es  el  AppState  global de  la  aplicación  y  es  el  que  se  configura en el app.module.ts
export interface AppState {
   ui: ui.State,
   user: auth.State
}
export const appReducers: ActionReducerMap<AppState> = {
   ui: ui.uiReducer,
   user: auth.authReducer
}