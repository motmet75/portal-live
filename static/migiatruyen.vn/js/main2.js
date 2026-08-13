function initPageFeatures() {
  (function ($) {
    "use strict";

    // Mobile Nav toggle
    $('.menu-toggle > a').on('click', function (e) {
      e.preventDefault();
      $('#responsive-nav').toggleClass('active');
    });

    // Fix cart dropdown from closing
    $('.cart-dropdown').on('click', function (e) {
      e.stopPropagation();
    });

    // Products Slick
    $('.products-slick').each(function () {
      var $this = $(this),
        $nav = $this.attr('data-nav');

      $this.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        infinite: true,
        speed: 300,
        dots: false,
        arrows: true,
        appendArrows: $nav ? $nav : false,
        responsive: [
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    });

    // Products Widget Slick
    $('.products-widget-slick').each(function () {
      var $this = $(this),
        $nav = $this.attr('data-nav');

      $this.slick({
        infinite: true,
        autoplay: true,
        speed: 300,
        dots: false,
        arrows: true,
        appendArrows: $nav ? $nav : false,
      });
    });

    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    if(load){
	    $('#product-imgs').slick({
	      slidesToShow: 3,
	      slidesToScroll: 1,
	      arrows: true,
	      centerMode: true,
	      focusOnSelect: true,
	      centerPadding: 0,
	      vertical: true,
	      asNavFor: '#product-main-img',
	      responsive: [
	        {
	          breakpoint: 991,
	          settings: {
	            vertical: false,
	            arrows: false,
	            dots: true,
	          },
	        },
	      ],
	    });
    }else{
		
		$('#product-imgs').slick({
	      slidesToShow: 3,
	      slidesToScroll: 1,
	       infinite: true,
	      arrows: true,
	      centerMode: true,
	      focusOnSelect: true,
	      centerPadding: 0,
	      vertical: true,
	      asNavFor: '#product-main-img',
	      responsive: [
	        {
	          breakpoint: 991,
	          settings: {
	            vertical: false,
	            arrows: false,
	            dots: true,
	          },
	        },
	      ],
	    });
	   // $('.slick-prev slick-arrow').trigger('click');
	    
	}
    
     

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }

    // Input number
    $('.input-number').each(function () {
      var $this = $(this),
        $input = $this.find('input[type="number"]'),
        up = $this.find('.qty-up'),
        down = $this.find('.qty-down');

      down.on('click', function () {
		   var $input = $('.input-number').find('input[type="number"]');
		    var $btn =  $('.add-to-cart-btn');
        var value = parseInt($input.val()) - 1;
        value = value < 1 ? 1 : value;
        $input.val(value);
        $btn.attr('data-qty', value);
        $input.change();
        updatePriceSlider($this, value);
      });

      up.on('click', function () {
		  var $input = $('.input-number').find('input[type="number"]');
		  var $btn =  $('.add-to-cart-btn');
        var value = parseInt($input.val()) + 1;
        $input.val(value);
        $btn.attr('data-qty', value);
        $input.change();
        
        updatePriceSlider($this, value);
      });
    });

    var priceInputMax = document.getElementById('price-max'),
      priceInputMin = document.getElementById('price-min');

	if(priceInputMax){
	    priceInputMax.addEventListener('change', function () {
	      updatePriceSlider($(this).parent(), this.value);
	    });
    }

	if(priceInputMin){
    priceInputMin.addEventListener('change', function () {
      updatePriceSlider($(this).parent(), this.value);
    });
    }

    function updatePriceSlider(elem, value) {
      if (elem.hasClass('price-min')) {
        console.log('min');
        priceSlider.noUiSlider.set([value, null]);
      } else if (elem.hasClass('price-max')) {
        console.log('max');
        priceSlider.noUiSlider.set([null, value]);
      }
    }

    // Price Slider
    var priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
      noUiSlider.create(priceSlider, {
        start: [1, 999],
        connect: true,
        step: 1,
        range: {
          min: 1,
          max: 999,
        },
      });

      priceSlider.noUiSlider.on('update', function (values, handle) {
        var value = values[handle];
        handle ? (priceInputMax.value = value) : (priceInputMin.value = value);
      });
    }
	initializeQtyTextBox() ;
  })(jQuery);
  
  

  const priceElements = document.querySelectorAll('.product-price.small');

      newFunction(priceElements);
	  
	  const priceElements2 = document.querySelectorAll('.product-old-price');
	  
	  newFunction(priceElements2);

	
  
}

