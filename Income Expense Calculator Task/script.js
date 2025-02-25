document.addEventListener('DOMContentLoaded', function() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];

    function addEntry(description, amount, type) {
        const entry = { id: Date.now(), description, amount, type };
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries();
    }

    function displayEntries() {
        const entryList = document.getElementById('entries');
        entryList.innerHTML = '';
        entries.forEach(entry => {
            const entryItem = document.createElement('li');
            const entryText = document.createElement('span');
            entryText.textContent = `${entry.description} - ${entry.amount} (${entry.type})`;
            entryItem.appendChild(entryText);

            const editButton = document.createElement('button');
            editButton.className = 'edit';
            editButton.textContent = 'Edit';
            editButton.onclick = () => editEntry(entry.id);
            entryItem.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteEntry(entry.id);
            entryItem.appendChild(deleteButton);

            entryList.appendChild(entryItem);
        });
        calculateTotals();
    }

    function editEntry(id) {
        const entry = entries.find(e => e.id === id);
        if (entry) {
            document.getElementById('description').value = entry.description;
            document.getElementById('amount').value = entry.amount;
            document.querySelector(`input[name="filter"][value="${entry.type}"]`).checked = true;
            deleteEntry(id);
        }
    }

    function deleteEntry(id) {
        const index = entries.findIndex(e => e.id === id);
        if (index !== -1) {
            entries.splice(index, 1);
            localStorage.setItem('entries', JSON.stringify(entries));
            displayEntries();
        }
    }

    function calculateTotals() {
        let totalIncome = 0;
        let totalExpense = 0;
        entries.forEach(entry => {
            if (entry.type === 'income') {
                totalIncome += parseFloat(entry.amount);
            } else {
                totalExpense += parseFloat(entry.amount);
            }
        });
        document.getElementById('total-income').textContent = totalIncome;
        document.getElementById('total-expense').textContent = totalExpense;
        document.getElementById('net-balance').textContent = totalIncome - totalExpense;
    }

    function resetInputs() {
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.querySelector('input[name="filter"][value="all"]').checked = true;
    }

    document.getElementById('add').addEventListener('click', function() {
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.querySelector('input[name="filter"]:checked').value;
        if (description && amount) {
            addEntry(description, amount, type);
            resetInputs();
        }
    });

    document.getElementById('reset').addEventListener('click', resetInputs);

    displayEntries();
});
