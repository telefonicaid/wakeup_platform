#######################################################
# Wake Up Platform                                    #
# (c) Telefonica Digital, 2013 - All rights reserved  #
# License: GNU Affero V3 (see LICENSE file)           #
# Fernando Rodríguez Sela <frsela@tid.es>             #
#######################################################

GIT  ?= git
NODE ?= node
NPM ?= npm
GJSLINT ?= gjslint
FIXJSSTYLE ?= fixjsstyle

.PHONY = about dev all version.info
.PHONY = clean clean_local
.PHONY = build build_local
.PHONY = install tests

about:
	@echo "Telefonica R&D WakeUp platform, (c) 2013"
	@echo " use make dev to build development environment"
	@echo " use make all to build development environment and final builds"

dev: clean check_style build tests
all: dev install

version.info:
	@echo "Getting version information from GIT ..."
	@$(GIT) describe --all > src/version.info
	@echo " - Version = " `cat src/version.info`

clean: clean_local clean_tests
	@echo "Cleaning (global) ..."
	@rm -f src/version.info
	@rm -rf output

clean_local:
	@echo "Cleaning local server instance ..."
	@rm -rf src/local/node_modules
	@rm -rf src/local/shared_libs

clean_tests:
	@echo "Cleaning tests auxiliar files ..."
	@rm -rf tests/node_modules

build: version.info build_local
	@echo "Building (global) ..."

build_local:
	@echo "Building local server instance ..."
	@cp -rfl src/libs src/local/shared_libs
	@echo " - Updating dependencies (please, wait ...)"
	@cd src/local; $(NPM) install > /dev/null 2> /dev/null

install: build
	@echo "Putting local server into output directory ..."
	@mkdir -p output/local
	@cp -rfl src/local output/
	@find output -name README.md -exec rm {} \;

check_style:
	@echo "Checking code style rules ..."
	@$(GJSLINT) --disable 210,217,220,225 -r src -e node_modules
	@$(GJSLINT) --disable 210,217,220,225 -r tests -e node_modules

fix_style:
	@echo "Fixing code style rules ..."
	@$(FIXJSSTYLE) --disable 210,217,220,225 -r src -e node_modules
	@$(FIXJSSTYLE) --disable 210,217,220,225 -r tests -e node_modules

tests: build tests_pre tests_unit

tests_pre:
	@echo "Preparing tests environment (please wait ...)"
	@cd tests; $(NPM) install > /dev/null 2> /dev/null

tests_unit: tests_pre
	@echo "Launching local server ..."
	@cd src/local; node start.js > /dev/null & echo "$$!" > ../../local.pid
	@echo "Executing unit tests ..."
	@cd tests; $(NPM) test
	@echo "Killing local server ..."
	@kill -9 `cat local.pid`; rm local.pid

cyclomatic_complexity: tests_pre
	@echo "Calculating cyclomatic complexity"
	@tests/node_modules/.bin/cr src/
