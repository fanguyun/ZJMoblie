/*
 *D3 Helper Function
 */
if (!Function.prototype.curry){
    (function(){
	var slice = Array.prototype.slice;
	
	Function.prototype.curry = function(){
	    var target = this;
	    var args = slice.call(arguments);
	    
	    return function(){
		var allArgs = args;
		if (arguments.length > 0){
		    allArgs = args.concat(slice.call(arguments));
		}
		return target.apply(this, allArgs);
	    };
	};
    }());
}


function R(s){ return Math.floor(Math.random() * s) }; 

function createData(obj, length){
    var data = [];
    for(var i=0; i < length; i++){
        if(typeof obj === 'function'){ data.push(obj())} 
        else{data.push(obj)};   
    }
    return data;
}




function toggle(){
    var fn = arguments;
    var l = Array.prototype.slice.call(fn,1).length;
    var i = 0;
    return function(){
        if(l < i) i=0;
        fn[i++]();            
    }
}



function F(name){
  var params=Array.prototype.slice.call(arguments,1);  
    return function(d){
        if(typeof params[0] ==='function') { return params[0](d[name]) }
        else if( typeof params[0] ==='string'){ return (new Function( 'return (' + d[name] + params[0] + ')' )()) }
        else if( typeof name === 'object' ){ return name }
        else { return d[name]};
    }
}

function I(params){
    return function(d, i){
        if(typeof params ==='function') { return params(i) }
        else if( typeof params ==='string'){ return (new Function( 'return (' + i + params + ')' )()) }
        else { return i};
    }
}

function D(params){
    return function(d, i){
        if(typeof params ==='function') { return params(i) }
        else if( typeof params ==='string'){ return (new Function( 'return (' + d + params + ')' )()) }
        else { return d};
    }
}


