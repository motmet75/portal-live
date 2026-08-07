let pendingOrderDetails = null;

async function readOrderResponse(response) {
    let payload = {};
    try { payload = await response.json(); } catch (ignored) {}
    if (!response.ok) throw new Error(payload.error || payload.message || 'Yêu cầu không thành công.');
    return payload;
}

async function requestOrderOtp(orderDetails) {
    pendingOrderDetails = orderDetails;
    const email = (orderDetails.email || '').trim();
    const panel = document.getElementById('orderOtpPanel');
    const error = document.getElementById('orderOtpError');
    if (error) error.textContent = '';
    await fetch('/api/order/send-code', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email})
    }).then(readOrderResponse);
    const message = document.getElementById('orderOtpMessage');
    if (message) message.textContent = 'Mã gồm 6 chữ số đã gửi đến ' + email + '. Mã có hiệu lực trong 10 phút.';
    if (panel) { panel.hidden = false; panel.scrollIntoView({behavior: 'smooth', block: 'center'}); }
    document.getElementById('orderOtpCode')?.focus();
}

async function createVerifiedOrder() {
    if (!pendingOrderDetails) throw new Error('Vui lòng bấm Đặt hàng để chuẩn bị đơn trước.');
    const order = await fetch('/api/createorder', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(pendingOrderDetails)
    }).then(readOrderResponse);
    const clientusername = document.getElementById('clientusername');
    let target = '/dat-hang-thanh-cong?';
    if (clientusername) target += 'username=' + encodeURIComponent(clientusername.value);
    else if (pendingOrderDetails.id > 0) target += 'username=' + encodeURIComponent(pendingOrderDetails.user || '');
    else target += 'newcustomer=true&username=' + encodeURIComponent(pendingOrderDetails.user || '');
    window.location.href = target + '&order=' + encodeURIComponent(order.stringId);
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('verifyOrderOtp')?.addEventListener('click', async function () {
        const code = (document.getElementById('orderOtpCode')?.value || '').trim();
        const error = document.getElementById('orderOtpError');
        if (!/^\d{6}$/.test(code)) { if (error) error.textContent = 'Vui lòng nhập đúng mã gồm 6 chữ số.'; return; }
        this.disabled = true;
        try {
            await fetch('/api/order/verify-code', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: pendingOrderDetails.email, code})
            }).then(readOrderResponse);
            await createVerifiedOrder();
        } catch (e) {
            if (error) error.textContent = e.message;
            this.disabled = false;
        }
    });
    document.getElementById('resendOrderOtp')?.addEventListener('click', function () {
        if (pendingOrderDetails) requestOrderOtp(pendingOrderDetails).catch(e => {
            const error = document.getElementById('orderOtpError'); if (error) error.textContent = e.message;
        });
    });
});

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
        // expose globally for shipping option handlers
        window.userDetails = userClient;
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
		
		// --- New: pre-fill Viettel quick estimate inputs from cart if available ---
		try {
			if (userClient && userClient.cart) {
				const cart = userClient.cart;
				// Calculate total weight from items (assume 500g default per item if weight missing)
				let totalWeight = 0;
				if (cart.items && Array.isArray(cart.items)) {
					cart.items.forEach(it => {
						const w = parseInt(it.weight) || 500;
						const q = parseInt(it.quantity) || 1;
						totalWeight += w * q;
					});
				} else {
					totalWeight = 500;
				}
				// Set inputs if they exist
				const weightEl = document.getElementById('viettel_product_weight');
				const priceEl = document.getElementById('viettel_product_price');
				const codEl = document.getElementById('viettel_money_collection');
				if (weightEl) weightEl.value = Math.max(500, totalWeight);
				if (priceEl) {
					// Prefer cart.totalPrice or sum of item totalPrice
					let totalPrice = 0;
					if (typeof cart.totalPrice !== 'undefined' && cart.totalPrice !== null) {
						totalPrice = cart.totalPrice;
					} else if (cart.items && Array.isArray(cart.items)) {
						cart.items.forEach(it => { totalPrice += parseFloat(it.totalPrice) || 0; });
					}
					priceEl.value = Math.round(totalPrice);
				}
				if (codEl) codEl.value = 0;
			}
		} catch (e) {
			console.warn('Failed to prefill Viettel inputs from cart', e);
		}
		// --- end pre-fill ---
		
		
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
			            let inputs = group.querySelectorAll("input");
			                inputs.forEach(function (input) {
			                    // skip inputs inside hidden containers (e.g. standardAddressFields when viettel is active)
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

						// Detect carrier selection
						const carrierRadio = document.querySelector('input[name="shippingCarrier"]:checked');
						const carrier = carrierRadio ? carrierRadio.value : 'standard';
						userDetails['shippingAgent'] = carrier;

						if (carrier === 'viettel') {
							// Read receiver address from Viettelpost-specific fields
							const vpProvSel = document.getElementById('viettel_receiver_province');
							const vpDistSel = document.getElementById('viettel_receiver_district');
							const vpWardSel = document.getElementById('viettel_receiver_ward');
							userDetails['city']     = vpProvSel ? vpProvSel.options[vpProvSel.selectedIndex]?.text || '' : '';
							userDetails['district'] = vpDistSel ? vpDistSel.options[vpDistSel.selectedIndex]?.text || '' : '';
							userDetails['address']  = document.getElementById('viettel_receiver_street')?.value || '';
							userDetails['zipcode']  = '';
							userDetails['phoneNumber'] = document.getElementById('viettel_receiver_phone')?.value || '';
							userDetails['selectedAddress'] = '';
							userDetails['viettelReceiverProvince'] = vpProvSel?.value || '';
							userDetails['viettelReceiverDistrict'] = vpDistSel?.value || '';
							userDetails['viettelReceiverWard']     = vpWardSel?.value || '';
							userDetails['viettelReceiverStreet']   = document.getElementById('viettel_receiver_street')?.value || '';
							userDetails['viettelReceiverPhone']    = document.getElementById('viettel_receiver_phone')?.value || '';
							// VP IDs for server-side price refresh
							userDetails['vpReceiverProvinceId'] = parseInt(vpProvSel?.value || 0);
							userDetails['vpReceiverDistrictId'] = parseInt(vpDistSel?.value || 0);
							const spSel = document.getElementById('viettel_sender_province_sel');
							const sdSel = document.getElementById('viettel_sender_district_sel');
							userDetails['viettelSenderProvince'] = spSel?.value || document.getElementById('viettel_sender_province')?.value || '';
							userDetails['viettelSenderDistrict'] = sdSel?.value || document.getElementById('viettel_sender_district')?.value || '';
							userDetails['vpSenderProvinceId'] = parseInt(spSel?.value || document.getElementById('viettel_sender_province')?.value || 0);
							userDetails['vpSenderDistrictId'] = parseInt(sdSel?.value || document.getElementById('viettel_sender_district')?.value || 0);
							// Warehouse (set by onWarehouseSelect in fcheckout.html)
							const whRadio = document.querySelector('input[name="selectedWarehouse"]:checked');
							if (whRadio) {
								userDetails['warehouseId']   = whRadio.value;
								userDetails['warehouseName'] = whRadio.getAttribute('data-wh-name') || '';
							}
							// Weight + COD from estimate fields
							userDetails['weight']    = parseInt(document.getElementById('viettel_product_weight')?.value || 0);
							userDetails['codAmount'] = parseInt(document.getElementById('viettel_money_collection')?.value || 0);
							// Collect selected Viettelpost service option
							const selOpt = document.querySelector('input[name="shippingOption"]:checked');
							if (selOpt) {
								let typeCode = selOpt.value || '';
								let typeName = selOpt.getAttribute('data-service-name') || '';
								let shippingPrice = parseInt(selOpt.getAttribute('data-price') || 0);
								// fcheckout.html renderShippingOptions stores the full option as JSON in value
								try {
									const parsed = JSON.parse(typeCode);
									typeCode = parsed.serviceCode || typeCode;
									typeName = parsed.serviceName || typeName;
									shippingPrice = parsed.totalFee || shippingPrice;
								} catch(e) {}
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
									
									// Attach selected shipping option to userDetails before creating order
									try {
										if (userDetails['shippingAgent'] === 'viettel') {
											// For Viettelpost, data was already collected in submit handler above.
											// Just validate a service was selected if options are shown.
											if (!userDetails['viettelTypeCode']) {
												const selOpt = document.querySelector('input[name="shippingOption"]:checked');
												if (selOpt) {
													let code = selOpt.value || '';
													let name = selOpt.getAttribute('data-service-name') || '';
													let fee  = parseInt(selOpt.getAttribute('data-price') || 0);
													try { const o = JSON.parse(code); code = o.serviceCode || code; name = o.serviceName || name; fee = o.totalFee || fee; } catch(e){}
													userDetails['viettelTypeCode']      = code;
													userDetails['viettelTypeName']      = name;
													userDetails['viettelShippingPrice'] = fee;
												} else {
													const anyOpt = document.querySelectorAll('#shippingOptions .form-check input[type=radio], #shippingOptions .shipping-option-item');
													if (anyOpt && anyOpt.length > 0) {
														throw new Error('Vui lòng chọn tùy chọn giao hàng Viettel Post trước khi đặt hàng.');
													}
												}
											}
										}
									} catch (err) {
										throw err;
									}
									
									requestOrderOtp(userDetails).catch(error => {
										console.error('Error sending order OTP:', error);
										const otpPanel = document.getElementById('orderOtpPanel');
										const otpError = document.getElementById('orderOtpError');
										if (otpPanel) otpPanel.hidden = false;
										if (otpError) otpError.textContent = error.message;
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

});

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
				errorDiv.style.display = "block";
				input.classList.add("border-danger");
				input.classList.remove("border-success");
				input.focus();
		    }
		    
		    function hideError(input) {
		        let errorDiv = input.parentElement.querySelector(".text-danger");
		        if(errorDiv){
					errorDiv.textContent ="";
					errorDiv.style.display = "none";
				}
				input.classList.remove("border-danger");
				input.classList.add("border-success");
		    }
		    
		    function validateEmail(email) {
		        // Basic email validation regex
		        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		        return re.test(String(email).toLowerCase());
		    }
		    
		    function validatePhoneNumber(phone) {
		        // Basic phone number validation (adjust as needed)
		        const re = /^\d{10}$/;
		        return re.test(String(phone));
		    }
		    
		    function validatePassword(password) {
		        // Password must be at least 8 characters, and include at least one number and one letter
		        const re = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
		        return re.test(String(password));
		    }
		    
			    function populateShippingAddresses(addresses) {
	        const container = document.getElementById("shippingAddressContainer");
	        if (!container) return;
	        container.innerHTML = ""; // Clear existing addresses
        
        if (!Array.isArray(addresses) || addresses.length === 0) {
            container.innerHTML = "<p class='text-center'>Không có địa chỉ giao hàng nào.</p>";
            return;
        }
        
        addresses.forEach(address => {
            const div = document.createElement("div");
            div.className = "address-item";
            div.innerHTML = `
                <div class="address-details">
                    <p><strong>${address.name}</strong></p>
                    <p>${address.address}, ${address.district}, ${address.city}, ${address.zipcode}</p>
                    <p>SĐT: ${address.phoneNumber}</p>
                    <p>Email: ${address.email}</p>
                </div>
                <div class="address-actions">
                    <button class="btn btn-primary btn-sm" onclick="selectAddress('${address.id}')">Chọn địa chỉ</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAddress('${address.id}', this)">Xóa</button>
                </div>
            `;
            container.appendChild(div);
        });
    }
    
    window.selectAddress = function(addressId) {
        // Deselect all addresses
        document.querySelectorAll(".address-item").forEach(item => {
            item.classList.remove("selected");
        });
        
        // Select the clicked address
        const selectedItem = document.querySelector(`.address-item[data-address-id="${addressId}"]`);
        if (selectedItem) {
            selectedItem.classList.add("selected");
            document.getElementById("selectedAddressId").value = addressId;
        }
    }
    
    window.deleteAddress = function(addressId, btn) {
        if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
        
        // Find the address item
        const addressItem = btn.closest(".address-item");
        if (addressItem) {
            addressItem.remove();
        }
        
        // Optionally, send a request to the server to delete the address
        fetch('/api/delete-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: addressId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Địa chỉ đã được xóa.");
            } else {
                alert("Lỗi khi xóa địa chỉ: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting address:', error);
            alert("Lỗi kết nối. Vui lòng thử lại.");
        });
    }
	
	/**
 * Ensure Viettel Post token is configured in backend. Alerts exact message if missing.
 */
async function ensureViettelToken() {
    try {
        const res = await fetch('/viettelpost/check-token/default');
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        if (!json.success || json.isValid !== true) {
            alert('No token available. Please configure token in backend.');
            return false;
        }
        return true;
    } catch (err) {
        console.error('Token check failed', err);
        alert('No token available. Please configure token in backend.');
        return false;
    }
}

/**
 * Collect selected items from the cart grid.
 * This implementation expects checkboxes with class "cart-item-checkbox" and data-item-id attribute.
 */
function getSelectedGridItems() {
    const checkboxes = document.querySelectorAll('.cart-item-checkbox:checked');
    const ids = [];
    checkboxes.forEach(cb => {
        const id = cb.getAttribute('data-item-id');
        if (id) ids.push(id);
    });
    return ids;
}

/**
 * Trigger server-side Excel generation for selected cart items.
 * Expects POST /api/export-cart-excel with JSON { itemIds: [...] } and response as blob Excel file.
 */
async function exportCartToExcel() {
    const selected = getSelectedGridItems();
    if (!selected || selected.length === 0) {
        alert('Vui lòng chọn ít nhất một mục để xuất file Excel.');
        return;
    }

    try {
        const res = await fetch('/api/export-cart-excel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemIds: selected })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error('Export failed: ' + text);
        }

        const blob = await res.blob();
        const filename = 'cart-selected-items.xlsx';
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Export error', err);
        alert('Lỗi khi xuất Excel. Vui lòng thử lại.');
    }
}

// Attach click handler to export button if present
const exportBtn = document.getElementById('exportExcelBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', function () {
        exportCartToExcel();
    });
}

/**
 * Estimate shipping using values from the quick estimate form
 */
async function estimateShippingFromForm() {
    // Ensure token present
    const tokenOk = await ensureViettelToken();
    if (!tokenOk) return;

    // Read inputs
    const weightInput = document.getElementById('viettel_product_weight');
    const priceInput = document.getElementById('viettel_product_price');
    const codInput = document.getElementById('viettel_money_collection');

    const provinceInput = document.getElementById('c_state_country');
    const districtInput = document.getElementById('c_district');

    const weight = parseInt(weightInput && weightInput.value) || 500;
    const price = parseInt(priceInput && priceInput.value) || 0;
    const cod = parseInt(codInput && codInput.value) || 0;

    // Derive selected province/district ids (set by autocomplete handlers)
    const provinceIdAttr = provinceInput && provinceInput.getAttribute('data-selected-id');
    const districtIdAttr = districtInput && districtInput.getAttribute('data-selected-id');

    if (!provinceIdAttr || !districtIdAttr) {
        alert('Vui lòng chọn tỉnh/thành và quận/huyện nhận hàng trước khi ước tính.');
        return;
    }

    const address = {
        provinceId: provinceIdAttr,
        districtId: districtIdAttr,
        city: provinceInput ? provinceInput.value : '',
        district: districtInput ? districtInput.value : '',
        address: document.getElementById('c_address') ? document.getElementById('c_address').value : '',
        phone: document.getElementById('c_phone') ? document.getElementById('c_phone').value : ''
    };

    // Build temporary cart expected by buildPriceRequest
    const tempCart = {
        items: [ { weight: weight, quantity: 1, totalPrice: price } ],
        totalPrice: price
    };

    const optionsContainer = document.getElementById('shippingOptions');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '<div class="shipping-loading"><div class="spinner"></div> <p>Đang tải tùy chọn giao hàng...</p></div>';

    // Get token and call shipment-options as in fetchShippingOptions but with tempCart
    fetch('/viettelpost/token')
        .then(response => response.json())
        .then(tokenData => {
            if (!tokenData || !tokenData.token) {
                alert('No token available. Please configure token in backend.');
                optionsContainer.innerHTML = '<div class="shipping-error">Lỗi: Không thể kết nối với dịch vụ giao hàng</div>';
                return;
            }

            //const priceRequest = buildPriceRequest(address, tempCart);
            const priceRequest = buildPriceRequest(address, tempCart, { weightOverrideGr: weight, moneyCollectionOverride: cod });

            return fetch('/viettelpost/shipment-options', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': tokenData.token
                },
                body: JSON.stringify(priceRequest)
            });
        })
        .then(response => response ? response.json() : null)
        .then(data => {
            if (data && data.success && data.data && data.data.length > 0) {
                displayShippingOptions(data.data);
            } else {
                optionsContainer.innerHTML = '<div class="shipping-error">Không có tùy chọn giao hàng khả dụng cho địa chỉ/khối lượng này.</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching shipping options:', error);
            optionsContainer.innerHTML = '<div class="shipping-error">Lỗi khi tải tùy chọn giao hàng. Vui lòng thử lại.</div>';
        });
}

