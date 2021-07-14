/**
* Theme data.
*<p>
* Each theme is organized by colors (color schemes) and properties (standard/large).
* @module themes
*/

/**
 * The standard properties.
 * These were the properties that were originally used during development.
 */
export var standard = {
    body: {
        fontFamily: 'Arial, Helvetica, Tahoma, Calibri, Verdana, sans-serif',
    },
    about: {
        grid: {
            display: 'grid',
            alignItems:'center',
            justifyContent: 'left',
            textAlign: 'left',
            gridTemplateColumns: '14ch 34ch',
            gridColumnGap: '2px',
            gridRowGap: '5px',
            width: '50ch',
            padding: '5px',
            fontSize: '20px',
        },
        col1: {
            display: 'gridColumn: 1',
        },
        col2: {
            display: 'gridColumn: 2',
        },
    },
    header: {
        bar: {
            top: '0px',
            position: 'fixed',
            display: 'block',
            height: '50px',
            zIndex: '10',
            overflow: 'auto',
            width: '100%',
        },
        subtitle: {
            element: 'h5',
        },
        title: {
            position: 'fixed',
            display: 'block',
            top: '1em',
            textAlign: 'center',
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: '-5',
        },
        menu: {
            opened: {
                position: 'fixed',
                display: 'block',
                cursor: 'pointer',
                top: '20px',
                right: '2px',
            },
            closed: {
                position: 'fixed',
                display: 'block',
                top: '2px',
                right: '2px',
                margin: 'auto',
                borderWidth: '0',
                cursor: 'pointer',
            },
        },
    },
    accordion: {
        button: {
            borderRadius: '8px',
            cursor: 'Pointer',
            padding: '10px',
            borderWidth: '1px',
            borderSides: 'solid',
            width: '100%',
            textAlign: 'left',
        },
        title: {
            fontSize: '16px',
        },
        panel: {
            padding: '10px',
        },
    },
    menu: {
        fontSize: '14px',
        textAlign: 'left',
        borderWidth: '0px',
    },
    password: {
        css: {
            fontSize: '16px',
            fontFamily: 'monospace',
            minWidth: '32ch',
            width: '32ch',
        },
        topdiv: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems:'center',
            justifyContent: 'left',
            height: '20px',
            margin: '5px',
        },
        input: {
            width: '40ch',
        },
    },
    general: {
        icons: {
            width: '16px',
            height: '16px',
        },
        iconx: { // x icon in input fields
            width: '16px',
            height: '16px',
            position: 'absolute',
            display: 'inline',
            marginLeft: '-24px',
            zIndex: '100',
            opacity: '25%',
        },
        iconxdiv: {
            position: 'relative',
            overflow: 'scroll',
            width: '100%',
        },
        status: {
            duration: 1500,
            css: {
                position: 'fixed',
                display: 'block',
                left: '5px',
                top: '5px',
                zIndex: '100',
                padding: '5px',
                fontSize: '12px',
            }
        },
        text: { // general paragraph text
            fontSize: '14px',
            textAlign: 'left',
        },
        textButton: {
            fontSize: '15px',
            textAlign: 'center',
            borderWidth: '1px',
            borderStyle: 'outset',
            margin: '5px',
            borderRadius: '5px',
        },
        textarea: {
            fontFamily: 'monospace',
            width: '90%',
            resize: 'both',
            overflow: 'auto',
        },
        input: {
            maxLength: '256',
        },
        search: {
            fontFamily: 'monospace',
            fontSize: '18px',
            width: '90%',
        },
    },
    records: {
        gridUrlAdjustment: {
            marginTop: '-0.5em',
        },
        gridContainer: {
            display: 'grid',
            width: '100%',
            overflow: 'scroll',
            gridTemplateColumns: '24ch auto max-content',
            gridColumnGap: '5px',
            gridRowGap: '5px',
            marginTop: '5px',
            marginBottom: '5px',
        },
        gridLabelStyle: {
            gridColumn: '1',
            top: '0',
            overflow: 'scroll',
            textAlign: 'right',
            fontSize: '15px',
        },
        gridValueStyle: {
            gridColumn: '2',
            top: '0',
            display: 'flex',
            flexWrap: 'nowrap',
            flexDirection: 'row',
            alignItems:'center',
            justifyContent: 'left',
            overflow: 'scroll',
            textAlign: 'left',
            fontSize: '15px',
        },
        gridButtonStyle: {
            gridColumn: '3',
            top: '0',
            overflow: 'scroll',
            textAlign: 'right',
        },
    },
}

/**
 * The large properties.
 * These were the properties with slightly larger fonts and icons that
 * were used for a landscape display on my tablet.
 */
