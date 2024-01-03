/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const admin = require("firebase-admin");
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

exports.activities = onRequest(async (request, response) => {
  // import firestore
  const db = admin.firestore();

  // read all activities and return them
  try {
    const querySnapshot = await db.collection("activities").get();
    let activities = [];
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        message: doc.data().message,
        timestamp: doc.data().timestamp.toDate(),
      });
    });
    response.send(activities);
  } catch (err) {
    response.status(500).send(err);
  }
});

exports.getActivity = onRequest(async (req, res) => {
  const db = admin.firestore();

  const { id } = req.query;
  try {
    const doc = await db.collection('activities').doc(id).get();
    if (!doc.exists) {
      res.status(404).send('No activity found');
    } else {
      res.send(doc.data());
    }
  } catch (err) {
    res.status(500).send(err);
  }
});