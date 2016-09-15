window.SIOPlugin = { "initialized": false };
var mapClass = "sio-emotion-map";

SIOPlugin.init = function (client_id, tenant, uri, initCallback) {

    if (SIOPlugin.frame) {
        try {
            document.body.removeChild(SIOPlugin.frame);
            SIOPlugin.frame = undefined;
        }
        catch (err) {
            console.log('[DEBUG]: Could not remove SIO auth frame', err);
        }
    }
    if (SIOPlugin.authListener) {
        try {
            window.removeEventListener("message", SIOPlugin.authListener);
            SIOPlugin.authListener = undefined;
        }
        catch (err) {
            console.log('[DEBUG]: Could not remove SIO auth listener', err);
        }
    }

    SIOPlugin.uri = uri;

    var authUrl = "https://rest.sensation.io/token?client_id=" + client_id + "&redirect_uri=" + uri + "&tenant=" + tenant;

    SIOPlugin.createFrame = function () {
        SIOPlugin.frame = document.createElement("iframe");
        var versionPostfix = "";
        SIOPlugin.frame.setAttribute("src", authUrl);
        SIOPlugin.frame.setAttribute("style", "position:absolute;top:0;left:0;width:0;height:0;display:none;");
        document.body.appendChild(SIOPlugin.frame);
        SIOPlugin.frame.onload = function () {
            SIOPlugin.initialized = true;
        };
    };

    SIOPlugin.createFrame();

    window.addEventListener("message", function (event) {
        var data = event.data;

        if (data && data.length > 0) {
            var tokenIndex = data.indexOf("sio_token");
            if (tokenIndex >= 0) {
                var token = data.substr(tokenIndex + 10, data.length - tokenIndex);
                initCallback(token);
            }
        }
    }, false);
};

SIOPlugin.init2 = function (client_id, tenant, context, token, initCallback) {
    $.ajax({
        url: "https://rest.sensation.io/ctx/token",
        type: "POST",
        data: {
            /*
             if (!req.body.context || req.body.context.length <= 0
             || !req.body.tenant || req.body.tenant.length <= 0
             || !req.body.client_id || req.body.client_id.length <= 0
             || !req.body.token || req.body.token.length <= 0) {
             */
            context: context,
            tenant: tenant,
            client_id: client_id,
            token: token
        },
        contentType: "application/x-www-form-urlencoded; charset=utf-8"
    }).done(function (accToken) {
        initCallback(null, accToken)
    }).fail(function (init2Err) {
        initCallback(init2Err, null);
    });
};

