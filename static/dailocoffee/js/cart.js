
document.addEventListener("DOMContentLoaded", function() {
    // Select all product containers
    const products = document.querySelectorAll('.product-row');

    // Loop through each product
    products.forEach(product => {
        const qtyInput = product.querySelector('.input-number input');
        const addToCartBtn = product.querySelector('.add-to-cart-btn');
        const qtyUp = product.querySelector('.qty-up');
        const qtyDown = product.querySelector('.qty-down');
        

        // Update the button's data-qty attribute based on the input value
        function updateButtonDataQty() {
            const qtyValue = qtyInput.value;
            addToCartBtn.setAttribute('data-qty', qtyValue);
        }

        // Input field change listener
        qtyInput.addEventListener('input', updateButtonDataQty);

        // Increment quantity
        qtyUp.addEventListener('click', function() {
            qtyInput.value = parseInt(qtyInput.value) + 1;
            updateButtonDataQty();
        });

        // Decrement quantity
        qtyDown.addEventListener('click', function() {
            if (qtyInput.value > 1) {
                qtyInput.value = parseInt(qtyInput.value) - 1;
                updateButtonDataQty();
               
            }
        });

        // Initialize the button with the starting quantity
        updateButtonDataQty();
    });
    
     
    
});

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
		        note: 'none',
				zipcode: "000",
		        cart: {}
};

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', (event) => {
        let newQuantity = Number(event.target.value); // Convert to number

        // Prevent negative or zero values
        if (newQuantity < 1) {
            newQuantity = 1;
            event.target.value = 1; // Update input field to reflect new value
        }

        const button = event.target.closest('.product-row').querySelector('.add-to-cart-btn');

        if (button) {
            button.setAttribute('data-qty', newQuantity); // Update data-qty of the button
        }
    });
});


function logout() {
	fetch('/api/logout', { // Adjust the endpoint as needed
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
			if (window.location.pathname === "/don-hang-cua-toi") {
											    window.location.href = "/dat-hang";
											//	location.reload();
			 }else{
				
				location.reload();
			 }
									        
	       
		 
	    })
	    .catch(error => {
	        console.error('Error fetching user data:', error);
	    });
	}

let cart = {
	items: [],
	totalItems: 0,
	currency: 'VNĐ',
	tenantId: '',
	language: 'vi',
	email: 'none',
	totalPrice: 0,
	formatedPrice: '0',
	note: 'none'
	
};

function addToCart(product, event) {
	event.preventDefault();
    // Check if the product is already in the cart
    let id = product.colorCode;
	if(id === null || id === '-' || id === 'none' ){
		showNotification('error', 'Hãy chọn màu sắc/kích cỡ');
	}else if(product.quantity < 1){
		showNotification('error', 'Hãy nhập số lượng');
	} else{
	    if(id != '-' && product.quantity > 0){
	 	cart.items = [];
			if(product.imageUrl==null){
				product.imageUrl = 'none';
			}
	        cart.items.push(product);
	
	    // Update cart totals
	    
	    cart.totalPrice += parseFloat(product.price);
	    
	
		// Send updated cart to the server
		//submitCartToServer(cart);
		
		 $.ajax({
	             method: 'POST',
	            url:'/cart/add',
	             data: JSON.stringify(cart), // Convert cart object to JSON
	    		contentType: 'application/json', // Specify content type
	            success: function(response) {
	                console.log('Form submitted successfully:', response);
	                cart = response;
	                updateCartUI(cart);
					showNotification('success', 'Đã thêm vào giỏ hàng: '+ product.name + ' ' +  id);
	            },
	            error: function() {
	                alert("An error occurred.");
	            }
	        });
	
		}else{
			showNotification('error', 'Hãy chọn loại sản phẩm');
		}
  }
    
	

}

function submitCartToServer(cart) {
    fetch('/cart/add', { // Adjust the endpoint as needed
        method: 'POST', // Use POST to send data
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart) // Sending the cart object as JSON
		}).then(response => {
	        if (!response.ok) {
	            throw new Error('Failed to update the cart on the server.');
	        }
	        return response.json();
	    })
	    .then(cart => {
	        console.log('Cart successfully updated on the server:', cart);
	 })
    .catch(error => {
        console.error('Error updating the cart:', error);
    });
}

