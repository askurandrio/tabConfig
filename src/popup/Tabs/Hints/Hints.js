import React from "react";
import {tabsStorage} from "../TabsStorage";
import {hintsStorage} from "./HintsStorage";
import {observer} from "mobx-react-lite";


const Hint = observer((props) => {
    return (
        <button onClick={() => tabsStorage.setQuery(props.hint)}>
            {props.hint}
        </button>
    )
});


export const Hints = observer(() => {
    return (
        <div>
            {
                hintsStorage.hints.map((hint, index) => (
                    <Hint key={index} hint={hint}/>
                ))
            }
        </div>
    )
});
