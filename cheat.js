var oldConsole = (console.assert ? console : oldConsole),
    theThingHardToCatch = null,
    console = {
        "log": function() {
            oldConsole.log.call(oldConsole, arguments);
            if (arguments.callee && arguments.callee.caller && arguments.callee.caller.caller && arguments.callee.caller.caller.caller && arguments.callee.caller.caller.caller.caller && arguments.callee.caller.caller.caller.caller.prototype) {
                oldConsole.dir.call(oldConsole, arguments.callee.caller.caller.caller.caller);
                debugger
                var test = arguments.callee.caller.caller.caller.caller;
                if (test.hasOwnProperty("appId") && test.appId === "drawful2") {
                    instance = test;
                    oldConsole.warn.call(oldConsole, instance.currentCanvas);
                }
            }
        }
    }

var oldApply = Function.prototype.apply;

oldApply.apply = oldApply;
console.log.apply = oldApply;

Function.prototype.apply = function(t, a) {
	if (typeof t !== "undefined" && t !== null && t.hasOwnProperty("cid") && t.cid === "view26")
		theThingHardToCatch = t;
	return this.oldApply(t, a);
}
Function.prototype.oldApply = oldApply;

function setCol(col) {
	console.log("setting to", col);
    theThingHardToCatch.currentCanvas.color = col;
    document.querySelector("#drawful-player").style.backgroundColor = col;
    document.querySelector("#drawful-instructions").style.color = col;
    document.querySelector("#chooselikes-choice").style.color = col;
}

var defCol1 = function() {
	setCol(document.querySelector("#drawful-color-buttons > div > button:nth-child(1)").getAttribute("data-color").toLowerCase())
}

var defCol2 = function() {
	setCol(document.querySelector("#drawful-color-buttons > div > button:nth-child(2)").getAttribute("data-color").toLowerCase())
}

var setThickness = function(t) {
    if (typeof t === "string")
        t = parseInt(t);
    if (typeof t !== "number")
        t = 6;

    oldConsole.log.call(oldConsole, t);

    theThingHardToCatch.currentCanvas.thickness = t
}

var redrawCanvas = function() {
    let ctx = theThingHardToCatch.currentCanvas.context;

    ctx.clearRect(0, 0, theThingHardToCatch.currentCanvas.canvas.width, theThingHardToCatch.currentCanvas.canvas.height);

    let lines = theThingHardToCatch.currentCanvas.lines,
        cC = theThingHardToCatch.currentCanvas;
    lines.forEach(el => {
        if (cC.isEnabled) {
            var points = el.points;
            debugger;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y)
            for(let i = 0; i < points.length; i++) {
                let p = points[i];
                ctx.strokeStyle = el.color;
                ctx.lineCap = "round";
                ctx.lineWidth = el.thickness;
                
                ctx.lineTo(p.x, p.y);
                
            }
            ctx.stroke();
            
        }
    })
}

var clearLastLine = function() {
    theThingHardToCatch.currentCanvas.lines.splice(-1, 1)
    redrawCanvas()
}

setInterval(function() {

    let un = document.querySelector("#drawful-color-buttons > div > button:nth-child(1)");
    let deux = document.querySelector("#drawful-color-buttons > div > button:nth-child(2)")
    let pureform = document.querySelector("#game > div.state-draw.drawful-page > div.row.button-bar > div:nth-child(2) > form")
    
    let dplayer = document.querySelector("#drawful-player > span")

    if (dplayer && dplayer.innerText.indexOf(" (SÛREMENT UN TRICHEUR PD)") === -1)
        dplayer.innerText += " (SÛREMENT UN TRICHEUR PD)"

    if (un) un.onclick = (function(e) {
        let input = document.createElement("input");
        input.type = "color";
        input.addEventListener("input", (function() {
            setCol(input.value)
            un.style.backgroundColor = input.value
        }).bind(this));
        input.click();
    }).bind(un);
    if (deux) deux.onclick = (function(e) {
        let input = document.createElement("input");
        input.type = "color";
        input.addEventListener("input", (function() {
            setCol(input.value)
            deux.style.backgroundColor = input.value
        }).bind(this));
        input.click();
    }).bind(deux);
    if (pureform && document.querySelector(".bite") === null) {
    	let resetColB = document.createElement("button");
    	resetColB.setAttribute("class", "button-drawful button-drawful-black bite button-large col-xs-2 bite")
    	resetColB.style.marginTop = "0px";
    	resetColB.addEventListener("mousedown", function() {
    		defCol1();
    	});
    	resetColB.innerText = "Def. Color 1"
    	document.body.appendChild(resetColB)
    	let resetColB_ = document.createElement("button");
    	resetColB_.setAttribute("class", "button-drawful button-drawful-black bite col-xs-2 bite")
    	resetColB_.style.marginTop = "0px";
    	resetColB_.addEventListener("mousedown", function() {
    		defCol2();
    	});
        resetColB_.innerText = "Def. Color 2"
        document.body.appendChild(resetColB_);
        
        let thicknessCustom = document.createElement("button");
        thicknessCustom.setAttribute("class", "button-drawful button-drawful-black bite col-xs-2 bite")
    	thicknessCustom.style.marginTop = "0px";
    	thicknessCustom.addEventListener("mousedown", function() {
    		setThickness(prompt("Thickness (default = 6)"))
    	});
        thicknessCustom.innerText = "Cstm Thickness";

        document.body.appendChild(thicknessCustom);
        
        let clearLastLineB = document.createElement("button");
        clearLastLineB.setAttribute("class", "button-drawful button-drawful-black bite col-xs-2 bite")
    	clearLastLineB.style.marginTop = "0px";
    	clearLastLineB.addEventListener("mousedown", function() {
    		clearLastLine();
    	});
        clearLastLineB.innerText = "Clear last line";

        document.body.appendChild(clearLastLineB);
    	pureform.querySelector("button").style.width = "100px";
    	pureform.querySelector("button").classList.add("bite");
    	document.querySelectorAll("button.button-drawful.button-drawful-black.bite").forEach(function(el, ind) {
            el.style.display = "inline-block";
            var base = 160;
    		if (ind > 0) {
                var pd = (base + (ind * 60))
                el.style = "margin-top: 0px;display: inline-block;font-size: 10px;padding: 0px;position: absolute;bottom: 40px;left: 50%;width: 60px;transform: translateX(-50%);margin-left: "  + pd + "px;"
    			el.tabIndex = -1
    			el.style.fontSize = "10px"
    			el.style.padding = "0"
    		}
    	})
    }

    if (un && deux && (document.querySelector(".state-draw.drawful-page.pt-page-off") === null) && (document.querySelector(".state-draw.drawful-page") !== null)) {
    	document.querySelectorAll("button.button-drawful.button-drawful-black.bite").forEach(function(el, ind) {
    		if (ind > 0)
    			el.style.display = "inline-block";
    	})
	redrawCanvas()
    } else
    	document.querySelectorAll("button.button-drawful.button-drawful-black.bite").forEach(function(el, ind) {
    		if (ind > 0)
    			el.style.display = "none";
    	})

}, 500)
