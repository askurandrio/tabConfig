const tabComparator = (firstTab, secondTab) => {
	const firstTabUrl = firstTab.url || '';
	const secondTabUrl = secondTab.url || '';
	if((!firstTabUrl) || (!secondTabUrl)) {
		return firstTabUrl.localeCompare(secondTabUrl)
	}
	if (new URL(firstTabUrl).host !== new URL(secondTabUrl).host) {
		return firstTabUrl.localeCompare(secondTabUrl)
	}
	const firstTabTitle = firstTab.title || '';
	const secondTabTitle = secondTab.title || '';
	return firstTabTitle.localeCompare(secondTabTitle)
}


export const groupTabs = async () => {
    console.log('groupTabs started');

	for(const window of await chrome.windows.getAll({})) {
		const tabs = await chrome.tabs.query({windowId: window.id});
		tabs.sort(tabComparator);
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
