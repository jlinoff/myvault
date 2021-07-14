/**
* Common variables that customize the webapp.
 * @module common
 */
import { VERSION, BUILD, GIT_COMMIT_ID, GIT_BRANCH } from '/js/version.js'
import { getThemeProps, getThemeColors } from '/js/themes.js'
import { header  } from '/js/header.js'

export var TITLE = 'myVault - Secure Personal Data Manager'

/**
 * The common global variables.
 * <p>
 * Entries that start with "<b><code>_</code></b>" are meant to be ignored during load/save operations.
 * <p>
 *
 * | section | description |
 * | ------- | ----------- |
 * | meta    | Information about the common data like the modified time, the build and the version. |
 * | ftype   | Maps field names to types. A typical example is the "password" maps to a password field. |
 * | crypt   | The data and functions loaded from the WebAssembly implementation of the encryption algorithms. |
 * | search  | The last used search term. |
 * | data    | The records data. |
 * | save    | The filename that was used for loading or saving. |
 * | themes  | The currently defined themes. |
 * | icons   | The icons used by the app. |
*/
export var common = {
    // This maps the field name to the type.
    // for example the field name "description" maps to a textarea (multi-line) element
    // it is used by by getFieldValueType()
    // May allow this to be modified in preferences in the future.
    meta: {
        atime: '', // last access time
        ctime: '', // creation time
        mtime: '', // last modification time
        btime: BUILD, // build date
        version: VERSION, // the system and data version
        gitCommitId: GIT_COMMIT_ID, // git commit id
        gitBranch: GIT_BRANCH,
        title: TITLE
    },
    ftype: [ // field type based on name.
        // Can't use RegExp objects here because of the save/restore logic, all searches are case insensitive
        {rex: 'password', type: 'password'}, // password, "password 1"
        {rex: 'passphrase', type: 'password'}, // passphrase, "my passphrase"
        {rex: 'secret', type: 'password'}, // secret, "secret value"
        {rex: 'note', type: 'textarea'},  // note, notes
        {rex: 'description', type: 'textarea'},  // description
    ],
    crypt: {
        _wasm: null, // populated at load time from the auto-generated crypt.js functions.
        algorithm: '',
        password: '' // master password
    },
    search: {
        cache: ''
    },
    data: {
        records: [], // JSON data
        _map: {}, // ephemeral map the record ids to indexes
        maxFields: 10, // max fields per record
        rfts: { //  record field templates
            current: 'PASS4',
            entries: {
                NONE: [],
                BOOK: ['author', 'read', 'rating', 'notes'], // read == date read
                PASS4: ['url', 'username', 'password', 'notes'],
                PASS5: ['url', 'username', 'password', 'email', 'notes'],
            }
        }
    },
    save: {
        filename: 'myvault.txt'
    },
    themes: {
        active: {
            entry: 'steelblue-dark',
            prop: 'standard',
        },
        // Get the current active entry.
        // Allow theme colors to change dynamically.
        _activeColors: () => {
            let a = common.themes.active.entry
            if ( ! common.themes.colors.hasOwnProperty(a)) {
                a = Object.keys(common.themes.colors)[0]
                common.themes.active.entry = a
            }
            return common.themes.colors[a]
        },
        // Get the current active property set.
        // Allow theme properties to change dynamically.
        _activeProp: () => {
            let p = common.themes.active.prop
            if ( ! common.themes.props.hasOwnProperty(p)) {
                p = Object.keys(common.themes.colors)[0]
                common.themes.active.prop = p
            }
            return common.themes.props[p]
        },
        props: getThemeProps(),
        colors: getThemeColors(),
    },
    icons: { // Credit to ico moon free icons: https://icomoon.io/preview-free.html
        arrowDown: '/icons/arrow-down.svg',
        arrowLeft: '/icons/arrow-left.svg',
        arrowRight: '/icons/arrow-right.svg',
        arrowUp: '/icons/arrow-up.svg',
        arrowDownThin: '/icons/arrow-down2.svg',
        arrowLeftThin: '/icons/arrow-left2.svg',
        arrowRightThin: '/icons/arrow-right2.svg',
        arrowUpThin: '/icons/arrow-up2.svg',
        circleDown: '/icons/circle-down.svg',
        circleLeft: '/icons/circle-left.svg',
        circleRight: '/icons/circle-right.svg',
        circleUp: '/icons/circle-up.svg',
        clear: '/icons/cancel-circle.svg',
        cog: '/icons/cog.svg',
        cogs: '/icons/cogs.svg',
        collapse: '/icons/shrink2.svg',
        contrast: '/icons/contrast.svg',
        copy: '/icons/copy.svg',
        db: '/icons/database.svg',
        expand: '/icons/enlarge.svg',
        eye:  'icons/eye.svg',
        eyeBlocked: 'icons/eye-blocked.svg',
        info: '/icons/question.svg',
        lock: '/icons/lock.svg',
        pencil: '/icons/pencil.svg',
        paste: '/icons/paste.svg',
        plus: '/icons/plus.svg',
        list: '/icons/list.svg',
        menu: '/icons/menu.svg',
        reset: '/icons/loop2.svg',
        save: '/icons/download.svg',
        search: '/icons/search.svg',
        shrink: '/icons/shrink.svg',
        trash: '/icons/bin.svg',
        undo: '/icons/undo2.svg',
        unlock: '/icons/unlocked.svg',
    },
    iconFillColorFilter: {
        maxTries: 50,
        maxLoss: 0.8,
        cache: {}
    }
};

