import { runInAction, makeAutoObservable } from "mobx";

import { getBlackList } from '../../generic/utils'


class BlackListStorage {
    blackList = []
    isLoading = true
    buttonText = 'Initialization...'

    constructor() {
        makeAutoObservable(this);
    }

    async init() {
        const blackList = await getBlackList();
        runInAction(() => {
            this.blackList = blackList;
            this.isLoading = false;
            this.buttonText = 'Save';
        });
    }

    setValue(index, value) {
        const blackList = [...this.blackList]
        blackList[index] = value
        this.blackList = blackList;
    }

    async addThisSite() {
        runInAction(() => {
            this.isLoading = true
        });
        const tabs = await chrome.tabs.query({
            active: true, windowId: chrome.windows.WINDOW_ID_CURRENT
        });
        const activeTab = tabs[0];
        const host = activeTab.url ? ((new URL(activeTab.url)).hostname) : activeTab.url
        runInAction(() => {
            this.blackList = [...this.blackList, host]
            this.isLoading = false;
        })
    }

    async save() {
        runInAction(() => {
            this.isLoading = true;
            this.buttonText = 'Saving';
        });

        const blackList = this.blackList.filter((row) => row);

        await chrome.storage.sync.set({blackList: blackList});
        await chrome.extension.getBackgroundPage().reloadSettings()
        runInAction(() => {
            this.buttonText = 'Saved'
        })

        await new Promise(resolve =>  setTimeout(resolve, 1500));
        runInAction(() => {
            this.buttonText = 'Save';
            this.isLoading = false;
            this.blackList = blackList
        })
    }
}


export const blackListStorage = new BlackListStorage();
