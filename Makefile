TS_SOURCES = src/body.ts src/box.ts src/collision.ts src/constants.ts src/keyboard.ts src/player_ship.ts src/renderer.ts src/utils.ts src/vector.ts src/world.ts src/level_generator.ts
JS_SOURCES = build/*.js
COMPILER = java -jar ~/Downloads/compiler-latest/closure-compiler-v20190819.jar
COMPILER_FLAGS_DEV = -O BUNDLE --js_output_file=dist/bundle.js
COMPILER_FLAGS_PROD = -O ADVANCED --js_output_file=dist/bundle.min.js
COMPILER_FLAGS = --dependency_mode STRICT --language_in ECMASCRIPT_2019 --language_out ECMASCRIPT_2019 --module_resolution=NODE --warning_level=VERBOSE --entry_point build/scripts.js --js='build/*.js'

all: dev

compile:
	npm run tsc

dev: compile
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_DEV)

min: compile
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_PROD)
	ls -lh dist/*.js

clean:
	rm build/*.js
