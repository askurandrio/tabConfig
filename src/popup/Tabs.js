/* global chrome */

import React, { useState, useEffect, useCallback } from 'react';
import Tab from "./Tab";
import TabsSearch from "./TabsSearch";
import {useLoader} from "./utils";


const filterTabs = (tabs, title) => {
    tabs = tabs.filter(tab => tab.url);

    if(!title) {
        return tabs
    }

    tabs = tabs.map(tab => {
        tab.matchesTitle = tab.title && tab.title.toLowerCase().includes(title.toLowerCase());
        tab.matchesRawTitle = tab.title && tab.title.includes(title);
        tab.matchesUrl = tab.url && tab.url.includes(title);
        return tab
    });

    tabs = tabs.filter(tab => tab.matchesTitle || tab.matchesUrl);

    tabs.sort((first, second) => {
        if(first.matchesTitle && second.matchesTitle) {
            if(first.matchesRawTitle && second.matchesRawTitle) {
                return 0
            }
            if(first.matchesRawTitle) {
                return -1
            }
            return 1
        }
        if(first.matchesTitle) {
            return -1
        }
        return 1
    })

    return tabs
};


const useInternalTabs = () => {
    const [internalTabs, setInternalTabs] = useState([]);
    const refreshInternalTabs = async () => {
        const tabs = await new Promise(resolve => {
            chrome.tabs.query({}, (tabs) => resolve(tabs))
        });
        setInternalTabs(tabs);
    }

    useEffect(() => {
        let queue = refreshInternalTabs();
        const intervalId = setInterval(
            () => queue = queue.then(() => refreshInternalTabs()),
            2000
        );
        return () => {
            clearInterval(intervalId);
        }
    }, []);

    return {internalTabs, refreshInternalTabs}
}


const useTabs = () => {
    const [tabs, setTabs] = useState([]);
    const [query, setQuery] = useState('');
    const {internalTabs, refreshInternalTabs} = useInternalTabs();

    useEffect(() => {
        const filteredTabs = filterTabs(internalTabs, query);
        setTabs(filteredTabs)
    }, [query, internalTabs]);
    const loader = useLoader(() => refreshInternalTabs())

    useEffect(() => {
        loader.wrappedLoader()
    }, []);

    return {tabs, query, setQuery, isSearching: loader.isLoading, refreshTabs: loader.wrappedLoader}
}


export default function Tabs() {
    const {tabs, query, setQuery, isSearching, refreshTabs} = useTabs();

    return (
        <div className="tabs">
            <TabsSearch
                query={query}
                setQuery={setQuery}
                isSearching={isSearching}
                refreshTabs={refreshTabs}
            />
            <table>
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