export var large = {
    body: {
        fontFamily: 'Arial, Helvetica, Tahoma, Calibri, Verdana, sans-serif',
    },
    about: {
        grid: {
            display: 'grid',
            alignItems:'center',
            justifyContent: 'left',
            textAlign: 'left',
            gridTemplateColumns: '14ch 34ch',
            gridColumnGap: '2px',
            gridRowGap: '5px',
            width: '50ch',
            padding: '5px',
            fontSize: '24px',
        },
        col1: {
            display: 'gridColumn: 1',
        },
        col2: {
            display: 'gridColumn: 2',
        },
    },
    header: {
        bar: {
            top: '0px',
            position: 'fixed',
            display: 'block',
            height: '50px',
            zIndex: '10',
            overflow: 'auto',
            width: '100%',
        },
        subtitle: {
            element: 'h4',
        },
        title: {
            position: 'fixed',
            display: 'block',
            top: '1em',
            textAlign: 'center',
            width: '100%',
            fontSize: '20px',
            fontWeight: 'bold',
            zIndex: '-5',
        },
        menu: {
            opened: {
                position: 'fixed',
                display: 'block',
                cursor: 'pointer',
                top: '16px',
                right: '2px',
            },
            closed: {
                position: 'fixed',
                display: 'block',
                top: '2px',
                right: '2px',
                margin: 'auto',
                borderWidth: '0',
                cursor: 'pointer',
            },
        },
    },
    accordion: {
        button: {
            borderRadius: '8px',
            cursor: 'Pointer',
            padding: '10px',
            borderWidth: '1px',
            borderSides: 'solid',
            width: '100%',
            textAlign: 'left',
        },
        title: {
            fontSize: '20px',
        },
        panel: {
            padding: '10px',
        },
    },
    menu: {
        fontSize: '20px',
        textAlign: 'left',
        borderWidth: '0px',
    },
    password: {
        css: {
            fontSize: '20px',
            fontFamily: 'monospace',
            minWidth: '32ch',
            width: '32ch',
        },
        topdiv: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems:'center',
            justifyContent: 'left',
            height: '36px',
            margin: '5px',
        },
        input: {
            width: '50ch',
        },
    },
    general: {
        icons: {
            width: '24px',
            height: '24px',
        },
        iconx: { // x icon in input fields
            width: '24px',
            height: '24px',
            position: 'absolute',
            display: 'inline',
            marginLeft: '-32px',
            zIndex: '100',
            opacity: '25%',
        },
        iconxdiv: {
            position: 'relative',
            overflow: 'scroll',
            width: '100%',
        },
        status: {
            duration: 1500,
            css: {
                position: 'fixed',
                display: 'block',
                left: '5px',
                top: '5px',
                zIndex: '100',
                padding: '5px',
                fontSize: '14px',
            }
        },
        text: { // general paragraph text
            fontSize: '18px',
            textAlign: 'left',
        },
        textButton: {
            fontSize: '18px',
            textAlign: 'center',
            borderWidth: '1px',
            borderStyle: 'outset',
            margin: '5px',
            borderRadius: '5px',
        },
        textarea: {
            fontFamily: 'monospace',
            width: '90%',
            resize: 'both',
            overflow: 'auto',
        },
        input: {
            maxLength: '256',
        },
        search: {
            fontFamily: 'monospace',
            fontSize: '22px',
            width: '90%',
        },
    },
    records: {
        gridUrlAdjustment: {
            marginTop: '-0.5em',
        },
        gridContainer: {
            display: 'grid',
            width: '100%',
            overflow: 'scroll',
            gridTemplateColumns: '20ch auto max-content',
            gridColumnGap: '5px',
            gridRowGap: '5px',
            marginTop: '5px',
            marginBottom: '5px',
        },
        gridLabelStyle: {
            gridColumn: '1',
            top: '0',
            overflow: 'scroll',
            textAlign: 'right',
            fontSize: '20px',
        },
        gridValueStyle: {
            gridColumn: '2',
            top: '0',
            display: 'flex',
            flexWrap: 'nowrap',
            flexDirection: 'row',
            alignItems:'center',
            justifyContent: 'left',
            overflow: 'scroll',
            textAlign: 'left',
            fontSize: '20px',
        },
        gridButtonStyle: {
            gridColumn: '3',
            top: '0',
            overflow: 'scroll',
            textAlign: 'right',
        },
    },
}

/**
 * The built-in predefined themes that are stored in common.themes.
 * They can be customized and saved for each user on the preferences page.
 */
export var themes = {
    props: {
        standard: standard,
        large: large,
    },
    colors: {
        'steelblue-dark': {
            fgColor: '#f2f4f4',
            bgColor: '#1a355b',
        },
        'steelblue-light': {
            bgColor: '#f2f4f4',
            fgColor: '#1a355b',
        },
        'cyan-light': {
            bgColor: '#00ffff',
            fgColor: '#0c090a',
        },
        'blueminded-dark': {
            fgColor: '#f2f4f4',
            bgColor: '#004e7c',
        },
        'maroon-dark': {
            fgColor: '#f2f4f4',
            bgColor: '#591c0b',
        },
        'olive-dark': {
            fgColor: '#f2f4f4',
            bgColor: '#266150',
        },
        'darkgreen-dark': {
            fgColor: '#f2f4f4',
            bgColor: '#164a41',
        },
    }
}

export function getThemeProps() {
    return themes.props
}

export function getThemeColors() {
    return themes.colors
}
