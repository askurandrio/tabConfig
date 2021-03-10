/* global chrome */
import 'chrome-extension-async';
import {onChangeTab, setBlocklist} from './onChangeTab';
import {getBlocklist, syncFunction} from '../generic/utils';
import {onActivatedTab} from "./onActivatedTab";


window.reloadSettings = async () => {
	const blocklist = await getBlocklist();
	await setBlocklist(blocklist);
}


const onTabChange = syncFunction(async tab => {
	await onChangeTab();
	await onActivatedTab(tab);
})


const onTabInfo = syncFunction(async tabInfo => {
	const tab = await chrome.tabs.get(tabInfo.tabId);
	await onTabChange(tab)
})


window.reloadSettings();
chrome.tabs.onCreated.addListener(onTabChange);
chrome.tabs.onUpdated.addListener(onTabChange);
chrome.tabs.onActivated.addListener(onTabInfo);
