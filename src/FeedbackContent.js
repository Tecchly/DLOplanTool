import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Firestore from "./Firestore";
import firebase from "firebase";
import moment from "moment";
import {withRouter} from "react-router";
import { Container, Row, Image } from "react-bootstrap";
import history from "./history";


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Messages' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={false}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all unread messages' }}
          />
        </TableCell>
        <TableCell /><TableCell />
        {/* {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))} */}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.primary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : null}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Mark As Read">
            {/* <IconButton aria-label="mark" size="small"> */}
              <Button color="primary" size="medium">Mark As Read</Button>
            {/* </IconButton> */}
          </Tooltip>
        ) : null}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '90%',
    marginBottom: theme.spacing(2),
    marginLeft: "5%"
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const FeedbackContent = (props) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, pushRows] = React.useState([]);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  const addRows = row => {
    pushRows(oldArray => [...oldArray, row]);
  };

  function getFeedbackList() {
    var uid = firebase.auth().currentUser.uid;
    
    // Firestore.getAllFeedbacks(uid).get().then(docs => {
    //   docs.forEach(doc => {
    //       var feedback = doc.data();
    //       addRows(feedback);
    //   });
    // });

    let projects = Firestore.getProjectsCollection(uid);
        projects.get().then(function (projectSnapshot) {
          projectSnapshot.forEach(function (project) {
            let ideas = projects.doc(project.id).collection("ideas");
            ideas.get().then(function (ideaSnapshot) {
              ideaSnapshot.forEach(function (idea) {
                ideas.doc(idea.id).collection("commendations").get().then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                    let feedback = {
                      ideaId: idea.id,
                      idea: idea.data(),
                      reviewerName: doc.data().commendUser,
                      reviewTime: doc.data().commendTime,
                      comment: doc.data().comment,
                      type: doc.data().commendation,
                      id: doc.id + "-" + idea.id,
                      projectId:  project.id,
                      project: project.data(),
                    };
                    addRows(feedback);
                  });});
              });
            });
          });
          
        });
  }

  useEffect(() => {
    getFeedbackList();
  }, []);


  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const noFeedback = () => {
    return (<Container
      className="d-flex align-items-center"
      style={{ marginTop: "20vh", flexDirection: 'column' }}
    >
      <Row></Row>
      <Row className="justify-content-md-center">
        <Image
          src={require("./assets/images/feedback.svg")}
          style={{ height: 220 }}
        />
      </Row>
      <Row className="justify-content-md-center">
        <h1
          style={{
            textAlign: "center",
            color: "#3A4A56",
            fontFamily: "Montserrat",
            fontWeight: "700",
            textAlign: "center",
            fontSize: 30
          }}
        >
          No Feedback
        </h1>
      </Row>
      <Row className="justify-content-md-center">
        <h2
          style={{
            textAlign: "center",
            color: "#8fa5b5",
            fontFamily: "Montserrat",
            fontWeight: "600",
            textAlign: "center",
            fontSize: 15
          }}
        >
          <br />
          <br />
          When feedback is given, you will see it here!
        </h2>
      </Row>
    </Container>);
  }

  return (
    rows.length === 0 ? noFeedback() : ( 
      <Container
      className="d-flex align-items-center"
    >
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            {/* <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={"desc"}
              orderBy={"reviewerTime"}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            /> */}
            <TableBody>
              {stableSort(rows, getSorting("desc", "reviewTime"))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.reviewerName);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.reviewerName)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell> */}
                      {/* <TableCell /> */}
                      <TableCell component="th" id={labelId} scope="row" padding="none">                      
                      <h6 style={{ float: "left" }}>
                          {row.reviewerName + " thought your idea "}
                          <a className="sharedProjectLink" onClick={() => {props.loadProject(row);}}> {row.idea.title} </a> {" of project "}
                          <a
                          className="sharedProjectLink"
                            onClick={() => {
                              props.loadProject(row);
                            } }
                          >
                            {row.project.title}
                          </a>
                          {" has a good " + row.type + "."}
                        </h6>
                        <h6 style={{ textAlign: "right", float: "right" }}>
                          {moment(row.reviewTime).isSame(moment(), 'day') ? moment(row.reviewTime).format('LT') : moment(row.reviewTime).format('MMM D')}

                        </h6>
                        </TableCell>
                      {/* <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell> */}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
    </Container>)
  );
}

export default withRouter(FeedbackContent);