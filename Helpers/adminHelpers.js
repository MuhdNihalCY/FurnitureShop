var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt');
const { response } = require('../app');


module.exports = {
    DoSignup: (user) => {
        return new Promise(async (resolve, reject) => {
            var Status = {}
            var HaveUser
            var anyUser

            user.Verifed = false;
            user.Admin = false;
            user.password = await bcrypt.hash(user.password, 10);

            await db.get().collection(collection.ADMIN_COLLECTION).find().toArray().then((response) => {
                //console.log(response)
                anyUser = response
            })

            if (anyUser.length > 2) {
                await db.get().collection(collection.ADMIN_COLLECTION).findOne({ "email": user.email }).then((response) => {
                    //  console.log(response);
                    HaveUser = response;
                })
                //  console.log(HaveUser);
                if (!HaveUser) {
                    await db.get().collection(collection.ADMIN_COLLECTION).insertOne(user).then((response) => {
                        //  console.log(response)
                        if (response.insertedId) {
                            Status.LoggedIn = true
                        }
                    });
                } else {
                    Status = false;
                }

            } else {
                user.Verifed = true;
                user.Admin = true;
                await db.get().collection(collection.ADMIN_COLLECTION).findOne({ "email": user.email }).then((response) => {
                    //  console.log(response);
                    HaveUser = response;
                })
                //  console.log(HaveUser);
                if (!HaveUser) {
                    await db.get().collection(collection.ADMIN_COLLECTION).insertOne(user).then((response) => {
                        //  console.log(response)
                        if (response.insertedId) {
                            Status.LoggedIn = true
                            Status.user = user;
                        }
                    });
                } else {
                    Status = false;
                }
            }
            resolve(Status)

        })
    },
    DoLogin: (user) => {
        return new Promise(async (resolve, reject) => {
            var HaveUser
            var userStatus = {}
            await db.get().collection(collection.ADMIN_COLLECTION).findOne({ "email": user.email }).then((response) => {
                HaveUser = response;
                // console.log(HaveUser);
                if (HaveUser) {
                    bcrypt.compare(user.password, HaveUser.password).then((status) => {
                        //console.log(status);
                        if (status) {
                            //correct password
                            userStatus.user = HaveUser;
                            resolve(userStatus)

                        } else {
                            //wrongPassword
                            userStatus.error = true;
                            userStatus.err = "Wrong Password"
                            resolve(userStatus)
                        }
                    })
                } else {
                    //nonuser
                    userStatus.error = true;
                    userStatus.err = "No User or Invalid Email"
                    resolve(userStatus)

                }
            })
        })
    },
    addFiles: (data) => {
        console.log(data)
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.FILES).insertOne(data).then((response) => {
                console.log(response)
                var id = response.insertedId.toString();
                resolve(id)
            })
        })
    },
    GetHomeMaterials: () => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.FILES).find().toArray().then((response) => {
                // console.log("Sem 1 results",response);
                var notes = response.filter(material => material.MaterialType === 'Notes');
                var video = response.filter(material => material.MaterialType === 'Video');
                var Q_P = response.filter(material => material.MaterialType === 'Q_P');
                // console.log("Notes: ",notes);

                // const arrays = [notes, video, Q_P];

                // arrays.forEach(array => {
                //     const items = array.slice(0, 20);

                //     if (items.length <= 20) {
                //         console.log(items);
                //     } else {
                //         console.log(items.slice(0, 20));
                //     }


                // });

                // notes = arrays[0]
                // video = arrays[1]
                // Q_P = arrays[2]

                var data = {
                    Notes: notes,
                    Video: video,
                    Q_P: Q_P
                }
                resolve(data)
            })
        })
    },
    getFiles: (data) => {
        return new Promise(async (resolve, reject) => {
            var video
            var notes
            var Q_P
            //{ Branch: 'ct', Revision: '2015', Semester: '3', Subject: '3' }

            await db.get().collection(collection.FILES).find({
                $and: [
                    // {"MaterialType": "Video"},
                    { "stream": data.Branch },
                    { "Sem": data.Semester },
                    { "Rev": data.Revision },
                    { "Sub": data.Subject }
                ]
            }).toArray().then((Files) => {
                console.log(Files);
                var notes = Files.filter(material => material.MaterialType === 'Notes');
                var video = Files.filter(material => material.MaterialType === 'Video');
                var Q_P = Files.filter(material => material.MaterialType === 'Q_P');
                var data = {
                    Notes: notes,
                    Video: video,
                    Q_P: Q_P
                }
                resolve(data)
            })
        })
    }
}