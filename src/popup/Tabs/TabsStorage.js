import { runInAction, makeAutoObservable } from "mobx";


class TabsFilter {
    async init(query) {
        this.query = query;
        this.currentWindow = await chrome.windows.getCurrent()
    }

    apply(tabs) {
        if(!this.query) {
            return tabs
        };

        tabs = tabs.map((tab) => this._addAttributesToTab(tab));
        tabs = tabs.filter(tab => this._filterTab(tab));
        tabs.sort((first, second) => {
            if(first.matchesTitle && second.matchesTitle) {
                if(first.matchesRawTitle && second.matchesRawTitle) {
                    return 0
                }
                if(first.matchesRawTitle) {
                    return -1
                }
                return 1
            }
            if(first.matchesTitle) {
                return -1
            }
            return 1
        })
        return tabs
    }

    _filterTab(tab) {
        if(tab.matchesTitle || tab.matchesUrl) {
            return true;
        }
        if(
            this.query.startsWith(':a') &&
            tab.active &&
            (tab.windowId == this.currentWindow.id)
        ) {
            return true
        }
        if(this.query.startsWith(':p') && tab.audible){
            return true
        }
        return false
    }

    _addAttributesToTab(tab) {
        tab.matchesTitle = tab.title && tab.title.toLowerCase().includes(this.query.toLowerCase());
        tab.matchesRawTitle = tab.title && tab.title.includes(this.query);
        tab.matchesUrl = tab.url && tab.url.includes(this.query);
        return tab
    }
}


class TabsStorage {
    tabs = []
    query = ''

    constructor() {
        makeAutoObservable(this);
    }

    setQuery(query) {
        this.query = query;
        this.refreshTabs();
    }

    async refreshTabs() {
        const allTabs = await chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT});
        const tabFilter = new TabsFilter();
        await tabFilter.init(this.query);
        const filteredTabs = tabFilter.apply(allTabs);
        runInAction(() => {
            this.tabs = filteredTabs
        })
    }
}


export const tabsStorage = new TabsStorage();
