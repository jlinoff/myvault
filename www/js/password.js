/**
 * Password support.
 * @module password
 */
import { xmake, makeInputXWrapper, statusMsg } from '/js/utils.js'
import { makeIcon, changeIcon } from '/js/icons.js'
import { words } from '/js/en_words.js'
import { common } from '/js/common.js'

/**
 * Internal utility function to generate a cryptic password composed
 * of letters, digits and special characters.
 * @example
 * password1 = generateCrypticPassword()
 * password2 = generateCrypticPassword({minlen: 64, maxlen: 64})
 * asssert password2.length == 62
 * asssert password2.length > password1.length
 * @param {object} opts The password options object.
 * It defines the alphabet, the minimum length (minlen) and maximum length (maxlen) of
 * the password that is to be generated. The default minimum length is 15
 * and the maximum length is 31.
 * @returns {string} The generated password.
 */
export function generateCrypticPassword(opts) {
    function getval(prop, defval) {
        if (!opts) {
            return defval
        }
        if (opts.hasOwnProperly(prop)) {
            return opts.minlen
        }
        return defval
    }
    let alphabet = getval('alphabet', "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-!.");
    let size = alphabet.length;
    let result = '';
    let minlen = getval('minval', 15)
    let maxlen = getval('maxval', 31)

    // Add a touch more randomness.
    var num_rounds = Math.floor(Math.random() * (100));
    for (let j=0; j < num_rounds; j++) {
        var length = Math.floor(Math.random() * (maxlen - minlen)) + minlen;
        let array;
        if ('Uint8Array' in self && 'crypto' in self) {
            array = new Uint8Array(length);
            self.crypto.getRandomValues(array);
        } else {
            array = new Array(length);
            for (let i = 0; i < length; i++) {
                array[i] = Math.floor(Math.random() * 62);
            }
        }
        result = '';  // reset each round
        for (let i=0; i < length; i++) {
            result += alphabet.charAt(array[i] % size);
        }
    }
    return result;
}

/**
 * Get a random word of a specific length from the en_words word list.
 * @example
 * let word = getRandomWord(3, 7)
 * assert word.length >= 3
 * assert word.length <= 7
 * @param {number} minlen The minimum word length.
 * @param {number} maxlen The maximum word length.
 * @returns {string} the word.
 */
function getRandomWord(minlen, maxlen) {
    var i = Math.floor(Math.random() * words.length);
    var word = words[i];
    while (word.length < minlen || word.length > maxlen) {
        i = Math.floor(Math.random() * words.length);
        word = words[i];
    }
    return word;
}

/**
* Generate a human readable (memorable) password between 15 and 31
* characters where each word is separated by a forward slash.
* <p>
* The decision to not parameterize the word size, password size and
* separator was deliberate to keep things simple. In the future it
* might make sense to make those parameters dynamic by adding them
* to the common parameters.
* @example
* let password = generateMemorablePassword()
* assert password.count('/') == 2
* assert password.length >= 15
* @returns {string} The memorable password.
*/
export function generateMemorablePassword() {
    const tminlen = 15; // minimum password length
    const tmaxlen = 31; // maximum password length
    const wminlen = 3; // minimum word length
    const wmaxlen = 15; // maximum word length
    const sep = '/'; // hard coded separator
    var result = '';
    while (result.length < tminlen || result.length > tmaxlen) {
        result = '';
        for(var i=0; i<3; i++) {
            var word = getRandomWord(wminlen, wmaxlen);
            if (i) {
                result += sep;
            }
            result += word;
        }
    }
    return result;
}
// ========================================================================
//
// DOM Setup
//
// ========================================================================
/**
 * Create the password input DOM element with the buttons to show/hide
 * button, generate cryptic password button generate the memorable
 * password button, copy the password button and the password length
 * display element.
 * @example
 * let element = makePasswordEntry('password',
 *                                 () => { return common.crypt.password},  // Getter
 *                                 (value) => {common.crypt.password = value})  // Setter
 * @param {string} placeholder The placeholder text in the input element.
 * @param {function} getter The function to call to get the value.
 * @param {function} getter The function to call to set the value.
 * @returns {element} The DOM element that contains the password input elements.
 */
