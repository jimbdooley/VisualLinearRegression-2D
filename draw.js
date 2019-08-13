

var D = {
	
	stats:{
		buffer:0.2,
		framesPerSec:50,
		itersPerFrame:100
	},
	
	screen:{
		H:0,
		W:0
	},
	
	draw_line:function(path, width, color){
		mainCtx.lineWidth = width;
		mainCtx.strokeStyle = color
		mainCtx.beginPath();
		mainCtx.moveTo(path[0][0], path[0][1]);
		for(let i = 1; i < path.length; ++i){
			mainCtx.lineTo(path[i][0], path[i][1]);
		}
		mainCtx.stroke();
		mainCtx.lineWidth = 0.5;
		mainCtx.strokeStyle = 'black'
	},

	set_limits:function(points){
		minX = points[0][0];
		maxX = points[0][0];
		minY = points[0][1];
		maxY = points[0][1];
		for (let i= 1; i<points.length; ++i){
			minX = Math.min(minX, points[i][0]);
			maxX = Math.max(maxX, points[i][0]);
			minY = Math.min(minY, points[i][1]);
			maxY = Math.max(maxY, points[i][1]);
		}
		xDif = maxX-minX;
		yDif = maxY-minY;
		return [ [minX - D.stats.buffer * xDif, minY - D.stats.buffer * yDif ],
				 [maxX + D.stats.buffer * xDif, maxY + D.stats.buffer * yDif ]];
		
	},

	draw_circle:function(center,diameter,border,inside){
		mainCtx.strokeStyle = border;
		mainCtx.beginPath();	
		mainCtx.arc(center[0],center[1],diameter,0,2*Math.PI);
		mainCtx.fillStyle = inside;
		mainCtx.fill();
		mainCtx.stroke();
		mainCtx.strokeStyle = 'black';
		mainCtx.fillStyle = 'black';
	},
	
	get_virtual_point:function(real_point, limits){
		let x = D.screen.W*(0+((real_point[0]-limits[0][0]) / (limits[1][0]-limits[0][0])));
		let y = D.screen.H*(1-((real_point[1]-limits[0][1]) / (limits[1][1]-limits[0][1])));
		return [x,y];
	},

	graph:function(myFunc, limits){
		let gap = 3;
		let offsetX = limits[0][0];
		let offsetY = limits[0][1];
		let scaleX = (limits[1][0]-limits[0][0])/D.screen.W;
		let scaleY = (limits[1][1]-limits[0][1])/D.screen.H;
		let step = (limits[1][0] - limits[0][0])*gap/D.screen.W;
		mainCtx.lineWidth = 1;
		mainCtx.strokeStyle = 'black'
		mainCtx.beginPath();
		mainCtx.moveTo(0,D.screen.H-(myFunc(0+offsetX)-offsetY)/scaleY);
		for(let x = step; x < D.screen.W+step; x+=step){
			mainCtx.lineTo(x, D.screen.H-(myFunc(x*scaleX+offsetX)-offsetY)/scaleY);
		}
		mainCtx.stroke();
	},

	plot:function(points, myFunc){
		limits = D.set_limits(points);
		newPoints = [];
		for(let i = 0; i < points.length; ++i){
			newPoints.push(D.get_virtual_point(points[i],limits));
		}
		for(let i = 0; i<newPoints.length; ++i){
			D.draw_circle(newPoints[i], Math.min(5,Math.max(1,100/points.length)), 'red','red')
		}
		D.graph(myFunc, limits);
		
	},
	
	init:function(){
		D.screen.H = document.getElementById("mainCanvas").height + 0;
		D.screen.W = document.getElementById("mainCanvas").width + 0;
	}
}









