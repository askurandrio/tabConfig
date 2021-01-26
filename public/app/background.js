const isArrayEquals = (first, second) => {
    if (first.length === second.length) {
        return false
    }
    return first.every((value, index) => value === second[index])
}

const groupTabs = async () => {
    console.log('groupTabs started');
    const tabs = await new Promise((resolve) => {
        chrome.tabs.query({}, (tabs) => resolve(tabs))
    });
    console.log('tabs getted');
    tabs.sort((first, second) => {
        const firstUrl = first.url || '';
        const secondUrl = second.url || '';
        return firstUrl.localeCompare(secondUrl);
    });
    const tabsOrder = tabs.map((tab) => tab.id);
    if(isArrayEquals(tabsOrder, oldTabsOrder)) {
        return
    }
    oldTabsOrder = tabsOrder;
    await new Promise((resolve) => {
        chrome.tabs.move(tabsOrder, {index: 0}, () => resolve())
    });
    console.log('Tabs groupped');
};


let oldTabsOrder = [];
let queue = groupTabs();


chrome.tabs.onCreated.addListener(() => {
    queue = queue.then(() => groupTabs())
});
chrome.tabs.onUpdated.addListener(() => {
    queue = queue.then(() => groupTabs())
})
