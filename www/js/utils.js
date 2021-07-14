/**
 * This module contains common utilities used throughout the system
 * most critically the element prototype functions that enable
 * chaining.
 * @module utils
*/
import { common } from '/js/common.js'
import { getColorFilter } from '/js/icons.js'
import { makeIcon, makeIconWithImg }  from '/js/icons.js'

/**
 * Allow chaining for common and other convenience calls to group element creation suff.
 * @example
 * document.xmake('button')
 *  .xAddClass('menu')
 *  .xId('topmenu')
 *  .xTooltip('the top level menu')
 *  .xInnerHTML(`<img src="${ setup.menuImage }" alt="menu">`)
 *  .xAddEventListener('click', e => clicked(e))
 *  .xAppendToParent(document.body)
 */
export function enableFunctionChaining() {
    /**
     * Make an element.
     * @example
     * document.xmake('div').xId('me').xAddClass('x-foo')
     * @param {string} tagName The element tagname such as 'div'.
     * @param {object} options Additional options to pass to the underlying createElement() function.
     * @returns {element} The new element.
     * @global
     */
    HTMLDocument.prototype._xmake = function(tagName, options) {
        return this.createElement(tagName, options);
    }

    /**
     * Add a CSS class reference to an element.
     * Wrapper for classList.add.
     * @example
     * xmake('div').xAddClass('x-foo').xAddClass('x-bar')
     * @param {string} className The CSS class name.
     * @returns {element} The caller element to enable chaining.
     * @global
     */
    Element.prototype.xAddClass = function(className) {
        this.classList.add(className);
        return this;
    }

    /**
     * Remove a CSS class reference to an element.
     * Wrapper for classList.remove.
     * @example
     * let div = xmake('div').xAddClass('x-foo')
     * div.xRemoveClass('x-foo').xAddClass('x-bar')
     * @param {string} className The CSS class name.
     * @returns {element} The caller element to enable chaining.
     * @global
     */
    Element.prototype.xRemoveClass = function(className) {
        this.classList.remove(className);
        return this;
    }

    /**
     * Add HTML to an element.
     * Wrapper for innerHTML.
     * @example
     * xmake('p').xInnerHTML('<i>text here</i>').xAddClass('x-foo')
     * @param {string} The HTML.
     * @returns {element} The caller element to enable chaining.
     * @global
     */
    Element.prototype.xInnerHTML = function(text) {
        this.innerHTML = text;
        return this;
    }

    /**
     * Add an event listener to an element.
     * Wrapper for addEventListener.
     * @example
     * xmake('p').xInnerHTML('fake button')
     *   .xAddEventListener('click', (e) => alert('clicked'))
     *   .xAddEventListener('chane', (e) => alert('changed'))
     * @param {string} The event name.
     * @param {function} The event acrion.
     * @returns {element} The caller element to enable chaining.
     * @global
     */
    Element.prototype.xAddEventListener = function(eventName, eventAction) {
        this.addEventListener(eventName, eventAction);
        return this;
    }

    /**
     * Append this element to a parent node.
     * @example
     * xmake('p').xAppendToParent(xmake('div').xId('x-child')
     * @param {element} parent The parent node.
     * @returns {element} This object (the child).
     * @global
     */
    Element.prototype.xAppendToParent = function(parent) {
        parent.appendChild(this);
        return this;
    }

    /**
     * Append a list of one or more children to this node.
     * Wrapper for appendChild.
     * <p>
     * This is really useful. It is used to define the DOM structure
     * for dynamically created elements in a concise way.
     *
     * @example
     * xmake('div').xAddClass('container').xAppendChild(
     *   xmake('ol').xAppendChild(
     *      xmake('li').xInnerHTML('item 1'),
     *      xmake('li').xInnerHTML('item 2'),
     *      xmake('li').xInnerHTML('item 3'),
     *   )
     * )
     * @param {...child} var_args The child nodes.
     * @returns {element} This element (the parent).
     * @global
     */
    Element.prototype.xAppendChild = function(...child) {
        for (let i=0; i<child.length; i++) {
            let e = child[i]
            this.appendChild(e)
        }
        return this;
    }

    /**
     * Convenience function for defining the element id.
     * @example
     * xmake('div').xId('div-id')
     * @param {string} id The element id.
     * @returns {element} This element for chaining.
     * @global
     */
    Element.prototype.xId = function(id) {
        this.setAttribute('id', id);
        return this;
    }

    /**
     * Set an attribute on this element.
     * Wrapper for setAttribute.
     * @example
     * xmake('div').xAttr('id', 'div-id') // use .xId() instead for id's
     * @param {string} name The attribute name.
     * @param {string} value The attribute value.
     * @returns {element} This element for chaining.
     * @global
     */
    Element.prototype.xAttr = function(name, value) {
        this.setAttribute(name, value);
        return this;
    }

    /**
     * Set a namespace attribute on this element.
     * Wrapper for setAttributeNS.
     * @example
     * xmake('div').xAttrNS('bob','id', 'div-id')
     * @param {string} ns The attribute namespace.
     * @param {string} name The attribute name.
     * @param {string} value The attribute value.
     * @returns {element} This element for chaining.
     * @global
     */
    Element.prototype.xAttrNS = function(ns, name, value) {
        this.setAttributeNS(ns, name, value);
        return this;
    }

    /**
     * Set an attribute on this element if the flag is true.
     * Wrapper for setAttribute.
     * <p>
     * A better way to implement this would be to create
     * an xIf(..) prototype.
     * @example
     * xmake('div').xAttr('id', 'div-id')
     * @param {string} name The attribute name.
     * @param {string} value The attribute value.
     * @param {bool} flag The flag.
     * @returns {element} This element for chaining.
     * @global
     */
    Element.prototype.xAttrIfTrue = function(name, value, flag) {
        if (flag) {
            this.setAttribute(name, value);
        }
        return this;
    }

    /**
     * Define styles for this element.
     * @example
     * xmake('div').xStyle({
     *   color: 'red',
     *   backgroundColor: 'green',
     *   height: '32px',
     *   width: '32px',
     *   border: '1 solid blue',
     * })
     * @param {...kvpair} listOfStyles The list of style name/value pairs.
     * @returns {element} This element for chaining.
     * @global
     */
    Element.prototype.xStyle = function(listOfStyles) {
        for (const property in listOfStyles) {
            this.style[property] = listOfStyles[property];
        }
        return this;
    }

    /**
     * Convenience function that defines a tooltip for this element.
     * @example
     * xmake('div').xTooltip('the tip')
     * @param {string} tip The tooltip.
     * @returns {element} This element for chaining.
     * @global
     */
    Element.prototype.xTooltip = function(tip) {
        this.setAttribute('title', tip);
        return this;
    }
    /**
     * Remove all of the children from this element.
     * @example
     * element.xRemoveChildren()
     * @returns {element} This element for chaining.
     * @global
     */
    Element.prototype.xRemoveChildren = function() {
        let parent = this
        while (parent.firstChild) {
            parent.removeChild(parent.lastChild);
        }
    }
}

