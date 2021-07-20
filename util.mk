# Shared make utilities.
# Handle systems like Mac that have really out of date versions of
# standeard tools and have GNU tools installed on top.
GDATE ?= $(shell gdate --version 2>/dev/null 1>/dev/null && which gdate || which date)
SED ?= $(shell gsed --version 2>/dev/null 1>/dev/null    && which gsed || which sed)
SORT ?= $(shell gsort --version 2>/dev/null 1>/dev/null  && which gsort || which sort)
TAR ?= $(shell gnutar --version 2>/dev/null 1>/dev/null  && which gnutar || which tar)
EGREP ?= $(shell which grep) -E
COLUMN ?= $(shell which column)

# Macros
define hdr
        @printf '\x1b[35;1m'
        @printf '\n'
        @printf '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n'
        @printf '=-=-= Date: %s %s\n' "$(shell date)"
        @printf '=-=-= Target: %s %s\n' "$1"
        @printf '=-=-= Directory: %s %s\n' "$$(pwd)"
        @printf '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n'
        @printf '\x1b[0m'
endef
