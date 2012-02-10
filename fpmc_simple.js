var
	fpmc = require('./fpmc'),
	u_to_fpmc   = {},
	u_from_fpmc = {},
	i_to_fpmc   = {},
	i_from_fpmc = {},
	t_to_fpmc   = {},
	s = []
	
	convert_to_fpmc = function(u, i) {
		if(!(u in u_to_fpmc)) {
			u_fpmc = Object.keys(u_to_fpmc).length + 1;
			u_to_fpmc[u]        = u_fpmc;
			u_from_fpmc[u_fpmc] = u;
		} else {
			u_fpmc = u_to_fpmc[u];
		}
		
		if(!(i in i_to_fpmc)) {
			i_fpmc = Object.keys(i_to_fpmc).length + 1;
			i_to_fpmc[i]        = i_fpmc;
			i_from_fpmc[i_fpmc] = i;
		} else {
			i_fpmc = i_to_fpmc[i];
		}
		
		if(!(u in t_to_fpmc)) {
			t_to_fpmc[u_fpmc] = 1;
		} else {
			t_to_fpmc[u_fpmc]++;
		}
		
		return [u_fpmc, t_to_fpmc[u_fpmc], i_fpmc];
	}
	;


exports.init = function() {
	u_to_fpmc   = {};
	u_from_fpmc = {};
	i_to_fpmc   = {};
	i_from_fpmc = {};
	t_to_fpmc   = {};
	s           = [];
}

exports.feedback = function(u, i) {
	s.push(convert_to_fpmc(u, i))
}

exports.train = function(learning_rate, lambda, iterations) {
	console.log('samples=' + s.length + ' users=' + Object.keys(u_to_fpmc).length + ' items=' + Object.keys(i_to_fpmc).length);
	fpmc.learn(s, learning_rate, lambda, iterations);
}

exports.recommend = function(u, i, limit) {
	ret = [];
	if(u in u_to_fpmc) {
		user = u_to_fpmc[u];
		items = fpmc.recommend(user, limit);
		for(i=0; i < items.length; i++) {
			ret.push(i_from_fpmc[items[i][0]])
		}		
	} else if(i in i_to_fpmc) {
		item = i_to_fpmc[i];
		items = fpmc.recommendByItem(item, limit);
		for(i=0; i < items.length; i++) {
			ret.push(i_from_fpmc[items[i][0]])
		}
	} else {
		/* TODO: most popular */
		return [];
	}


	return ret;
}



