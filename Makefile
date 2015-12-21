# Makefile rules for ermrestjs package

# Disable built-in rules
.SUFFIXES:

# Project name
PROJ=ermrest

# Node module dependencies
MODULES=node_modules

# Node bin scripts
BIN=$(MODULES)/.bin

# Bower front end components
BOWER=bower_components

# JavaScript source and test specs
JS=js
SOURCE=$(JS)/ermrest.js
SPECS=$(JS)/main_spec.js

# Distribution target
DIST=dist

# Project package full/minified
PKG=$(DIST)/$(PROJ).js
MIN=$(DIST)/$(PROJ).min.js

# Documentation target
DOC=doc
API=$(DOC)/api.md
JSDOC=jsdoc

# Hidden target files (for make only)
LINT=.make-lint
TEST=.make-test.js

.PHONY: all
all: build test $(DOC)

.PHONY: build
build: $(PKG) $(MIN)

# Rule to build the full library
$(PKG): $(SOURCE) $(LINT) $(BIN)
	mkdir -p $(DIST)
	cat $(SOURCE) > $(PKG)

# Rule to build the minified package
$(MIN): $(SOURCE) $(LINT) $(BIN)
	mkdir -p $(DIST)
	$(BIN)/ccjs $(SOURCE) > $(MIN)

# Rule to lint the source (only changed source is linted)
$(LINT): $(SOURCE) $(BIN)
	$(BIN)/jshint $(filter $(SOURCE), $?)
	@touch $(LINT)

.PHONY: lint
lint: $(LINT)

# Rule for making markdown docs
$(DOC): $(API)

# Rule for making API doc
$(API): $(SOURCE) $(BIN)
	mkdir -p $(DOC)
	$(BIN)/jsdoc2md $(SOURCE) > $(API)

# jsdoc: target for html docs produced (using 'jsdoc')
$(JSDOC): $(SOURCE) $(BIN)
	mkdir -p $(JSDOC)
	$(BIN)/jsdoc --pedantic -d $(JSDOC) $(SOURCE)
	@touch $(JSDOC)

# Rule to ensure Node bin scripts are present
$(BIN): $(MODULES)
	@touch $(BIN)

# Rule to install Node modules locally
$(MODULES): package.json
	npm install
	@touch $(MODULES)

# Rule to install Bower front end components locally
$(BOWER): $(BIN) bower.json
	$(BIN)/bower install
	@touch $(BOWER)

.PHONY: deps
deps: $(BIN) $(BOWER)

.PHONY: updeps
updeps:
	npm update
	$(BIN)/bower update

# Rule to clean project directory
.PHONY: clean
clean:
	rm -rf $(DIST)
	rm -rf $(JSDOC)
	rm -f .make-*

# Rule to clean the dependencies too
.PHONY: distclean
distclean: clean
	rm -rf $(MODULES)
	rm -rf $(BOWER)

.PHONY: test
test: $(TEST)

# Rule to run the unit tests
$(TEST): $(SOURCE) $(SPECS) $(BIN)
	cat $(SOURCE) $(SPECS) > $(TEST)
	$(BIN)/mocha $(TEST) || (rm -f $(TEST) &&  exit 1)

# Rule to run testem
.PHONY: testem
testem:
	$(BIN)/testem

# Rules for help/usage
.PHONY: help usage
help: usage
usage:
	@echo "Available 'make' targets:"
	@echo "    all       - an alias for build"
	@echo "    deps      - local install of node and bower dependencies"
	@echo "    updeps    - update local dependencies"
	@echo "    lint      - lint the source"
	@echo "    build     - builds the package"
	@echo "    test      - runs commandline tests"
	@echo "    testem    - starts the testem service"
	@echo "    doc       - make autogenerated markdown docs"
	@echo "    jsdoc     - make autogenerated html docs"
	@echo "    clean     - cleans the dist dir"
	@echo "    distclean - cleans the dist dir and the dependencies"

