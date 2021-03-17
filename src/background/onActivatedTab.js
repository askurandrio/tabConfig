import {getHistory, syncFunction} from "../generic/utils";


export const onActivatedTab = syncFunction(async (tab) => {
    let history = await getHistory();
    history = history.filter(historyTab => {
        return historyTab.url !== tab.url
    });
    history = history.slice(0, 1000);
    history = [tab, ...history];
    await chrome.storage.local.set({history});
})
