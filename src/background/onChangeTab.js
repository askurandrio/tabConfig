/* global chrome */

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


let blocklist = [];


const isHostBlocked = (host) => {
	return blocklist.includes(host)
}

export const setBlocklist = async (newBlocklist) => {
	blocklist = newBlocklist;
	await deleteNotInvitedSites();
}


const deleteNotInvitedSites = async () => {
    console.log('deleteNotInvitedSites started');
	const tabs = await chrome.tabs.query({});
	tabs.sort(tabComparator);
	for(const tab of tabs) {
		if(!tab.url) {
			continue
		}
		if(!isHostBlocked(new URL(tab.url).host)) {
			continue
		}
		await chrome.tabs.remove(tab.id);
	}

    console.log('deleteNotInvitedSites done');
}

const deleteDuplicatedTabs = async () => {
    console.log('deleteDuplicatedTabs started');

	for(const window of await chrome.windows.getAll({})) {
		let tabs = await chrome.tabs.query({windowId: window.id});
		tabs.sort(tabComparator);

		while(tabs.length) {
			const currentTab = tabs[0];
			const duplicatedTabs = tabs.filter((tab) => tab.url === currentTab.url);
			tabs = tabs.filter((tab) => tab.url !== currentTab.url);
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
					await chrome.tabs.remove([tab.id]);
				} catch (ex) {
					console.error([ex, tab]);
				}
			}
		}
	}

    console.log('deleteDuplicatedTabs done');
}


const groupTabs = async () => {
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
};


const organizeTabs = async () => {
	await deleteNotInvitedSites();
	await deleteDuplicatedTabs();
	await groupTabs();
}


let queue = Promise.resolve();

chrome.alarms.onAlarm.addListener((alarm) => {
	if(alarm.name !== 'onAction') {
		return
	}
	queue = queue.then(() => organizeTabs())
});


const onAction = async () => {
	const existingAlarm = await chrome.alarms.get('onAction');
	if(existingAlarm) {
		await chrome.alarms.clear('onAction')
	}
	chrome.alarms.create('onAction', {when: Date.now() + 1250})
}


export const onChangeTab = () => {
	queue = queue.then(() => onAction())
}
