/* global chrome */

import React, {useState} from 'react';
import {makeLoader, useAsyncInit} from "./utils";
import {getBlocklist} from "../generic/utils";


export default function Blacklist() {
    const [blocklist, setBlockList] = useState([]);
    useAsyncInit(async () => {
        const settingsBlocklist = await getBlocklist();
        setBlockList(settingsBlocklist);
        setButtonText('Save');
    });
    const [buttonText, setButtonText] = useState('Initialization...');

    return (
        <div className="blacklist">
            <button
                onClick={async () => {
                    setButtonText('Saving');
                    const filteredBlocklist = blocklist.filter((row) => row);
                    await chrome.storage.sync.set({blocklist: filteredBlocklist});
                    await chrome.extension.getBackgroundPage().reloadSettings()
                    setBlockList(filteredBlocklist);
                    setButtonText('Saved');
                    await new Promise(resolve =>  setTimeout(resolve, 1500));
                    setButtonText('Save');
                }}
                disabled={buttonText !== 'Save'}
            >
                {buttonText} {(buttonText === 'Save') ? '': makeLoader()}
            </button>
            {
                blocklist.map((row, idx) => {
                    return (
                        <div key={idx}>
                            <input
                                value={row}
                                onChange={
                                    event => {
                                        const changedBlocklist = [...blocklist];
                                        changedBlocklist[idx] = event.target.value;
                                        setBlockList(changedBlocklist);
                                    }
                                }
                            />
                        </div>
                    )
                })
            }
            <button
                onClick={() => setBlockList([...blocklist, ''])}
                disabled={buttonText !== 'Save'}
            >
                Add
            </button>
            <button
                onClick={async () => {
                    const tabs = await chrome.tabs.query({
                        active: true, windowId: chrome.windows.WINDOW_ID_CURRENT
                    });
                    const activeTab = tabs[0];
                    const host = activeTab.url ? ((new URL(activeTab.url)).hostname) : activeTab.url
                    setBlockList([...blocklist, host])
                }}
                disabled={buttonText !== 'Save'}
            >
                Add this site
            </button>
        </div>
    )
}
