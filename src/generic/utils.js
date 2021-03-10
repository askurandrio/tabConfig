/* global chrome */

export const getBlocklist = async () => {
    const storage = await chrome.storage.sync.get(['blocklist']);
    return storage.blocklist || [];
};


export const getHistory = async () => {
    const storage = await chrome.storage.local.get(['activationHistory']);
    return storage.activationHistory || [];
};
