/**
 * Support for accordions.
 * Accordions are composed of two parts: an accordion toggle button and an accordion panel.
 * When the button is clicked it toggles the display the panel which contains the contents.
 * Accordions are the primary idiom used to display information on the app pages.
 * @module accordion
 */

import { common } from '/js/common.js'
import { xmake }  from '/js/utils.js'
import { makeIcon, changeIcon } from '/js/icons.js'

export var accordionPanelClass = 'x-accordion-panel'
export var accordionPanelImgClass = 'x-accordion-panel-img'
export var accordionPanelButtonClass = 'x-accordion-panel-button'

/**
 * Expand all accordion entries on a page.
 * It recognizes accordion enries by the membership in the <code>'x-accordion-panel</code> class.
 * @example
 xmake('button')
   .xStyle({backgroundColor: common.themes._activeColors().bgColor,
            color: common.themes._activeColors().fgColor,
            marginBottom: '8px'})
   .xAddClass('x-theme-element')
   .xAppendChild(makeIcon(common.icons.expand, 'expand'))
   .xTooltip('expand accordion panels')
   .xAddEventListener('click', () => expandAccordion(top)),
 * @param {element} top A container element (like a div) that contains all of the accordion entries.
 *
 */
export function expandAccordion(top) {
    let panels = top.getElementsByClassName(accordionPanelClass)
    for(let i=0; i< panels.length; i++) {
        panels[i].style.display = 'block'
    }
    let images = top.getElementsByClassName(accordionPanelImgClass)
    for(let i=0; i< images.length; i++) {
        changeIcon(images[i], common.icons.arrowDown)
    }
}

/**
 * Collapses all accordion entries on a page.
 * It recognizes accordion enries by the membership in the <code>'x-accordion-panel</code> class.
 * @example
 xmake('button')
   .xStyle({backgroundColor: common.themes._activeColors().bgColor,
            color: common.themes._activeColors().fgColor,
            marginBottom: '8px'})
   .xAddClass('x-theme-element')
   .xAppendChild(makeIcon(common.icons.collapse, 'collapse'))
   .xTooltip('collapse accordion panels')
   .xAddEventListener('click', () => collapseAccordion(top))),
 * @param {element} top A container element (like a div) that contains all of the accordion entries.
 *
 */
export function collapseAccordion(top) {
    let panels = top.getElementsByClassName(accordionPanelClass)
    for(let i=0; i< panels.length; i++) {
        panels[i].style.display = 'none'
    }
    let images = top.getElementsByClassName(accordionPanelImgClass)
    for(let i=0; i< images.length; i++) {
        changeIcon(images[i], common.icons.arrowRight)
    }
}

// Accordion button style
/**
 * Define the accordion button style for a theme.
 * @returns {object} the style.
 */
export function getAccordionButtonStyle() {
    let style = common.themes._activeProp().accordion.button
    style.borderColor = common.themes._activeColors().fgColor
    style.backgroundColor = common.themes._activeColors().bgColor
    style.color = common.themes._activeColors().fgColor
    return style
}

/**
 * Make an accordion entry.
 *<p>
 * An accordion entry is composed of a button and a panel.
 * The button and panel elements have class designations to
 * make them easier to find.
 * <p>
 * The button has an icon the far left that changes to show
 * whether the accordion entry is expanded or collapsed.
 * @example
    let accordionEntry = makeAccordionEntry(
        'Encryption Algorithm',
        xmake('div')
            .xStyle(common.themes._activeProp().accordion.panel)
            .xId('x-prefs-algorithm-div')
            .xAppendChild(
                xmake('p')
                    .xStyle(common.themes._activeProp().general.text)
                    .xInnerHTML('Choose the algorithm to use for encryption and decryption.'),
            ))
 * @param {string} title The accordion entry title displayed in the button.
 * @param {element} panel The panel DOM element.
 * @Param {function} expandAction The action to take when the entry is expanded.
 * @Param {function} collapseAction The action to take when the entry is collapsed.
*/
export function makeAccordionEntry(title, panel, expandAction, collapseAction) {
    return xmake('div')
        .xAppendChild(
            xmake('button') // button
                .xStyle(getAccordionButtonStyle())
                .xAddClass('x-theme-element')
                .xAddClass('x-hover')
                .xAppendChild(
                    makeIcon(common.icons.circleRight,'closed').xAddClass(accordionPanelImgClass),
                    xmake('span')
                        .xStyle(common.themes._activeProp().accordion.title)
                        .xInnerHTML('&nbsp;&nbsp;' + title))
                .xAddEventListener('click', e => clickedAccordionButton(e, expandAction, collapseAction)),
            xmake('div') //panel
                .xStyle({display: 'none'})
                .xAddClass('x-theme-element')
                .xAddClass(accordionPanelClass)
                .xAppendChild(panel))
}

/**
 * Toggle an accordion panel display.
 * @param {event} event The event that triggered the toggle.
 * @param {function} expandAction The action to take when the accordion is expanded.
 * @param {function} collapseAction The action to take when the accordion is collapsed.
 */
export function clickedAccordionButton(event, expandAction, collapseAction) {
    // toggle expand/collapse
    let e = event.srcElement
    let i = 0
    while ( e && e.nodeName !== 'BUTTON' ) {
        e = e.parentNode
        i += 1
        if (i > 5) {
            break
        }
    }
    if ( e.nodeName !== 'BUTTON' ) {
        // Use the button if the user clicked on the image or text directly.
        alert('internal error! please report this bug')
        return
    }
    // Change the image.
    let icon = e.getElementsByClassName('x-icon-element')[0]

    // Toggle the panel display.
    e.classList.toggle("active");
    var panel = e.nextElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
        changeIcon(icon, common.icons.circleRight).xAttr('alt', 'closed')
        if (collapseAction){
            collapseAction()
        }
    } else {
        panel.style.display = "block";
        changeIcon(icon, common.icons.circleDown).xAttr('alt', 'open')
        if (expandAction) {
            expandAction()
        }
    }
}
