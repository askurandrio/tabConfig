import React, {useState} from 'react';


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


export const makeLoader = () => {
    return <img className="loader" src={chrome.runtime.getURL('spinner.svg')}/>
}
