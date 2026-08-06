(function() {
	'use strict';

	var tinyslider = function() {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();

	


	var sitePlusMinus = function() {

		var value,
    		quantity = document.getElementsByClassName('quantity-container');

		function createBindings(quantityContainer) {
	      var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
	      var increase = quantityContainer.getElementsByClassName('increase')[0];
	      var decrease = quantityContainer.getElementsByClassName('decrease')[0];
	      increase.addEventListener('click', function (e) { increaseValue(e, quantityAmount); });
	      decrease.addEventListener('click', function (e) { decreaseValue(e, quantityAmount); });
	    }

	    function init() {
	        for (var i = 0; i < quantity.length; i++ ) {
						createBindings(quantity[i]);
	        }
	    };

	    function increaseValue(event, quantityAmount) {
			
	        value = parseInt(quantityAmount.value, 10);

	     //   console.log(quantityAmount, quantityAmount.value);

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
														const priceElements = document.querySelectorAll('.product-price.small');
																					     newFunction(priceElements);
														init() ;
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
											const priceElements = document.querySelectorAll('.product-price.small');
																		     newFunction(priceElements);
											init() ;
											showNotification('success', 'Đã sửa sản phẩm thứ: ' + itemId);
									    })
									    .catch(error => {
									        console.error('Error updating the cart:', error);
											showNotification('success', 'Lỗi');
									    });
								       
								}
			
	    }
	    
	    init();
		
	};
	sitePlusMinus();


})()