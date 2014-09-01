/**
 * @author       Michał Skowronek (regis3) <skowronkow@gmail.com>
 * @twitter      @coderitual
 * @copyright    2014 coderitual
 */

/**
 * El Duel Library
 */

var ED = {};

/**
 * RequestAnimationFrame helper service
 * @param game
 * @constructor
 */

ED.RAF = function(game) {
    this.game = game;
    this.timeStep = 1/60;

    this._lastCall = null;
    this._accum = 0;
    this._onRAF = null;

    window.RAF = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
};

ED.RAF.prototype.start = function() {
    var self = this;

    this._onRAF = function() {
        self.update();
    };

    this._lastCall = Date.now();
    this._accum = 0;

    this.update();
};

ED.RAF.prototype.update = function() {
    if(!this.game.isRunning) {
        return;
    }

    var dt = this.timeStep * 1000;
    var delta = Date.now() - this._lastCall;

    this._lastCall = Date.now();
    this._accum += delta;

    // max accumulator to avoid spiral of death
    if(this._accum > 200) {
        this._accum = 200;
    }

    while (this._accum >= dt) {
        this.game.update();
        this._accum -= dt;
    }

    var alpha = this._accum / dt;
    this.game.render(alpha);

    window.RAF(this._onRAF);
};

/**
 * Webgl graphics device manager
 * @param game
 * @constructor
 */
ED.GDM = function(game) {
    this.game = game;
};

