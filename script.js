const contactForm = document.querySelector("#Contact form");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Thank you! Your message has been received.");
        contactForm.reset();
    });
}

const admissionForm = document.querySelector("#admissionForm") || document.querySelector(".AT");
const levelSelect = document.querySelector("#level");
const classSelect = document.querySelector("#class");
const combinationSelect = document.querySelector("#combination");
const phoneInput = document.querySelector("#Phone");

function updateAdmissionOptions() {
    if (!levelSelect || !classSelect || !combinationSelect) {
        return;
    }

    const level = levelSelect.value;

    if (level === "O-Level") {
        classSelect.innerHTML = `
            <option value="">Select class</option>
            <option value="formone">Form One</option>
            <option value="formtwo">Form Two</option>
            <option value="formthree">Form Three</option>
            <option value="formfour">Form Four</option>
        `;

        combinationSelect.value = "none";
        combinationSelect.disabled = true;
        combinationSelect.required = false;
    } else if (level === "High-level") {
        classSelect.innerHTML = `
            <option value="">Select class</option>
            <option value="formfive">Form Five</option>
            <option value="formsix">Form Six</option>
        `;

        combinationSelect.value = "";
        combinationSelect.disabled = false;
        combinationSelect.required = true;
    } else {
        classSelect.innerHTML = `
            <option value="">Select level first</option>
        `;

        combinationSelect.value = "none";
        combinationSelect.disabled = true;
        combinationSelect.required = false;
    }
}

if (levelSelect) {
    levelSelect.addEventListener("change", updateAdmissionOptions);
    updateAdmissionOptions();
}

if (phoneInput) {
    phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9+]/g, "");
    });
}

function getApplications() {
    try {
        const saved = localStorage.getItem("iyungaApplications");

        if (!saved) {
            return [];
        }

        const applications = JSON.parse(saved);

        return Array.isArray(applications) ? applications : [];
    } catch (error) {
        return [];
    }
}

function saveApplications(applications) {
    try {
        localStorage.setItem(
            "iyungaApplications",
            JSON.stringify(applications)
        );

        return true;
    } catch (error) {
        return false;
    }
}

function generateRegNo() {
    const applications = getApplications();

    let number = applications.length + 1;

    let regNo = `IYS-${new Date().getFullYear()}-${String(number).padStart(4, "0")}`;

    while (applications.some(application => application.id === regNo)) {
        number++;
        regNo = `IYS-${new Date().getFullYear()}-${String(number).padStart(4, "0")}`;
    }

    return regNo;
}

function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

if (admissionForm) {
    admissionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = new FormData(admissionForm);

        const name = data.get("FullName")?.trim();
        const date = data.get("date");
        const gender = data.get("gender");
        const level = data.get("level");
        const studentClass = data.get("class");
        const combination = data.get("combination");
        const previous = data.get("previous")?.trim();

        const parent = data.get("parentname")?.trim();
        const phone = data.get("Phone")?.trim();
        const address = data.get("Address")?.trim();

        if (
            !name ||
            !date ||
            !gender ||
            !level ||
            !studentClass ||
            !previous ||
            !parent ||
            !phone ||
            !address
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        if (phone.length < 10 || phone.length > 14) {
            alert("Please enter a valid phone number.");
            return;
        }

        if (level === "High-level" && (!combination || combination === "none")) {
            alert("Please select a combination.");
            return;
        }

        const applications = getApplications();

        const application = {
            id: generateRegNo(),

            student: {
                FullName: name,
                date: date,
                gender: gender,
                level: level,
                class: studentClass,
                combination: level === "High-level" ? combination : "none",
                previous: previous
            },

            guardian: {
                studentId: null,
                parentname: parent,
                Phone: phone,
                Address: address
            },

            submittedAt: new Date().toISOString()
        };

        application.guardian.studentId = application.id;

        applications.push(application);

        if (!saveApplications(applications)) {
            alert("Unable to save the application.");
            return;
        }

        alert(
            `Application submitted successfully.\nReg No: ${application.id}`
        );

        admissionForm.reset();
        updateAdmissionOptions();
    });
}

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".book");

if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
        menu.classList.toggle("open");
    });
}

const navLinks = document.querySelectorAll(".book a");

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        if (menu) {
            menu.classList.remove("open");
        }
    });
});

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const usernameInput = document.querySelector("#username");
        const passwordInput = document.querySelector("#password");
        const loginMessage = document.querySelector("#loginMessage");

        const username = usernameInput
            ? usernameInput.value.trim()
            : "";

        const password = passwordInput
            ? passwordInput.value
            : "";

        const correctUsername = "admin";
        const correctPassword = "12345";

        if (
            username === correctUsername &&
            password === correctPassword
        ) {
            sessionStorage.setItem("adminLoggedIn", "true");
            window.location.href = "admission-data.html";
        } else if (loginMessage) {
            loginMessage.textContent =
                "Username or password is incorrect.";

            loginMessage.style.color = "red";
        }
    });
}

const recordsPage = document.querySelector(".records-page");

