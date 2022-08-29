import { EventEmitter, Events } from "obstate";

export type State = Record<string, unknown> & EventEmitter<Events>;