function updateCartUIPage() {
    // Update cart count

    // Update cart items list
    const cartItemsContainer = document.querySelector('.cart-items-body');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    cart.items.forEach(item => {
        const li = document.createElement('tr');
        li.innerHTML = `
		<td   style="font-weight:bold;color:black;  font-size:18px;"> ${item.id} </td>
		<td class="product-thumbnail">
		
											<img src="${item.imageUrl}" alt="Image" class="img-fluid">
											</td>
											<td class="product-name">
												<h2 class="h5 text-black" >${item.name}</h2>
											</td>
											<td  style="font-weight:bold;color:red;  font-size:18px;">${item.formatedPrice}</td>
											<td  style="font-weight:bold;color:red;  font-size:18px;">${item.quantity} </td>
											
											<td>
												<div
													class="input-group mb-3 d-flex align-items-center quantity-container"
													style="max-width: 120px;">
													<div class="input-group-prepend">
														<button class="btn btn-outline-black decrease" type="button" onclick="decreaseQty(event,${item.quantity} )">&minus;</button>
													</div>
													<input type="text" value="${item.quantity}" 
														class="form-control text-center quantity-amount" data-item-id="${item.id}"
														placeholder="" aria-label="Example text with button addon"
														aria-describedby="button-addon1">
													<div class="input-group-append">
														<button class="btn btn-outline-black increase" type="button" onclick="increaseQty(event,${item.quantity} )">&plus;</button>
													</div>
												</div>

											</td>
											<td   style="font-weight:bold;color:red;  font-size:18px;">${item.totalPrice}${cart.currency}</td>
											<td><a class="btn btn-black btn-sm" onclick="removeFromCart2(  ${item.id}  )" >Xóa</a></td>
							`;
        cartItemsContainer.appendChild(li);
    });

    // Update total price
	 if(cart.items.length>0){
    		 document.getElementById('cart-total-price-page').textContent = `${cart.formatedPrice}` + `${cart.currency}`;
    		 document.getElementById('cart-total-price-page-floating').textContent = `${cart.formatedPrice}` + `${cart.currency}`;
    }else{
		 document.getElementById('cart-total-price-page').textContent = `0` + `${cart.currency}`;
		 document.getElementById('cart-total-price-page-floating').textContent = `0` + `${cart.currency}`;
	}

}





document.querySelectorAll('.quantity-amount').forEach(input => {
    input.addEventListener('input', (event) => {
        let newQuantity = Number(event.target.value); // Get the new value as a number

        // Prevent negative values
        if (newQuantity < 0) {
            newQuantity = 0; // Reset to 0 if negative value is entered
            event.target.value = 0; // Update input field to reflect new value
        }

        // Prepare the data to send to the server (adjust accordingly to your server API)
        const itemId = event.target.closest('.quantity-amount').getAttribute('data-item-id'); // Assuming item ID is stored in a data attribute
		const formData = new FormData();
		formData.append("quantity", newQuantity);
		formData.append("id", itemId);
        // Send the updated quantity to the server
		if (itemId > -1) {
		        
		        fetch('/cart/update/', { // Adjust the endpoint as needed
		        method: 'POST',
				body: formData,
			    }).then(response => {
			        if (!response.ok) {
			            throw new Error('Failed to update the cart on the server.');
			        }
			       return response.json(); 
			    })
			    .then(data => {
			        // Assuming `data` is the updated cart object of type `Cart`
			        cart = data; // Assign response to the `cart` variable
			        updateCartUIPage(); // Update the UI with the new cart
					reInitializeEventQtyTextBox();
					 
					showNotification('success', 'Đã sửa sản phẩm thứ: ' + itemId);
			    })
			    .catch(error => {
			        console.error('Error updating the cart:', error);
					showNotification('success', 'Lỗi');
			    });
		       
		}
    });
});


