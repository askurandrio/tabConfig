/* global chrome */

import React, { useEffect } from 'react';
import {Tab} from "./Tab";
import {TabsSearch} from "./TabsSearch";
import {observer} from "mobx-react-lite";
import {tabsStorage} from "./TabsStorage";


export const Tabs = observer(() => {
    return (
        <div className="tabs">
            <TabsSearch/>
            <table>
                <tbody>
                    {
                        tabsStorage.tabs.map((tab, index) => {
                            return <Tab tab={tab} key={index}/>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
})
