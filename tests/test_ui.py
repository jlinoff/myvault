'''
Test the UI using pylenium.

USE_MP=true PORT=8000 pipenv run python -m pytest tests/test_ui.py
'''
import http.server
from multiprocessing import Process
import inspect
import os
import socketserver
import time
from pathlib import Path
import pytest
import pyclip

# The test port must be different than the production port.
PORT = int(os.environ.get('PORT', 8007))

# The localhost.
LOCALHOST = 'localhost'

# debug pause time, used to make things easier to see
DBT = float(os.environ.get('DBT', 0.5))

# Define the server URL used for the tests.
# By default it uses an internal server running as a session fixture
# but the user can use an external server if they want.
# Here is an example usage:
# DBT=2 PORT=8007 pipenv run python -m pytest tests/test_ui.py::test_records
URL = f'http://{LOCALHOST}:{PORT}'
USE_MP = bool(os.environ.get('PORT', True))
PROCESS = None

def is_headless(py):
    '''Are we in headless mode?

    Check the options to see if we are in headless mode.
    It is needed because some clipboard operations do
    not work in headless mode.
    '''
    return 'headless' in py.config.driver.options


def serve():
    '''
    Run the server in a separate thread/process.
    '''
    src_path = Path(__file__).resolve()
    project_dir = src_path.parent.parent
    www = Path(project_dir, 'www')
    debug(f'project: {project_dir}')
    debug(f'www: {www}')
    debug(f'port: {PORT}')
    os.chdir(www)
    handler = http.server.SimpleHTTPRequestHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("localhost", PORT), handler) as httpd:
        print("serving at port", PORT)
        httpd.allow_reuse_address = True
        httpd.serve_forever()
        debug('server started')


def debug(msg: str, level: int = 1):
    '''
    Print a debug message so that it can be seen.
    '''
    lineno = inspect.stack()[level].lineno
    fname = os.path.basename(inspect.stack()[level].filename)
    print(f'\x1b[35mDEBUG:{fname}:{lineno}: {msg}\x1b[0m')


def epilogue():
    '''stop the server when the session ends '''
    debug('epilogue')
    if USE_MP:
        PROCESS.terminate()


def prologue():
    '''test sesssion prologue'''
    debug('prologue')
    if USE_MP:
        global PROCESS # pylint: disable=global-statement
        debug(f'starting server on {PORT}')
        PROCESS = Process(target=serve)
        PROCESS.start()
        debug(f'URL: {URL}')


@pytest.fixture(scope="session", autouse=True)
def oneshot(request):
    'setup the prologue and epilogue before of all the tests in a session'
    request.addfinalizer(epilogue)
    prologue()


VISITED = False
def test_about(py):
    'about dialogue'
    py.visit(URL)
    assert py.find('#x-topmenu-button')
    time.sleep(1)
    py.get('#x-topmenu-button').click()
    assert py.find('#x-menu-content')
    time.sleep(DBT)
    py.get('#x-menu-content').children()[0].click() # about
    time.sleep(DBT)
    strings = ['Author:', 'Copyright', 'License', 'Version:', 'Build:',
               'GitCommitId', 'GitBranch',
               'Project', 'HelpDoc']
    assert py.get('#page-about')
    page = py.get('#page-about')
    for string in strings:
        assert page.contains(string, 0.2)

    helpdiv = py.get('#x-about-help-link')
    assert helpdiv
    helpdiv.click()
    time.sleep(DBT)


