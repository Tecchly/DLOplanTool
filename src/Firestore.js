import { app } from "./Firebase";
import firestore from "firebase/firestore";
import firebase from "firebase";

var db = app.firestore();
class Firestore {

    static saveWithDocID(collection, docID, data) {
        return db.collection(collection).doc(docID).set(data, { merge: true });
    };

    static deleteDocument(collection, docID) {
        return db.collection(collection).doc(docID).delete();
    }

    static getCollection(collection) {
        return db.collection(collection).get();
    };

    static getDocument(collection, docID) {
        return db.collection(collection).doc(docID).get();
    }

    static getUserData(userID) {
        return db.collection("users").doc(userID);
    }

    static saveUser(email, username, uid) {
        return db.collection("users").add({
            email: email,
            timestamp: Date.now(),
            Name: username,
            uid: uid
        });
    }

    static getAllProjectsByUser(userID) {
        return db.collection("users").doc(userID).collection("projects");
    };

    static getRecentProjectsByUser(userID, number) {
        return db.collection("users").doc(userID).collection("projects").orderBy('creationTime', 'desc').limit(number);
    };

    static getProjectById(userID, projectID) {
        return this.getAllProjectsByUser(userID).doc(projectID);
    };

    static getAllIdeasByProject(userID, projectID) {
        return this.getProjectById(userID, projectID).collection("Ideas");
    };

    static saveToDBWithDocID(collection, docID, data) {
        return collection.doc(docID).set(data, { merge: true });
    };

    static saveIdeaToProject(userID, projectID, idea) {
        return this.saveToDBWithDocID(
            this.getAllIdeasByProject(userID, projectID),
            idea.id,
            idea
        );
    };

    static saveProjectToUser(userID, project) {
        return this.saveToDBWithDocID(
            this.getAllProjectsByUser(userID),
            project.id,
            project
        );
    };

    static saveNewProject(userID, projectData) {
        return db.collection("users").doc(userID).collection("projects").add(projectData);
    }

    static updateUserDetails() {
        var user = firebase.auth().currentUser;
        return db.collection('users').doc(user.uid).set({
            Name: user.displayName,
            email: user.email,
            uid: user.uid
        }, {
            merge: true
        });
    }
};

export default Firestore;
