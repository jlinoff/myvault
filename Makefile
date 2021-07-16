# myVault Makefile
# type "make help" to get information about the targets.
SHELL := bash

# Trigger version and timestamp generation if any of the none
# generated source files change.
VERSION_SRCS := www/index.html $(shell ls www/js/*js | grep -v version)

include util.mk

.PHONY: all
all:  lint build test  ## build and test the package (default)

# Build the Rust encryption module as WASM and the version info.
.PHONY: build b
b \
build: www/js/crypt.js www/js/crypt_bg.wasm Pipfile.lock version src-docs jsdoc  ## build the project (alias b)

www/js/crypt.js: crypt/crypt/pkg/rel/crypt.js
	$(call hdr,"copying rust generated file: $@")
	cd crypt && $(MAKE)
	cp $< $@

www/js/crypt_bg.wasm: crypt/crypt/pkg/rel/crypt_bg.wasm
	$(call hdr,"copying rust generated file: $@")
	cd crypt && $(MAKE)
	cp $< $@

crypt/crypt/pkg/rel/crypt_bg.wasm \
crypt/crypt/pkg/rel/crypt.js:
	$(call hdr,"building rust: $@")
	cd crypt && $(MAKE)

# lint
# js and python
,PHONY: lint
lint: lint-py lint-js  ## lint source code

.PHONY: lint-py
lint-py:  Pipfile.lock  ## lint python source code
	$(call hdr,"$@")
	pipenv run pylint tests/test_ui.py

Pipfile.lock: Pipfile
	$(call hdr,"install pipenv")
	pipenv update

.PHONY: lint-js
# ignore crypt.js it is generated automatically
# jshint:
#   $ sudo npm update -g
#   $ sudo npm install -g jshint
lint-js:  ## lint javascript source code using jshint
	$(call hdr,"$@")
	jshint --version
	jshint --config jshint.json $$(ls -1 www/js/*js | grep -v crypt.js)
	jshint --config jshint.json www/xtra/cryptor.js

# help
.PHONY: src-docs
src-docs: www/help/index.html  ## generate the on-line help documentation for the source code using pandoc.

# jsdoc:
#   $ sudo npm update -g
#   $ sudo npm install -g jsdoc
.PHONY: jsdoc
jsdoc:  www/xtra/doc/index.html  ## generate the internal source code documentation using jsdoc

www/xtra/doc/index.html: README.md $(VERSION_SRCS)
	$(call hdr,"jsdoc")
	rm -rf www/doc
	jsdoc --version
	jsdoc -c jsdoc.conf -d www/xtra/doc -R README.md www/js/
	$(SED) -i 's/JSDoc: Home/JSDoc: myVault/g' www/xtra/doc/index.html

# Create the HTML based README
www/help/index.html: README.md VERSION www/help/index.css
	$(call hdr,"generating help")
	cp README.md tmp.md
	$(SED) -i "s/__VERSION__/$$(cat VERSION | tr -d ' \n')/g" tmp.md
	$(SED) -i "s/__BUILD__/$$(gdate -Iseconds | tr -d ' \n')/g" tmp.md
	$(SED) -i "s/__GIT_COMMIT_ID__/$$(git rev-parse --short HEAD | tr -d ' \n')/g" tmp.md
	$(SED) -i "s/__GIT_BRANCH__/$$(git rev-parse --abbrev-ref HEAD | tr -d ' \n')/g" tmp.md
	grep -v '^# myVault' tmp.md > tmp1.md
	grep -v '\[\!\[Releases\](' tmp1.md > tmp.md
	pandoc -s --css index.css -s --metadata title='Help: myVault' --html-q-tags -o $@ tmp.md
	rm -f tmp*.md

# version
# Generate the dynamic build/version information
.PHONY: version
version: www/js/version.js ## generate the www/js/version.js data from VERSION and other sources

www/js/version.js: VERSION $(VERSION_SRCS) README.md
	$(call hdr,"$@")
	@sleep 1
	echo '/**' > $@
	echo " * The dynmamic version that is  automatically generated by the build process." >> $@
	echo ' * @module version' >> $@
	echo ' */' >> $@
	echo "export var VERSION = '$$(cat VERSION | tr -d ' \n')'" >> $@
	echo "export var BUILD = '$$(gdate -Iseconds | tr -d ' \n')'" >> $@
	echo "export var GIT_COMMIT_ID = '$$(git rev-parse --short HEAD | tr -d ' \n')'" >> $@
	echo "export var GIT_BRANCH = '$$(git rev-parse --abbrev-ref HEAD | tr -d ' \n')'" >> $@
	cat -n $@

# spell check README
.PHONY: spell-check
spell-check:  ## Spell check the README.md file using aspell.
	$(call hdr,"$@")
	aspell check README.md

# clean -don't touch the local keep directory
.PHONY: clean
clean:  ## clean up
	$(call hdr,"$@")
	find . -type f -name '*~' -delete
	rm -f *.tar
	-git clean -xdf -e keep .

# Backup - the (git) source - redundant once in github
.PHONY: backup bu
bu \
backup: myvault-git.tar  ## backup the source code (alias bu) - redundant once in github

BGFILE ?= myvault-git.tar
$(BGFILE): .git/index
	$(call hdr,"backup git to $@")
	rm -f $@
	$(TAR) -Jcf $@ .git .gitignore
	ls -lh $@

# Create the web application
.PHONY: webapp
w \
webapp:   ## create the web release tar file for upload to a site (myvault/).
	$(call hdr,"$@")
	$(SED) -i 's@/js/@/myvault/js/@g' www/index.html $$(ls -1 www/js/*js) www/xtra/cryptor.html
	$(SED) -i 's@/icons/@/myvault/icons/@g' www/index.html $$(ls -1 www/js/*js)
	$(SED) -i 's@/help/@/myvault/help/@g' www/js/about.js
	$(SED) -i 's@/xtra/@/myvault/xtra/@g' www/help/index.html www/js/about.js
	$(TAR) -J -c -f webapp.tar --transform 's/^www/myvault/' www
	$(SED) -i 's@/myvault/js/@/js/@g'  www/index.html $$(ls -1 www/js/*js) www/xtra/cryptor.html
	$(SED) -i 's@/myvault/icons/@/icons/@g' www/index.html $$(ls -1 www/js/*js)
	$(SED) -i 's@/myvault/help/@/help/@g' www/js/about.js
	$(SED) -i 's@/myvault/xtra/@/xtra/@g' www/help/index.html www/js/about.js
	ls -lh webapp.tar


# Run a local server for testing on port 8000 (PORT=8000)
# using either a rust server or a python server.
HTTP_SERVER ?= python
PORT ?= 8000
.PHONY: server
server: ## Run a simple local server for debugging. To change the port: make server PORT=8000.
	$(call hdr,"$@")
ifeq ($(strip $(HTTP_SERVER)),rust)
	-cargo install simple-http-server
	cd www && simple-http-server -p $(PORT)
else
	python3 --version
	cd www && python3 -m http.server $(PORT)
endif

.PHONY: test
test: Pipfile.lock ## run the local unit tests in headless mode
	$(call hdr,"$@")
	PORT=8007 pipenv run python -m pytest tests/test_ui.py --options="headless, incognito, no-sandbox, --disable-gpu"

.PHONY: testi ti
ti \
testi: Pipfile.lock  ## run the local unit tests in interactive mode
	$(call hdr,"$@")
	PORT=8007 pipenv run python -m pytest tests/test_ui.py

# Help.
.PHONY: help
help:  ## This help message.
	@echo "Targets"
	@$(EGREP) '^[ ]*[^:]*[ ]*:.*##' $(MAKEFILE_LIST) 2>/dev/null | \
		$(EGREP) -v '^ *#' | \
	        $(EGREP) -v "EGREP|SORT|SED" | \
		$(SED) -e 's/: .*##/##/' -e 's/^[^:#]*://' | \
		$(COLUMN) -t -s '##' | \
		$(SORT) -f | \
		$(SED) -e 's@^@   @'
	@echo "Variables"
	@echo "   EGREP         : $(EGREP)"
	@echo "   COLUMN        : $(COLUMN)"
	@echo "   SED           : $(SED)"
	@echo "   SORT          : $(SORT)"
	@echo "   TAR           : $(TAR)"
	@echo "   MAKEFILE_LIST : $(MAKEFILE_LIST)"
	@echo "   PORT          : $(PORT) - server port"
	@echo "   HTTP_SERVER   : $(HTTP_SERVER) - the server to use: rust or python"
	@echo "   SHELL         : $(SHELL)"
	@echo "   VERSION_SRCS  : $(VERSION_SRCS)"
