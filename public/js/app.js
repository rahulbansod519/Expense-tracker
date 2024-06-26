const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const requestForm = document.querySelector('.new-request form');
// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

// close request modal
requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});

// add a new request
requestForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const addExpense = firebase.functions().httpsCallable('addExpense');
    addExpense({ 
      amount: requestForm.amount.value,
      description: requestForm.description.value ,
      category: requestForm.category.value ,
      
    })
    .then(() => {
      requestForm.reset();
      requestForm.querySelector('.error').textContent = '';
      requestModal.classList.remove('open');
    })
    .catch(error => {
      requestForm.querySelector('.error').textContent = error.message;
    });
  });