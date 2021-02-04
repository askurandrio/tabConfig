/* global chrome */
import React from 'react';
import {useLoader, makeLoader} from "./utils";
import {useIsMounted} from "react-tidy";


function TabUrl(props) {
    if(props.markTabAsActive.isLoading) {
        return (
            <a href={props.tab.url}>
                {makeLoader()}
            </a>
        )
    }

    return (
        <a href={props.tab.url} onClick={props.markTabAsActive.wrappedLoader}>
            {props.tab.title}
        </a>
    )
}


function TabOpen(props) {
    if(props.markTabAsActive.isLoading) {
        return (
            <button disabled>
                {makeLoader()}
            </button>
        )
    }

    return (
        <button onClick={props.markTabAsActive.wrappedLoader}>
            Open
        </button>
    )
}


function TabClose(props) {
    const isMounted = useIsMounted()
    const {isLoading, wrappedLoader} = useLoader(
        async () => {
            await new Promise(resolve => chrome.tabs.remove(props.tab.id, resolve));
            await props.refreshTabs();
        },
        isMounted
    )

    if(isLoading) {
        return (
            <button disabled>
                {makeLoader()}
            </button>
        )
    }

    return (
        <button onClick={wrappedLoader}>
            Close
        </button>
    )
}


export default function Tab(props) {
    const markTabAsActive = useLoader(() => {
        return new Promise(resolve => {
            chrome.tabs.update(props.tab.id, {active: true}, resolve)
        })
    })

    return (
        <tr>
            <td>
                <img src={props.tab.favIconUrl}/>
            </td>
            <td className="linkColumn">
                <TabUrl tab={props.tab} markTabAsActive={markTabAsActive}/>
            </td>
            <td>
                <TabOpen markTabAsActive={markTabAsActive}/>
                <TabClose tab={props.tab} refreshTabs={props.refreshTabs}/>
            </td>
        </tr>
    )
}
