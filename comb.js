print = console.log;

function apply(f, args){
	var func = Array.from(f);
	for(var i = 0; i < func.length; i++){
		if(Array.isArray(func[i]))
			func[i] = apply(func[i], args);
		else
			func[i] = args[func[i]]; }
	return func;
}

function Comb(num, func, color){
	this.num = num;
	this.func = func;
	this.color = color;
	this.apply = function(args){
		return apply(this.func, args);
	}
}

function CombS(id, num){
	this.id = id;
	this.num = num;
	this.args = [];
	this.curry = function(arg){
		this.args.push(arg);
		--this.num;
	}
}

var lookup = {
	"S": new Comb(3, [0, 2, [1, 2]], "orange"),
	"K": new Comb(2, [0], "green"),
	"I": new Comb(1, [0], "white"),
	"B": new Comb(3, [0, [1, 2]], "red"),
	"C": new Comb(3, [0, 2, 1], "yellow"),
	"D": new Comb(3, [1, 2, 0], "yellow"),
	"W": new Comb(2, [0, 1, 1], "darkgreen"),
	"L": new Comb(2, [0, [1, 1]], "blue")
};

var a1 = ["x", "y", "z"];
var a2 = ["a", "b", "c"];

// function CombS(id, num){
// 	this.id = id;
// 	this.num = num;
// 	this.args = [];
// 	this.curry = function(arg){
// 		this.args.push(arg);
// 		--this.num;
// 	}
// }

function copy(state){
	if(Array.isArray(state))
		return Array.from(state).map(copy);
	var tmp = new CombS(state.id, state.num);
	tmp.args = Array.from(state.args);
	return tmp;
}

function step(s){
	var state = copy(s);
	if(Array.isArray(state[0]))
		return [state[0].concat(state.slice(1)), true];

	for(var i = 0; i < state.length; i++){
		if(Array.isArray(state[i])){
			if(state[i].length == 1 && !Array.isArray(state[i][0]) && state[i][0].args.length == 0){
				print(state[0]);
				state[i] = state[i][0];
				return [state, true];
			}

			var tmp = step(state[i]), stepped = tmp[0], changed = tmp[1];
			if(changed){
				state[i] = stepped;
				return [state, true];
			}
		}
		else{
			if(state[i].num == -1) continue;

			if(state[i].num == 0){
				var result = lookup[state[i].id].apply(state[i].args);
				state = state.slice(0, i).concat(result).concat(state.slice(i + 1));
				return [state, true];
			}
			else{
				if(i == state.length - 1) continue;
				state[i].curry(state.splice(i + 1, 1)[0]);
				return [state, true];
			}
		}
	}
	return [state, false];
}

function make(id){
	if(id in lookup)
		return new CombS(id, lookup[id].num);
	return new CombS(id, -1);
}

function makeAll(arr){
	if(Array.isArray(arr))
		return Array.from(arr).map(makeAll);
	return make(arr);
}

function dump(state){
	var res = "";
	for(var i = 0; i < state.length; i++){
		if(Array.isArray(state[i]))
			res += "(" + dump(state[i]) + ")";
		else{
			if(state[i].num == -1)
				res += state[i].id;
			else
				res += state[i].id + "/" + state[i].num;
		}
		if(i != state.length - 1)
			res += ", ";
	}
	return res;
}

function sim(s){
	var state = Array.from(s);
	while(true){
		print(dump(state));
		var tmp = step(state), stepped = tmp[0], changed = tmp[1];
		if(!changed) return;
		state = stepped;
	}
}

function getHeight(state){
	var max = 0;
	for(var i = 0; i < state.length; i++)
		if(Array.isArray(state[i]))
			max = Math.max(max, getHeight(state[i]));
	return max + 1;
}

function maxHeight(s){
	var state = Array.from(s), res = 0;
	for(var i = 0; i < 100; i++){
		res = Math.max(res, getHeight(state));
		var tmp = step(state), stepped = tmp[0], changed = tmp[1];
		if(!changed) return res;
		state = stepped;
	}
	return -1;
}

//function stringHelp(str, ptr, acc){
//	if(str[ptr] == "(")
//		return [stringHelp(str, ptr + 1)];
//
//}
