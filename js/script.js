async function display() {
    let response = await fetch("http://localhost:5000/students");
    let json;
    if (response.ok) {
        json = await response.json();
        const tbody = document.getElementById('tbodyStudentList');
        tbody.innerHTML = '';
        for (let e of json) {
            addRowToTable(e.id, e.name, e.program)
        }
    }
    else alert("Error" + response.status);

}

function addRowToTable(id, name, program) {
    let row = document.createElement('tr');
    row.setAttribute("id", id);
    for (let e of arguments) {
        let cell = document.createElement('td');
        cell.appendChild(document.createTextNode(e));
        row.appendChild(cell);
    }
    document.getElementById('tbodyStudentList').appendChild(row);

}

async function addStudent(id, name, program) {
    let obj = { id, name, program };
    let setting = {
        method: "POST",
        body: JSON.stringify(obj),
        headers: { "Content-Type": 'application/json' }
    }
    let response = await fetch("http://localhost:5000/students", setting);
    if (response.ok) {
        addRowToTable(id, name, program);
        populateDropdowns();
    } else alert("Error " + response.status);

}

document.getElementById('btnRegister').addEventListener("click", () => {
    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let program = document.getElementById('program').value;
    addStudent(id, name, program);
    document.getElementById('myform').reset()
});

document.getElementById('btnDelete').addEventListener("click", () => {
    deleteStudent();
});

document.getElementById('btnUpdate').addEventListener("click", () => {
    let originalId = document.getElementById('ddlStudentForUpdate').value; 
    let id = document.getElementById('idForUpdate').value; 

    let name = document.getElementById('nameForUpdate').value;
    let program = document.getElementById('programForUpdate').value;
    updateStudent(originalId, name, program, id);
});


document.getElementById('ddlStudentForUpdate').addEventListener('input', () => {
    const selectedId = document.getElementById('ddlStudentForUpdate').value;
    fillUpdateForm(selectedId);
});

window.onload = () => {
    populateDropdowns();
    display();
};

async function deleteStudent() {
    let id = document.getElementById('ddlStudent').value;

    let setting = {
        method: "DELETE"
    };

    let response = await fetch(`http://localhost:5000/students/${id}`, setting);

    if (response.ok) {
        display();
        populateDropdowns();
        document.getElementById('myform').reset();
    } else {
        alert("Error " + response.status);
    }
}


async function updateStudent(originalId, name, program, id) {

    let obj = { name, program, id }; 
    let setting = {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: { "Content-Type": 'application/json' }
    };

    let response = await fetch(`http://localhost:5000/students/${originalId}`, setting);

    if (response.ok) {
        display();
        populateDropdowns();
        document.getElementById('myform').reset();
    } else {
        alert("Error " + response.status);
    }
}


async function fillUpdateForm(studentId) {
    const response = await fetch(`http://localhost:5000/students/${studentId}`);
    if (response.ok) {
        const studentData = await response.json();
        document.getElementById('idForUpdate').value = studentData.id;
        document.getElementById('nameForUpdate').value = studentData.name;
        document.getElementById('programForUpdate').value = studentData.program;
    } else {
        alert("Error " + response.status);
    }
}


async function populateDropdowns() {
    let response = await fetch("http://localhost:5000/students");
    let json;

    if (response.ok) {
        json = await response.json();
        let deleteDropdown = document.getElementById('ddlStudent');
        let updateDropdown = document.getElementById('ddlStudentForUpdate');

        deleteDropdown.innerHTML = ''; 
        updateDropdown.innerHTML = '';

        for (let e of json) {
            let optionDelete = document.createElement('option');
            let optionUpdate = document.createElement('option');
            optionDelete.value = e.id;
            optionDelete.text = e.id;
            optionUpdate.value = e.id;
            optionUpdate.text = e.id;
            deleteDropdown.appendChild(optionDelete);
            updateDropdown.appendChild(optionUpdate);
        }

        if (json.length > 0) {
            fillUpdateForm(json[0].id);
        }
    } else {
        alert("Error " + response.status);
    }
}

