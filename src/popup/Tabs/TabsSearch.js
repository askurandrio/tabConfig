import React from 'react';
import {observer} from "mobx-react-lite";
import {tabsStorage, filteredTabsStorage} from "./TabsStorage";
import {Hints} from "./Hints/Hints";


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
}


export const TabsSearch = observer(() => {
    return (
        <label>
            <input
                value={filteredTabsStorage.query}
                placeholder="Input title or url"
                className="search-input"
                onKeyDown={event => {
                    if (event.key !== 'Enter') {
                        return;
                    }
                    tabsStorage.refreshTabs();
                }}
                onChange={event => {
                    filteredTabsStorage.setQuery(event.target.value)
                }}
            />
            <SearchIcon/>
            <Hints/>
        </label>
    )
})
