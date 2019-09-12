import { app } from "./Firebase";
import firestore from "firebase/firestore";
import firebase from "firebase";

var db = app.firestore();
class Firestore {

    static saveWithDocID(collection, docID, data) {
        return db.collection(collection).doc(docID).set(data, { merge: true })
            // .then(function() {
            //     // console.log("written doc " + docID + " successfully to collection " + collection);
            // }).catch(function (error) {
            //     console.error("Error writing document: ", error);
            // })
    };

    static getCollection(collection) {
        return db.collection(collection).get();
    };

    static getUserData(userID) {
        return db.collection("users").doc(userID);
    }

    static getDocData(collection, docID) {
        var docRef = db.collection(collection).doc(docID);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                return doc.data();
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    };

    static getAllProjectsByUser(userID) {
        return db.collection("users").doc(userID).collection("projects").orderBy('creationTime', 'asc'); 
    };

    static getRecentProjectsByUser(userID) {
        return db.collection("users").doc(userID).collection("projects").orderBy('creationTime', 'desc').limit(4); 
    };

    static getProjectById(userID, projectID) {
        return this.getAllProjectsByUser(userID).doc(projectID);
    };

    static getAllIdeasByProject(userID, projectID) {
        return this.getProjectById(userID, projectID).collection("Ideas");
    };

    static saveToDBWithDocID(collection, docID, data) {
        return collection.doc(docID).set(data, {merge : true})
        // .then(function () {
        //     console.log("written doc " + docID + " successfully");
        // }).catch(function (error) {
        //     console.error("Error writing document: ", error);
        // })
    };

    static saveIdeasToProject(userID, projectID, ideas) {
        var ideaCollection = this.getAllIdeasByProject(userID, projectID);
        ideas.forEach(function(idea) {
            this.saveToDBWithDocID(ideaCollection, idea.id, idea);
        });
    };

    static saveProjectsToUser(userID, projects) {
        var projectCollection = this.getAllProjectsByUser(userID);
        projects.forEach(function (project) {
            this.saveToDBWithDocID(projectCollection, project.id, project);
        });
    };

    static saveNewProject(userID, projectData) {
        this.updateUserDetails();
        return db.collection("users").doc(userID).collection("projects").add(projectData);
    }

    static updateUserDetails(){
        var user = firebase.auth().currentUser;
        return db.collection('users').doc(user.uid).set({
            Name:user.displayName, 
            email:user.email, 
            uid:user.uid}, {merge: true});
    }

};

export default Firestore;