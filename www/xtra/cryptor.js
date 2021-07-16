import { enableFunctionChaining, xmake } from '/js/utils.js'
import { VERSION, BUILD, GIT_COMMIT_ID, GIT_BRANCH } from '/js/version.js'
import { generateCrypticPassword, generateMemorablePassword } from '/js/password.js'
import { words } from '/js/en_words.js'
import init, {
    decrypt,
    encrypt,
    get_algorithm,
    get_name,
    get_num_algorithms,
    header_prefix,
    header_suffix,
} from '/js/crypt.js';

enableFunctionChaining()

var crypt = {}
var cryptReady = false
var algorithm = ''
var filename = ''
var password = ''

async function loadCrypt() {
    await init()
    let fcts = {
        decrypt: decrypt, // decrypt(algorithm: string, password: string, plaintext: string) -> string
        encrypt: encrypt, // encrypt(algorithm: string, password: string, plaintext: string) -> string
        get_algorithm: get_algorithm, // get_algorithm(int) -> string
        get_name: get_name, // get_name() -> string (module name)
        get_num_algorithms: get_num_algorithms, // get_num_algorithms() -> int
        header_prefix: header_prefix, // header_prefix(algorithm: string) -> string
        header_suffix: header_suffix, // header_suffix(algorithm: string) -> string
    }
    crypt = fcts
    console.log('crypt.get_num_algorithms = ', crypt.get_num_algorithms())
    main()
}
loadCrypt()

function main() {
    console.log('document.readyState = ', document.readyState)
    console.log('crypt', crypt)
    console.log('crypt.get_num_algorithms = ', crypt.get_num_algorithms())
    document.getElementById('x-title').innerHTML = document.title
    loadAlgorithms()
    makeButtons()
    document.getElementById('x-version')
        .xInnerHTML(`
<table>
</tbody>
<tr><td>Version:</td><td>${VERSION}</td></tr>
<tr><td>Build:</td><td>${BUILD}</td></tr>
<tr><td>GitCommitId:</td><td>${GIT_COMMIT_ID}</td></tr>
<tr><td>GitBranch:</td><td>${GIT_BRANCH}</td></tr>
</tbody>
</table>
`)
    document.getElementById('x-text')
        .xAddEventListener('input', e => updateTextSize(e))
        .xAddEventListener('paste', e => updateTextSize(e))
        .xAddEventListener('click', e => updateTextSize(e))
        .xAddEventListener('change', e => updateTextSize(e))
    document.getElementById('x-password')
        .xAddEventListener('input', e => updatePasswordSize(e))
        .xAddEventListener('paste', e => updatePasswordSize(e))
        .xAddEventListener('click', e => updatePasswordSize(e))
        .xAddEventListener('change', e => updatePasswordSize(e))
    document.getElementById('x-filename-clear')
        .xAddEventListener('click', () => {document.getElementById('x-filename').value = ''})
    document.getElementById('x-password-clear')
        .xAddEventListener('click', () => {document.getElementById('x-password').value = ''})
    document.getElementById('x-password-show-hide')
        .xAddEventListener('click', () => togglePasswordShowHide())
    document.getElementById('x-password-cryptic')
        .xAddEventListener('click', (event) => {
            let e = document.getElementById('x-password')
            let p = generateCrypticPassword()
            e.value = p
            updatePasswordSize()
        })
        .xTooltip('generate a cryptic password')
    document.getElementById('x-password-memorable')
        .xAddEventListener('click', (event) => {
            let e = document.getElementById('x-password')
            let p = generateMemorablePassword()
            e.value = p
            updatePasswordSize()
        })
        .xTooltip('generate a memorable password')
}

function updateTextSize(e) {
    let value = document.getElementById('x-text').value
    document.getElementById('x-text-size').innerHTML = value.length
}

function updatePasswordSize() {
    let value = document.getElementById('x-password').value
    document.getElementById('x-password-size').innerHTML = value.length
}

function status(msg) {
    document.getElementById('x-status').innerHTML = msg
    setTimeout( () => {document.getElementById('x-status').innerHTML = ""}, 1500)
}

function loadAlgorithms() {
    algorithm = crypt.get_algorithm(0)
    let div = document.getElementById('x-algorithms-div')
    let num = crypt.get_num_algorithms()
    for(let i=0; i <num; i++) {
        let aname = crypt.get_algorithm(i)
        div.xAppendChild(
            xmake('input')
                .xAttr('type', 'radio')
                .xAttr('name', 'algorithm')
                .xAttrIfTrue('checked', 'checked', algorithm === aname)
                .xAttr('value', aname)
                .xAddEventListener('change', (e) => { algorithm = e.target.value } ), // jshint ignore:line
            xmake('label')
                .xAttr('for', aname)
                .xInnerHTML(aname),
            xmake('br'))
    }
}

