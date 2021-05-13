/* global chrome */
import 'chrome-extension-async';
import {onChangeTab} from './onChangeTab';
import {onActivatedTab} from "./onActivatedTab";
import {deleteNotInvitedSites, reloadBlackListSettings} from "./deleteNotInvitedSites";
import {syncFunction} from "../generic/utils";


window.reloadSettings = async () => {
	await reloadBlackListSettings()
}


const onTabChange = syncFunction(async tab => {
	await deleteNotInvitedSites();
	await onChangeTab();
	await onActivatedTab(tab);
})


const onTabInfo = tabInfo => {
	chrome.tabs.get(tabInfo.tabId).then(tab => {
		onActivatedTab(tab)
	})
}


window.reloadSettings();
chrome.tabs.onCreated.addListener(onTabChange);
chrome.tabs.onUpdated.addListener((_, _1, tab) => onTabChange(tab));
chrome.tabs.onActivated.addListener(onTabInfo);