export function makePasswordEntry(placeholder, getter, setter) {
    let value = getter() || ''
    return xmake('div')
        .xStyle(common.themes._activeProp().password.topdiv)
        .xAppendChild(
            makeInputXWrapper(
                xmake('input')
                    .xAttr('type', 'password')
                    .xStyle(common.themes._activeProp().password.css)
                    .xStyle({
                        backgroundColor: common.themes._activeColors().bgColor,
                        color: common.themes._activeColors().fgColor,
                    })
                    .xAddClass('x-password-input')
                    .xAddClass('x-theme-element')
                    .xAttr('placeholder', placeholder)
                    .xAttr('value', value)
                    .xAddEventListener('input', e => updatePassword(e, setter))
                    .xAddEventListener('click', e => updatePassword(e, setter))
                    .xAddEventListener('paste', e => updatePassword(e, setter))
                    .xAddEventListener('change', e => updatePassword(e, setter)))
                .xStyle({width: common.themes._activeProp().password.input.width}),
            xmake('span')
                .xStyle({marginLeft: '5px'})
                .xAddClass('x-password-length')
                .xInnerHTML(value.length),
            xmake('button')
                .xStyle({
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '10px',
                })
                .xAddClass('x-theme-element')
                .xAddEventListener('click', e => showHidePassword(e))
                .xTooltip('show or hide the password')
                .xAppendChild(makeIcon(common.icons.eyeBlocked, 'show').xAddClass('x-show-hide-img')),
            xmake('button')
                .xStyle({
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '10px',
                })
                .xAddClass('x-theme-element')
                .xAddEventListener('click', e => generateCrypticPasswordHandler(e))
                .xTooltip('generate pseudo-random cyptic password')
                .xAppendChild(makeIcon(common.icons.cog, 'generate').xAddClass('x-show-hide-img')),
            xmake('button')
                .xStyle({
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '10px',
                })
                .xAddClass('x-theme-element')
                .xAddEventListener('click', e => generateMemorablePasswordHandler(e))
                .xTooltip('generate pseudo-random memorable password')
                .xAppendChild(makeIcon(common.icons.cogs, 'generate2').xAddClass('x-show-hide-img')),
            xmake('button')
                .xStyle({
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '10px',
                })
                .xAddClass('x-theme-element')
                .xAddEventListener('click', e => copyPassword(e))
                .xTooltip('copy password to clipboard for pasting to external applications')
                .xAppendChild(makeIcon(common.icons.copy, 'copy').xAddClass('x-show-hide-img')))
}

// Make a password entry with an ID - not DRY!!! needs to be fixed
/**
 * Create the password input DOM element with the buttons to show/hide
 * button, generate cryptic password button generate the memorable
 * password button, copy the password button and the password length
 * display element with a user specified input id and class to make it
 * easier to directly access and manipulate the input elements.
 * <p>
 * This is used to make custom password inputs for each record which is
 * why the getter an setter functions are not needed.
 * <p>
 * Note that this code need to be DRYed up in the future because it replicates
 * code in makePasswordEntry().
 * @example
 * let cls = 'x-data-field-value-element'
 * let p1 = makePasswordEntryWithId('x-pass-1', cls, 'secret1')
 * let p2 = makePasswordEntryWithId('x-pass-2', cls, 'secret2')
 * let p3 = makePasswordEntryWithId('x-pass-3', cls, 'secret3')
 * // later after the user entered password data
 * let p1 = document.getElementbyId('x-pass-1')
 * assert document.getElementsByClassName(cls) == 3
 * @param {string} eid The input element id.
 * @param {string} cls The input element class.
 * @param {string} placeholder The placeholder text in the input element.
 * @param {string} value The initial password value. Can be overwritten interactively.
 * @returns {element} The DOM element that contains the password input elements.
 */
