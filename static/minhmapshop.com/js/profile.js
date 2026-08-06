let userDetails = {
		        id: 0,
		        firstName: "john_doe",
		        lastName: "john_doe",
		        user: "john_doe",
		        pass: "securepassword123",
		        address: "123 Main Street",
		        district: "Downtown",
		        city: "New York",
		        province: "New York",
		        email: "john.doe@example.com",
		        phoneNumber: "+1234567890",
		        selectedAddress: "000",
		        zipcode: "000",
		        note: "000"
};



const tabs = document.querySelectorAll('.nav-tabs a');
       const tabContents = document.querySelectorAll('.tab-content > div');
       const avatarUpload = document.getElementById('avatarUpload');
       const avatarPreview = document.getElementById('avatarPreview');
       const updateEmailBtn = document.getElementById('updateEmailBtn');
       const mylogoutBtn = document.getElementById('mylogoutBtn');
	   var currentMFAActionForm = 'email';
       const enableMFABtn = document.getElementById('enableMFABtn');
       const disableMFABtn = document.getElementById('disableMFABtn');
	   const passwordUpdateError = document.getElementById('passwordUpdateError');
       const updatePasswordBtn = document.getElementById('updatePasswordBtn');
       const savePersonalBtn = document.getElementById('savePersonalBtn');
       const saveProfileBtn = document.getElementById('saveProfileBtn');
       
       // Email verification modal elements
       const emailVerificationModal = document.getElementById('emailVerificationModal');
       const closeEmailModal = document.getElementById('closeEmailModal');
       const cancelVerification = document.getElementById('cancelVerification');
       const verifyCodeBtn = document.getElementById('verifyCodeBtn');
       const verificationEmail = document.getElementById('verificationEmail');
       const resendCode = document.getElementById('resendCode');
       const verificationError = document.getElementById('verificationError');
       
       const codeInputs = document.querySelectorAll('.code-input');
       
       // MFA setup modal elements
       const mfaSetupModal = document.getElementById('mfaSetupModal');
       const closeMfaModal = document.getElementById('closeMfaModal');
       const cancelMfaSetup = document.getElementById('cancelMfaSetup');
       const sendMfaVerificationEmail = document.getElementById('sendMfaVerificationEmail');
       const mfaVerificationEmail = document.getElementById('mfaVerificationEmail');
       const resendMfaCode = document.getElementById('resendMfaCode');
       const mfaCodeInputs = document.querySelectorAll('.mfa-code-input');
       const mfaVerificationError = document.getElementById('mfaVerificationError');
       const continueMfaSetupBtn = document.getElementById('continueMfaSetupBtn');
       const completeMfaSetupBtn = document.getElementById('completeMfaSetupBtn');
       const mfaSetupStep1 = document.getElementById('mfaSetupStep1');
       const mfaSetupStep2 = document.getElementById('mfaSetupStep2');
       const mfaSetupStep3 = document.getElementById('mfaSetupStep3');
       const emailMFA = document.getElementById('emailMFA');
       const appMFA = document.getElementById('appMFA');
       const appMFASetup = document.getElementById('appMFASetup');
       const mfaEnabled = document.getElementById('mfaEnabled');
       const mfaDisabled = document.getElementById('mfaDisabled');
       
       // Personal info elements
       const firstNameInput = document.getElementById('firstName');
       const lastNameInput = document.getElementById('lastName');
       const phoneNumberInput = document.getElementById('phoneNumber');
       const userDisplayName = document.getElementById('userDisplayName');
       const usernameTag = document.getElementById('usernameDisplay');
       const usernameDisplay = document.getElementById('usernameDisplay');
       //
	   
	   //email Elements
	   const currentEmailEl = document.getElementById('currentEmail');
	   const newEmailEl = document.getElementById('newEmail');
	   const submitNewEmailBtn = document.getElementById('submitNewEmailBtn');
	   const notificationSpan = document.getElementById('notificationSpan');
	   
       // Tab switching functionality
       tabs.forEach(tab => {
           tab.addEventListener('click', (e) => {
               e.preventDefault();
               
               // Remove active class from all tabs
               tabs.forEach(t => t.classList.remove('active'));
               
               // Add active class to clicked tab
               tab.classList.add('active');
               
               // Hide all tab contents
               tabContents.forEach(content => content.classList.remove('active'));
               
               // Show the corresponding tab content
               const tabId = tab.getAttribute('data-tab');
               document.getElementById(tabId).classList.add('active');
           });
       });
       
	   
	const urlParams = new URLSearchParams(window.location.search);
	const initialTab = urlParams.get('tab') || 'personal'; // default to tab1
	activateTab(initialTab);
	
	function activateTab(tabId) {
		tabs.forEach(t => t.classList.remove('active'));
		tabContents.forEach(c => c.classList.remove('active'));
	
		const activeTab = [...tabs].find(t => t.getAttribute('data-tab') === tabId);
		const activeContent = document.getElementById(tabId);
	
		if (activeTab && activeContent) {
			activeTab.classList.add('active');
			activeContent.classList.add('active');
		}
	} 
		  
       // Avatar upload preview
      avatarUpload.addEventListener('change', function () {
   const file = this.files[0];
   if (!file) return;

   const reader = new FileReader();
   const img = new Image();

   reader.onload = function (e) {
       img.src = e.target.result;
   };
   
  
   img.onload = function () {
       const targetSize = 300;

       // Create square canvas
       const canvas = document.createElement('canvas');
       canvas.width = targetSize;
       canvas.height = targetSize;

       const ctx = canvas.getContext('2d');

       // Fill background white (optional, useful for JPG)
       ctx.fillStyle = 'white';
       ctx.fillRect(0, 0, targetSize, targetSize);

       // Draw image centered and scaled to fit
       const ratio = Math.min(targetSize / img.width, targetSize / img.height);
       const newWidth = img.width * ratio;
       const newHeight = img.height * ratio;
       const offsetX = (targetSize - newWidth) / 2;
       const offsetY = (targetSize - newHeight) / 2;

       ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

       // Set preview as JPEG
       avatarPreview.src = canvas.toDataURL('image/jpeg', 0.9); // 90% quality
   };

   reader.readAsDataURL(file);
});
       
