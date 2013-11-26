/**
Script for displaying binary trees
@author: FM L'Heureux
@date: 2010-01-24
@version: 1.1.0
@see: http://frank-mich.com/jQuery

*/

jQuery.fn.btree = function(options){
	var result = new Array();
	$(this).each(function(){
		var btree = new Btree($(this), options);
		btree.displayTree();
		result.push(btree);
	});	
	return result;
};

function Btree(caller, options){
	var jg = new jsGraphics( caller[0] );
	caller.css("position", "relative");
	this.caller = caller;
	this.size = null;
	this.settings = jQuery.extend({
		hSpace: 10,
		vSpace: 10,
		borderWidth: 1,
		branchColor: "#000000",
		branchStroke: 2,
		jsGraphics: jg,
		horizontal: true,
		flip: false
	}, options);
};

Btree.prototype.displayTree = function(){
	//display settings
	var hSpace = parseInt(this.settings.hSpace, 10);
	var vSpace = parseInt(this.settings.vSpace, 10);
	var borderWidth = parseInt(this.settings.borderWidth, 10);
	var size = this.size;//avoids interference with the jsGraphics lib
	var branchStroke = parseInt(this.settings.branchStroke, 10);
	var branchColor = this.settings.branchColor;
	var flip = this.settings.flip;
	var i = 0;
	//compute the max width and max height and apply it	
	var spanWidth = 0;
	var spanHeight = 0;
	var jg = this.settings.jsGraphics;
	jg.clear();
	this.caller.children("div").children("span").each(function(){
		$(this).css("white-space", "nowrap");
		$(this).css("display", "inline-block");
		if(this.size == null || i <= this.size){
			spanWidth = Math.max(spanWidth, $(this).width());
			spanHeight = Math.max(spanHeight, $(this).height());
			i ++;
		}
	});
	if(this.size == null){
		this.size = i;
		size = i;
	}
	i = 0;
	if(vSpace < 0){
		vSpace = 0;
	}
	if(hSpace < 0){
		hSpace = 0;
	}
	var maxPos = btreeBoxDistance((size - 1)/2);
	if(this.settings.horizontal){
		//var usingVSpace = vSpace/2 - spanHeight / 2 - borderWidth;
		var usingVSpace = vSpace/2 + spanHeight / 2 + borderWidth;
		var usingHSpace = hSpace - spanWidth / 2 - borderWidth;
		var cssHorizontal = this.settings.flip ? "right" : "left";
		//position the boxes and set size
		this.caller.children("div").each(function(){
			var leftPos = btreeBoxDistance(i);
			if(i < size){

				$(this).css("position", "absolute");
				$(this).css("display", "inline-block");
				$(this).css("left", "");
				$(this).css(cssHorizontal, (leftPos * (spanWidth + borderWidth * 2 + hSpace) + "px"));
				$(this).css("top", ((i * usingVSpace) + "px"));
				$(this).css("border-width", borderWidth + "px");
				$(this).css("width", spanWidth);
				$(this).css("height", spanHeight);
				$(this).children("span").each(function(){
					$(this).css("width", spanWidth);
				});
				i ++
			}
		});
		
		//once everything is in place, refresh jg
		//alert(usingVSpace);
		this.caller.height((size + 1) * usingVSpace - vSpace);
		this.caller.width((hSpace + spanWidth + borderWidth*2) * (maxPos + 1) - hSpace);
		var callerOffset = this.caller.offset();
		var callerLeftBorder = this.caller.css("borderLeftWidth");
		callerLeftBorder = parseInt(callerLeftBorder.substr(0, callerLeftBorder.length - 2), 10);
		if(isNaN(callerLeftBorder)){
			//IE fix - medium  ~= 3
			callerLeftBorder = 3;		
		}
		var callerTopBorder = this.caller.css("borderTopWidth");
		callerTopBorder = parseInt(callerTopBorder.substr(0, callerTopBorder.length - 2), 10);
		if(isNaN(callerTopBorder)){
			//IE fix - medium  ~= 3
			callerTopBorder = 3;		
		}
		if(branchStroke > 0){
			refreshJg(jg, branchStroke, branchColor);
			i = 0;
			this.caller.children("div").each(function(){
				var leftPos = btreeBoxDistance(i);
				if(i < size){
					//on the left, draw straight horizontal and vertical lines
					var offset = $(this).offset();
					offset.top -= callerOffset.top + callerTopBorder;
					offset.left -= callerOffset.left + callerLeftBorder;
					offset.right = offset.left + spanWidth + borderWidth;
					if(leftPos > 0){
						var x = (flip ? offset.right + hSpace / 2 + borderWidth - branchStroke / 2 : offset.left - hSpace / 2 - branchStroke / 2);
						var y = offset.top + (($(this).height() + borderWidth * 2) / 2);
						//horizontal line
						jg.drawLine(x, y - (branchStroke / 2), flip ? offset.right + borderWidth : offset.left - (branchStroke / 2), y - (branchStroke / 2));
						//var quarterLength = ((Math.pow(2, leftPos) * (spanHeight + usingVSpace + borderWidth * 2)) - 1) / 4;
						var halfLength = ((Math.pow(2, leftPos) * (spanHeight/2 + vSpace/2 + borderWidth))) / 2;
						//vertical line
						jg.drawLine(x, y - halfLength - (branchStroke / 2), x, y + halfLength - 1);
						//2 extremities
						jg.drawLine(flip ? x + hSpace / 2 : x - hSpace / 2 + branchStroke / 2, y - halfLength - (branchStroke / 2), x, y - halfLength - (branchStroke / 2));
						jg.drawLine(flip ? x + hSpace / 2 : x - hSpace / 2 + branchStroke / 2, y + halfLength - (branchStroke / 2), x, y + halfLength - (branchStroke / 2));
					}
					i ++;
				}
			});
		}
	}else{
		var usingHSpace = hSpace/2 + spanWidth / 2 + borderWidth;
		var last = null;
		var cssVertical = this.settings.flip ? "bottom" : "top";
		this.caller.children("div").each(function(){
			if(i < size){
				//position the boxes and set size
				var topPos = btreeBoxDistance(i);
				$(this).css("position", "absolute");
				$(this).css("top", "");
				$(this).css(cssVertical, (topPos * (spanHeight + borderWidth * 2 + vSpace) + "px"));
				$(this).css("left", ((i * usingHSpace) + "px"));
				$(this).css("border-width", borderWidth + "px");
				$(this).css("width", spanWidth);
				$(this).css("height", spanHeight);
			}
			i ++;
		});
		this.caller.height((spanHeight + borderWidth * 2) * (maxPos + 1) + maxPos * vSpace);		
		this.caller.width((size + 1) / 2 * (spanWidth + borderWidth * 2 + hSpace) - hSpace);
		var callerOffset = this.caller.offset();
		var callerLeftBorder = this.caller.css("borderLeftWidth");
		callerLeftBorder = parseInt(callerLeftBorder.substr(0, callerLeftBorder.length - 2), 10);
		if(isNaN(callerLeftBorder)){
			//IE fix
			callerLeftBorder = 0;		
		}
		var callerTopBorder = this.caller.css("borderTopWidth");
		callerTopBorder = parseInt(callerTopBorder.substr(0, callerTopBorder.length - 2), 10);
		if(isNaN(callerTopBorder)){
			//IE fix
			callerTopBorder = 0;		
		}
		//once everything is in place, refresh jg
		refreshJg(jg, branchStroke, branchColor);
		i = 0;
		this.caller.children("div").each(function(){
			if(i < size){
				var topPos = btreeBoxDistance(i);
				//on the top, draw straight horizontal and vertical lines
				var offset = $(this).offset();
				offset.top -= callerOffset.top + callerTopBorder;
				offset.left -= callerOffset.left + callerLeftBorder;
				offset.bottom = offset.top + spanHeight + borderWidth * 2;
				if(topPos > 0){
					var x = offset.left + ($(this).width() + borderWidth * 2) / 2;
					var y = flip ? offset.bottom + vSpace / 2 - branchStroke / 2 : offset.top - vSpace / 2 - branchStroke / 2;
					//middle
					jg.drawLine(x - (branchStroke / 2), y, x - (branchStroke / 2), flip ? offset.bottom : offset.top - (branchStroke / 2));
					var halfLength = Math.pow(2, topPos) * (usingHSpace) / 2 - 1;
					//horizontal line
					jg.drawLine(x - halfLength - (branchStroke / 2), y, x + halfLength, y);
					//2 extremities
					jg.drawLine(x - halfLength - (branchStroke / 2), flip ? y + vSpace / 2 : y - vSpace/2 + branchStroke / 2, x - halfLength - (branchStroke / 2), y);
					jg.drawLine(x + halfLength - (branchStroke - 2) / 2, flip ? y + vSpace / 2: y - vSpace/2 + branchStroke / 2, x + halfLength - (branchStroke - 2) / 2, y);
				}
				i ++;
				last = $(this);
			}
		});
	}
	jg.paint();
	this.settings.jsGraphics = jg;
};

Btree.prototype.clear = function(){
	this.settings.jsGraphics.clear();
};

btreeBoxDistance = function(i){
	var counter = 0;
	while(i % 2 == 1){
		counter ++;
		i = (i - 1) / 2;
	}
	return counter;
};

refreshJg = function(jg, branchStroke, branchColor){
	jg.clear();
	jg.setStroke(branchStroke);
	jg.setColor(branchColor);
};
