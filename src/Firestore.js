import { app } from "./Firebase";

var db = app.firestore();
class Firestore {

    static saveWithDocID(collection, docID, data) {
        db.collection(collection).doc(docID).set(data, { merge: true })
            .then(function() {
                db.collection(collection).doc(docID).update({
                    timestamp: Math.floor(Date.now())
                });
                console.log("written doc " + docID + " successfully to collection " + collection);
            }).catch(function (error) {
                console.error("Error writing document: ", error);
            })
    };

    static getCollection(collection) {
        return db.collection(collection).get();
    };

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

    static toArray(datas) {
        var array = [];
        datas.get().then(function (querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array[doc.docID] = doc.data();
            });
        });
        return array;
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
        collection.doc(docID).set(data, {merge : true})
        .then(function () {
            collection.doc(docID).update({
                timestamp: Math.floor(Date.now())
            });
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        })
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