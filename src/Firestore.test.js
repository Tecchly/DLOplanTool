import Firestore from './Firestore';

describe("saveWithDocID", () => {
    let collectionName = "testCollection";
    let documentName = "testDocument";
    let data = {
        str: "abc",
        num: 3.14,
        bool: true
    };

    it("saves new document", () => {
        return Firestore.saveWithDocID(collectionName, documentName, data).then(() => {
            return Firestore.getDocData(collectionName, documentName).then(doc => {
                if (doc.exists) {
                    let retrieved = doc.data();
                    expect(retrieved.str).toEqual(data.str);
                    expect(retrieved.num).toEqual(data.num);
                    expect(retrieved.bool).toEqual(data.bool);

                    // cleanup
                    return Firestore.deleteDocument(collectionName, documentName).then(() => {
                        console.log("saveWithDocID:saves new document cleanup success");
                    }).catch(error => {
                        console.error("saveWithDocID:saves new document cleanup fail, please cleanup manually: " + error);
                    });
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
