COMPILER = java -jar ~/Downloads/compiler-latest/closure-compiler-v20190819.jar
COMPILER_FLAGS_DEV = -O BUNDLE
COMPILER_FLAGS_PROD = -O ADVANCED
COMPILER_FLAGS = --dependency_mode STRICT --language_in ECMASCRIPT_2019 --language_out ECMASCRIPT_2019 --module_resolution=NODE --warning_level=VERBOSE --js='build/**/*.js' --js='build/*.js'
NODE_PATH=/home/kurazu/apps/node-v12.9.1-linux-x64/bin

all: styles dev

styles:
	$(NODE_PATH)/npx lessc styles.less build/styles.css

images:
	cp img/tiles.png dist/t.png

min-styles: styles
	$(NODE_PATH)/node --experimental-modules min-css.js

min-html:
	cat index.html | sed -e 's/type="module"//g' -e 's/build\/main\.js/b\.js/g' -e 's/build\/styles\.css/s\.css/g' > build/index.html
	$(NODE_PATH)/node --experimental-modules min-html.js

compile:
	$(NODE_PATH)/npx ttsc

dev: compile
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_DEV) --entry_point build/main.js --js_output_file=dist/bundle.js
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_DEV) --entry_point build/worker.js --js_output_file=dist/worker.js

min: compile min-styles min-html images
	sed -e 's/dist\/worker\.js/w\.js/g' -i build/worker_communication.js
	sed -e 's/img\/tiles\.png/t\.png/g' -i build/game/toolbox.js
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_PROD) --entry_point build/main.js --js_output_file=dist/b.js
	$(COMPILER) $(COMPILER_FLAGS) $(COMPILER_FLAGS_PROD) --entry_point build/worker.js --js_output_file=dist/w.js
	ls -lh dist/*

sup: compile
	$(NODE_PATH)/node --experimental-modules build/sup.js

ten: compile
	$(NODE_PATH)/node --experimental-modules build/ten.js

chain: compile
	$(NODE_PATH)/node --experimental-modules build/chain.js

debug: compile
	$(NODE_PATH)/node --experimental-modules build/sim.js

query: compile
	$(NODE_PATH)/node --experimental-modules build/query.js

perf: compile
	$(NODE_PATH)/node --experimental-modules build/perf.js

install:
	$(NODE_PATH)/npm install .

# test: compile
# 	$(NODE_PATH)/node --experimental-modules build/test.js

clean:
	rm -vf build/**/*.js build/*.js build/*.css dist/*
	rm -vf game.zip

zip: min
	cd dist && advzip -4 -i 20 -a game.zip index.html b.js w.js t.png s.css && ls -lh game.zip && ls -l game.zip

serve:
	cd python2.7 -m SimpleHTTPServer

test:
	${NODE_PATH}/npx jest
