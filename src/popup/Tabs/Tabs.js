/* global chrome */

import React from 'react';
import {Tab} from "./Tab";
import {TabsSearch} from "./TabsSearch";
import {observer} from "mobx-react-lite";
import {tabsStorage, filteredTabsStorage} from "./TabsStorage";


export const Tabs = observer(() => {
    return (
        <div className="tabs">
            <TabsSearch/>
            <table>
                <tbody>
                    {
                        filteredTabsStorage.tabs.map((tab, index) => {
                            return <Tab tab={tab} key={index} tabsStorage={tabsStorage}/>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
})
