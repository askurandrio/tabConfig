import React, {useState} from "react";
import {getHistory} from "../generic/utils";
import Tab from "./Tab";
import {makeLoader, useAsyncInit} from "./utils";


export default function History(props) {
    const [tabs, setTabs] = useState([]);
    const {isInitialization} = useAsyncInit(async () => {
        const tabsStorage = (await chrome.tabs.query({})).reduce(
            (previousStorage, tab) => {
                return {
                    [tab.id]: tab,
                    ...previousStorage
                }
            },
            {}
        );
        const activationHistory = await getHistory();
        setTabs(activationHistory.map(tab => tabsStorage[tab.id] || tab));
    })

    if(isInitialization) {
        return (
            <div className="tabs">
                {makeLoader()}
            </div>
        )
    }

    return (
        <div className="tabs">
            <table>
                <tbody>
                    {
                        tabs.map((tab, index) => {
                            return <Tab tab={tab} key={index}/>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
