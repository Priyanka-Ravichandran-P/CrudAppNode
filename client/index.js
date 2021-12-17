document.addEventListener('DOMContentLoaded', function () {
    getAllData();
});
function getAllData() {
    fetch('http://localhost:5000/getAll')
        .then(res => res.json())
        .then(res => loadHTMLTable(res['data']));
}

document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === 'delete-row-btn') {
        deleteRowById(event.target.dataset.id);
    }

    if (event.target.className === 'edit-row-btn') {
        handleEditRow(event.target.dataset.id);
    }
});

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    }).then(res => res.json())
        .then(data => {
            if(data.success){
                location.reload(); // refresh the page.
            }
        });
}
const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}
function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id;
}

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');


    console.log(updateNameInput);

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
}

const btn = document.getElementById('add-name');
btn.onclick = function () {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name: name })

    }).then(res =>
        res.json())
        .then(res => inserRowIntoTable(res['data']));;
}

function inserRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHTML = "<tr>";
    for (let key in data) {
        if (data.hasOwnProperty(key))
            if (key === 'dateAdded')
                data[key] = new Date(data[key]).toLocaleString();

        tableHTML += `<td>${data[key]}</td>`;
    }
    tableHTML += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    tableHTML += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;

    tableHTML += "</tr>";


    if (isTableData) {
        table.innerHTML = tableHTML;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
    let tableHTML = "";
    data.forEach(function ({ id, name, date_added }) {
        tableHTML += "<tr>";
        tableHTML += `<td>${id}</td>`;
        tableHTML += `<td>${name}</td>`;
        tableHTML += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHTML += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHTML += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHTML += "</tr>";
    });
    table.innerHTML = tableHTML;
}