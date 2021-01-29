/* global chrome */

import React, { useState, useEffect, useCallback } from 'react';
import SearchField from "react-search-field";
import Tab from "./Tab";


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
};


export default function Tabs() {
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
        <div>
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
