// Event Listeners at the Top
document.addEventListener("DOMContentLoaded", function () {
    // Attach all event listeners
    document.getElementById('proceedButton').addEventListener('click', handleProceed);
    document.getElementById('submitID').addEventListener('click', validateStudentID);
    document.getElementById('confirmTableNumber').addEventListener('click', handleTableConfirmation);
    document.getElementById('backToStudentIDBtn').addEventListener('click', handleBackToStudentID);
    document.getElementById('returnToFirstPageBtn').addEventListener('click', handleReturnToFirstPage);
    document.getElementById('reenterID').addEventListener('click', handleReenterID);
    page1.addEventListener("click", handleFrameClick);
    nextPageButton.addEventListener("click", fadeOutBackgroundImage);

    // Function Definitions Below

    // Function to handle transitions between pages
    function transitionPages(fromPage, toPage) {
        fromPage.classList.remove('fade-in');
        setTimeout(() => {
            fromPage.classList.remove('show');  // Hide the current page after fade-out

            // Show and fade in the next page
            toPage.classList.add('show');
            setTimeout(() => {
                toPage.classList.add('fade-in');
                saveCurrentPage(toPage.id);  // Save the current page in localStorage
            }, 10);
        }, 2000);  // Wait for 2 seconds (fade-out duration)
    }

    // Function to store the current page in localStorage
    function saveCurrentPage(pageID) {
        localStorage.setItem('currentPage', pageID);
    }

    // Function to restore the page state based on localStorage
    function restorePageState() {
        const currentPage = localStorage.getItem('currentPage');
        const studentID = localStorage.getItem('studentID');
        const studentName = localStorage.getItem('studentName');
        const tableID = localStorage.getItem('tableID');

        if (currentPage) {
            // Hide all pages
            document.querySelectorAll('.container').forEach(page => {
                page.classList.remove('show', 'fade-in');
            });

            // Show and fade in the saved page
            const savedPage = document.getElementById(currentPage);
            savedPage.classList.add('show');
            setTimeout(() => {
                savedPage.classList.add('fade-in');
            }, 10);

            // Restore student data if available
            if (studentID) {
                document.getElementById('studentID').value = studentID;
            }
            if (studentName) {
                document.getElementById('nickname').textContent = studentName;
            }
            if (tableID) {
                document.getElementById('tableNumber').value = tableID;
            }
        }
    }

    // Call restorePageState when the page loads
    window.onload = restorePageState;

    // Function to fade in the main content after video loads
    function fadeInMainContent() {
        const mainContent = document.getElementById('mainContent');
        mainContent.style.display = 'block';
        setTimeout(() => {
            mainContent.classList.add('show');
        }, 10);
    }

    const backgroundVideo = document.getElementById('backgroundVideo');
    backgroundVideo.addEventListener('loadeddata', function () {
        console.log("Video has loaded. Showing main content...");
        fadeInMainContent();
    });

    // Function to fetch student data from JSON
    async function fetchStudentData() {
        try {
            const response = await fetch('assets/main/freshies.json');
            const studentData = await response.json();
            return studentData;
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    }

    // Handle "I Agree and Proceed" button
    function handleProceed() {
        const introductionPage = document.getElementById('introductionPage');
        const studentIDPage = document.getElementById('studentIDPage');
        transitionPages(introductionPage, studentIDPage);
    }

    // Validate student ID
    async function validateStudentID() {
        const studentID = document.getElementById('studentID').value;
        const errorMessage = document.getElementById('error-message');
        const studentIDPage = document.getElementById('studentIDPage');
        const confirmationPage = document.getElementById('confirmationPage');
        const nicknameElement = document.getElementById('nickname');

        const studentData = await fetchStudentData();
        const foundStudent = studentData.find(student => student.studentid == studentID);

        if (foundStudent) {
            nicknameElement.textContent = foundStudent.nickname;
            localStorage.setItem('tempStudentID', foundStudent.studentid);
            localStorage.setItem('tempStudentName', foundStudent.nickname);
            localStorage.setItem('tempTableID', foundStudent.tableid);

            transitionPages(studentIDPage, confirmationPage);
        } else {
            errorMessage.style.display = 'block';
        }
    }

    // Handle table confirmation
    function handleTableConfirmation() {
        const tableNumber = document.getElementById('tableNumber').value;
        const storedTableID = localStorage.getItem('tempTableID');
        const tableErrorMessage = document.getElementById('table-error-message');
        const confirmationPage = document.getElementById('confirmationPage');
        const letterPage = document.getElementById('letterPage');

        if (tableNumber === storedTableID) {
            localStorage.setItem('studentID', localStorage.getItem('tempStudentID'));
            localStorage.setItem('studentName', localStorage.getItem('tempStudentName'));
            localStorage.setItem('tableID', localStorage.getItem('tempTableID'));

            fadeInBackgroundImage();
            confirmationPage.style.display = "none";
            page1.style.display = "block";
        } else {
            tableErrorMessage.style.display = "block";
        }
    }

    // Handle back button to return to Student ID page
    function handleBackToStudentID() {
        const letterPage = document.getElementById('letterPage');
        const studentIDPage = document.getElementById('studentIDPage');
        transitionPages(letterPage, studentIDPage);
    }

    // Handle "Return to First Page" button
    function handleReturnToFirstPage() {
        const studentIDPage = document.getElementById('studentIDPage');
        const introductionPage = document.getElementById('introductionPage');
        transitionPages(studentIDPage, introductionPage);
    }

    // Handle re-entering student ID
    function handleReenterID() {
        localStorage.removeItem('tempStudentID');
        localStorage.removeItem('tempStudentName');
        localStorage.removeItem('tempTableID');
        document.getElementById('studentID').value = '';
        document.getElementById('tableNumber').value = '';
        document.getElementById('table-error-message').style.display = 'none';

        const confirmationPage = document.getElementById('confirmationPage');
        const studentIDPage = document.getElementById('studentIDPage');
        transitionPages(confirmationPage, studentIDPage);
    }

    // Handle frame-based text transitions
    const texts = [
        "Message 1: Welcome to the journey.",
        "Message 2: Let's begin.",
        "Message 3: You're halfway there.",
        "Message 4: Keep going!",
        "Message 5: Almost done.",
        "Message 6: One step to go.",
        "Message 7: You've made it!"
    ];
    let currentTextIndex = 0;

    function handleFrameClick() {
        if (currentTextIndex < texts.length) {
            const newMessage = document.createElement("p");
            newMessage.textContent = texts[currentTextIndex];
            newMessage.style.opacity = 0;
            newMessage.style.transition = "opacity 0.5s ease-in-out";
            textContainer.appendChild(newMessage);

            setTimeout(() => {
                newMessage.style.opacity = 1;
            }, 100);

            currentTextIndex++;
        } else {
            setTimeout(() => {
                nextPageButton.style.opacity = 1;
                nextPageButton.classList.remove("hidden");
            }, 500);
        }
    }

    // Fade in the background image
    function fadeInBackgroundImage() {
        backgroundImage.style.opacity = 1;
    }

    // Fade out the background image
    function fadeOutBackgroundImage() {
        backgroundImage.style.opacity = 0;
    }
});
