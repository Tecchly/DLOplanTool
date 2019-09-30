import Firestore from './Firestore';
import { app } from "./Firebase";

let firestore = app.firestore();

let users = firestore.collection("users");

let getProjectsReference = userID => users.doc(userID).collection("projects");
let getIdeasReference = (userID, projectID) => getProjectsReference(userID).doc(projectID).collection("ideas");
let getSharedProjectsReference = userID => users.doc(userID).collection("sharedProjects");
let getCommendationsReference = (userID, projectID, ideaID) => getIdeasReference(userID, projectID).doc(ideaID).collection("commendations");

let getUser = userID => users.doc(userID).get();
let saveUser = (email, username, uid) => users.add({
    email: email,
    timestemp: Date.now(),
    username: username,
    uid: uid
});
let getProject = (userID, projectID) => getProjectsReference(userID).doc(projectID).get();
let saveProject = (userID, project) => getProjectsReference(userID).add(project);
let deleteUser = userID => users.doc(userID).delete();
let deleteProject = (userID, projectID) => getProjectsReference(userID).doc(projectID).delete();
let getIdeas = (userID, projectID) => getIdeasReference(userID, projectID).get();
let getIdea = (userID, projectID, ideaID) => getIdeasReference(userID, projectID).doc(ideaID).get();
let saveIdea = (userID, projectID, ideaID, idea) => getIdeasReference(userID, projectID).doc(ideaID).set({
    title: idea.title,
    mode: idea.mode,
    notes: idea.notes,
    parentID: idea.parentID
});
let deleteIdea = (userID, projectID, ideaID) => getIdeasReference(userID, projectID).doc(ideaID).delete();
let getSharedProject = (userID, sharedProjectID) => getSharedProjectsReference(userID).doc(sharedProjectID).get();
let shareProject = (userID, sharedProject) => getSharedProjectsReference(userID).doc(sharedProject.id).set(
    sharedProject,
    {
        merge: true
    }
);
let deleteSharedProject = (userID, sharedProjectID) => getSharedProjectsReference(userID).doc(sharedProjectID).delete();
let getCommendations = (userID, projectID, ideaID) => getCommendationsReference(userID, projectID, ideaID).get();
let saveCommendation = (userID, projectID, ideaID, commenterID, commendation) => getCommendationsReference(userID, projectID, ideaID).doc(commenterID).set(commendation);
let deleteCommendation = (userID, projectID, ideaID, commenterID) => getCommendationsReference(userID, projectID, ideaID).doc(commenterID).delete();

describe("getUser", () => {
    let docID = "";
    let email = "test@gmail.com";
    let username = "test";
    let uid = "1";

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return getUser(docID).then(snap => {
                if (snap.exists) {
                    console.error("Cleanup failure, delete user " + docID + ", " + error);
                }
            }).catch(error => {
                console.error("Delete user " + docID + " if necessary, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + ", " + error);
        });
    });

    it("gets user", () => {
        return saveUser(email, username, uid).then(user => {
            docID = user.id;
            return Firestore.getUser(docID).then(snap => {
                expect(snap.id).toEqual(docID);
                if (snap.exists) {
                    let user = snap.data();
                    expect(user.email).toEqual(email);
                    expect(user.username).toEqual(username);
                    expect(user.uid).toEqual(uid);
                } else {
                    fail("Data missing.");
                }
            }).catch(error => {
                fail(error);
            });
        }).catch(error => {
            fail("Save failure, " + error);
        });
    });
});