function reInitializeEventQtyTextBox() {

	document.querySelectorAll('.quantity-amount').forEach(input => {
		
		const newtextBox = input.cloneNode(true);
				
		input.replaceWith(newtextBox);
				
		newtextBox.addEventListener('input', (event) => {
		       let newQuantity = Number(event.target.value); // Get the new value as a number

		       // Prevent negative values
		       if (newQuantity < 0) {
		           newQuantity = 0; // Reset to 0 if negative value is entered
		           event.target.value = 0; // Update input field to reflect new value
		       }

		       // Prepare the data to send to the server (adjust accordingly to your server API)
		       const itemId = event.target.closest('.quantity-amount').getAttribute('data-item-id'); // Assuming item ID is stored in a data attribute
			const formData = new FormData();
			formData.append("quantity", newQuantity);
			formData.append("id", itemId);
		       // Send the updated quantity to the server
			if (itemId > -1) {
			        
			        fetch('/cart/update/', { // Adjust the endpoint as needed
			        method: 'POST',
					body: formData,
				    }).then(response => {
				        if (!response.ok) {
				            throw new Error('Failed to update the cart on the server.');
				        }
				       return response.json(); 
				    })
				    .then(data => {
				        // Assuming `data` is the updated cart object of type `Cart`
				        cart = data; // Assign response to the `cart` variable
				        updateCartUIPage(); // Update the UI with the new cart
						reInitializeEventQtyTextBox();
						reinit();
						showNotification('success', 'Đã sửa sản phẩm thứ: ' + itemId);
						
				    })
				    .catch(error => {
				        console.error('Error updating the cart:', error);
						showNotification('success', 'Lỗi');
				    });
			       
			}
		   });
	});

}

function removeFromCart(productId) {

    if (productId > -1) {
        
        fetch('/cart/remove/'+productId, { // Adjust the endpoint as needed
        method: 'POST',
	    }).then(response => {
	        if (!response.ok) {
	            throw new Error('Failed to update the cart on the server.');
	        }
	       return response.json(); 
	    })
	    .then(data => {
	        // Assuming `data` is the updated cart object of type `Cart`
	        cart = data; // Assign response to the `cart` variable
	        updateCartUI(cart); // Update the UI with the new cart
			reInitializeEventQtyTextBox();
			showNotification('success', 'Đã xóa sản phảm số: ' + productId);
	    })
	    .catch(error => {
	        console.error('Error updating the cart:', error);
			showNotification('success', 'Lỗi');
	    });
       
    }
}
function removeFromCart2(productId) {

    if (productId > -1) {
        
        fetch('/cart/remove/'+productId, { // Adjust the endpoint as needed
        method: 'POST',
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to update the cart on the server.');
        }
       return response.json(); 
    })
    .then(data => {
        // Assuming `data` is the updated cart object of type `Cart`
        cart = data; // Assign response to the `cart` variable
		updateCartUIPage();
		reInitializeEventQtyTextBox();
		reinit();
		showNotification('success', 'Đã xóa sản phảm số: ' + productId);
    })
    .catch(error => {
        console.error('Error updating the cart:', error);
		showNotification('success', 'Lỗi');
    });
       
    }
}

