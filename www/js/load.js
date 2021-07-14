/**
 * Show the load page.
 * @module load
 */
import { common } from '/js/common.js'
import { makeIcon, changeIcon } from '/js/icons.js'
import { xmake,
         hideAll,
         makeIconButton,
         makeTextButton,
       } from '/js/utils.js'
import { header, hideMenu  } from '/js/header.js'
import { getExample  } from '/js/example.js'
import { expandAccordion,
         collapseAccordion,
         accordionPanelClass,
         accordionPanelImgClass,
         accordionPanelButtonClass,
         makeAccordionEntry } from '/js/accordion.js'

/**
 * Show the load page.
 */
export function showLoadPage() {
    hideAll()
    hideMenu()
    let top = document.getElementById('page-load')
    top.style.display = 'block'
    top.xRemoveChildren()

    // create this page
    top.xAppendChild(
        xmake('center')
            .xId('x-load-content-id')
            .xAppendChild(
                xmake(common.themes._activeProp().header.subtitle.element)
                    .xInnerHTML('Load Page'),
                xmake('button')
                    .xStyle({backgroundColor: common.themes._activeColors().bgColor, color: common.themes._activeColors().fgColor, marginBottom: '8px'})
                    .xAddClass('x-theme-element')
                    .xAppendChild(makeIcon(common.icons.expand, 'expand'))
                    .xTooltip('expand accordion panels')
                    .xAddEventListener('click', () => expandAccordion(top)),
                xmake('button')
                    .xStyle({backgroundColor: common.themes._activeColors().bgColor, color: common.themes._activeColors().fgColor, marginBottom: '8px'})
                    .xAddClass('x-theme-element')
                    .xAppendChild(makeIcon(common.icons.collapse, 'collapse'))
                    .xTooltip('collapse accordion panels')
                    .xAddEventListener('click', () => collapseAccordion(top))),
        loadExample(),
        loadClipboard(),
        loadFile(top),
        viewRawData()
    )
}

/**
 * Create the accordion enrty to load the internal example.
 */
function loadExample() {
    return makeAccordionEntry(
        'Internal Example',
        xmake('div')
            .xAppendChild(
                xmake('p')
                    .xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Load an example with 11 records that can be used to play around with the tool to learn how it is used.
Note that this operation changes the password to "example" and the title to "myExample". The password and title
values can be changed in the preferences.
`),
                xmake('center')
                    .xAppendChild(
                        makeTextButton('load the encrypted example using the password: "example"',
                                       'Load Example',
                                        (e) => {
                                            let data = getExample()
                                            common.crypt.password = 'example'
                                            let text = common.crypt._wasm.encrypt(common.crypt.algorithm, common.crypt.password, data)
                                            let info = document.getElementById('x-load-example-info')
                                            info.innerHTML = `Loaded ${ text.length } encrypted bytes.`
                                            setRawData(text)
                                        }),
                        xmake('p')
                            .xStyle(common.themes._activeProp().general.text)
                            .xStyle({textAlign: 'center'})
                            .xAddClass('x-theme-element')
                            .xId('x-load-example-info')
                            .xInnerHTML(''),
                    )))
}

/**
 * Create the accordion entry to paste from the clipboard.
 */
function loadClipboard() {
    return makeAccordionEntry(
        'Paste from Clipboard',
        xmake('div')
            .xAddClass('x-theme-element')
            .xAppendChild(
                xmake('p')
                    .xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Load the content of the clipboard as data and decrypt using the master password if necessary.
This option can be used to transfer data from a file that is open in an external editor.`),
                xmake('center')
                    .xAppendChild(
                        makeTextButton('paste from the clipboard',
                                       'Paste',
                                        (e) => {
                                            navigator.clipboard.readText().then( text => {
                                                let info = document.getElementById('x-load-paste-info')
                                                info.innerHTML = `Loaded ${ text.length } bytes.`
                                                setRawData(text)
                                            })})
                    ),
                xmake('p')
                    .xStyle(common.themes._activeProp().general.text)
                    .xStyle({textAlign: 'center'})
                    .xAddClass('x-theme-element')
                    .xId('x-load-paste-info')
                    .xInnerHTML('')
            ))
}