SIOPlugin.load = function (pqId, token, key, tags, options, callback) {
    //apiUrl, showJams, callbacks

    var apiUrl = 'https://rest.sensation.io/';
    var showJams = true;
    var jamsByKey = true;
    var postJams = true;
    var onlyShowJamsWithoutRating = false;
    var titleClass = "sio-question-title";
    var onBoarding = {
        active: false,
        fontSize: '48px',
        textColor: '#000',
        fontFamily: "sans-serif",
        backgroundColor: '#fff',
        phrase: ''
    };


    if (options) {
        if (options.apiUrl && options.apiUrl != null && options.apiUrl.length > 0) {
            apiUrl = options.apiUrl;
        }
        if (options.showJams === false) {
            showJams = false;
        }
        if (options.onlyShowJamsWithoutRating === true) {
            onlyShowJamsWithoutRating = true;
        }
        if (options.jamsByKey === false) {
            jamsByKey = false;
        }
        if (options.postJams === false) {
            postJams = false;
        }
        if (options.titleClass && options.titleClass != null && options.titleClass.length > 0) {
            titleClass = options.titleClass;
        }
        if (options.mapClass && options.mapClass != null && options.mapClass.length > 0) {
            mapClass = options.mapClass;
        }
        if (options.onBoarding && options.onBoarding == true) {
            onBoarding.active = true;
            onBoarding.fontSize = options.onBoardingFontSize ? options.onBoardingFontSize : onBoarding.fontSize;
            onBoarding.textColor = options.onBoardingTextColor ? options.onBoardingTextColor : onBoarding.textColor;
            onBoarding.fontFamily = options.onBoardingFontFamily ? options.onBoardingFontFamily : onBoarding.fontFamily;
        }
    }

    // Load map info

    $.ajax({
        url: apiUrl + "pollquestions/" + pqId,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
    }).done(function (question) {





        // quick fix for showing results if already rated


        if (onlyShowJamsWithoutRating) {

            $.ajax({
                url: apiUrl + "stats/pq/" + pqId + "/matrix" + (jamsByKey ? "/key/" + key : ""),
                type: "GET",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                success: function (rawMx) {

                    var matrix = [];

                    // initialize matrix
                    for (var i = 0; i < 10; i++) {
                        matrix[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    }

                    // populate matrix
                    for (var i = 0; i < rawMx.length; i++) {
                        if (matrix.length > rawMx[i].x && matrix[rawMx[i].x].length > rawMx[i].y) {
                            matrix[rawMx[i].x][rawMx[i].y] = parseInt(rawMx[i].count);
                        }
                        else {
                            console.log('[PLUGIN]: Matrix error. Found illegal value.', {
                                x: rawMx[i].x,
                                y: rawMx[i].y
                            });
                        }
                    }

                    // set values to render
                    mapChartData.matrix = matrix;
                    mapChartData.points = undefined;
                    chartOptions.inputmode = false; // already jammed, so let's not capture more

                    // replace old map with populated one
                    var mapParent = $(mapCanvas).parent();
                    var newMapCanvas = $(mapCanvas).clone(false, false);
                    $(mapCanvas).remove();
                    $(mapParent).append(newMapCanvas);
                    mapCanvas = newMapCanvas;
                    var ctx = newMapCanvas.get(0).getContext("2d");
                    var mapChart = new Chart(ctx);
                    mapChart.Map(mapChartData, chartOptions);
                }
            });

        }




        // The function handling user clicks

        var postJamHandler = function (point) {

            mapChartData.singlePoint = null;

            var postUrl = apiUrl + "jams";
            var postData = {
                x: point.x,
                y: point.y,
                poll_question_id: question.id,
                tags: tags,
                key: key
            };

            $.ajax({
                url: postUrl,
                type: "POST",
                data: postData,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                contentType: "application/x-www-form-urlencoded; charset=utf-8"
            }).done(function (data) {

                if (showJams) {

                    // Let's load & display other jams

                    $.ajax({
                        url: apiUrl + "stats/pq/" + pqId + "/matrix" + (jamsByKey ? "/key/" + key : ""),
                        type: "GET",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        },
                        success: function (rawMx) {

                            var matrix = [];

                            // initialize matrix
                            for (var i = 0; i < 10; i++) {
                                matrix[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            }

                            // populate matrix
                            for (var i = 0; i < rawMx.length; i++) {
                                if (matrix.length > rawMx[i].x && matrix[rawMx[i].x].length > rawMx[i].y) {
                                    matrix[rawMx[i].x][rawMx[i].y] = parseInt(rawMx[i].count);
                                }
                                else {
                                    console.log('[PLUGIN]: Matrix error. Found illegal value.', {
                                        x: rawMx[i].x,
                                        y: rawMx[i].y
                                    });
                                }
                            }

                            // set values to render
                            mapChartData.matrix = matrix;
                            mapChartData.points = undefined;
                            mapChartData.singlePoint = point;
                            chartOptions.inputmode = false; // already jammed, so let's not capture more

                            // replace old map with populated one
                            var mapParent = $(mapCanvas).parent();
                            var newMapCanvas = $(mapCanvas).clone(false, false);
                            $(mapCanvas).remove();
                            $(mapParent).append(newMapCanvas);
                            mapCanvas = newMapCanvas;
                            var ctx = newMapCanvas.get(0).getContext("2d");
                            var mapChart = new Chart(ctx);
                            mapChart.Map(mapChartData, chartOptions);
                        }
                    });
                }

                var wrapper = document.getElementById("canvasWrapper");
                if (wrapper) {
                    wrapper.removeAttribute('onmouseover');
                    wrapper.removeAttribute('onmouseout');
                }

                if (callback) {
                    callback(null, data);
                }
            }).fail(function (posterr) {
                if (callback) {
                    if (!posterr) {
                        posterr = {};
                    }
                    posterr.postData = postData;
                    callback(posterr, null);
                }
            });
        };


        // Setup the emotion map data e.g. labels

        $('.' + titleClass).empty();
        $('.' + titleClass).append(question.phrase);
        onBoarding.phrase = question.phrase;

        var mapChartData = {
            labels: {
                top: question.north,
                left: question.west,
                bottom: question.south,
                right: question.east
            },
            points: []
        };


        // Specify emotion map options

        var chartOptions = {
            responsive: false,
            showGrid: true,
            scaleFontColor: "#292e3d",
            scaleFontSize: 20,
            scaleFontFamily: "sans-serif",
            inputmode: true,
            inputOnce: true
        };

        if (postJams) {
            chartOptions.inputCallback = postJamHandler;
        }

        if (options) {
            if (options.background) {
                chartOptions.background = options.background;
            }
            if (options.singlePointColorRGB) {
                chartOptions.singlePointColorRGB = options.singlePointColorRGB;
            }
            if (options.mapColorRGB) {
                chartOptions.mapColorRGB = options.mapColorRGB;
            }
            if (options.lineColor) {
                chartOptions.lineColor = options.lineColor;
            }
        }

        // Initialize the emotion map

        var mapCanvas = $('.' + mapClass).get(0);

        // need to remove any previously existing map
        var mapParent = $(mapCanvas).parent();
        var newMapCanvas = $(mapCanvas).clone(false, false);
        $(mapCanvas).remove();
        $(mapParent).append(newMapCanvas);
        mapCanvas = newMapCanvas;
        var ctx = newMapCanvas.get(0).getContext("2d");
        var mapChart = new Chart(ctx);
        mapChart.Map(mapChartData, chartOptions);
        initOnBoarding(onBoarding);

    }).fail(function (loaderr) {
        if (callback) {
            callback(loaderr, null);
        }
    });
};

function initOnBoarding(onBoarding) {
    if (onBoarding.active && document.getElementsByClassName('onboarding-container').length == 0) {
        var canvas = $('.' + mapClass).get(0);

        var heading = document.createElement('h1');
        heading.setAttribute("id", "onBoardingText");
        heading.setAttribute('align', 'center');

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = "#onBoardingText {position: absolute; margin-top: 29px; margin-bottom: 29px; margin-left: 29px; margin-right: 29px; padding-left: 50px; border-right-width: 30px; padding-right: 50px; bottom: 0px; top: 0px; border-left-width: 40px;}" +
            "#canvasWrapper { height: 300px; width:300px; font-size: 50px; align: center; position: absolute; z-index: 1; margin: auto;} #sio-emotion-map { position: absolute; top: 0px; left: 0px; z-index: 3; }" +
            ".onboarding-container h1{ color:" + onBoarding.textColor + "; font-size:" + onBoarding.fontSize + "; " +
            "font-family:" + onBoarding.fontFamily + "; background-color:" + onBoarding.backgroundColor + "; " +
            "animation: fadeinout 7s ease-in infinite;-moz-animation: fadeinout 2s ease-in infinite; /* Firefox */webkitanimation: fadeinout 2s ease-in infinite; /* Safari and Chrome */-o-animation: fadeinout 2s ease-in infinite; /* Opera */}" +
            " @keyframes fadeinout { 0%,100% { opacity: 0; } 50% { opacity: 0.8; } } " +
            "@-moz-keyframes fadeinout { /* Firefox */ 0%,100% { opacity: 0; } 50% { opacity: 1; }}" +
            "@-webkit-keyframes fadeinout { /* Safari and Chrome */ 0%,100% { opacity: 0; } 50% { opacity: 1; }}" +
            "@-o-keyframes fadeinout { /* Opera */ 0%,100% { opacity: 0; } 50% { opacity: 1; }" + "";

        document.getElementsByTagName('head')[0].appendChild(style);
        var headingText = document.createTextNode(onBoarding.phrase);

        heading.appendChild(headingText);

        var parent = canvas.parentNode;
        var wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'canvasWrapper');

        wrapper.appendChild(heading);
        wrapper.className = 'onboarding-container';
        wrapper.onmouseover = function () {
            var onboarding = document.getElementById("onBoardingText");

            if (onboarding) {
                onboarding.remove();
            }
        };
        wrapper.onmouseout = function () {
            var wrapper = document.getElementById("canvasWrapper");

            var headingText = document.createTextNode(onBoarding.phrase);

            var heading = document.createElement('h1');
            heading.appendChild(headingText);
            heading.setAttribute("id", "onBoardingText");
            heading.setAttribute('align', 'center');
            wrapper.appendChild(heading);
        };

        parent.replaceChild(wrapper, canvas);
        wrapper.appendChild(canvas);
    }
}

