/* global chrome */

import React, { useState, useEffect, useCallback } from 'react';
import SearchField from "react-search-field";
import './App.scss'


const filterTabs = (tabs, title) => {
    tabs = tabs.filter(tab => tab.url);

    if(!title) {
        return tabs
    }

    tabs = tabs.map(tab => {
        tab.matchesTitle = tab.title && tab.title.includes(title);
        tab.matchesUrl = tab.url && tab.url.includes(title);
        return tab
    });

    tabs = tabs.filter(tab => tab.matchesTitle || tab.matchesUrl);

    tabs.sort((first, second) => {
        if(first.matchesTitle && second.matchesTitle) {
            return 0
        }
        if(first.matchesTitle) {
            return -1
        }
        return 1
    })

    return tabs
}


const Tab = (props) => {
    function openUrl() {
        chrome.tabs.create({url: props.tab.url, active: true});
    }

    function openTab() {
        chrome.tabs.update(props.tab.id, {active: true});
    }

    function closeTab() {
        chrome.tabs.remove(props.tab.id);
        props.refreshTabs();
    }

    return (
        <tr>
            <td>
                <img src={props.tab.favIconUrl}/>
            </td>
            <td className="linkColumn">
                <a href={props.tab.url} onClick={openUrl}>
                    {props.tab.title}
                </a>
            </td>
            <td>
                <button onClick={openTab}>
                    Open
                </button>
                <button onClick={closeTab}>
                    Close
                </button>
            </td>
        </tr>
    )
}


export default () => {
    const [title, setTitle] = useState('');
    const [tabs, setTabs] = useState([]);
    const refreshTabs = useCallback(
        () => {
            chrome.tabs.query(
                {},
                tabs => setTabs(filterTabs(tabs, title))
            )
        },
        [title]
    )

    useEffect(
        () => refreshTabs(),
        [refreshTabs]
    )

    return (
        <div className="app">
            <SearchField
                placeholder="Input title or url"
                searchText={title}
                onChange={(value) => setTitle(value)}
            />
            <table className="tabs">
                <tbody>
                    {
                        tabs.map((tab, index) => {
                            return <Tab tab={tab} refreshTabs={refreshTabs} key={index}/>
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}
