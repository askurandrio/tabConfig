export const tabComparator = (comparator, firstTab, secondTab) => {
    const firstTabUrl = firstTab.url || '';
    const secondTabUrl = secondTab.url || '';

    if((!firstTabUrl) || (!secondTabUrl)) {
        return comparator(firstTabUrl, secondTabUrl)
    }

    if (new URL(firstTabUrl).host !== new URL(secondTabUrl).host) {
        return comparator(firstTabUrl, secondTabUrl)
    }

    const firstTabTitle = firstTab.title || '';
    const secondTabTitle = secondTab.title || '';
    return comparator(firstTabTitle, secondTabTitle)
}