describe("getProjects", () => {
    let docID = "";
    let projectID = "";
    let project2ID = "";
    let project = {
        a: "a",
        creationTime: 1
    };
    let project2 = {
        a: "b",
        creationTime: 0
    };

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteProject(docID, projectID).then(() => {
                return deleteProject(docID, project2ID).then(() => {
                    return getUser(docID).then(snap => {
                        if (snap.exists) {
                            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                        }
                    }).catch(error => {
                        console.error("Delete user " + docID + " and its contents if necessary, " + error);
                    });
                }).catch(error => {
                    console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("gets projects", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return saveProject(docID, project).then(ref => {
                projectID = ref.id;
                return saveProject(docID, project2).then(ref2 => {
                    project2ID = ref2.id;
                    return Firestore.getProjects(docID).then(projects => {
                        expect(projects.size).toEqual(2);
                        if (projects.docs[0].exists) {
                            if (projects.docs[1].exists) {
                                let index = -1;
                                let index2 = -1;
                                for (let i = 0; i < 2; ++i) {
                                    if (projects.docs[i].id == projectID) {
                                        index = i;
                                    } else if (projects.docs[i].id == project2ID) {
                                        index2 = i;
                                    }
                                }
                                if (index == -1) {
                                    fail("Project missing.");
                                } else if (index2 == -1) {
                                    fail("Project missing.");
                                } else if (index == index2) {
                                    fail("Duplicate projects.");
                                }
                                let data = projects.docs[index].data();
                                let data2 = projects.docs[index2].data();
                                expect(data.a).toEqual(project.a);
                                expect(data.creationTime).toEqual(project.creationTime);
                                expect(data2.a).toEqual(project2.a);
                                expect(data2.creationTime).toEqual(project2.creationTime);
                            } else {
                                fail("Data missing.");
                            }
                        } else {
                            fail("Data missing.");
                        }
                    }).catch(error => {
                        fail(error);
                    });
                }).catch(error => {
                    fail("Project save failure, " + error);
                });
            }).catch(error => {
                fail("Project save failure, " + error);
            });
        }).catch(error => {
            fail("User save failure, " + error);
        });
    });

    it("gets projects in order", () => {
        return Firestore.getProjects(docID, true).then(projects => {
            expect(projects.size).toEqual(2);
            if (projects.docs[0].exists) {
                if (projects.docs[1].exists) {
                    let data = projects.docs[0].data();
                    let data2 = projects.docs[1].data();
                    expect(data.a).toEqual(project2.a);
                    expect(data.creationTime).toEqual(project2.creationTime);
                    expect(data2.a).toEqual(project.a);
                    expect(data2.creationTime).toEqual(project.creationTime);
                } else {
                    fail("Data missing.");
                }
            } else {
                fail("Data missing.");
            }
        }).catch(error => {
            fail(error);
        });
    });
});

describe("getRecentProjects", () => {
    let docID = "";
    let projectID = "";
    let project2ID = "";
    let project3ID = "";
    let project = {
        val: "x",
        creationTime: 2
    };
    let project2 = {
        val: "y",
        creationTime: 1
    };
    let project3 = {
        val: "z",
        creationTime: 0
    };

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteProject(docID, projectID).then(() => {
                return deleteProject(docID, project2ID).then(() => {
                    return deleteProject(docID, project3ID).then(() => {
                        return getUser(docID).then(snap => {
                            if (snap.exists) {
                                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                            }
                        }).catch(error => {
                            console.error("Delete user " + docID + " and its contents if necessary, " + error);
                        });
                    }).catch(error => {
                        console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                    });
                }).catch(error => {
                    console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("gets recent projects", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return saveProject(docID, project).then(ref => {
                projectID = ref.id;
                return saveProject(docID, project2).then(ref2 => {
                    project2ID = ref2.id;
                    return saveProject(docID, project3).then(ref3 => {
                        project3ID = ref3.id
                        return Firestore.getRecentProjects(docID, 2).then(projects => {
                            expect(projects.size).toEqual(2);
                            expect(projects.docs[0].id).toEqual(projectID);
                            expect(projects.docs[1].id).toEqual(project2ID);
                            if (projects.docs[0].exists) {
                                if (projects.docs[1].exists) {
                                    let data = projects.docs[0].data();
                                    let data2 = projects.docs[1].data();
                                    expect(data.val).toEqual(project.val);
                                    expect(data.creationTime).toEqual(project.creationTime);
                                    expect(data2.val).toEqual(project2.val);
                                    expect(data2.creationTime).toEqual(project2.creationTime);
                                } else {
                                    fail("Data missing.");
                                }
                            } else {
                                fail("Data missing.");
                            }
                        }).catch(error => {
                            fail(error);
                        });
                    }).catch(error => {
                        fail("Project save failure, " + error);
                    });
                }).catch(error => {
                    fail("Project save failure, " + error);
                });
            }).catch(error => {
                fail("Project save failure, " + error);
            });
        }).catch(error => {
            fail("User save failure, " + error);
        });
    });
});

describe("getIdeas", () => {
    let docID = "";
    let projectID = "";
    let ideaID = "1";
    let project = {
        val: "x"
    };
    let idea = {
        title: "a",
        mode: "b",
        notes: "c",
        parentID: "d"
    };

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteProject(docID, projectID).then(() => {
                return deleteIdea(docID, projectID, ideaID).then(() => {
                    return getUser(docID).then(snap => {
                        if (snap.exists) {
                            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                        }
                    }).catch(error => {
                        console.error("Delete user " + docID + " and its contents if necessary, " + error);
                    });
                }).catch(error => {
                    console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("gets ideas", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return saveProject(docID, project).then(ref => {
                projectID = ref.id;
                return saveIdea(docID, projectID, ideaID, idea).then(() => {
                    return Firestore.getIdeas(docID, projectID).then(ideas => {
                        expect(ideas.size).toEqual(1);
                        expect(ideas.docs[0].id).toEqual(ideaID);
                        if (ideas.docs[0].exists) {
                            let data = ideas.docs[0].data();
                            expect(data.title).toEqual(idea.title);
                            expect(data.mode).toEqual(idea.mode);
                            expect(data.notes).toEqual(idea.notes);
                            expect(data.parentID).toEqual(idea.parentID);
                        } else {
                            fail("Data missing.");
                        }
                    }).catch(error => {
                        fail(error);
                    });
                }).catch(error => {
                    fail("Idea save failure, " + error);
                });
            }).catch(error => {
                fail("Project save failure, " + error);
            });
        }).catch(error => {
            fail("User save failure, " + error);
        });
    });
});

describe("saveIdea", () => {
    let docID = "";
    let projectID = "";
    let ideaID = "1";
    let project = {
        val: "x"
    };
    let idea = {
        title: "a",
        mode: "b",
        notes: "c",
        parentID: "d"
    };

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteProject(docID, projectID).then(() => {
                return deleteIdea(docID, projectID, ideaID).then(() => {
                    return getUser(docID).then(snap => {
                        if (snap.exists) {
                            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                        }
                    }).catch(error => {
                        console.error("Delete user " + docID + " and its contents if necessary, " + error);
                    });
                }).catch(error => {
                    console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("saves idea", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return saveProject(docID, project).then(ref => {
                projectID = ref.id;
                return Firestore.saveIdea(docID, projectID, ideaID, idea).then(() => {
                    return getIdeas(docID, projectID).then(ideas => {
                        expect(ideas.size).toEqual(1);
                        expect(ideas.docs[0].id).toEqual(ideaID);
                        if (ideas.docs[0].exists) {
                            let data = ideas.docs[0].data();
                            expect(data.title).toEqual(idea.title);
                            expect(data.mode).toEqual(idea.mode);
                            expect(data.notes).toEqual(idea.notes);
                            expect(data.parentID).toEqual(idea.parentID);
                        } else {
                            fail("Data missing.");
                        }
                    }).catch(error => {
                        fail(error);
                    });
                }).catch(error => {
                    fail("Idea save failure, " + error);
                });
            }).catch(error => {
                fail("Project save failure, " + error);
            });
        }).catch(error => {
            fail("User save failure, " + error);
        });
    });
});

describe("deleteIdea", () => {
    let docID = "";
    let projectID = "";
    let ideaID = "1";
    let project = {
        val: "x"
    };
    let idea = {
        title: "a",
        mode: "b",
        notes: "c",
        parentID: "d"
    };

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteProject(docID, projectID).then(() => {
                return deleteIdea(docID, projectID, ideaID).then(() => {
                    return getUser(docID).then(snap => {
                        if (snap.exists) {
                            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                        }
                    }).catch(error => {
                        console.error("Delete user " + docID + " and its contents if necessary, " + error);
                    });
                }).catch(error => {
                    console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("deletes idea", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return saveProject(docID, project).then(ref => {
                projectID = ref.id;
                return saveIdea(docID, projectID, ideaID, idea).then(() => {
                    return Firestore.deleteIdea(docID, projectID, ideaID).then(() => {
                        return getIdea(docID, projectID, ideaID).then(snap => {
                            if (snap.exists) {
                                fail("Deletion failure, .");
                            }
                        }).catch(error => {
                            fail(error);
                        });
                    }).catch(error => {
                        fail("Deletion failure, " + error);
                    });
                }).catch(error => {
                    fail("Idea save failure, " + error);
                });
            }).catch(error => {
                fail("Project save failure, " + error);
            });
        }).catch(error => {
            fail("User save failure, " + error);
        });
    });
});

describe("saveProject", () => {
    let docID = "";
    let projectID = "";
    let project = {
        val: "x"
    };

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteProject(docID, projectID).then(() => {
                return getUser(docID).then(snap => {
                    if (snap.exists) {
                        console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                    }
                }).catch(error => {
                    console.error("Delete user " + docID + " and its contents if necessary, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("saves project", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return Firestore.saveProject(docID, project).then(ref => {
                projectID = ref.id;
                return getProject(docID, projectID).then(snap => {
                    expect(snap.id).toEqual(projectID);
                    if (snap.exists) {
                        expect(snap.data().val).toEqual(project.val);
                    } else {
                        fail("Data missing.");
                    }
                }).catch(error => {
                    fail(error);
                });
            }).catch(error => {
                fail("Save project failure, " + error);
            });
        }).catch(error => {
            fail("Save user failure, " + error);
        });
    });
});

describe("setColor", () => {
    let docID = "";
    let color = "white";

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return getUser(docID).then(snap => {
                if (snap.exists) {
                    console.error("Cleanup failure, delete user " + docID + ", " + error);
                }
            }).catch(error => {
                console.error("Delete user " + docID + " if necessary, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + ", " + error);
        });
    });

    it("sets color", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return Firestore.setColor(docID, color).then(() => {
                return getUser(docID).then(snap => {
                    if (snap.exists) {
                        expect(snap.data().color).toEqual(color);
                    } else {
                        fail("Data missing.");
                    }
                }).catch(error => {
                    fail(error);
                });
            }).catch(error => {
                fail("Update failure, " + error);
            });
        }).catch(error => {
            fail("Save user failure, " + error);
        });
    });
});

