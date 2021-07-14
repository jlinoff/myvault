/**
 * Show the preferences page.
 * @module preferences
 */
// The preferences page
import { common, displayTheme, TITLE, restoreCommon, resetCommon, updateRecordsMap } from '/js/common.js'
import { themes } from '/js/themes.js'
import { makeIcon, changeIcon } from '/js/icons.js'
import { hideAll,
         makeIconButton,
         makeTextButton,
         xmake,
         statusMsg } from '/js/utils.js'
import { hideMenu, header  } from '/js/header.js'
import { makePasswordEntry } from '/js/password.js'
import { expandAccordion,
         collapseAccordion,
         accordionPanelClass,
         accordionPanelImgClass,
         accordionPanelButtonClass,
         makeAccordionEntry } from '/js/accordion.js'

/**
 * The grid label style, populated by the theme.
 */
var gridLabelStyle = {}

/**
 * The grid value style, populated by the theme.
 */
var gridValueStyle = {}

/**
 * Center the accordion panel text.
 */
var prefsCenterDiv = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
}

/**
 * Show the preferences page.
 */
export function showPrefsPage() {
    hideAll()
    hideMenu()
    let top = document.getElementById('page-prefs')
    top.style.display = 'block' //  display this page
    top.xRemoveChildren()

    gridLabelStyle = common.themes._activeProp().records.gridLabelStyle
    gridValueStyle = common.themes._activeProp().records.gridValueStyle

    // Make the algorithms accordion button.
    // Use radio butttons
    // The WASM must have at least one algorithm

    // create this page
    top.xAppendChild(
        xmake('center')
            .xId('x-prefs-content-id')
            .xAppendChild(
                xmake(common.themes._activeProp().header.subtitle.element)
                    .xInnerHTML('Preferences Page'),
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

        // Encryption Algorithm
        prefsMasterPassword(),
        prefsAlgorithm(),
        prefsThemes(),
        prefsThemeProps(),
        prefsRecordFieldTemplates(),
        prefsFieldType(),
        prefsIconColorFilter(),
        prefsTitle(),
        prefsReset(),
        prefsRawEdit())

    }

/**
 * Show the accordion entry to choose the encryption algorithm.
 */
function prefsAlgorithm() {
    let num = common.crypt._wasm.get_num_algorithms()
    if (num === 0) {
        return xmake('span') // basically nothing
    }
    let ap = makeAccordionEntry(
        'Encryption Algorithm',
        xmake('div')
            .xStyle(common.themes._activeProp().accordion.panel)
            .xId('x-prefs-algorithm-div')
            .xAppendChild(
                xmake('p')
                    .xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML('Choose the algorithm to use for encryption and decryption.'),
            ))
    let adiv = ap.lastChild //getElementById('x-prefs-algorithm-div')
    for(let i=0; i <num; i++) {
        let aname = common.crypt._wasm.get_algorithm(i)
        adiv.xAppendChild(
            xmake('input')
                .xAttr('type', 'radio')
                .xAttr('name', 'algorithm')
                .xAttrIfTrue('checked', 'checked', common.crypt.algorithm === aname)
                .xAttr('value', aname)
                .xAddEventListener('change', (e) => { common.crypt.algorithm = e.target.value } ), // jshint ignore:line
            xmake('label')
                .xAttr('for', aname)
                .xInnerHTML(aname),
            xmake('br'))
    }
    adiv.xAppendChild(xmake('br'))
    return ap
}

/**
 * Show the accordion entry to choose or manage the theme colors.
 */
function prefsThemes() {
    let text = JSON.stringify(common.themes.colors, null, 4)
    let eid = 'x-prefs-themes-buffer'
    let eidlen = eid + '-length'
    let div =  makeAccordionEntry(
        'Theme Colors',
        xmake('div')
            .xStyle(common.themes._activeProp().accordion.panel)
            .xAppendChild(
                xmake('p').xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Set or customize the theme background and foreground colors that you want to use.
The colors can be specified as name: "red" or a hex value "#0000ff".
`),
                makeThemeColorsSelectBox(),
                xmake('br'),
                xmake('textarea')
                    .xStyle({
                        backgroundColor: common.themes._activeColors().bgColor,
                        color: common.themes._activeColors().fgColor,
                        marginTop: '5px',
                    })
                    .xStyle(common.themes._activeProp().general.textarea)
                    .xAddClass('x-theme-element')
                    .xAttr('rows', '10')
                    .xAttr('placeholder', 'theme definitions')
                    .xId(eid)
                    .xInnerHTML(text),
                xmake('br'),
                xmake('div')
                    .xStyle({marginTop: '5px'})
                    .xAppendChild(
                        makeIconButton('copy to clipboard', 'copy', common.icons.copy, () => {
                            let text = document.getElementById(eid).value
                            navigator.clipboard.writeText(text).then((text) => {}, () => {
                                alert('internal error: clipboard copy operation failed')})
                        }),
                        makeIconButton('save', 'save', common.icons.pencil, () => {
                            let text = document.getElementById(eid).value
                            let rec = null
                            try {
                                rec = JSON.parse(text)
                            } catch(e) {
                                alert(`cannot save, invalid JSON\nerror: ${ e }`)
                                return
                            }
                            common.themes.colors = rec
                            displayTheme()
                            header()
                            showPrefsPage()
                        }),
                        xmake('span')
                            .xId(eidlen)
                            .xInnerHTML(text ? text.length : '?'),
                        xmake('div').xStyle({marginTop: '10px'}).xInnerHTML(' ')
                    )
            )
    )
    return div
}

/**
 * Show the accordion entry to choose or manage the theme properties.
 */
function prefsThemeProps() {
    let text = JSON.stringify(common.themes.props, null, 4)
    let eid = 'x-prefs-themes-props-buffer'
    let eidlen = eid + '-length'
    let div =  makeAccordionEntry(
        'Theme Properties',
        xmake('div')
            .xStyle(common.themes._activeProp().accordion.panel)
            .xAppendChild(
                xmake('p').xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Set or customize the theme properties.
The properties are font sizes, icon sizes, layout information and spacing.
This information is used internally by the webapp for dynamic styling.
Basically everything but the color scheme.
It is not user friendly because it requires knowledge of the internal implementation.
`),
                makeThemePropsSelectBox(),
                xmake('br'),
                xmake('textarea')
                    .xStyle({
                        backgroundColor: common.themes._activeColors().bgColor,
                        color: common.themes._activeColors().fgColor,
                        marginTop: '5px',
                    })
                    .xStyle(common.themes._activeProp().general.textarea)
                    .xAddClass('x-theme-element')
                    .xAttr('rows', '10')
                    .xAttr('placeholder', 'theme definitions')
                    .xId(eid)
                    .xInnerHTML(text),
                xmake('br'),
                xmake('div')
                    .xStyle({marginTop: '5px'})
                    .xAppendChild(
                        makeIconButton('copy to clipboard', 'copy', common.icons.copy, () => {
                            let text = document.getElementById(eid).value
                            navigator.clipboard.writeText(text).then((text) => {}, () => {
                                alert('internal error: clipboard copy operation failed')})
                        }),
                        makeIconButton('save', 'save', common.icons.pencil, () => {
                            let text = document.getElementById(eid).value
                            let rec = null
                            try {
                                rec = JSON.parse(text)
                            } catch(e) {
                                alert(`cannot save, invalid JSON\nerror: ${ e }`)
                                return
                            }
                            common.themes.props = rec
                            displayTheme()
                            header()
                            showPrefsPage()
                        }),
                        xmake('span')
                            .xId(eidlen)
                            .xInnerHTML(text ? text.length : '?'),
                        xmake('div').xStyle({marginTop: '10px'}).xInnerHTML(' ')
                    )
            )
    )
    return div
}

