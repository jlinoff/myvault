# When make completes successfully the generated files will be in
# crypt/pkg/dbg and crypt/pkg/rel.
# The files of interest are:
#   crypt/{pkg,rel}/crypt.js   - javascript interface to the encrypt and decrypt functions.
#   crypt/{pkg,rel}/crypt_bg.wasm - The Web Assembly code.
# Those two files should be copied to www/js/crypt where they can be loaded by the app as follows:
#    import init, { add } from './js/crypt.js';
#    async function loadWasm() {
#        await init();
#   }
#   loadWasm()
# https://github.com/rustwasm/wasm-bindgen/blob/master/examples/without-a-bundler/index.html

PROJECT := crypt
SHELL := bash

include ../util.mk

SRC_RS_FILES     := $(wildcard src/*.rs)
PROJECT_RS_FILES := $(patsubst %,$(PROJECT)/%,$(SRC_RS_FILES))

##### build
.PHONY: build
build: dbg rel  ## Build everything.

##### clean
.PHONY: clean
clean:  ## Clean up.
	$(call hdr,"$@")
	find . -type f -name '*~' -delete
	cd $(PROJECT) && rm -rf pkg target Cargo.lock

#### Debug build.
PHONY: dbg
dbg: .test-dbg  ## Debug build.

$(PROJECT)/pkg/dbg/$(PROJECT).js: $(PROJECT)/Cargo.toml $(PROJECT_RS_FILES)
	$(call hdr,"dbg")
	wasm-pack --version
	cd $(PROJECT) && time wasm-pack build --target web --debug -d pkg/dbg

.test-dbg: $(PROJECT)/pkg/dbg/$(PROJECT).js
	$(call hdr,"test-dbg")
	wasm-pack --version
	cd $(PROJECT) && time wasm-pack test --node
	@touch $@

#### Release build.
PHONY: rel
rel: .test-rel  ## Release build.

$(PROJECT)/pkg/rel/$(PROJECT).js: $(PROJECT)/Cargo.toml $(PROJECT_RS_FILES)
	$(call hdr,"rel")
	wasm-pack --version
	cd $(PROJECT) && time wasm-pack build --target web --release -d pkg/rel

.test-rel: $(PROJECT)/pkg/rel/$(PROJECT).js
	wasm-pack --version
	cd $(PROJECT) && time wasm-pack test --node --release
	@touch $@

##### Common
$(PROJECT)/Cargo.toml: src/Cargo.toml | $(PROJECT)
	$(call hdr,"$@")
	$(SED) -e 's/__PROJECT__/$(PROJECT)/g' $< >$@

$(PROJECT)/src/%.rs: ./src/%.rs | $(PROJECT)/src
	$(call hdr,"$@")
	$(SED) -e 's/__PROJECT__/$(PROJECT)/g' $< >$@

$(PROJECT): ; mkdir -p $@
$(PROJECT)/src: ; mkdir -p $@

##### help
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
	@echo "   EGREP            : $(EGREP)"
	@echo "   COLUMN           : $(COLUMN)"
	@echo "   SED              : $(SED)"
	@echo "   SORT             : $(SORT)"
	@echo "   TAR              : $(TAR)"
	@echo "   MAKEFILE_LIST    : $(MAKEFILE_LIST)"
	@echo "   PROJECT_RS_FILES : $(PROJECT_RS_FILES)"
	@echo "   SRC_RS_FILES     : $(SRC_RS_FILES)"
