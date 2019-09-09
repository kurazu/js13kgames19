TS_SOURCES = src/body.ts src/box.ts src/collision.ts src/constants.ts src/keyboard.ts src/player_ship.ts src/renderer.ts src/utils.ts src/vector.ts src/world.ts src/level_generator.ts
JS_SOURCES = build/*.js
COMPILER = java -jar ~/Downloads/compiler-latest/closure-compiler-v20190819.jar
COMPILER_FLAGS_DEV = -O BUNDLE
COMPILER_FLAGS_PROD = -O ADVANCED
COMPILER_FLAGS = --dependency_mode STRICT --language_in ECMASCRIPT_2019 --language_out ECMASCRIPT_2019 --module_resolution=NODE --warning_level=VERBOSE --js='build/**/*.js' --js='build/*.js'
NODE_PATH=/home/kurazu/apps/node-v12.9.1-linux-x64/bin

all: styles dev

styles:
	${NODE_PATH}/npx lessc styles.less build/styles.css

compile:
	$(NODE_PATH)/npx ttsc

dev: compile
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_DEV) --entry_point build/scripts.js --js_output_file=dist/bundle.js
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_DEV) --entry_point build/worker.js --js_output_file=dist/worker.js

min: compile
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_PROD) --entry_point build/scripts.js --js_output_file=dist/bundle.min.js
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_PROD) --entry_point build/worker.js --js_output_file=dist/worker.min.js
	ls -lh dist/*.js

run: compile
	$(NODE_PATH)/node --experimental-modules build/sim.js

debug: compile
	$(NODE_PATH)/node --inspect-brk --experimental-modules build/sim.js

query: compile
	$(NODE_PATH)/node --experimental-modules build/query.js

perf: compile
	$(NODE_PATH)/node --experimental-modules build/perf.js

install:
	$(NODE_PATH)/npm install .

# test: compile
# 	$(NODE_PATH)/node --experimental-modules build/test.js

clean:
	rm -vf build/**/*.js build/*.js build/*.css
	rm -vf game.zip

zip: min
	zip -r game.zip index.html dist/bundle.min.js dist/worker.min.js img/*.png
	ls -lh game.zip

serve:
	python2.7 -m SimpleHTTPServer

test:
	${NODE_PATH}/npx jest
