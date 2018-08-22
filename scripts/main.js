(() => {
    let formBook, siteNameInput, siteUrlInput, bookmarks, bookmarksResults, closeModalBtn, testSameness, saveChangeBtn
    formBook = document.querySelector('#myForm')
    siteNameInput = document.querySelector('#siteName')
    siteUrlInput = document.querySelector('#siteUrl')
    bookmarksResults = document.querySelector('#bookmarksResults');
    closeModalBtn = document.querySelector('#closeModal');
    saveChangeBtn = document.querySelector('#saveChange');
    testSameness = false

    const addEvents = () => {
        formBook.addEventListener('submit', saveBookmark)
        closeModalBtn.addEventListener('click', closeModal)

        window.onload = loadBookmarks
    }
    const saveBookmark = (e) => {
        e.preventDefault();
        validation()
    }
    const validation = () => {
        var expressionURL = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/;
        var regexURL = new RegExp(expressionURL);
        let expressionHTTP = /^(http|https):/
        let regexHTTP = new RegExp(expressionHTTP)
        testSameness = false
        if (!siteUrlInput.value.match(regexURL) || siteUrlInput.value === '') {
            showModal('URL is not valid')
        } else {
            let fullSiteUrl
            fullSiteUrl = 'http://' + siteUrlInput.value
            siteUrlInput.value = (siteUrlInput.value.match(regexHTTP)) ? siteUrlInput.value : fullSiteUrl
            siteNameInput.value = (siteNameInput.value === '') ? siteUrlInput.value : siteNameInput.value
            findSameness()
            if (testSameness === true) {
                siteUrlInput.value = ''
                showModal("This URL is currently added. Try again")
            } else {
                saveToLocalStorage()
            }
        }
    }
    const getValueBook = () => {
        let bookmark = {
            name: siteNameInput.value,
            url: siteUrlInput.value
        }
        return bookmark
    }
    const findSameness = () => {
        let bookmarksStorage = getFromLocalStorage('bookmarks')
        for (let i = 0; i < bookmarksStorage.length; i++) {
            if (bookmarksStorage[i].url == siteUrlInput.value) {
                testSameness = true
            }
        }
    }
    const showModal = (errorContent) => {
        let modal = document.querySelector('#myModal')
        modal.style.display = 'block'
        let textError = document.querySelector('#errorModal');
        textError.innerText = errorContent
    }
    const closeModal = () => {
        let modal = document.querySelector('#myModal')
        modal.style.display = 'none'
    }
    const saveToLocalStorage = () => {
        if (getFromLocalStorage('bookmarks') === null) {
            bookmarks = []
            bookmarks.push(getValueBook())
            setToLocalStorage('bookmarks', bookmarks)
        } else {
            bookmarks = []
            bookmarks = getFromLocalStorage('bookmarks')
            bookmarks.push(getValueBook())
            setToLocalStorage('bookmarks', bookmarks)
        }
        loadBookmarks()
    }
    const setToLocalStorage = (keyName, valueStorage) => {
        localStorage.setItem(keyName, JSON.stringify(valueStorage));
    }
    const getFromLocalStorage = (keyName) => {
        return (localStorage.getItem(keyName) === null) ? setToLocalStorage('bookmarks', [{ name: 'Haba', url: 'https://roberthaba.github.io/' }]) : JSON.parse(localStorage.getItem(keyName))
    }
    getFromLocalStorage('bookmarks')
    const removeFromLocalStorage = (keyName) => {
        localStorage.removeItem(keyName)
    }
    const removeBookmark = (element, urlBookmark) => {
        let bookmarksStorage = getFromLocalStorage('bookmarks')
        let box = element.target.closest('.card')
        for (let i = 0; i < bookmarksStorage.length; i++) {
            if (bookmarksStorage[i].url == urlBookmark) {
                bookmarksStorage.splice(i, 1);
            }
        }
        setToLocalStorage('bookmarks', bookmarksStorage)
        box.remove()

    }
    const changeSiteNameValue = (element, siteName, urlBookmark) => {
        let newSiteInput = document.querySelector('#newSiteName');
        newSiteInput.value = siteName
        saveChangeBtn.addEventListener('click', () => {
            saveSiteName(urlBookmark, siteName)
        })
    }
    const saveSiteName = (urlBookmark, oldSiteName) => {
        let newSiteInput = document.querySelector('#newSiteName');
        newSiteInput.value = (newSiteInput.value !== '') ? newSiteInput.value : oldSiteName
        let bookmarksStorage = getFromLocalStorage('bookmarks')
        for (let i = 0; i < bookmarksStorage.length; i++) {
            if (bookmarksStorage[i].url == urlBookmark) {
                bookmarksStorage[i].name = newSiteInput.value
            }
        }
        setToLocalStorage('bookmarks', bookmarksStorage)
        loadBookmarks()
    }
    const loadBookmarks = () => {
        let bookmarksStorage = getFromLocalStorage('bookmarks')
        let btnRemove
        bookmarksResults.innerHTML = ''
        console.log(bookmarksStorage)
        for (let element of bookmarksStorage) {
            let name = element.name
            let url = element.url
            bookmarksResults.innerHTML += `
            <div class="card mb-4">
            <div class="card-header bg-primary">
                <h4 class="text-white siteName">${name}</h4>
            </div>
            <div class="card-body row d-flex align-items-center justify-content-between">
                <div class="col-sm">
                <a href="${url}" target="_blank" class="card-link">${url}</a>
                </div>
                <div class="col-sm d-flex justify-content-end align-items-center">
                <button type="button" class="btn btn-primary btnChange" data-toggle="modal" data-target="#changeModal">
                    Edit
                  </button>
                <button type="button" class="btn btn-danger btnRemove ml-3">Remove</button>
            </div>
            </div>
            
        </div>
            `
        }
        for (let element of bookmarksResults.children) {
            let name = element.querySelector('.siteName').innerText
            let url = element.querySelector('.card-link').innerText
            let btnRemove = element.querySelector('.btnRemove')
            let btnChange = element.querySelector('.btnChange')
            btnRemove.addEventListener('click', (e) => {
                removeBookmark(e, url)
            }, false)
            btnChange.addEventListener('click', (e) => {
                changeSiteNameValue(e, name, url)
            }, false)
        }
    }
    addEvents()
})()