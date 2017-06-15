class Bean extends Laya.Sprite{
        private colorNum: number;
        public orderNum: number;
        private boolean = false;
        public speed : number = 2;
        //private eatenTarget: Snake
        public eatenTargetPos : Object = {x : 0 , y : 0}
        public haveEatenDis : number  = 4;
        public eatenPos: Object = { x: 0, y: 0 }
        public eatenInitPos: Object = { x: 0, y: 0 }
        constructor(
            x : number = Math.random() * game.run.map.width
            ,y : number = Math.random() * game.run.map.height
            ,colorNum : number = Math.floor(Math.random() * (6 - 1 + 1) + 1)
        ){
            super()
            this.colorNum = colorNum;
            
            this.visible =false;
            this.eatenInitPos["x"] = x;
            this.eatenInitPos["y"] = y;
            this.init(x ,y)
        }
        public init(x : number, y:number):void{
            this.loadImage("img/bean" + this.colorNum + ".png" , 0 , 0 , 0 ,0, new Handler(this ,this.loaded,[x ,y]))
        }
        public loaded(x : number, y:number):void{
            this.zOrder = 0;
            this.pivot(this.width / 2 , this.height / 2)
            this.pos(x , y);
            this.visible = true;
        }
}




