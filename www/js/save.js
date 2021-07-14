/**
 * Show the save page.
 * @module save
 */
import { VERSION, BUILD, GIT_COMMIT_ID, GIT_BRANCH } from '/js/version.js'
import { common } from '/js/common.js'
import { makeIcon, changeIcon } from '/js/icons.js'
import { hideMenu  } from '/js/header.js'
import { hideAll,
         xmake,
         makeTextButton
       } from '/js/utils.js'
import { expandAccordion,
         collapseAccordion,
         accordionPanelClass,
         accordionPanelImgClass,
         accordionPanelButtonClass,
         makeAccordionEntry } from '/js/accordion.js'

/**
 * Show the load page.
 */
export function showSavePage() {
    hideAll()
    hideMenu()
        let top = document.getElementById('page-save')
    top.style.display = 'block'
    top.xRemoveChildren()

    // create this page
    top.xAppendChild(
        xmake('center')
            .xId('x-save-content-id')
            .xAppendChild(
                xmake(common.themes._activeProp().header.subtitle.element)
                    .xInnerHTML('Save Page'),
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
        saveToClipboard(),
        saveDownload()
    )
}

/**
 * Create the accordion enrty to save data to the clipboard.
 */
function saveToClipboard() {
    return makeAccordionEntry('Paste Data to Clipboard',
                              xmake('div')
                              .xAppendChild(
                                  xmake('p')
                                      .xStyle(common.themes._activeProp().general.text)
                                      .xInnerHTML(`
Copy the encrypted data to the clipboard.`),
                                  xmake('center')
                                      .xAppendChild(
                                          makeTextButton('Paste the master password encrypted data to the clipboard"',
                                                         'Paste to Clipboard',
                                                         (e) => {
                                                             let text = encodeSaveData()
                                                             if (text.length) {
                                                                 let info = document.getElementById('x-save-paste-info')
                                                                 info.innerHTML = `Pasted ${ text.length } encrypted bytes to the clipboard.`
                                                                 navigator.clipboard.writeText(text).then((text) => {}, () => {
                                                                     alert('internal error: clipboard copy operation failed')})
                                                             }})
                                      ),
                                  xmake('p')
                                      .xStyle(common.themes._activeProp().general.text)
                                      .xStyle({textAlign: 'center'})
                                      .xAddClass('x-theme-element')
                                      .xId('x-save-paste-info')
                                      .xInnerHTML('')
                              ))
}

/**
 * Create the accordion entry to save the download to a file.
 * <p>
 * The term "download" is used because it uses the browser download functionality.
 */
function saveDownload() {
    return makeAccordionEntry('Download to File',
                              xmake('div')
                              .xAppendChild(
                                  xmake('p')
                                      .xStyle(common.themes._activeProp().general.text)
                                      .xInnerHTML(`
Download the master password encrypted data to a local file.`),
                                  xmake('center')
                                      .xAppendChild(
                                          xmake('input')
                                              .xStyle({
                                                  width: '90%',
                                                  fontSize: common.themes._activeProp().general.text.fontSize,
                                                  backgroundColor: common.themes._activeColors().bgColor,
                                                  color: common.themes._activeColors().fgColor})
                                              .xAttr('placeholder', 'file name')
                                              .xAttr('type', 'input')
                                              .xAttr('value', common.save.filename)
                                              .xId('x-save-download-file')
                                              .xAddClass('x-theme-element'),
                                          xmake('div').xStyle({height: '5px'}),
                                          makeTextButton('download to local file',
                                                         'Download',
                                                         (e) => {
                                                             let text = encodeSaveData()
                                                             let filename = document.getElementById('x-save-download-file').value
                                                             common.save.filename = filename
                                                             if (text.length) {
                                                                 download(filename, text)
                                                                 let info = document.getElementById('x-save-download-info')
                                                                 info.innerHTML = `Pasted ${ text.length } encrypted bytes to the file: ${filename}.`
                                                             }})
                                      ),
                                  xmake('p')
                                      .xStyle(common.themes._activeProp().general.text)
                                      .xStyle({textAlign: 'center'})
                                      .xAddClass('x-theme-element')
                                      .xId('x-save-download-info')
                                      .xInnerHTML('')
                              ))
}

/**
 * Download text data to a file by creating a popup file dialogue.
 * @example
 * download('file.txt', 'data')
 * @param {string} filename The file name to download to.
 * @param {string} text The file data.
 */
// download
// citation: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename, text) {
    if (filename.trim().length === 0) {
        alert('need to specify a file name')
        return
    }
    if (text.trim().length === 0) {
        alert('no text to download')
        return
    }
    let e  = xmake('a')
        .xAttr('href','data:text/plain; charset=utf-8,' + encodeURIComponent(text.trim()))
        .xAttr('download', filename)
        .xStyle({display: 'none'})
    document.body.appendChild(e)
    e.click()
    e.remove()
}

/**
 * Encrypt the data that is going to be saved.
 * <p>
 * This function defines the format of the file data.
 */
function encodeSaveData() {
    if (!common.crypt.password) {
        alert('cannot save without a password')
        return ''
    }

    let now = new Date().toISOString()
    let data = {
        crypt: {
            algorithm: common.crypt.algorithm,
        },
        ftype: common.ftype,
        rfts: common.data.rfts,
        meta: {
            atime: now,
            mtime: common.meta.mtime,
            ctime: common.meta.ctime,
            btime: BUILD,
            version: VERSION,
            gitCommitId: GIT_COMMIT_ID,
            gitBranch: GIT_BRANCH,
            title: common.meta.title,
        },
        themes: {
            active: common.themes.active,
            colors: common.themes.colors,
            props: common.themes.props,
        },
        records: common.data.records,
        maxFields: common.data.maxFields,
        filename: common.save.filename
    }
    let string = JSON.stringify(data, null, 4)
    let text = common.crypt._wasm.encrypt(common.crypt.algorithm, common.crypt.password, string)
    return text
}