def test_prefs(py):  # pylint: disable=too-many-statements,too-many-locals
    'preferences'
    py.visit(URL)
    assert py.find('#x-topmenu-button')
    py.get('#x-topmenu-button').click() # open the menu
    py.get('#x-menu-content').children()[1].click() # preferences
    assert py.get('#x-prefs-content-id')
    top = py.get('#x-prefs-content-id')
    topc = top.children()
    assert len(topc) == 3
    assert topc[1].tag_name() == 'button' # expand
    assert topc[2].tag_name() == 'button' # collapse
    topc[1].click() # expand
    time.sleep(DBT)
    topc[2].click() # collapse
    time.sleep(DBT)

    assert py.get('#page-prefs')
    page = py.get('#page-prefs')
    assert page.tag_name() == 'div'
    plist = page.children()
    assert len(plist) == 11
    assert plist[0].tag_name() == 'center' # buttons
    assert plist[1].tag_name() == 'div' # master password
    assert plist[1].children()[0].text().strip() == 'Master Password'

    # Master Password
    plist[1].click() # master password accordion panel

    time.sleep(DBT)
    assert 'x-hover' in plist[1].children()[0].get_attribute('class')
    assert 'x-accordion-panel' in plist[1].children()[1].get_attribute('class')
    assert plist[1].children()[0].tag_name() == 'button' # accordion panel button
    apanel = plist[1].children()[1]
    text = apanel.children()[0].children()[0]
    assert text.tag_name() == 'p'
    assert 'Set the master password.' in text.text()
    inp = apanel.children()[0].children()[1].get('input')
    tag = inp.parent().children()[1].children()[0].tag_name()
    assert tag == 'img'
    ximg = inp.parent().children()[1].children()[0]
    buttons = apanel.children()[0].children()[1].find('button')
    span = apanel.children()[0].children()[1].find('span')[0]  # password length
    assert len(buttons) == 4
    assert 'show or hide the password' in buttons[0].get_attribute('title')
    assert 'generate pseudo-random cyptic password' in buttons[1].get_attribute('title')
    assert 'generate pseudo-random memorable password' in buttons[2].get_attribute('title')
    assert 'copy password to clipboard' in buttons[3].get_attribute('title')
    buttons[0].click() # show
    buttons[1].click() # cryptic password
    assert int(span.get_attribute('innerHTML')) > 10
    time.sleep(DBT)
    buttons[2].click() # memorable password
    assert int(span.get_attribute('innerHTML')) > 10
    time.sleep(DBT)

    # verify copy operation
    if not is_headless(py):
        # pyclip doesn't work in headless mode.
        buttons[3].click() # copy to clipboard
        time.sleep(DBT)

        cb_data = pyclip.paste().decode('utf-8')
        debug(f'cb_data: {len(cb_data)} "{cb_data}"')
        assert cb_data.count('/') == 2 # memorable passwords have two /'s
        assert len(cb_data) > 8

        # verify copy operation with known data
        #inp.parent().children()[1].click() # clear the input field
        ximg.click()  # click the x rather than use pylenium clear
        time.sleep(DBT)

        inp.type('test password')
        time.sleep(DBT)
        buttons[3].click()

        assert int(span.get_attribute('innerHTML')) == 13
        cb_data = pyclip.paste().decode('utf-8')
        assert cb_data == 'test password'

    # Encryption Algorithm
    assert plist[2].children()[0].text().strip() == 'Encryption Algorithm'
    assert plist[2].children()[1].children()[0].children()[0].tag_name() == 'p'
    text = plist[2].children()[1].children()[0].children()[0].get_attribute('innerHTML')
    assert text.strip() == 'Choose the algorithm to use for encryption and decryption.'
    assert plist[2].children()[1].children()[4].tag_name() == 'input'

    elem = plist[2].children()[1].children()[1]
    assert elem.get_attribute('type') == 'radio' # first radio button
    elem = plist[2].children()[1].children()[4]
    assert elem.get_attribute('type') == 'radio' # second radio button

    topc[2].click()  # collapse all
    plist[2].click()  # open panel
    time.sleep(DBT)
    plist[2].children()[1].children()[4].click()
    time.sleep(DBT)
    plist[2].children()[1].children()[1].click()
    time.sleep(DBT)
    plist[2].children()[1].children()[4].click()
    time.sleep(DBT)
    plist[2].children()[1].children()[1].click()
    time.sleep(DBT)
    plist = py.get('#page-prefs').children() # radio messes up the DOM
    topc = py.get('#x-prefs-content-id').children()  # select messes up the DOM

    # Theme Colors
    assert plist[3].children()[0].text().strip() == 'Theme Colors'
    topc[2].click()  # collapse all
    plist[3].click() # open panel
    select = plist[3].children()[1].children()[0].children()[1].children()[1]
    assert select.tag_name() == 'select'

    select.select(0)
    time.sleep(DBT)
    plist = py.get('#page-prefs').children() # select messes up the DOM
    select = plist[3].children()[1].children()[0].children()[1].children()[1]
    plist[3].click() # open panel

    select.select(1)
    time.sleep(DBT)
    plist = py.get('#page-prefs').children() # select messes up the DOM
    select = plist[3].children()[1].children()[0].children()[1].children()[1]
    plist[3].click() # open panel

    select.select(0)
    time.sleep(DBT)
    plist = py.get('#page-prefs').children() # select messes up the DOM
    topc = py.get('#x-prefs-content-id').children()  # select messes up the DOM

    # Theme Properties
    assert plist[4].children()[0].text().strip() == 'Theme Properties'
    topc[2].click()  # collapse all
    plist[4].click() # open panel
    time.sleep(DBT)

    # Record Field Templates
    assert plist[5].children()[0].text().strip() == 'Record Field Templates'
    topc[2].click()  # collapse all
    plist[5].click() # open panel
    time.sleep(DBT)

    # Record Field Name Type Map
    assert plist[6].children()[0].text().strip() == 'Record Field Name Value Type Map'
    topc[2].click()  # collapse all
    plist[6].click() # open panel
    time.sleep(DBT)

    # Icon Fill Color Filter Algorithm Settings
    assert plist[7].children()[0].text().strip() == 'Icon Fill Color Filter Algorithm Settings'
    topc[2].click()  # collapse all
    plist[7].click() # open panel
    time.sleep(DBT)

    # Change Title
    assert plist[8].children()[0].text().strip() == 'Change Title'
    topc[2].click()  # collapse all
    plist[8].click() # open panel
    time.sleep(DBT)

    # Reset
    assert plist[9].children()[0].text().strip() == 'Reset'
    topc[2].click()  # collapse all
    plist[9].click() # open panel
    button = plist[9].children()[1].children()[0].children()[1].children()[0]
    assert button.tag_name() == 'button'
    button.click()
    time.sleep(DBT)
    # go back to preferences
    py.get('#x-topmenu-button').click() # open the menu
    py.get('#x-menu-content').children()[1].click() # preferences
    plist = py.get('#page-prefs').children() # select messes up the DOM
    topc = py.get('#x-prefs-content-id').children()  # select messes up the DOM
    time.sleep(DBT)

    # Raw Edit
    assert plist[10].children()[0].text().strip() == 'Raw Edit'
    topc[2].click()  # collapse all
    plist[10].click() # open panel
    time.sleep(DBT)
    save_button = py.get('#x-prefs-raw-edit-save')
    save_button.click()
    py.get('#x-topmenu-button').click() # open the menu
    py.get('#x-menu-content').children()[3].click() # records
    time.sleep(DBT)


