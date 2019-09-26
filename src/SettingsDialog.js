import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ReactDOM from "react-dom";
import Firestore from "./Firestore.js";
import { app } from "./Firebase";
import { themeOptions } from "./styling/themeOptions";

const useStyles = makeStyles(theme => ({
  button: {
    display: "block",
    marginTop: theme.spacing(2)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300
  }
}));

const SettingsDialog = ({ open, hide }) => {
  const [colorScheme, setColorScheme] = React.useState(localStorage.getItem("colorScheme"));
  const [openList, setOpen] = React.useState(false);
  const classes = useStyles();

  function changeScheme(color) {
    const selectedTheme =
      themeOptions.find(t => t.name.toLowerCase() === color) || {};
    const html = document.getElementsByTagName("html")[0];
    const logo = document.getElementsByClassName("digitalD")[0];
    logo.setAttribute("src", require("./assets/images/logo_"+ localStorage.getItem("colorScheme") +".png"));
    Object.keys(selectedTheme).forEach((property, i) => {
      if (property === "name") {
        return;
      }
      html.style.setProperty(property, selectedTheme[property]);
    });
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleEntering = () => {};
  const handleChange = event => {
    localStorage.setItem("colorScheme", event.target.value);
    setColorScheme(event.target.value);
    changeScheme(event.target.value)
  };

  const handleOk = () => {
    changeScheme(colorScheme)
    localStorage.setItem("colorScheme", colorScheme);
    Firestore.setNewColor(app.auth().currentUser.uid, colorScheme);
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
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="demo-controlled-open-select">
                  Colour Scheme
                </InputLabel>
                <Select
                  open={openList}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  value={colorScheme}
                  onChange={handleChange}
                  inputProps={{
                    name: "colorScheme",
                    id: "open-select"
                  }}
                >
                  <MenuItem value="orange">Orange</MenuItem>
                  <MenuItem value="blue">Blue</MenuItem>
                  <MenuItem value="green">Green</MenuItem>
                  <MenuItem value="vibrant">Vibrant</MenuItem>
                  <MenuItem value="artsy">Artsy</MenuItem>
                  <MenuItem value="deep blue">Deep Blue</MenuItem>
                  <MenuItem value="modern">Modern</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
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
