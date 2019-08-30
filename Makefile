TS_SOURCES = src/body.ts src/box.ts src/collision.ts src/constants.ts src/keyboard.ts src/player_ship.ts src/renderer.ts src/utils.ts src/vector.ts src/world.ts src/level_generator.ts
JS_SOURCES =
COMPILER = java -jar ~/Downloads/compiler-latest/closure-compiler-v20190819.jar
COMPILER_FLAGS = -O BUNDLE --dependency_mode SORT_ONLY --language_out ECMASCRIPT_2019

all: build/bundle.js

build: src/*.ts
	npm run tsc

build/bundle.js: build
	 $(COMPILER) $(COMPILER_FLAGS) --js_output_file=build/bundle.js build/*.js

clean:
	rm build/*.js

compile:
	npm run tsc
