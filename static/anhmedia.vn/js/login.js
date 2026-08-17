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

document.addEventListener("DOMContentLoaded", function() {
			const loginText = document.querySelector(".title-text .login");
			const loginForm = document.querySelector("form.login");
			const loginBtn = document.querySelector("label.login");
			const signupBtn = document.querySelector("label.signup");
			const signupLink = document.querySelector("form .signup-link a");
			if (!loginText || !loginForm || !loginBtn || !signupBtn || !signupLink) return;
			signupBtn.onclick = (()=>{
			  loginForm.style.marginLeft = "-50%";
			  loginText.style.marginLeft = "-50%";
			});
			loginBtn.onclick = (()=>{
			  loginForm.style.marginLeft = "0%";
			  loginText.style.marginLeft = "0%";
			});
			signupLink.onclick = (()=>{
			  signupBtn.click();
			  return false;
			});
			
		
			
			
		document.querySelector('.btn-layer-login').addEventListener('click', function(event) {
		    event.preventDefault();
			
			const form = event.target.form; // Lấy đối tượng form từ sự kiện
			const myformData = new FormData(form);
			
			userDetails['pass'] = myformData.get('password');
			userDetails['email'] = myformData.get('email');
			
		    
			fetch('/api/login-act', { // Adjust the endpoint as needed
			       method: 'POST', // Use POST to send data
			       headers: {
			           'Content-Type': 'application/json'
			       },
			       body: JSON.stringify(userDetails) // Sending the cart object as JSON
				}).then(response => {
			        if (!response.ok) {
			            throw new Error('Failed to update the cart on the server.');
			        }
			        return response.json();
			    })
			    .then(userClient => {
			        console.log('Cart successfully updated on the server:', userClient);
					userDetails = userClient;
					const errorSpan = document.querySelector(".error-message1");
					if(userDetails.id > 0){
						if(userDetails['pass'] === "mfa"){
							window.location.href = '/dang-nhap';
							location.reload();
							
						}else if (window.location.pathname !== "/home") {
							    window.location.href = "/home";
								errorSpan.text="";
						}else{
											
								errorSpan.textContent = "Sai thông tin đăng nhập";
								//errorSpan.style.display = "inline"; // Show the error
								//return;
						}
					}else{
						
						//	window.location.href = "/dang-nhap?error=true";
						errorSpan.textContent = "Sai thông tin đăng nhập";
						errorSpan.style.display = "inline"; // Show the error
						return;
					}
			 })
			   .catch(error => {
			       console.error('Error updating the cart:', error);
			   });
			
		});
		
		
		
		
		document.querySelector('.btn-layer-signup').addEventListener('click', function(event) {
		    event.preventDefault();
			
			const form = event.target.form; // Lấy đối tượng form từ sự kiện
			const myformData = new FormData(form);

			userDetails['pass'] = myformData.get('password');
			const retypePassword = myformData.get('repassword');
			const password = myformData.get('password');
			userDetails['email'] = myformData.get('email');
			const errorSpan = document.querySelector(".error-message");

			if (password !== retypePassword) {
				errorSpan.textContent = "Mật khẩu không khớp nhau";
				errorSpan.style.display = "inline"; // Show the error
				return; // Stop here, don't continue to fetch
			}

			fetch('/api/simple-register', { // Adjust the endpoint as needed
				method: 'POST', // Use POST to send data
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userDetails) // Send user details as JSON
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('Failed to fetch user data.');
					}
					return response.json();
				})
				.then(userClient => {
					console.log('User data received:', userClient);
					userDetails = userClient;

					if (window.location.pathname !== "/validation") {
						window.location.href = "/validation?username=" + userDetails['user'] + "&status=" + userDetails['note'];
					}
				})
				.catch(error => {
					console.error('Error fetching user data:', error);
				});
			
		});
	
		
	
});
