import React, {useState} from "react";
import {getHistory} from "../generic/utils";
import {Tab} from "./Tabs/Tab";
import {tabsStorage} from "./Tabs/TabsStorage";
import {useAsyncInit} from "./utils";


export function History() {
    const [tabs, setTabs] = useState([]);
    const [InitComponent] = useAsyncInit(async () => {
        const activationHistory = await getHistory();
        setTabs(activationHistory);
    })

    return (
        <InitComponent>
            <div className="tabs">
                <table>
                    <tbody>
                        {
                            tabs.map((tab, index) => {
                                return <Tab tab={tab} key={index} tabsStorage={tabsStorage}/>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </InitComponent>
    )
}
