import { act, renderHook } from "@testing-library/react";
import { expect } from "chai";
import { createStateObject } from "obstate";
import { useSingleState, useState } from "../dist/hooks.js";

describe("hooks", function () {
    const INITIAL_STATE = {
        value: 123,
        test: true
    };

    beforeEach(function () {
        this.state = createStateObject({
            ...INITIAL_STATE
        });
    });

    describe("useSingleState", function () {
        beforeEach(function () {
            this.hook = null;
        });

        async function renderSingle() {
            await act(async () => {
                this.hook = renderHook(() => useSingleState(this.state, "value"));
            });
        }

        it("returns state value", async function () {
            await renderSingle.call(this);
            expect(this.hook.result.current[0]).to.equal(123);
        });

        it("updates value for state change", async function () {
            await renderSingle.call(this);
            this.state.value *= 2;
            await renderSingle.call(this);
            expect(this.hook.result.current[0]).to.equal(246);
        });

        it("returns update function", async function () {
            await renderSingle.call(this);
            const updateState = this.hook.result.current[1];
            expect(updateState).to.be.a("function");
            updateState(1);
            await renderSingle.call(this);
            expect(this.hook.result.current[0]).to.equal(1);
        });
    });

    describe("useState", function () {
        beforeEach(function () {
            this.hook = null;
        });

        async function renderFull() {
            await act(async () => {
                this.hook = renderHook(() => useState(this.state));
            });
        }

        it("returns full state object", async function () {
            await renderFull.call(this);
            expect(this.hook.result.current[0]).to.deep.equal(INITIAL_STATE);
        });

        it("returns partial-update function", async function () {
            await renderFull.call(this);
            const updateState = this.hook.result.current[1];
            expect(updateState).to.be.a("function");
            updateState({
                test: false
            });
            await renderFull.call(this);
            expect(this.hook.result.current[0]).to.deep.equal({
                ...INITIAL_STATE,
                test: false
            });
        });

        it("returns full-update function", async function () {
            await renderFull.call(this);
            const updateState = this.hook.result.current[2];
            expect(updateState).to.be.a("function");
            updateState({
                test: false
            });
            await renderFull.call(this);
            expect(this.hook.result.current[0]).to.deep.equal({
                test: false
            });
        });
    });
});