if (recordsPage) {
    const loggedIn = sessionStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
        window.location.href = "login.html";
    }
}

const logoutButton = document.querySelector("#logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        sessionStorage.removeItem("adminLoggedIn");
        window.location.href = "login.html";
    });
}

function formatClass(className) {
    const classes = {
        formone: "Form One",
        formtwo: "Form Two",
        formthree: "Form Three",
        formfour: "Form Four",
        formfive: "Form Five",
        formsix: "Form Six"
    };

    return classes[className] || className || "";
}

function createActionButtons(id) {
    return `
        <button type="button" class="edit-btn" data-id="${escapeHTML(id)}">
            Edit
        </button>

        <button type="button" class="delete-btn" data-id="${escapeHTML(id)}">
            Delete
        </button>
    `;
}

function displayAdmissionData(searchValue = "") {
    const oLevelData = document.querySelector("#oLevelData");
    const highLevelData = document.querySelector("#highLevelData");

    if (!oLevelData && !highLevelData) {
        return;
    }

    if (oLevelData) {
        oLevelData.innerHTML = "";
    }

    if (highLevelData) {
        highLevelData.innerHTML = "";
    }

    const applications = getApplications();

    const search = searchValue.toLowerCase().trim();

    let oLevelNumber = 1;
    let highLevelNumber = 1;

    applications.forEach(function (application) {
        if (!application || !application.student) {
            return;
        }

        const student = application.student;

        const searchableText = [
            application.id,
            student.FullName,
            student.date,
            student.gender,
            student.class,
            student.combination,
            student.previous
        ]
            .join(" ")
            .toLowerCase();

        if (search && !searchableText.includes(search)) {
            return;
        }

        const row = document.createElement("tr");

        if (student.level === "O-Level") {
            row.innerHTML = `
                <td>${oLevelNumber++}</td>
                <td>${escapeHTML(application.id)}</td>
                <td>${escapeHTML(student.FullName)}</td>
                <td>${escapeHTML(student.date)}</td>
                <td>${escapeHTML(student.gender)}</td>
                <td>${escapeHTML(formatClass(student.class))}</td>
                <td>${escapeHTML(student.combination)}</td>
                <td>${escapeHTML(student.previous)}</td>
                <td>${createActionButtons(application.id)}</td>
            `;

            if (oLevelData) {
                oLevelData.appendChild(row);
            }
        }

        if (student.level === "High-level") {
            row.innerHTML = `
                <td>${highLevelNumber++}</td>
                <td>${escapeHTML(application.id)}</td>
                <td>${escapeHTML(student.FullName)}</td>
                <td>${escapeHTML(student.date)}</td>
                <td>${escapeHTML(student.gender)}</td>
                <td>${escapeHTML(formatClass(student.class))}</td>
                <td>${escapeHTML(student.combination)}</td>
                <td>${escapeHTML(student.previous)}</td>
                <td>${createActionButtons(application.id)}</td>
            `;

            if (highLevelData) {
                highLevelData.appendChild(row);
            }
        }
    });
}

