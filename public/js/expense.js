function formatFirebaseTimestamp(seconds, nanoseconds) {
  // Combine seconds and nanoseconds to get the timestamp in milliseconds
  const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1000000);

  // Create a Date object using the milliseconds timestamp
  const date = new Date(milliseconds);

  // Format the date to a human-readable string
  const formattedDate = date.toLocaleString();

  return formattedDate;
}


firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const ref = firebase
      .firestore()
      .collection("expenses")
      .doc(user.uid)
      .collection("User-expense");

    let expenses = [];
    ref.onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        expenses.push({ ...doc.data(), id: doc.id });
      });
      //   console.log(expenses[0].category);
      let html = ``;
      expenses.forEach((expense) => {
        const formattedDate = formatFirebaseTimestamp(
          expense.date.seconds,
          expense.date.nanoseconds
        );
        html += `<li>
          <span class="text">${expense.category}</span>
          <span class="text">${expense.amount}</span>
          <span class="text">${expense.description}</span>
          <span class="text">${formattedDate}</span>
        </li>`;
      });
      document.querySelector("ul").innerHTML = html;
    });
  } else {
    console.log("bro login karo");
  }
});
