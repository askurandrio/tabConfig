import {getHistory, syncFunction} from "../generic/utils";


export const onActivatedTab = syncFunction(async (tab) => {
    let history = await getHistory();
    history = history.filter(historyTab => {
        if(historyTab.id !== tab.id) {
            return true
        }
        if(historyTab.url !== tab.url) {
            return true
        }
        return false
    });
    history = history.slice(0, 1000);
    history = [tab, ...history];
    await chrome.storage.local.set({history});
})
