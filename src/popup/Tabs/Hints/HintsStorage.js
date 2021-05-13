import {makeAutoObservable, runInAction} from "mobx";


class HintsStorage {
    hintsInfo = {}

    constructor() {
        makeAutoObservable(this);
    }

    async init() {
        const storage = await chrome.storage.local.get(['hintsInfo']);
        const storageHintsInfo = storage.hintsInfo || {};
        runInAction(() => {
            this.hintsInfo = storageHintsInfo
        })
    }

    async addHint(hint) {
        if (!hint) {
            return
        }

        const hits = this.hintsInfo[hint] || 0;
        this.hintsInfo = {
            ...this.hintsInfo,
            [hint]: hits + 1
        }
        await chrome.storage.local.set({hintsInfo: this.hintsInfo});
    }

    get hints() {
        let hints = Object.entries(this.hintsInfo);
        hints.sort((first, second) => {
            if (first[1] < second[1]) {
                return 1
            }
            if (first[1] > second[1]) {
                return -1
            }
            return 0
        })
        hints = hints.map(hint => hint[0])
        hints = hints.filter(hint => hint)
        return hints.slice(0, 10);
    }
}


export const hintsStorage = new HintsStorage();