describe("archiveProject", () => {
    let docID = "";
    let projectID = "";
    let project = {
        val: "x"
    };

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteProject(docID, projectID).then(() => {
                return getUser(docID).then(snap => {
                    if (snap.exists) {
                        console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                    }
                }).catch(error => {
                    console.error("Delete user " + docID + " and its contents if necessary, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("archives project", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return saveProject(docID, project).then(ref => {
                projectID = ref.id;
                return Firestore.archiveProject(docID, projectID).then(() => {
                    return getProject(docID, projectID).then(snap => {
                        if (snap.exists) {
                            expect(snap.data().archived).toBe(true);
                        } else {
                            fail("Data missing.");
                        }
                    }).catch(error => {
                        fail(error);
                    });
                }).catch(error => {
                    fail("Archive failure, " + error);
                });
            }).catch(error => {
                fail("Save project failure, " + error);
            });
        }).catch(error => {
            fail("Save user failure, " + error);
        });
    });
});

describe("editProject", () => {
    let docID = "";
    let projectID = "";
    let project = {
        val: "x",
        val2: "y"
    };
    let project2 = {
        val: "z"
    }

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteProject(docID, projectID).then(() => {
                return getUser(docID).then(snap => {
                    if (snap.exists) {
                        console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                    }
                }).catch(error => {
                    console.error("Delete user " + docID + " and its contents if necessary, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("edits project", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return saveProject(docID, project).then(ref => {
                projectID = ref.id;
                return Firestore.editProject(docID, projectID, project2).then(() => {
                    return getProject(docID, projectID).then(snap => {
                        if (snap.exists) {
                            let data = snap.data();
                            expect(data.val).toEqual(project2.val);
                            expect(data.val2).toEqual(project.val2);
                        } else {
                            fail("Data missing.");
                        }
                    }).catch(error => {
                        fail(error);
                    });
                }).catch(error => {
                    fail("Edit failure, " + error);
                });
            }).catch(error => {
                fail("Save project failure, " + error);
            });
        }).catch(error => {
            fail("Save user failure, " + error);
        });
    });
});