Chart.Type.extend({
    name: "Map",
    defaults: {
        animationSteps: 60,
        responsive: true,
        background: "#fff",
        lineColor: "#bbb",
        mapColorRGB: "228,40,57",
        borderLeft: 30,
        borderRight: 30,
        borderTop: 30,
        borderBottom: 30,
        noBorder: false,
        noLabel: false,
        animate: false,
        inputmode: false,
        inputCallback: function (point) {
        },
        inputOnce: true,
        singlePointColorRGB: "228,40,57",
        opaquePoints: false,
        addSinglePointOnClick: false,
        showGrid: false,
        glowSteps: 20,
        glowInterval: 100,
        glowMax: 1,
        glowColorRGB: "255,0,0"
    },
    initialize: function (data) {

        this.chart.data = data;
        this.chart.currentGlowIndex = undefined;

        if (this.options.inputmode) {
            Chart.helpers.bindEvents(this, ["click"], function (e) {
                if (this.dimensions && !(this.options.inputOnce && this.chart.inputTriggered)) {
                    var pos = Chart.helpers.getRelativePosition(e);
                    var scaleX = this.chart.canvas.clientWidth / this.chart.canvas.width;
                    var scaleY = this.chart.canvas.clientHeight / this.chart.canvas.height;
                    var x = pos.x - (this.dimensions[0] * scaleX), y = pos.y - (this.dimensions[1] * scaleY);
                    var w = this.dimensions[2] * scaleX, h = this.dimensions[3] * scaleY;

                    if (x >= 0 && x <= w && y >= 0 && y <= h) {
                        var p = {
                            x: Math.min(9, Math.floor(x / (w / 10))),
                            y: Math.min(9, Math.floor(y / (h / 10)))
                        };
                        this.resetDrawMatrix();
                        if (this.options.addSinglePointOnClick) {
                            this.chart.dataToDraw.singlePoint = p;
                        } else {
                            this.addPoint(p);
                        }
                        this.render();
                        this.chart.inputTriggered = true;
                        if (this.options.inputCallback) {
                            this.options.inputCallback(p);
                        }
                    }
                }
            });
        }

        this.recalculateData();
        this.drawcounter = 0;
        this.render();
    },
    recalculateData: function () {
        var data = this.chart.data;
        if (data.points) {
            var calcLimit = data.calcLimit !== undefined ? data.calcLimit : data.points.length;
            this.resetDrawMatrix();
            if (this.options.animate) {
                this.options.animationSteps = data.points.length;
            } else {
                this.options.animationSteps = 1;
                var maxCalcLength = Math.min(data.points.length, Math.floor(calcLimit));
                for (var i = 0; i < maxCalcLength; i++) {
                    this.addPoint(data.points[i]);
                }
            }
        } else if (data.mapdata) {
            this.chart.dataToDraw = { max: 1, matrix: data.mapdata };
        }
        else if (data.matrix) {

            // calculate max element value (highest hit count)
            var flatMx = data.matrix.reduce(function (a, b) {
                return a.concat(b);
            }, []);
            var maxVal = Math.max.apply(null, flatMx);

            // set the data to draw
            this.chart.dataToDraw = { max: maxVal, matrix: data.matrix };
        }
    },
    resetDrawMatrix: function () {
        this.chart.dataToDraw = { max: 0, matrix: [] };
        for (var i = 0; i < 10; i++) {
            this.chart.dataToDraw.matrix[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    },
    addPoint: function (point) {
        var current = this.chart.dataToDraw.matrix[point.x][point.y];
        if (current) {
            current++;
        } else {
            current = 1;
        }
        this.chart.dataToDraw.max = Math.max(this.chart.dataToDraw.max, current);
        this.chart.dataToDraw.matrix[point.x][point.y] = current;
    },
    draw: function () {
        if (this.options.animate && this.chart.data.points && this.chart.data.points.length > this.drawcounter) {
            this.addPoint(this.chart.data.points[this.drawcounter]);
        }

        this.drawcounter++;

        var op = this.drawcounter / this.options.animationSteps;
        var ctx = this.chart.ctx;
        var data = this.chart.dataToDraw;

        // reset
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineWidth = "1";

        var x_offset = this.options.borderLeft, y_offset = this.options.borderTop,
            rightBorder = this.options.borderRight, bottomBorder = this.options.borderBottom;

        if (this.options.noBorder) {
            x_offset = y_offset = rightBorder = bottomBorder = 0;
        }

        var width = ctx.canvas.width - x_offset - rightBorder;
        var height = ctx.canvas.height - y_offset - bottomBorder;

        this.dimensions = [x_offset, y_offset, width, height];

        ctx.fillStyle = this.options.background;
        ctx.fillRect(x_offset, y_offset, width, height);


        var jamWidth = width / 10;
        var jamHeight = height / 10;
        if (data && data.matrix) {
            for (var i = 0; i < data.matrix.length; i++) {
                var element = data.matrix[i];
                for (var j = 0; j < element.length; j++) {
                    var jam = element[j] / data.max;
                    if (jam === 0) {
                        continue;
                    }
                    if (this.options.opaquePoints) {
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(x_offset + (jamWidth * i), y_offset + (jamHeight * j), jamWidth, jamHeight);
                    }
                    ctx.fillStyle = 'rgba(' + this.options.mapColorRGB + ',' + jam + ")";
                    ctx.fillRect(x_offset + (jamWidth * i), y_offset + (jamHeight * j), jamWidth, jamHeight);
                }
            }
        }

        if ((this.chart.data && this.chart.data.singlePoint) || (this.chart.dataToDraw && this.chart.dataToDraw.singlePoint)) {

            if (this.chart.data) {
                var sp = this.chart.data.singlePoint ? this.chart.data.singlePoint : this.chart.dataToDraw.singlePoint;
                if (sp) {
                    ctx.fillStyle = 'rgba(' + this.options.singlePointColorRGB + ",1)";
                    ctx.fillRect(x_offset + (jamWidth * sp.x), y_offset + (jamHeight * sp.y), jamWidth, jamHeight);
                }
            }
            else {
                var sp = this.chart.dataToDraw.singlePoint;
                if (sp) {
                    ctx.fillStyle = 'rgba(' + this.options.singlePointColorRGB + ",1)";
                    ctx.fillRect(x_offset + (jamWidth * sp.x), y_offset + (jamHeight * sp.y), jamWidth, jamHeight);
                }
            }

        }


        // grid
        if (this.options.showGrid) {
            ctx.strokeStyle = this.options.gridColor ? this.options.gridColor : this.options.lineColor;
            ctx.beginPath();

            for (var i = 1; i < 10; i++) {
                var x = x_offset + (width * 0.1 * i);
                ctx.moveTo(x, y_offset);
                ctx.lineTo(x, y_offset + height);
                var y = y_offset + (height * 0.1 * i);
                ctx.moveTo(x_offset, y);
                ctx.lineTo(x_offset + width, y);
            }

            ctx.stroke();
        }

        // coords
        ctx.beginPath();
        ctx.fillStyle = this.options.lineColor;
        ctx.strokeStyle = this.options.lineColor;
        var x = x_offset + width / 2;
        ctx.moveTo(x, y_offset);
        ctx.lineTo(x, y_offset + height);
        var y = y_offset + height / 2;
        ctx.moveTo(x_offset, y);
        ctx.lineTo(x_offset + width, y);

        ctx.rect(x_offset, y_offset, width, height);

        ctx.stroke();


        // labels
        if (!this.options.noLabel) {
            ctx.textAlign = "center";
            ctx.fillStyle = this.options.scaleFontColor;
            ctx.font = this.options.scaleFontStyle + " " + this.options.scaleFontSize + "px " + this.options.scaleFontFamily;
            ctx.fillText(this.chart.data.labels.top, x_offset + width / 2, 20);
            ctx.fillText(this.chart.data.labels.bottom, x_offset + width / 2, height + bottomBorder + this.options.scaleFontSize + 2);

            ctx.translate(0, ctx.canvas.height);
            ctx.rotate(-(90 * Math.PI / 180));
            ctx.fillText(this.chart.data.labels.left, bottomBorder + height / 2, 20);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(ctx.canvas.width, 0);
            ctx.rotate(90 * Math.PI / 180);
            ctx.fillText(this.chart.data.labels.right, bottomBorder + height / 2, 20);
        }

        // glow points
        if (this.chart.data && this.chart.data.glowPoints && this.chart.data.glowPoints.length > 0) {
            if (this.chart.currentGlowIndex === undefined) {
                this.chart.currentGlowIndex = this.options.glowSteps;
            } else {
                this.chart.currentGlowIndex--;
            }


            if (this.chart.currentGlowIndex > 0) {
                // reset
                var that = this;
                var ratio = (this.chart.currentGlowIndex / this.options.glowSteps) * this.options.glowMax;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.lineWidth = "" + (5 * ratio);
                var color = 'rgba(' + this.options.glowColorRGB + "," + ratio + ")";
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                for (var index = 0; index < this.chart.data.glowPoints.length; index++) {
                    var sp = this.chart.data.glowPoints[index];
                    ctx.fillRect(x_offset + (jamWidth * sp.x), y_offset + (jamHeight * sp.y), jamWidth, jamHeight);
                    ctx.beginPath();
                    ctx.rect(x_offset + (jamWidth * sp.x), y_offset + (jamHeight * sp.y), jamWidth, jamHeight);
                    ctx.stroke();
                }

                setTimeout(function () {
                    that.render();
                }, this.options.glowInterval);
            } else {
                this.chart.data.glowPoints = undefined;
                this.chart.currentGlowIndex = undefined;
            }
        }
    }
});
