const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

exports.sendNewProjectNotification = functions.firestore.document('projects/{project}')
    .onWrite(async (change, context) => {
        //retrieve instance ids for new project
        const instance_id_snapshot = await db.collection('new_project_iids').get();
        const instance_id_array = [];
        instance_id_snapshot.forEach(function (doc) {
            instance_id_array.push(doc.data().id);
        });
        console.log(instance_id_array);

        //retrieve project data
        const newProject = change.after.data()
        console.log(newProject);
        const payload = {
            notification: {
                title: `Project created ${newProject.name}`,
                body: `A new project has been created!`,
                // icon: follower.photoURL
            }
        };

        const response = await admin.messaging().sendToDevice(instance_id_array, payload);

        return response;
    });