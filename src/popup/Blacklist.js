/* global chrome */

import React, {useState} from 'react';
import {makeLoader, useStorageStatus} from "./utils";


function SaveButton(props) {
    const changeStatus = (newStatus) => {
        if((status === 'save') && (newStatus === 'ready')) {
            setStatus('saved');
            return
        }
        if(newStatus === 'saved') {
            setTimeout(() => setStatus('ready'), 1000)
            return;
        }
        setStatus(newStatus);
    }
    const getButtonText = (status) => {
        return {
            'init': 'Initialization...',
            'ready': 'Save',
            'save': 'Saving...',
            'saved': 'Saved'
        }[status]
    }
    const [status, setStatus] = useStorageStatus(props.read, props.write, changeStatus);

    return (
        <button onClick={() => setStatus('save')} disabled={status !== 'save'}>
            {getButtonText(status)} {status === 'ready' ? '': makeLoader()}
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