/**
 * Create the accordion entry to load a local file.
 * @param {element} top the element load page element (used for the file dialogue).
 */
function loadFile(top) {
    return makeAccordionEntry(
        'Read Local File',
        xmake('div')
            .xAddClass('x-theme-element')
            .xAppendChild(
                xmake('p')
                    .xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Load the content of a local file as data and decrypt using the master password if necessary.
`),
                xmake('center')
                    .xAppendChild(
                        makeTextButton('load local file',
                                       'Select File',
                                       (e) => {
                                           // Create a hidden file input element with event
                                           // handlers that reads the data and then clean up.
                                           let input = xmake('input')
                                               .xId('x-load-file-selector')
                                               .xStyle({visibility: 'hidden'})
                                               .xAttr('value', common.save.filename)
                                               .xAttr('type', 'file')
                                               .xAttr('accept', '.txt,.text,.js')
                                               .xAddEventListener('change', (event)=> {
                                                   const fileList = event.target.files
                                                   if (fileList.length === 1) {
                                                       var file = fileList[0]
                                                       const reader = new FileReader()
                                                       reader.addEventListener('load', (e) => {
                                                           const text = e.target.result
                                                           let info = document.getElementById('x-load-file-info')
                                                           let t = file.type ? file.type : "unknown"
                                                           common.save.filename = file.name
                                                           info.innerHTML = `Loaded ${ text.length } bytes from: "${file.name}" (type: <code>${t}</code>).`
                                                           setRawData(text)
                                                       })
                                                       reader.readAsText(file)
                                                       let e = document.getElementById('x-load-file-selector')
                                                       e.remove() // clean up
                                                   }
                                               })
                                               .xAddEventListener('click', (event)=> {
                                                   setTimeout( () => {
                                                       if (event.target.files.length === 0) {
                                                           let info = document.getElementById('x-load-file-info')
                                                           info.innerHTML = 'No file was selected.'
                                                       }
                                                   }, 2000)
                                               })
                                           top.appendChild(input)
                                           input.click()
                                       })),
                xmake('p')
                    .xStyle(common.themes._activeProp().general.text)
                    .xStyle({textAlign: 'center'})
                    .xAddClass('x-theme-element')
                    .xId('x-load-file-info')
                    .xInnerHTML('')
            ))
}


/**
 * Create the accordion entry to view the raw data.
 */
function viewRawData() {
    let eid = 'x-load-raw-data-buffer'
    let eidlen = 'x-load-raw-data-buffer-length'
    return makeAccordionEntry(
        'View Raw Data',
        xmake('div')
            .xAddClass('x-theme-element')
            .xAppendChild(
                xmake('p')
                    .xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
View or change the raw data that was loaded by the previous options.
This is useful for debugging or entering data manually.
If there is no data, reload the data.
`),
                xmake('textarea')
                    .xStyle({
                        backgroundColor: common.themes._activeColors().bgColor,
                        color: common.themes._activeColors().fgColor,
                        width: common.themes._activeProp().textareaColor,
                    })
                    .xStyle(common.themes._activeProp().general.textarea)
                    .xAddClass('x-theme-element')
                    .xAttr('rows', '10')
                    .xAttr('placeholder', 'Raw Data')
                    .xId(eid)
                    .xAddEventListener('input', () => {
                        let text = document.getElementById(eid).value
                        document.getElementById(eidlen).innerHTML = text.length
                        setRawData(text)
                    })
                    .xAddEventListener('paste', () => {
                        navigator.clipboard.readText().then( text => {
                            document.getElementById(eid).value = text
                            document.getElementById(eidlen).innerHTML = text.length
                            setRawData(text)
                        })
                    })
                    .xAddEventListener('change', () => {
                        let text = document.getElementById(eid).value
                        document.getElementById(eidlen).innerHTML = text.length
                        setRawData(text)
                    }),
                xmake('div').xStyle({marginTop: '10px'}),
                makeIconButton('clear the raw data', 'clear',  common.icons.clear, () => {
                    document.getElementById(eid).value = ''
                    document.getElementById(eidlen).innerHTML = '0'
                    setRawData('')
                }),
                makeIconButton('copy to clipboard', 'copy', common.icons.copy, () => {
                    let text = document.getElementById(eid).value
                    navigator.clipboard.writeText(text)
                }),
                makeIconButton('encrypt using master password', 'encrypt', common.icons.lock, (e) => {
                    let text = document.getElementById(eid).value.trim()
                    if (text.length === 0) {
                        alert('nothing to encrypt')
                    } else {
                        if ( !text.startsWith('{') ) {
                            alert('data is already encrypted')
                        } else {
                            // The data is JSON encrypt it.
                            let enc = common.crypt._wasm.encrypt(common.crypt.algorithm, common.crypt.password, text)
                            //setRawData(enc)
                            setRawData(text)
                            document.getElementById(eid).value = enc
                        }
                    }
                }),
                makeIconButton('decrypt using master password', 'decrypt', common.icons.unlock, (e) => {
                    let text = document.getElementById(eid).value.trim()
                    if (text.length === 0) {
                        alert('nothing to decrypt')
                    } else {
                        if ( text.startsWith('{') ) {
                            alert('data is already decrypted')
                        } else {
                            let dec = common.crypt._wasm.decrypt(common.crypt.algorithm, common.crypt.password, text)
                            setRawData(dec)
                        }
                    }
                }),
                makeIconButton('save raw data and use internally', 'save', common.icons.save, (e) => {
                    let text = document.getElementById(eid).value
                    setRawData(text)
                }),
                makeIconButton('format JSON', 'format', common.icons.expand, (e) => {
                    let text = document.getElementById(eid).value
                    let json = null
                    try {
                        json = JSON.parse(text)
                    } catch(event) {
                        alert(`cannot format, invalid JSON\nerror: ${ event }`)
                        return
                    }
                    let x  = JSON.stringify(json, null, 4)
                    setRawData(x)
                }),
                makeIconButton('unformat JSON', 'compress', common.icons.shrink, (event) => {
                    let text = document.getElementById(eid).value
                    let json = null
                    try {
                        json = JSON.parse(text)
                    } catch(exc) {
                        alert(`cannot compress, invalid JSON\nerror: ${ exc }`)
                        return
                    }
                    let x = JSON.stringify(json)
                    setRawData(x)
                }),
                xmake('span')
                    .xStyle({marginLeft: '5px'})
                    .xId(eidlen)
                    .xInnerHTML('0'),
            ))
}

