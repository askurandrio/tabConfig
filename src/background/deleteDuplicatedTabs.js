import {tabComparator} from './utils'


export const deleteDuplicatedTabs = async () => {
    console.log('deleteDuplicatedTabs started');

	for(const window of await chrome.windows.getAll({})) {
		let tabs = await chrome.tabs.query({windowId: window.id});

		while(tabs.length) {
			const duplicatedTabs = tabs.filter(tab => {
				return tabComparator(
					(first, second) => first === second,
					tabs[0],
					tab
				)
			});
			if(duplicatedTabs.length === 1) {
				continue
			}
			duplicatedTabs.sort((first, second) => {
				if(first.active) {
					return -1
				}
				if(first.audible && (!second.active)) {
					return -1
				}
				return 1
			});
			for(const tab of duplicatedTabs.slice(1)) {
				try {
					await chrome.tabs.remove(tab.id);
				} catch (ex) {
					console.error([ex, tab]);
				}
			}
		}
	}

    console.log('deleteDuplicatedTabs done');
}
