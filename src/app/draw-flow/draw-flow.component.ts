import { Component, OnInit } from '@angular/core';
import Drawflow from 'drawflow';
@Component({
  selector: 'app-draw-flow',
  templateUrl: './draw-flow.component.html'
})
export class DrawFlowComponent implements OnInit {
  editor!: any;
  elements = document.getElementsByClassName('drag-drawflow');
  mobile_item_selec = '';
  mobile_last_move = null;
  transform = '';

  ngOnInit(): void {
    
    this.editor = new Drawflow(document.getElementById('drawflow')!);
    this.editor.reroute = true;
    this.editor.editor_mode = 'edit';
    // this.editor.drawflow = {}
    //this.editor.import(null);
    this.editor.start();
    console.log(this.editor);
    this.editor.on('nodeCreated', function (id: string) {
      console.log('Node created ' + id);
    });
    this.editor.on('nodeRemoved', function (id: string) {
      console.log('Node removed ' + id);
    });
    this.editor.on('nodeSelected', function (id: string) {
      console.log('Node selected ' + id);
    });
    this.editor.on('moduleCreated', function (name : string) {
      console.log('Module Created ' + name);
    });
    this.editor.on('moduleChanged', function (name : string) {
      console.log('Module Changed ' + name);
    });
    this.editor.on('connectionCreated', function (connection: any) {
      console.log('Connection created');
      console.log(connection);
    });
    this.editor.on('connectionRemoved', function (connection : any) {
      console.log('Connection removed');
      console.log(connection);
    });
    this.editor.on('mouseMove', function (position : any) {
      //console.log('Position mouse x:' + position.x + ' y:'+ position.y);
    });
    this.editor.on('nodeMoved', function (id : string) {
      console.log('Node moved ' + id);
    });
    this.editor.on('zoom', function (zoom: string ) {
      console.log('Zoom level ' + zoom);
    });
    this.editor.on('translate', function (position: { x: string; y: string; }) {
      console.log('Translate x:' + position.x + ' y:' + position.y);
    });
    this.editor.on('addReroute', function (id: string) {
      console.log('Reroute added ' + id);
    });
    this.editor.on('removeReroute', function (id: string) {
      console.log('Reroute removed ' + id);
    });

    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].addEventListener('touchend', this.drop, false);
      this.elements[i].addEventListener(
        'touchmove',
        this.positionMobile,
        false
      );
      this.elements[i].addEventListener('touchstart', this.drag, false);
    }
  }
  allowDrop(e : any ) {
    e.preventDefault();
  }
  drag(e : any) {
    console.log(1);
    if (e.type === 'touchstart') {
      this.mobile_item_selec = e.target
        .closest('.drag-drawflow')
        .getAttribute('data-node');
    } else {
      e.dataTransfer.setData('node', e.target.getAttribute('data-node'));
    }
  }
  drop(e : any) {
    console.log(2);
    if (e.type === 'touchend') {
      
    } else {
      e.preventDefault();
      var data = e.dataTransfer.getData('node');
      console.log('x' + e.clientX);
      this.addNodeToDrawFlow(data, e.clientX, e.clientY);
    }
  }
  positionMobile(e : any) {
    this.mobile_last_move = e;
  }
  addNodeToDrawFlow(name: any, pos_x: any, pos_y: any) {
    if (this.editor.editor_mode === 'fixed') {
      return false;
    }
    pos_x =
      pos_x *
        (this.editor.precanvas.clientWidth /
          (this.editor.precanvas.clientWidth * this.editor.zoom)) -
      this.editor.precanvas.getBoundingClientRect().x *
        (this.editor.precanvas.clientWidth /
          (this.editor.precanvas.clientWidth * this.editor.zoom));
    pos_y =
      pos_y *
        (this.editor.precanvas.clientHeight /
          (this.editor.precanvas.clientHeight * this.editor.zoom)) -
      this.editor.precanvas.getBoundingClientRect().y *
        (this.editor.precanvas.clientHeight /
          (this.editor.precanvas.clientHeight * this.editor.zoom));

    switch (name) {
    
      case 'aws':
        var aws = `
            <div>
              <div class="title-box"><i class="fab fa-aws"></i> Node </div>
              <div class="box">
                <p>Save in aws</p>
                <input type="text" df-db-dbname placeholder="DB name"><br><br>
                <input type="text" df-db-key placeholder="DB key">
                <p>Output Log</p>
                <button (click) = "showAlert()">Click!</button>
              </div>
            </div>
            `;
        this.editor.addNode(
          'aws',
          1,
          1,
          pos_x,
          pos_y,
          'aws',
          { db: { dbname: '', key: '' } },
          aws
        );
        break;
      default:
    }
  }
  showAlert(){
    alert("TextBox Value is ");
  }

  showpopup(e : any) {
    e.target.closest('.drawflow-node').style.zIndex = '9999';
    e.target.children[0].style.display = 'block';
    //document.getElementById("modalfix").style.display = "block";

    //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
    this.transform = this.editor.precanvas.style.transform;
    this.editor.precanvas.style.transform = '';
    this.editor.precanvas.style.left = this.editor.canvas_x + 'px';
    this.editor.precanvas.style.top = this.editor.canvas_y + 'px';
    console.log(this.transform);

    //e.target.children[0].style.top  =  -editor.canvas_y - editor.container.offsetTop +'px';
    //e.target.children[0].style.left  =  -editor.canvas_x  - editor.container.offsetLeft +'px';
    this.editor.editor_mode = 'fixed';
  }
  closemodal(e : any) {
    e.target.closest('.drawflow-node').style.zIndex = '2';
    e.target.parentElement.parentElement.style.display = 'none';
    //document.getElementById("modalfix").style.display = "none";
    this.editor.precanvas.style.transform = this.transform;
    this.editor.precanvas.style.left = '0px';
    this.editor.precanvas.style.top = '0px';
    this.editor.editor_mode = 'edit';
  }
  changeModule(event : any) {
    var all = document.querySelectorAll('.menu ul li');
    for (var i = 0; i < all.length; i++) {
      all[i].classList.remove('selected');
    }
    event.target.classList.add('selected');
  }
  zoom_out() {
    this.editor.zoom_out();
  }
  zoom_reset() {
    this.editor.zoom_reset();
  }
  zoom_in() {
    this.editor.zoom_in();
  }
  lock() {
    this.editor.editor_mode = 'fixed';
    this.changeMode('lock');
  }
  unlock() {
    this.editor.editor_mode = 'edit';
    this.changeMode('');
  }
  changeMode(option : any) {
    //console.log(lock.id);
    if (option == 'lock') {
      document.getElementById('lock')!.style.display = 'none';
      document.getElementById('unlock')!.style.display = 'block';
    } else {
      document.getElementById('lock')!.style.display = 'block';
      document.getElementById('unlock')!.style.display = 'none';
    }
  }
  clear_drawFlow() {
    this.editor.clearModuleSelected();
  }
  export_drawFlow() {
    console.log(JSON.stringify(this.editor.export(), null, 4));
  }
  exportToCsvFile() {
    const abc: never[] = [];
    let csvStr = this.parseJSONToCSVStr(abc);
    let dataUri = 'data:text/csv;charset=utf-8,' + csvStr;

    let exportFileDefaultName = 'data.csv';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
  parseJSONToCSVStr(jsonData : any) {
    if (jsonData.length == 0) {
      return '';
    }

    let keys = Object.keys(jsonData[0]);
    console.log(jsonData[1]);
    let columnDelimiter = ',';
    let lineDelimiter = '\n';

    let csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;
    console.log(jsonData);
    jsonData.forEach((item : any) => {
      keys.forEach((key, index) => {
        if (index > 0 && index < keys.length - 1) {
          csvStr += columnDelimiter;
        }
        csvStr += item[key];
      });
      csvStr += lineDelimiter;
    });
    return encodeURIComponent(csvStr);
  }
}
