/* global chrome */

import React, { useState, useEffect } from 'react';
import SearchField from "react-search-field";


export default function App() {
    const [title, setTitle] = useState('');
    const [tabs, setTabs] = useState([]);

    useEffect(
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

    return (
        <div>
            <SearchField
                placeholder="Input title or url"
                searchText={title}
                onChange={(value) => setTitle(value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>
                            Index
                        </th>
                        <th>
                            Title
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tabs.map((tab, index) => {
                            return (
                                <tr key={index}>
                                    <th>
                                        {tab.index}
                                    </th>
                                    <th>
                                        {tab.title}
                                    </th>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}
