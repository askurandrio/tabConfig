import {getBlackList} from "../generic/utils";


let blackList = [];


const isHostBlocked = (host) => {
	return blackList.includes(host)
}


export const reloadBlackListSettings = async () => {
	blackList = await getBlackList();
	await deleteNotInvitedSites();
}


export const deleteNotInvitedSites = async () => {
    console.log('deleteNotInvitedSites started');

	const tabs = await chrome.tabs.query({});
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
