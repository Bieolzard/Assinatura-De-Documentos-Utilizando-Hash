// utils/promisePolyfill.ts

declare global {
    interface PromiseConstructor {
        withResolvers<T>(): PromiseWithResolvers<T>;
    }
}

interface PromiseWithResolvers<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

if (!Promise.withResolvers) {
    Promise.withResolvers = function createPromiseWithResolvers<T>(): PromiseWithResolvers<T> {
        let resolve: (value: T | PromiseLike<T>) => void;
        let reject: (reason?: any) => void;
        const promise = new Promise<T>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve: resolve!, reject: reject! };
    };
}

export {};
