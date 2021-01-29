/* global chrome */

const getBlocklist = async () => {
    const storage = await new Promise(resolve => {
        chrome.storage.sync.get(['blocklist'], resolve)
    });
    return storage.blocklist || [];
};


export {
    getBlocklist
};
