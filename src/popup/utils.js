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


export const useAsyncInit = (init) => {
    const [isInitialization, setIsInitialization] = useState(true);

    useEffect(
        () => {
            init().then(() => {
                setIsInitialization(false)
            })
        },
        []
    )

    return {isInitialization}
}


export const makeLoader = () => {
    return <img className="loader" src={chrome.runtime.getURL('spinner.svg')}/>
}
