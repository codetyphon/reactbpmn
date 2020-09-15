import React, { Component, Fragment } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
// import BpmnModeler from "./custom-modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
// import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/bpmn";
import propertiesProviderModule from "./provider/magic";
import magicModdleDescriptor from "./descriptors/magic";

import ZoomControls from "./components/ZoomControls";
import FileControls from "./components/FileControls";
import EditingTools from './components/EditingTools';

import "./style/app.less";

import xmlStr from "../../assets/bpmn/xmlStr";

let scale = 1;

export default class extends Component {
  componentDidMount() {
    document.body.className = "shown";

    this.bpmnModeler = new BpmnModeler({
      additionalModules: [propertiesPanelModule, propertiesProviderModule],
      container: "#canvas",
      propertiesPanel: {
        parent: "#properties-panel"
      },
      moddleExtensions: {
        magic: magicModdleDescriptor
      }
    });

    // this.bpmnModeler.on('commandStack.changed', this.onChange);

    const { xml = xmlStr } = this.props;

    this.renderDiagram(xml);
  }

  componentWillReceiveProps(nextProps) {
    const { xml } = nextProps;
    if (xml && xml !== this.props.xml) {
      this.renderDiagram(xml);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  renderDiagram = (xml) => {
    this.bpmnModeler.importXML(xml, err => {
      if (err) {
        // import failed :-(
        console.log("error rendering", err);
      } else {
        // we did well!
        this.bpmnModeler.getDefinitions()
        console.log("successfully rendered");
      }
    });
  };

  handleSave = (e) => {
    this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
      console.log(xml);
      console.log('这里可以post到服务器')
      // console.log(this.bpmnModeler.getDefinitions());
    });
  }

  handleRedo = () => {
    this.bpmnModeler.get('commandStack').redo();
  };

  handleUndo = () => {
    this.bpmnModeler.get('commandStack').undo();
  };

  handleZoom = () => {
    this.bpmnModeler.get('canvas').zoom(scale);
  }

  handleZoomIn = () => {
    scale += 0.1;
    this.handleZoom();
  };

  handleZoomOut = () => {
    if (scale <= 0.3) {
      scale = 0.2
    } else {
      scale -= 0.1;
    };
    this.handleZoom();
  };

  handleZoomReset = () => {
    scale = 1;
    this.handleZoom();
  };

  handleOpen = () => {
    console.log('open')
    this.upload.click()
  };

  handleCreate = () => {
    console.log('new')
    const { xml = xmlStr } = this.props;
    this.renderDiagram(xml);
  };

  handleSaveFile = () => {

  };

  handleSaveImage = () => {
    
  };

  //当打开文件时
  onChangeFile = (event) => {
    let _self = this
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new FileReader()
    reader.onload = function(event) {
      _self.renderDiagram(event.target.result)
    };
    reader.readAsText(file)
  }

  render() {
    return (
      <Fragment>
        <div className="content">
          <div id="canvas" />
          <div id="properties-panel" />
        </div>
        <ZoomControls
          onZoomIn={this.handleZoomIn}
          onZoomOut={this.handleZoomOut}
          onZoomReset={this.handleZoomReset}
        />
        <input id="file"
          type="file"
          multiple={false}
          ref={(ref) => this.upload = ref}
          style={{display: 'none'}}
          onChange={this.onChangeFile.bind(this)}
        />
        <FileControls
          onOpen={this.handleOpen}
          onCreate={this.handleCreate}
          onSaveFile={this.handleSaveFile}
          onSaveImage={this.handleSaveImage}
        />
        <EditingTools
          onSave={this.handleSave}
          onRedo={this.handleRedo}
          onUndo={this.handleUndo}
        />
      </Fragment>
    );
  }
}
