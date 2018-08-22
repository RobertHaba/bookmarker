(() => {
    let inputSearch
    const loadEvents = () => {
        let buttonSearch = document.querySelector('#buttonSearch');
        inputSearch = document.querySelector('#searchInput');
        buttonSearch.addEventListener('click', matchFilterValue)
        inputSearch.addEventListener('keyup', matchFilterValue)

    }
    const getFilterValue = () => {

        let valueSearch = inputSearch.value.toUpperCase()
        return valueSearch
        console.log(valueSearch)

    }
    const matchFilterValue = () => {
        let bookmarksResultChild = document.querySelector('#bookmarksResults').children;
        console.log(bookmarksResultChild)
        for (let element of bookmarksResultChild) {
            let siteName = element.querySelector('.siteName').innerHTML.toUpperCase()
            console.log(getFilterValue())
            element.style.display = (siteName.indexOf(getFilterValue()) > -1) ? 'flex' : 'none'
            console.log(siteName + ' ' + ' Element')
        }

    }
    loadEvents()
})()