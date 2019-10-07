import { app } from "./Firebase";
import firebase from "firebase";

let firestore = app.firestore();

let users = firestore.collection("users");

let getProjectsReference = userID => users.doc(userID).collection("projects");
let getSharedProjectsReference = userID => users.doc(userID).collection("sharedProjects");
let getIdeasReference = (userID, projectID) => getProjectsReference(userID).doc(projectID).collection("ideas");
let getCommendationsReference = (userID, projectID, ideaID) => getIdeasReference(userID, projectID).doc(ideaID).collection("commendations");
let getRecommendationsReference = (userID, projectID, ideaID) => getIdeasReference(userID, projectID).doc(ideaID).collection("recommendations");
let getAmplificationsReference = (userID, projectID, ideaID) => getIdeasReference(userID, projectID).doc(ideaID).collection("amplifications");

class Firestore {
    
    static getUser(userID) {
        return users.doc(userID).get();
    }

    /**
     *  Gets the collection for all users
     *  @param orderd: if the output should be ordered by creation time 
     */
    static getProjects(userID, ordered = false) {
        let projects = getProjectsReference(userID);
        if (ordered) {
            projects = projects.orderBy('creationTime', 'asc');
        }
        return projects.get();
    };

    static getRecentProjects(userID, number) {
        return getProjectsReference(userID).orderBy('creationTime', 'desc').limit(number).get();
    };

    static getIdeas(userID, projectID) {
        return getIdeasReference(userID, projectID).get();
    };

    //save a singular idea to the project.
    static saveIdea(userID, projectID, ideaID, idea) {
        return getIdeasReference(userID, projectID).doc(ideaID).set({
            title: idea.title,
            mode: idea.mode,
            notes: idea.notes,
            parentID: idea.parentID,
        })
    }

    static deleteIdea(userID, projectID, ideaID) {
        return getIdeasReference(userID, projectID).doc(ideaID).delete();
    }

    static saveProject(userID, project) {
        return getProjectsReference(userID).add(project);
    }

    static setColor(userID, color) {
        return users.doc(userID).update({
            color: color
        });
    }

    static archiveProject(userID, projectID) {
        return getProjectsReference(userID).doc(projectID).update({
            archived: true
        });
    }

    static editProject(userID, projectID, data) {
        return getProjectsReference(userID).doc(projectID).update(data);
    }

    static getUsersByEmail(email) {
        return users.where("email", "==", email).get();
    }

    static shareProject(userID, sharedProject) {
        return getSharedProjectsReference(userID).doc(sharedProject.id).set(
            sharedProject, 
            { 
                merge: true 
            }
        );
    }

    static getSharedProjects(userID) {
        return getSharedProjectsReference(userID).orderBy('shareTime', 'desc').get();
    };

    static saveCommendation(userID, projectID, ideaID, commenterID, commendation) {
        return getCommendationsReference(userID, projectID, ideaID).doc(commenterID).set(commendation);
    }

    static updateUserDetails() {
        var user = firebase.auth().currentUser;
        if (user) {
            return users.doc(user.uid).set({
                username: user.displayName,
                email: user.email,
                uid: user.uid
            }, { 
                merge: true 
            });
        } else {
            Promise.reject(new Error('Not authenticated.'));
        }
    }

    static getUsers() {
        return users.get();
    };

    static shareListener(userID) {
        return getSharedProjectsReference(userID);
    }

    static getCommendations(userID, projectID, ideaID) {
        return getCommendationsReference(userID, projectID, ideaID);
    }

    static saveRecommendation(userID,projectID,ideaID,commentID,recommendation) {
        return getRecommendationsReference(userID, projectID, ideaID).doc(commentID).set(recommendation);
    }

    static getRecommendations(userID,projectID,ideaID) {
        return getRecommendationsReference(userID,projectID,ideaID);
    }

    static saveAmplification(projectID,ideaID,amplificationID,amplification) {
        console.log(user);
        console.log(projectID);
        console.log(ideaID);
        console.log(amplificationID);
        console.log(amplification);
        var user = firebase.auth().currentUser.uid;
        return getAmplificationsReference(user, projectID, ideaID).doc(amplificationID).set(amplification);
    }

    static getAmplifications(userID,projectID,ideaID) {
        return getAmplificationsReference(userID,projectID,ideaID);
    }

    static getProjectsCollection(userID) {
        return getProjectsReference(userID);
    };

};

export default Firestore;
