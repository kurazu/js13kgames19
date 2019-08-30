TS_SOURCES = src/body.ts src/box.ts src/collision.ts src/constants.ts src/keyboard.ts src/player_ship.ts src/renderer.ts src/utils.ts src/vector.ts src/world.ts src/level_generator.ts
JS_SOURCES =
COMPILER = java -jar ~/Downloads/compiler-latest/closure-compiler-v20190819.jar
COMPILER_FLAGS_DEV = -O BUNDLE --js_output_file=dist/bundle.js
COMPILER_FLAGS_PROD = -O SIMPLE --js_output_file=dist/bundle.min.js
COMPILER_FLAGS = --dependency_mode STRICT --entry_point build/scripts --language_out ECMASCRIPT_2019 --js_module_root build

all: dist/bundle.js #dist/bundle.min.js

compile:
	npm run tsc

dist/bundle.js: compile
	 $(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_DEV) build/*.js

# dist/bundle.min.js: compile
# 	 $(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_PROD) build/*.js

clean:
	rm build/*.js
