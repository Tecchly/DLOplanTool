import React from 'react';
import Pagination from 'react-js-pagination';
import MailboxList from "./MailboxList";
import Firestore from "./Firestore";
import firebase from "firebase";

class MailboxListBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            offset: 0,
            pageSize: this.props.pageSize
        };
    }

    getShareList() {
        var user = firebase.auth().currentUser;
        var sharedProjects = Firestore.getAllSharedProjectsByUser(user.uid);
        var listMessages = [];
        sharedProjects.get().then(docs => {
            docs.forEach(doc => {
                var proj = doc.data();
                listMessages.push(proj);
            });
            this.setState({ data: listMessages, pageCount: Math.ceil(listMessages.length / this.state.pageSize) });
        });

    }

    componentDidMount() {
        this.getShareList();
    }

    handlePageChange = (pageNumber) => {
        this.setState({ offset: pageNumber - 1 });
    };

    render() {
        return (
            <div className="messageBox">
                <MailboxList data={this.state.data.slice(this.state.offset * this.state.pageSize, (this.state.offset + 1) * this.state.pageSize)} />
                <div>
                    <Pagination
                        hideDisabled
                        activePage={this.state.offset}
                        itemsCountPerPage={this.state.pageSize}
                        totalItemsCount={this.state.data.length}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange}
                    />
                </div>
            </div>
        );
    }
}

export default MailboxListBox;