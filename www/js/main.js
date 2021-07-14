
/**
 * The main entry point for the application.
 * @module main
*/
import { xmake, enableFunctionChaining, statusMsg } from '/js/utils.js'
import { header  } from '/js/header.js'
import { common, displayTheme, saveCommon, restoreCommon } from '/js/common.js'
import { showAboutPage } from '/js/about.js'


import init, {
decrypt,
    encrypt,
    get_algorithm,
    get_name,
    get_num_algorithms,
    header_prefix,
    header_suffix,
} from '/js/crypt.js';

/**
 * Enable function chaining for all elements to allow elements to be
 * grouped in an interesting way.
 */
enableFunctionChaining()

/**
 * Load the Rust encryption/decryption algorithms from WebAssembly.
 * It updates the common.crypt fields.
 */
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
    common.crypt._wasm = fcts
    restoreCommon()
}
loadCrypt()

/**
 * When the window is closed make sure that the state is saved.
 * This was implemented befor i chose to use session storage rather
 * than local storage and can probably be removed.
 * @global
 */
window.addEventListener('beforeunload', () => {
    console.log('beforeunload')
    saveCommon()
})

/**
 * Actions to take when the window is loaded.
 * @global
 */
window.onload = () => { main() }

/**
 * Main entry point for the application.
 * <p>
 * It sets up a bunch of stuff which takes a bit of time so it assumes
 * that
 * [loadCrypt()]{@link module:main~loadCrypt}.
 * is complete which obviates the need for a
 * document.readyState check.
 * <p>
 * If race problem is ever observed, the logic
 * should be modified so that main() is called by
 * but since this works there is no reason to change it.
 */
function main() {
    header()
    displayTheme()

    let style = document.createElement('style');
    style.innerHTML = loadMainCSS()
    document.head.append(style)

    // Setup the basic main pages.
    let pageNames = [ 'about', 'prefs', 'load', 'data', 'save']
    for(let i = 0; i < pageNames.length; i++) {
        let name = 'page-' + pageNames[i]
        document.body.append(
            xmake('div')
                .xId(name)
                .xAddClass('x-spa-page')
                .xStyle({display: 'none'}))
    }
    showAboutPage() // initial splashscreen
}

/**
 * Define a few application wide style elements.
 * Some of the css logic could be replaced with <code>@media</code> declarations.
* @returns {string} css text
 */
function loadMainCSS() {
    let width = '1000px'  // default
    let mlr = 'auto'
    if (window.innerWidth < 1000) {
        width = window.innerWidth - 20
        mlr = '5px'
    }
    document.body.xStyle( common.themes._activeProp().body)
    let text =`
.x-spa-page {
  width: ${ width };
  margin-top: 3em;
  margin-left: ${mlr};
  margin-right: ${mlr};
 }

.x-hover:hover {
   font-style: italic;
}

.x-vertical-center {
  margin-top: 0;
  margin-bottom: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
`
    return text;
}
