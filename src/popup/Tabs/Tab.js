/* global chrome */
import React from 'react';
import {useLoader} from "../utils";
import {tabsStorage, filteredTabsStorage} from "./TabsStorage";
import {hintsStorage} from "./Hints/HintsStorage";
import {observer} from "mobx-react-lite";


const openTab = async tab => {
    await hintsStorage.addHint(filteredTabsStorage.query);
    await chrome.tabs.update(tab.id, {active: true})
}


function TabUrl(props) {
    const [wrappedOpen, OpenLoadComponent] = useLoader(() => openTab(props.tab));

    return (
        <OpenLoadComponent>
            <a href={props.tab.url} onClick={wrappedOpen}>
                {props.tab.title.slice(0, 60)}
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
        await hintsStorage.addHint(tabsStorage.query);
        await chrome.tabs.remove(props.tab.id);
        tabsStorage.refreshTabs();
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
        <tr data-debug-tab={JSON.stringify(props.tab)}>
            <td className="imageColumn">
                {
                    props.tab.favIconUrl ?
                    <img src={props.tab.favIconUrl}/> :
                    ''
                }
            </td>
            <td className="linkColumn">
                <TabUrl tab={props.tab}/>
            </td>
            <td className="buttonsColumn">
                {
                    props.tabsStorage.isTabExists(props.tab) ?
                        (
                            <>
                                <TabOpen tab={props.tab}/>
                                <TabClose tab={props.tab}/>
                            </>
                        ): ''
                }
            </td>
        </tr>
    )
})
