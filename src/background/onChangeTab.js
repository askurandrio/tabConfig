/* global chrome */

import {syncFunction} from "../generic/utils";
import {deleteNotInvitedSites} from "./deleteNotInvitedSites";
import {deleteDuplicatedTabs} from "./deleteDuplicatedTabs";
import {groupTabs} from "./groupTabs";


const organizeTabs = syncFunction(async () => {
	await deleteNotInvitedSites();
	await deleteDuplicatedTabs();
	await groupTabs();
});


chrome.alarms.onAlarm.addListener((alarm) => {
	if(alarm.name !== 'onAction') {
		return
	}
	organizeTabs();
});


export const onChangeTab = syncFunction(async () => {
	const existingAlarm = await chrome.alarms.get('onAction');
	if(existingAlarm) {
		await chrome.alarms.clear('onAction')
	}
	chrome.alarms.create('onAction', {when: Date.now() + 1250})
})
