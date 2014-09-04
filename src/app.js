/**
 * @author       Michał Skowronek (regis3) <skowronkow@gmail.com>
 * @twitter      @coderitual
 * @copyright    2014 coderitual
 */

/**
 * El Duel Library
 */

var EL = {};

/**
 * RequestAnimationFrame helper service
 * @param game
 * @constructor
 */

EL.RAF = function(game) {
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

EL.RAF.prototype.start = function() {
    var self = this;

    this._onRAF = function() {
        self.update();
    };

    this._lastCall = Date.now();
    this._accum = 0;

    this.update();
};

EL.RAF.prototype.update = function() {
    if(!this.game.isRunning) {
        return;
    }

    var dt = this.timeStep * 1000;
    var delta = Date.now() - this._lastCall;

    this._lastCall = Date.now();
    this._accum += delta;

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
EL.Graphics = function(game) {
    this.game = game;
};

EL.Graphics.prototype.boot = function() {

    this.gl = null;
    var canvas = this.game.canvas;

    try {
        this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    if (!this.gl) {
        console.warn("Unable to initialize WebGL. Your browser may not support it.");
        this.gl = null;
    }

    this.gl.viewport(0, 0, canvas.width, canvas.height);
};

/**
 * Input manager class
 * @param game
 * @constructor
 */

EL.Input = function(game) {
    this.game = game;
    this.keyboard = null;
    this.mouse = null;
};

EL.Input.prototype.boot = function() {

    this.keyboard = new EL.Keyboard(this.game);
    this.mouse = new EL.Mouse(this.game);

    this.keyboard.start();
    this.mouse.start();
};

/**
 * Mouse manager class
 * @param game
 * @constructor
 */
EL.Mouse = function(game) {
    this.game = game;
};

EL.Mouse.prototype.start = function() {
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

EL.Mouse.prototype.processMouseDown = function(event) {

};

EL.Mouse.prototype.processMouseMove = function(event) {

};

EL.Mouse.prototype.processMouseUp = function(event) {

};

/**
 * Keyboard manager class
 * @param game
 * @constructor
 */
EL.Keyboard = function(game) {
    this.game = game;
    this._keys = [];
};

EL.Keyboard.prototype.start = function() {
    var self = this;

    this._onKeyDown = function (event) {
        return self.processKeyDown(event);
    };

    this._onKeyUp = function (event) {
        return self.processKeyUp(event);
    };

    var keysCount = EL.Keys.MAX;
    while(keysCount--) this._keys.push(false);

    window.addEventListener('keydown', this._onKeyDown, false);
    window.addEventListener('keyup', this._onKeyUp, false);
};

EL.Keyboard.prototype.key = function(keycode) {
    return this._keys[keycode]
};

EL.Keyboard.prototype.processKeyDown = function(event) {
    this._keys[event.keyCode] = true;
};

EL.Keyboard.prototype.processKeyUp = function(event) {
    this._keys[event.keyCode] = false;
};

EL.Keys = {};
EL.Keys.MAX = 256;

EL.Keys.KEY_A = 65;
EL.Keys.KEY_B = 66;
EL.Keys.KEY_C = 67;
EL.Keys.KEY_D = 68;
EL.Keys.KEY_E = 69;
EL.Keys.KEY_F = 70;
EL.Keys.KEY_G = 71;
EL.Keys.KEY_H = 72;
EL.Keys.KEY_I = 73;
EL.Keys.KEY_J = 74;
EL.Keys.KEY_K = 75;
EL.Keys.KEY_L = 76;
EL.Keys.KEY_M = 77;
EL.Keys.KEY_N = 78;
EL.Keys.KEY_O = 79;
EL.Keys.KEY_P = 80;
EL.Keys.KEY_Q = 81;
EL.Keys.KEY_R = 82;
EL.Keys.KEY_S = 83;
EL.Keys.KEY_T = 84;
EL.Keys.KEY_U = 85;
EL.Keys.KEY_V = 86;
EL.Keys.KEY_W = 87;
EL.Keys.KEY_X = 88;
EL.Keys.KEY_Y = 89;
EL.Keys.KEY_Z = 90;
EL.Keys.KEY_ZERO = 48;
EL.Keys.KEY_ONE = 49;
EL.Keys.KEY_TWO = 50;
EL.Keys.KEY_THREE = 51;
EL.Keys.KEY_FOUR = 52;
EL.Keys.KEY_FIVE = 53;
EL.Keys.KEY_SIX = 54;
EL.Keys.KEY_SEVEN =55;
EL.Keys.KEY_EIGHT = 56;
EL.Keys.KEY_NINE = 57;
EL.Keys.KEY_NUMPAD_0 = 96;
EL.Keys.KEY_NUMPAD_1 = 97;
EL.Keys.KEY_NUMPAD_2 = 98;
EL.Keys.KEY_NUMPAD_3 = 99;
EL.Keys.KEY_NUMPAD_4 = 100;
EL.Keys.KEY_NUMPAD_5 = 101;
EL.Keys.KEY_NUMPAD_6 = 102;
EL.Keys.KEY_NUMPAD_7 = 103;
EL.Keys.KEY_NUMPAD_8 = 104;
EL.Keys.KEY_NUMPAD_9 = 105;
EL.Keys.KEY_NUMPAD_MULTIPLY = 106;
EL.Keys.KEY_NUMPAD_ADD = 107;
EL.Keys.KEY_NUMPAD_ENTER = 108;
EL.Keys.KEY_NUMPAD_SUBTRACT = 109;
EL.Keys.KEY_NUMPAD_DECIMAL = 110;
EL.Keys.KEY_NUMPAD_DIVIDE = 111;
EL.Keys.KEY_F1 = 112;
EL.Keys.KEY_F2 = 113;
EL.Keys.KEY_F3 = 114;
EL.Keys.KEY_F4 = 115;
EL.Keys.KEY_F5 = 116;
EL.Keys.KEY_F6 = 117;
EL.Keys.KEY_F7 = 118;
EL.Keys.KEY_F8 = 119;
EL.Keys.KEY_F9 = 120;
EL.Keys.KEY_F10 = 121;
EL.Keys.KEY_F11 = 122;
EL.Keys.KEY_F12 = 123;
EL.Keys.KEY_F13 = 124;
EL.Keys.KEY_F14 = 125;
EL.Keys.KEY_F15 = 126;
EL.Keys.KEY_COLON = 186;
EL.Keys.KEY_EQUALS = 187;
EL.Keys.KEY_UNDERSCORE = 189;
EL.Keys.KEY_QUESTION_MARK = 191;
EL.Keys.KEY_TILDE = 192;
EL.Keys.KEY_OPEN_BRACKET = 219;
EL.Keys.KEY_BACKWARD_SLASH = 220;
EL.Keys.KEY_CLOSEL_BRACKET = 221;
EL.Keys.KEY_QUOTES = 222;
EL.Keys.KEY_BACKSPACE = 8;
EL.Keys.KEY_TAB = 9;
EL.Keys.KEY_CLEAR = 12;
EL.Keys.KEY_ENTER = 13;
EL.Keys.KEY_SHIFT = 16;
EL.Keys.KEY_CONTROL = 17;
EL.Keys.KEY_ALT = 18;
EL.Keys.KEY_CAPS_LOCK = 20;
EL.Keys.KEY_ESC = 27;
EL.Keys.KEY_SPACEBAR = 32;
EL.Keys.KEY_PAGE_UP = 33;
EL.Keys.KEY_PAGE_DOWN = 34;
EL.Keys.KEY_END = 35;
EL.Keys.KEY_HOME = 36;
EL.Keys.KEY_LEFT = 37;
EL.Keys.KEY_UP = 38;
EL.Keys.KEY_RIGHT = 39;
EL.Keys.KEY_DOWN = 40;
EL.Keys.KEY_INSERT = 45;
EL.Keys.KEY_DELETE = 46;
EL.Keys.KEY_HELP = 47;
EL.Keys.KEY_NUM_LOCK = 144;

/**
 * State manager
 * @param game
 * @constructor
 */
EL.StateManager = function(game) {
    this.game = game;
    this.states = {};
    this.current = '';

    this._pending = '';
    this._state = null;
};

EL.StateManager.prototype.add = function(key, state) {
    this.states[key] = state;
    this.states[key].game = this.game;
};

EL.StateManager.prototype.set = function(key) {
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

EL.StateManager.prototype.update = function() {

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

EL.StateManager.prototype.render = function(alpha) {

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
EL.Game = function(width, height, parentId) {
    this.isRunning = false;

    this.width = width;
    this.height = height;

    this.parentId = parentId;

    this.parent = null;
    this.canvas = null;
    this.raf = null;
    this.graphics = null;
    this.input = null;

    this.state = new EL.StateManager(this);

    var self = this;
    this._onBoot = function() {
        self.boot();
    };

    window.addEventListener('load', this._onBoot, false);
};

EL.Game.prototype.update = function() {
    this.state.update();
};

EL.Game.prototype.render = function(alpha) {
    this.state.render(alpha);
};

EL.Game.prototype.boot = function() {

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
  //  this.canvas.style.width = '100%';
  //  this.canvas.style.height = '100%';
    this.parent.appendChild(this.canvas);

    // game core services
    this.graphics = new EL.Graphics(this);
    this.input = new EL.Input(this);

    // booting
    this.graphics.boot();
    this.input.boot();

    // ready start
    this.isRunning = true;
    this.raf = new EL.RAF(this);
    this.raf.start();
};

/**
 * Polygon utilities
 * @type {{}}
 */

EL.Graphics.Poly = {};

/**
 * Triangulation (Thanks to IvanK and Mat Groves )
 * @param p
 * @returns {Array}
 * @constructor
 */
EL.Graphics.Poly.Triangulate = function(p) {
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
        if(EL.Graphics.Poly._convex(ax, ay, bx, by, cx, cy, sign)) {
            earFound = true;
            for(var j = 0; j < al; j++) {
                var vi = avl[j];
                if(vi === i0 || vi === i1 || vi === i2) continue;

                if(EL.Graphics.Poly._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {
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

EL.Graphics.Poly._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy) {
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

EL.Graphics.Poly._convex = function(ax, ay, bx, by, cx, cy, sign) {
    return ((ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0) === sign;
};

/**
 * Generic shader class
 * @param graphics
 * @constructor
 */
EL.Graphics.Shader = function(graphics) {
    this.graphics = graphics;
    this.gl = graphics.gl;
    this.shader = null;
    this.type = null;
};

EL.Graphics.Shader.prototype.fromSource = function(src, type) {
    var gl = this.gl;
    this.type = gl[type];

    var shader = gl.createShader(this.type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return;
    }

    this.shader = shader;
};

/**
 * Shader program
 * @param graphics
 * @constructor
 */
EL.Graphics.ShaderProgram = function(graphics) {
    this.graphics = graphics;
    this.gl = graphics.gl;
    this.program = this.gl.createProgram();
};

EL.Graphics.ShaderProgram.prototype.attach = function(shader) {
    this.gl.attachShader(this.program, shader.shader);
    return this;
};

EL.Graphics.ShaderProgram.prototype.link = function() {
    this.gl.linkProgram(this.program);
    return this;
};

EL.Graphics.ShaderProgram.prototype.use = function() {
    this.gl.useProgram(this.program);
    return this;
};

/**
 * Game
 */

(function() {
    'use strict';

    var game = new EL.Game(1152, 720, 'c');

    var main = {

        load: function() {

            // shortcuts
            this.keyboard = this.game.input.keyboard;
            this.graphics = this.game.graphics;
            var gl = this.graphics.gl;

            // objects
            this.shipVerts = new Float32Array([0, 0, 0, 22, 15, 37, 35, 37, 51, 21, 51, 0, 36, 15, 26, 6, 16, 16]);
            this.shipIndices = new Uint16Array(EL.Graphics.Poly.Triangulate(this.shipVerts));

            // simple shader
            var fragmentShader = new EL.Graphics.Shader(this.graphics);
            fragmentShader.fromSource([
                'void main(void) {',
                '    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',
                '}'
            ].join(''), 'FRAGMENT_SHADER');

            var vertexShader = new EL.Graphics.Shader(this.graphics);
            vertexShader.fromSource([
                'attribute vec2 aVertexPosition;',
                'uniform mat4 uMVMatrix;',
                'uniform mat4 uPMatrix;',
                'void main(void) {',
                '    gl_Position = uMVMatrix * vec4(aVertexPosition, 1.0, 1.0);',
                '}'
            ].join(''), 'VERTEX_SHADER');

            var mainShader = new EL.Graphics.ShaderProgram(this.graphics);
            mainShader.attach(fragmentShader).attach(vertexShader).link();

            mainShader.uMVMatrix = mainShader.gl.getUniformLocation(mainShader.program, "uMVMatrix");

            mainShader.vertexPositionAttribute = mainShader.gl.getAttribLocation(mainShader.program, "aVertexPosition");
            mainShader.gl.enableVertexAttribArray(mainShader.vertexPositionAttribute);

            this.mainShader = mainShader;

            this.vertexBuffer = gl.createBuffer();
            this.indexBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.shipVerts, gl.DYNAMIC_DRAW);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.shipIndices, gl.STATIC_DRAW);

            var projectionMatrix = new Float32Array(16);
            for (var i = 0; i < projectionMatrix.length; i++) {
                projectionMatrix[i] = +((i % 5) == 0); // uniform matrix
            }

            projectionMatrix[0] = 2 / this.game.width;
            projectionMatrix[5] = -2 / this.game.height;
            projectionMatrix[12] = -1;
            projectionMatrix[13] = 1;

            this.projectionMatrix = projectionMatrix;


            // draw settings
            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.enable(gl.BLEND);
            gl.colorMask(true, true, true, true);
        },

        unload: function() {

        },

        update: function() {
            if(this.keyboard.key(EL.Keys.KEY_A)) {

            }
        },

        render: function() {
            var gl = this.game.graphics.gl;

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.clearColor(101 / 255, 156 / 255, 239 / 255, 1);  // cornflower blue
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            this.mainShader.use();

            gl.uniformMatrix4fv(this.mainShader.uMVMatrix, false, this.projectionMatrix);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.shipVerts);
            gl.vertexAttribPointer(this.mainShader.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

            // indices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            // draw
            gl.drawElements(gl.TRIANGLES, this.shipIndices.length, gl.UNSIGNED_SHORT, 0);


        }
    };

    game.state.add('main', main);
    game.state.set('main');
})();