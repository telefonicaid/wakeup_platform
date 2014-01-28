all:
	@echo "Building all dependencies"
	@for a in $$(ls); do \
		if [ -d $$a ]; then \
			echo "processing folder $$a"; \
			$(MAKE) -C $$a; \
		fi; \
	done;
	@echo "Done!"

clean:
	@echo "Cleaning all dependencies"
	@for a in $$(ls); do \
		if [ -d $$a ]; then \
			echo "processing folder $$a"; \
			$(MAKE) -C $$a clean; \
		fi; \
	done;
	@echo "Done!"