/**
 * Create the theme colors selection box.
 */
function makeThemeColorsSelectBox() {
    let sid = 'x-prefs-themes-select'
    let eid = sid + '-entry'
    let select = xmake('span')
    let entries = xmake('select').xId(sid)
        .xStyle(
            {
                backgroundColor: common.themes._activeColors().bgColor,
                color: common.themes._activeColors().fgColor,
                marginLeft: '5px'})
        .xAddClass('x-theme-element')
        .xAddEventListener('change', (e) => {
            common.themes.active.entry = e.target.value
            displayTheme()
            header()
            showPrefsPage()
        })

    for (const key of Object.keys(common.themes.colors)) {
        let opt = xmake('option').xAttr('value', key).xAttr('text', key).xInnerHTML(key)
        if (key === common.themes.active.entry) {
            opt.xAttr('selected', true)
        }
        entries.xAppendChild(opt)
    }

    select.xAppendChild(
        xmake('label')
            .xStyle(
                {
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '5px'})
            .xAddClass('x-theme-element')
            .xAttr('htmlFor', 'sid')
            .xInnerHTML('Choose Active Themes'),
        entries,
    )
    return select
}

/**
 * Create the theme properties selection box.
 */
function makeThemePropsSelectBox() {
    let sid = 'x-prefs-theme-propss-select'
    let eid = sid + '-entry'
    let select = xmake('span')
    let entries = xmake('select').xId(sid)
        .xStyle(
            {
                backgroundColor: common.themes._activeColors().bgColor,
                color: common.themes._activeColors().fgColor,
                marginLeft: '5px'})
        .xAddClass('x-theme-element')
        .xAddEventListener('change', (e) => {
            common.themes.active.prop = e.target.value
            displayTheme()
            header()
            showPrefsPage()
        })

    for (const key of Object.keys(common.themes.props)) {
        let opt = xmake('option').xAttr('value', key).xAttr('text', key).xInnerHTML(key)
        if (key === common.themes.active.prop) {
            opt.xAttr('selected', true)
        }
        entries.xAppendChild(opt)
    }

    select.xAppendChild(
        xmake('label')
            .xStyle(
                {
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '5px'})
            .xAddClass('x-theme-element')
            .xAttr('htmlFor', 'sid')
            .xInnerHTML('Choose Active Props'),
        entries,
    )
    return select
}

