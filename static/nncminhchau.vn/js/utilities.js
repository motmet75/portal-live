/**
 * 
 */
 
 function moneyload(x) {
			         let num = Number(x.innerHTML).toLocaleString('vi');
		        return  num.toLocaleString("vi-VN", {style : "currency", currency : "VND"});
 	     
	};
