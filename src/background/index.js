/* global chrome */
import 'chrome-extension-async';
import {onChangeTab} from './onChangeTab';
import {syncFunction} from '../generic/utils';
import {onActivatedTab} from "./onActivatedTab";
import {reloadBlocklistSettings} from "./deleteNotInvitedSites";


window.reloadSettings = async () => {
	await reloadBlocklistSettings()
}


const onTabChange = syncFunction(async tab => {
	await onChangeTab();
	await onActivatedTab(tab);
})


const onTabInfo = syncFunction(async tabInfo => {
	const tab = await chrome.tabs.get(tabInfo.tabId);
	await onActivatedTab(tab)
})


window.reloadSettings();
chrome.tabs.onCreated.addListener(onTabChange);
chrome.tabs.onUpdated.addListener(onTabChange);
chrome.tabs.onActivated.addListener(onTabInfo);
