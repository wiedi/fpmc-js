var
	fs    = require('fs'),
	proc  = require('getrusage'),
	fpmcs = require('./fpmc_simple'),


  lambda        = 0.5,
	learning_rate = 0.9,
	iterations    = 30,

  buckets = {},	
	
	usage = function() {
		var u = proc.usage();
		return "rss=" + (u['maxrss'] / (1024*1024)) + " page_reclaims=" + u['minflt'] + " ivcsw=" + u['nivcsw']
	}
  ;

// read example data
function example() {
  var lines = fs.readFileSync('example_data.csv').toString().split('\n')

  lines.forEach(function (line) { 

    var line = line.split(',');
    var user_id = line[0];
    var item_id = line[1];
    //var item_id_clean = item_id.replace(/^profile\_([0-9])/, '$1');

    if(user_id.length == 0)
      return;

    if(!buckets[user_id]) {
      buckets[user_id] = [item_id];
    } else {
       buckets[user_id].push(item_id);
    }

    fpmcs.feedback(user_id, item_id);

  });

  //console.log(buckets);

  console.log(usage());
	console.time("train");
  fpmcs.train(learning_rate, lambda, iterations);
	console.timeEnd("train");
  console.log(usage());

	console.time("recommend");
	console.log(fpmcs.recommend(18797, 'profile_23351', 6));
	console.timeEnd("recommend");
	console.log(usage());

	console.log(fpmcs.recommend(18801, 'profile_22728', 6));
	console.log(fpmcs.recommend(18800, 'profile_23213', 6));


} 

example();