describe("getUsersByEmail", () => {
    let docID = "";
    let email = "test@gmail.com";
    let username = "test";
    let uid = "1";

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return getUser(docID).then(snap => {
                if (snap.exists) {
                    console.error("Cleanup failure, delete user " + docID + ", " + error);
                }
            }).catch(error => {
                console.error("Delete user " + docID + " if necessary, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + ", " + error);
        });
    });
    
    it("gets users", () => {
        return saveUser(email, username, uid).then(user => {
            docID = user.id;
            return Firestore.getUsersByEmail(email).then(users => {
                expect(users.size).toEqual(1);
                expect(users.docs[0].id).toEqual(docID);
                if (users.docs[0].exists) {
                    let data = users.docs[0].data();
                    expect(data.email).toEqual(email);
                    expect(data.username).toEqual(username);
                    expect(data.uid).toEqual(uid);
                } else {
                    fail("Data missing.");
                }
            }).catch(error => {
                fail(error);
            });
        }).catch(error => {
            fail("Save failure, " + error);
        });
    });
});

describe("shareProject", () => {
    let docID = "";
    let project = {
        id: "1",
        val: "x",
        val2: "y"
    };
    let project2 = {
        id: "1",
        val: "z"
    };

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteSharedProject(docID, project.id).then(() => {
                return getUser(docID).then(snap => {
                    if (snap.exists) {
                        console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                    }
                }).catch(error => {
                    console.error("Delete user " + docID + " and its contents if necessary, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("shares project", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return Firestore.shareProject(docID, project).then(() => {
                return getSharedProject(docID, project.id).then(snap => {
                    expect(snap.id).toEqual(project.id);
                    if (snap.exists) {
                        let data = snap.data();
                        expect(data.id).toEqual(project.id);
                        expect(data.val).toEqual(project.val);
                        expect(data.val2).toEqual(project.val2);
                    } else {
                        fail("Missing data.");
                    }
                }).catch(error => {
                    fail(error);
                });
            }).catch(error => {
                fail("Share failure, " + error);
            });
        }).catch(error => {
            fail("Save user failure, " + error);
        });
    });

    it("merges project", () => {
        return Firestore.shareProject(docID, project2).then(() => {
            return getSharedProject(docID, project.id).then(snap => {
                expect(snap.id).toEqual(project.id);
                if (snap.exists) {
                    let data = snap.data();
                    expect(data.id).toEqual(project.id);
                    expect(data.val).toEqual(project2.val);
                    expect(data.val2).toEqual(project.val2);
                } else {
                    fail("Missing data.");
                }
            }).catch(error => {
                fail(error);
            });
        }).catch(error => {
            fail("Share failure, " + error);
        });
    });
});

