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


    /**
     *  Gets the collection for all users
     *  @param orderd: if the output should be ordered by creation time 
     */
    static getAllProjectsByUser(userID, ordered = false) {
        if (ordered) {
            return db.collection("users").doc(userID).collection("projects").orderBy('creationTime', 'asc');
        } else {
            return db.collection("users").doc(userID).collection("projects");
        }

    };

    static getRecentProjectsByUser(userID) {
        return db.collection("users").doc(userID).collection("projects").orderBy('creationTime', 'desc').limit(4);
    };

    static getProjectById(userID, projectID) {
        return this.getAllProjectsByUser(userID).doc(projectID);
    };

    static getAllIdeasByProject(userID, projectID) {
        return this.getProjectById(userID, projectID).collection("ideas");
    };

    static saveToDBWithDocID(collection, docID, data) {
        return collection.doc(docID).set(data, { merge: true })
        // .then(function () {
        //     console.log("written doc " + docID + " successfully");
        // }).catch(function (error) {
        //     console.error("Error writing document: ", error);
        // })
    };

    //@@TODO maybe deprecated due to storing ideas as an object and not an list 
    static saveIdeaToProject(userID, projectID, ideas) {
        var ideaCollection = this.getAllIdeasByProject(userID, projectID);
        ideas.forEach(function (idea) {
            this.saveToDBWithDocID(ideaCollection, idea.id, idea);
        });

    };

    //save a singular idea to the project.
    static saveSingleIdeaToProject(userID, projectID, ideaID, idea) {
        var ideaRef = db.collection("users").doc(userID).collection("projects").doc(projectID).collection("ideas").doc(ideaID);
        return ideaRef.set({
            title: idea.title,
            mode: idea.mode,
            notes: idea.notes,
            parentID: idea.parentID,
        })
    }

    static deleteIdeafromProject(userID, projectID, ideaID) {
        var ideaRef = db.collection("users").doc(userID).collection("projects").doc(projectID).collection("ideas").doc(ideaID).delete();
    }

    static saveProjectsToUser(userID, projects) {
        var projectCollection = this.getAllProjectsByUser(userID);
        projects.forEach(function (project) {
            this.saveToDBWithDocID(projectCollection, project.id, project);
        });
    };

    static saveNewProject(userID, projectData) {
        this.updateUserDetails();
        return this.getAllProjectsByUser(userID).add(projectData);
    }


    static archiveProject(userID, projectID) {
        this.updateUserDetails();
        return db.collection("users").doc(userID).collection("projects").doc(projectID).update({
            archived: true
        });
    }


    static editProjectFields(userID, projectID, data) {
        var ideaRef = this.getProjectById(userID, projectID);
        return ideaRef.update(data);
    }


    static updateUserDetails() {
        var user = firebase.auth().currentUser;
        return db.collection('users').doc(user.uid).set({
            Name: user.displayName,
            email: user.email,
            uid: user.uid
        }, { merge: true });
    }

    static queryUserByEmail(email) {
        return db.collection("users").where("email", "==", email);
    }

    static saveSharedProject(uid, sharedProjectData) {
        return db.collection("users").doc(uid)
            .collection("sharedProjects").doc(sharedProjectData.id)
            .set(sharedProjectData, { merge: true });
    }

    static getAllSharedProjectsByUser(userID) {
        return db.collection("users").doc(userID).collection("sharedProjects").orderBy('shareTime', 'desc');
    };

    static getUserEmails() {
        return db.collection("users").get();
    };

    static getAllFeedbacks(userID) {
        return this.getUserData(userID).collection("feedbacks").orderBy('timestamp', 'desc');
    }

};

export default Firestore;