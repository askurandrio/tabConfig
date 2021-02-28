/* global chrome */

import React, { useState, useEffect } from 'react';
import Tab from "./Tab";
import {TabsFilter, TabsSearch} from "./TabsSearch";
import {useLoader} from "./utils";


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


class Subscriber {
    constructor() {
        this.handlers = []
    }

    async onAction(...args) {
        for(const handler of this.handlers) {
            await handler(...args)
        }
    }

    subscribe(handler) {
        this.handlers.push(handler)
        return () => {
            const index = this.handlers.indexOf(handler);
            this.handlers.splice(index, 1)
        }
    }
}


export default function Tabs() {
    const [tabs, setTabs] = useState([]);
    const [tabsFilter, setTabsFilter] = useState(new TabsFilter(''));
    const [onTabAction] = useState(new Subscriber());
    const {internalTabs, refreshInternalTabs} = useInternalTabs();

    useEffect(() => {
        const filteredTabs = tabsFilter.apply(internalTabs);
        setTabs(filteredTabs)
    }, [tabsFilter, internalTabs]);
    const loader = useLoader(() => refreshInternalTabs())

    useEffect(() => {
        loader.wrappedLoader()
    }, []);

    return (
        <div className="tabs">
            <TabsSearch
                onTabAction={onTabAction}
                tabsFilter={tabsFilter}
                setTabsFilter={setTabsFilter}
                isSearching={loader.isLoading}
                refreshTabs={loader.wrappedLoader}
            />
            <table>
                <tbody>
                    {
                        tabs.map((tab, index) => {
                            return <Tab
                                tab={tab}
                                onTabAction={onTabAction}
                                refreshTabs={loader.wrappedLoader}
                                key={index}
                            />
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}
