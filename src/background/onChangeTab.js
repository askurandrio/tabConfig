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


const [isHostBlocked, setBlocklist] = (() => {
	let blocklist = [];

	const isHostBlocked = (host) => {
		return blocklist.includes(host)
	}

	const setBlocklist = async (newBlocklist) => {
		blocklist = newBlocklist;
		await deleteNotInvitedSites();
	}

	return [isHostBlocked, setBlocklist]
})();


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
		await new Promise(resolve => {
			chrome.tabs.remove(tab.id, resolve);
		})
	}

    console.log('deleteNotInvitedSites done');
}

const deleteDuplicatedTabs = async () => {
    console.log('deleteDuplicatedTabs started');
	let tabs = await chrome.tabs.query({});
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
		const tabIdsForRemove = duplicatedTabs.slice(1).map(tab => tab.id);
		await new Promise(resolve => {
			chrome.tabs.remove(tabIdsForRemove, resolve);
		})
	}

    console.log('deleteDuplicatedTabs done');
}


const groupTabs = async () => {
    console.log('groupTabs started');
	for(const window of await chrome.windows.getAll({})) {
		const tabs = await chrome.tabs.query({windowId: window.id});
		tabs.sort(tabComparator);
		for(const [index, tab] of tabs.entries()) {
			if (tab.index == index) {
				continue;
			}
			await new Promise((resolve) => {
				chrome.tabs.move(tab.id, {index}, () => resolve())
			});
		}
	}
    console.log('groupTabs done');
};


const organizeTabs = async () => {
	await deleteNotInvitedSites();
	await deleteDuplicatedTabs();
	await groupTabs();
}


const onChangeTab = (() => {
	let queue = Promise.resolve();

	chrome.alarms.onAlarm.addListener((alarm) => {
		if(alarm.name !== 'onAction') {
			return
		}
		queue = queue.then(() => organizeTabs())
	})

	const onAction = async () => {
		const existingAlarm = await new Promise((resolve) => {
			chrome.alarms.get('onAction', resolve)
		});
		if(existingAlarm) {
			await new Promise((resolve) => {
				chrome.alarms.clear('onAction', resolve)
			});
		}
		chrome.alarms.create('onAction', {when: Date.now() + 1250})
	}

	const addOnActionToQueue = () => {
		queue = queue.then(() => onAction())
	}

	addOnActionToQueue();
	return addOnActionToQueue;
})();


export {
	onChangeTab,
	setBlocklist
};
