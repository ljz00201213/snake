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
var Run = (function (_super) {
    __extends(Run, _super);
    function Run() {
        var _this = _super.call(this) || this;
        _this.keySpaceDown = false;
        _this.init();
        return _this;
    }
    Run.prototype.init = function () {
        this.ctrl_flash.on("mousedown", this.ctrl_flash, this.ctrlFlashDown);
        this.ctrl_flash.on("mouseup", this, this.ctrlFlashUp);
        Laya.stage.on("mouseup", this, this.ctrlRockerUp);
        Laya.stage.on("mousemove", this, this.ctrlRockerDown);
        Laya.stage.on("keydown", this, this.keyDown);
        Laya.stage.on("keyup", this, this.keyUp);
    };
    Run.prototype.keyUp = function (e) {
        if (e.keyCode == 32) {
            this.ctrlFlashUp();
        }
    };
    Run.prototype.keyDown = function (e) {
        if (e.keyCode == 32) {
            this.ctrlFlashDown();
        }
    };
    Run.prototype.ctrlFlashDown = function () {
        game.snakeSelf.speedNow = "fast";
    };
    Run.prototype.ctrlFlashUp = function () {
        game.snakeSelf.speedNow = "slow";
    };
    Run.prototype.ctrlRockerUp = function () {
        if (Laya.stage.mouseX < game.stageW / 1.5) {
            this.ctrl_rocker.visible = true;
            this.ctrl_rocker_move.visible = false;
        }
    };
    Run.prototype.ctrlRockerDown = function () {
        if (Laya.stage.mouseX <= game.stageW / 1.5) {
            this.ctrl_rocker.visible = false;
            this.ctrl_rocker_move.visible = true;
            if (distance(Laya.stage.mouseX, Laya.stage.mouseY, this.ctrl_back.x, this.ctrl_back.y) <= (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2)) {
                this.ctrl_rocker_move.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            }
            else {
                this.ctrl_rocker_move.pos(this.ctrl_back.x + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.cos(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x)), this.ctrl_back.y + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.sin(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x)));
            }
            game.snakeSelf.targetR = Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x) * 180 / Math.PI;
        }
    };
    return Run;
}(ui.runUI));
//# sourceMappingURL=run.js.map