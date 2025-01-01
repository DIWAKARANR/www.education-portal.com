// Initialize localStorage with default data if empty
function initializePortalData() {
    if (!localStorage.getItem('portalData')) {
        const initialData = {
            students: [
                {
                    id: "STU001",
                    password: "Abel2024",
                    name: "Abel James",
                    marks: {
                        "Web Development": 60,
                        "Data Mining": 80,
                        "IoT": 75,
                        "MAD": 90
                    },
                    attendance: 95
                }
            ],
            staff: [
                {
                    id: "STAFF001",
                    password: "staff123",
                    name: "Prof. Mahalingam"
                }
            ],
            subjects: ["Web Development", "Data Mining", "IoT", "MAD"]
        };
        localStorage.setItem('portalData', JSON.stringify(initialData));
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializePortalData();
    setupEventListeners();
});

// Get portal data
function getPortalData() {
    return JSON.parse(localStorage.getItem('portalData'));
}

// Save portal data
function savePortalData(data) {
    localStorage.setItem('portalData', JSON.stringify(data));
}

// Utility Functions
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function getGradeColor(marks) {
    if (marks >= 90) return '#48BB78';
    if (marks >= 80) return '#4299E1';
    if (marks >= 50) return '#ECC94B';
    return '#F56565';
}

function getGradeLetter(marks) {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'B';
    if (marks >= 70) return 'C';
    if (marks >= 60) return 'D';
    return 'F';
}

// Continuing from previous code...

function loginStudent() {
    const id = document.getElementById('studentId').value;
    const password = document.getElementById('studentPassword').value;
    const portalData = getPortalData();
    const student = portalData.students.find(s => s.id === id && s.password === password);

    if (student) {
        document.getElementById('studentName').textContent = student.name;
        displayStudentData(student);
        showSection('studentDashboard');
    } else {
        showError('studentLoginError', 'Invalid credentials');
    }
}

function loginStaff() {
    const id = document.getElementById('staffId').value;
    const password = document.getElementById('staffPassword').value;
    const portalData = getPortalData();
    const staff = portalData.staff.find(s => s.id === id && s.password === password);

    if (staff) {
        document.getElementById('staffName').textContent = staff.name;
        initializeStaffDashboard();
        showSection('staffDashboard');
    } else {
        showError('staffLoginError', 'Invalid credentials');
    }
}

function displayStudentData(student) {
    // Display Marks
    const marksContent = document.getElementById('marksContent');
    marksContent.innerHTML = '';

    const portalData = getPortalData();
    portalData.subjects.forEach(subject => {
        const marks = student.marks[subject] || 0;
        const grade = getGradeLetter(marks);
        const color = getGradeColor(marks);

        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.innerHTML = `
            <h4>${subject}</h4>
            <div class="grade" style="color: ${color}">${marks}% (${grade})</div>
        `;
        marksContent.appendChild(subjectCard);
    });

    // Display Attendance
    const attendanceContent = document.getElementById('attendanceContent');
    attendanceContent.innerHTML = `
        <p>Total Attendance: ${student.attendance}%</p>
    `;

    // Animate attendance bar
    const attendanceBar = document.getElementById('attendanceBar');
    const attendancePercentage = document.getElementById('attendancePercentage');
    setTimeout(() => {
        attendanceBar.style.width = `${student.attendance}%`;
        attendancePercentage.textContent = `${student.attendance}%`;
    }, 100);
}

function initializeStaffDashboard() {
    displayStudentsList();
    displaySubjectsList();
    updateStudentSelect();
    updateSubjectInputs();
}

