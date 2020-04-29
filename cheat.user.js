// ==UserScript==
// @name         drawful-2-colors
// @namespace    Maeeen
// @version      0.1
// @description  try to take over the world!
// @author       Maeeen
// @match        https://jackbox.tv/*
// @repo         https://github.com/Maeeen/drawful-2-colors
// @downloadURL  https://raw.githubusercontent.com/Maeeen/drawful-2-colors/master/cheat.user.js
// @grant        none
// ==/UserScript==

(function() {
    // The hell of hooking

    const WEBPACK_CHECK_EVERY_MS = 250
    const DRAWFUL_2_APP_EXPORT_ID = 44
    const DRAWFUL_2_INITIALIZER_KEY = 795

    let webpackReady = () => {
        console.log('Webpack ready!')

        let _push = webpackJsonp.push

        webpackJsonp.push = function(a1, a2) {
            if (Array.isArray(a1) && Array.isArray(a1[0]) && a1[0][0] === DRAWFUL_2_APP_EXPORT_ID) {
                return _push.apply(this, [drawful2appExport(a1)])
            }
            return _push.apply(this, arguments)
        }
    }

    let check = () => setTimeout(() => webpackJsonp ? webpackReady() : check(), WEBPACK_CHECK_EVERY_MS)
    check()


    let drawful2appExport = _export => {
        const old_func = _export[1][DRAWFUL_2_INITIALIZER_KEY]

        _export[1][DRAWFUL_2_INITIALIZER_KEY] = function(t, e, n) {
            // Hook (n(410) = r).a.extend
            const old_n410r_func = n(410).a.extend
            n(410).a.extend = function(obj) {
                return old_n410r_func.apply(this, [hookDrawfulObj(obj)])
            }
            return old_func.apply(this, arguments)
        }
        console.log('The export has been hooked!')
        return _export
    }

    let drawfulInitialObj, finalObj
    let hookDrawfulObj = (a) => {
        drawfulInitialObj = a

        // Hooking startDrawingInterface
        const _startDrawingInterface = a.startDrawingInterface
        a.startDrawingInterface = function(t, e) {
            finalObj = this
            window.finalObj = finalObj

            console.log('Final object hooked!')
            cheat()
            _startDrawingInterface.apply(this, arguments)
        }

        window.drawfulInitialObj = drawfulInitialObj
        return a
    }

    let askColor = cb => {
        let input = document.createElement("input")
        input.type = "color"
        input.addEventListener("input", () => cb(input.value))
        input.click()
    }

    let delay = f => setTimeout(f, 500)

    let setColor = color => {
        if (!finalObj)
            return alert('Final obj not found')
        console.log('Settings to', color)
        finalObj.currentCanvas.color = color
    }

    let askThickness = () => {
        if (!finalObj)
            return alert('Final obj not found')
        let r = prompt('Set thickness ? (default is 6)')

        if (isNaN(parseInt(r)))
            return alert('Not a number...')
        finalObj.currentCanvas.thickness = parseInt(r)
    }

    let redrawCanvas = () => {
        let ctx = finalObj.currentCanvas.context

        const { width, height } = finalObj.currentCanvas.canvas
        ctx.clearRect(0, 0, width, height)

        // get b64 image now !
        // can't use this technique because thickness isn't
        // read by line but more like a general variable
        /* let img = new Image()
        img.onload = () => ctx.drawImage(img, 0, 0)
        img.src = 'data:image/png;base64,' + finalObj.currentCanvas.getBase64Image() */
        // using my older technique
        let lines = finalObj.currentCanvas.lines,
            cC = finalObj.currentCanvas
        lines.forEach(el => {
            if (cC.isEnabled) {
                var points = el.points
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y)
                for(let i = 0; i < points.length; i++) {
                    let p = points[i];
                    ctx.strokeStyle = el.color
                    ctx.lineCap = "round"
                    ctx.lineWidth = el.thickness

                    ctx.lineTo(p.x, p.y)

                }
                ctx.stroke()

            }
        })
    }

    let clearLastLineAndRedraw = () => {
        finalObj.currentCanvas.lines.pop()
        redrawCanvas()
    }

    let cheat = () => {
        let a = drawfulInitialObj, b = finalObj

        let customColor = document.createElement('button')
        customColor.addEventListener('click', () => askColor(color => setColor(color)))
        customColor.className = 'col-xs-1 button-color button-large pure-button pure-input-1-8 color-2'
        customColor.innerText = 'Custom'
        customColor.style.width = '75px'

        let customThickness = document.createElement('button')
        customThickness.addEventListener('click', () => askThickness())
        customThickness.className = 'col-xs-1 button-color button-large pure-button pure-input-1-8 color-2'
        customThickness.innerText = 'Thickness'
        customThickness.style.width = '75px'

        let clearLastLine = document.createElement('button')
        clearLastLine.addEventListener('click', () => clearLastLineAndRedraw())
        clearLastLine.className = 'col-xs-1 button-color button-large pure-button pure-input-1-8 color-2'
        clearLastLine.innerText = 'Clear last line'
        clearLastLine.style.width = '100px'

        let d = document.querySelector('#drawful-color-buttons')
        delay(() => d.appendChild(customColor))
        delay(() => d.appendChild(customThickness))
        delay(() => d.appendChild(clearLastLine))
    }

})();
