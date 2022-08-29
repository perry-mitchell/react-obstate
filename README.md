# React Obstate
> React hooks for the generic object state management library `obstate`

[![react-obstate](https://img.shields.io/npm/v/react-obstate?color=blue&label=react-obstate&logo=npm&style=flat-square)](https://www.npmjs.com/package/react-obstate) ![Tests](https://github.com/perry-mitchell/react-obstate/actions/workflows/test.yml/badge.svg)

[`obstate`](https://github.com/perry-mitchell/obstate) is a generic state management library that uses proxies to wrap objects to allow for easy state change notifications. These notifications are used in the hooks provided by this library so that `obstate` states can be used in React projects with ease. It's primarily designed to allow for a global state instance to be used both manually and via React components.

## Installation

Install by running: `npm install react-obstate obstate --save-dev`.

`obstate` is a peer dependency of this library.

## Usage

In your component simply import the hook you desire and pass a (global) `obstate` state instance to it:

```tsx
import React from "react";
import { createStateObject } from "obstate";
import { useSingleState } from "react-obstate";

const globalState = createStateObject({
    test: 100
});

export function ReactComponent(props) {
    const [currentValue, setValue] = useSingleState(globalState, "test");
    return (
        <div>
            <p>The current value is: {currentValue}</p>
            <button onClick={() => setValue(currentValue + 1)}>Increment</button>
        </div>
    );
}
```

The `useSingleState` hook allows for reading and updating a single property in an `obstate` instance.

You can also work with a full state object just as easily:

```tsx
import React from "react";
import { createStateObject } from "obstate";
import { useState } from "react-obstate";

const globalState = createStateObject({
    test: 100,
    on: false
});

export function ReactComponent(props) {
    const [state, setPartial /*, setFull */] = useState(globalState);
    return (
        <div>
            <p>The current value is: {state.test}</p>
            <p>Power is <strong></strong></p>
            <button onClick={() => setPartial({ test: state.test + 1 })}>Increment</button>
            <button onClick={() => setPartial({ on: !state.on })}>Toggle</button>
        </div>
    );
}
```

The `useState` hook allows for reading and updating an entire `obstate` instance. The first parameter returned is the full state value at the current point in time (minus the `obstate` event emitter interface). The second is a partial-update method and the third is a full-update method.

Partial updates allow for specifying only the properties you wish to update, whereas full updates completely rewrite the state object.