function updateStudentSelect() {
    const portalData = getPortalData();
    const studentSelect = document.getElementById('studentSelect');
    studentSelect.innerHTML = '<option value="">Select Student</option>';
    
    portalData.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.name} (${student.id})`;
        studentSelect.appendChild(option);
    });
}

function updateSubjectInputs() {
    const portalData = getPortalData();
    const subjectInputs = document.getElementById('subjectInputs');
    subjectInputs.innerHTML = '';
    
    portalData.subjects.forEach(subject => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'form-group';
        inputGroup.innerHTML = `
            <label>${subject}</label>
            <input type="number" 
                   id="mark_${subject.replace(/\s+/g, '_')}" 
                   min="0" 
                   max="100" 
                   placeholder="Enter marks">
        `;
        subjectInputs.appendChild(inputGroup);
    });
}

function loadStudentData() {
    const studentId = document.getElementById('studentSelect').value;
    if (!studentId) return;

    const portalData = getPortalData();
    const student = portalData.students.find(s => s.id === studentId);
    if (!student) return;

    // Fill in marks
    portalData.subjects.forEach(subject => {
        const input = document.getElementById(`mark_${subject.replace(/\s+/g, '_')}`);
        if (input) {
            input.value = student.marks[subject] || '';
        }
    });

    // Fill in attendance
    document.getElementById('attendanceInput').value = student.attendance || '';
}

function updateStudentData() {
    const studentId = document.getElementById('studentSelect').value;
    if (!studentId) {
        showError('updateError', 'Please select a student');
        return;
    }

    const portalData = getPortalData();
    const studentIndex = portalData.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return;

    // Update marks
    if (!portalData.students[studentIndex].marks) {
        portalData.students[studentIndex].marks = {};
    }

    portalData.subjects.forEach(subject => {
        const input = document.getElementById(`mark_${subject.replace(/\s+/g, '_')}`);
        if (input && input.value) {
            portalData.students[studentIndex].marks[subject] = Number(input.value);
        }
    });

    // Update attendance
    const newAttendance = document.getElementById('attendanceInput').value;
    if (newAttendance) {
        portalData.students[studentIndex].attendance = Number(newAttendance);
    }

    savePortalData(portalData);
    alert('Student records updated successfully!');
}

function addNewStudent() {
    const id = document.getElementById('newStudentId').value;
    const name = document.getElementById('newStudentName').value;
    const password = document.getElementById('newStudentPassword').value;

    if (!id || !name || !password) {
        alert('Please fill in all fields');
        return;
    }

    const portalData = getPortalData();
    
    // Check if ID already exists
    if (portalData.students.some(s => s.id === id)) {
        alert('Student ID already exists');
        return;
    }

    portalData.students.push({
        id,
        name,
        password,
        marks: {},
        attendance: 0
    });

    savePortalData(portalData);
    alert('Student added successfully!');
    
    // Reset form
    document.getElementById('newStudentId').value = '';
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentPassword').value = '';
    
    displayStudentsList();
    updateStudentSelect();
}

function displayStudentsList() {
    const portalData = getPortalData();
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';

    portalData.students.forEach(student => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `
            <span>${student.name} (${student.id})</span>
            <button onclick="deleteStudent('${student.id}')" class="delete-btn">Delete</button>
        `;
        studentsList.appendChild(listItem);
    });
}

function addNewSubject() {
    const subjectName = document.getElementById('newSubjectName').value;

    if (!subjectName) {
        alert('Please enter a subject name');
        return;
    }

    const portalData = getPortalData();
    
    // Check if subject already exists
    if (portalData.subjects.includes(subjectName)) {
        alert('Subject already exists');
        return;
    }

    portalData.subjects.push(subjectName);
    savePortalData(portalData);
    
    document.getElementById('newSubjectName').value = '';
    displaySubjectsList();
    updateSubjectInputs();
}

function displaySubjectsList() {
    const portalData = getPortalData();
    const subjectsList = document.getElementById('subjectsList');
    subjectsList.innerHTML = '';

    portalData.subjects.forEach(subject => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML = `
            <span>${subject}</span>
            <button onclick="deleteSubject('${subject}')" class="delete-btn">Delete</button>
        `;
        subjectsList.appendChild(listItem);
    });
}

function deleteSubject(subject) {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    const portalData = getPortalData();
    portalData.subjects = portalData.subjects.filter(s => s !== subject);
    
    // Remove subject marks from all students
    portalData.students.forEach(student => {
        if (student.marks && student.marks[subject]) {
            delete student.marks[subject];
        }
    });
    
    savePortalData(portalData);
    displaySubjectsList();
    updateSubjectInputs();
}

function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    const portalData = getPortalData();
    portalData.students = portalData.students.filter(s => s.id !== studentId);
    savePortalData(portalData);
    
    displayStudentsList();
    updateStudentSelect();
}

function switchTab(button, tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

function switchStaffTab(button, tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.staff-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
        
        setTimeout(() => {
            errorElement.style.opacity = '0';
        }, 3000);
    }
}

function logout() {
    showSection('mainSelection');
    // Reset forms
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('.error-message').forEach(error => error.textContent = '');
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializePortalData();
    
    // Add input animations
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});
