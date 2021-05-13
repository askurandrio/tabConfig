import {tabComparator} from './utils'


export const groupTabs = async () => {
    console.log('groupTabs started');

	for(const window of await chrome.windows.getAll({})) {
		const tabs = await chrome.tabs.query({windowId: window.id});
		tabs.sort((firstTab, secondTab) => {
			return tabComparator(
				(first, second) => first.localCompare(second),
				firstTab,
				secondTab
			)
		});

		for(const [index, tab] of tabs.entries()) {
			if (tab.index === index) {
				continue;
			}
			try {
				await chrome.tabs.move(tab.id, {index});
			} catch (ex) {
				console.error([ex, tab]);
			}

		}
	}

    console.log('groupTabs done');
}
