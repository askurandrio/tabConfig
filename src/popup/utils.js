import React, {useEffect, useState} from 'react';
import {useIsMounted} from "react-tidy";


export const LoadComponent = (props) => {
    if(!props.isLoading) {
        return props.children
    }

    return (
        <div
            className="loading"
            style={{
                backgroundImage: chrome.runtime.getURL('spinner.svg')
            }}
        >
            {props.children}
        </div>
    )
}


export const useLoader = (loader) => {
    const isMounted = useIsMounted();
    const [isLoading, setIsLoading] = useState(false);

    const wrappedLoader = async (...args) => {
        setIsLoading(true);
        try {
            await loader(...args);
        } catch(ex) {
            console.log(ex)
        }

        if(isMounted) {
            setIsLoading(false)
        }
    }

    const component = (props) => {
        return (
            <LoadComponent isLoading={isLoading}>
                {props.children}
            </LoadComponent>
        )
    }

    return [wrappedLoader, component]
}


export const useAsyncInit = (init) => {
    const [wrappedInit, InitComponent] = useLoader(init);

    useEffect(
        () => {
            wrappedInit()
        },
        []
    )

    return [InitComponent]
}