def test_load(py):
    'load'
    py.visit(URL)
    assert py.find('#x-topmenu-button')
    py.get('#x-topmenu-button').click()
    py.get('#x-menu-content').children()[2].click() # load
    assert py.get('#x-load-content-id')
    top = py.get('#x-load-content-id')
    topc = top.children()
    assert len(topc) == 3
    assert topc[1].tag_name() == 'button' # expand
    assert topc[2].tag_name() == 'button' # collapse
    assert py.get('#page-load')
    page = py.get('#page-load')
    assert page.tag_name() == 'div'
    plist = page.children()
    assert len(plist) == 5

    title = plist[0].children()[0].text().strip()
    assert title == 'Load Page'
    time.sleep(DBT)

    title = plist[1].children()[0].text().strip()
    assert title == 'Internal Example'
    topc[2].click()  # collapse all
    plist[1].click() # open panel
    button = plist[1].children()[1].children()[0].children()[1].children()[0]
    assert button.tag_name() == 'button'
    button.click() ## load example
    time.sleep(DBT)

    title = plist[2].children()[0].text().strip()
    assert title == 'Paste from Clipboard'
    topc[2].click()  # collapse all
    plist[2].click() # open panel
    time.sleep(DBT)

    title = plist[3].children()[0].text().strip()
    assert title == 'Read Local File'
    topc[2].click()  # collapse all
    plist[3].click() # open panel
    time.sleep(DBT)

    title = plist[4].children()[0].text().strip()
    assert title == 'View Raw Data'
    topc[2].click()  # collapse all
    plist[4].click() # open panel
    time.sleep(DBT)
    topc[2].click()  # collapse all