/**
 * Create the accordion entry to define custom field record templates.
 */
function prefsRecordFieldTemplates() {
    let text = JSON.stringify(common.data.rfts, null, 4)
    let eid = 'x-prefs-rtfs-buffer'
    let eidlen = eid + '-length'
    return makeAccordionEntry(
        'Record Field Templates',
        xmake('div')
        .xStyle(common.themes._activeProp().accordion.panel)
            .xAppendChild(
                xmake('p').xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Define custom record field templates. These provide a way to quickly define common record fields.
Please use all caps and numbers for the template names to guarantee that internal processing works.
`),
                xmake('textarea')
                    .xStyle({
                        backgroundColor: common.themes._activeColors().bgColor,
                        color: common.themes._activeColors().fgColor,
                        marginTop: '5px',
                    })
                    .xStyle(common.themes._activeProp().general.textarea)
                    .xAddClass('x-theme-element')
                    .xAttr('rows', '10')
                    .xAttr('placeholder', 'record field templates JSON')
                    .xId(eid)
                    .xInnerHTML(text),
                xmake('br'),
                xmake('div')
                    .xStyle({marginTop: '5px'})
                    .xAppendChild(
                        makeIconButton('copy to clipboard', 'copy', common.icons.copy, () => {
                            let text = document.getElementById(eid).value
                            navigator.clipboard.writeText(text).then((text) => {}, () => {
                                alert('internal error: clipboard copy operation failed')})
                        }),
                        makeIconButton('save', 'save', common.icons.pencil, () => {
                            let text = document.getElementById(eid).value
                            let rec = null
                            try {
                                rec = JSON.parse(text)
                            } catch(e) {
                                alert(`cannot save, invalid JSON\nerror: ${ e }`)
                                return
                            }
                            common.data.rfts = rec
                        }),
                        xmake('span')
                            .xId(eidlen)
                            .xInnerHTML(text ? text.length : '?')))
    )
    return  makeAccordionEntry(title, kvpairs)
}

/**
 * Create the accordion entry to define custom maps between field
 * names and field value types.
 */
function prefsFieldType() {
    let text = JSON.stringify(common.ftype, null, 4) || '[]'
    let eid = 'x-prefs-ftype-buffer'
    let eidlen = eid + '-length'
    return makeAccordionEntry(
        'Record Field Name Value Type Map',
        xmake('div')
        .xStyle(common.themes._activeProp().accordion.panel)
            .xAppendChild(
                xmake('p').xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Define the custom record field name value type map. These change the
value types based on the field name.  For example a field named
"passphrase" will create a password field. The valid types are string,
password and textarea. The rex values are interpreted as case
insensitive regular expresssions.
`),
                xmake('br'),
                xmake('textarea')
                    .xStyle(
                        {
                            display: 'grid',
                            gridTemplateColumns: 'max-content auto', // label value
                            backgroundColor: common.themes._activeColors().bgColor,
                            color: common.themes._activeColors().fgColor,
                            marginTop: '5px',
                        })
                    .xStyle(common.themes._activeProp().general.textarea)
                    .xAddClass('x-theme-element')
                    .xAttr('rows', '10')
                    .xAttr('placeholder', 'record field templates JSON')
                    .xId(eid)
                    .xInnerHTML(text),
                xmake('br'),
                xmake('div')
                    .xStyle({marginTop: '5px'})
                    .xAppendChild(
                        makeIconButton('copy to clipboard', 'copy', common.icons.copy, () => {
                            let text = document.getElementById(eid).value
                            navigator.clipboard.writeText(text).then((text) => {}, () => {
                                alert('internal error: clipboard copy operation failed')})
                        }),
                        makeIconButton('save', 'save', common.icons.pencil, () => {
                            let text = document.getElementById(eid).value
                            let rec = null
                            try {
                                rec = JSON.parse(text)
                            } catch(e) {
                                alert(`cannot save, invalid JSON\nerror: ${ e }`)
                                return
                            }
                            common.data.rfts = rec
                        }),
                        xmake('span')
                            .xId(eidlen)
                            .xInnerHTML(text.length)))
    )
    return  makeAccordionEntry(title, kvpairs)
}

