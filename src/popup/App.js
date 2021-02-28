/* global chrome */

import 'chrome-extension-async';
import React, {useState} from 'react';
import './App.scss';
import Tabs from "./Tabs";
import Blacklist from "./Blacklist";


export default function App() {
    const [mode, setMode] = useState('tabs');

    return (
        <div className="app">
            <button onClick={() => setMode('tabs')} disabled={mode === 'tabs'}>
                Tabs
            </button>
            <button onClick={() => setMode('blacklist')} disabled={mode === 'blacklist'}>
                Blacklist
            </button>
            {mode === 'tabs' ? <Tabs/>: ''}
            {mode === 'blacklist' ? <Blacklist/>: ''}
        </div>
    )
}
