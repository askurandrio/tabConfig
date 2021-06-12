import React from "react";
import {filteredTabsStorage} from "../TabsStorage";
import {hintsStorage} from "./HintsStorage";
import {observer} from "mobx-react-lite";


const Hint = observer((props) => {
    return (
        <button onClick={() => filteredTabsStorage.setQuery(props.hint)}>
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
