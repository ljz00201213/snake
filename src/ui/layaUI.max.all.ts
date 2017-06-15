
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class runUI extends View {
		public map:Laya.Image;
		public ctrl_flash:Laya.Button;
		public ctrl_back:Laya.Image;
		public ctrl_rocker:Laya.Image;
		public ctrl_rocker_move:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"y":750,"pivotY":750},"child":[{"type":"Image","props":{"width":3000,"var":"map","skin":"img/tile_map.png","pivotY":"750","pivotX":1500,"height":1500}},{"type":"Button","props":{"y":300,"x":440,"var":"ctrl_flash","stateNum":"2","skin":"img/control-flash.png"}},{"type":"Image","props":{"y":340,"x":80,"var":"ctrl_back","skin":"img/control-back.png","pivotY":40,"pivotX":40},"child":[{"type":"Image","props":{"y":38,"x":37,"width":35,"var":"ctrl_rocker","skin":"img/control-rocker.png","pivotY":17.5,"pivotX":17.5,"height":35}}]},{"type":"Image","props":{"y":424,"x":49,"var":"ctrl_rocker_move","skin":"img/control-rocker.png","pivotY":17.5,"pivotX":17.5}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.runUI.uiView);
        }
    }
}
