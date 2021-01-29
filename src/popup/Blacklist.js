/* global chrome */

import React, {useEffect, useState} from 'react';
import {makeLoader} from "./utils";


function SaveButton(props) {
    const [saveText, setSaveText] = useState('Initialization...');

    useEffect(
         () => {
            if(saveText === 'Initialization...') {
                props.read().then(() => setSaveText('Save'));
                return
            }
            if(saveText === 'Saving') {
                props.save().then(() => props.read()).then(() => setSaveText('Saved'));
                return;
            }
            if(saveText === 'Saved') {
                setTimeout(() => setSaveText('Save'), 1000)
                return;
            }
        },
        [saveText]
    )

    return (
        <button onClick={() => setSaveText('Saving')} disabled={saveText !== 'Save'}>
            {saveText} {['Initialization...', 'Saving'].includes(saveText) ? makeLoader(): ''}
        </button>
    )
}


export default function Blacklist() {
    const [blocklist, setBlockList] = useState([]);
    const read = async () => {
        const storage = await new Promise(resolve => {
            chrome.storage.sync.get(['blocklist'], resolve)
        });
        const blocklist = storage.blocklist || [];
        setBlockList(blocklist);
    }
    const save = async () => {
        const filteredBlocklist = blocklist.filter((row) => row);
        await new Promise(resolve => {
            chrome.storage.sync.set({blocklist: filteredBlocklist}, resolve)
        });
        await chrome.extension.getBackgroundPage().reloadSettings()
    }

    return (
        <div className="blacklist">
            <SaveButton read={read} save={save}/>
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
            <button onClick={() => setBlockList([...blocklist, ''])}>
                Add
            </button>
        </div>
    )
}
