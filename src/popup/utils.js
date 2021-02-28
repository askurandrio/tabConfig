import React, {useEffect, useState} from 'react';


export const useLoader = (loader, isMounted) => {
    if(isMounted === undefined) {
        isMounted = true
    }
    const [isLoading, setIsLoading] = useState(false);

    const wrappedLoader = async (...args) => {
        setIsLoading(true);
        await loader(...args);

        if(isMounted) {
            setIsLoading(false)
        }
    }

    return {isLoading, wrappedLoader}
}


export const useStorageStatus = (read, write, changeStatus) => {
    const [status, setStatus] = useState('init');
    if(!changeStatus) {
        changeStatus = setStatus;
    }
    useEffect(
        async () => {
            if(status === 'init') {
                await read();
                changeStatus('ready');
                return
            }
            if(status === 'save') {
                await write();
                changeStatus('ready');
                return
            }
        },
        [status]
    )

    return [status, setStatus]
}


export const makeLoader = () => {
    return <img className="loader" src={chrome.runtime.getURL('spinner.svg')}/>
}
