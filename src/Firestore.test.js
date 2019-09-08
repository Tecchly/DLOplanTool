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

    it("saves document", () => {
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
    
    it("overrides document", () => {
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
    it("deletes document", () => {
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
            console.error("cleanup fail, please manually delete collection " + collectionName + ", causing error: " + error);
        });
    });

    it("gets collection", () => {
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
            console.error("cleanup fail, please manually delete collection" + collectionName + ", causing error: " + error);
        });
    });

    it("gets document", () => {
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

describe("saveUser", () => {
    let id = "";
    let email = "testuser@gmail.com";
    let username = "testUser";
    
    afterAll(() => {
        return Firestore.deleteDocument("users", id).then(() => {
        }).catch(error => {
            console.error("cleanup fail, please manually delete user " + id + ", causing error: " + error);
        });
    });

    it("saves user", () => {
        let beforeSave = Date.now();
        return Firestore.saveUser(email, username).then(doc => {
            let afterSave = Date.now();
            id = doc.id;
            return doc.get().then(doc => {
                if (doc.exists) {
                    let user = doc.data();
                    expect(user.email).toEqual(email);
                    expect(user.timestamp).toBeGreaterThanOrEqual(beforeSave);
                    expect(afterSave).toBeGreaterThanOrEqual(user.timestamp);
                    expect(user.username).toEqual(username);                    
                } else {
                    fail("user data missing");
                }
            }).catch(error => {
                fail("error retrieving user: " + error);
            });
        }).catch(error => {
            fail("error saving user: " + error);
        });
    });
});

describe("getAllProjectsByUser", () => {
    let userId = "";
    let project = {
        id: "1",
        val: "x"
    };

    afterAll(() => {
        return Firestore.deleteDocument("users", userId).then(() => {
        }).catch(error => {
            console.error("cleanup fail, please manually delete user " + userId + ", causing error: " + error);
        });
    });

    it("gets user projects", () => {
        return Firestore.saveUser("test@gmail.com", "test").then(doc => {
            userId = doc.id;
            return Firestore.saveProjectToUser(userId, project).then(() => {
                return Firestore.getAllProjectsByUser(userId).get().then(projects => {
                    expect(projects.size).toEqual(1);
                    expect(projects.docs[0].id).toEqual(project.id);
                    if (projects.docs[0].exists) {
                        let retrieved = projects.docs[0].data();
                        expect(retrieved.id).toEqual(project.id);
                        expect(retrieved.name).toEqual(project.name);
                    } else {
                        fail("project data missing");
                    }
                }).catch(error => {
                    fail("error retrieving projects: " + error);
                });
            }).catch(error => {
                fail("error saving project: " + error);
            });
        }).catch(error => {
            fail("error saving user: " + error);
        });
    });
});

describe("getProjectById", () => {
    let userId = "";
    let project = {
        id: "1",
        val: "x"
    };

    afterAll(() => {
        return Firestore.deleteDocument("users", userId).then(() => {
        }).catch(error => {
            console.error("cleanup fail, please manually delete user " + userId + ", causing error: " + error);
        });
    });

    it("retrieves user project", () => {
        return Firestore.saveUser("test@gmail.com", "test").then(doc => {
            userId = doc.id;
            return Firestore.saveProjectToUser(userId, project).then(() => {
                return Firestore.getProjectById(userId, project.id).get().then(retrieved => {
                    expect(retrieved.id).toEqual(project.id);
                    if (retrieved.exists) {
                        let retrievedData = retrieved.data();
                        expect(retrievedData.id).toEqual(project.id);
                        expect(retrievedData.val).toEqual(project.val);
                    } else {
                        fail("project data missing");
                    }
                }).catch(error => {
                    fail("error retrieving projects: " + error);
                });
            }).catch(error => {
                fail("error saving project: " + error);
            });
        }).catch(error => {
            fail("error saving user: " + error);
        });
    });
});

describe("getAllIdeasByProject", () => {
    let userId = "";
    let project = {
        id: "1",
        val: "x"
    };
    let idea = {
        id: "2",
        name: "abc"
    };

    afterAll(() => {
        return Firestore.deleteDocument("users", userId).then(() => {
        }).catch(error => {
            console.error("cleanup fail, please manually delete user " + userId + ", causing error: " + error);
        });
    });

    it("gets project ideas", () => {
        return Firestore.saveUser("test@gmail.com", "test").then(doc => {
            userId = doc.id;
            return Firestore.saveProjectToUser(userId, project).then(() => {
                return Firestore.saveIdeaToProject(userId, project.id, idea).then(() => {
                    return Firestore.getAllIdeasByProject(userId, project.id).get().then(ideas => {
                        expect(ideas.size).toEqual(1);
                        if (ideas.docs[0].exists) {
                            let retrieved = ideas.docs[0].data();
                            expect(retrieved.id).toEqual(idea.id);
                            expect(retrieved.name).toEqual(idea.name);
                        } else {
                            fail("idea data missing");
                        }
                    }).catch(error => {
                        fail("error retrieving ideas: " + error);
                    });
                }).catch(error => {
                    fail("error saving idea: " + error);
                });
            }).catch(error => {
                fail("error saving project: " + error);
            });
        }).catch(error => {
            fail("error saving user: " + error);
        });
    });
});

describe("saveToDBWithDocID", () => {
    let userId = "";
    let project = {
        id: "1",
        val: "x"
    };
    let project2 = {
        id: "1",
        val: "y"
    };

    afterAll(() => {
        return Firestore.deleteDocument("users", userId).then(() => {
        }).catch(error => {
            console.error("cleanup fail, please manually delete user " + userId + ", causing error: " + error);
        });
    });

    it("saves document", () => {
        return Firestore.saveUser("test@gmail.com", "test").then(doc => {
            userId = doc.id;
            return Firestore.saveToDBWithDocID(
                Firestore.getAllProjectsByUser(userId),
                project.id,
                project
            ).then(() => {
                return Firestore.getProjectById(userId, project.id).get().then(retrieved => {
                    expect(retrieved.id).toEqual(project.id);
                    if (retrieved.exists) {
                        let retrievedData = retrieved.data();
                        expect(retrievedData.id).toEqual(project.id);
                        expect(retrievedData.val).toEqual(project.val);
                    } else {
                        fail("missing project data");
                    }
                }).catch(error => {
                    fail("error retrieving project: " + error);
                });
            }).catch(error => {
                fail("error saving project: " + error);
            });
        }).catch(error => {
            fail("error saving user: " + error);
        });
    });
 
    it("overrides document", () => {
        return Firestore.saveToDBWithDocID(
            Firestore.getAllProjectsByUser(userId),
            project2.id,
            project2
        ).then(() => {
            return Firestore.getProjectById(userId, project2.id).get().then(retrieved => {
                expect(retrieved.id).toEqual(project2.id);
                if (retrieved.exists) {
                    let retrievedData = retrieved.data();
                    expect(retrievedData.id).toEqual(project2.id);
                    expect(retrievedData.val).toEqual(project2.val);
                } else {
                    fail("missing project data");
                }
            }).catch(error => {
                fail("error retrieving project: " + error);
            });
        }).catch(error => {
            fail("error saving project: " + error);
        });
    });
});

describe("saveIdeaToProject", () => {
    let userId = "";
    let project = {
        id: "1",
        val: "x"
    };
    let idea = {
        id: "2",
        name: "abc"
    };

    afterAll(() => {
        return Firestore.deleteDocument("users", userId).then(() => {
        }).catch(error => {
            console.error("cleanup fail, please manually delete user " + userId + ", causing error: " + error);
        });
    });

    it("saves idea", () => {
        return Firestore.saveUser("test@gmail.com", "test").then(doc => {
            userId = doc.id;
            return Firestore.saveProjectToUser(userId, project).then(() => {
                return Firestore.saveIdeaToProject(userId, project.id, idea).then(() => {
                    return Firestore.getAllIdeasByProject(userId, project.id).get().then(ideas => {
                        expect(ideas.size).toEqual(1);
                        if (ideas.docs[0].exists) {
                            let retrieved = ideas.docs[0].data();
                            expect(retrieved.id).toEqual(idea.id);
                            expect(retrieved.name).toEqual(idea.name);
                        } else {
                            fail("idea data missing");
                        }
                    }).catch(error => {
                        fail("error retrieving ideas: " + error);
                    });
                }).catch(error => {
                    fail("error saving idea: " + error);
                });
            }).catch(error => {
                fail("error saving project: " + error);
            });
        }).catch(error => {
            fail("error saving user: " + error);
        });
    });
});

describe("saveProjectByUser", () => {
    let userId = "";
    let project = {
        id: "1",
        val: "x"
    };

    afterAll(() => {
        return Firestore.deleteDocument("users", userId).then(() => {
        }).catch(error => {
            console.error("cleanup fail, please manually delete user " + userId + ", causing error: " + error);
        });
    });

    it("saves user project", () => {
        return Firestore.saveUser("test@gmail.com", "test").then(doc => {
            userId = doc.id;
            return Firestore.saveProjectToUser(userId, project).then(() => {
                return Firestore.getProjectById(userId, project.id).get().then(retrieved => {
                    expect(retrieved.id).toEqual(project.id);
                    if (retrieved.exists) {
                        let retrievedData = retrieved.data();
                        expect(retrievedData.id).toEqual(project.id);
                        expect(retrievedData.val).toEqual(project.val);
                    } else {
                        fail("project data missing");
                    }
                }).catch(error => {
                    fail("error retrieving projects: " + error);
                });
            }).catch(error => {
                fail("error saving project: " + error);
            });
        }).catch(error => {
            fail("error saving user: " + error);
        });
    });
});
