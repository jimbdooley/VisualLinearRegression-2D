var mainCanvas = document.getElementById("mainCanvas");
//var hCanvas = document.getElementById("hCanvas");
var mainCtx = mainCanvas.getContext("2d");
//var hCtx = hCanvas.getContext("2d");

function get_some_data(){
	let rtn = [];
	for(let i = 0 ;i<6; ++i){
		let x = 0.5 - Math.random();
		rtn.push([i,Math.random()])
	}
	//rtn.push([10,1.8])
	return rtn;
}


var controller = {
	
	oneFrame:function(){
		
		mainCtx.clearRect(0,0,mainCanvas.width, mainCanvas.height);
		
		for(let i = 0; i < D.stats.itersPerFrame; ++i){
			let delta = [];
			for(let j = 0; j <= L.data.order; ++j){
				delta.push(L.data.step_size*L.dedt(j));
			}
			for(let j = 0; j <= L.data.order; ++j){
				L.data.thetas[j] -= delta[j];
			}
		}
		
		D.plot(L.data.normalized,L.data.func);
		
		setTimeout(controller.oneFrame, 1000/D.stats.framesPerSec);
	},
	
	init:function(){
		L.init()
		D.init();
		controller.oneFrame();
	}
}


controller.init();