const products = [
  {
    productImageDesUrl: "Premium Laptop",
    path: "Premium Laptop",
    productName: "Premium Laptop",
    productShortDes: "High-performance laptop for professionals",
    productLongDes: "This premium laptop features the latest processor, ample RAM, and a stunning display for all your professional needs.",
    productSubCatalog: "Computers",
    productBrand: "TechPro",
    productCatalog: "Electronics"
  },
  // More products would be here in a real application
];

// Call on page load
let load = true;
$(document).ready(function () {
	load = true;
  initPageFeatures();
  //
 
  const searchInput = document.querySelector('.input');
   const selectElement = document.querySelector('.input-select');
   const searchForm = searchInput.closest('form');
   let searchTimeout = null;
   
   // Create CSS styles for search results
   const styleElement = document.createElement('style');
   styleElement.textContent = `
     .search-popup {
       display: none;
       position: absolute;
       z-index: 1000;
       background-color: #fff;
       border: 1px solid #ddd;
       width: 100%;
       max-height: 500px;
       overflow-y: auto;
       box-shadow: 0 4px 8px rgba(0,0,0,0.1);
     }
     
     .search-result-item {
       padding: 12px 15px;
       border-bottom: 1px solid #eee;
       cursor: pointer;
       transition: background-color 0.2s ease;
     }
     
     .search-result-item:hover {
       background-color: #f5f5f5;
     }
     
     .search-result-item .product-name {
       font-weight: bold;
       margin-bottom: 4px;
     }
     
     .search-result-item .product-desc {
       font-size: 0.9em;
       color: #666;
     }
     
     /* Mobile specific styles */
     @media (max-width: 768px) {
       .search-popup {
         position: fixed;
         top: auto;
         left: 0;
         right: 0;
         width: 100%;
         max-height: 60vh;
         border-top: 1px solid #ddd;
         border-left: none;
         border-right: none;
       }
       
       .search-result-item {
         padding: 15px;
       }
       
       .search-result-item .product-name {
         font-size: 1.1em;
       }
     }
   `;
   document.head.appendChild(styleElement);
   
   // Create popup container
   const popupContainer = document.createElement('div');
   popupContainer.className = 'search-popup';
   
   // Insert popup after the form
   searchForm.parentNode.insertBefore(popupContainer, searchForm.nextSibling);
   
   // Position the popup based on screen size
   function positionPopup() {
     const isMobile = window.innerWidth <= 768;
     const inputRect = searchInput.getBoundingClientRect();
     
     if (isMobile) {
       // Mobile positioning - fixed under the search bar
       popupContainer.style.top = `${inputRect.bottom}px`;
     } else {
       // Desktop positioning - directly under the input
       popupContainer.style.top = `${inputRect.bottom}px`;
       popupContainer.style.left = `${inputRect.left}px`;
       popupContainer.style.width = `${searchInput.offsetWidth}px`;
     }
   }
   
   // Fetch products from server based on search term and catalog
   async function fetchProducts(searchTerm, catalogCode) {
     try {
       // Build query parameters
       const params = new URLSearchParams();
       params.append('searchTerm', searchTerm);
       params.append('catalogCode', catalogCode);
       
       // Replace with your actual API endpoint
       const response = await fetch(`../api/products/search?${params.toString()}`);
       
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
       
	   
       const data = await response.json();
	   const hasMore = data.length > 5;
	   const itemsToShow = data.slice(0, 5);
	    return [itemsToShow, hasMore, catalogCode, searchTerm];
     } catch (error) {
       console.error('Error fetching search results:', error);
	    return [[], false, catalogCode, searchTerm];
     }
   }
   
   // Display search results
  
   
   function displayResults(items, hasMore, catalogCode, searchTerm ) {
     popupContainer.innerHTML = '';

     if (items.length === 0) {
       popupContainer.style.display = 'none';
       return;
     }

     items.forEach(product => {
       const resultItem = document.createElement('div');
       resultItem.className = 'search-result-item';

       resultItem.innerHTML = `
         <div class=""> <img src="${product.productImageDesUrl}" style="width:30px; height:30px"></div>
         <div class="product-name"> <a href="/san-pham/${product.path}">${product.productName}</a></div>
         <div class="product-desc">${product.productShortDes || ''}</div>
       `;

       resultItem.addEventListener('click', function () {
         searchInput.value = product.productName;
         popupContainer.style.display = 'none';
       });

       popupContainer.appendChild(resultItem);
     });

     if (hasMore) {
       const viewAllItem = document.createElement('div');
       viewAllItem.className = 'search-result-item view-all';
       viewAllItem.innerHTML = `
         <a href="/san-pham.html?catalog=${encodeURIComponent(catalogCode)}&keyword=${encodeURIComponent(searchTerm)}">
           Xem tất cả kết quả &raquo;
         </a>
       `;
       popupContainer.appendChild(viewAllItem);
     }

     popupContainer.style.display = 'block';
     positionPopup();
   }

   
   
   // Add loading indicator
   function showLoadingIndicator() {
     popupContainer.innerHTML = '<div class="search-result-item" style="text-align: center;">Loading...</div>';
     popupContainer.style.display = 'block';
     positionPopup();
   }
   
   // Handle input events with debounce
   searchInput.addEventListener('input', function () {
     const searchTerm = this.value.trim();
     const catalogCode = selectElement.value;

     if (searchTimeout) clearTimeout(searchTimeout);

     if (searchTerm.length < 1) {
       popupContainer.style.display = 'none';
       return;
     }

     showLoadingIndicator();

     searchTimeout = setTimeout(async () => {
       const [items, hasMore, catalogCodeFinal, searchTermFinal] = await fetchProducts(searchTerm, catalogCode);
       displayResults(items, hasMore, catalogCodeFinal, searchTermFinal);
     }, 300);
   });
   
   // Close popup when clicking outside
   document.addEventListener('click', function(e) {
     if (!popupContainer.contains(e.target) && e.target !== searchInput) {
       popupContainer.style.display = 'none';
     }
   });
   
   // Handle category change
   selectElement.addEventListener('change', function () {
     const searchTerm = searchInput.value.trim();
     const catalogCode = this.value;

     if (searchTerm.length >= 1) {
       if (searchTimeout) {
         clearTimeout(searchTimeout);
       }

       showLoadingIndicator();

       searchTimeout = setTimeout(async () => {
         const [items, hasMore, catalogCodeFinal, searchTermFinal] = await fetchProducts(searchTerm, catalogCode);
         displayResults(items, hasMore, catalogCodeFinal, searchTermFinal);
       }, 300);
     } else {
       popupContainer.style.display = 'none';
     }
   });
   
   // Handle window resize
   window.addEventListener('resize', function() {
     if (popupContainer.style.display === 'block') {
       positionPopup();
     }
   });
   
   // Initialize position
   positionPopup();
  
  
  //ebnd of searching pop up
  
  const params = new URLSearchParams(window.location.search);
   const hasCatalog = params.has('catalog');
   const hasKeyword = params.has('keyword');

   if (hasCatalog || hasKeyword) {
     const banner = document.getElementById('banner-image');
     if (banner) {
       banner.style.display = 'none';
     }
   }
  
  
});


    $('#catalogForm input[type="checkbox"]').change(function() {
        // Create an object to hold the form data
         event.preventDefault();
        var formData = {}  ;
        var catalogString = '';
        var brandString = '';

        // Iterate over all checkboxes
         
       $('#catalogForm input[type="checkbox"]').each(function() {
          //  formData[this.name] = this.checked ? this.value : '';
         
          if( this.checked){
			  if(this.name == 'catalog'){
			  	catalogString = catalogString + this.value + ';';
			  } else if(this.name == 'brand'){
				 brandString = brandString + this.value + ';';
			  }
            	//  formData[this.name] +  this.value + '; ';
           }
        //  formData =  $('#catalogForm').serialize();
       });
       
       formData['catalog'] = catalogString;
       formData['brand'] = brandString;

        // Send the form data via AJAX
        $.ajax({
            url: '/productfilter', // Replace with your server endpoint URL
            method: 'GET',
            data: formData,
            success: function(response) {
				 $('#productList').html($(response).find('#productList').html());
                console.log('Form submitted successfully:', response);
            },
            error: function(xhr, status, error) {
                console.error('Form submission failed:', status, error);
            }
        });
    });
    
  
  