/**
 * Shortcut for element creation in document._xmake().
 * @example
 * xmake('div').xId('me').xTooltip('do me stuff').xAddClass('x-foo')
 * @param {string} tagName The element tagname such as 'div'.
 * @param {object} options Additional options to pass to the underlying createElement() function.
 * @returns {element} The new element.
 * @global
 *
*/
export function xmake(tagName, options) {
  return document.createElement(tagName, options);
}

/**
 * Hide all of the pages used by the menu.
 * It is used before displaying a new menu page.
 */
export function hideAll() {
    let elements = document.getElementsByClassName('x-spa-page')
    for(let i=0;i<elements.length; i++) {
        let element = elements[i]
        element.style.display = 'none'
    }
}

/**
 * Make an icon button
 * @example
 * makeIconButton('encrypt using master password',
 *                'encrypt',
 *                 common.icons.lock,
 *                 (e) => alert('not enabled yet')
 * @param {string} tooltip Button tooltip.
 * @param {string} alt Alternate image text.
 * @param {string} icon Icon path.
 * @param {function} clicker The onlick function.
 * @return {object} The new button element.
 */
export function makeIconButton(tooltip, alt, icon, clicker) {
    return xmake('button')
        .xStyle({
            backgroundColor: common.themes._activeColors().bgColor,
            color: common.themes._activeColors().fgColor,
            margin: '2px',
        })
        .xAddClass('x-theme-element')
        .xTooltip(tooltip)
        .xAddEventListener('click', (e) => {
            clicker(e)
        })
        .xAppendChild(makeIcon(icon, alt))
}

/**
 * Make a text button.
 * @example
 * makeIconButton('encrypt using master password',
 *                'Encrypt',
 *                 (e) => alert('not enabled yet')
 * @param {string} tooltip Button tooltip.
 * @param {string} text Button text.
 * @param {function} clicker The onlick function.
 * @return {object} The new button element.
*/
export function makeTextButton(tooltip, text, clicker) {
    let pad = ((text.length % 2)) ? 4 : 5 // heuristic: makes the button text look better
    return xmake('button')
        .xStyle({
            backgroundColor: common.themes._activeColors().bgColor,
            color: common.themes._activeColors().fgColor,
            borderColor: common.themes._activeColors().fgColor,
            width: (text.length + pad) +  'ch',
        })
        .xStyle(common.themes._activeProp().general.textButton)
        .xAddClass('x-theme-element')
        .xTooltip(tooltip)
        .xAddEventListener('click', (e) => {
            clicker(e)
        })
        .xInnerHTML(text)
}

