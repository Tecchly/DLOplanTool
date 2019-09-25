import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ReactDOM from "react-dom";
const options = [
"Orange",
"Blue",
"Green"
];

const SettingsDialog = ({ open, hide }) => {
    const radioGroupRef = React.useRef(null);
    const [value, setValue] = React.useState("Orange");

    
      const handleEntering = () => {
        if (radioGroupRef.current != null) {
          radioGroupRef.current.focus();
        }
      };
    

    
      const handleChange = event => {
        setValue(event.target.value);
      };
    const handleCancel = () => {
        hide();
      };
    
      const handleOk = () => {
        hide();
      };



  return open
    ? ReactDOM.createPortal(
        <React.Fragment>
          <Dialog

            maxWidth="xs"
            onClose={hide}
            onEntering={handleEntering}
            aria-labelledby="confirmation-dialog-title"
            open={open}

          >
            <DialogTitle id="confirmation-dialog-title" onClose={hide}> 
              Colour Scheme
            </DialogTitle>
            <DialogContent dividers>
              <RadioGroup
                ref={radioGroupRef}
                aria-label="ringtone"
                name="ringtone"
                value={value}
                onChange={handleChange}
              >
                {options.map(option => (
                  <FormControlLabel
                    value={option}
                    key={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={handleOk} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default SettingsDialog;
