# Makefile rules for ermrestjs package

# Disable built-in rules
.SUFFIXES:

# Install target
ERMRESTJSDIR?=/var/www/html/ermrestjs

# Project name
PROJ=ermrest

# Node module dependencies
MODULES=node_modules

# Node bin scripts
BIN=$(MODULES)/.bin

# JavaScript source and test specs
JS=js

# Project source files
HEADER=$(JS)/header.js
FOOTER=$(JS)/footer.js
HEADER_FOOTER= $(HEADER) \
			   $(FOOTER)
			   
SOURCE=$(HEADER) \
	   $(JS)/core.js \
	   $(JS)/datapath.js \
	   $(JS)/filters.js \
	   $(JS)/utilities.js \
	   $(JS)/errors.js \
	   $(JS)/parser.js \
	   $(JS)/http.js \
	   $(JS)/reference.js \
	   $(JS)/ag_reference.js \
	   $(FOOTER) \
	   $(JS)/hatrac.js \
	   $(JS)/node.js \
	   $(JS)/ng.js \

# Vendor libs
VENDOR=vendor

# Build target
BUILD=build

# Project package full/minified
PKG=$(PROJ).js
MIN=$(PROJ).min.js
VER=$(PROJ).ver.txt

# Documentation target
DOC=doc
API=$(DOC)/api.md
JSDOC=jsdoc

# Hidden target files (for make only)
LINT=.make-lint
TEST=.make-test.js

.PHONY: all
all: $(BUILD) $(DOC)

# Build rule
$(BUILD): $(LINT) $(BUILD)/$(PKG) $(BUILD)/$(MIN) $(BUILD)/$(VER)
	@touch $(BUILD)

# Rule to build the library (non-minified)
.PHONY: package
package: $(BUILD)/$(PKG) $(BUILD)/$(VER)

# Rule to build the version number file
$(BUILD)/$(VER): $(SOURCE)
	mkdir -p $(BUILD)
	git log --pretty=format:'%H' -n 1 > $(BUILD)/$(VER)

# Rule to build the un-minified library and convert es6 code to es5
$(BUILD)/$(PKG): $(SOURCE)
	mkdir -p $(BUILD)
	cat $(SOURCE) > $(BUILD)/$(PKG)
	$(BIN)/babel $(BUILD)/$(PKG) --out-file $(BUILD)/$(PKG)

# Rule to build the minified package
$(BUILD)/$(MIN): $(SOURCE) $(BIN)
	mkdir -p $(BUILD)
	$(BIN)/ccjs $(BUILD)/$(PKG) --language_in=ECMASCRIPT6_STRICT > $(BUILD)/$(MIN)

# Rule to lint the source (terminate build on errors)
$(LINT): $(SOURCE) $(BIN)
	$(BIN)/jshint  $(filter $?, $(filter-out $(HEADER_FOOTER), $(SOURCE)))
	@touch $(LINT)

.PHONY: lint
lint: $(LINT)

# Rule for making markdown docs
$(DOC): $(API)

# Rule for making API doc
$(API): $(SOURCE) $(BIN)
	mkdir -p $(DOC)
	$(BIN)/jsdoc2md $(BUILD)/$(PKG) > $(API)

# jsdoc: target for html docs produced (using 'jsdoc')
$(JSDOC): $(SOURCE) $(BIN)
	mkdir -p $(JSDOC)
	$(BIN)/jsdoc --pedantic -d $(JSDOC) $(BUILD)/$(PKG)
	@touch $(JSDOC)

# Rule to ensure Node bin scripts are present
$(BIN): $(MODULES)
	@touch $(BIN)

# Rule to install Node modules locally
$(MODULES): package.json
	npm install
	@touch $(MODULES)

# Rule for node deps
.PHONY: deps
deps: $(BIN)

.PHONY: updeps
updeps:
	npm update

# Rule to clean project directory
.PHONY: clean
clean:
	rm -rf $(BUILD)
	rm -rf $(JSDOC)
	rm -f .make-*

# Rule to clean the dependencies too
.PHONY: distclean
distclean: clean
	rm -rf $(MODULES)

# Rule to run the unit tests
.PHONY: test
test: $(BUILD) ../ErmrestDataUtils
	node test/jasmine-runner.js

# Rule to install the package
.PHONY: install installm dont_install_in_root
install: $(BUILD)/$(PKG) $(BUILD)/$(VER) $(VENDOR)/* dont_install_in_root
	rsync -avz $(BUILD)/ $(ERMRESTJSDIR)
	rsync -avz $(VENDOR) $(ERMRESTJSDIR)

installm: install $(BUILD)/$(MIN) dont_install_in_root
	rsync -avz $(BUILD)/$(MIN) $(ERMRESTJSDIR)/$(MIN)

dont_install_in_root:
	@echo "$(ERMRESTJSDIR)" | egrep -vq "^/$$|.*:/$$"

# Rules for help/usage
.PHONY: help usage
help: usage
usage:
	@echo "Available 'make' targets:"
	@echo "    all       - build and docs"
	@echo "    deps      - local install of node and bower dependencies"
	@echo "    updeps    - update local dependencies"
	@echo "    install   - installs the package (ERMRESTJSDIR=$(ERMRESTJSDIR))"
	@echo "    installm  - also installs the minified package"
	@echo "    lint      - lint the source"
	@echo "    build     - lint, package and minify"
	@echo "    package   - concatenate into package"
	@echo "    test      - run tests"
	@echo "    doc       - make autogenerated markdown docs"
	@echo "    jsdoc     - make autogenerated html docs"
	@echo "    clean     - cleans the build environment"
	@echo "    distclean - cleans and removes dependencies"
