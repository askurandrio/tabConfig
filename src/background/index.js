/* global chrome */
import 'chrome-extension-async';
import {onChangeTab} from './onChangeTab';
import {onActivatedTab} from "./onActivatedTab";
import {reloadBlocklistSettings} from "./deleteNotInvitedSites";


window.reloadSettings = async () => {
	await reloadBlocklistSettings()
}


const onTabChange = tab => {
	onChangeTab();
	onActivatedTab(tab);
}


const onTabInfo = tabInfo => {
	chrome.tabs.get(tabInfo.tabId).then(tab => {
		onActivatedTab(tab)
	})
}


window.reloadSettings();
chrome.tabs.onCreated.addListener(onTabChange);
chrome.tabs.onUpdated.addListener((_, _1, tab) => onTabChange(tab));
chrome.tabs.onActivated.addListener(onTabInfo);