export function makePasswordEntryWithId(eid, cls, placeholder,  value) {
    return xmake('div')
        .xStyle(common.themes._activeProp().password.topdiv)
        .xAppendChild(
            makeInputXWrapper(
                xmake('input')
                    .xAttr('type', 'password')
                    .xStyle(common.themes._activeProp().password.css)
                    .xStyle({
                        backgroundColor: common.themes._activeColors().bgColor,
                        color: common.themes._activeColors().fgColor,
                    })
                    .xAddClass(cls)
                    .xAddClass('x-password-input')
                    .xAddClass('x-theme-element')
                    .xAttr('placeholder', placeholder)
                    .xAttr('value', value)
                    .xAddEventListener('input', e => updatePasswordLength(e))
                    .xAddEventListener('paste', e => updatePasswordLength(e))
                    .xAddEventListener('click', e => updatePasswordLength(e))
                    .xAddEventListener('change', e => updatePasswordLength(e))
                    .xId(eid))
                .xStyle({width: common.themes._activeProp().password.input.width}),
            xmake('span')
                .xStyle({marginLeft: '5px'})
                .xAddClass('x-password-length')
                .xInnerHTML(value.length),
            xmake('button')
                .xStyle({
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '10px'})
                .xAddClass('x-theme-element')
                .xAddEventListener('click', e => showHidePassword(e))
                .xTooltip('show or hide the password')
                .xAppendChild(makeIcon(common.icons.eyeBlocked, 'show').xAddClass('x-show-hide-img')),
            xmake('button')
                .xStyle({
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '10px'})
                .xAddClass('x-theme-element')
                .xAddEventListener('click', e => generateCrypticPasswordHandler(e))
                .xTooltip('generate pseudo-random cyptic password')
                .xAppendChild(makeIcon(common.icons.cog, 'generate').xAddClass('x-show-hide-img')),
            xmake('button')
                .xStyle({
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '10px'})
                .xAddClass('x-theme-element')
                .xAddEventListener('click', e => generateMemorablePasswordHandler(e))
                .xTooltip('generate pseudo-random memorable password')
                .xAppendChild(makeIcon(common.icons.cogs, 'generate2').xAddClass('x-show-hide-img')),
            xmake('button')
                .xStyle({
                    backgroundColor: common.themes._activeColors().bgColor,
                    color: common.themes._activeColors().fgColor,
                    marginLeft: '10px'})
                .xAddClass('x-theme-element')
                .xAddEventListener('click', e => copyPassword(e))
                .xTooltip('copy password to clipboard for pasting to external applications')
                .xAppendChild(makeIcon(common.icons.copy, 'copy').xAddClass('x-show-hide-img')))
}

/**
 * Helper function that displays the password length based on password event.
 * @param {event} event A DOM event.
 */
function updatePasswordLength(event) {
    let button = event.currentTarget
    let div = button.parentNode
    let input = div.parentNode.getElementsByClassName('x-password-input')[0]
    let span = div.parentNode.getElementsByClassName('x-password-length')[0]
    span.innerHTML = input.value.length
}

/**
 * Helper function that shows or hides the password character based
 * on a password show/hide button click event.
 * @param {event} event A DOM event.
 */
function showHidePassword(event) {
    let button = event.currentTarget
    let div = button.parentNode
    let input = div.parentNode.getElementsByClassName('x-password-input')[0]
    let itype = input.getAttribute('type').toLowerCase()
    let svg = button.getElementsByClassName('x-icon-element')[0]
    if ( itype === 'password') {
        input.setAttribute('type', 'input')
        changeIcon(svg, common.icons.eye)
    } else {
        input.setAttribute('type', 'password')
        changeIcon(svg, common.icons.eyeBlocked)
    }
    updatePasswordLength(event)
}

/**
 * Helper function that generates a cryptic password based
 * on a password cryptic button click event.
 * @param {event} event A DOM event.
 */
function generateCrypticPasswordHandler(event) {
    let button = event.currentTarget
    let div = button.parentNode
    let input = div.parentNode.getElementsByClassName('x-password-input')[0]
    input.value = generateCrypticPassword()
    let size = div.parentNode.getElementsByClassName('x-password-length')[0]
    size.innerHTML = input.value.length
    updatePasswordLength(event)
    dispatchChangeEvent(input)
}

/**
 * Helper function that generates a memorable password based
 * on a password memorable button click event.
 * @param {event} event A DOM event.
 */
function generateMemorablePasswordHandler(event) {
    let button = event.currentTarget
    let div = button.parentNode
    let input = div.parentNode.getElementsByClassName('x-password-input')[0]
    input.value = generateMemorablePassword()
    let size = div.parentNode.getElementsByClassName('x-password-length')[0]
    size.innerHTML = input.value.length
    updatePasswordLength(event)
    dispatchChangeEvent(input)
}

/**
 * Helper function that copies the password to the clipboard based 
 * on a password copy button click event.
 * @param {event} event A DOM event.
 */
function copyPassword(event) {
    let button = event.currentTarget
    let div = button.parentNode
    let input = div.parentNode.getElementsByClassName('x-password-input')[0]
    let text = input.value
    updatePasswordLength(event)
    navigator.clipboard.writeText(text).then((text) => {}, () => {
        alert('internal error: clipboard copy operation failed')})
    statusMsg(`copied ${text.length} bytes to the clipboard`)
}

/**
 * Helper function that updates value and length elements when
 * the password changes (including paste events).
 * @param {event} event A DOM event.
 * @param {function} setter Function that sets the password value in a function that the caller defined.
 */
function updatePassword(event, setter) {
    let input = event.currentTarget
    setter(input.value)
    updatePasswordLength(event)
}

/**
 * Dispatch a change event to the parent of the password subtree so
 * that they can deal with it in a customized way.
 * @param {element} input The input element. It is the source of the new dispatched event.
 */
function dispatchChangeEvent(input) {
    const event = new Event('change')
    input.dispatchEvent(event)
}
