/* global chrome */

export const getBlocklist = async () => {
    const storage = await chrome.storage.sync.get(['blocklist']);
    return storage.blocklist || [];
};


export const getHistory = async () => {
    const storage = await chrome.storage.local.get(['history']);
    return storage.history || [];
};


export const syncFunction = (func) => {
    let queue = Promise.resolve()

    return (...args) => {
        queue = queue.then(() => {
            return func(...args)
        })
        return queue
    }
}
