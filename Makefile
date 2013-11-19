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

clean: clean_local clean_global clean_tests
	@echo "Cleaning (global) ..."
	@rm -f src/version.info
	@rm -rf output
	@find . -name "*log" -exec rm -f {} \;

clean_local:
	@echo "Cleaning local server instance ..."
	@rm -rf src/local/node_modules
	@rm -rf src/local/shared_libs
	@rm -f src/local/routers/shared*
	@rm -f src/local/version.info

clean_global:
	@echo "Cleaning global server instance ..."
	@rm -rf src/global/node_modules
	@rm -rf src/global/shared_libs
	@rm -f src/global/routers/shared*
	@rm -f src/global/version.info

clean_tests:
	@echo "Cleaning tests auxiliar files ..."
	@rm -rf tests/node_modules

build: version.info build_local build_global
	@echo "Building (global) ..."

build_local: version.info
	@echo "Building local server instance ..."
	@cp -rfl src/common/libs src/local/shared_libs
	@cd src/common/routers/; for r in `ls *js`; do ln -f $$r ../../local/routers/shared_$$r; done;
	@echo " - Updating dependencies (please, wait ...)"
	@cd src/local; $(NPM) install > /dev/null 2> /dev/null
	@ln -f src/version.info src/local/version.info

build_global: version.info
	@echo "Building global server instance ..."
	@cp -rfl src/common/libs src/global/shared_libs
	@cd src/common/routers/; for r in `ls *js`; do ln -f $$r ../../global/routers/shared_$$r; done;
	@echo " - Updating dependencies (please, wait ...)"
	@cd src/global; $(NPM) install > /dev/null 2> /dev/null
	@ln -f src/version.info src/global/version.info

install: build
	@echo "Putting local server into output directory ..."
	@mkdir -p output/local
	@cp -rfl src/local output/
	@mkdir -p output/global
	@cp -rfl src/global output/
	@find output -name README.md -exec rm {} \;
	@cp -rfl src/run_* output/

check_style:
	@echo "Checking code style rules ..."
	@$(GJSLINT) --disable 210,217,220,225 -r src -e node_modules
	@$(GJSLINT) --disable 210,217,220,225 -r tests -e node_modules -x pre_tests.js,post_tests.js

fix_style:
	@echo "Fixing code style rules ..."
	@$(FIXJSSTYLE) --disable 210,217,220,225 -r src -e node_modules
	@$(FIXJSSTYLE) --disable 210,217,220,225 -r tests -e node_modules

tests: build tests_pre tests_local tests_global
	@echo "Executing common unit tests ..."
	@cd tests; $(NPM) run-script test_libs

tests_pre:
	@echo "Preparing tests environment (please wait ...)"
	@cd tests; $(NPM) install > /dev/null 2> /dev/null

tests_local: tests_pre
	@echo "Launching local server ..."
	@cd src/local; node start.js > /dev/null & echo "$$!" > ../../local.pid
	@echo "Executing unit tests ..."
	@cd tests; $(NPM) run-script test_local
	@echo "Killing local server ..."
	@kill -9 `cat local.pid`; rm local.pid

tests_global: tests_pre
	@echo "Launching global server ..."
	@cd src/global; node start.js > /dev/null & echo "$$!" > ../../global.pid
	@echo "Executing unit tests ..."
	@cd tests; $(NPM) run-script test_global
	@echo "Killing global server ..."
	@kill -9 `cat global.pid`; rm global.pid

cyclomatic_complexity: tests_pre
	@echo "Calculating cyclomatic complexity"
	@tests/node_modules/.bin/cr src/
