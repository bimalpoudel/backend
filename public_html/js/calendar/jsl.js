(function () {
    window.JSL = {
        "_getUserArgs": function (arguments) {
            var user_args = [];
            for (var i = 1; i < arguments.length; i++) {
                user_args.push(arguments[i])
            }
            return user_args
        }, "_makeFunc": function (func, args) {
            if (typeof func == "string") {
                func = eval("false||function(" + args + "){return " + func + "}")
            }
            return func
        }
    }
})();
var jslib = function () {
    if (typeof arguments[0] == "number") {
        return JSL.number.apply(this, arguments)
    }
    else {
        if (typeof arguments[0] == "object") {
            if (typeof arguments[0].parentNode != "undefined" || (typeof arguments[0].parent != "undefined" && typeof arguments[0].document != "undefined")) {
                return JSL.dom.apply(this, arguments)
            }
            else {
                if (arguments.length == 1 && (typeof arguments[0].target != "undefined" || typeof arguments[0].srcElement != "undefined")) {
                    return JSL.event.apply(this, arguments)
                }
            }
            return JSL.array.apply(this, arguments)
        }
        else {
            return JSL.dom.apply(this, arguments)
        }
    }
};
if (typeof $ != "undefined") {
    $_ = $
}
$ = jslib;
(function () {
    function A(B) {
        this.array = B;
        return this
    }

    A.prototype = {
        "map": function () {
            var F = arguments[0];
            F = JSL._makeFunc(F, "ele,i,all");
            var G = JSL._getUserArgs(arguments);
            var D = this.isList();
            var B = (D) ? [] : {};

            function E(J, K, H) {
                var I = F.apply(this, [this.array[J], J, this.array].concat(K));
                if (I != undefined) {
                    if (D) {
                        H.push(I)
                    }
                    else {
                        H[J] = I
                    }
                }
                return H
            }

            if (D) {
                array_length = this.array.length;
                for (var C = 0; C < array_length; C++) {
                    B = E.apply(this, [C, G, B])
                }
            }
            else {
                for (var C in this.array) {
                    if (this.array.hasOwnProperty && !this.array.hasOwnProperty(C)) {
                        continue
                    }
                    B = E.apply(this, [C, G, B])
                }
            }
            this.array = B;
            return this
        }, "each": function () {
            var F = arguments[0];
            F = JSL._makeFunc(F, "ele,i,all");
            var E = this.isList();
            var G = JSL._getUserArgs(arguments);
            if (E) {
                var C = this.array.length;
                for (var D = 0; D < C; D++) {
                    var B = F.apply(this, [this.array[D], D, this.array].concat(G));
                    if (B != undefined) {
                        return B
                    }
                }
            }
            else {
                for (var D in this.array) {
                    if (this.array.hasOwnProperty && !this.array.hasOwnProperty(D)) {
                        continue
                    }
                    var B = F.apply(this, [this.array[D], D, this.array].concat(G));
                    if (B != undefined) {
                        return B
                    }
                }
            }
        }, "filter": function () {
            var B = arguments[0];
            B = JSL._makeFunc(B, "ele,i,all");
            var C = JSL._getUserArgs(arguments);
            this.map.apply(this, [function (F, E, D, G) {
                if (B(F, E, D, G)) {
                    return F
                }
            }, C]);
            return this
        }, "indexOf": function (C) {
            var B = this.each(function (E, D) {
                if (E == C) {
                    return D
                }
            });
            if (B != undefined) {
                return B
            }
            return -1
        }, "reduce": function (E, F) {
            var B = this.array.length;
            E = JSL._makeFunc(E, "a,b");
            if (B == 0 && arguments.length == 1) {
                throw new TypeError()
            }
            var D = 0;
            if (arguments.length >= 2) {
                var C = arguments[1]
            }
            else {
                do {
                    if (D in this.array) {
                        C = this.array[D++];
                        break
                    }
                    if (++D >= B) {
                        throw new TypeError()
                    }
                } while (true)
            }
            for (; D < B; D++) {
                if (D in this.array) {
                    C = E.call(null, C, this.array[D], D, this.array)
                }
            }
            return C
        }, "grep": function (B) {
            return this.filter(function (C) {
                return C.match(B)
            })
        }, "getSize": function () {
            return this.array.length
        }, "get": function () {
            return this.array
        }, "isList": function () {
            var B = this.array;
            return (B && (B.propertyIsEnumerable && !(B.propertyIsEnumerable("length"))) && typeof B === "object" && typeof B.length === "number")
        }
    };
    window.JSL["array"] = function () {
        var B = arguments;
        if (arguments.length == 1) {
            B = arguments[0]
        }
        return new A(B)
    }
})();
(function () {
    function A(B) {
        var F = [];
        for (var D = 0, K = B.length; D < K; D++) {
            var H = B[D];
            var C;
            if (typeof H == "string") {
                this.selector[D] = H;
                C = this._select(H)
            }
            else {
                C = H
            }
            F = F.concat(C)
        }
        var G = F.length;
        this.nodes = JSL.array(F);
        if (B.length == 1 && G == 1) {
            var E = this._getType(B[0]);
            if (E == "node" || E == "id") {
                var J = F[0];
                for (var D in this) {
                    if (J[D]) {
                        J["_" + D] = J[D]
                    }
                    J[D] = this[D]
                }
                J.single = F[0];
                return J
            }
        }
        else {
            if (B.length == 1 && G == 0) {
                var E = this._getType(B[0]);
                if (E == "node" || E == "id") {
                    var I = {"return_null": true};
                    return I
                }
            }
        }
        for (var D in this.nodes) {
            this[D] = this.nodes[D]
        }
        return this
    }

    A.prototype = {
        "selector": [],
        "nodes": [],
        "single": false,
        "valid_tags": ["a", "abbr", "acronym", "address", "applet", "area", "b", "base", "basefont", "bdo", "big", "blockquote", "body", "br", "button", "caption", "center", "cite", "code", "col", "colgroup", "dd", "del", "dir", "div", "dfn", "dl", "dt", "em", "fieldset", "font", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "hr", "html", "i", "iframe", "img", "input", "ins", "isindex", "kbd", "label", "legend", "li", "link", "map", "menu", "meta", "noframes", "noscript", "object", "ol", "optgroup", "option", "p", "param", "pre", "q", "s", "samp", "script", "select", "small", "span", "strike", "strong", "style", "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "title", "tr", "tt", "u", "ul", "var"],
        "addClass": function (C) {
            var B = this;
            this.nodes.each(function (D) {
                B._class._add(D, C)
            });
            return this
        },
        "removeClass": function (C) {
            var B = this;
            this.nodes.each(function (D) {
                B._class._remove(D, C)
            });
            return this
        },
        "hasClass": function (B) {
            return this._class._has(this.single, B)
        },
        "getPosition": function () {
            var C = this.nodes.array[0];
            var B = topy = 0;
            if (C.offsetParent) {
                B = C.offsetLeft;
                topy = C.offsetTop;
                while (C = C.offsetParent) {
                    B += C.offsetLeft;
                    topy += C.offsetTop
                }
            }
            return {"left": B, "x": B, "top": topy, "y": topy}
        },
        "getStyle": function (E) {
            var D = this.nodes.array[0];
            if (D.currentStyle) {
                var B = E.replace(/\-(\w)/g, function (F, G) {
                    return G.toUpperCase()
                });
                var C = D.currentStyle[E] || D.currentStyle[B]
            }
            else {
                if (window.getComputedStyle) {
                    E = E.replace(/([A-Z])/g, "-$1").toLowerCase();
                    var C = document.defaultView.getComputedStyle(D, null).getPropertyValue(E)
                }
            }
            if (E == "opacity" && D.filter) {
                C = (parseFloat(D.filter.match(/opacity\=([^)]*)/)[1]) / 100)
            }
            else {
                if (E == "width" && isNaN(C)) {
                    C = D.clientWidth || D.offsetWidth
                }
                else {
                    if (E == "height" && isNaN(C)) {
                        C = D.clientHeight || D.offsetHeight
                    }
                }
            }
            if (typeof C == "string" && C.match(/^\d+px$/)) {
                C = Number(C.replace(/px/, ""))
            }
            return C
        },
        "setStyle": function (C, B) {
            var D = {};
            if (typeof C === "string") {
                D[C] = B
            }
            else {
                D = C
            }
            this.nodes.each(function (E) {
                JSL.array(D).each(function (J, I, F, H) {
                    I = I.replace(/\-(\w)/g, function (K, L) {
                        return L.toUpperCase()
                    });
                    if (J && J.constructor == Number) {
                        var G = JSL.array(["zIndex", "fontWeight", "opacity", "zoom", "lineHeight"]);
                        if (G.indexOf(I) == -1 && J.indexOf("px") == -1) {
                            J += "px"
                        }
                    }
                    if (I == "opacity") {
                        H.style.opacity = J;
                        H.style.filter = "alpha(opacity=" + J + ")"
                    }
                    else {
                        H.style[I] = J
                    }
                }, E)
            });
            return this
        },
        "show": function (B) {
            this.nodes.each(function (C) {
                if (B === "visible") {
                    C.style.visibility = "visible"
                }
                else {
                    if (B === "inline") {
                        C.style.display = "inline"
                    }
                    else {
                        C.style.display = "block"
                    }
                }
            });
            return this
        },
        "hide": function (B) {
            this.nodes.each(function (C) {
                if (B === "hidden") {
                    C.style.visibility = "hidden"
                }
                else {
                    C.style.display = "none"
                }
            });
            return this
        },
        "toggle": function () {
            this.nodes.each(function (B) {
                if (B.style.display != "block") {
                    B.style.display = "block"
                }
                else {
                    B.style.display = "none"
                }
            });
            return this
        },
        "toogle": function () {
            this.toggle.apply(this, arguments);
            return this
        },
        "on": function (C, B) {
            this.nodes.each(function (D) {
                JSL.event().add(D, C, B)
            });
            return this
        },
        "click": function (B) {
            return this.on("click", B)
        },
        "load": function (B) {
            return this.on("load", B)
        },
        "_select": function (B) {
            var D = this._getType(B);
            if (D === "id") {
                var L = document.getElementById(B.replace("#", ""));
                if (L) {
                    return [L]
                }
                else {
                    return []
                }
            }
            var R = [];
            if (!document.getElementsByTagName) {
                return R
            }
            B = B.replace(/\s*([^\w\.\#])\s*/g, "$1");
            var E = B.split(",");
            var M = function (i, f) {
                if (!f) {
                    f = "*"
                }
                var j = [];
                for (var g = 0, e = i.length; con = i[g], g < e; g++) {
                    var d;
                    if (f == "*") {
                        d = (con.all) ? con.all : con.getElementsByTagName("*")
                    }
                    else {
                        d = con.getElementsByTagName(f)
                    }
                    for (var c = 0, h = d.length; c < h; c++) {
                        j.push(d[c])
                    }
                }
                return j
            };
            COMMA:for (var Y = 0, J = E.length; selector = E[Y], Y < J; Y++) {
                var C = new Array(document);
                var O = selector.split(" ");
                for (var X = 0, I = O.length; element = O[X], X < I; X++) {
                    var H = element.indexOf("[");
                    var F = element.indexOf("]");
                    var G = element.indexOf("#");
                    if (G + 1 && !(G > H && G < F)) {
                        var S = element.split("#");
                        var b = S[0];
                        var P = S[1];
                        var L = document.getElementById(P);
                        if (!L || (b && L.nodeName.toLowerCase() != b)) {
                            continue COMMA
                        }
                        C = new Array(L);
                        continue;
                    }
                    G = element.indexOf(".");
                    if (G + 1 && !(G > H && G < F)) {
                        var S = element.split(".");
                        var b = S[0];
                        var W = S[1];
                        var N = M(C, b);
                        C = [];
                        for (var V = 0, a = N.length; fnd = N[V], V < a; V++) {
                            if (fnd.className && fnd.className.match(new RegExp("(^|\\s)" + W + "(\\s|$)"))) {
                                C.push(fnd)
                            }
                        }
                        continue;
                    }
                    if (element.indexOf("[") + 1) {
                        if (element.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?['"]?([^\]'"]*)['"]?\]$/)) {
                            var b = RegExp.$1;
                            var U = RegExp.$2;
                            var K = RegExp.$3;
                            var T = RegExp.$4
                        }
                        var N = M(C, b);
                        C = [];
                        for (var V = 0, a = N.length; fnd = N[V], V < a; V++) {
                            if (U === "class") {
                                var Z = fnd.className
                            }
                            else {
                                var Z = fnd.getAttribute(U)
                            }
                            if (Z) {
                                if (K == "=" && Z != T) {
                                    continue
                                }
                                else {
                                    if (K == "~" && !Z.match(new RegExp("(^|\\s)" + T + "(\\s|$)"))) {
                                        continue
                                    }
                                    else {
                                        if (K == "|" && !Z.match(new RegExp("^" + T + "-?"))) {
                                            continue
                                        }
                                        else {
                                            if (K == "^" && Z.indexOf(T) != 0) {
                                                continue
                                            }
                                            else {
                                                if (K == "$" && Z.lastIndexOf(T) != (Z.length - T.length)) {
                                                    continue
                                                }
                                                else {
                                                    if (K == "*" && !(Z.indexOf(T) + 1)) {
                                                        continue
                                                    }
                                                    else {
                                                        if (!Z) {
                                                            continue
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                C.push(fnd)
                            }
                        }
                        continue;
                    }
                    var N = M(C, element);
                    C = N
                }
                for (var Q = 0, a = C.length; Q < a; Q++) {
                    R.push(C[Q])
                }
            }
            return R
        },
        "get": function () {
            if (this.single) {
                return this.single
            }
            else {
                return this.nodes.get()
            }
        },
        "_class": {
            "_add": function (C, B) {
                if (!this._has(C, B)) {
                    C.className += " " + B
                }
            }, "_has": function (C, B) {
                return C.className.match(new RegExp("(\\s|^)" + B + "(\\s|$)"))
            }, "_remove": function (D, B) {
                if (this._has(D, B)) {
                    var C = new RegExp("(\\s|^)" + B + "(\\s|$)");
                    D.className = D.className.replace(C, " ")
                }
            }
        },
        "_getType": function (B) {
            if (typeof B == "string") {
                if (B.indexOf("#") > 0 || B.indexOf(".") + 1 || B.indexOf(" ") + 1 || B.indexOf(",") + 1 || B.indexOf("[") + 1 || B.indexOf("*") + 1) {
                    return "css"
                }
                else {
                    if (JSL.array(this.valid_tags).indexOf(B) + 1) {
                        return "tag"
                    }
                    else {
                        return "id"
                    }
                }
            }
            else {
                return "node"
            }
        }
    };
    window.JSL["dom"] = function () {
        var B = new A(arguments);
        if (B.return_null) {
            return null
        }
        return B
    }
})();
(function () {
    function A(B) {
        this.event = B || window.event;
        return this
    }

    A.prototype = {
        "add": function (F, D, E, C) {
            function B(H) {
                var G = JSL.event(H).getTarget() || document;
                E.call(G, H)
            }

            C = C || true;
            if (F.attachEvent) {
                return F.attachEvent("on" + D, B)
            }
            else {
                if (F.addEventListener) {
                    F.addEventListener(D, B, C);
                    return true
                }
                else {
                    F["on" + D] = B
                }
            }
        }, "stop": function () {
            var B = this.event;
            B.cancelBubble = true;
            B.returnValue = false;
            if (B.stopPropagation) {
                B.stopPropagation()
            }
            if (B.preventDefault) {
                B.preventDefault()
            }
            return false
        }, "getTarget": function () {
            var B;
            var C = this.event;
            if (C.target) {
                B = C.target
            }
            else {
                if (C.srcElement) {
                    B = C.srcElement
                }
            }
            if (B && B.nodeType == 3) {
                B = B.parentNode
            }
            return B
        }
    };
    window.JSL["event"] = function (B) {
        return new A(B)
    }
})();
(function () {
    function A(B) {
        this.number = B;
        return this
    }

    A.prototype = {
        "times": function (C) {
            var C = JSL._makeFunc(C, "i");
            for (var B = 0; B < this.number; B++) {
                C.call(this, B)
            }
        }, "upto": function (B, D) {
            var D = JSL._makeFunc(D, "i");
            for (var C = this.number; C <= B; C++) {
                D.call(this, C)
            }
        }, "round": function (E) {
            if (!E) {
                return Math.round(this.number)
            }
            if (this.number == 0) {
                var B = "";
                for (var D = 0; D < E; D++) {
                    B += "0"
                }
                return "0." + B
            }
            var F = Math.pow(10, E);
            var C = Math.round((this.number * F)).toString();
            return Number(C.slice(0, -1 * E) + "." + C.slice(-1 * E))
        }, "random": function (B, C) {
            if (typeof B == "undefined") {
                B = 100
            }
            if (typeof C == "undefined") {
                C = 0
            }
            return Math.floor(Math.random() * (B - C + 1)) + C
        }
    };
    window.JSL["number"] = function (B) {
        return new A(B)
    }
})();
(function () {
    function _ajax_init(url) {
        this.url = url;
        this._init();
        if (!url) {
            return false
        }
        return this
    }

    _ajax_init.prototype = {
        "http": false,
        "format": "text",
        "callback": false,
        "handler": false,
        "error": false,
        "opt": {},
        "_getHTTPObject": function () {
            var http = false;
            if (typeof ActiveXObject != "undefined") {
                try {
                    http = new ActiveXObject("Msxml2.XMLHTTP")
                }
                catch (e) {
                    try {
                        http = new ActiveXObject("Microsoft.XMLHTTP")
                    }
                    catch (E) {
                        http = false
                    }
                }
            }
            else {
                if (XMLHttpRequest) {
                    try {
                        http = new XMLHttpRequest()
                    }
                    catch (e) {
                        http = false
                    }
                }
            }
            return http
        },
        "load": function (callback, format, method) {
            this._init();
            var url = this.url;
            if (!this.http || !url) {
                return
            }
            if (this.http.overrideMimeType) {
                this.http.overrideMimeType("text/xml")
            }
            this.callback = callback;
            method = method || "GET";
            format = format || "text";
            this.format = format.toLowerCase();
            method = method.toUpperCase();
            var ths = this;
            var now = "uid=" + new Date().getTime();
            url += (url.indexOf("?") + 1) ? "&" : "?";
            url += now;
            var parameters = null;
            if (method == "POST") {
                var parts = url.split("?");
                url = parts[0];
                parameters = parts[1]
            }
            this.http.open(method, url, true);
            if (method == "POST") {
                this.http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                this.http.setRequestHeader("Content-length", parameters.length);
                this.http.setRequestHeader("Connection", "close")
            }
            if (this.handler) {
                this.http.onreadystatechange = this.handler
            }
            else {
                this.http.onreadystatechange = function () {
                    if (!ths) {
                        return
                    }
                    var http = ths.http;
                    if (http.readyState == 4) {
                        if (http.status == 200) {
                            var result = "";
                            if (http.responseText) {
                                result = http.responseText
                            }
                            if (ths.format.charAt(0) == "j") {
                                result = result.replace(/[\n\r]/g, "");
                                result = eval("(" + result + ")")
                            }
                            else {
                                if (ths.format.charAt(0) == "x") {
                                    result = http.responseXML
                                }
                            }
                            if (ths.callback) {
                                ths.callback(result)
                            }
                        }
                        else {
                            if (ths.opt.loading_text) {
                                document.getElementsByTagName("body")[0].removeChild(ths.opt.loading_text)
                            }
                            if (ths.opt.loading_indicator && document.getElementById(ths.opt.loading_indicator)) {
                                document.getElementById(ths.opt.loading_indicator).style.display = "none"
                            }
                            if (ths.error) {
                                ths.error(http.status)
                            }
                        }
                    }
                }
            }
            this.http.send(parameters)
        },
        "bind": function (user_options) {
            var opt = {
                "onSuccess": false,
                "onError": false,
                "format": "text",
                "method": "GET",
                "update": "",
                "loading_indicator": "",
                "loading_text": ""
            };
            for (var key in opt) {
                if (user_options[key]) {
                    opt[key] = user_options[key]
                }
            }
            this.opt = opt;
            opt.url = this.url;
            if (opt.onError) {
                this.error = opt.onError
            }
            var div = false;
            if (opt.loading_text) {
                if (opt.loading_indicator) {
                    div = document.getElementById(opt.loading_indicator)
                }
                else {
                    div = document.createElement("div");
                    div.setAttribute("style", "position:absolute;top:0px;left:0px;");
                    div.setAttribute("class", "loading-indicator");
                    document.getElementsByTagName("body")[0].appendChild(div)
                }
                div.innerHTML = opt.loading_text;
                opt.loading_text = div
            }
            if (opt.loading_indicator) {
                document.getElementById(opt.loading_indicator).style.display = "block"
            }
            this.load(function (data) {
                if (opt.update) {
                    document.getElementById(opt.update).innerHTML = data
                }
                if (div && !opt.loading_indicator) {
                    document.getElementsByTagName("body")[0].removeChild(div)
                }
                if (opt.loading_indicator) {
                    document.getElementById(opt.loading_indicator).style.display = "none"
                }
                if (opt.onSuccess) {
                    opt.onSuccess(data)
                }
            }, opt.format, opt.method)
        },
        "_init": function () {
            this.http = this._getHTTPObject()
        }
    };
    window.JSL["ajax"] = function (url) {
        return new _ajax_init(url)
    }
})();