def test_records(py): # pylint: disable=too-many-locals,too-many-statements
    'records'
    # First load the example
    py.visit(URL)
    py.get('#x-topmenu-button').click()
    py.get('#x-menu-content').children()[2].click() # load
    plist = py.get('#page-load').children()
    plist[1].click() # open panel
    button = plist[1].children()[1].children()[0].children()[1].children()[0]
    assert button.tag_name() == 'button'
    button.click() ## load example
    time.sleep(DBT)

    py.get('#x-topmenu-button').click()
    py.get('#x-menu-content').children()[3].click() # records
    assert py.get('#x-data-content-id')
    top = py.get('#x-data-content-id')
    topc = top.children()

    # top level buttons
    assert py.get('#page-data')
    page = py.get('#page-data')
    assert page.tag_name() == 'div'
    plist = page.children()
    assert len(plist) == 1
    assert len(topc) == 8
    expand_button = topc[3]
    collapse_button = topc[4]
    add_button = topc[5]
    nrecs_span = topc[6]
    assert expand_button.tag_name() == 'button'
    assert collapse_button.tag_name() == 'button'
    assert add_button.tag_name() == 'button'
    assert nrecs_span.tag_name() == 'span'

    # Search box
    search = plist[0].children()[1].children()[0].children()[0]
    imgx = plist[0].children()[1].children()[0].children()[1].children()[0]
    assert search.tag_name() == 'input'
    assert imgx.tag_name() == 'img'
    search.type('g')
    time.sleep(DBT)
    imgx.click()
    time.sleep(DBT)

    records = py.get('#x-data-records-div').children()
    assert len(records) == 11

    records[0].click() # open
    time.sleep(DBT)

    records[0].click() # close
    time.sleep(DBT)

    add_button.click() # open
    time.sleep(DBT)

    # Add a record
    add_content = py.get('#x-data-add-content-id')
    input_rid = add_content.children()[2].find('input')[0]
    add_fields = py.get('#x-data-field-container')
    assert len(add_fields.children()) == 5  # five k/v fields
    afn1 = add_fields.children()[0].children()[0].children()[0].children()[0]
    afv1 = add_fields.children()[0].children()[1].children()[0].children()[0]
    afn2 = add_fields.children()[1].children()[0].children()[0].children()[0]
    afv2 = add_fields.children()[1].children()[1].children()[0].children()[0]
    afn3 = add_fields.children()[2].children()[0].children()[0].children()[0]
    #afv3 = add_fields.children()[2].children()[1].children()[0].children()[0]
    afn4 = add_fields.children()[3].children()[0].children()[0].children()[0]
    #afv4 = add_fields.children()[3].children()[1].children()[0].children()[0]

    assert afn1.tag_name() == 'input'
    assert afn1.tag_name() == 'input'
    assert afv2.tag_name() == 'input'
    assert afv2.tag_name() == 'input'
    #assert afv3.tag_name() == 'input'
    assert afn4.tag_name() == 'input'

    add_field_button = add_content.children()[5]
    create_button = add_content.children()[6]
    discard_button = add_content.children()[7]
    assert add_field_button.text() == 'Add Field'
    assert create_button.text() == 'Create'
    assert discard_button.text() == 'Discard'

    # create new record
    input_rid.type('aaa-test-record')

    afn1.clear()
    afn1.type('url')
    afv1.type('http://go-there.com')

    afn2.clear()
    afn2.type('username')
    afv2.type('mithrandir')

    afn3.clear()
    afn3.type('password') # field value changes to password
    afv3 = add_fields.children()[2].children()[1].children()[0].children()[0]
    buttons = afv3.find('button')
    assert 'eye' in buttons[0].find('img')[0].get_attribute('src')
    assert 'cog' in buttons[1].find('img')[0].get_attribute('src') # cryptic
    assert 'cogs' in buttons[2].find('img')[0].get_attribute('src') # memorable
    buttons[0].click() # make it visible
    buttons[1].click() # cryptic
    time.sleep(DBT)
    buttons[2].click() # memorable
    time.sleep(DBT)
    buttons[1].click() # cryptic
    time.sleep(DBT)

    afn4.clear()
    afn4.type('notes')
    textarea = add_fields.children()[3].children()[1].find('textarea')[0]
    textarea.type('multi\nline\ntext')
    time.sleep(DBT)
    create_button.click()
    time.sleep(DBT)
    records = py.get('#x-data-records-div').children()
    assert len(records) == 12

    # edit record
    records[0].children()[0].click() # select the first record
    panel = py.get('#x-record-view-container-0')
    pencil_button = panel.children()[12].find('button')[0].find('img')[0]
    assert 'pencil' in pencil_button.get_attribute('src')
    pencil_button.click() # go to the edit screen
    edit_fields_container = py.get('#x-record-view-container-0-edit')
    edit_fields = py.get('#x-data-field-edit-container')

    # Get the buttons.
    save_button = edit_fields_container.children()[2]
    revert_button = edit_fields_container.children()[3]
    add_field_button = edit_fields_container.children()[4]
    assert save_button.get_attribute('innerHTML') == 'Save'
    assert revert_button.get_attribute('innerHTML') == 'Revert'
    assert add_field_button.get_attribute('innerHTML') == 'Add Field'

    # Get the edit fields in the record we added above.
    ef1n = edit_fields.children()[0].children()[0].find('input')[0] # fld 1 - name
    ef1v = edit_fields.children()[0].children()[1].find('input')[0] # fld 1 - value
    ef1b = edit_fields.children()[0].children()[2] # fld 1 - buttons
    ef2n = edit_fields.children()[1].children()[0].find('input')[0] # fld 1 - name
    ef2v = edit_fields.children()[1].children()[1].find('input')[0] # fld 1 - value
    ef3n = edit_fields.children()[2].children()[0].find('input')[0] # fld 1 - name
    ef4n = edit_fields.children()[3].children()[0].find('input')[0] # fld 1 - name

    # verify
    assert len(ef1b.find('button')) == 2  # move down and trash

    assert ef1n.get_attribute('value') == 'url'
    assert ef1v.get_attribute('value') == 'http://go-there.com'
    assert ef2n.get_attribute('value') == 'username'
    assert ef2v.get_attribute('value') == 'mithrandir'
    assert ef3n.get_attribute('value') == 'password'
    assert ef4n.get_attribute('value') == 'notes'

    buttons = edit_fields.children()[2].children()[1].find('button')
    assert 'eye' in buttons[0].find('img')[0].get_attribute('src')
    assert 'cog' in buttons[1].find('img')[0].get_attribute('src')
    assert 'cogs' in buttons[2].find('img')[0].get_attribute('src')
    assert 'copy' in buttons[3].find('img')[0].get_attribute('src')

    textarea = edit_fields.children()[3].children()[1].find('textarea')[0]

    # update the fields and save the results.
    ef1v.clear()
    ef1v.type('https://go-there.com')
    time.sleep(DBT)
    buttons[1].click()  # change the password
    time.sleep(DBT)
    save_button.click()
    time.sleep(DBT)

    # verify the changes
    records = py.get('#x-data-records-div').children()
    panel = py.get('#x-record-view-container-0')
    assert len(records) == 12
    records[0].children()[0].click() # select the first record
    time.sleep(DBT)
    assert panel.children()[0].children()[0].text() == 'url'
    assert panel.children()[1].children()[0].text() == 'https://go-there.com'


def test_save(py):
    'save'
    py.visit(URL)
    assert py.find('#x-topmenu-button')
    py.get('#x-topmenu-button').click()
    py.get('#x-menu-content').children()[4].click() # save
    assert py.get('#x-save-content-id')
    top = py.get('#x-save-content-id')
    topc = top.children()
    assert len(topc) == 3
    assert topc[1].tag_name() == 'button' # expand
    assert topc[2].tag_name() == 'button' # collapse
    assert py.get('#page-save')
    page = py.get('#page-save')
    assert page.tag_name() == 'div'
    plist = page.children()
    assert len(plist) == 3

    title = plist[0].children()[0].text().strip()
    assert title == 'Save Page'
    time.sleep(DBT)

    title = plist[1].children()[0].text().strip()
    assert title == 'Paste Data to Clipboard'
    topc[2].click()  # collapse all
    plist[1].click() # open panel
    time.sleep(DBT)

    title = plist[2].children()[0].text().strip()
    assert title == 'Download to File'
    topc[2].click()  # collapse all
    plist[2].click() # open panel
    time.sleep(DBT)

    topc[2].click()  # collapse all
