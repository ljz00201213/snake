var Sprite = laya.display.Sprite;
var Loader = laya.net.Loader;
var Texture = laya.resource.Texture;
var Handler = laya.utils.Handler;
var Browser = laya.utils.Browser;
var TiledMap = laya.map.TiledMap;
var Rectangle = laya.maths.Rectangle;
var Stat = laya.utils.Stat;
var TextFiled = laya.display.Text;
var LocalStorage = laya.net.LocalStorage;
// 程序入口
var GameMain = (function () {
    function GameMain() {
        this.assets = [];
        //初始豆子
        this.beanSingleNumInit = 300;
        //最大豆子数
        this.beanMaxNum = 600;
        this.beanNum = 0;
        this.beanOrder = 0;
        this.beans = {};
        this.SnakeAINum = 5;
        this.snakeAIArr = [];
        this.init();
        Stat.show(200, 10);
    }
    GameMain.prototype.init = function () {
        this.stageW = 600;
        this.stageH = Browser.height / Browser.width * this.stageW;
        Laya.init(this.stageW, this.stageH, Laya.WebGL);
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Laya.stage.bgColor = "#555555";
        this.assets.push({
            url: [
                "res/atlas/img.json"
            ],
            type: Laya.Loader.ATLAS
        });
        Laya.loader.load(this.assets, Laya.Handler.create(this, this.onloded));
    };
    GameMain.prototype.onloded = function () {
        this.run = new Run();
        Laya.stage.addChild(this.run);
        this.benginGame();
    };
    GameMain.prototype.benginGame = function () {
        for (var bean_i = 0; bean_i < this.beanSingleNumInit; bean_i++) {
            this.beanOrder++;
            this.addBean(this.beanOrder);
        }
        this.addBeanRandom();
        this.snakeSelf = new Snake();
        this.run.map.addChild(this.snakeSelf);
        for (var index = 0; index < this.SnakeAINum; index++) {
            var snakeAI = new Snake(Math.floor(Math.random() * (5 - 1 + 1) + 1), this.run.map.width * Math.random(), this.run.map.height * Math.random());
            snakeAI.AI = true;
            this.snakeAIArr.push(snakeAI);
            this.run.map.addChild(snakeAI);
        }
        this.snakeAIRotation();
        Laya.timer.frameLoop(1, this, this.gameLoop);
    };
    GameMain.prototype.gameLoop = function () {
        this.snakeSelf.move();
        this.mapMove();
        this.snakeAIMove();
        this.eateBean();
    };
    GameMain.prototype.eateBean = function () {
        for (var key in this.beans) {
            var bean = this.beans[key];
            if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= this.snakeSelf.width / 2) {
                bean.destroy();
                this.beans[key] = undefined;
                delete this.beans[key];
                this.snakeSelf.snakeLength++;
                this.snakeSelf.eatBean++;
                this.beanNum--;
            }
            else if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= (this.snakeSelf.width / 2) + 20) {
                bean.x += (this.snakeSelf.speed + 0.1) * Math.cos(Math.atan2(this.snakeSelf.y - bean.y, this.snakeSelf.x - bean.x));
                bean.y += (this.snakeSelf.speed + 0.1) * Math.sin(Math.atan2(this.snakeSelf.y - bean.y, this.snakeSelf.x - bean.x));
            }
            for (var index = 0; index < this.snakeAIArr.length; index++) {
                var element = this.snakeAIArr[index];
                if (distance(bean.x, bean.y, element.x, element.y) <= element.width / 2) {
                    bean.destroy();
                    this.beans[key] = undefined;
                    delete this.beans[key];
                    element.snakeLength++;
                    element.eatBean++;
                    this.beanNum--;
                }
                else if (distance(bean.x, bean.y, element.x, element.y) <= (element.width / 2) + 20) {
                    bean.x += (bean.speed) * Math.cos(Math.atan2(element.y - bean.y, element.x - bean.x));
                    bean.y += (bean.speed) * Math.sin(Math.atan2(element.y - bean.y, element.x - bean.x));
                }
            }
        }
    };
    GameMain.prototype.snakeAIMove = function () {
        for (var index = 0; index < this.snakeAIArr.length; index++) {
            var snakeAI = this.snakeAIArr[index];
            snakeAI.move();
            var hitDis = 90 / snakeAI.speedObj["rotation"] * snakeAI.speed + snakeAI.width / 2;
            var hitPos = { x: 0, y: 0 };
            hitPos["x"] = hitDis * Math.cos(snakeAI.rotation * Math.PI / 180) + snakeAI.x;
            hitPos["y"] = hitDis * Math.sin(snakeAI.rotation * Math.PI / 180) + snakeAI.y;
            var hiten = false;
            //判断是否快碰撞到边界
            if (hitPos["x"] >= this.run.map.width - snakeAI.width / 2 || hitPos["x"] <= snakeAI.width / 2
                || hitPos["y"] >= this.run.map.height - snakeAI.width / 2 || hitPos["y"] <= snakeAI.width / 2) {
                snakeAI.reverseRotation();
            }
            //判断是否撞倒玩家蛇
            if (distance(hitPos["x"], hitPos["y"], this.snakeSelf.x, this.snakeSelf.y) <= this.snakeSelf.width) {
                snakeAI.reverseRotation();
                hiten = true;
            }
            for (var index_1 = 0; index_1 < this.snakeSelf.bodyArr.length; index_1++) {
                if (hiten)
                    break;
                var element = this.snakeSelf.bodyArr[index_1];
                if (distance(hitPos["x"], hitPos["y"], element.x, element.y) <= element.width) {
                    snakeAI.reverseRotation();
                    hiten = true;
                }
            }
            //判断AI之间是否自己碰撞
            for (var i = 0; i < this.snakeAIArr.length; i++) {
                if (hiten)
                    break;
                var elementSnakeAI = this.snakeAIArr[i];
                if (index == i)
                    continue;
                if (distance(hitPos["x"], hitPos["y"], elementSnakeAI.x, elementSnakeAI.y) <= elementSnakeAI.width) {
                    snakeAI.reverseRotation();
                    hiten = true;
                }
                for (var index_2 = 0; index_2 < elementSnakeAI.bodyArr.length; index_2++) {
                    if (hiten)
                        break;
                    var element = elementSnakeAI.bodyArr[index_2];
                    if (distance(hitPos["x"], hitPos["y"], element.x, element.y) <= element.width) {
                        snakeAI.reverseRotation();
                        hiten = true;
                    }
                }
            }
        }
    };
    GameMain.prototype.snakeAIRotation = function () {
        var _this = this;
        for (var index = 0; index < this.snakeAIArr.length; index++) {
            this.snakeAIArr[index].targetR = 180 - Math.random() * 360;
            this.snakeAIArr[index].speedNow = Math.random() > 0.9 ? "fast" : "slow";
        }
        setInterval(function () {
            for (var index = 0; index < _this.snakeAIArr.length; index++) {
                _this.snakeAIArr[index].targetR = 180 - Math.random() * 360;
                _this.snakeAIArr[index].speedNow = Math.random() > 0.9 ? "fast" : "slow";
            }
        }, 3000);
    };
    GameMain.prototype.mapMove = function () {
        var mapScale = this.snakeSelf.snakeInitSize / this.snakeSelf.snakeSize < 0.7 ? 0.7 : this.snakeSelf.snakeInitSize / this.snakeSelf.snakeSize;
        this.run.map.x = -1 * (this.snakeSelf.x + this.snakeSelf.width / 2 - this.run.map.width / 2) * mapScale + this.stageW / 2;
        this.run.map.y = -1 * (this.snakeSelf.y + this.snakeSelf.height / 2 - this.run.map.height / 2) * mapScale + this.stageH / 2;
        this.run.map.scale(mapScale, mapScale);
    };
    GameMain.prototype.addBean = function (beanOrder, x, y, colorNum) {
        var bean = new Bean(x, y, colorNum);
        bean.orderNum = beanOrder;
        this.beans[beanOrder] = bean;
        this.run.map.addChild(bean);
        this.beanNum++;
    };
    GameMain.prototype.addBeanRandom = function () {
        var _this = this;
        this.beanRandomTimer = setInterval(function () {
            if (_this.beanNum < _this.beanMaxNum) {
                for (var index = 0; index < 20; index++) {
                    _this.beanOrder++;
                    _this.addBean(_this.beanOrder);
                }
            }
        }, 100);
    };
    return GameMain;
}());
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
var game = new GameMain();
//# sourceMappingURL=LayaSample.js.map