describe("getSharedProjects", () => {
    let docID = "";
    let project = {
        id: "1",
        shareTime: 1
    };   
    let project2 = {
        id: "2",
        shareTime: 0
    };
 
    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteSharedProject(docID, project.id).then(() => {
                return deleteSharedProject(docID, project2.id).then(() => {
                    return getUser(docID).then(snap => {
                        if (snap.exists) {
                            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                        }
                    }).catch(error => {
                        console.error("Delete user " + docID + " and its contents if necessary, " + error);
                    });
                }).catch(error => {
                    console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        }); 
    });

    it("gets shared projects", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return shareProject(docID, project).then(() => {
                return shareProject(docID, project2).then(() => {
                    return Firestore.getSharedProjects(docID).then(snap => {
                        expect(snap.size).toEqual(2);
                        expect(snap.docs[0].id).toEqual(project.id);
                        expect(snap.docs[1].id).toEqual(project2.id);
                        if (snap.docs[0].exists) {
                            if (snap.docs[1].exists) {
                                let data = snap.docs[0].data();
                                let data2 = snap.docs[1].data();
                                expect(data.id).toEqual(project.id);
                                expect(data.shareTime).toEqual(project.shareTime);
                                expect(data2.id).toEqual(project2.id);
                                expect(data2.shareTime).toEqual(project2.shareTime);
                            } else {
                                fail("Missing data.");
                            }
                        } else {
                            fail("Missing data.");
                        }
                    }).catch(error => {
                        fail(error);
                    });
                }).catch(error => {
                    fail("Share failure, " + error);
                });
            }).catch(error => {
                fail("Share failure, " + error);
            });
        }).catch(error => {
            fail("Save user failure, " + error);
        });
    });
});

