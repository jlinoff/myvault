# myVault
[![Releases](https://img.shields.io/github/release/jlinoff/myvault?style)](https://github.com/jlinoff/myvault/releases)

<details>

<summary>About</summary>

The meta data in the table is populated during the build process when the on-line help is generated.


| Field | Value |
| ----- | ----- |
| Author | Joe Linoff |
| Copyright (&copy;) | 2021 |
| License| MIT Open Source |
| Version | `__VERSION__` |
| Build | `__BUILD__` |
| GitCommitId | `__GIT_COMMIT_ID__` |
| GitBranch | `__GIT_BRANCH__` |
| project | [https://github.com/jlinoff/myvault](https://github.com/jlinoff/myvault) |
| webapp | [https://jlinoff.github.io/myvault](https://jlinoff.github.io/myvault) |
| help | [https://jlinoff.github.io/myvault/help/index.html](https://jlinoff.github.io/myvault/help/index.html) |
| cryptor | [https://jlinoff.github.io/myvault/xtra/cryptor.html](#https://jlinoff.github.io/myvault/xtra/cryptor.html)


</details>

<details>

<summary>Table of Contents</summary>

<!--ts-->

  * [Overview](#overview)
  * [Layout](#layout)
    - [Menu](#menu)
    - [About Page](#about-page)
    - [Preferences](#preferences-page)
    - [Load](#load-page)
    - [Records](#records-page)
      - [Search](#search)
      - [Add New Record](#add-new-record)
      - [View Record](#view-record)
      - [Delete Record](#delete-record)
      - [Edit Record](#edit-record)
    - [Save](#save-page)
    - [Master Password](#master-password)
    - [Automatic Password Generation](#automatic-password-generation)
      - [Cryptic](#cryptic)
      - [Memorable](#memorable)
      - [Custom](#custom)
    - [Security](#security)
      - [MITM](#mitm)
      - [Third Party Web Site Security](#third-party-web-site-security)
      - [Over the Shoulder Surfing Attack](#over-the-shoulder-surfing-attack)
      - [Clipboard Attack](#clipboard-attack)
      - [Unattended Browser](#unattended-browser)
      - [Malware: Key Logging and Screen Recording](#malware--key-logging-and-screen-recording)
      - [Website Spoofing](#website-spoofing)
      - [Protecting Yourself](#protecting-yourself)
      - [MFA](#mfa)
    - [Extras](#extras)
      - [Color2RGB](#color2rgb)
      - [Cryptor](#cryptor)
    - [Themes](#themes)
    - [How to access the app](#how-to-access-the-app)
    - [How to use the builtin example](#how-to-use-the-builtin-example)
    - [How to create the first record](#how-to-create-the-first-record)
    - [How to create the second record](#how-to-create-the-second-record)
    - [How to view a record](#how-to-view-a-record)
    - [How to edit a record](#how-to-edit-a-record)
    - [How to delete a record](#how-to-delete-a-record)
    - [How to search for a record](#how-to-search-for-a-record)
    - [How to get help](#how-to-get-help)
    - [How to install and run locally without internet access](#how-to-install-and-run-locally-without-internet-access)
    - [How to develop using the myvault-dev docker container](#How-to-develop-using-the-myvault-dev-docker-container)
    - [How to test github actions locally](#how-to-test-github-actions-locally)
    - [How to download the github workflow artifact](#how-to-download-the-github-workflow-artifact)
    - [How to release the webapp](#how-to-release-the-webapp)
    - [How to share a records file](#how-to-share-a-records-file)
    - [How to change the master password](#how-to-change-the-master-password)
    - [How to import records from JSON](#how-to-import-records-from-json)

<!--te-->

</details>

## Overview

_myVault_ is single page web app, available
at [https://jlinoff.github.io/myvault](https://jlinoff.github.io/myvault),
that allows you to securely manage
your personal data as searchable records in a secure, flexible
manner. Each record contains arbitrary data that you care about, such
as the password for a site or the last book you read with notes. You
define the record format and contents. Each record can be
different. Both the format and the content of each record can be
changed at anytime.

_myVault_ allows you to control where the data is stored. The web app
is self contained so data is never shipped to external web site. I
tend to save my data in a file in a common place (like Google Drive
and iCloud) so that all my devices can access it. If you store your
data on a local drive make sure that it is backed up regularly.

The record data is protected by a master password. It is used to
encrypt all data that is exported and decrypt all data that is
imported. For more information see the [Master Password](#master-password)
section.

Each record is composed of fields. A field has a name and a value. One
key feature of the program is that the field types changes based on
the field name. Thus, if a field name contains the word `"password"` or
`"secret"`, the value changes to a password input which hides the
value. If the field name contains the word `"notes"`, the value field
changes to a multi-line text box to allow you enter multiple lines of
text. All other fields like `"name"` or `"url"` are treated as simple
strings. Although the webapp does to try to identify _URLs_ and present
them as links in view mode.

_myVault_ is very customizable. You can change the page title, the encryption
algorithm used, the page theme colors, the page theme properties like
font size, templates that define the fields used in records, the
mapping between field names and their types, and more. The
customization is done on the preferences page. Each customization
panel has some information about what it does.

_myVault_ also provides built-in password generation for both cryptic
and memorable passwords for all password fields, including the master
password. See the [Master Password](#master-password) for details on
cryptic and memorable passwords.

The app also provides built in example data to allow you to play with the
capabilities without committing to anything.  It is a great way to get
familiar with the program and is also really useful during
development.

I use _myVault_ to store my password information and keep track of
books that i have read. The books don't really need to be secure. I
simply use it because it is convenient to use on my mobile devices.

There is a related utility called
_cryptor_ (
[https://jlinoff.github.io/myvault/xtra/cryptor.html](https://jlinoff.github.io/myvault/xtra/cryptor.html))
that allows you to
conveniently encrypt and decrypt any text file with arbitrary data
from the browser. You can access it from the "`About`" page. I
originally built it as a prototype during development but then found
it so useful that i decided to keep it. It is not part of the official
_myVault_ webapp because the function, although similar, is more
general because _cryptor_ does not care about the format of file
contents whereas _myVault_ does care about the format.

## Layout
This section describes the layout of the app and talks about each section in
detail.

All sections use accordion panels to display options. Opening the
panel provides more information about what it does. There are icons at
the top of the accordion panels that allow you to expand or collapse
all of the panels at once.

### Menu
It all starts with the menu. Which is an icon positioned in the upper
right corner of the app window. There 5 menu options for selecting one
of the five different pages.  The pages are briefly described in the
table below and more thoroughly described in subsequent sections.

| Page | Brief Description |
| ----- | ----------------- |
| About | Presents information about the version and provenance of the app. It also provides links to the project and this help. |
| Preferences   | Allows you to customize the app. Including defining the master password, choosing the theme colors and changing the title. |
| Load   | Specify the data to load from a file or the clipboard. It also provides example data for playing around.  |
| Records   | View the records, edit them, create news ones or delete them. |
| Save   | Save changed to a file or the clipboard.   |

The upper left is reserved for brief ephemeral status messages and the
middle is reserved for the title and subtitles.

### About Page
This page contain build information about the webapp. It basically has the
same information as the "About" section at the top of this page. The specific fields
are:

| Field| Description |
| ---- | ----------- |
| Author | The program author. |
| Copyright | The copyright year. |
| License | The source code license always MIT for this project. |
| Version | The program version (semantic versioning 2.0.0). |
| Build | The build date and time. It is populated at build time. |
| GitCommitId | The git commit id of the released source code. It is populated at build time. |
| GitBranch | The git branch of the released source code. It is populated at build time. |
| Project | The github project link |
| Webapp | The webapp URL link. |
| HelpDoc | A link to this help documentation. |
| Cryptor | A link to the _cryptor_ utility. |

You can use the build and git branch information when describing a problem.

### Preferences Page
This page contains a collection of interesting preferences that you can change to customize the interface.
They are briefly summarized in the table below.

| Panel | Brief Description |
| ----- | ----------------- |
| Master Password | Set the master password. This is used to encrypt and decrypt all data so that it cannot be read by anyone else. |
| Encryption Algorithm | Choose one of the algorithms that were compiled into the webapp. |
| ThemeColors | Choose which the color scheme you want or define our own. |
| Theme Properties | Choose the theme properties you want. This is not very user friendly because it requires knowledge of the internal implementation. |
| Record Field Templates | Define templates that can be used to prepopulate the keys in a record. This is very useful when you want a common record format. |
| Record Field Name Based Types | Associate record field names with types like password, textarea and string so that when a user types in a field name like "notes", the value becomes a textarea.
| Change Title | Define a custom title for the webapp. This is useful for defining a logical name for a group of records.|
| Reset | Reset the internal state by clearing the internal session storage and reloading. This is useful during development when the common data changes. |
| Raw Edit | Allows you to bypass the UI and edit the JSON data directly. Not generally recommended. |

Most of the customizable preferences are in JSON format.

### Load Page
This page contains the options available for loading data. They are briefly summarized in the table below.

| Panel | Brief Description |
| ----- | ----------------- |
| Internal Example | Built in example data consisting of 11 made up password records that can be used to play around with the program. |
| Paste from Clipboard | Load the content of the clipboard as data and decrypt using the master password if necessary. This option can be used to transfer data from a file that is open in an external editor. |
| Read Local File | Load the content of a local file as data and decrypt using the master password if necessary. |
| View Raw Data | View or change the raw data that was loaded by the previous options. This is useful for debugging or entering data manually. If there is no data, reload the data. |

### Records Page
Work with the records. You can add, change or delete records.  The top
level records page shows all of the records in accordion panels. You
can click on a record accordion panel to see the record details.

#### Search
There is search bar at the top that allows you search for records that
match a pattern. The search searches all of the record titles in a
case insensitive manner. The default is to search for _all_
records. The search syntax is the Javascript RegExp syntax.

The records list is updated as you type.

#### Add New Record
Underneath the search bar there are three buttons: a button to expand all of the
accordion panels, a button to collapse the all of the accordion panels and a "+" button
to add a new record. There is also a count of the number of records which match
the search criteria.

When you click on the add new record button a new sub-page
appears.

Enter the data for the fields that you want to add and click
on the "Create" button to create the new record.

Before entering any field information you can choose a record
field template from the "Template" selection box if you want to use
predefined fields. This is helpful if you want a common format for
the records. Note that you can define your own templates in the
"Preferences".

Click the "Discard" button to discard the changes and go back to the
main records page.

The "Add Field" button allows you to append a new field which is a new
row at the end with name and a value.

A field will not be included in a record if either the name or the
value are empty.

Certain field names will change the value type. For example a field
named "password" will create a password input. There are three value
types: string (basic input), textarea (multi-line input) and password
(a password field). The field type will change _as you type the name_.
Thus the name "passwor" (missing the final "d") will be string field
but when you type the final "d", the value field will change to a
password. You can define the mapping between field names and field
values in the "Preferences" in the "Record Field Name Based
Types" accordion entry.

#### View Record
When a record is expanded you will see a view of its contents. URLs
will be seen as links (the program figure that out automatically),
passwords will not be displayed (you can see them by clicking on the
eye icon). All fields can be copied to the clipboard by clicking the
copy icon on the far right.

#### Delete Record
A record can be deleted by clicking on the trashcan icon in view mode.
See the "how to" entries in subsequent sections for details.

#### Edit Record
A record can be edited by clicking on the pencil icon.
See the "how to" entries in subsequent sections for details.

### Save Page
This page contains the options available for saving data. They are briefly summarized in the table below.

| Panel | Brief Description |
| ----- | ----------------- |
| Paste Data to Clipboard | Copy the master password encrypted data to the clipboard. |
| Download to File | Download the master password encrypted data to a local file. If you download the file to a shared resource like Google Drive or iCloud, the file can be shared by different devices.|

## Master Password
The record data is protected by a master password. It is used to
encrypt all data that is exported and decrypt all data that is
imported so the only data ever saved is secure which means that the
encrypted data in the stored file looks something like this.

```
----------------------- crypt-aes-256-gcm prefix -----------------------
5YTMBBuyj0It/9cF6V8SxYa3MXXjRDsXKpcVG98fPSLdPcT75sUCnR7W/iTKMjEpZzrV3n0S
HVX/czCqSeaJwTKHjsXyv4RKylIVRKR6fEDNFkmb8eUZC8nvqZdENWk2zkM45F4Iib3J5HUa
PysK4noxEqIAimLlieGSWwvPD14XaRTGytBUxy4N6FmlahokO1bnBk6gwDTpLjNpxDkzI2Fa
mRqoOzUJsmnNG8SAQtSNz4wBkdPJ46nOens309FWQoA5KEMQigaDE1tqgFdsd6d50HUd6idE
.
.
yBmfWfXNtDoD7KSOIEGjRck6rrLNNDI9D3up8818438kVyrg8Srvrt0qmoH54SSKaB9/jb4V
CZh35BY51SpHrsKFs91Qj54QHn9SSWA2HBOPfODomEqpG3BX2HPmQ3BIMHCWyrS6X9gLbJCB
LqbbTaqa7kjlOdTuDEPnZ9Acl0smFdIt0/qa2CWHXGuTsoHL7JjwwtIMOPMV3kFAZEDOpC9l
6HscqWKZ9gXH7INKAko0MHW75ckR6AOVTxrS7J93j6pXQhHgOYGMoyzCQQL0cx2Ix6eIPw==
----------------------- crypt-aes-256-gcm suffix -----------------------
```
As you can see, it is not of much use without the password.

> If your master password is lost, the data cannot be recovered
> because the program never stores it.

The encryption algorithm is AES-256 which is considered quite secure
and should be relatively safe from future quantum attacks. Furthermore,
the encryption algorithm runs _inside_ the browser so, as mentioned earlier,
your data is never shipped to an external server.

I recommend creating a memorable password ([Memorable](#memorable) below)
because this is the _only_ password that you have to remember to
access all of your password records. It may even make sense to write
it down and store it in a secure place.

## Automatic Password Generation
all passwords (including the master password) have four extra buttons:
an eye button to let you view the password as plaintext, a single gear
button that generates a _cryptic_ password, a multiple gear button
that generates a _memorable_ password and a copy button that copies
the password to the clipboard that can be pasted externally.

### Cryptic
Cryptic passwords are secure, hard to remember passwords that are a
pseudo random collection of upper case letters, lower case letters,,
numbers and special characters. Here are two examples of cryptic
passwords: "`t0t5Q2eL!6E7!s6nWp6lv1`" and "`SiPeD_dLQa03NIG`".

### Memorable
Memorable passwords are secure, easy to remember passwords that are
composed of three pseudo randomly chosen English words separated by a
slash. Here are two examples of memorable passwords:
"`farming/naval/decision`" and "`viewed/frequencies/looking`".

### Custom

The cryptic and memorable buttons make it easy to generate passwords
automatically but if you prefer another style you can always enter
your passwords manually.

## Security
_myVault_, like all webapps or programs, has security challenges. By
understanding them you can better protect your record data.

### MITM
Unlike many other webapps, it does _not_ talk to an internet based web
server which means that the data is never transported from your
computer over the internet. Because no data is ever transmitted, it is
protected from monster-in-the-middle (MITM) attacks.

### Third Party Web Site Security
Furthermore, because it does not send the data to a server, it is
not vulnerable to how cybersecurity is managed on the server by a third
party.

> You can verify that _myVault_ is not sending data out by monitoring
> outbound traffic from your system. This web app never sends any data.

Instead, encryption and decryption is run _inside_ the browser using
algorithms implemented in Rust and incorporated into the _myVault_
using WebAssembly. This means that the data is never exposed outside
of the browser unless it is encrypted. It also means that the
algorithms run quite fast and are not exposed in javascript.

_However, running the algorithms internally and not exporting the data
over the internet does not guarantee that your data is secure_.

### Over the Shoulder Surfing Attack
Internally the data is stored in decrypted form, so you may be
vulnerable to over the shoulder surfing attacks where someone or
something (like a camera) watches or films you typing. You could be
observed opening a record and then clicking to display the password in
plaintext which could allow that information to be stolen. This can be
mitigated by being aware of your surroundings to make sure you are not
being watched or filmed.


### Clipboard Attack
Yet another type of vulnerability is clipboard attacks if/when data is
copied to the clipboard for cut and paste operations. This
vulnerability exists because the clipboard is a global resource that
can be accessed by other, independent applications.

Clipboard attacks can be mitigated by making sure that your computer
does not have malware installed or by not copying to the clipboard.
Although it is probably impractical to not use the clipboard at all
so, if you do use the clipboard, make sure that you always reset it
after any copy/paste operation to minimize any chances that it will be
captured by malware or observed by an attacker. You can reset it by
simply selection a single letter or word and copying it.

Another perhaps better way to mitigate the clipboard vulnerability
would be to eliminate the need for the clipboard by modifying _myVault_
to automatically login in for you based on record data using an
HTTP POST operation but that is not currently available.

### Unattended Browser
If you leave the browser unattended after you have loaded your record data,
someone can sit down and see the records because they are
impersonating you. This can be mitigated by always closing the webapp
tab or locking your screen when you leave the computer.

### Malware: Key Logging and Screen Recording
If malware has been installed on your computer that does screen shots or
key logging, you are in trouble. It means that an attacker can see what
you are doing and capture what you are typing. The best way to mitigate
these forms of attacks is to keep your system up to data by installing
security patches and use some sort of security tool to protect your
system.

### Website Spoofing
Finally, web site spoofing could be used to direct you to a website
that could be used to steal your information using a look alike
webapp. To mitigate that make sure that you accessing the _myVault_ from
a known, trusted site.

### Protecting Yourself
In summary, even security can never be guaranteed, the best way to
protect your data is to follow commonly recommended security
practices:

1. Keep all of your security patches up to date.
2. Keep malware off of your systems.
3. Make sure that you are not observed.
4. Never share sensitive information (like passwords).
5. Backup your data.


### MFA
Several folks asked why multi-factor authentication (MFA) was not
included to provide and additional layer of security.

I deliberately did not include MFA because it requires an
authentication/authorization service and I want this application to
_never_ talk to the internet unless the user explicitly requests
access to a known shared file service through the "`Load`" or "`Save`"
pages. In other words, you should never see any internet traffic
originating from this webapp that you cannot account for.

### Extras
There were a couple of single page web apps that i developed while building _myVault_.
They turned out to be so useful that i left them in. They are not elegant or well
designed or well tested.

### Color2RGB
This is a utility page that allows you to type in any color name and have it normalized
to its RGB and hex value. For example `red` --> `#ff0000` and `rgb(255,0,0)`.
To access it click here: [xtra/color2rgb.html](/xtra/color2rgb.html).

### Cryptor
This is a utility page that allows you to encrypt and decrypt arbitrary data
with cryptic, memorable or custom passwords.
It can load from and save to files and the clipboard.
I have found it to be very useful for encrypting arbitrary files.
To access it click here: [xtra/cryptor.html](/xtra/cryptor.html).

## Themes
A theme is composed of a set of colors (foreground and background) and
a set of properties that define other style information. Each theme also
has a unique name. Theme colors and properties are can be selected and/or
defined on the "`Preferences`" page.

The idea behind themes is to make the CSS styling dynamic to allow users
to change and save styles from the UI. The current implementation is poor
because it is too complex and is not documented.

The current properties are _standard_ and _large_. They are a first
approximation of styles that make the webapp usable for different
screen sizes. I use _standard_ on my laptop and _large_ in landscape
mode on my mobiles devices.

When a theme color or property is changed, the display is updated
immediately.

## How to access the app
Navigate to [https://jlinoff.github.io/myvault/](https://jlinoff.github.io/myvault/)
in your browser.

## How to share a records file
The easiest way to share records is to save the records file to a
shared volume from the "`Save`" page to a shareable resource like
_Google Drive_ or _iCloud_. Then provide the password to other folks
entrusted to access the data.

> Take care in transmitting the password to keep the data safe.

## How to use the builtin example
An example is provided that allows you to play with the webapp to get
familiar with it.

It contains 11 built-in, hard-coded records that can be used to play
around with the tool to learn how it is used. Note that this operation
changes the password to "`example`" and the title to "`myExample`". The
password and title values can be changed to anything you want in the
"`Preferences`".

To load the example follow these steps.

1. Go to the app in your browser: [https://jlinoff.github.io/myvault](https://jlinoff.github.io/myvault)
2. Navigate to the "`Load`" page from the menu.
3. Click on the "`Internal Example`" accordion entry.
4. Click the "`Load Example`" button.
5. Navigate to the "`Records`" to view the records.

Once the example is loaded, you can change the records from the "`Records`"
page, add new records, save them and load them.

## How to create the first record
Creating the first record requires you to define a master password,
input the record data and save it. Here are the steps.

1. Go to the app in your browser: [https://jlinoff.github.io/myvault](https://jlinoff.github.io/myvault)
2. Navigate to the "`Preferences`" page from the menu.
3. Click on the "`Master Password`" accordion entry.
4. Enter a password. I used the memorable password generator.
5. Navigate to the "`Records`" page from the menu.
6. Click on the "`+`" (plus) button.
7. Choose the PASS4 template.
8. Enter the data: URL, username, password and a note about it.
9. Navigate to the "`Save`" page from the menu.
10. Click on the "`Download to File`" accordion entry.
11. Enter different file name if you want. The default is "`vault.txt`".
12. Click the "`Download`" button.

## How to create the second record
Creating the first record requires you to enter the master password
you created for the first record, load the record data from the file
that you created, input the second record data and then save it.
Here are the steps.

These are the same steps used for all subsequent records.

1. Go to the app in your browser: [https://jlinoff.github.io/myvault](https://jlinoff.github.io/myvault)
2. Navigate to the "`Preferences`" page from the menu.
3. Click on the "`Master Password`" accordion entry.
4. Enter the password you created for the first record.
5. Navigate to the "`Load`" page from the menu.
6. Click on the "`Read Local File`" accordion entry.
7. Click on the "`Select File`" button and choose a file. It will load automatically if the master password is correct. Otherwise it will fail. If it fails. Carefully check and re-enter you master password (go back to step 1).
8. Navigate to the "`Records`" page from the menu.
9d8. Click on the "`+`" (plus) button.
10. Choose the PASS4 template.
11. Enter the data: URL, username, password and a note about it.
12. Navigate to the "`Save`" page from the menu.
13. Click on the "`Download to File`" accordion entry.
14. Enter different file name if you want. The default is "`vault.txt`".
15. Click the "`Download`" button.

## How to view a record
To view a record, load the data as described in the
[How to create a second record section](#how-to-create-a-second-record-section),
navigate to the "`Records`" page and click on the record you want to
view. It will expand to show the record data in a read-only
form. Passwords are never shown to protect from over the shoulder
surfing.  You can make them visible by clicking on the eye icon. All
fields can be copied to the clipboard by clicking on the copy icon.

## How to edit a record
To edit a record, first view the record and then click on the pencil icon.

The shows an edit view of the record inline. The up/down arrows allow
you to move the fields rows up an down.

The trashcan icon next to the field allows you to delete the field.

## How to delete a record
To delete a record, first view the record and then click on the trashcan icon.

## How to search for a record
On the records page the search bar allows you to search for a record. Simply type in
any words that are in the title and it will find records that match as you type.

## How to get help
To get help,
navigate to [https://jlinoff.github.io/myvault/](https://jlinoff.github.io/myvault/),
click on the "`About`" menu option then click on "`HelpDoc`" entry
in the table.

The help document is generated from the `README.md` during the build process so that
it can be associated with each release.

## How to install and run locally without internet access
These are the steps to run the web app locally without internet access.

> Note that you will need internet access to set things up.

You must have a number of dev tools installed. They are shown in the table below.


| Tool | Aliases | Note |
| ---- | ----- | ---- |
| apsell | _none_ | ASCII spell checker |
| cargo | _none_ | rust package manager and crate host |
| column | _none_ | comman line text columnizer tool |
| clippy | _none_ | rust lint tool |
| git |  _none_ | source code version control system |
| grep |  _none_ | must support _-E_ |
| jsdoc | _none_ | javascript source code documentation generator |
| jshint| _none_ | relatively unopinionated javascript linter |
| make | gmake | GNU make|
| pipenv | _none_ | python environment wrapper |
| python3 | _none_ | python 3.9 |
| rustc |  _none_ | rust compiler |
| sed  | gsed  | GNU sed |
| sort | gsort | GNU sort |
| wasm-pack | _none_ | rust webassembly build tool |

> The build system recognize both the tool and alternate names.

> Note that only make and docker are needed if you use the docker container described in the next section.

The aliases are for systems like Mac OS that use ancient versions of
standard tools. It allows _make_ to recognize the more modern versions
that were installed with tools like _macports_.

Once that is done here are the steps to set it up.

1. Get the project.
   1. `git clone https://github.com/jlinoff/myvault`
   2. `cd myvault`
2. Build and test it locally. This is required to build the Rust components, the version data and to generate the documentation.
   1. `make` (try `make help` for info about all available targets).
3. Run a server
   1. `make server`
4. Navigate to http://localhost:8000 in your favorite browser.

If you want a port other than 8000 (say 9000), run `make server PORT=9000`.

## How to develop using the myvault-dev docker container
_myVault_ can define a docker container that you can use for local
development. It allows you to build, test and serve the system without
installing any software other than docker and gnu make.

You must have a small number of dev tools installed for this
approach. They are shown in the table below.

| Tool | Aliases | Note |
| ---- | ----- | ---- |
| docker | _none_ | system for managing containerized apps  |
| git |  _none_ | source code version control system |
| make | gmake | GNU make|

The steps for setting up and using the container are:

1. Get the project.
   1. `git clone https://github.com/jlinoff/myvault`
   2. `cd myvault`
2. Create the container, build the project and log in.
   1. `make dev`
3. Once logged into the container  you can run any of the `make` or `git` commands as well as tools like `aspell`. A typical command sequence might look something like this.
    1. `git checkout -b new-branch`
    2. `make`
    3. `git status`
    4. `make server`

> Note if you want to re-install the pipenv environment in the
> container (perhaps after a `make clean`) you must run
> `pipenv install -d --python=python3.9` to ensure that the
> correct version of python is found.

On the host you can watch the build status by:

1. Running `docker ps` to get the container id.
2. Then running something like: `docker exec it 789173edc736 htop`. Where `789173edc736` is the container id.

To run the web server from the container run `make server` in the container
and then browse to http://localhost:8007 on the host.

## How to test github actions locally
I used https://github.com/nektos/act to test `.github/workflows/build.yaml` locally. It is a great
tool and strongly recommend it. 

> Note that you must have `golang` installed.

Here is how you install it.

```bash
GOBIN="/home/jlinoff/bin" go install github.com/nektos/act@master
```

Once it is installed, simply run the `act` command in the _myVault_ project directory.

> Note that I had to comment out the `uppload webapp` step in `build.yaml` because
> upload is not yet supported.

## How to download the github workflow artifact
When the github actions are run a webapp workflow artifact is created. Here is how to download it.

1. List all artifacts.
   1. `curl -H 'Accept: application/vnd.github.v3+json' https://api.github.com/repos/jlinoff/myvault/actions/artifacts`
2. Choose the one that you want (for this example `75537995`).
3. Download it (required valid access credentials).
   1. `curl -u jlinoff -L https://api.github.com/repos/jlinoff/myvault/actions/artifacts/75537995/zip -o artifact.zip`


## How to release the webapp
_myVault_ is released by running "`make webapp`" after building and testing changed.
That target creates the "`webapp.tar`" archive which can be extracted to create a
`myvault` directory tree that can be installed on a web server. This is how the
project is bundled for release to http:jlinoff.github.io/myvault. Here are the steps.

1. Get the project.
   1. `git clone https://github.com/jlinoff/myvault`
   2. `cd myvault`
2. Make changes.
    3. Build and test it locally. This is required to build the Rust components, the version data and to generate the documentation.
   1. `make` (try `make help` for info about all available targets).
4. Create the release archive.
   1. `make webapp`
5. Copy to the website and extract. There are many different ways to do this depending on how your website is setup.
   1. `scp webapp.tar your-website:/www/`
   2. `ssh your-website "cd /www/ && tar xf webapp.tar && rm -f webapp.tar"`

## How to change the master password
The master password must be changed after the records file has been
loaded but before it is saved. Here are the steps for a records
file named "`mystuff.txt`".

1. Go to the app in your browser: [https://jlinoff.github.io/myvault](https://jlinoff.github.io/myvault)
2. Navigate to the "`Preferences`" page from the menu.
3. Click on the "`Master Password`" accordion entry.
4. Enter the old password for "`mystuff.txt`".
5. Navigate to the "`Load`" page from the menu.
6. Click on the "`Read Local File`" accordion entry.
7. Click on the "`Select File`" button and choose "`mystuff.txt`".
8. Navigate to the "`Preferences`" page from the menu.
9. Click on the "`Master Password`" accordion entry.
10. Enter the new password for "`mystuff.txt`".
11. Navigate to the "`Save`" from the menu.
12. Click on the "`Download to File`" accordion entry.
13. Click the "`Download`" button. The _MyVault_ remembers the file name "`mystuff.txt'" so you don't have to re-enter it.

## How to import records from JSON
It is sometimes convenient to be able import many records at once. If, for example,
you want to transfer records between records files. This can be done using the
"`Raw Edit`" function on the "`Preferences`" page. This example shows how to create
a simple password record named "`Acme Utensils for Coyotes`". The JSON is shown below:

```json
{
  "__id__" : "Acme Utensils for Coyotes",
  "url": "https://roadrunner.io",
  "username": "wilec",
  "password": "roadrunnersaredelicious"
}
```

This JSON defines a record that follows the built-in _PASS4_ records template.

Here are the steps required to add it the example:

1. Go to the app in your browser: [https://jlinoff.github.io/myvault](https://jlinoff.github.io/myvault)
2. Navigate to the "`Load`" page from the menu.
3. Click on the "`Internal Example`" accordion entry.
4. Click the "`Load Example`" button.
5. Navigate to the "`Preferences`" to page.
6. Select the "`Raw Edit`" button.
7. Scroll down to the "`Records`" entry in the JSON textarea box.

> Note that you can transfer records one records file to another by
> using "Raw Edit" to copy the record file from one file and paste it to
> the other file.
