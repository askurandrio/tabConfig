import React, { useState } from 'react';
import {makeLoader} from "./utils";


function TabUrl(props) {
    const [isMarking, setIsMarking] = useState(false);
    function markTabAsActive() {
        setIsMarking(true);
        chrome.tabs.update(
            props.tab.id,
            {active: true},
            () => setIsMarking(false)
        )
    }

    if(isMarking) {
        return (
            <a href={props.tab.url}>
                {makeLoader()}
            </a>
        )
    }

    return (
        <a href={props.tab.url} onClick={markTabAsActive}>
            {props.tab.title}
        </a>
    )
}


function OpenInNewTab(props) {
    const [isOpening, setIsOpening] = useState(false);
    function openInNewTab() {
        setIsOpening(true);
        chrome.tabs.create(
            {url: props.tab.url, active: true},
            () => setIsMarking(false)
        )
    }

    if(isOpening) {
        return (
            <button disabled>
                {makeLoader()}
            </button>
        )
    }

    return (
        <button onClick={openInNewTab}>
            Open
        </button>
    )
}


function TabClose(props) {
    const [isClosing, setIsClosing] = useState(false);
    async function closeTab() {
        setIsClosing(true);
        await new Promise(resolve => chrome.tabs.remove(props.tab.id, resolve));
        await props.refreshTabs();
        setIsClosing(false)
    }

    if(isClosing) {
        return (
            <button disabled>
                {makeLoader()}
            </button>
        )
    }

    return (
        <button onClick={closeTab}>
            Close
        </button>
    )
}


export default function Tab(props) {
    return (
        <tr>
            <td>
                <img src={props.tab.favIconUrl}/>
            </td>
            <td className="linkColumn">
                <TabUrl tab={props.tab}/>
            </td>
            <td>
                <OpenInNewTab tab={props.tab}/>
                <TabClose tab={props.tab} refreshTabs={props.refreshTabs}/>
            </td>
        </tr>
    )
}