function newFunction(priceElements) {
    priceElements.forEach((priceElement) => {
        const priceText = priceElement.textContent.trim(); // Get the text content and trim whitespace

        if (priceText.includes(' - ')) {
            // Handle price range format (e.g., "270000 - 280000đ")
            const prices = priceText.split(' - '); // Split the range into two prices

            const formattedPrices = prices.map((price) => {
                // Remove non-numeric characters (like currency symbols)
                const numericValue = price.replace(/\D/g, '').replace(/\D/g, '');;
				
                const mainPart = numericValue.slice(0, -3); // Get the main part
                const lastThreeDigits = numericValue.slice(-3); // Get the last 3 digits
                return `${mainPart}<span class="smaller-digits">${lastThreeDigits}</span>`;
            });

            // Reconstruct the price range with formatted prices
            priceElement.innerHTML = `${formattedPrices[0]} - ${formattedPrices[1]}đ`;
        } else {
            // Handle single price format (e.g., "270000đ")
            const numericValue = priceText.replace(/\D/g, ''); // Remove non-numeric characters
            const mainPart = numericValue.slice(0, -3); // Get the main part
            const lastThreeDigits = numericValue.slice(-3); // Get the last 3 digits


            // Wrap the last 3 digits in a span with a specific class
            priceElement.innerHTML = `${mainPart}<span class="smaller-digits">${lastThreeDigits}</span>đ`;
        }
    });
}

     function submitSizeForm(event,button) {
		event.preventDefault(); // Ngăn trình duyệt reload trang
		
		const form = event.target.form; // Lấy đối tượng form từ sự kiện
		const myformData = new FormData(form); // Tạo một đối tượng FormData
		var formData = {}  ;
        var sizeValue =  button.getAttribute('value');
         var colorCode = button.getAttribute('data-productColor');
    
		
         var productpath = myformData.get('productpath');
         var productCode = myformData.get('productCode'); 
         var brandString = '';
        formData['size'] = sizeValue;
        formData['color'] = colorCode;
		formData['brand'] = brandString;
		formData['path'] = productpath;
		
		$('#productPrice' + productCode ).html(".000");
         $.ajax({
             method: 'GET',
            url:'../one-product',
            data: formData,
            success: function(response) {
				setTimeout(() => {
								  console.log('End after 2 seconds');
								}, 2000);
				$('#' + productCode).html("");
				$('#' +productCode).html($(response).find('#' + productCode).html());
				
				initPageFeatures();
				initializeAddToCartButtons() ;
				initializeQtyTextBox() ;
                console.log('Form submitted successfully:', response);
                
            },
            error: function() {
               // alert("An error occurred.");
            }
        });
        
         
    }
    
    
    function submitColorForm(event,button) {
		event.preventDefault(); // Ngăn trình duyệt reload trang
		
		const form = event.target.form; // Lấy đối tượng form từ sự kiện
		const myformData = new FormData(form); // Tạo một đối tượng FormData
		var formData = {}  ;
        var colorValue =  button.getAttribute('value');
    
		
         var productpath = myformData.get('productpath');
         var productCode = myformData.get('productCode'); 
         var brandString = '';
        formData['color'] = colorValue;
		formData['brand'] = brandString;
		formData['path'] = productpath;
		
		$('#productPrice' + productCode ).html(".000");
         $.ajax({
             method: 'GET',
            url:'../one-product',
            data: formData,
            success: function(response) {
				setTimeout(() => {
								  console.log('End after 2 seconds');
								}, 2000);
				$('#' + productCode).html("");
				$('#' +productCode).html($(response).find('#' + productCode).html());
				
				initPageFeatures();
				initializeAddToCartButtons() ;
				initializeQtyTextBox() ;
                console.log('Form submitted successfully:', response);
                
            },
            error: function() {
               // alert("An error occurred.");
            }
        });
        
         
    }
    
    
    