function displayGuardianData(searchValue = "") {
    const guardianData = document.querySelector("#guardianData");

    if (!guardianData) {
        return;
    }

    guardianData.innerHTML = "";

    const applications = getApplications();
    const search = searchValue.toLowerCase().trim();

    let number = 1;

    applications.forEach(function (application) {
        if (
            !application ||
            !application.guardian ||
            !application.student
        ) {
            return;
        }

        const guardian = application.guardian;
        const student = application.student;

        const searchableText = [
            application.id,
            student.FullName,
            guardian.parentname,
            guardian.Phone,
            guardian.Address
        ]
            .join(" ")
            .toLowerCase();

        if (search && !searchableText.includes(search)) {
            return;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${number++}</td>
            <td>${escapeHTML(guardian.parentname)}</td>
            <td>${escapeHTML(guardian.Phone)}</td>
            <td>${escapeHTML(guardian.Address)}</td>
            <td>${createActionButtons(application.id)}</td>
        `;

        guardianData.appendChild(row);
    });
}

function editApplication(id) {
    const applications = getApplications();

    const application = applications.find(
        item => item.id === id
    );

    if (!application) {
        return;
    }

    sessionStorage.setItem(
        "editApplicationId",
        application.id
    );

    window.location.href = "index.html#Admition";
}

function deleteApplication(id) {
    const applications = getApplications();

    const application = applications.find(
        item => item.id === id
    );

    if (!application) {
        return;
    }

    const studentName = application.student?.FullName || "this student";

    const confirmed = confirm(
        `Are you sure you want to delete ${studentName}?`
    );

    if (!confirmed) {
        return;
    }

    const updatedApplications = applications.filter(
        item => item.id !== id
    );

    if (!saveApplications(updatedApplications)) {
        alert("Unable to delete the application.");
        return;
    }

    displayAdmissionData();
    displayGuardianData();

    alert("Application deleted successfully.");
}

const searchStudent = document.querySelector("#searchStudent");

if (searchStudent) {
    searchStudent.addEventListener("input", function () {
        displayAdmissionData(this.value);
        displayGuardianData(this.value);
    });
}

document.addEventListener("click", function (event) {
    const editButton = event.target.closest(".edit-btn");
    const deleteButton = event.target.closest(".delete-btn");

    if (editButton) {
        editApplication(editButton.dataset.id);
    }

    if (deleteButton) {
        deleteApplication(deleteButton.dataset.id);
    }
});

const clearAllBtn = document.querySelector("#clearAllBtn");

if (clearAllBtn) {
    clearAllBtn.addEventListener("click", function () {
        const applications = getApplications();

        if (applications.length === 0) {
            alert("There are no admission records.");
            return;
        }

        const confirmed = confirm(
            "Are you sure you want to delete all admission records?"
        );

        if (!confirmed) {
            return;
        }

        if (!saveApplications([])) {
            alert("Unable to clear the records.");
            return;
        }

        displayAdmissionData();
        displayGuardianData();

        alert("All admission records have been deleted.");
    });
}

function loadApplicationForEdit() {
    if (!admissionForm) {
        return;
    }

    const editId = sessionStorage.getItem("editApplicationId");

    if (!editId) {
        return;
    }

    const applications = getApplications();

    const application = applications.find(
        item => item.id === editId
    );

    if (!application) {
        sessionStorage.removeItem("editApplicationId");
        return;
    }

    const student = application.student;
    const guardian = application.guardian;

    document.querySelector("#Fullname").value =
        student.FullName || "";

    document.querySelector("#date").value =
        student.date || "";

    document.querySelector("#gender").value =
        student.gender || "";

    document.querySelector("#level").value =
        student.level || "";

    updateAdmissionOptions();

    document.querySelector("#class").value =
        student.class || "";

    document.querySelector("#combination").value =
        student.combination || "none";

    document.querySelector("#previous").value =
        student.previous || "";

    document.querySelector("#parentname").value =
        guardian.parentname || "";

    document.querySelector("#Phone").value =
        guardian.Phone || "";

    document.querySelector("#Address").value =
        guardian.Address || "";

    const submitButton =
        document.querySelector("#submitBtn");

    const cancelButton =
        document.querySelector("#cancelEditBtn");

    if (submitButton) {
        submitButton.textContent = "Update Application";
    }

    if (cancelButton) {
        cancelButton.style.display = "inline-block";
    }

    admissionForm.dataset.editId = editId;

    sessionStorage.removeItem("editApplicationId");
}

if (admissionForm) {
    loadApplicationForEdit();

    const cancelEditBtn =
        document.querySelector("#cancelEditBtn");

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", function () {
            admissionForm.reset();

            delete admissionForm.dataset.editId;

            updateAdmissionOptions();

            const submitButton =
                document.querySelector("#submitBtn");

            if (submitButton) {
                submitButton.textContent =
                    "Submit Application";
            }

            cancelEditBtn.style.display = "none";

            window.location.href = "#Admition";
        });
    }

    admissionForm.addEventListener("submit", function (event) {
        const editId = admissionForm.dataset.editId;

        if (!editId) {
            return;
        }

        event.preventDefault();

        const data = new FormData(admissionForm);

        const name = data.get("FullName")?.trim();
        const date = data.get("date");
        const gender = data.get("gender");
        const level = data.get("level");
        const studentClass = data.get("class");
        const combination = data.get("combination");
        const previous = data.get("previous")?.trim();

        const parent = data.get("parentname")?.trim();
        const phone = data.get("Phone")?.trim();
        const address = data.get("Address")?.trim();

        if (
            !name ||
            !date ||
            !gender ||
            !level ||
            !studentClass ||
            !previous ||
            !parent ||
            !phone ||
            !address
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        if (phone.length < 10 || phone.length > 14) {
            alert("Please enter a valid phone number.");
            return;
        }

        if (
            level === "High-level" &&
            (!combination || combination === "none")
        ) {
            alert("Please select a combination.");
            return;
        }

        const applications = getApplications();

        const index = applications.findIndex(
            application => application.id === editId
        );

        if (index === -1) {
            alert("Application record was not found.");
            return;
        }

        applications[index].student = {
            FullName: name,
            date: date,
            gender: gender,
            level: level,
            class: studentClass,
            combination:
                level === "High-level"
                    ? combination
                    : "none",
            previous: previous
        };

        applications[index].guardian = {
            studentId: editId,
            parentname: parent,
            Phone: phone,
            Address: address
        };

        applications[index].updatedAt =
            new Date().toISOString();

        if (!saveApplications(applications)) {
            alert("Unable to update the application.");
            return;
        }

        alert("Application updated successfully.");

        admissionForm.reset();

        delete admissionForm.dataset.editId;

        updateAdmissionOptions();

        const submitButton =
            document.querySelector("#submitBtn");

        const cancelButton =
            document.querySelector("#cancelEditBtn");

        if (submitButton) {
            submitButton.textContent =
                "Submit Application";
        }

        if (cancelButton) {
            cancelButton.style.display = "none";
        }
    });
}

displayAdmissionData();
displayGuardianData();


