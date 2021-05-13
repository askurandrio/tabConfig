/* global chrome */

import React from 'react';
import {observer} from "mobx-react-lite";

import {LoadComponent} from "../utils";
import {blackListStorage} from './BlackListStorage';


export const BlackList = observer(() => {
    return (
        <LoadComponent isLoading={blackListStorage.isLoading}>
            <div className="blacklist">
                <button onClick={() => blackListStorage.save()}>
                    {blackListStorage.buttonText}
                </button>
                {
                    blackListStorage.blackList.map((row, index) => {
                        return (
                            <div key={index}>
                                <input
                                    value={row}
                                    onChange={event => {
                                        blackListStorage.setValue(
                                            index, event.target.value
                                        )
                                    }}
                                />
                            </div>
                        )
                    })
                }
                <button onClick={() => blackListStorage.addThisSite()}>
                    Add this site
                </button>
            </div>
        </LoadComponent>
    )
})