/**
 * Reports whether the value is a URL.
 * <p>
 * It is used to generate links in record views.
 * @example
 * assert isURL('https://foo.bar.com') == true
 * assert isURL('not a url') == false
 * @param {string} value The string value to test.
 * @returns {bool} True if it is a URL or false otherwise.
 */
export function isURL(value) {
    if (value.includes('://')) {
        try {
            let url = new URL(value)
            return true
        } catch(e) {
            if (e instanceof TypeError) {
                return false
            }
        }
    }
    return false
}

/**
 * Deep copy an object.
 * <p>
 * This is needed because javascript uses references wherever it can to save memory but
 * it does not seem to do copy-on-write (COW) when an attribute changed which results
 * in a local change affecting global data which can corrupt the state.
 * <p>
 * [citation]{@link https://javascript.plainenglish.io/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089}
 * @example
 * let a = {'k1': 'v1', 'k2': [1,2,3,4],k3: {'k3a': 1, 'k3b:2'}
 * let b = deepCopyObject(a)
 * assert b.k3.k3a == 1
 * @param {object} inObject The object to copy.
 * @return {object} The duplicated object.
 */
export function deepCopyObject(inObject) {
    if (typeof inObject !== "object" || inObject === null) {
        return inObject // Return the value if inObject is not an object
    }
    let outObject = Array.isArray(inObject) ? [] : {}
    for (const key in inObject) {
        let value = inObject[key]
        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepCopyObject(value)
    }
    return outObject
}

/**
 * Make an input element with the little "x" embedded for clearing it using a wrapper.
 * <p>
 * This is used for all inputs in the app.
 * @example
 * document.appendChild(
 *   xmake('span').xAppendChild(
 *     xmake('label').xInnerHTML('username'),
 *     makeInputXWrapper(
 *       xmake('input').xId('x-username').xAttr('placeholder', 'username').xTooltip('click x to clear')
 *     )
 *   )
 * )
 * @param {element} input The input element to wrap.
 * @returns {element} The wrapper element.
 */
export function makeInputXWrapper(input) {
    let div = xmake('div')
        .xStyle(common.themes._activeProp().general.iconxdiv)
        .xStyle({
            backgroundColor: common.themes._activeColors().bgColor,
            color: common.themes._activeColors().fgColor,
        })
        .xAddClass('x-theme-element')
        .xAppendChild(
            input,
            makeIconWithImg(
                common.themes._activeProp().general.iconx.width,
                xmake('img')
                    .xAddClass('x-theme-element')
                    .xAttr('src', common.icons.clear)
                    .xAttr('alt', 'x')
                    .xAttr('width', common.themes._activeProp().general.iconx.width)
                    .xAttr('height', common.themes._activeProp().general.iconx.height)
                    .xAddEventListener('click', (event) => {
                        let div = event.target.parentNode.parentNode // img --> svg --> div
                        let input = div.getElementsByTagName('input')[0]
                        input.value = ''
                        // clone and propagate the event as if it came from the input
                        let clonedEvent = new event.constructor(event.type, event)
                        input.dispatchEvent(clonedEvent)
                    })
                    .xAddClass('x-vertical-center')
                    .xStyle(common.themes._activeProp().general.iconx)
                    .xStyle({
                        backgroundColor: common.themes._activeColors().fgColor,
                        color: common.themes._activeColors().bgColor,
                    })
            )
        )
    return div
}

/**
 * Display a status message for a short time (defined by the theme in
 * <code>status.duration</code>) the upper left corner of the window
 * and then remove it.
 * <p>
 * Other implementation options i considered were to display it in the
 * center of the window or right by the cursor. I chose the constant
 * location in the upper left corner because it was the simplest and
 * it did the job.
 * @example
 * statusMsg('this will disappear in 1.5 seconds unless the theme sets it differently')
 * statusMsg('<lbink><b>really BAD example!</b> never do this!<blink>')
 * @param {string} msg The staus message. It can be HTML.
 */
export function statusMsg(msg) {
    let div = xmake('div')
        .xStyle(common.themes._activeProp().general.status.css)
        .xStyle({
            border: '0',
            backgroundColor: common.themes._activeColors().bgColor,
            color: common.themes._activeColors().fgColor,
        })
        .xInnerHTML(msg)
    document.body.appendChild(div)
    setTimeout(()=> {div.remove()},
               common.themes._activeProp().general.status.duration)
}
