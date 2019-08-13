
var L = {
	
	data:{
		starting_step_size:0.005,
		step_size:0,
		order:5,
		thetas:[],
		func:function(){},
		t0_error:[],
		m:0,
		raw:[],
		normalized:[],
		X:[],
		Y:[],
		meanX:0,
		meanY:0,
		stdevX:0,
		stdevY:0
	},
	
	//extract data here
	//must return an array of 2d points; e.g. [ [5.0, 2.1], [2.5, -1], [6.2, 6.3], [8.2, 8.1] ]
	getData:function(){
		return get_some_data()
	},
	
	
	//transforms the data so the average=0 and stdev=1 for all dimensions
	//the new data is placed in: L.data.normalized	
	normalizeData:function(){
		L.data.meanX = 0;
		L.data.meanY = 0;
		for(let i = 0; i<L.data.m;++i){
			L.data.meanX += L.data.raw[i][0]/L.data.m;
			L.data.meanY += L.data.raw[i][1]/L.data.m;
		}
		
		let sumX = 0;
		let sumY = 0;
		for(let i = 0; i<L.data.m;++i){
			sumX += Math.pow(L.data.raw[i][0] - L.data.meanX,2);
			sumY += Math.pow(L.data.raw[i][1] - L.data.meanY,2);
		}
		sumX /= L.data.m;
		sumY /= L.data.m;
		L.data.stdevX = Math.sqrt(sumX);
		L.data.stdevY = Math.sqrt(sumY);
		for(let i = 0; i<L.data.m;++i){
			L.data.normalized.push([(L.data.raw[i][0] - L.data.meanX)/L.data.stdevX, 
									 (L.data.raw[i][1] - L.data.meanY)/L.data.stdevY]);
		}
		for(let i = 0; i<L.data.normalized.length; ++i){
			temp = [];
			for(let j = 0; j <= L.data.order; ++j){
				temp.push(Math.pow( L.data.normalized[i][0] , j));
			}
			L.data.X.push(temp);
			L.data.Y.push(L.data.normalized[i][1]);
		}
	},
	
	//returns the quadratic equation (from thetas) as a function
	makeFunc:function(){
		return function(x){
			let sm=0;
			for (let i = 0; i< L.data.order+1; ++i){
				sm += L.data.thetas[i]*Math.pow(x, i);
			}
			return sm;
		}
	},
	
	
	//calculates the partial derivative of error
	dedt:function(denom){
		let dedt_sum = 0;
		for(let i = 0; i < L.data.m; ++i){
			tempsum = 0;
			for(let j = 0; j <= L.data.order; ++j){
				tempsum += L.data.X[i][j]*L.data.thetas[j];
			}
			tempsum -= L.data.Y[i];
			tempsum *= 2;
			tempsum *= Math.pow(L.data.normalized[i][0], denom);
			dedt_sum += tempsum;
		}
		return dedt_sum / L.data.m;
	},
	
	
	
	init:function(){
		L.data.raw = L.getData();
		L.data.m = L.data.raw.length;
		L.normalizeData();
		for(let j = 0; j<L.data.order+1; ++j){
			L.data.thetas.push(2*Math.random()-1);
		}
		L.data.func=L.makeFunc();
		L.data.step_size = L.data.starting_step_size;
		
	},
};