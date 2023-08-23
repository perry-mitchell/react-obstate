import { useCallback, useEffect, useMemo, useState as useReactState } from "react";
import { State } from "./types.js";

/**
 * Read and update a single property in state
 * @param state The obstate instance.
 * @param property The name of the property to read and write.
 * @returns An array containing the current state value, and an
 *  update helper function to set the new state value.
 */
export function useSingleState<T extends State, K extends keyof T>(
    state: T,
    property: K
): [T[K], (newValue: T[K]) => void] {
    const [currentValue, setCurrentValue] = useReactState(state[property]);
    const setNewValue = useCallback(
        (newValue: T[K]) => {
            state[property] = newValue;
        },
        [state]
    );
    useEffect(() => {
        const onChange = ({ property: updatedProperty, newValue }) => {
            if (updatedProperty === property) {
                setCurrentValue(newValue);
            }
        };
        // Set property to avoid race condition where we miss it
        setCurrentValue(state[property]);
        // Listen for changes
        state.on("update", onChange);
        return () => {
            state.off("update", onChange);
        };
    }, [state]);
    return [currentValue, setNewValue];
}

/**
 * Read and update an entire obstate instance
 * @param state The obstate instance
 * @returns An array containing the current state value (minus
 *  the event emitter interface), a partial update function and
 *  a full update function. Partial updates allow for updating
 *  only specified properties whereas full updates completely
 *  rewrite the entire state.
 */
export function useState<T extends State>(
    state: T
): [T, (partialState: Partial<T>) => void, (fullState: T) => void] {
    const initialState = useMemo(() => ({ ...state }), []);
    const [currentState, setNewState] = useReactState(initialState);
    const setPartialState = useCallback(
        (stateUpdate: Partial<T>) => {
            Object.assign(state, stateUpdate);
        },
        [state]
    );
    const setFullState = useCallback(
        (stateUpdate: T) => {
            Object.assign(state, stateUpdate);
            for (const key in currentState) {
                if (!(key in stateUpdate)) {
                    delete state[key];
                }
            }
        },
        [currentState]
    );
    useEffect(() => {
        const onChange = () => {
            setNewState({
                ...state
            });
        };
        onChange();
        state.on("update", onChange);
        return () => {
            state.off("update", onChange);
        };
    }, [state]);
    return [currentState, setPartialState, setFullState];
}
