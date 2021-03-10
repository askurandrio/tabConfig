/* global chrome */
import 'chrome-extension-async';
import {onChangeTab, setBlocklist} from './onChangeTab';
import {getBlocklist} from '../generic/utils';
import onActivatedTab from "./onActivatedTab";


window.reloadSettings = async () => {
	const blocklist = await getBlocklist();
	await setBlocklist(blocklist);
}


const onTabChange = tab => {
	onChangeTab();
	onActivatedTab(tab);
}


window.reloadSettings();
chrome.tabs.onCreated.addListener(onTabChange);
chrome.tabs.onUpdated.addListener(onTabChange);
chrome.tabs.onActivated.addListener((tabInfo) => onTabChange({id: tabInfo.tabId}));
