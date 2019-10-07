import React from "react";
import "./style.scss";
import ModeSelectionMenu from "./ModeSelectionMenu.js"
import FeedbackBar from "./FeedbackBar.js"

class IdeaEditPopup extends React.Component {
    constructor(props) {
        super(props);

    }

    state = {
        title:'',
        mode:'',
        notes:'',
        icon:'ios-bulb',
        commendations: [],
    }

    //Use for loading commendations
    addCommendations = x =>{
        var data = x.data();
        this.setState({
            commendations: {
              ...this.state.commendations,
              [`${x.id}`]: data
            }
          });
    }

    componentDidMount(){
        if (this.props.title) {
            this.setState({title:this.props.title});
        }

        if (this.props.mode) {
            this.setState({mode:this.props.mode});
        }

        if  (this.props.notes) {
            this.setState({notes:this.props.notes});
        }
        console.log(this.props.mode)

        if  (this.props.mode == "Podcast") {
            this.setState({availMode:["Audio"]});
        }

        //Loading the commendations of the idea
        this.props.loadCommendations(this.props.uuid)
        .get()
        .then(
            function(commendations){
                commendations.forEach(x=>{
                    //add the commendation as a index to an array.
                    this.addCommendations(x);
                })
            }.bind(this)
        );        
    }

    handleTitleChange = (event)=> {
        if (event.target.value.length < 25){
            this.setState({title: event.target.value});
        }       
    }

    handleNotesChange = (event)=> {
        this.setState({notes: event.target.value});
    }
    
    handleModeChange = (mode) => {
        this.setState({mode:mode}); 
    }

    render(){
        return(
            <React.Fragment>
            <div className="popup" >
                <div className="inner">
                    <div className = {this.state.availMode} guide="chooseModeType">
                        <ModeSelectionMenu 
                            availableModes = {this.props.shared ? [this.state.mode] : this.props.availableModes}
                            handleModeChange = {this.handleModeChange} 
                            currentMode = {this.state.mode}
                            disabled = {this.props.shared ? true: false }
                            className="modeTypeMenu"
                            />
                    </div>
                    <input 
                        type="text"
                        className = "textInput heading"
                        value={this.state.title} 
                        onChange={this.handleTitleChange} 
                        disabled = {this.props.shared ? true: false }
                        guide="inputIdeaTitle"
                        />
                    <textarea 
                        value={this.state.notes} 
                        onChange={this.handleNotesChange}
                        disabled = {this.props.shared ? true: false }
                        guide="inputIdeaNotes"
                        />
                    <div guide="feedbackbar"><FeedbackBar
                        shared ={this.props.shared} 
                        handleCommend ={this.props.handleCommend}
                        uuid = {this.props.uuid} 
                        commendations = {this.state.commendations}/>
                        </div>
                    <div
                    style={{marginLeft:"25%", marginRight:"25%",display:"flex", flexDirection:"row"}}>
                    {this.props.shared ? null : (
                        <button
                            guide="doneButton"
                            className= "selectButton"
                            onClick ={()=>{
                               this.props.handleEdit(this.state.title,this.state.notes, this.state.mode);                                
                            }}>
                            Done
                        </button>)}
                        <button
                            guide="cancelButton"
                            className= "selectButton"
                            onClick ={()=>{
                                this.props.closePopup();
                            }}                 
                        >{this.props.shared ? "Close" : "Cancel" }
                        </button>
                    </div>

                    </div>
                </div>
            </React.Fragment>
        )
    }

}
export default IdeaEditPopup