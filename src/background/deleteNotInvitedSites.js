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
	const regex = new RegExp(
		`[${String.fromCharCode(1072)}-${String.fromCharCode(1103)}]`,
		'g'
	)
	const tabs = await chrome.tabs.query({});

	for(const tab of tabs) {
		if(!tab.title) {
			continue
		}
		if(!tab.title.toLowerCase().match(regex)) {
			continue
		}
		await chrome.tabs.remove(tab.id);
	}

    console.log('deleteNotInvitedSites done');
}
