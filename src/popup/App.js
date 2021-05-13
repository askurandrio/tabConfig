/* global chrome */

import 'chrome-extension-async';
import React, { useState, useEffect } from 'react';
import './App.scss';
import { Tabs } from "./Tabs/Tabs";
import { tabsStorage } from './Tabs/TabsStorage';
import { hintsStorage } from './Tabs/Hints/HintsStorage';
import { BlackList } from "./BlackList/BlackList";
import { blackListStorage } from './BlackList/BlackListStorage';
import { History } from "./History";


export default function App() {
    useEffect(
        async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            await tabsStorage.refreshTabs();
            await hintsStorage.init();
            await blackListStorage.init();
        },
        []
    )
    const [mode, setMode] = useState('tabs');

    return (
        <div className="app">
            
            <button
                onClick={() => setMode('tabs')}
                disabled={mode === 'tabs'}
            >
                Tabs
            </button>
            <button
                onClick={() => setMode('history')}
                disabled={mode === 'history'}
            >
                History
            </button>
            <button
                onClick={() => setMode('blocklist')}
                disabled={mode === 'blocklist'}
            >
                BlackList
            </button>
            {mode === 'tabs' ? <Tabs /> : ''}
            {mode === 'history' ? <History /> : ''}
            {mode === 'blocklist' ? <BlackList /> : ''}
        </div>
    )
}