/**
 * Create the accordion entry to manage the icon color filer discovery.
 *<p>
 * It is not used at this time.
 */
function prefsIconColorFilter() {
    let text = JSON.stringify(common.iconFillColorFilter, null, 4)
    let eid = 'x-prefs-icon-color-filter-buffer'
    let eidlen = eid + '-length'
    let div =  makeAccordionEntry(
        'Icon Fill Color Filter Algorithm Settings',
        xmake('div')
            .xStyle(common.themes._activeProp().accordion.panel)
            .xAppendChild(
                xmake('p').xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Set the parameters for discovering the color filter for the SVG icon fill valus.
Note that this assumes that the fill color is #000000 (black).
maxTries is the maximum number of iterations to try before giving up.
maxLoss is the maximum acceptable loss and cache is the cache of already
processessed colors. <i>It is not used at this time</i>.
`),
                xmake('br'),
                xmake('textarea')
                    .xStyle({
                        backgroundColor: common.themes._activeColors().bgColor,
                        color: common.themes._activeColors().fgColor,
                        marginTop: '5px',
                    })
                    .xStyle(common.themes._activeProp().general.textarea)
                    .xAddClass('x-theme-element')
                    .xAttr('rows', '10')
                    .xAttr('placeholder', 'theme definitions')
                    .xId(eid)
                    .xInnerHTML(text),
                xmake('br'),
                xmake('div')
                    .xStyle({marginTop: '5px'})
                    .xAppendChild(
                        makeIconButton('copy to clipboard', 'copy', common.icons.copy, () => {
                            let text = document.getElementById(eid).value
                            navigator.clipboard.writeText(text).then((text) => {}, () => {
                                alert('internal error: clipboard copy operation failed')})
                        }),
                        makeIconButton('save', 'save', common.icons.pencil, () => {
                            let text = document.getElementById(eid).value
                            let rec = null
                            try {
                                rec = JSON.parse(text)
                            } catch(e) {
                                alert(`cannot save, invalid JSON\nerror: ${ e }`)
                                return
                            }
                            common.iconFillColorFilter = rec
                            displayTheme()
                            header()
                            showPrefsPage()
                        }),
                        xmake('span')
                            .xId(eidlen)
                            .xInnerHTML(text ? text.length : '?'))
            )
    )
    return div
}

/**
 * Create the accordion entry to change the title.
 */
function prefsTitle() {
    return makeAccordionEntry(
        'Change Title',
        xmake('div')
            .xStyle(common.themes._activeProp().accordion.panel)
            .xAppendChild(
                xmake('p').xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Change the application title.
`),
                xmake('div')
                    .xStyle(prefsCenterDiv)
                    .xAppendChild(
                        xmake('input')
                            .xStyle({
                                backgroundColor: common.themes._activeColors().bgColor,
                                color: common.themes._activeColors().fgColor,
                                minWidth: '64ch',
                            })
                            .xStyle(common.themes._activeProp().general.text)
                            .xId('x-prefs-title-input')
                            .xAttr('value', common.meta.title)
                            .xAttr('placeholder', 'app title'),
                        xmake('span')
                            .xAppendChild(
                                makeTextButton('change the app title',
                                               'Change',
                                               (e) => {
                                                   let x = document.getElementById('x-prefs-title-input')
                                                   common.meta.title = x.value
                                                   header()
                                                   showPrefsPage()
                                               }),
                                makeTextButton('change the app title to the default name',
                                               'Default',
                                               (e) => {
                                                   let x = document.getElementById('x-prefs-title-input')
                                                   common.meta.title = TITLE
                                                   header()
                                                   showPrefsPage()
                                               }),
                            )
                    )
            )
    )
}

