SOURCES =  body.js box.js collision.js constants.js keyboard.js player_ship.js renderer.js vector.js world.js
COMPILER = java -jar ~/Downloads/compiler-latest/closure-compiler-v20190819.jar
COMPILER_FLAGS = -O BUNDLE --dependency_mode SORT_ONLY
bundle.js: $(SOURCES) scripts.js
	 $(COMPILER) $(COMPILER_FLAGS) --js_output_file=bundle.js $(SOURCES) scripts.js

main.js: $(SOURCES) sim.js
	$(COMPILER) -O BUNDLE --js_output_file=main.js $(SOURCES) sim.js

run: main.js
	node main.js

clean:
	rm bundle.js
