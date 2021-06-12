import { runInAction, makeAutoObservable, autorun } from "mobx";


class TabsFilter {
    constructor(query, currentWindow) {
        this.query = query;
        this.currentWindow = currentWindow
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

    constructor() {
        makeAutoObservable(this);
    }

    isTabExists(tab) {
        const tabs = this.tabs.filter(storageTab => storageTab.id == tab.id);
        if(!tabs.length) {
            return false;
        }

        const storageTab = tabs[0];
        if(
            (tab.url && new URL(tab.url).host) !==
            (storageTab.url && new URL(storageTab.url).host)
        ) {
            return false;
        }

        return true;
    }

    async refreshTabs() {
        const tabs = await chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT});
        runInAction(() => {
            this.tabs = tabs
        })
    }
}


class FilteredTabsStorage {
    tabsStorage = null;
    currentWindow = null;
    query = ''
    tabs = [];

    constructor(tabsStorage) {
        this.tabsStorage = tabsStorage;
        makeAutoObservable(this);

        chrome.windows.getCurrent().then(currentWindow => {
            runInAction(() => {
                this.currentWindow = currentWindow
            })
        })

        autorun(() => {
            const tabFilter = new TabsFilter(this.query, this.currentWindow);
            this.tabs = tabFilter.apply(this.tabsStorage.tabs)
        })
    }

    setQuery(query) {
        this.query = query;
        this.refreshTabs();
    }
}


export const tabsStorage = new TabsStorage();
export const filteredTabsStorage = new FilteredTabsStorage(tabsStorage);