function makeButtons() {
    let div = document.getElementById('x-buttons')
    div.xAppendChild(
        xmake('button')
            .xInnerHTML('Load File')
            .xTooltip('select and load file')
            .xAddEventListener('click',
                               () => {
                                   loadFile()
                               }),
        xmake('button')
            .xInnerHTML('Save File')
            .xTooltip('save to file')
            .xAddEventListener('click',
                               () => {
                                   saveFile()
                               }),
        xmake('button')
            .xInnerHTML('Clear Text Data')
            .xAddEventListener('click',
                               () => {
                                   document.getElementById('x-text').value = ''
                                   updateTextSize()
                               }),
        xmake('button')
            .xInnerHTML('Encrypt')
            .xAddEventListener('click',
                               (event) => {
                                   let password = document.getElementById('x-password').value
                                   let text = document.getElementById('x-text').value
                                   let result = crypt.encrypt(algorithm, password, text)
                                   document.getElementById('x-text').value = result
                                   updateTextSize()
                               }),
        xmake('button')
            .xInnerHTML('Decrypt')
            .xAddEventListener('click',
                               (event) => {
                                   let password = document.getElementById('x-password').value
                                   let text = document.getElementById('x-text').value
                                   let result = crypt.decrypt(algorithm, password, text)
                                   document.getElementById('x-text').value = result
                                   updateTextSize()
                               }),
        xmake('button')
            .xInnerHTML('Format JSON')
            .xAddEventListener('click',
                               (event) => {
                                   let text = document.getElementById('x-text').value
                                   let data = {}
                                   try {
                                       data = JSON.parse(text)
                                   } catch (exc) {
                                       alert(`JSON Format operation failed:\m ${exc}`)
                                       return
                                   }
                                   let result = JSON.stringify(data, null, 4)
                                   document.getElementById('x-text').value = result
                                   updateTextSize()
                               }),
        xmake('button')
            .xInnerHTML('Compress JSON')
            .xAddEventListener('click',
                               (event) => {
                                   let text = document.getElementById('x-text').value
                                   let data = {}
                                   try {
                                       data = JSON.parse(text)
                                   } catch (exc) {
                                       alert(`JSON Format operation failed:\m ${exc}`)
                                       return
                                   }
                                   let result = JSON.stringify(data)
                                   // TODO error handling
                                   document.getElementById('x-text').value = result
                                   updateTextSize()
                               }),
        xmake('button')
            .xInnerHTML('Copy')
            .xTooltip('copy to clipboard')
            .xAddEventListener('click',
                               (event) => {
                                   let value = document.getElementById('x-text').value
                                   navigator.clipboard.writeText(value).then((value) => {}, () => {
                                       alert('clipboard copy operation failed')})
                                   status(`copied ${value.length} bytes to the clipboard`)
                               }),
        xmake('span').xId('x-length'),
    )
}

function togglePasswordShowHide() {
    let e = document.getElementById('x-password')
    let b = document.getElementById('x-password-show-hide')
    //let b = event.currentTarget
    password = e.value
    if (e.type === 'password') {
        e.type = 'text'
        b.innerHTML = 'Hide Password'
    } else {
        e.type = 'password'
        b.innerHTML = 'Show Password'
    }
}

function loadFile() {
    let xid = 'x-load-file-selector'
    let input = xmake('input')
        .xId(xid)
        .xStyle({visibility: 'hidden'})
        .xAttr('value', filename)
        .xAttr('type', 'file')
        .xAttr('accept', '.txt,.text,.js')
        .xAddEventListener('change', (event)=> {
            const fileList = event.target.files
            if (fileList.length === 1) {
                var file = fileList[0]
                const reader = new FileReader()
                reader.addEventListener('load', (e) => {
                    const text = e.target.result
                    let t = file.type ? file.type : "unknown"
                    filename = file.name
                    let msg = `Loaded ${ text.length } bytes from: "${file.name}" (type: <code>${t}</code>).`
                    document.getElementById('x-text').value = text
                    document.getElementById('x-filename').value = filename.trim()
                    document.getElementById('x-text-size').innerHTML = text.length
                    status(msg)
                })
                reader.readAsText(file)
                let e = document.getElementById(xid)
                if (e) {
                    e.remove() // clean up
                }
            }
        })
        .xAddEventListener('click', (event)=> {
            setTimeout( () => {
                if (event.target && event.target.files.length === 0) {
                    status('No file was selected.')
                }
            }, 2000)
        })
    input.click()
}

function saveFile() {
    let filename = document.getElementById('x-filename').value.trim()
    let text = document.getElementById('x-text').value.trim()
    if( filename.length === 0 ) {
        alert('need to specify a file name')
        return
    }
    if( text.length === 0 ) {
        alert('no text to save')
        return
    }
    let e  = xmake('a')
        .xAttr('href','data:text/plain; charset=utf-8,' + encodeURIComponent(text.trim()))
        .xAttr('download', filename)
        .xStyle({display: 'none'})
    document.body.appendChild(e)
    e.click()
    e.remove()
    status(`saved ${text.length} bytes to ${filename}`)
}
