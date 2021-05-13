import {tabComparator} from './utils'
import {getHistory, syncFunction} from "../generic/utils";


export const onActivatedTab = syncFunction(async (tab) => {
    let history = await getHistory();

    history = history.filter(historyTab => {
        return tabComparator(
            (first, second) => first !== second,
            tab,
            historyTab
        )
    });
    history = [tab, ...history];
    history = history.slice(0, 1000);

    await chrome.storage.local.set({history});
})