/**
 * Get a value from an object path.
 * @example
 * let obj = {k1: 'v1', k2: 'v2', k3: {k3a: 1, k3b: 2}}
 * let x = getObjectValue(obj, '30', 'k3', 'k3b') // x == 2
 * let x = getObjectValue(obj, '30', 'k3', 'k3c') // x == 30
 * @param {object} obj The object to do the path search on.
 * @param {any} defaultValue The default value if the path is not found.
 * @param {...path} path Object path.
 */
// Get a value from the object if it exists.
function getObjectValue(obj, defaultValue, ...path) {
    let rec = obj
    for (let i=0; i<path.length; i++) {
        let key = path[i]
        if (!rec.hasOwnProperty(key)) {
            return defaultValue
        }
        rec = rec[key]
    }
    return rec
}

/**
 * Set the common data from JSON text.
 * <p>
 * If it the data is be encrypted, it is immediately decrypted using the master password.
 * @param {string} text The data.
 */
function setRawData(text) {
    text = text.trim()
    if (text.toLowerCase().startsWith('error:')) {
        alert(`cannot load data because of a decryption error, it is not valid JSON\nerror: ${text}`)
        return
    }

    if (text.length && !text.startsWith('{')) {
        // This is only done once at load time, the data is encrypted once during the save operation.
        let plaintext = common.crypt._wasm.decrypt(common.crypt.algorithm, common.crypt.password, text)
        if (plaintext.trim().toLowerCase().startsWith('error:')) {
            alert(`decryption failed\nplease re-enter the master password\nsymptom:\n${plaintext}`)
            return
        }
        text = plaintext.trim()
    }
    if (!text.startsWith('{')) {
        if (x.length) {
            alert('cannot load data, it is not JSON')
        }
    } else {
        let rec= {}
        try {
            if (text.length) {
                rec = JSON.parse(text)
            }
        } catch(e) {
            alert(`cannot load data, it is not valid JSON\nerror: ${ e }`)
        }

        // create the index to titles map
        let recs = getObjectValue(rec, [], 'records')
        let recmap = {}
        for(let i=0; i<recs; i++) {
            let rec = recs[i]
            if ('__id__' in rec) {
                let tid = rec.__id__
                if (tid in common.data._map) {
                    let j = x[tid]
                    alert(`internal error: duplicate found\nid: ${tid}\nindices: ${i} ${j}`)
                    return

                }
                common.data._map[tid] = i
            }
        }

        // populate interesting common fields.
        // see save.js::encodeSaveData for the format definition.
        common.data.records = recs
        common.data._map = recmap
        common.meta.ctime = getObjectValue(rec, common.meta.ctime, 'meta', 'ctime')
        common.meta.mtime = getObjectValue(rec, common.meta.mtime, 'meta', 'mtime')
        common.meta.btime = getObjectValue(rec, common.meta.btime, 'meta', 'btime')
        common.meta.version = getObjectValue(rec, common.meta.version, 'meta', 'version')
        common.meta.gitCommitId = getObjectValue(rec, common.meta.gitCommitId, 'meta', 'gitCommitId')
        common.meta.gitBranch = getObjectValue(rec, common.meta.gitBranch, 'meta', 'gitBranch')
        common.meta.title = getObjectValue(rec, common.meta.title, 'meta', 'title')
        common.crypt.algorithm = getObjectValue(rec, common.crypt.algorithm, 'crypt', 'algorithm')
        common.data.rfts = getObjectValue(rec, common.data.rfts, 'rfts')
        common.data.ftype = getObjectValue(rec, common.ftype, 'ftype')
        if ('themes' in rec) {
            if ('active' in rec.themes) {
                let a = rec.themes.active.entry
                if (!common.themes.colors.hasOwnProperty(a)) {
                    // handle the case where the file references a
                    // theme that no longer exists.
                    common.themes.active.entry = getObjectValue(rec, common.themes.active, 'themes', 'active', 'entry')
                    common.themes.colors = getObjectValue(rec, common.themes.colors, 'themes', 'colors')
                }
            }
            if ('activeProp' in rec.themes) {
                let p = rec.themes.active.prop
                if (!common.themes.props.hasOwnProperty(p)) {
                    // handle the case where the file references a
                    // theme that no longer exists.
                    common.themes.active.prop = getObjectValue(rec, common.themes.activeProp, 'themes', 'active', 'prop')
                    common.themes.props = getObjectValue(rec, common.themes.props, 'themes', 'props')
                }
            }
        }
        common.data.maxFields = getObjectValue(rec, common.data.maxFields, 'data', 'maxFields')
        common.save.filename = getObjectValue(rec, common.save.filename, 'filename')

        // update the raw data text box
        let eid = 'x-load-raw-data-buffer'
        let eidlen = 'x-load-raw-data-buffer-length'
        document.getElementById(eid).value = text
        document.getElementById(eidlen).innerHTML = text.length
        header()
    }
}