ED.GDM.prototype.boot = function() {

    this.gl = null;
    var canvas = this.game.canvas;

    try {
        this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    if (!this.gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        this.gl = null;
    }

    this.gl.viewport(0, 0, canvas.width, canvas.height);
};

/**
 * Input manager class
 * @param game
 * @constructor
 */

ED.Input = function(game) {
    this.game = game;
    this.keyboard = null;
    this.mouse = null;
};

ED.Input.prototype.boot = function() {

    this.keyboard = new ED.Keyboard(this.game);
    this.mouse = new ED.Mouse(this.game);

    this.keyboard.start();
    this.mouse.start();
};

/**
 * Mouse manager class
 * @param game
 * @constructor
 */
ED.Mouse = function(game) {
    this.game = game;
};

ED.Mouse.prototype.start = function() {
    var self = this;

    this._onMouseDown = function (event) {
        return self.processMouseDown(event);
    };

    this._onMouseMove = function (event) {
        return self.processMouseMove(event);
    };

    this._onMouseUp = function (event) {
        return self.processMouseUp(event);
    };

    this.game.canvas.addEventListener('mousedown', this._onMouseDown, true);
    this.game.canvas.addEventListener('mousemove', this._onMouseMove, true);
    this.game.canvas.addEventListener('mouseup', this._onMouseUp, true);
};

ED.Mouse.prototype.processMouseDown = function(event) {

};

ED.Mouse.prototype.processMouseMove = function(event) {

};

ED.Mouse.prototype.processMouseUp = function(event) {

};

/**
 * Keyboard manager class
 * @param game
 * @constructor
 */
ED.Keyboard = function(game) {
    this.game = game;
    this._keys = [];
};

ED.Keyboard.prototype.start = function() {
    var self = this;

    this._onKeyDown = function (event) {
        return self.processKeyDown(event);
    };

    this._onKeyUp = function (event) {
        return self.processKeyUp(event);
    };

    var keysCount = ED.Keys.MAX;
    while(keysCount--) this._keys.push(false);

    window.addEventListener('keydown', this._onKeyDown, false);
    window.addEventListener('keyup', this._onKeyUp, false);
};

ED.Keyboard.prototype.key = function(keycode) {
    return this._keys[keycode]
};

ED.Keyboard.prototype.processKeyDown = function(event) {
    this._keys[event.keyCode] = true;
};

ED.Keyboard.prototype.processKeyUp = function(event) {
    this._keys[event.keyCode] = false;
};

ED.Keys = {};
ED.Keys.MAX = 256;

ED.Keys.KEY_A = 65;
ED.Keys.KEY_B = 66;
ED.Keys.KEY_C = 67;
ED.Keys.KEY_D = 68;
ED.Keys.KEY_E = 69;
ED.Keys.KEY_F = 70;
ED.Keys.KEY_G = 71;
ED.Keys.KEY_H = 72;
ED.Keys.KEY_I = 73;
ED.Keys.KEY_J = 74;
ED.Keys.KEY_K = 75;
ED.Keys.KEY_L = 76;
ED.Keys.KEY_M = 77;
ED.Keys.KEY_N = 78;
ED.Keys.KEY_O = 79;
ED.Keys.KEY_P = 80;
ED.Keys.KEY_Q = 81;
ED.Keys.KEY_R = 82;
ED.Keys.KEY_S = 83;
ED.Keys.KEY_T = 84;
ED.Keys.KEY_U = 85;
ED.Keys.KEY_V = 86;
ED.Keys.KEY_W = 87;
ED.Keys.KEY_X = 88;
ED.Keys.KEY_Y = 89;
ED.Keys.KEY_Z = 90;
ED.Keys.KEY_ZERO = 48;
ED.Keys.KEY_ONE = 49;
ED.Keys.KEY_TWO = 50;
ED.Keys.KEY_THREE = 51;
ED.Keys.KEY_FOUR = 52;
ED.Keys.KEY_FIVE = 53;
ED.Keys.KEY_SIX = 54;
ED.Keys.KEY_SEVEN =55;
ED.Keys.KEY_EIGHT = 56;
ED.Keys.KEY_NINE = 57;
ED.Keys.KEY_NUMPAD_0 = 96;
ED.Keys.KEY_NUMPAD_1 = 97;
ED.Keys.KEY_NUMPAD_2 = 98;
ED.Keys.KEY_NUMPAD_3 = 99;
ED.Keys.KEY_NUMPAD_4 = 100;
ED.Keys.KEY_NUMPAD_5 = 101;
ED.Keys.KEY_NUMPAD_6 = 102;
ED.Keys.KEY_NUMPAD_7 = 103;
ED.Keys.KEY_NUMPAD_8 = 104;
ED.Keys.KEY_NUMPAD_9 = 105;
ED.Keys.KEY_NUMPAD_MULTIPLY = 106;
ED.Keys.KEY_NUMPAD_ADD = 107;
ED.Keys.KEY_NUMPAD_ENTER = 108;
ED.Keys.KEY_NUMPAD_SUBTRACT = 109;
ED.Keys.KEY_NUMPAD_DECIMAL = 110;
ED.Keys.KEY_NUMPAD_DIVIDE = 111;
ED.Keys.KEY_F1 = 112;
ED.Keys.KEY_F2 = 113;
ED.Keys.KEY_F3 = 114;
ED.Keys.KEY_F4 = 115;
ED.Keys.KEY_F5 = 116;
ED.Keys.KEY_F6 = 117;
ED.Keys.KEY_F7 = 118;
ED.Keys.KEY_F8 = 119;
ED.Keys.KEY_F9 = 120;
ED.Keys.KEY_F10 = 121;
ED.Keys.KEY_F11 = 122;
ED.Keys.KEY_F12 = 123;
ED.Keys.KEY_F13 = 124;
ED.Keys.KEY_F14 = 125;
ED.Keys.KEY_F15 = 126;
ED.Keys.KEY_COLON = 186;
ED.Keys.KEY_EQUALS = 187;
ED.Keys.KEY_UNDERSCORE = 189;
ED.Keys.KEY_QUESTION_MARK = 191;
ED.Keys.KEY_TILDE = 192;
ED.Keys.KEY_OPEN_BRACKET = 219;
ED.Keys.KEY_BACKWARD_SLASH = 220;
ED.Keys.KEY_CLOSED_BRACKET = 221;
ED.Keys.KEY_QUOTES = 222;
ED.Keys.KEY_BACKSPACE = 8;
ED.Keys.KEY_TAB = 9;
ED.Keys.KEY_CLEAR = 12;
ED.Keys.KEY_ENTER = 13;
ED.Keys.KEY_SHIFT = 16;
ED.Keys.KEY_CONTROL = 17;
ED.Keys.KEY_ALT = 18;
ED.Keys.KEY_CAPS_LOCK = 20;
ED.Keys.KEY_ESC = 27;
ED.Keys.KEY_SPACEBAR = 32;
ED.Keys.KEY_PAGE_UP = 33;
ED.Keys.KEY_PAGE_DOWN = 34;
ED.Keys.KEY_END = 35;
ED.Keys.KEY_HOME = 36;
ED.Keys.KEY_LEFT = 37;
ED.Keys.KEY_UP = 38;
ED.Keys.KEY_RIGHT = 39;
ED.Keys.KEY_DOWN = 40;
ED.Keys.KEY_INSERT = 45;
ED.Keys.KEY_DELETE = 46;
ED.Keys.KEY_HELP = 47;
ED.Keys.KEY_NUM_LOCK = 144;

/**
 * State manager
 * @param game
 * @constructor
 */
ED.StateManager = function(game) {
    this.game = game;
    this.states = {};
    this.current = '';

    this._pending = '';
    this._state = null;
};

ED.StateManager.prototype.add = function(key, state) {
    this.states[key] = state;
    this.states[key].game = this.game;
};

ED.StateManager.prototype.set = function(key) {
    var state = this.states[key],
        methods = ['update', 'render', 'load', 'unload'],
        valid = false;

    if(state) {
        valid = true;
        for(var i = 0; i < methods.length; i++) {
            if(!state[methods[i]]) valid = false;
        }
    }

    if(!valid) {
        console.warning('[StateManager:setState] state not valid (' + key + ')');
        return;
    }

    this._pending = key;
};

ED.StateManager.prototype.update = function() {

    if(this._pending) {

        if(this._state) this._state.unload(this._pending);
        this._state = this.states[this._pending];
        this._state.load(this.current);
        this.current = this._pending;
        this._pending = '';
    }

    if(this._state) {
        this._state.update();
    }
};

ED.StateManager.prototype.render = function(alpha) {

    if(this._state) {
        this._state.render(alpha);
    }
};

/***
 * Main game class
 * @param width
 * @param height
 * @param parentId
 * @constructor
 */
ED.Game = function(width, height, parentId) {
    this.isRunning = false;

    this.width = width;
    this.height = height;

    this.parentId = parentId;

    this.parent = null;
    this.canvas = null;
    this.raf = null;
    this.graphics = null;
    this.input = null;

    this.state = new ED.StateManager(this);

    var self = this;
    this._onBoot = function() {
        self.boot();
    };

    window.addEventListener('load', this._onBoot, false);
};

ED.Game.prototype.update = function() {
    this.state.update();
};

ED.Game.prototype.render = function(alpha) {
    this.state.render(alpha);
};

ED.Game.prototype.boot = function() {

    if(this.isRunning) {
        return;
    }

    window.removeEventListener('load', this._onBoot);

    // create canvas element
    this.parent = document.getElementById(this.parentId);
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.parent.appendChild(this.canvas);

    // game core services
    this.graphics = new ED.GDM(this);
    this.input = new ED.Input(this);

    // booting
    this.graphics.boot();
    this.input.boot();

    // ready start
    this.isRunning = true;
    this.raf = new ED.RAF(this);
    this.raf.start();
};

/**
 * Polygon utilities
 * @type {{}}
 */

ED.GDM.Poly = {};

/**
 * Triangulation (Thanks to IvanK and Mat Groves )
 * @param p
 * @returns {Array}
 * @constructor
 */
ED.GDM.Poly.Triangulate = function(p) {
    var sign = true;

    var n = p.length >> 1;
    if(n < 3) return [];

    var tgs = [];
    var avl = [];
    for(var i = 0; i < n; i++) avl.push(i);

    i = 0;
    var al = n;
    while(al > 3) {
        var i0 = avl[(i+0)%al];
        var i1 = avl[(i+1)%al];
        var i2 = avl[(i+2)%al];

        var ax = p[2*i0],  ay = p[2*i0+1];
        var bx = p[2*i1],  by = p[2*i1+1];
        var cx = p[2*i2],  cy = p[2*i2+1];

        var earFound = false;
        if(ED.GDM.Poly._convex(ax, ay, bx, by, cx, cy, sign)) {
            earFound = true;
            for(var j = 0; j < al; j++) {
                var vi = avl[j];
                if(vi === i0 || vi === i1 || vi === i2) continue;

                if(ED.GDM.Poly._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {
                    earFound = false;
                    break;
                }
            }
        }

        if(earFound) {
            tgs.push(i0, i1, i2);
            avl.splice((i+1)%al, 1);
            al--;
            i = 0;
        }
        else if(i++ > 3*al) {
            // need to flip flip reverse it!
            // reset!
            if(sign) {
                tgs = [];
                avl = [];
                for(i = 0; i < n; i++) avl.push(i);

                i = 0;
                al = n;

                sign = false;
            }
            else {
                // too complex
                return [];
            }
        }
    }

    tgs.push(avl[0], avl[1], avl[2]);
    return tgs;
};

ED.GDM.Poly._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy) {
    var v0x = cx-ax;
    var v0y = cy-ay;
    var v1x = bx-ax;
    var v1y = by-ay;
    var v2x = px-ax;
    var v2y = py-ay;

    var dot00 = v0x*v0x+v0y*v0y;
    var dot01 = v0x*v1x+v0y*v1y;
    var dot02 = v0x*v2x+v0y*v2y;
    var dot11 = v1x*v1x+v1y*v1y;
    var dot12 = v1x*v2x+v1y*v2y;

    var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);
};

ED.GDM.Poly._convex = function(ax, ay, bx, by, cx, cy, sign) {
    return ((ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0) === sign;
};

/**
 * Game
 */

(function() {
    'use strict';

    var game = new ED.Game(960, 600, 'c');

    var main = {

        load: function() {

            // shortcuts
            this.keyboard = this.game.input.keyboard;
        },

        unload: function() {

        },

        update: function() {
            if(this.keyboard.key(ED.Keys.KEY_A)) {

            }
        },

        render: function() {

        }
    };

    game.state.add('main', main);
    game.state.set('main');
})();