document.addEventListener("DOMContentLoaded", function() {
   
     fetch('/api/login', { // Adjust the endpoint as needed
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
		 userDetails = userClient;
       // console.log('User data received:', userClient);
        
        // Find the element by ID
      //  const usernameElement = document.getElementById("clientusername");
      //  const emailElement = document.getElementById("c_email_address");
        
        if(window.location.pathname === "/dat-hang"){
			if (window.location.pathname !== "/don-hang-cua-toi") {
			    window.location.href = "/don-hang-cua-toi";
			}
		}
        
        // Update the HTML if the element exists and user data is available
        if (document.getElementById("c_fname") && document.getElementById("c_lname")) {
          //  usernameElement.textContent = userClient.user; // Set the username
          //  emailElement.value = userClient.email; // Set the username
			//document.getElementById("c_fname").value = userClient.firstName;
			//document.getElementById("c_lname").value = userClient.lastName;
        }
		
		var shippingAddresses = userClient.shippingAddress;
		populateShippingAddresses(shippingAddresses) ;
		
		
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
    
    if(document.getElementById("togglePassword")){
		document.getElementById("togglePassword").addEventListener("click", function () {
		          let passwordField = document.getElementById("c_account_password");
		          if(passwordField){
			          if (passwordField.type === "password") {
			              passwordField.type = "text";
			              this.textContent = "🙈"; // Change icon to hide mode
			          } else {
			              passwordField.type = "password";
			              this.textContent = "👁️"; // Change icon to show mode
			          }
		          }
		  });
	  }
	  if(document.querySelector("#process")){
		  document.querySelector("#process").addEventListener("click", function (event) {
			const button = event.currentTarget;
			    
			    // If button is already processing, don't do anything
			    if (button.dataset.processing === "true") {
			      return;
			    }
			    
			    // Mark button as processing
			    button.dataset.processing = "true";
			    
			    // Optional: visual feedback
			    const originalText = button.textContent;
			    button.textContent = "Processing...";
			    button.disabled = true;
				
			let isValid = true;
			        let formGroups = document.querySelectorAll(".form-group");
			        const carrierCheck = document.querySelector('input[name="shippingCarrier"]:checked');
			        const carrierVal = carrierCheck ? carrierCheck.value : 'standard';
	
			        formGroups.forEach(function (group) {
			           // let label = group.querySelector("label span.text-danger");
			            let inputs = group.querySelectorAll("input");
			                inputs.forEach(function (input) {
			                    if (!input.offsetParent) return;
								let errorDiv = input.parentElement.querySelector("label span.text-danger");
			                    if(errorDiv){
									if (input.value.trim() === "" ) {
					                        isValid = false;
					                        input.classList.add("border-danger");
					                        showError(input, " Vui lòng không để trống!");
				                    } else {
										
										errorDiv.textContent ="";
				                        input.classList.remove("border-danger");
				                        hideError(input);
				                    }
								}
			                });
			        });
					
					let email = document.getElementById("c_email_address");
					    if (!validateEmail(email.value)) {
					        isValid = false;
					        showError(email, " Email không hợp lệ");
					    }else{
							userDetails['email']=email.value;
						}
					    

					    if (carrierVal === 'viettel') {
					        let vpPhone = document.getElementById('viettel_receiver_phone');
					        if (!vpPhone || !validatePhoneNumber(vpPhone.value)) {
					            isValid = false;
					            if (vpPhone) showError(vpPhone, " SĐT nhận hàng không hợp lệ");
					        }
						    } else if (carrierVal === 'ghtk') {
						        let ghtkPhone = document.getElementById('ghtk_receiver_phone');
						        if (!ghtkPhone || !validatePhoneNumber(ghtkPhone.value)) {
						            isValid = false;
						            if (ghtkPhone) showError(ghtkPhone, " SDT nhan hang khong hop le");
						        }
					    } else {
					        let phone = document.getElementById("c_phone");
					        if (!validatePhoneNumber(phone.value)) {
					            isValid = false;
					            showError(phone, " SĐT không hợp lệ");
					        } else {
					            userDetails['phoneNumber'] = phone.value;
					        }
					    }
					    
					    let checkBoxCreateAcc = document.getElementById("c_create_account");
					    if(checkBoxCreateAcc){
						    if(checkBoxCreateAcc.checked){
								let passfield = document.getElementById("c_account_password");
								let errorDiv = passfield.parentElement.querySelector(".validate-text");
							    if (!validatePassword(passfield.value)) {
							        isValid = false;
							        errorDiv.textContent = "Mật khẩu bao gồm chữ và số, ít nhất 8 ký tự."
							    }else{
									errorDiv.textContent ="";
									userDetails['phoneNumber']=passfield.value;
								}
							}
						}
					    
			        if (!isValid) {
			            event.preventDefault();
			            button.dataset.processing = "false";
			            button.textContent = originalText;
			            button.disabled = false;
			        } else {
						userDetails['firstName'] = document.getElementById("c_fname").value;
						userDetails['lastName'] = document.getElementById("c_lname").value;
						userDetails['note'] = document.getElementById("c_order_notes").value;

						const carrierRadio = document.querySelector('input[name="shippingCarrier"]:checked');
						const carrier = carrierRadio ? carrierRadio.value : 'standard';
						userDetails['shippingAgent'] = carrier;

						if (carrier === 'viettel') {
							const vpProvSel = document.getElementById('viettel_receiver_province');
							const vpDistSel = document.getElementById('viettel_receiver_district');
							const vpWardSel = document.getElementById('viettel_receiver_ward');
							userDetails['city']     = vpProvSel ? vpProvSel.options[vpProvSel.selectedIndex]?.text || '' : '';
							userDetails['district'] = vpDistSel ? vpDistSel.options[vpDistSel.selectedIndex]?.text || '' : '';
							userDetails['address']  = document.getElementById('viettel_receiver_street')?.value || '';
							userDetails['zipcode']  = '';
							userDetails['phoneNumber'] = document.getElementById('viettel_receiver_phone')?.value || '';
							userDetails['selectedAddress'] = '';
							userDetails['vpReceiverProvinceId'] = parseInt(vpProvSel?.value || 0);
							userDetails['vpReceiverDistrictId'] = parseInt(vpDistSel?.value || 0);
							userDetails['viettelReceiverProvince'] = vpProvSel?.value || '';
							userDetails['viettelReceiverDistrict'] = vpDistSel?.value || '';
							userDetails['viettelReceiverWard']     = vpWardSel?.value || '';
							userDetails['viettelReceiverStreet']   = document.getElementById('viettel_receiver_street')?.value || '';
							userDetails['viettelReceiverPhone']    = document.getElementById('viettel_receiver_phone')?.value || '';
							const spSel = document.getElementById('viettel_sender_province_sel');
							const sdSel = document.getElementById('viettel_sender_district_sel');
							userDetails['vpSenderProvinceId'] = parseInt(spSel?.value || document.getElementById('viettel_sender_province')?.value || 0);
							userDetails['vpSenderDistrictId'] = parseInt(sdSel?.value || document.getElementById('viettel_sender_district')?.value || 0);
							const whRadio = document.querySelector('input[name="selectedWarehouse"]:checked');
							if (whRadio) {
								userDetails['warehouseId']   = whRadio.value;
								userDetails['warehouseName'] = whRadio.getAttribute('data-wh-name') || '';
							}
							userDetails['weight']    = parseInt(document.getElementById('viettel_product_weight')?.value || 0);
							userDetails['codAmount'] = parseInt(document.getElementById('viettel_money_collection')?.value || 0);
							const selOpt = document.querySelector('input[name="shippingOption"]:checked');
							if (selOpt) {
								let typeCode = selOpt.value || '';
								let typeName = selOpt.getAttribute('data-service-name') || '';
								let shippingPrice = parseInt(selOpt.getAttribute('data-price') || 0);
								try { const parsed = JSON.parse(typeCode); typeCode = parsed.serviceCode || typeCode; typeName = parsed.serviceName || typeName; shippingPrice = parsed.totalFee || shippingPrice; } catch(e) {}
								userDetails['viettelTypeCode']      = typeCode;
								userDetails['viettelTypeName']      = typeName;
								userDetails['viettelShippingPrice'] = shippingPrice;
							}
																				} else if (carrier === 'ghtk') {
								const ghtkProvSel = document.getElementById('ghtk_receiver_province');
								const ghtkDistSel = document.getElementById('ghtk_receiver_district');
								userDetails['city']        = ghtkProvSel?.value || '';
								userDetails['district']    = ghtkDistSel?.value || '';
								userDetails['address']     = document.getElementById('ghtk_receiver_street')?.value || '';
								userDetails['zipcode']     = '';
								userDetails['phoneNumber'] = document.getElementById('ghtk_receiver_phone')?.value || '';
								userDetails['selectedAddress'] = '';
								userDetails['ghtkPickProvince']     = document.getElementById('ghtk_sender_province')?.value || '';
								userDetails['ghtkPickDistrict']     = document.getElementById('ghtk_sender_district')?.value || '';
								userDetails['ghtkReceiverProvince'] = ghtkProvSel?.value || '';
								userDetails['ghtkReceiverDistrict'] = ghtkDistSel?.value || '';
								userDetails['ghtkReceiverWard']     = document.getElementById('ghtk_receiver_ward')?.value || '';
								userDetails['ghtkReceiverStreet']   = document.getElementById('ghtk_receiver_street')?.value || '';
								userDetails['ghtkReceiverPhone']    = document.getElementById('ghtk_receiver_phone')?.value || '';
								const ghtkWhRadio = document.querySelector('input[name="selectedWarehouse"]:checked');
								if (ghtkWhRadio) {
									userDetails['warehouseId']   = ghtkWhRadio.value;
									userDetails['warehouseName'] = ghtkWhRadio.getAttribute('data-wh-name') || '';
								}
								userDetails['weight']    = parseInt(document.getElementById('ghtk_product_weight')?.value || 0);
								userDetails['codAmount'] = parseInt(document.getElementById('ghtk_money_collection')?.value || 0);
								const ghtkSelOpt = document.querySelector('input[name="ghtkShippingOption"]:checked');
								if (ghtkSelOpt) {
									const transport     = ghtkSelOpt.getAttribute('data-transport') || 'road';
									const shippingPrice = parseInt(ghtkSelOpt.getAttribute('data-price') || 0);
									userDetails['ghtkTransport']        = transport;
									userDetails['ghtkShippingPrice']    = shippingPrice;
									userDetails['viettelTypeCode']      = transport;
									userDetails['viettelTypeName']      = transport === 'fly' ? 'Hang khong' : 'Duong bo';
									userDetails['viettelShippingPrice'] = shippingPrice;
								}
							} else {
							userDetails['address']  = document.getElementById("c_address").value;
							userDetails['district'] = document.getElementById("c_district").value;
							userDetails['city']     = document.getElementById("c_state_country").value;
							userDetails['phoneNumber'] = document.getElementById("c_phone").value;
							userDetails['selectedAddress'] = document.getElementById("selectedAddressId").value;
							userDetails['zipcode']  = document.getElementById("c_postal_zip").value;
						}

							// Snapshot GHTK fields — @Transient fields are wiped by createuser response
							const _ghtkSnap = {};
							if (carrier === 'ghtk') {
								['shippingAgent','city','district','address','phoneNumber','zipcode','selectedAddress',
								 'weight','codAmount','warehouseId','warehouseName',
								 'ghtkPickProvince','ghtkPickDistrict','ghtkReceiverProvince','ghtkReceiverDistrict',
								 'ghtkReceiverWard','ghtkReceiverStreet','ghtkReceiverPhone',
								 'ghtkTransport','ghtkShippingPrice','viettelTypeCode','viettelTypeName','viettelShippingPrice'
								].forEach(k => { _ghtkSnap[k] = userDetails[k]; });
							}
						fetch('/api/createuser', { // Adjust the endpoint as needed
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
								userDetails= userClient;
									if (_ghtkSnap.shippingAgent === 'ghtk') { Object.assign(userDetails, _ghtkSnap); }

								
								if(userDetails.cart===null){
									let submmit = document.getElementById("process");
									showError(submmit, "Giỏ hàng trống");
								}else{
									
									fetch('/api/createorder', { // Adjust the endpoint as needed
										method: 'POST', // Use POST to send data
										headers: {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify(userDetails)  // Send user details as JSON
									})
										.then(response => {
											if (!response.ok) {
												throw new Error('Failed to fetch user data.');
											}
											return response.json();
										})
										.then(order => {
											console.log('User data received:', order);
											
											
											let clientusername = document.getElementById("clientusername");
											if (clientusername) {//logged
												 
												if (window.location.pathname !== "/dat-hang-thanh-cong") {
													window.location.href = "/dat-hang-thanh-cong?username=" +clientusername.value + "&order=" + order.stringId;
												}
	
											} else { // not log
												
												if (userDetails['id'] > 0) {//existed user
													
													if (window.location.pathname !== "/dat-hang-thanh-cong") {
														window.location.href = "/dat-hang-thanh-cong?username=" +userDetails['user'] + "&order=" + order.stringId;
													}
	
												} else { // new user
	
													if (window.location.pathname !== "/dat-hang-thanh-cong") {
														window.location.href = "/dat-hang-thanh-cong?newcustomer=true&username="  +userDetails['user'] + "&order=" + order.stringId;
													}
	
												}
											}
										})
										.catch(error => {
											console.error('Error fetching user data:', error);
										});
								}
						})
							.catch(error => {
								console.error('Error fetching user data:', error);
						})
						.finally(() => {
						        button.dataset.processing = "false";
						        button.textContent = originalText;
						        button.disabled = false;
						 });;
			        }
			    });
		    
		    }

		    function showError(input, message) {
		        let errorDiv = input.parentElement.querySelector(".text-danger");
				if(!errorDiv){
			        if (errorDiv.textContent !=="") {
			            errorDiv = document.createElement("div");
			            errorDiv.className = "error-message text-danger";
			            input.parentElement.appendChild(errorDiv);
			        }
				}else{
					if(!input.value.trim() === ""){
						errorDiv.textContent ="";
					}
				}
				
		        errorDiv.textContent = message;
		    }

		    function hideError(input) {
		        let errorDiv = input.parentElement.querySelector(".error-message");
		        if (errorDiv) {
		            errorDiv.remove();
		        }
		    }

});


function populateShippingAddresses(shippingAddresses) {
        const selectElement = document.getElementById("shippingAddressList");

		if(selectElement){
        // Clear existing options except "Mới"
	        selectElement.innerHTML = '<option data-id="00">Mới</option>';

	        // Populate options dynamically
	        shippingAddresses.forEach(address => {
	            let option = document.createElement("option");
	            option.setAttribute("data-id", address.stringId); // Store stringId
	            option.value = address.stringId; // Use stringId as value
	            option.textContent = `${address.city} - ${address.district}`;
	            selectElement.appendChild(option);
	        });

		if (selectElement.options.length > 1) {

			if (selectElement.options.length > 2) {
			    const firstOption = selectElement.options[0];
			    if (firstOption.getAttribute("data-id") === "00") {
			      selectElement.remove(0);
			    }
			  }
		    selectElement.selectedIndex = 1; // Index 1 = second option
		    // Trigger change event
		    const event = new Event('change', { bubbles: true });
		    selectElement.dispatchEvent(event);
		}
        }
    }

function fetchProvinces() {
       let input = document.getElementById("c_state_country");
       let query = input.value;
       let suggestions = document.getElementById("provinceList");
	     suggestions.style.opacity = "1";

       if (query.length < 1) {
           suggestions.innerHTML = "";
           return;
       }

       fetch(`/api/province-query?query=${query}`)
           .then(response => response.json())
           .then(data => {
               suggestions.innerHTML = ""; // Clear previous suggestions

               data.forEach(province => {
                   let div = document.createElement("div");
                   div.textContent = province.provinceName;
                   div.setAttribute("data-id", province.provinceId);
                   div.onclick = function () {
                       input.value = this.textContent;
                       input.setAttribute("data-selected-id", this.getAttribute("data-id"));
                       suggestions.innerHTML = ""; // Hide suggestions after selection
					   
					   let selectedProvinceId = input.getAttribute("data-selected-id"); // Get provinceId
					             if (selectedProvinceId) {
					                 document.getElementById("districtLabel").setAttribute("data-provinceid", selectedProvinceId);
					             }
                   };
                   suggestions.appendChild(div);
               });
           })
           .catch(error => console.error("Error fetching provinces:", error));
   }

   // Hide dropdown when clicking outside
   		document.addEventListener("click", function (event) {
       let suggestions = document.getElementById("provinceList");
       if(suggestions){
	       if (!event.target.closest("#c_state_country")) {
	           suggestions.innerHTML = "";
			   suggestions.style.opacity = "0";
	       }
       }
   });
   
	   
   	function fetchDistricts() {
           let input = document.getElementById("c_district");
           let provinceId = document.querySelector("label[data-provinceid]").getAttribute("data-provinceid");
           let query = input.value.trim();
           let suggestions = document.getElementById("districtList");
		   suggestions.style.opacity = "1";
           if (query.length < 1) {
               suggestions.innerHTML = "";
               return;
           }

           // Fetch districts from the backend servlet
           fetch(`/api/districts?provinceId=${provinceId}&query=${query}`)
               .then(response => response.json())
               .then(data => {
                   suggestions.innerHTML = ""; // Clear previous suggestions

                   data.forEach(district => {
                       let div = document.createElement("div");
                       div.textContent = district.districtName;
                       div.setAttribute("data-id", district.districtId);
                       div.onclick = function () {
                           input.value = this.textContent;
                           input.setAttribute("data-selected-id", this.getAttribute("data-id"));
                           suggestions.innerHTML = ""; // Hide suggestions
                       };
                       suggestions.appendChild(div);
                   });
               })
               .catch(error => console.error("Error fetching districts:", error));
       }

       // Hide dropdown when clicking outside
       document.addEventListener("click", function (event) {
           let suggestions = document.getElementById("districtList");
           if(suggestions){
	           if (!event.target.closest("#c_address")) {
	               suggestions.innerHTML = "";
				   suggestions.style.opacity = "0";
	           }
           }
       });
	   
	   
	   function validateEmail(email) {
		    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		    return re.test(email);
		}
		
		function validatePhoneNumber(phone) {
		    const re = /^\+?(?:[0-9] ?){6,15}[0-9]$/; 
		    return re.test(phone);
		}
		
		function validatePassword(password) {
		    const re = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
		    return re.test(password);
		}
	  
		
		function updateAddressFields(selectElement) {
	        const selectedOption = selectElement.options[selectElement.selectedIndex];
	        const selectedAddressId = selectedOption.getAttribute("data-id");

	        // Store selected ID for later use (update or create)
	        document.getElementById("selectedAddressId").value = selectedAddressId;
			
			if(selectedAddressId==="00"){
				document.getElementById("c_state_country").value = "";
				document.getElementById("c_postal_zip").value = "";
				document.getElementById("c_district").value = "";
				document.getElementById("c_address").value = "";
			}else{

			        // fetch address data 
				let username = userDetails['user'];
				if (selectedAddressId.length < 1) {
					suggestions.innerHTML = "";
					return;
				}
	
				// Fetch districts from the backend servlet
				fetch(`/api/shippingaddress?addressId=${selectedAddressId}&username=${username}`)
					.then(response => response.json())
					.then(data => {
						address = data;
							document.getElementById("c_phone").value = address.phone;
							document.getElementById("c_state_country").value = address.city;
							document.getElementById("c_postal_zip").value = address.zipcode;
							document.getElementById("c_district").value = address.district;
							document.getElementById("c_address").value = address.address;
							document.getElementById("c_order_notes").value = address.note;
					})
					.catch(error => console.error("Error fetching districts:", error));
			       
			   }
		   }
			