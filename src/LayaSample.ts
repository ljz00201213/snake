import Sprite = laya.display.Sprite
import Loader = laya.net.Loader
import Texture = laya.resource.Texture
import Handler = laya.utils.Handler
import Browser = laya.utils.Browser
import TiledMap = laya.map.TiledMap
import Rectangle = laya.maths.Rectangle
import Stat = laya.utils.Stat
import TextFiled = laya.display.Text
import LocalStorage = laya.net.LocalStorage
// 程序入口
class GameMain {
    public stageW: number;
    public stageH: number;
    public assets = [];
    public run: Run;
    public bean: Bean;
    //初始豆子
    public beanSingleNumInit: number = 300;
    //最大豆子数
    public beanMaxNum: number = 600;
    public beanNum: number = 0;
    public beanOrder: number = 0;
    public beans: Object = {};
    public beanRandomTimer: any;
    public snakeSelf: Snake;
    public SnakeAINum: number = 5;
    public snakeAIArr: Array<Snake> = [];
    constructor() {
        this.init();
        Stat.show(200, 10);
    }
    private init(): void {
        this.stageW = 600
        this.stageH = Browser.height / Browser.width * this.stageW;
        Laya.init(this.stageW, this.stageH, Laya.WebGL);
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL
        Laya.stage.bgColor = "#555555"
        this.assets.push({
            url: [
                "res/atlas/img.json"
            ],
            type: Laya.Loader.ATLAS
        })
        Laya.loader.load(this.assets, Laya.Handler.create(this, this.onloded))
    }
    private onloded(): void {
        this.run = new Run();
        Laya.stage.addChild(this.run);

        this.benginGame();

    }
    public benginGame(): void {

        for (let bean_i = 0; bean_i < this.beanSingleNumInit; bean_i++) {
            this.beanOrder++;
            this.addBean(this.beanOrder)
        }
        this.addBeanRandom();
        this.snakeSelf = new Snake();
        this.run.map.addChild(this.snakeSelf)
         for (let index = 0; index < this.SnakeAINum; index++) {
            let snakeAI: Snake = new Snake(Math.floor(Math.random() * (5 - 1 + 1) + 1), this.run.map.width * Math.random(), this.run.map.height * Math.random())
            snakeAI.AI = true
            this.snakeAIArr.push(snakeAI)
            this.run.map.addChild(snakeAI)
        }
        this.snakeAIRotation()
        Laya.timer.frameLoop(1, this, this.gameLoop)
    }
    public gameLoop(): void {
        this.snakeSelf.move()
        this.mapMove()
        this.snakeAIMove()
        this.eateBean()
    }
    public eateBean(): void {
        for (let key in this.beans) {
            let bean: Bean = this.beans[key]

            if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= this.snakeSelf.width / 2) {
                bean.destroy()
                this.beans[key] = undefined
                delete this.beans[key]
                this.snakeSelf.snakeLength++
                this.snakeSelf.eatBean++
                this.beanNum--
            } else if (distance(bean.x, bean.y, this.snakeSelf.x, this.snakeSelf.y) <= (this.snakeSelf.width / 2) + 20) {
                bean.x += (this.snakeSelf.speed + 0.1) * Math.cos(Math.atan2(this.snakeSelf.y - bean.y, this.snakeSelf.x - bean.x))
                bean.y += (this.snakeSelf.speed + 0.1) * Math.sin(Math.atan2(this.snakeSelf.y - bean.y, this.snakeSelf.x - bean.x))
            }
            for (let index = 0; index < this.snakeAIArr.length; index++) {
                let element = this.snakeAIArr[index]
                if (distance(bean.x, bean.y, element.x, element.y) <= element.width / 2) {
                    bean.destroy()
                    this.beans[key] = undefined
                    delete this.beans[key]
                    element.snakeLength++
                    element.eatBean++
                    this.beanNum--
                } else if (distance(bean.x, bean.y, element.x, element.y) <= (element.width / 2) + 20) {
                    bean.x += (bean.speed) * Math.cos(Math.atan2(element.y - bean.y, element.x - bean.x))
                    bean.y += (bean.speed) * Math.sin(Math.atan2(element.y - bean.y, element.x - bean.x))
                }
            }
        }
    }
    public snakeAIMove(): void {
        for (let index = 0; index < this.snakeAIArr.length; index++) {
            let snakeAI = this.snakeAIArr[index]
            snakeAI.move()
            let hitDis: number = 90 / snakeAI.speedObj["rotation"] * snakeAI.speed + snakeAI.width / 2
            let hitPos: Object = { x: 0, y: 0 }
            hitPos["x"] = hitDis * Math.cos(snakeAI.rotation * Math.PI / 180) + snakeAI.x
            hitPos["y"] = hitDis * Math.sin(snakeAI.rotation * Math.PI / 180) + snakeAI.y
            let hiten: Boolean = false
            //判断是否快碰撞到边界
            if (hitPos["x"] >= this.run.map.width - snakeAI.width / 2 || hitPos["x"] <= snakeAI.width / 2
                || hitPos["y"] >= this.run.map.height - snakeAI.width / 2 || hitPos["y"] <= snakeAI.width / 2) {
                snakeAI.reverseRotation()
            }

            //判断是否撞倒玩家蛇
            if (distance(hitPos["x"], hitPos["y"], this.snakeSelf.x, this.snakeSelf.y) <= this.snakeSelf.width) {
                snakeAI.reverseRotation()
                hiten = true
            }
            for (let index = 0; index < this.snakeSelf.bodyArr.length; index++) {
                if (hiten) break
                let element = this.snakeSelf.bodyArr[index];
                if (distance(hitPos["x"], hitPos["y"], element.x, element.y) <= element.width) {
                    snakeAI.reverseRotation()
                    hiten = true
                }
            }
            //判断AI之间是否自己碰撞
            for (let i = 0; i < this.snakeAIArr.length; i++) {
                if (hiten) break
                let elementSnakeAI: Snake = this.snakeAIArr[i];
                if (index == i) continue
                if (distance(hitPos["x"], hitPos["y"], elementSnakeAI.x, elementSnakeAI.y) <= elementSnakeAI.width) {
                    snakeAI.reverseRotation()
                    hiten = true
                }
                for (let index = 0; index < elementSnakeAI.bodyArr.length; index++) {
                    if (hiten) break
                    let element = elementSnakeAI.bodyArr[index];
                    if (distance(hitPos["x"], hitPos["y"], element.x, element.y) <= element.width) {
                        snakeAI.reverseRotation()
                        hiten = true
                    }
                }
            }
        }
    }

    public snakeAIRotation(): void {
        for (let index = 0; index < this.snakeAIArr.length; index++) {
            this.snakeAIArr[index].targetR = 180 - Math.random() * 360
            this.snakeAIArr[index].speedNow = Math.random() > 0.9 ? "fast" : "slow"
        }
        setInterval(() => {
            for (let index = 0; index < this.snakeAIArr.length; index++) {
                this.snakeAIArr[index].targetR = 180 - Math.random() * 360
                this.snakeAIArr[index].speedNow = Math.random() > 0.9 ? "fast" : "slow"
            }
        }, 3000)
    }


    public mapMove(): void {
        let mapScale = this.snakeSelf.snakeInitSize / this.snakeSelf.snakeSize < 0.7 ? 0.7 : this.snakeSelf.snakeInitSize / this.snakeSelf.snakeSize
        this.run.map.x = -1 * (this.snakeSelf.x + this.snakeSelf.width / 2 - this.run.map.width / 2) * mapScale + this.stageW / 2
        this.run.map.y = -1 * (this.snakeSelf.y + this.snakeSelf.height / 2 - this.run.map.height / 2) * mapScale + this.stageH / 2
        this.run.map.scale(mapScale, mapScale)
    }
    public addBean(beanOrder: number, x?: number, y?: number, colorNum?: number): void {
        let bean = new Bean(x, y, colorNum);
        bean.orderNum = beanOrder;
        this.beans[beanOrder] = bean;
        this.run.map.addChild(bean);
        this.beanNum++;
    }
    public addBeanRandom(): void {
        this.beanRandomTimer = setInterval(() => {
            if (this.beanNum < this.beanMaxNum) {
                for (let index = 0; index < 20; index++) {
                    this.beanOrder++;
                    this.addBean(this.beanOrder);
                }
            }
        }, 100)
    }
}
function distance(x1, y1, x2, y2): number {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}
let game = new GameMain();