/* global chrome */
import {onChangeTab, setBlocklist} from './onChangeTab';
import {getBlocklist} from '../generic/utils';


window.reloadSettings = async () => {
	const blocklist = await getBlocklist();
	await setBlocklist(blocklist);
}


window.reloadSettings();
chrome.tabs.onCreated.addListener(onChangeTab);
chrome.tabs.onUpdated.addListener(onChangeTab);
