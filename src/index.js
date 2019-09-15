import React from 'react';
import ReactDOM from 'react-dom';
import {SketchField, Tools} from 'react-sketch';
import { IconButton, CreateIcon, Slider, Button, Card } from '@material-ui/core';

// Icons
import PencilIcon from '@material-ui/icons/Create';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import Stop from '@material-ui/icons/ChangeHistory';

class Preview extends React.Component {
    render() {
        var flexStyle = {display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginLeft:'20px', marginBottom:'170px'}

        return (
            <div style={flexStyle}>
                <Title text={"Preview"} />
                <Subtitle text={"This is the preview of your artwork."} />
                <img style={{width:'400px', height:'400px', backgroundColor:'#f9f9f9'}} src={this.props.imageRef}></img>                
            </div>
        );
    }
}

class Title extends React.Component {
    render() {
        return (
            <h1 style={{color:'black', textAlgin:'center', fontFamily:'Roboto', fontSize:'20px', fontWeight: '200'}}>
                {this.props.text}
            </h1>
        );
    }
}

class Subtitle extends React.Component {
    render() {
        return (
            <p style={{color:'#4a4a4a', textAlgin:'center', fontFamily:'Roboto', fontSize:'13px', fontWeight: '300'}}>
                {this.props.text}
            </p>
        );
    }
}

class PaleteButton extends React.Component {
    render() {
        var color = 'default'

        if (this.props.selected === this.props.button_id) {            
            color = 'primary'
        }

        return (
            <div style={{margin:'5px'}}>
                <Button onClick={() => this.props.clicked(this.props.button_id, this.props.color)} color={color}>{this.props.text}</Button>
            </div>
        );
    }
}

class Toolbar extends React.Component {

    state = {brushSize:30, isPencil:true}

    render() {   
        var pencilColor = 'primary'
        var boxStyle = 'default'

        if (this.state.isPencil == false) {
            pencilColor = 'default'
            boxStyle = 'primary'
        }      

        return (
            <Card style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', margin:'10px', alignItems:'flex-start', marginTop:'20px'}}>

                <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', margin:'10px', marginButton:'0px'}}>
                    <IconButton onClick={() => {this.props.pencil(); this.setState({isPencil:true})}}> <PencilIcon color={pencilColor} /> </IconButton>
                    <IconButton onClick={() => {this.props.rect(); this.setState({isPencil:false})}}> <Stop color={boxStyle} /> </IconButton>
                    <IconButton onClick={ () => this.props.undo() }> <Undo /> </IconButton>
                    <IconButton onClick={ () => this.props.redo() }> <Redo /> </IconButton>                 
                </div>

                <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', margin:'10px', padding:'10px', width:'340px', marginTop:'0px'}}>
                    <Subtitle text={"Brush size: "}/>
                    <Slider defaultValue={30} min={10} max={100} style={{width:'200px', marginLeft:'10px'}} step={10} valueLabelDisplay={'auto'} marks={true} onChange={ (e, val) => this.props.brushSizeChanged(val) } />
                </div>
            </Card>
        );
    }
}

class Palate extends React.Component {

    state = {selected:1}

    selectButton = (val, color) => {        
        this.setState({selected:val})
        this.props.changeColor(color)
    }