// Attach estimate button handler
const viettelEstimateBtn = document.getElementById('viettelEstimateBtn');
if (viettelEstimateBtn) {
    viettelEstimateBtn.addEventListener('click', function () {
        estimateShippingFromForm();
    });
}

/**
 * Build price request for Viettel Post API
 * Accepts optional overrides: { weightOverrideGr, moneyCollectionOverride }
 */
function buildPriceRequest(address, cart, overrides) {
    overrides = overrides || {};
    // Calculate total weight and price from cart
    let totalWeight = 0; // in grams
    let totalPrice = 0;

    if (cart && cart.items) {
        cart.items.forEach(item => {
            const w = parseInt(item.weight) || 500;
            const q = parseInt(item.quantity) || 1;
            totalWeight += w * q;
            totalPrice += parseFloat(item.totalPrice) || 0;
        });
    }

    // Apply weight override (grams) if provided
    if (overrides.weightOverrideGr && parseInt(overrides.weightOverrideGr) > 0) {
        totalWeight = parseInt(overrides.weightOverrideGr);
    }

    const weightInGrams = Math.max(totalWeight, 500);

    // Apply money collection override if provided
    if (typeof overrides.moneyCollectionOverride !== 'undefined') {
        totalPrice = parseFloat(overrides.moneyCollectionOverride) || totalPrice;
    }

    // Try to read sender province/district from hidden inputs if provided in template
    let senderProvince = 1;
    let senderDistrict = 1;
    try {
        const spEl = document.getElementById('viettel_sender_province');
        const sdEl = document.getElementById('viettel_sender_district');
        if (spEl && spEl.value) senderProvince = parseInt(spEl.value) || senderProvince;
        if (sdEl && sdEl.value) senderDistrict = parseInt(sdEl.value) || senderDistrict;
    } catch (e) { /* ignore */ }

    return {
        PRODUCT_WEIGHT: Math.ceil(weightInGrams / 1000), // convert to kg as integer
        PRODUCT_PRICE: totalPrice,
        MONEY_COLLECTION: totalPrice,
        SENDER_PROVINCE: senderProvince,
        SENDER_DISTRICT: senderDistrict,
        RECEIVER_PROVINCE: parseInt(address.provinceId) || 1,
        RECEIVER_DISTRICT: parseInt(address.districtId) || 1,
        PRODUCT_TYPE: 'HH',
        NATIONAL_TYPE: 1
    };
}