describe("saveCommendations", () => {
    let docID = "";
    let projectID = "";
    let ideaID = "1";
    let project = {
        val: "x"
    };
    let idea = {
        title: "a",
        mode: "b",
        notes: "c",
        parentID: "d"
    };
    let commenterID = "2";
    let commendation = {
        x: "x"
    };

    afterAll(() => {
        return deleteUser(docID).then(() => {
            return deleteProject(docID, projectID).then(() => {
                return deleteIdea(docID, projectID, ideaID).then(() => {
                    return deleteCommendation(docID, projectID, ideaID, commenterID).then(() => {
                        return getUser(docID).then(snap => {
                            if (snap.exists) {
                                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                            }
                        }).catch(error => {
                            console.error("Delete user " + docID + " and its contents if necessary, " + error);
                        });
                    }).catch(error => {
                        console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                    });
                }).catch(error => {
                    console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
                });
            }).catch(error => {
                console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
            });
        }).catch(error => {
            console.error("Cleanup failure, delete user " + docID + " and its contents, " + error);
        });
    });

    it("saves commendation", () => {
        return saveUser("test@gmail.com", "test", "1").then(user => {
            docID = user.id;
            return saveProject(docID, project).then(ref => {
                projectID = ref.id;
                return saveIdea(docID, projectID, ideaID, idea).then(() => {
                    return Firestore.saveCommendation(docID, projectID, ideaID, commenterID, commendation).then(() => {
                        return getCommendations(docID, projectID, ideaID).then(snap => {
                            expect(snap.size).toEqual(1);
                            expect(snap.docs[0].id).toEqual(commenterID);
                            if (snap.docs[0].exists) {
                                expect(snap.docs[0].data().x).toEqual(commendation.x);
                            } else {
                                fail("Missing data.");
                            }
                        }).catch(error => {
                            fail(error);
                        });
                    }).catch(error => {
                        fail("Save failure, " + error);
                    });
                }).catch(error => {
                    fail("Idea save failure, " + error);
                });
            }).catch(error => {
                fail("Project save failure, " + error);
            });
        }).catch(error => {
            fail("User save failure, " + error);
        });
    });
});
