import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Firestore from "./Firestore";
import firebase from "firebase";
import "./style.scss";
import moment from "moment";
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
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "95%",
    marginBottom: theme.spacing(2),
    marginLeft: "2%"
  },
  table: {
    minWidth: 550
  },
  tableWrapper: {
    overflowX: "auto"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

const NotificationTable = props => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(props.pageSize);
  const [rows, pushRows] = React.useState([]);

  const addRows = row => {
    pushRows(oldArray => [...oldArray, row]);
  };

  function getShareList() {
    var user = firebase.auth().currentUser;
    if (user) {
      Firestore.getSharedProjects(user.uid).then(docs => {
        docs.forEach(doc => {
          var proj = doc.data();
          addRows(proj);
        });
      }).catch(error => {
        console.error("Get shared projects failure, " + error);
      });
    } else {
      console.error("Not authenticated.");
    }
  }

  useEffect(() => {
    getShareList();
  }, []);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  //   const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <TableBody>
              {stableSort(rows, getSorting("desc", "shareTime"))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow tabIndex={-1} key={row.id}>
                      <TableCell
                        classes={{ root: "notificationTableCell" }}
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <h6 style={{ float: "left" }}>
                          {row.createUser + " shared project "}
                          <a
                          className="sharedProjectLink"
                            onClick={() => {
                              props.loadProject(row);
                            }}
                          >
                            {row.title}
                          </a>
                          {" with you."}
                        </h6>
                        <h6 style={{ textAlign: "right", float: "right" }}>
                          {moment(row.shareTime).isSame(moment(), 'day') ? moment(row.shareTime).format('LT') : moment(row.shareTime).format('MMM D')}

                        </h6>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
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
            "aria-label": "previous page"
          }}
          nextIconButtonProps={{
            "aria-label": "next page"
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default NotificationTable;
