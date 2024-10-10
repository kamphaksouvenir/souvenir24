 // Function to handle transitions between pages
        function transitionPages(fromPage, toPage) {
            fromPage.classList.remove('fade-in');
            setTimeout(() => {
                fromPage.classList.remove('show');  // Hide the current page after fade-out

                // Show and fade in the next page
                toPage.classList.add('show');
                setTimeout(() => {
                    toPage.classList.add('fade-in');
                }, 10);  // Delay to ensure the element becomes visible before applying fade-in
		 saveCurrentPage(toPage.id);
            }, 2000);  // Wait for 3 seconds (fade-out duration)
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
 // Function to fade in the main content
    function fadeInMainContent() {
        const mainContent = document.getElementById('mainContent');
        mainContent.style.display = 'block';  // Show the content
        setTimeout(() => {
            mainContent.classList.add('show');  // Apply the fade-in class
        }, 10);  // Delay to ensure visibility before applying fade-in
    }

    // Wait for the video to load before showing the main content
    const backgroundVideo = document.getElementById('backgroundVideo');
    backgroundVideo.addEventListener('loadeddata', function() {
        console.log("Video has loaded. Showing main content...");
        fadeInMainContent();
    });
        // Function to fetch student data from JSON
        async function fetchStudentData() {
            try {
                console.log("Fetching student data...");  // Debugging
                const response = await fetch('freshies.json');  // Make sure the path is correct
                const studentData = await response.json();  // Convert the response to JSON format
                console.log("Fetched student data:", studentData);  // Debugging
                return studentData;
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        }

        // Handle the "I Agree and Proceed" button to transition from introduction to Student ID page
        document.getElementById('proceedButton').addEventListener('click', function() {
            const introductionPage = document.getElementById('introductionPage');
            const studentIDPage = document.getElementById('studentIDPage');
            transitionPages(introductionPage, studentIDPage);  // Transition to student ID input page
        });

        // Function to validate student ID and transition to confirmation page
        async function validateStudentID() {
            const studentID = document.getElementById('studentID').value;
            const errorMessage = document.getElementById('error-message');
            const studentIDPage = document.getElementById('studentIDPage');
            const confirmationPage = document.getElementById('confirmationPage');
            const nicknameElement = document.getElementById('nickname');

            const studentData = await fetchStudentData();  // Fetch student data from JSON file
            console.log("Student ID entered:", studentID);  // Debugging

            // Check if the entered student ID exists in the JSON data
            const foundStudent = studentData.find(student => student.studentid == studentID);
            console.log("Found student:", foundStudent);  // Debugging

            if (foundStudent) {
                // Show the confirmation page and display the nickname
                nicknameElement.textContent = foundStudent.nickname;
                console.log("Displaying nickname:", foundStudent.nickname);  // Debugging

                // Save student info temporarily for confirmation
                localStorage.setItem('tempStudentID', foundStudent.studentid);
                localStorage.setItem('tempStudentName', foundStudent.nickname);
                localStorage.setItem('tempTableID', foundStudent.tableid);

                // Transition from ID input page to confirmation page
                transitionPages(studentIDPage, confirmationPage);
            } else {
                // Show error message if the student ID is not found
                errorMessage.style.display = 'block';
            }
        }

	    // Modify existing table confirmation handling to show letterPage
    document.getElementById('confirmTableNumber').addEventListener('click', function() {
    const tableNumber = document.getElementById('tableNumber').value;
    const storedTableID = localStorage.getItem('tempTableID');
    const tableErrorMessage = document.getElementById('table-error-message');
    const confirmationPage = document.getElementById('confirmationPage');
    const letterPage = document.getElementById('letterPage');
	    

        // Validate the entered table number against the stored table ID
        if (tableNumber === storedTableID) {
            // Move data from temp storage to permanent storage
            localStorage.setItem('studentID', localStorage.getItem('tempStudentID'));
            localStorage.setItem('studentName', localStorage.getItem('tempStudentName'));
            localStorage.setItem('tableID', localStorage.getItem('tempTableID'));

            // Instead of redirecting to question1.html, show the letter page
            transitionPages(confirmationPage, letterPage);
        } else {
            // Show error message if the table number is incorrect
            tableErrorMessage.style.display = 'block';
        }
    });
	     // Handle back button click to return to the Student ID page
    document.getElementById('backToStudentIDBtn').addEventListener('click', function() {
        const letterPage = document.getElementById('letterPage');
        const studentIDPage = document.getElementById('studentIDPage');
        transitionPages(letterPage, studentIDPage);  // Transition back to the Student ID page
    });
	    
    // Handle the new "Return to First Page" button to transition back to the introduction page
    document.getElementById('returnToFirstPageBtn').addEventListener('click', function() {
        const studentIDPage = document.getElementById('studentIDPage');
        const introductionPage = document.getElementById('introductionPage');
        transitionPages(studentIDPage, introductionPage);  // Transition back to the first page
    });



        // Handle re-entering student ID
        document.getElementById('reenterID').addEventListener('click', function() {
            // Clear temp data and return to the ID input page
            localStorage.removeItem('tempStudentID');
            localStorage.removeItem('tempStudentName');
            localStorage.removeItem('tempTableID');
            document.getElementById('studentID').value = '';  // Clear the input field
            document.getElementById('tableNumber').value = '';  // Clear the table number field
            document.getElementById('table-error-message').style.display = 'none';  // Hide the table error

            const confirmationPage = document.getElementById('confirmationPage');
            const studentIDPage = document.getElementById('studentIDPage');
            transitionPages(confirmationPage, studentIDPage);  // Transition back to ID input page
        });

        // Handle the submit button click to validate and proceed
        document.getElementById('submitID').addEventListener('click', validateStudentID);
		 
		// Placeholder function to open the source document for "Letter to You"
    function openDocument() {
        // Replace the '#' with the actual document link later
        window.open('#', '_blank');
    }

    // Function to open the Google Form for "Letter to Future You"
    function openGoogleForm() {
        // Replace the link with your actual Google Form URL
        window.open('https://forms.gle/DgNatixPiSxzHqC27', '_blank');
    }

    // Display the letter page after confirming the table number
    function showLetterPage() {
        document.getElementById('letterPage').style.display = 'block';
    }
