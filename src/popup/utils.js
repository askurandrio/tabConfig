import React from 'react';


export const makeLoader = () => {
    return <img className="loader" src={chrome.runtime.getURL('spinner.svg')}/>
}
