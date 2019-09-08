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
        }).catch(error => {
            console.error("cleanup fail, please manually delete collection " + collectionName + ", causing error: " + error);
        });
    });

    it("saves new document", () => {
        return Firestore.saveWithDocID(collectionName, documentName, data).then(() => {
            return Firestore.getDocument(collectionName, documentName).then(doc => {
                if (doc.exists) {
                    let retrieved = doc.data();
                    expect(retrieved.str).toEqual(data.str);
                    expect(retrieved.num).toEqual(data.num);
                    expect(retrieved.bool).toEqual(data.bool);
                } else {
                    fail("document data missing");
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
            return Firestore.getDocument(collectionName, documentName).then(doc => {
                if (doc.exists) {
                    let retrieved = doc.data();
                    expect(retrieved.str).toEqual(data2.str);
                    expect(retrieved.num).toEqual(data2.num);
                    expect(retrieved.bool).toEqual(data2.bool);
                } else {
                    fail("document data missing");
                }
            }).catch(error => {
                fail("error retrieving document: " + error);
            });
        }).catch(error => {
            fail("error saving document: " + error);
        });
    });
});

describe("deleteDocument", () => {
    let collectionName = "testCollection";
    let documentName = "testDocument";
    it("deletes existing document", () => {
        return Firestore.saveWithDocID(collectionName, documentName, {x: "x"}).then(() => {
            return Firestore.deleteDocument(collectionName, documentName).then(() => {
            }).catch(error => {
                fail("delete fail, please manually delete " + collectionName + "." + documentName + ", causing error: " + error);
            });
        }).catch(error => {
            fail("error saving document: " + error);
        });
    });
});

describe("getCollection", () => {
    let collectionName = "testCollection";
    let documentName = "testDocument";
    let data = {
        str: "abc",
        num: 3.14,
        bool: true
    };

    afterAll(() => {
        return Firestore.deleteDocument(collectionName, documentName).then(() => {
        }).catch(error => {
            console.error("cleanup fail, please manually delete " + collectionName + "." + documentName + ", causing error: " + error);
        });
    });

    it("gets existing collection", () => {
        return Firestore.saveWithDocID(collectionName, documentName, data).then(() => {
            return Firestore.getCollection(collectionName).then(col => {
                expect(col.size).toEqual(1);
                if (col.docs[0].exists) {
                    let doc = col.docs[0].data();
                    expect(doc.str).toEqual(data.str);
                    expect(doc.num).toEqual(data.num);
                    expect(doc.bool).toEqual(data.bool);
                } else {
                    fail("document data missing");
                }
            }).catch(error => {
                fail("error retrieving collection: " + error);
            });
        }).catch(error => {
            fail("error saving document: " + error);
        });
    });
});

describe("getDocument", () => {
    let collectionName = "testCollection";
    let documentName = "testDocument";
    let data = {
        str: "abc",
        num: 3.14,
        bool: true
    };

    afterAll(() => {
        return Firestore.deleteDocument(collectionName, documentName).then(() => {
        }).catch(error => {
            console.error("cleanup fail, please manually delete " + collectionName + "." + documentName + ", causing error: " + error);
        });
    });

    it("gets existing document", () => {
        return Firestore.saveWithDocID(collectionName, documentName, data).then(() => {
            return Firestore.getDocument(collectionName, documentName).then(doc => {
                if (doc.exists) {
                    let retrieved = doc.data();
                    expect(retrieved.str).toEqual(data.str);
                    expect(retrieved.num).toEqual(data.num);
                    expect(retrieved.bool).toEqual(data.bool);
                } else {
                    fail("document data missing");
                }
            }).catch(error => {
                fail("error retrieving document: " + error);
            });
        }).catch(error => {
            fail("error saving document: " + error);
        });
    });
});
