import { app } from "./Firebase";
import firestore from "firebase/firestore";
import React from 'react';

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
    }
};

export default Firestore;