/**
 * Change the accordion entry to clear the session storage.
 * <p>
 * This is useful during development when there are format changes to
 * the common data structure.
 */
// reset - clear the session storage
function prefsReset() {
    return makeAccordionEntry(
        'Reset',
        xmake('div')
            .xStyle(common.themes._activeProp().accordion.panel)
            .xAppendChild(
                xmake('p').xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Reset the internal state by clearing the internal session storage and
reloading. This is useful during development when there are format
changes to the common data structure.
`),
                xmake('div')
                    .xStyle(prefsCenterDiv)
                    .xAppendChild(
                        makeTextButton('clear session storage', 'Reset', (e) => {
                            sessionStorage.removeItem('common')
                            let status = document.getElementById('x-prefs-reset-status')
                            let store =  sessionStorage.getItem('common')
                            restoreCommon() // reload the raw default common data
                            if (!store) {
                                statusMsg('session storage cleared - reloading the page')
                            } else {
                                alert( `session storage not cleared: ${store.length} bytes remaining`)
                                return
                            }
                            resetCommon()
                            //location.reload(true)
                            displayTheme()
                            header()
                            showPrefsPage()
                        }),
                    )
            )
    )
}

/**
 * Create the accordion entry that allows the raw internal common data
 * to be edited.
 *<p>
 * This is not for the faint of heart. It can break the program
 * because it allows full access to the internals.
 */
// raw edit of the common data
function prefsRawEdit() {
    let text = JSON.stringify(common, null, 4)
    let eid = 'x-prefs-raw-common-buffer'
    let eidlen = eid + '-length'
    return makeAccordionEntry(
        'Raw Edit',
        xmake('div')
            .xStyle(common.themes._activeProp().accordion.panel)
            .xAppendChild(
                xmake('p').xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Edit the raw preferences data. This is not for the faint of heart.  It
can break the program because it allows full access to the internals.
`),
                xmake('br'),
                xmake('textarea')
                    .xStyle(
                        {
                            display: 'grid',
                            gridTemplateColumns: 'max-content auto', // label value
                            backgroundColor: common.themes._activeColors().bgColor,
                            color: common.themes._activeColors().fgColor,
                            marginTop: '5px'})
                    .xStyle(common.themes._activeProp().general.textarea)
                    .xAddClass('x-theme-element')
                    .xAttr('rows', '10')
                    .xAttr('placeholder', 'record field templates JSON')
                    .xId(eid)
                    .xInnerHTML(text),
                xmake('br'),
                xmake('div')
                    .xStyle({marginTop: '5px'})
                    .xAppendChild(
                        makeIconButton('save', 'save', common.icons.pencil, () => {
                            let text = document.getElementById(eid).value
                            let rec = null
                            try {
                                rec = JSON.parse(text)
                            } catch(e) {
                                alert(`cannot save, invalid JSON\nerror: ${ e }`)
                                return
                            }
                            for (const key of Object.keys(rec)) {
                                if (key === 'crypt' ) {
                                    continue // user cannot change the crypt stuff
                                }
                                if (key === 'themes') {
                                    // do not overwrite the internal fields.
                                    for(const k in ['active', 'props', 'colors']) {
                                        if (k in rec[key]) {
                                            common[key][k] = rec[key][k]
                                        }
                                    }
                                    continue
                                }
                                common[key] = rec[key]
                            }
                            updateRecordsMap()
                            statusMsg('raw edit data saved')

                        }).xId('x-prefs-raw-edit-save'),
                        makeIconButton('copy to clipboard', 'copy', common.icons.copy, () => {
                            let text = document.getElementById(eid).value
                            navigator.clipboard.writeText(text).then((text) => {}, () => {
                                alert('internal error: clipboard copy operation failed')})
                            statusMsg(`copied ${text.length} bytes`)
                        }),
                        makeIconButton('format JSON', 'format', common.icons.expand, (e) => {
                            let text = document.getElementById(eid).value
                            let json = null
                            try {
                                json = JSON.parse(text)
                            } catch (event) {
                                alert(`cannot format, invalid JSON\nerror: ${ event }`)
                                return
                            }
                            let x  = JSON.stringify(json, null, 4)
                            document.getElementById(eid).value = x
                            document.getElementById(eidlen).innerHTML = x.length
                        }),
                        makeIconButton('unformat JSON', 'compress', common.icons.shrink, (e) => {
                            let text = document.getElementById(eid).value
                            let json = null
                            try {
                                json = JSON.parse(text)
                            } catch (event) {
                                alert(`cannot compress, invalid JSON\nerror: ${ event }`)
                                return
                            }
                            let x  = JSON.stringify(json)
                            document.getElementById(eidlen).innerHTML = x.length
                            document.getElementById(eid).value = x
                        }),
                        xmake('span')
                            .xId(eidlen)
                            .xInnerHTML(text ? text.length : '?')))
    )
    return  makeAccordionEntry(title, kvpairs)
}

/**
 * Create the accordion entry to set the master password.
 *<p>
 * This is the pasword that is used encrypt and decrypt data duing
 * load and save operations.
 */
// master password
function prefsMasterPassword() {
    return makeAccordionEntry(
        'Master Password',
        xmake('div')
            .xStyle(common.themes._activeProp().accordion.panel)
            .xAppendChild(
                xmake('p').xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML(`
Set the master password. This is the password that is used to encrypt and decrypt file contents.
It is what keeps your data safe. Do not share this password and do not lose it.
If the password is lost, the data <i>cannot</i> be recovered.
Try to make the password hard to guess.
This panel will provide options when you press on the gear/gears butttons.
It does not try to grade your password for strength.
That is up to you to decide.
`),
                makePasswordEntry('password',
                                  () => { return common.crypt.password},  // Getter
                                  (value) => {common.crypt.password = value}  // Setter
                                 ).xStyle({marginBottom: common.themes._activeProp().accordion.panel.padding})
            )
    )
}
