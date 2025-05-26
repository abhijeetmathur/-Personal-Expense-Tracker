document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  // Fetch and display existing expenses on page load
  fetch('/expenses')
    .then(response => response.json())
    .then(expenses => {
      expenses.forEach(expense => addExpenseToList(expense));
    })
    .catch(error => {
      console.error('Error fetching expenses:', error);
    });

  // Handle form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent page reload

    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const payment_method = document.getElementById('payment_method').value;

    try {
      const response = await fetch('/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, category, description, amount, payment_method }),
      });

      if (response.ok) {
        const expense = await response.json();
        addExpenseToList(expense);
        form.reset(); // Clear the form after adding
      } else {
        const err = await response.text();
        alert('Failed to add expense: ' + err);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense: ' + error.message);
    }
  });

  // Function to display a new expense on the page
  function addExpenseToList(expense) {
    const li = document.createElement('li');
    li.textContent = `${expense.date} - ${expense.category} - ${expense.description} - ₹${expense.amount} (${expense.payment_method})`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-button');
    deleteBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(`/expenses/${expense.id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          li.remove();
        } else {
          alert('Failed to delete expense');
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense: ' + error.message);
      }
    });

    li.appendChild(deleteBtn);
    expenseList.appendChild(li);
  }
});
