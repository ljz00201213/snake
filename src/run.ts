class Run extends ui.runUI {
    keySpaceDown: boolean = false;
    constructor() {
        super();
        this.init()

    }
    public init(): void {
        this.ctrl_flash.on("mousedown", this.ctrl_flash, this.ctrlFlashDown)
        this.ctrl_flash.on("mouseup", this, this.ctrlFlashUp)
        Laya.stage.on("mouseup", this, this.ctrlRockerUp)
        Laya.stage.on("mousemove", this, this.ctrlRockerDown)
        Laya.stage.on("keydown", this, this.keyDown)
        Laya.stage.on("keyup", this, this.keyUp)
    }
    public keyUp(e): void {
        if (e.keyCode == 32) {
            this.ctrlFlashUp();
        }
    }
    public keyDown(e): void {
        if (e.keyCode == 32) {
            this.ctrlFlashDown();
        }
    }
    public ctrlFlashDown(): void {
        game.snakeSelf.speedNow = "fast"
    }
    public ctrlFlashUp(): void {
        game.snakeSelf.speedNow = "slow"
    }
    public ctrlRockerUp(): void {
        if (Laya.stage.mouseX < game.stageW / 1.5) {
            this.ctrl_rocker.visible = true;
            this.ctrl_rocker_move.visible = false;
        }
    }
    public ctrlRockerDown(): void {
        if (Laya.stage.mouseX <= game.stageW / 1.5) {
            this.ctrl_rocker.visible = false
            this.ctrl_rocker_move.visible = true
            if (distance(Laya.stage.mouseX, Laya.stage.mouseY, this.ctrl_back.x, this.ctrl_back.y) <= (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2)) {
                this.ctrl_rocker_move.pos(Laya.stage.mouseX, Laya.stage.mouseY)
            } else {
                this.ctrl_rocker_move.pos(
                    this.ctrl_back.x + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.cos(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x))
                    ,
                    this.ctrl_back.y + (this.ctrl_back.width / 2 - this.ctrl_rocker.width / 2) * Math.sin(Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x))
                )
            }
            game.snakeSelf.targetR = Math.atan2(Laya.stage.mouseY - this.ctrl_back.y, Laya.stage.mouseX - this.ctrl_back.x) * 180 / Math.PI
        }
    }

}