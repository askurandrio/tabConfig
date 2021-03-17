import React, {useCallback, useEffect, useState} from 'react';
import {makeLoader} from "./utils";


export class TabsFilter {
    constructor(query) {
        this.query = query;
        this.onApply = null;
    }

    apply(tabs) {
        if(this.onApply) {
            this.onApply(this)
        }
        if(!this.query) {
            return tabs
        }
        tabs = tabs.map((tab) => this._addAttributesToTab(tab));
        tabs = tabs.filter(tab => this._filterTab(tab));
        tabs.sort((first, second) => {
            if(first.matchesTitle && second.matchesTitle) {
                if(first.matchesRawTitle && second.matchesRawTitle) {
                    return 0
                }
                if(first.matchesRawTitle) {
                    return -1
                }
                return 1
            }
            if(first.matchesTitle) {
                return -1
            }
            return 1
        })
        return tabs
    }

    _filterTab(tab) {
        if(tab.matchesTitle || tab.matchesUrl) {
            return true;
        }
        if(
            this.query.startsWith(':a') &&
            tab.active &&
            (tab.windowId === chrome.windows.WINDOW_ID_CURRENT)
        ) {
            return true
        }
        if(this.query.startsWith(':p') && tab.audible){
            return true
        }
    }

    _addAttributesToTab(tab) {
        tab.matchesTitle = tab.title && tab.title.toLowerCase().includes(this.query.toLowerCase());
        tab.matchesRawTitle = tab.title && tab.title.includes(this.query);
        tab.matchesUrl = tab.url && tab.url.includes(this.query);
        return tab
    }
}


const SearchIcon = () => {
  return (
    <svg
      version="1.1"
      x="0px"
      y="0px"
      width="21"
      height="21"
      viewBox="0 0 635 635"
      style={{fill: '#727272'}}
    >
      <g>
        <path d="M255.108,0C119.863,0,10.204,109.66,10.204,244.904c0,135.245,109.659,244.905,244.904,244.905
          c52.006,0,100.238-16.223,139.883-43.854l185.205,185.176c1.671,1.672,4.379,1.672,5.964,0.115l34.892-34.891
          c1.613-1.613,1.47-4.379-0.115-5.965L438.151,407.605c38.493-43.246,61.86-100.237,61.86-162.702
          C500.012,109.66,390.353,0,255.108,0z M255.108,460.996c-119.34,0-216.092-96.752-216.092-216.092
          c0-119.34,96.751-216.091,216.092-216.091s216.091,96.751,216.091,216.091C471.199,364.244,374.448,460.996,255.108,460.996z"
        />
      </g>
    </svg>
  );
};


function useHints() {
    const [hints, setHints] = useState([]);

    const updateHints = (hintsInfo) => {
        let newHints = Object.entries(hintsInfo);
        newHints.sort((first, second) => {
            if (first[1] < second[1]) {
                return 1
            }
            if (first[1] > second[1]) {
                return -1
            }
            return 0
        })
        newHints = newHints.map(hint => hint[0])
        newHints = newHints.filter(hint => hint)
        newHints = newHints.slice(0, 10);
        setHints(newHints)
    }

    useEffect(
        () => {
            chrome.storage.local.get(['hintsInfo']).then(storage => {
                updateHints(storage.hintsInfo || {})
            });
        },
        []
    )

    const addHint = async (hint) => {
        const storage = await chrome.storage.local.get(['hintsInfo']);
        let hintsInfo = storage.hintsInfo || {}
        const hits = hintsInfo[hint] || 0;
        hintsInfo = {
            ...hintsInfo,
            [hint]: hits + 1
        }
        await chrome.storage.local.set({hintsInfo});
        updateHints(hintsInfo);
    }

    return {hints, addHint}
}


function Hint(props) {
    return (
        <button onClick={() => props.setTabsFilter(new TabsFilter(props.hint))}>
            {props.hint}
        </button>
    )
}

export function TabsSearch(props) {
    const {hints, addHint} = useHints();

    useEffect(
        () => {
            return props.onTabAction.subscribe(async () => {
                await addHint(props.tabsFilter.query)
            })
        },
        [props.tabsFilter]
    )

    return (
        <>
            <input
                value={props.tabsFilter.query}
                placeholder="Input title or url"
                className="search-input"
                onKeyDown={event => {
                    if (event.key !== 'Enter') {
                        return;
                    }
                    props.refreshTabs();
                }}
                disabled={props.isSearching}
                onChange={event => {
                    props.setTabsFilter(new TabsFilter(event.target.value))
                }}
            />
            {
                props.isSearching ? makeLoader(): (<SearchIcon onClick={props.refreshTabs}/>)
            }
            <div>
                {
                    hints.map((hint, index) => (
                        <Hint key={index} hint={hint} setTabsFilter={props.setTabsFilter}/>
                    ))
                }
            </div>
        </>
    )
}
