/**
 * @author       Michał Skowronek (regis3) <skowronkow@gmail.com>
 * @twitter      @coderitual
 * @copyright    2014 coderitual
 */

/**
 * OKED Library
 */

var OKED = {};

/**
 * RequestAnimationFrame helper service
 * @param game
 * @constructor
 */

OKED.RAF = function(game) {
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

OKED.RAF.prototype.start = function() {
    var self = this;

    this._onRAF = function() {
        self.update();
    };

    this._lastCall = Date.now();
    this._accum = 0;

    this.update();
};

OKED.RAF.prototype.update = function() {
    if(!this.game.isRunning) {
        return;
    }

    var dt = this.timeStep * 1000;
    var delta = Date.now() - this._lastCall;

    this._lastCall = Date.now();
    this._accum += delta;

    while (this._accum >= dt) {
        this.game.update();
        this._accum -= dt;
    }

    this.game.render();

    window.RAF(this._onRAF);
};

/**
 * Webgl graphics device manager
 * @param game
 * @constructor
 */
OKED.GDM = function(game) {
    this.game = game;
};

OKED.GDM.prototype.boot = function() {

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
 * Input Manager
 * @param game
 * @constructor
 */

OKED.Input = function(game) {
    this.game = game;
};

OKED.Input.prototype.boot = function() {

};

/**
 * State manager
 * @param game
 * @constructor
 */
OKED.StateManager = function(game) {
    this.game = game;
    this.states = {};
    this.current = '';

    this._pending = '';
    this._state = null;
};

OKED.StateManager.prototype.add = function(key, state) {
    this.states[key] = state;
    this.states[key].game = this.game;
};

OKED.StateManager.prototype.set = function(key) {
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

OKED.StateManager.prototype.update = function() {

    if(this._pending) {

        if(this._state) this._state.unload(this._pending);
        this._state = this.states[this._pending];
        this._state.load(this.current);
        this._pending = '';
        this.current = this._pending;
    }

    if(this._state) {
        this._state.update();
    }
};

OKED.StateManager.prototype.render = function() {

    if(this._state) {
        this._state.render();
    }
};

/***
 * Main game class
 * @param width
 * @param height
 * @param parentId
 * @constructor
 */
OKED.Game = function(width, height, parentId) {
    this.isRunning = false;

    this.width = width;
    this.height = height;

    this.parentId = parentId;

    this.parent = null;
    this.canvas = null;
    this.raf = null;
    this.graphics = null;

    this.state = new OKED.StateManager(this);

    var self = this;
    this._onBoot = function() {
        self.boot();
    };

    window.addEventListener('load', this._onBoot, false);
};

OKED.Game.prototype.update = function() {
    this.state.update();
};

OKED.Game.prototype.render = function() {
    this.state.render();
};

OKED.Game.prototype.boot = function() {

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

    // booting
    this.graphics = new OKED.GDM(this);
    this.graphics.boot();

    // ready start
    this.isRunning = true;
    this.raf = new OKED.RAF(this);
    this.raf.start();
};

/**
 * Game
 */

(function() {
    'use strict';

    var game = new OKED.Game(960, 600, 'c');

    var main = {

        load: function() {

        },

        unload: function() {

        },

        update: function() {

        },

        render: function() {

        }
    };

    game.state.add('main', main);
    game.state.set('main');
})();