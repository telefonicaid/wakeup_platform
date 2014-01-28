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

all: dev install

about:
	@echo "Telefonica R&D WakeUp platform, (c) 2014"
	@echo " use make dev to build development environment"
	@echo " use make all to build development environment and final builds"

dev: clean check_style build tests

version.info:
	@echo "Getting version information from GIT ..."
	@$(GIT) describe --all > src/version.info
	@echo " - Version = " `cat src/version.info`

clean: clean_local clean_tests
	@echo "Cleaning ..."
	@find . -name "*log" -exec rm -f {} \;

clean_local:
	@echo "Cleaning local server instance ..."
	@rm -f src/version.info
	@rm -rf src/node_modules
	@rm -rf src/shared_libs
	@rm -f src/routers/shared*
	@rm -rf output
	@find . -name "*log" -exec rm -f {} \;

clean_tests:
	@echo "Cleaning tests auxiliar files ..."
	@rm -rf tests/node_modules

build: version.info build_local
	@echo "Building ..."

build_local: version.info
	@echo "Building local server instance ..."
	@cp -rfl common/libs src/shared_libs
	@cd common/routers/; for r in `ls *js`; do ln -f $$r ../../src/routers/shared_$$r; done;
	@echo " - Updating dependencies (please, wait ...)"
	@cd src; $(NPM) install > /dev/null 2> /dev/null

install: build
	@echo "Putting local server into output directory ..."
	@mkdir -p output
	@cp -rfl src/* output/
	@find output -name README.md -exec rm {} \;
	@echo  "node start.js $1" > output/run_local.sh
	@chmod +x output/run_local.sh

check_style:
	@echo "Checking code style rules ..."
	@$(GJSLINT) --disable 210,217,220,225 -r src -e node_modules
	@$(GJSLINT) --disable 210,217,220,225 -r tests -e node_modules -x pre_tests.js,post_tests.js

fix_style:
	@echo "Fixing code style rules ..."
	@$(FIXJSSTYLE) --disable 210,217,220,225 -r src -e node_modules
	@$(FIXJSSTYLE) --disable 210,217,220,225 -r tests -e node_modules

tests: build tests_local
	@echo "Executing tests ..."

tests_local:
	@echo "Preparing tests environment (please wait ...)"
	@cd tests; $(NPM) install > /dev/null 2> /dev/null
	@echo "Launching local server ..."
	@cd src; node start.js > /dev/null & echo "$$!" > ../local.pid
	@echo "Executing unit tests ..."
	@cd tests; $(NPM) run-script test
	@echo "Killing local server ..."
	@kill -9 `cat local.pid`; rm local.pid

cyclomatic_complexity: tests
	@echo "Calculating cyclomatic complexity"
	@tests/node_modules/.bin/cr src/
