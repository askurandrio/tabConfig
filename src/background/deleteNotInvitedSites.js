import {getBlocklist} from "../generic/utils";


let blocklist = [];


const isHostBlocked = (host) => {
	return blocklist.includes(host)
}


export const reloadBlocklistSettings = async () => {
	blocklist = await getBlocklist();
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
