import { app } from "./Firebase";
import firestore from "firebase/firestore";

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

    static deleteDocument(collection, docID) {
        return db.collection(collection).doc(docID).delete();
    }

    static getCollection(collection) {
        return db.collection(collection).get();
    };

    static getDocument(collection, docID) {
        return db.collection(collection).doc(docID).get()
            //.then(function (doc) {
            //    if (doc.exists) {
            //        return doc.data();
            //    } else {
            //        console.log("No such document!");
            //    }
            //}).catch(function (error) {
            //    console.log("Error getting document:", error);
            //});
    };

    static saveUser(email, username) {
        return db.collection("users").add({
            email: email,
            timestamp: Date.now(),
            username: username
        });
    }

    static getAllProjectsByUser(userID) {
        return db.collection("users").doc(userID).collection("projects"); 
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
};

export default Firestore;
