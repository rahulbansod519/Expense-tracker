const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// auth trigger (new user signup)
exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  // for background triggers you must return a value/promise
  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    UID: user.uid,
  });
});

// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});

exports.addExpense = functions.https.onCall(async (data, context) => {
//   data = { amount, description, category, date };
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can add requests"
    );
  }
  const userId = context.auth.uid;
  const expense = {
    userId: userId,
    amount: data.amount,
    category : data.category,
    description : data.description,
    date: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {

    await admin.firestore().collection("expenses").doc(userId).collection("User-expense").add(expense);
    
    return { message: "Expense added successfully" };
  } catch (error) {
    throw new functions.https.HttpsError(
      "unknown",
      error,
    );
  }
});