/*
 * Get the field type from the field name.
 *<p>
 * There are three field types: password, textarea and string.
 * The string field is the simplest it is just a text input.
 * The textarea field is a multiple textarea box.
 * The password field is the most complex. It is composed
 * of multiple elements: a password input element and buttons
 * for showing/hiding the password and generating cryptic or
 * memorable passwords.
 * The mapping between field names and types is defined in
 *  the common.ftype map.
 * @example
 * assert getFieldValueType('password') == 'password'
 * assert getFieldValueType('My Password') == 'password'
 * assert getFieldValueType('passphrase') == 'password'
 * assert getFieldValueType('secret') == 'password'
 * assert getFieldValueType('notes') == 'textarea'
 * assert getFieldValueType('my notes') == 'textarea'
 * assert getFieldValueType('url') == 'string'
 * @param {string} name  The name of th field.
 * @returns {string} The type of field as a string.
 */
export function getFieldValueType(name) {
    // (O(N) is okay because the list is very short.
    for (const obj of common.ftype) {
        let rex = new RegExp(obj.rex, 'i')
        if ( name.search(rex) >= 0 ) {
            return obj.type
        }
    }
    return 'string'
}

/**
 * Display the currently active theme.
 * Useful when for refresh operations.
 */
export function displayTheme() {
    document.body.style.color = common.themes._activeColors().fgColor
    document.body.style.backgroundColor = common.themes._activeColors().bgColor
    let es = document.getElementsByClassName('x-theme-element')
    for(let i=0;i<es.length; i++) {
        es[i].style.color = common.themes._activeColors().fgColor
        es[i].style.backgroundColor = common.themes._activeColors().bgColor
    }
}

/**
 * Save the global state data to session storage.
 */
export function saveCommon() {
    // NOTE: was unable to get deep copy working reliably
    let rec = {
        meta: common.meta,
        ftype: common.ftype,
        crypt: {
            algorithm: common.crypt.algorithm,
            password: common.crypt.password,
        },
        search: common.search,
        data: {
            records: common.data.records,
            maxFields: common.data.maxFields,
            rfts: common.data.rfts,
        },
        save: common.save,
        themes: {
            active: common.themes.active,
            colors: common.themes.colors,
            props: common.themes.props,
        },
        icons: common.icons
    }
    let text = JSON.stringify(rec)
    sessionStorage.setItem('common', text)
}

/**
 * Restore the global state data from session storage.
 */
export function restoreCommon() {
    let now = new Date().toISOString()
    let wasm = common.crypt._wasm
    let store =  sessionStorage.getItem('common')
    if (store) {
        try {
            let jdata = JSON.parse(store)
            common.meta = jdata.meta
            common.ftype = jdata.ftype
            common.crypt.algorithm = jdata.crypt.algorithm
            common.crypt.password = jdata.crypt.password
            common.search = jdata.search
            common.data.records = jdata.data.records
            common.data.maxFields = jdata.data.maxFields
            common.data.rfts = jdata.data.rfts
            common.save = jdata.save
            if (jdata.themes.active.entry in common.themes.colors) {
                // handle the case where the session store contains
                // an theme thata no longer exists.
                common.themes.active.entry = jdata.themes.active.entry
                common.themes.colors = jdata.themes.colors
            }
            if (jdata.themes.active.prop in common.themes.props) {
                // handle the case where the session store contains
                // an theme thata no longer exists.
                common.themes.active.prop = jdata.themes.active.prop
                common.themes.props = jdata.themes.props
            }
            common.icons = jdata.icons
        } catch(e) {
            alert(`cannot parse session store\nerror: ${e}`)
        }
    }
    // fix the crypt algorithm references
    if (common.crypt.algorithm === '') {
        common.crypt.algorithm = wasm.get_algorithm(0)
    }
    common.meta.atime = now
    if (common.meta.mtime === '') {
        common.meta.mtime = now
    }
    if (common.meta.ctime === '') {
        common.meta.ctime = now
    }

    // set the title.
    header()
}

/**
 * Reset common to default values.
 * This is useful when reading files that are out of date.
 */
export function resetCommon() {
    common.themes.props = getThemeProps()
    common.themes.colors = getThemeColors()
    saveCommon()
}

/**
 * Populate the records title map for fast access.
 */
export function updateRecordsMap() {
    // re-order the records
    common.data.records.sort((a,b) => {
        let xa = a.__id__.toLowerCase()
        let xb = b.__id__.toLowerCase()
        return xa.localeCompare(xb)
    })
    common.data._map = {}
    for(let i=0; i<common.data.records.length; i++) {
        let rec = common.data.records[i]
        if ('__id__' in rec) {
            let k = rec.__id__
            common.data._map[k] = rec
        }
    }
}
