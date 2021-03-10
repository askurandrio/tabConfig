/* global chrome */

import 'chrome-extension-async';
import React, {useState} from 'react';
import './App.scss';
import Tabs from "./Tabs";
import Blacklist from "./Blacklist";
import History from "./History";


export default function App() {
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
                onClick={() => setMode('blacklist')}
                disabled={mode === 'blacklist'}
            >
                Blacklist
            </button>
            <button
                onClick={() => setMode('activationHistory')}
                disabled={mode === 'activationHistory'}
            >
                Activation history
            </button>
            {mode === 'tabs' ? <Tabs/>: ''}
            {mode === 'blacklist' ? <Blacklist/>: ''}
            {mode === 'activationHistory' ? <History/>: ''}
        </div>
    )
}
