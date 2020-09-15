const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

exports.sendNewProjectNotification = functions.firestore.document('projects/{project}')
    .onWrite(async (change, context) => {
        //Get the project object that was written to the collection.
        const project = change.after.data()
        const payload = {
            notification: {
                title: `Project created ${project.name}`,
                body: `A new project has been created!`,
            }
        };
      
        //retrieve instance ids for new project
        const instance_id_snapshot = await db.collection('new_project_iids').get();
        const instance_id_array = [];
        instance_id_snapshot.forEach(function (doc) {
            instance_id_array.push(doc.data().id);
        });
        console.log(instance_id_array);
        ////end

        const response = await admin.messaging().sendToDevice(instance_id_array, payload);

        return response;
    });
    