mylogoutBtn.addEventListener('click', function() {
   fetch('/api/logout', {
	   method: 'POST',
	   headers: {
		   'Content-Type': 'application/json'
	   },
	   body: JSON.stringify(userDetails)
   }).then(response => {

	   if (response.ok) {
		   // Logout successful, redirect
		   window.location.href = '/home';
	   } else {
		   alert('Logout failed');
	   }
	   return response.json();
   })	
	   .then(userClient => {
	   })
	   .catch(error => {
		   console.error('Error updating the cart:', error);
	   });
	
   });

       // Save profile changes
       saveProfileBtn.addEventListener('click', function() {
		saveProfileBtn.disabled = true;
		saveProfileBtn.textContent = 'Đang lưu...';
       	   const username = usernameDisplay.textContent.trim();
       	    const imgDataUrl = document.getElementById('avatarPreview').src;

       	    if (!username) {
       	        showAlert('Username cannot be empty', 'danger');
       	        return;
       	    }

       	    // Clean username formatting
       	    const cleanedUsername = username.replace(/^@/, '');

       	    // Prepare payload
       	    const payload = {
       	        username: cleanedUsername,
       	        imageBase64: imgDataUrl // base64 string (data:image/jpeg;base64,...)
       	    };

       	    // Send to Spring Boot backend
       	    fetch('/api/profile-save', {
       	        method: 'POST',
       	        headers: { 'Content-Type': 'application/json' },
       	        body: JSON.stringify(payload)
       	    })
       	    .then(res =>{
				 if(res.ok){
					 res.json();
					 saveProfileBtn.disabled = false;
				 				setTimeout(() => {saveProfileBtn.textContent = 'Đã lưu...';
				 								 }, 1000);
			 	}else{ 
					Promise.reject(res)
				}
				
			 })
       	    .then(data => {
       	        showAlert('Profile updated successfully!', 'success');
				
       	    })
       	    .catch(err => {
       	        showAlert('Failed to update profile.', 'danger');
       	        console.error(err);
       	    });
       });
       
       savePersonalBtn.addEventListener('click', function () {
		savePersonalBtn.disabled = true;
		savePersonalBtn.textContent = 'Đang lưu...';
           const firstName = firstNameInput.value.trim();
           const lastName = lastNameInput.value.trim();
           const phoneNumber = phoneNumberInput.value.trim();
           const username = document.getElementById('usernameDisplay').textContent.trim();
		   
		   
		   userDetails['id'] = 0;
		   userDetails['firstName'] = firstName;
		   userDetails['lastName'] = lastName;
		   userDetails['user'] = username;
		   userDetails['firstName'] = firstName;
		   userDetails['phoneNumber'] = phoneNumber;

           if (firstName && lastName) {
			   fetch('/api/update-profile-name', {
				   method: 'POST',
				   headers: {
					   'Content-Type': 'application/json'
				   },
				   body: JSON.stringify(userDetails) // Send user details as JSON
			   }).then(response => {
				   if (!response.ok) {
					   throw new Error('Failed to update the cart on the server.');
				   }
				   return response.json();
			   }).then(userClient => {

				   userDetails = userClient;
				   if (userDetails['id'] > 0) {
					   userDisplayName.innerText = userDetails.lastName + ' ' + userDetails.firstName;
					   savePersonalBtn.disabled = false;
					   setTimeout(() => {
					             savePersonalBtn.textContent = 'Đã lưu...';
					          }, 1000);
				   } else {
					   console.error('Error: user is not updated');
				   }
			   })
               .catch(error => {
                   console.error('Error:', error);
                   showAlert('Something went wrong', 'danger');
               });
           } else {
               showAlert('First name and last name are required', 'danger');
           }
       });
       
       // Update password functionality
	   updatePasswordBtn.addEventListener('click', function () {
			updatePasswordBtn.disabled = true;
			updatePasswordBtn.textContent = 'Đang lưu...';
			passwordUpdateError.textContent = '';
			passwordUpdateError.style.display = "none";
	       const currentPassword = document.getElementById('currentPassword').value;
	       const newPassword = document.getElementById('newPassword').value;
	       const confirmPassword = document.getElementById('confirmPassword').value;
		   const username = document.getElementById('usernameDisplay').textContent.trim();

	       if (!currentPassword) {
				passwordUpdateError.textContent = 'Chưa nhập mật khẩu hiện tại';
				passwordUpdateError.style.display = "block";
			   setTimeout(() => {updatePasswordBtn.textContent = 'Cập nhật lại';updatePasswordBtn.disabled = false;
			   					   				   				   					          }, 1000);
	           return;
	       }

	       if (!newPassword) {
				passwordUpdateError.textContent = 'Chưa nhập mật khẩu mới';
				passwordUpdateError.style.display = "block";
			   setTimeout(() => {updatePasswordBtn.textContent = 'Cập nhật lại';updatePasswordBtn.disabled = false;
			   					   				   				   					          }, 1000);
	           return;
	       }

	       if (newPassword !== confirmPassword) {
			  passwordUpdateError.textContent = 'Mật khẩu mới không trùng khớp';
			  passwordUpdateError.style.display = "block";
			   setTimeout(() => {updatePasswordBtn.textContent = 'Cập nhật lại';updatePasswordBtn.disabled = false;
			   					   				   				   					          }, 1000);
	           return;
	       }

	     

	       // Update password field
		   userDetails['pass'] = newPassword;
		   userDetails['firstName'] = username;
		   userDetails['note'] = currentPassword;
		   

	       fetch('/api/profile-update-password', {
	           method: 'POST',
			   headers: {
			               'Content-Type': 'application/json'
			   },
	           body: JSON.stringify(userDetails)
	       })
		   .then(response => {
		   				   if (!response.ok) {
		   					   //throw new Error('Failed to update the cart on the server.');
		   				   }
		   				   return response.json();
		   	}).then(userClient => {

		   		userDetails = userClient;
			
	           if (userDetails['id'] > 0) {
	               showAlert('Password updated successfully!', 'success');
	               document.getElementById('currentPassword').value = '';
	               document.getElementById('newPassword').value = '';
	               document.getElementById('confirmPassword').value = '';
				   passwordUpdateError.textContent = '';
	              
				   updatePasswordBtn.disabled = false;
				   setTimeout(() => {updatePasswordBtn.textContent = 'Đã lưu...';
				   					          }, 1000);
	           } else {
				   if(userDetails['note'] === 'wrongpass'){
					 passwordUpdateError.textContent = 'Mật khẩu hiện tại nhập không đúng';
					 passwordUpdateError.style.display = "block";
						   setTimeout(() => {updatePasswordBtn.textContent = 'Cập nhật lại';updatePasswordBtn.disabled = false;
						   				   				   					          }, 1000);
					
				   }
				
				   updatePasswordBtn.disabled = false;
				   				   setTimeout(() => {updatePasswordBtn.textContent = 'Không thể lưu...';
				   				   					          }, 1000);
	           }
	       })
	       .catch(error => {
	           console.error('Error:', error);
			   setTimeout(() => {updatePasswordBtn.textContent = 'Cập nhật lại';updatePasswordBtn.disabled = false;
			   		   					   				   				   					          }, 1000);
	           //showAlert('An error occurred while updating password', 'danger');
	       });
		  
	   });
       
	   // Email update functionality
	   updateEmailBtn.addEventListener('click', function() {
	       const newEmail = newEmailEl.value.trim();
		   const username = usernameDisplay.textContent.trim();
		   currentMFAActionForm = 'email';
	       
	       if (!newEmail) {
	           showAlert('Vui lòng nhập email mới', 'danger');
	           return;
	       }
	       
	       if (!isValidEmail(newEmail)) {
	           showAlert('Email mới không đúng định dạng', 'danger');
	           return;
	       }
	       
	       // Update user details with new email
	       userDetails.email = newEmail;
	       userDetails.user = username;
	       
	       // Send to backend for verification email
	       fetch('/api/profile-update-email', {
	           method: 'POST',
	           headers: {
	               'Content-Type': 'application/json'
	           },
	           body: JSON.stringify(userDetails)
	       })
	       .then(response => response.json())
	       .then(data => {
	           if (data.note === 'success') {
	               // Set email in verification modal and show it
	               verificationEmail.textContent = newEmail;
	               openModal(emailVerificationModal);
	               
	               // Clear any previous errors
	               verificationError.style.display = 'none';
	               
	               // Clear any previous input
	               codeInputs.forEach(input => input.value = '');
	               codeInputs[0].focus();
	               
	               showAlert('Verification email sent to ' + newEmail, 'info');
	               
	               // Show verification code form
	               document.getElementById('verificationCodeForm').style.display = 'block';
	           } else {
	               showAlert('Failed to send verification email. Please try again.', 'danger');
	           }
	       })
	       .catch(error => {
	           console.error('Error:', error);
	           showAlert('An error occurred. Please try again later.', 'danger');
	       });
	   });

	   // Verify code functionality
	   verifyCodeBtn.addEventListener('click', function() {
	       let verificationCode = '';
	       codeInputs.forEach(input => {
	           verificationCode += input.value;
	       });
	       
	       if (verificationCode.length !== codeInputs.length) {
	           verificationError.textContent = 'Please enter all verification code digits.';
	           verificationError.style.display = 'block';
	           return;
	       }
		   const username = usernameDisplay.textContent.trim();
	       // Send verification code to backend
		   userDetails.email = currentEmailEl.value;
		   userDetails.user = username;
		   userDetails.note = verificationCode;
	       fetch('/api/verify-email-code', {
	           method: 'POST',
	           headers: {
	               'Content-Type': 'application/json'
	           },
	           body: JSON.stringify(userDetails)
	       })
	       .then(response => response.json())
	       .then(data => {
	           if (data.note === 'success') {
	               // Close verification modal
	               closeModal(emailVerificationModal);
	               
				   if(currentMFAActionForm === 'email'){
		               // Enable submit button
		               submitNewEmailBtn.disabled = false;
		               
		               showAlert('Xác minh email thành công. Vui lòng nhấn Lưu để cập nhật email của bạn.', 'success');
					   verifyCodeBtn.disabled = true;
				   }else if(currentMFAActionForm === 'mfa'){
					
						fetch('/api/disable-mfa', {
						    method: 'POST',
						    headers: {
						        'Content-Type': 'application/json'
						    },
						    body: JSON.stringify(userDetails)
						})
						.then(response => {
						    if (!response.ok) {
						        throw new Error("Verification failed");
						    }
						    return response.json(); // or .text() if you return plain text
						})
						.then(data => {
						    console.log('Server response:', data);
							window.location.href = '/trang-ca-nhan?tab=security';
						})
						.catch(error => {
						    console.error('Error:', error);
						});
				   }
	           } else {
	               verificationError.textContent = 'Mã xác minh không hợp lệ. Vui lòng thử lại.';
	               verificationError.style.display = 'block';
	           }
	       })
	       .catch(error => {
	           console.error('Error:', error);
	           verificationError.textContent = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
	           verificationError.style.display = 'block';
	       });
	   });

	   // Submit new email functionality
	   submitNewEmailBtn.addEventListener('click', function() {
	       const newEmail = newEmailEl.value.trim();
		   const username = document.getElementById('usernameDisplay').textContent.trim();
		   userDetails['user'] = username;
		   userDetails['email'] = newEmail;
		   
		   
	       // Final update to save the new email
	       fetch('/api/save-new-email', {
	           method: 'POST',
	           headers: {
	               'Content-Type': 'application/json'
	           },
	           body: JSON.stringify(userDetails)
	       })
	       .then(response => response.json())
	       .then(data => {
	           if (data.note === 'success') {
	               // Update current email display
	               currentEmailEl.value = newEmail;
	               
	               // Clear new email field
	               newEmailEl.value = '';
	               
	               // Disable submit button until next verification
	               submitNewEmailBtn.disabled = true;
	               
	               showAlert('Email updated successfully!', 'success');
	           } else {
	               showAlert('Failed to update email. Please try again.', 'danger');
	           }
	       })
	       .catch(error => {
	           console.error('Error:', error);
	           showAlert('An error occurred. Please try again later.', 'danger');
	       });
	   });
	   
	   
	   // Email validation function
	   function isValidEmail(email) {
	       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	       return emailRegex.test(email);
	   }

	   // Show alert function
	   function showAlert(message, type) {
	       notificationSpan.textContent = message;
	       notificationSpan.className = '';
	       notificationSpan.classList.add('alert', `alert-${type}`);
	       notificationSpan.style.display = 'block';
	       
	       // Auto hide after 5 seconds
	       setTimeout(() => {
	           notificationSpan.style.display = 'none';
	       }, 5000);
	   }

	   // Modal functions
	   function openModal(modal) {
	       modal.style.display = 'block';
	   }

	   function closeModal(modal) {
	       modal.style.display = 'none';
	   }

	   // Code input handling
	   codeInputs.forEach((input, index) => {
	       input.addEventListener('input', function() {
	           if (this.value.length === 1) {
	               if (index < codeInputs.length - 1) {
	                   codeInputs[index + 1].focus();
					   codeInputs[index + 1].select();
	               }
	           }
	       });

	       input.addEventListener('keydown', function(e) {
	           if (e.key === 'Backspace' && !this.value && index > 0) {
	               codeInputs[index - 1].focus();
	           }
	       });
	   });
	   
	   mfaCodeInputs.forEach((input, index) => {
	       input.addEventListener('input', function() {
	           if (this.value.length === 1) {
	               if (index < mfaCodeInputs.length - 1) {
	                   mfaCodeInputs[index + 1].focus();
					   mfaCodeInputs[index + 1].select();
	               }
	           }
	       });

	       input.addEventListener('keydown', function(e) {
	           if (e.key === 'Backspace' && !this.value && index > 0) {
	               mfaCodeInputs[index - 1].focus();
	           }
	       });
	   });

	   
       
       // Enable MFA functionality
       enableMFABtn.addEventListener('click', function() {
           // Show MFA setup modal
           openModal(mfaSetupModal);
           
           // Reset MFA setup to step 1
           showMfaStep(1);
       });
       
       // Disable MFA functionality
       disableMFABtn.addEventListener('click', function() {
	   	       const newEmail = currentEmailEl.value.trim();
	   		   const username = usernameDisplay.textContent.trim();
			   currentMFAActionForm = 'mfa';
	   	       
	   	     
	   	       // Update user details with new email
	   	       userDetails.email = newEmail;
	   	       userDetails.user = username;
	   	       
	   	       // Send to backend for verification email
	   	       fetch('/api/profile-update-email', {
	   	           method: 'POST',
	   	           headers: {
	   	               'Content-Type': 'application/json'
	   	           },
	   	           body: JSON.stringify(userDetails)
	   	       })
	   	       .then(response => response.json())
	   	       .then(data => {
	   	           if (data.note === 'success') {
	   	               // Set email in verification modal and show it
	   	               verificationEmail.textContent = newEmail;
	   	               openModal(emailVerificationModal);
	   	               
	   	               // Clear any previous errors
	   	               verificationError.style.display = 'none';
	   	               
	   	               // Clear any previous input
	   	               codeInputs.forEach(input => input.value = '');
	   	               codeInputs[0].focus();
	   	               
	   	               showAlert('Verification email sent to ' + newEmail, 'info');
	   	               
	   	               // Show verification code form
	   	               document.getElementById('verificationCodeForm').style.display = 'block';
	   	           } else {
	   	               showAlert('Failed to send verification email. Please try again.', 'danger');
	   	           }
	   	       })
	   	       .catch(error => {
	   	           console.error('Error:', error);
	   	           showAlert('An error occurred. Please try again later.', 'danger');
	   	       });
	   	   });
       
       // Send MFA verification email
	   sendMfaVerificationEmail.addEventListener('click', function () {
	       const currentEmail = document.getElementById('currentEmail').value;

	       fetch('/api/send-code', {
	           method: 'POST',
	           headers: {
	               'Content-Type': 'application/json'
	           },
	           body: JSON.stringify({ email: currentEmail })
	       })
	       .then(response => {
	           if (!response.ok) {
	               throw new Error('Failed to send verification email.');
	           }
	           return response.json();
	       })
	       .then(data => {
	           showAlert('Verification email sent to your email address', 'info');
	           // Proceed to step 2
	           mfaVerificationEmail.textContent = currentEmail;
	           showMfaStep(2);
	           mfaVerificationError.style.display = 'none';
	           mfaCodeInputs.forEach(input => input.value = '');
	           if (mfaCodeInputs[0]) mfaCodeInputs[0].focus();
	       })
	       .catch(error => {
	           console.error('Error:', error);
	           showAlert('Could not send verification email. Please try again.', 'error');
	       });
	   });
       // RE Send MFA verification email
	   resendMfaCode.addEventListener('click', function () {
	       const currentEmail = document.getElementById('currentEmail').value;

	       fetch('/api/send-code', {
	           method: 'POST',
	           headers: {
	               'Content-Type': 'application/json'
	           },
	           body: JSON.stringify({ email: currentEmail })
	       })
	       .then(response => {
	           if (!response.ok) {
	               throw new Error('Failed to send verification email.');
	           }
	           return response.json();
	       })
	       .then(data => {
	           showAlert('Verification email sent to your email address', 'info');
	           // Proceed to step 2
	           mfaVerificationEmail.textContent = currentEmail;
	           showMfaStep(2);
	           mfaVerificationError.style.display = 'none';
	           mfaCodeInputs.forEach(input => input.value = '');
	           if (mfaCodeInputs[0]) mfaCodeInputs[0].focus();
	       })
	       .catch(error => {
	           console.error('Error:', error);
	           showAlert('Could not send verification email. Please try again.', 'error');
	       });
	   });

       
       // Continue MFA setup
       continueMfaSetupBtn.addEventListener('click', function() {
           // Handle different steps
           const step1Visible = mfaSetupStep1.style.display !== 'none';
           const step2Visible = mfaSetupStep2.style.display !== 'none';
           const step3Visible = mfaSetupStep2.style.display !== 'none';
		   const username = usernameDisplay.textContent.trim();
           
           if (step2Visible) {
               // Validate verification code
               const code = Array.from(mfaCodeInputs).map(input => input.value).join('');
               
			   
			   //
			   
			   let verificationCode = '';
			   	       mfaCodeInputs.forEach(input => {
			   	           verificationCode += input.value;
			   	       });
			   	       
			   	       if (verificationCode.length !== codeInputs.length) {
			   	           mfaVerificationError.textContent = 'Please enter all verification code digits.';
			   	           mfaVerificationError.style.display = 'block';
			   	           return;
			   	       }
			   	       
			   	       // Send verification code to backend
			   		   userDetails.email = currentEmailEl.value;
			   		   userDetails.note = verificationCode;
			   		   userDetails.user = username;
			   	       fetch('/api/verify-email-code', {
			   	           method: 'POST',
			   	           headers: {
			   	               'Content-Type': 'application/json'
			   	           },
			   	           body: JSON.stringify(userDetails)
			   	       })
			   	       .then(response => response.json())
			   	       .then(data => {
			   	           if (data.note === 'success') {
			   	               // Close verification modal
			   	               closeModal(emailVerificationModal);
			   	               
			   	               // Enable submit button
			   	          //     submitNewEmailBtn.disabled = false;
			   	               
			   	               showAlert('Xác minh email thành công. Vui lòng nhấn Lưu để cập nhật email của bạn.', 'success');
							//   showMfaStep(3);
							   
							if (window.location.pathname !== "/oauth2/success") {
									window.location.href = "/oauth2/success";
							}
			   				  // verifyCodeBtn.disabled = true;
			   	           } else {
			   	               mfaVerificationError.textContent = 'Mã xác minh không hợp lệ. Vui lòng thử lại.';
			   	               mfaVerificationError.style.display = 'block';
			   	           }
			   	       })
			   	       .catch(error => {
			   	           console.error('Error:', error);
			   	           mfaVerificationError.textContent = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
			   	           mfaVerificationError.style.display = 'block';
			   	       });
			   
			   
			   //
			   
           }
       });
       
	   function showMfaStep(stepNumber) {
	       // Hide all steps first
	       mfaSetupStep1.style.display = 'none';
	       mfaSetupStep2.style.display = 'none';
	       mfaSetupStep3.style.display = 'none';

	       // Hide error messages (optional cleanup)
	       mfaVerificationError.style.display = 'none';

	       // Show the current step
	       switch (stepNumber) {
	           case 1:
	               mfaSetupStep1.style.display = 'block';
	               break;
	           case 2:
	               mfaSetupStep2.style.display = 'block';
	               break;
	           case 3:
	               mfaSetupStep3.style.display = 'block';
	               break;
	           default:
	               console.error(`Unknown step: ${stepNumber}`);
	       }
	   }
                   // Complete MFA setup
       completeMfaSetupBtn.addEventListener('click', function() {
           // Check which MFA method was selected
           const selectedMethod = document.querySelector('input[name="mfaMethod"]:checked').value;
           
           if (selectedMethod === 'app') {
               const appCode = document.getElementById('appVerificationCode').value;
               if (!appCode || appCode.length !== 6) {
                   showAlert('Please enter a valid 6-digit code from your app', 'danger');
                   return;
               }
               
               // Simulate validation
               if (appCode !== '654321') { // Demo correct code
                   showAlert('Invalid verification code', 'danger');
                   return;
               }
           }
           
           // Close modal and update UI
           closeModal(mfaSetupModal);
           mfaEnabled.style.display = 'block';
           mfaDisabled.style.display = 'none';
           
           showAlert('Multi-Factor Authentication has been enabled successfully!', 'success');
       });