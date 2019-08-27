bundle.js: vector.js box.js collision.js scripts.js keyboard.js world.js body.js player_ship.js constants.js
	java -jar ~/Downloads/compiler-latest/closure-compiler-v20190819.jar  -O BUNDLE --js_output_file=bundle.js vector.js box.js collision.js keyboard.js world.js body.js player_ship.js constants.js scripts.js

main.js: vector.js box.js sim.js collision.js sim.js world.js body.js constants.js
	java -jar ~/Downloads/compiler-latest/closure-compiler-v20190819.jar  -O BUNDLE --js_output_file=main.js vector.js box.js collision.js world.js body.js constants.js sim.js

run: main.js
	node main.js
