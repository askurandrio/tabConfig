/* global chrome */
import React from 'react';
import {useLoader} from "../utils";
import {tabsStorage} from "./TabsStorage";
import {hintsStorage} from "./Hints/HintsStorage";
import {observer} from "mobx-react-lite";


const openTab = async tab => {
    await Promise.all([
        hintsStorage.addHint(tabsStorage.query),
        chrome.tabs.update(tab.id, {active: true})
    ])
}


function TabUrl(props) {
    const [wrappedOpen, OpenLoadComponent] = useLoader(() => openTab(props.tab));

    return (
        <OpenLoadComponent>
            <a href={props.tab.url} onClick={wrappedOpen}>
                {props.tab.title}
            </a>
        </OpenLoadComponent>
    )
}


function TabOpen(props) {
    const [wrappedOpen, OpenLoadComponent] = useLoader(() => openTab(props.tab));

    return (
        <OpenLoadComponent>
            <button onClick={wrappedOpen}>
                Open
            </button>
        </OpenLoadComponent>
    )
}


const TabClose = observer(props => {
    const [wrappedClose, CloseLoadComponent] = useLoader(async () => {
        await Promise.all([
            hintsStorage.addHint(tabsStorage.query),
            chrome.tabs.remove(props.tab.id)
        ])
    });

    return (
        <CloseLoadComponent>
            <button onClick={wrappedClose}>
                Close
            </button>
        </CloseLoadComponent>
    )
})


export const Tab = observer(props => {
    return (
        <tr>
            <td>
                <img src={props.tab.favIconUrl}/>
            </td>
            <td className="linkColumn">
                <TabUrl tab={props.tab}/>
            </td>
            <td>
                <TabOpen tab={props.tab}/>
                <TabClose tab={props.tab}/>
            </td>
        </tr>
    )
})
