var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Bean = (function (_super) {
    __extends(Bean, _super);
    function Bean(x, y, colorNum) {
        if (x === void 0) { x = Math.random() * game.run.map.width; }
        if (y === void 0) { y = Math.random() * game.run.map.height; }
        if (colorNum === void 0) { colorNum = Math.floor(Math.random() * (6 - 1 + 1) + 1); }
        var _this = _super.call(this) || this;
        _this.boolean = false;
        _this.speed = 2;
        //private eatenTarget: Snake
        _this.eatenTargetPos = { x: 0, y: 0 };
        _this.haveEatenDis = 4;
        _this.eatenPos = { x: 0, y: 0 };
        _this.eatenInitPos = { x: 0, y: 0 };
        _this.colorNum = colorNum;
        _this.visible = false;
        _this.eatenInitPos["x"] = x;
        _this.eatenInitPos["y"] = y;
        _this.init(x, y);
        return _this;
    }
    Bean.prototype.init = function (x, y) {
        this.loadImage("img/bean" + this.colorNum + ".png", 0, 0, 0, 0, new Handler(this, this.loaded, [x, y]));
    };
    Bean.prototype.loaded = function (x, y) {
        this.zOrder = 0;
        this.pivot(this.width / 2, this.height / 2);
        this.pos(x, y);
        this.visible = true;
    };
    return Bean;
}(Laya.Sprite));
//# sourceMappingURL=bean.js.map