function initializeAddToCartButtons() {
	document.querySelectorAll('.add-to-cart-btn').forEach(button => {
	    // Clone the button to remove all old event listeners
	    const newButton = button.cloneNode(true);

	    // Replace the old button with the new button
	    button.replaceWith(newButton);

	    // Add the new click event listener
	    newButton.addEventListener('click', (event) => {
	        // Create the product object from the button's attributes
	        const product = {
	            id: 0,
	            name: newButton.getAttribute('data-productName'),
	            productCode: newButton.getAttribute('data-productCode'),
	            colorCode: newButton.getAttribute('data-productColor'),
	            sizeCode: newButton.getAttribute('data-productSize'),
	            imageUrl: newButton.getAttribute('data-image'),
	            price: newButton.getAttribute('data-productPrice'),
	            quantity: newButton.getAttribute('data-qty'),
	            formatedPrice: newButton.getAttribute('data-formatedPrice'),
	            languageId: newButton.getAttribute('data-languageId'),
	            tenantId: newButton.getAttribute('data-tenantId')
	        };

	        // Call your addToCart function with the product and event
	        addToCart(product, event);
	    });
	});

}


function initializeQtyTextBox() {
	document.querySelectorAll('input[type="number"]').forEach(input => {
		
		const newtextBox = input.cloneNode(true);
		
		input.replaceWith(newtextBox);
		newtextBox.addEventListener('change', (event) => {
			let newQuantity = Number(event.target.value); // Convert to number

						        // Prevent negative or zero values
						        if (newQuantity < 1) {
						            newQuantity = 1;
						            event.target.value = 1; // Update input field to reflect new value
						        }

								if (event.target.closest('.product-row')!==null) {
						       		  const  button = event.target.closest('.product-row').querySelector('.add-to-cart-btn');

						            button.setAttribute('data-qty', newQuantity); // Update data-qty of the button
						        }else if (event.target.closest('.product-details')!==null){
									 const button2 = event.target.closest('.product-details').querySelector('.add-to-cart-btn');
									if (button2) {
										button2.setAttribute('data-qty', newQuantity); // Update data-qty of the button
									}
								}
		   });
		   
		
	 });
	
}

   function fetchProducts(event, element) {
    event.preventDefault(); // Prevent default link behavior

    let category = element.getAttribute("href"); // Get category from href attribute

    fetch('/topselling?category=' + category)
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let newTabContent = doc.querySelector("#tab2");

            if (newTabContent) {
                document.querySelector("#tab2").replaceWith(newTabContent);
             
				 let productsSlickElement = newTabContent.querySelector('.products-slick');

					if (productsSlickElement) {
					  // If using jQuery with Slick, wrap the element with jQuery:
					  $(productsSlickElement).slick({
					    slidesToShow: 5,
					    slidesToScroll: 1,
					    infinite: true,
					    dots: true,
					    arrows: true,
					    responsive: [
					      {
					        breakpoint: 600,
					        settings: {
					          slidesToShow: 2,
					          slidesToScroll: 1
					        }
					      }
					    ]
					  });
					}
            }
            
        })
        .catch(error => console.error("Error fetching products:", error));
}