function updateCartUI(updatedCart) {
    // Select the cart container
    document.querySelector('.cart-count').textContent = cart.totalItems;

    // Update cart items list
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    updatedCart.items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
		<p style="margin-right: 5px;">${item.id}<p>
            <img src="${item.imageUrl}" style="wild: 50px; height: 50px; padding-right:1rem;"  alt="Product Image">
            <div class="item-details">
                <p>${item.name}</p>  
                <p>${item.colorCode}</p>  
                <span style="font-weight:bold;color:red;">${item.quantity} x </span> <span style="font-weight:bold;color:red;">${item.formatedPrice}</span>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Xóa</button>
        `;
        cartItemsContainer.appendChild(li);
    });

    // Update total price
    if(updatedCart.items.length>0){
     document.getElementById('cart-total-price').textContent = `${updatedCart.formatedPrice}` + `${updatedCart.currency}`;
     document.getElementById('cart-total-price-floating').textContent = `${updatedCart.formatedPrice}` + `${updatedCart.currency}`;
    }else{
		 document.getElementById('cart-total-price').textContent = `0` + `${updatedCart.currency}`;
		 document.getElementById('cart-total-price-floating').textContent = `0` + `${updatedCart.currency}`;
	}
}

function toggleCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
}


// Add event listeners to "Add to Cart" buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
		  // Ngăn hành động mặc định của nút
        const product = {
            id: 0,
            name: button.getAttribute('data-productName'),
            productCode: button.getAttribute('data-productCode'),
            colorCode: button.getAttribute('data-productColor'),
            sizeCode: button.getAttribute('data-productSize'),
            imageUrl: button.getAttribute('data-image'),
            price: button.getAttribute('data-productPrice'),
            quantity: button.getAttribute('data-qty'),
            formatedPrice: button.getAttribute('data-formatedPrice'),
            languageId: button.getAttribute('data-languageId'),
            tenantId: button.getAttribute('data-tenantId')
        };

        addToCart(product, event);
    });
});


function showNotification(type, message) {
  const notification = document.getElementById('notification');

  // Set the notification message and style
  notification.textContent = message;
  notification.className = type + ' show';

  // Automatically hide the notification after 3 seconds
  setTimeout(() => {
    notification.className = 'hidden';
  }, 5000);
}

document.addEventListener('scroll', function () {
    const row = document.querySelector('.floating');
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (scrollY > 100) { // Show when scrolling down more than 100px
        row.classList.add('show'); 
    } else {
        row.classList.remove('show');
    }
});




function reinit() {
	var value,
		quantity = document.getElementsByClassName('quantity-container');


	for (var i = 0; i < quantity.length; i++) {
		createBindings(quantity[i]);
	}
};


function createBindings(quantityContainer) {
	var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
	var increase = quantityContainer.getElementsByClassName('increase')[0];
	var decrease = quantityContainer.getElementsByClassName('decrease')[0];
	increase.addEventListener('click', function(e) { increaseValue(e, quantityAmount); });
	decrease.addEventListener('click', function(e) { decreaseValue(e, quantityAmount); });
}

function increaseValue(event, quantityAmount) {

	value = parseInt(quantityAmount.value, 10);

	console.log(quantityAmount, quantityAmount.value);

	value = isNaN(value) ? 0 : value;
	value++;
	quantityAmount.value = value;
	const newtextBox = event.target;
	let newQuantity = value;// Get the new value as a number

	// Prevent negative values
	if (newQuantity < 0) {
		newQuantity = 0; // Reset to 0 if negative value is entered
		event.target.value = 0; // Update input field to reflect new value
	}

	// Prepare the data to send to the server (adjust accordingly to your server API)
	const itemId = event.target.closest('.quantity-container').querySelector('.quantity-amount').getAttribute('data-item-id'); // Assuming item ID is stored in a data attribute
	const formData = new FormData();
	formData.append("quantity", newQuantity);
	formData.append("id", itemId);
	// Send the updated quantity to the server
	if (itemId > -1) {

		fetch('/cart/update/', { // Adjust the endpoint as needed
			method: 'POST',
			body: formData,
		}).then(response => {
			if (!response.ok) {
				throw new Error('Failed to update the cart on the server.');
			}
			return response.json();
		})
			.then(data => {
				// Assuming `data` is the updated cart object of type `Cart`
				cart = data; // Assign response to the `cart` variable
				updateCartUIPage(); // Update the UI with the new cart
				reInitializeEventQtyTextBox();
				reinit();
				showNotification('success', 'Đã sửa sản phẩm thứ: ' + itemId);
			})
			.catch(error => {
				console.error('Error updating the cart:', error);
				showNotification('success', 'Lỗi');
			});

	}
}

function decreaseValue(event, quantityAmount) {
	value = parseInt(quantityAmount.value, 10);

	value = isNaN(value) ? 0 : value;
	if (value > 0) value--;

	quantityAmount.value = value;

	let newQuantity = value; // Get the new value as a number

	// Prevent negative values
	if (newQuantity < 0) {
		newQuantity = 0; // Reset to 0 if negative value is entered
		event.target.value = 0; // Update input field to reflect new value
	}

	// Prepare the data to send to the server (adjust accordingly to your server API)
	const itemId = event.target.closest('.quantity-container').querySelector('.quantity-amount').getAttribute('data-item-id'); // Assuming item ID is stored in a data attribute
	const formData = new FormData();
	formData.append("quantity", newQuantity);
	formData.append("id", itemId);
	// Send the updated quantity to the server
	if (itemId > -1) {

		fetch('/cart/update/', { // Adjust the endpoint as needed
			method: 'POST',
			body: formData,
		}).then(response => {
			if (!response.ok) {
				throw new Error('Failed to update the cart on the server.');
			}
			return response.json();
		})
			.then(data => {
				// Assuming `data` is the updated cart object of type `Cart`
				cart = data; // Assign response to the `cart` variable
				updateCartUIPage(); // Update the UI with the new cart
				reInitializeEventQtyTextBox();
				reinit();
				showNotification('success', 'Đã sửa sản phẩm thứ: ' + itemId);
			})
			.catch(error => {
				console.error('Error updating the cart:', error);
				showNotification('success', 'Lỗi');
			});

	}

}