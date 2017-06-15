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
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var runUI = (function (_super) {
        __extends(runUI, _super);
        function runUI() {
            return _super.call(this) || this;
        }
        runUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.runUI.uiView);
        };
        return runUI;
    }(View));
    runUI.uiView = { "type": "View", "props": { "y": 750, "pivotY": 750 }, "child": [{ "type": "Image", "props": { "width": 3000, "var": "map", "skin": "img/tile_map.png", "pivotY": "750", "pivotX": 1500, "height": 1500 } }, { "type": "Button", "props": { "y": 300, "x": 440, "var": "ctrl_flash", "stateNum": "2", "skin": "img/control-flash.png" } }, { "type": "Image", "props": { "y": 340, "x": 80, "var": "ctrl_back", "skin": "img/control-back.png", "pivotY": 40, "pivotX": 40 }, "child": [{ "type": "Image", "props": { "y": 38, "x": 37, "width": 35, "var": "ctrl_rocker", "skin": "img/control-rocker.png", "pivotY": 17.5, "pivotX": 17.5, "height": 35 } }] }, { "type": "Image", "props": { "y": 424, "x": 49, "var": "ctrl_rocker_move", "skin": "img/control-rocker.png", "pivotY": 17.5, "pivotX": 17.5 } }] };
    ui.runUI = runUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map