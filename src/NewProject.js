import React from 'react';  
import { app } from "./Firebase";
import "./index.css";
import { Button } from 'react-bootstrap';

class NewProjectPopup extends React.Component {
    constructor(props) {
        super(props)
        
    }

    render() {
        var togglePopup = this.props.togglePopup;
        return (
            <React.Fragment>
                <div className='popup'>
                    <div className='inner'>
                        <h1 
                        style = {{
                            textAlign: "center",
                            marginTop: "0.5em"
                        }} 
                        >NewProject</h1>  

                        <Button
                        onClick={() => 
                            togglePopup()
                          }
                        >???</Button>
                    </div>
                </div>

            </React.Fragment>      
        );
    }
}

export default NewProjectPopup