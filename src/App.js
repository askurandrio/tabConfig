/* global chrome */

import React, { useState, useEffect, useCallback } from 'react';
import SearchField from "react-search-field";
import './App.scss'


function Tab(props) {
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
            <td>
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


export default function App() {
    const [title, setTitle] = useState('');
    const [tabs, setTabs] = useState([]);
    const refreshTabs = useCallback(
        () => {
            chrome.tabs.query(
                {},
                tabs => {
                    tabs = tabs.filter(tab => {
                        if(!title) {
                            return true
                        }
                        return tab.title && tab.title.includes(title)
                    });
                    setTabs(tabs)
                }
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
                            return <Tab tab={tab} refreshTabs={refreshTabs} key={index}></Tab>
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}
