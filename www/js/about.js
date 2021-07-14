/**
 * Display the about page.
 * @module about
 */
import { VERSION, BUILD, GIT_COMMIT_ID, GIT_BRANCH } from '/js/version.js'
import { xmake, hideAll, makeTextButton } from '/js/utils.js'
import { hideMenu  } from '/js/header.js'
import { common } from '/js/common.js'

/**
 * Show the about page.
 * The style for this page are defined by the themes.
 * @example
 * showAboutPage
 */
export function showAboutPage() {
    hideAll()
    hideMenu()

    let top = document.getElementById('page-about')
    top.style.display = 'block' //  display this page
    top.xRemoveChildren()
    let project = 'https://github.com/jlinoff/myvault'
    let webapp = 'https://jlinoff.github.io/myvault'
    let help = '/help/index.html'
    let idoc = '/xtra/doc/index.html'
    let cryptor = '/xtra/cryptor.html'

    let col1 = common.themes._activeProp().about.grid.col1
    let col2 = common.themes._activeProp().about.grid.col2

    top.xAppendChild(
        xmake('center')
            .xAppendChild(
                xmake('div').xStyle({height: '5px'}),
                xmake('div').xStyle(common.themes._activeProp().about.grid)
                    .xAddClass('x-theme-element')
                    .xAppendChild(
                        xmake('div').xStyle(col1).xInnerHTML('Author:'),
                        xmake('div').xStyle(col2).xInnerHTML('Joe Linoff'),

                        xmake('div').xStyle(col1).xInnerHTML('Copyright:'),
                        xmake('div').xStyle(col2).xInnerHTML('2021'),

                        xmake('div').xStyle(col1).xInnerHTML('License:'),
                        xmake('div').xStyle(col2).xInnerHTML('MIT Open Source'),

                        xmake('div').xStyle(col1).xInnerHTML('Version:'),
                        xmake('div').xStyle(col2).xInnerHTML(VERSION),

                        xmake('div').xStyle(col1).xInnerHTML('Build:')
                            .xTooltip('build time: generated during the build process'),
                        xmake('div').xStyle(col2).xInnerHTML(BUILD),

                        xmake('div').xStyle(col1).xInnerHTML('GitCommitId:')
                            .xTooltip('generated during the build process'),
                        xmake('div').xStyle(col2).xInnerHTML(GIT_COMMIT_ID),

                        xmake('div').xStyle(col1).xInnerHTML('GitBranch:')
                            .xTooltip('generated during the build process'),
                        xmake('div').xStyle(col2).xInnerHTML(GIT_BRANCH),

                        xmake('div').xStyle(col1).xInnerHTML('Project:'),
                        xmake('div').xStyle(col2).xInnerHTML(`${project}`)
                            .xStyle({cursor: 'pointer'}).xAddClass('x-hover')
                            .xTooltip('link to the project page')
                            .xAddEventListener('click', () => window.open(project, '_blank')),

                        xmake('div').xStyle(col1).xInnerHTML('Webapp:')
                            .xTooltip('run the webapp'),
                        xmake('div').xStyle(col2).xInnerHTML(`${webapp}`)
                            .xStyle({cursor: 'pointer'}).xAddClass('x-hover')
                            .xTooltip('link to the web app')
                            .xAddEventListener('click', () => window.open(webapp, '_blank')),

                        xmake('div').xStyle(col1).xInnerHTML('Cryptor:')
                            .xTooltip('encrypt/decrypt arbitrary files'),
                        xmake('div').xId('x-about-help-link').xStyle(col2).xInnerHTML(`${cryptor}`)
                            .xStyle({cursor: 'pointer'}).xAddClass('x-hover')
                            .xTooltip('link to the cryptor utility')
                            .xAddEventListener('click', () => window.open(cryptor, '_blank')),

                        xmake('div').xStyle(col1).xInnerHTML('HelpDoc:')
                            .xTooltip('the user help documentation derived from the README'),
                        xmake('div').xId('x-about-help-link').xStyle(col2).xInnerHTML(`${help}`)
                            .xStyle({cursor: 'pointer'}).xAddClass('x-hover')
                            .xTooltip('link to the help page')
                            .xAddEventListener('click', () => window.open(help, '_blank')),

                        xmake('div').xStyle(col1).xInnerHTML('InternalDoc:')
                            .xTooltip('the documentation for the implementation'),
                        xmake('div').xId('x-about-help-link').xStyle(col2).xInnerHTML(`${idoc}`)
                            .xStyle({cursor: 'pointer'}).xAddClass('x-hover')
                            .xTooltip('link to the internal documentation')
                            .xAddEventListener('click', () => window.open(idoc, '_blank')),
                    ),
            )
    )
}
