import Firestore from './Firestore';

describe("saveWithDocID", () => {
    let collectionName = "testCollection";
    let documentName = "testDocument";
    let data = {
        str: "abc",
        num: 3.14,
        bool: true
    };
    let data2 = {
        str: "def",
        num: 1.00,
        bool: false
    };

    afterAll(() => {
        return Firestore.deleteDocument(collectionName, documentName).then(() => {
            console.log("cleanup success: " + collectionName + "." + documentName + " deleted");
        }).catch(error => {
            console.error("cleanup fail, please manually delete " + collectionName + "." + documentName + ", causing error: " + error);
        });
    });

    it("saves new document", () => {
        return Firestore.saveWithDocID(collectionName, documentName, data).then(() => {
            return Firestore.getDocData(collectionName, documentName).then(doc => {
                if (doc.exists) {
                    let retrieved = doc.data();
                    expect(retrieved.str).toEqual(data.str);
                    expect(retrieved.num).toEqual(data.num);
                    expect(retrieved.bool).toEqual(data.bool);
                } else {
                    fail("document not found")
                }
            }).catch(error => {
                fail("error retrieving document: " + error);
            });
        }).catch(error => {
            fail("error saving document: " + error);
        });
    });
    
    it("overrides existing document", () => {
        return Firestore.saveWithDocID(collectionName, documentName, data2).then(() => {
            return Firestore.getDocData(collectionName, documentName).then(doc => {
                if (doc.exists) {
                    let retrieved = doc.data();
                    expect(retrieved.str).toEqual(data2.str);
                    expect(retrieved.num).toEqual(data2.num);
                    expect(retrieved.bool).toEqual(data2.bool);
                } else {
                    fail("document not found")
                }
            }).catch(error => {
                fail("error retrieving document: " + error);
            });
        }).catch(error => {
            fail("error saving document: " + error);
        });
    });
});
