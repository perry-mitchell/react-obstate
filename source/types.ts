import { EventEmitter, Events } from "obstate";

export type State = Record<string, any> & EventEmitter<Events>;
