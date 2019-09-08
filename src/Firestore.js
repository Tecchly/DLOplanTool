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

    static getDocData(collection, docID) {
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
};

export default Firestore;
