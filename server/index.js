// index.js
const { firestore } = require('./config/firebaseConfig');

async function addUser() {
  try {
    const userRef = firestore.collection('users').doc('user1');
    await userRef.set({
      name: "John Doe",
      email: "john.doe@example.com",
      age: 30,
    });

    console.log("User added successfully to Firestore!");
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

addUser();
