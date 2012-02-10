var
	fs    = require('fs'),
	fpmcs = require('./fpmc_simple'),
	
	train_file = 'train.json'
	
	lambda        = 0.5,
	learning_rate = 0.9,
	iterations    = 300
	;


function test() {
	train = JSON.parse(fs.readFileSync(train_file));
	validation_offset = train.length / 2 + Math.floor(Math.random() * (train.length / 2))
	validation_offset = 3000;
	for(i = 0; i < validation_offset; i++) {
		if(train[i][0] != 'i') continue;
		fpmcs.feedback(train[i][1], train[i][3]);
	}
	
	fpmcs.train(learning_rate, lambda, iterations);
	console.log(train[validation_offset]);
	console.log(fpmcs.recommend(train[validation_offset][1], train[validation_offset][3], 8));
}

test();
