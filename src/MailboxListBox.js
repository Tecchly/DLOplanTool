import React from 'react';
// import Pagination from 'react-js-pagination';
import MailboxList from "./MailboxList";
import Firestore from "./Firestore";
import firebase from "firebase";
import Pagination from "react-bootstrap/Pagination";
// import Pagination from 'react-bootstrap/Pagination';

class MailboxListBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            offset: 0,
            active: 1,
            pageSize: this.props.pageSize,
            showFirst: true,
            showPrev: true,
            showNext: true,
            showLast: true
        };
        this.handlePageChange = this.handlePageChange.bind(this);
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
            // this.toggleFirstPrevNextLast();
        });

    }

    componentDidMount() {
        this.getShareList();
    }

    // toggleFirstPrevNextLast() {
    //     let offset = this.state.offset;
    //     if (offset == 0 || this.state.pageCount < 1) {
    //         this.setState({ showPrev: false, showFirst: false });
    //     } else if (this.state.pageCount < 1 || offset == this.state.pageCount - 1) {
    //         this.setState({ showNext: false, showLast: false });
    //     } else {
    //         this.setState({ showPrev: true, showFirst: true, showNext: true, showLast: true });
    //     }
    // }

    handlePageChange(e) {
        console.log(e.target.text);
        let offset = this.state.offset;
        if (offset > 0 && "‹Previous" === e.target.text) {
            offset = offset - 1;
        } else if ("«First" === e.target.text) {
            offset = 0;
        } else if ("»Last" === e.target.text) {
            offset = this.state.pageCount - 1;
        } else if (offset < this.state.pageCount - 1 && "›Next" === e.target.text) {
            offset = offset + 1;
        } else {
            offset = parseInt(e.target.text) - 1;
        }
        this.setState({ offset: offset, active: offset + 1 });
        this.generatePageItems();
    };

    generatePageItems() {
        let items = [];
        if (this.state.pageCount <= 10) {
            for (let i = 1; i <= this.state.pageCount; i++) {
                items.push(<Pagination.Item key={i} active={i === this.props.active}>{i}</Pagination.Item>)
            }
        } else {
            items = [];
            for (let i = this.state.active; i <= this.state.pageCount; i++) {
                items.push(<Pagination.Item key={i} active={i === this.props.active}>{i}</Pagination.Item>)
            }
            let leftpad = items.length;
            if (leftpad < 10 && this.state.active > leftpad) {
                let tmpitems = items;
                items = [];
                for (let i = this.state.active - leftpad; i < this.state.active; i++) {
                    items.push(<Pagination.Item key={i} active={i === this.props.active}>{i}</Pagination.Item>);
                }
                items.push(tmpitems);
            }
        }
        return items;
    }

    render() {
        return (
            <div className="messageBox">
                <MailboxList data={this.state.data.slice(this.state.offset * this.state.pageSize, (this.state.offset + 1) * this.state.pageSize)} loadProject={this.props.loadProject}/>
                <Pagination onClick={this.handlePageChange}>
                    {this.state.showFirst ? (<Pagination.First />) : null}
                    {this.state.showPrev ? (<Pagination.Prev />) : null}
                    {this.generatePageItems()}
                    {this.state.showNext ? (<Pagination.Next />) : null}
                    {this.state.showLast ? (<Pagination.Last />) : null}
                </Pagination>
            </div>
        );
    }
}

export default MailboxListBox;