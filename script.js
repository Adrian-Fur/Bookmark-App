const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameElement = document.getElementById('website-name');
const websiteUrlElement = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

function showModal() {
    modal.classList.add('show-modal');
    websiteNameElement.focus();
}

modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (ev) => (ev.target === modal ? modal.classList.remove('show-modal') : false)); 

function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields!');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    return true;
}

function buildBookmarks() {
        bookmarksContainer.textContent = '';

        bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        const item = document.createElement('div');
        item.classList.add('item');
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        const flavicon = document.createElement('img');
        flavicon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
        flavicon.setAttribute('alt', 'Flavicon');
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        linkInfo.append(flavicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name: 'Github',
                url: 'https://github.com'
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

function storeBookmark(event) {
    event.preventDefault();
    const nameValue = websiteNameElement.value;
    let urlValue = websiteUrlElement.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
     urlValue = `https://${urlValue}`; 
    }
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameElement.focus();
}

bookmarkForm.addEventListener('submit', storeBookmark);
fetchBookmarks();