function loadPage(event, element, page){
	  event.preventDefault(); // Prevent default link behavior
	  element.style.color = 'gray';
	    
	    // Optional: Add a spinner text (you can customize this)
	    element.innerHTML = '...(' + page + ')';
	  var formData={};
         var productCode = element.getAttribute('id'); 
        formData['page'] = page;
		formData['group'] = productCode;
		var urlParams = new URLSearchParams(window.location.search);
		var keyword = urlParams.get('keyword') || ''; // Get keyword parameter or empty string if not present
		var catalog = urlParams.get('catalog') || '0'; // Get catalog parameter or '0' if not present
		formData['keyword'] = keyword;
		formData['catalog'] = catalog;
		
		
         $.ajax({
             method: 'GET',
            url:'san-pham.html',
            data: formData,
            success: function(response) {
				
				
				setTimeout(() => {
									initPageFeatures();
									console.log('End after 2 seconds');
								}, 150);
												setTimeout(() => {
													$('#productList' + productCode).html("...");
													$('#productList' + productCode).html($(response).find('#productList' + productCode).html());
													console.log('End after 2 seconds');
								}, 100);
				
				//initializeAddToCartButtons() ;
				//initializeQtyTextBox() ;
                console.log('Form submitted successfully:', response);
                
            },
            error: function() {
               // alert("An error occurred.");
            }
        });
}
    