/**
 * Format number to VND string with thousands separator
 */
function formatPrice(price) {
    if (price === null || typeof price === 'undefined') return '0';
    return Number(price).toLocaleString('en-US');
}

/**
 * Render shipping options into the UI
 */
function displayShippingOptions(options) {
    const optionsContainer = document.getElementById('shippingOptions');
    if (!optionsContainer) return;

    if (!options || options.length === 0) {
        optionsContainer.innerHTML = '<p class="text-muted">Không có tùy chọn giao hàng khả dụng</p>';
        return;
    }

    let html = '';
    options.forEach((opt, idx) => {
        const id = `viettel_opt_${idx}`;
        html += `
            <div class="shipping-option-item" data-service-code="${opt.serviceCode || ''}" data-total-fee="${opt.totalFee || 0}">
                <input type="radio" id="${id}" name="shippingOption" value="${opt.serviceCode || ''}" data-price="${opt.totalFee || 0}" data-service-name="${opt.serviceName || ''}" ${idx === 0 ? 'checked' : ''} />
                <label for="${id}" style="margin-left:8px;">
                    <strong>${opt.serviceName || ''}</strong>
                    <div style="font-size:12px;color:#666">Thời gian: ${opt.deliveryTime || 'N/A'}</div>
                </label>
                <div style="float:right; font-weight:bold; color:#e74c3c">${formatPrice(opt.totalFee)} đ</div>
                <div style="clear:both"></div>
            </div>
        `;
    });

    optionsContainer.innerHTML = html;

    // Attach change handlers
    document.querySelectorAll('input[name="shippingOption"]').forEach(r => {
        r.addEventListener('change', function () { handleShippingOptionChange(this); });
    });

    // Trigger selection of first
    const first = document.querySelector('input[name="shippingOption"]');
    if (first) handleShippingOptionChange(first);
}

function handleShippingOptionChange(radio) {
    // clear selected class
    document.querySelectorAll('.shipping-option-item').forEach(i => i.classList.remove('selected'));
    if (radio && radio.closest) {
        const p = radio.closest('.shipping-option-item'); if (p) p.classList.add('selected');
    }

    if (!window.userDetails) window.userDetails = {};
    window.userDetails.shippingOption = {
        serviceCode: radio ? radio.value : null,
        serviceName: radio ? radio.getAttribute('data-service-name') : null,
        fee: radio ? parseInt(radio.getAttribute('data-price') || 0) : 0
    };

    updateOrderTotal();
}

function updateOrderTotal() {
    // If there's an element showing total we can update it; otherwise just log
    try {
        const totalElm = document.querySelector('.product-price.small');
        if (totalElm && window.userDetails && window.userDetails.cart && window.userDetails.cart.totalPrice != null && window.userDetails.shippingOption) {
            const base = Number(window.userDetails.cart.totalPrice || 0);
            const fee = Number(window.userDetails.shippingOption.fee || 0);
            const newTotal = base + fee;
            totalElm.textContent = new Intl.NumberFormat('en-US').format(newTotal) + ' đ';
        }
    } catch (e) { console.warn('updateOrderTotal failed', e); }
}
