import {getHistory} from "../generic/utils";


let queue = Promise.resolve()


const _onActivatedTab = async (tab) => {
    let activationHistory = await getHistory();
    activationHistory = activationHistory.filter(historyTab => historyTab.id !== tab.id)
    activationHistory = [tab, ...activationHistory];
    await chrome.storage.local.set({activationHistory});
}


export default function (tab) {
    queue = queue.then(() => _onActivatedTab(tab))
}