    render() {
        return (
            <Card style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', margin:'10px', alignItems:'center', padding:'10px', height:'300px', flexWrap:'wrap', width:'250px', marginBottom:'100px', marginRight:'20px'}}>
                <PaleteButton text="Sky" selected={this.state.selected} button_id={1} clicked={this.selectButton} color='#fc0303' />
                <PaleteButton text="Ocean" selected={this.state.selected} button_id={2} clicked={this.selectButton} color='#fc7b03' />
                <PaleteButton text="Cloud" selected={this.state.selected} button_id={3} clicked={this.selectButton} color='#fcdb03' />
                <PaleteButton text="Mountain" selected={this.state.selected} button_id={4} clicked={this.selectButton} color='#c6fc03' />
                <PaleteButton text="Sand" selected={this.state.selected} button_id={5} clicked={this.selectButton} color='#2dfc03' />
                <PaleteButton text="Hill" selected={this.state.selected} button_id={6} clicked={this.selectButton} color='#03fc6b' />
                <PaleteButton text="Tree" selected={this.state.selected} button_id={7} clicked={this.selectButton} color='#03b5fc' />
                <PaleteButton text="Rock" selected={this.state.selected} button_id={8}  clicked={this.selectButton} color='#0335fc' />
                <PaleteButton text="Bush" selected={this.state.selected} button_id={9} clicked={this.selectButton} color='#9403fc' />
            </Card>
        );
    }
}

class PaintCanvas extends React.Component {

    state = {
        tool: Tools.Pencil,
        color:'#fc0303',
        brushSize:30,
        canUndo:false,
        canRedo:false        
        };
    // state = { tool: Tools.Rectangle };

    render() {
        var flexStyle = {display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}

        return (
            <div style={flexStyle}>
                <Title text={"Canvas"} />
                <Subtitle text={"This is where you draw your image."} />
                <SketchField
                    name="sketch"
                    ref={c => (this._sketch = c)}
                    style={{backgroundColor:'#f9f9f9'}} width='400px' 
                    height='400px'
                    tool={this.state.tool}
                    lineColor={this.props.color}
                    fillColor={this.props.color}
                    lineWidth={this.state.brushSize}
                    onChange={this._onSketchChange}
                />
                <Toolbar brushSizeChanged={this.changeBrush} undo={this.undo} redo={this.redo} rect={this.setRectangle} pencil={this.setPencil} />
            </div>
        );
    }

    _download = () => {
        this.props.updatePreviewImage(this._sketch.toDataURL())        
    };

    _onSketchChange = () => {
        this._download();        
        let prev = this.state.canUndo;
        let now = this._sketch.canUndo();
        if (prev !== now) {
          this.setState({ canUndo: now });
        }
      };

    changeBrush = (val) => {
        this.setState({brushSize: val});
    }

    setRectangle = () => {
        this.setState({tool: Tools.Rectangle});
    }

    setPencil = () => {
        this.setState({tool: Tools.Pencil});
    }

    undo = () => {
        if (this.state.canUndo == true) {  
            this._sketch.undo();
            this.setState({
                canUndo: this._sketch.canUndo(),
                canRedo: this._sketch.canRedo(),
            });
        }
    }

    redo = () => {
        if (this.state.canRedo == true) {
            this._sketch.redo();  
             this.setState({
                canUndo: this._sketch.canUndo(),
                canRedo: this._sketch.canRedo(),
            });  
        }        
    }
}

class PaintCanvasHolder extends React.Component {

    state = {color:'#fc0303', 'imageRef':undefined}

    render() {

        var flexStyle = {backgroundColor:'white', 
                         display:'flex',
                         flexDirection:'row',                                                  
                         alignItems:'center',
                         flexWrap:'wrap-reverse'                                          
                        }
        return (
            <div style={flexStyle}>                
                <Palate changeColor={this.changeColor}/>
                <PaintCanvas color={this.state.color} updatePreviewImage={this.updatePreviewImage} />
                <Preview imageRef={this.state.imageRef} />               
            </div>
        );
    }

    updatePreviewImage = (imageRef) => {
        this.setState({imageRef:imageRef})
    }

    changeColor = (color) => {
        this.setState({color:color})
    }
}

class UIContainer extends React.Component {
    render() {
        var flexStyle = {backgroundColor:'white', 
                         display:'flex',
                         flexDirection:'row',
                         flexWrap:'wrap',
                         justifyContent:'space-evenly',
                         alignItems:'center'
                        }

        return (            
            <div style={flexStyle}>
                <PaintCanvasHolder />                             
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return <UIContainer />;
    }
}

ReactDOM.render(<App />, document.querySelector('#root'));