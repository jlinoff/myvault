/**
 * Built-in, hard-coded example data for the internal example action on the load page.
 * <p>
 * The example consists of 11 records. It turned out to be surprising
 * useful for debugging and testing the system so I left it in for the
 * webapp.
 * @module example
 */
import { VERSION, BUILD, GIT_COMMIT_ID } from '/js/version.js'

/**
 * The example object.
 * @example
 * import { example } from '/js/example.js'
 * assert 'meta' in example
 */
var example = {
   "meta": {
       "atime": "",
       "ctime": "",
       "mtime": "",
       "btime": BUILD,
       "version": VERSION,
       "gitCommitId": GIT_COMMIT_ID,
       "title": "myExample",
   },
    "records": [
        {
            "__id__": "Amazon",
            "url": "https://www.amazon.com",
            "username": "pbrain22@protonmail.com",
            "password": "hr5Hn9pqm3u.VqMiALfdN-",
            "notes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nCras sodales elit in metus tempus, ut semper magna finibus.\nDonec aliquam elementum velit quis pharetra.\nPellentesque accumsan neque ut massa elementum mollis.\nNulla eget pellentesque est.\n"
        },
        {
            "__id__": "AWS",
            "url": "https://aws.amazon.com",
            "username": "pbrain22@protonmail.com",
            "password": "hr5Hn9pqm3u.VqMiALfdN-"
        },
        {
            "__id__": "DropBox",
            "app": "qspm",
            "client": "oieGRvCXCvfaAg7",
            "password": "gWXLFz5dSeaK2isrm6W",
            "url": "https://www.dropbox.com/developers",
            "url-dev": "https://www.dropbox.com/developers/apps/info/oieGRvCXCvfaAg7#settings",
            "url-down": "https://content.dropboxapi.com/2/files/download",
            "url-list": "https://content.dropboxapi.com/2/files/list_folder",
            "url-up": "https://content.dropboxapi.com/2/files/upload",
            "username": "pbrain22@gmail.com",
            "notes": "use settings to generate new tokens"
        },
        {
            "__id__": "Facebook",
            "url": "https://www.evernote.com",
            "username": "pbrain22@gmail.com",
            "password": "1FHwquPVNhmCyTD!UNTvR4m-g"
        },
        {
            "__id__": "GitHub",
            "url": "https://github.com",
            "username": "pbrain22",
            "password": "C6kFz28MnbQlraqeJnsQlME2"
        },
        {
            "__id__": "Google pbrain22@gmail.com",
            "url": "https://www.google.com",
            "username": "pbrain22@gmail.com",
            "password": "bcpqJgJ4yf7z0XQPLq1tqr",
            "security-question": "what is a photon? gauge-boson"
        },
        {
            "__id__": "Master",
            "password": "example",
            "notes": "this is the master password"
        },
        {
            "__id__": "Netflix",
            "url": "http://netflix.com",
            "username": "pbrain22@gmail.com",
            "password": "5IyKQEmdfo83ecGQSZmEfBU"
        },
        {
            "__id__": "Protonmail email pbrain22@protonmail.com",
            "url": "https://mail.protonmail.com/inbox",
            "username": "pbrain22",
            "password": "eFawGXg3VDi.qyCCIkpnMdPFT3yf"
        },
        {
            "__id__": "StackExchange (StackOverflow)",
            "url": "http://stackoverflow.com",
            "username": "pbrain22@gmail.com",
            "password": "s_SuVyADaqrqIY4sxIPfr1"
        },
        {
            "__id__": "Work",
            "username": "pbrain@acme.com",
            "password": "XKn0x-i-AQxjmOARVHxecpoX2!"
        }
    ]
}

/**
 * Convenience function for getting the example object.
 * @example
 * example = getExample()
 * @returns {object} The example object.
 */
export function getExample() {
    return JSON.stringify(example, null, 4)
}
