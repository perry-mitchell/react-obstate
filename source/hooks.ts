import { useCallback, useEffect, useMemo, useState as useReactState } from "react";
import { State } from "./types.js";

export function useSingleState<T extends State, K extends keyof T>(
    state: T,
    property: K
): [T[K], (newValue: T[K]) => void] {
    const [currentValue, setCurrentValue] = useReactState(state[property]);
    const setNewValue = useCallback((newValue: T[K]) => {
        state[property] = newValue;
    }, [state]);
    useEffect(() => {
        const onChange = ({ property: updatedProperty, newValue }) => {
            if (updatedProperty === property) {
                setCurrentValue(newValue);
            }
        };
        state.on("update", onChange);
        return () => {
            state.off("update", onChange);
        };
    }, [state]);
    return [currentValue, setNewValue];
}

export function useState<T extends State>(state: T) {
    const initialState = useMemo(() => ({ ...state }), []);
    const [currentState, setNewState] = useReactState(initialState);
    const setPartialState = useCallback((stateUpdate: Partial<T>) => {
        Object.assign(state, stateUpdate);
    }, [state]);
    useEffect(() => {
        const onChange = () => {
            // Easiest to just update the entire state object here
            setNewState({
                ...state
            });
        };
        state.on("update", onChange);
        return () => {
            state.off("update", onChange);
        };
    }, [state]);
    return [currentState, setPartialState];
}
