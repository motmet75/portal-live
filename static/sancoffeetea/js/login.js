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

                    }else if (userDetails['pass'] === "browser_otp") {
                        showBrowserOtpPrompt();
                    }else if (window.location.pathname !== "/trang-ca-nhan") {
                        window.location.href = "/trang-ca-nhan";
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

/** Shown when /login-act reports pass === "browser_otp": the device isn't recognized
 *  yet, so LoginOtpService has emailed a one-time code and held off finishing login.
 *  Built entirely in JS so no extra markup is needed in login-page.html. */
function showBrowserOtpPrompt() {
    let overlay = document.getElementById('browserOtpOverlay');
    if (overlay) { overlay.style.display = 'flex'; return; }

    overlay = document.createElement('div');
    overlay.id = 'browserOtpOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(13,27,42,.55);display:flex;'
        + 'align-items:center;justify-content:center;z-index:9999;font-family:"Be Vietnam Pro",Arial,sans-serif;';
    overlay.innerHTML =
        '<div style="background:#fff;border-radius:16px;padding:32px 28px;max-width:360px;width:90%;'
        + 'text-align:center;box-shadow:0 20px 60px rgba(13,27,42,.35);">'
        + '<div style="font-weight:800;color:#0d1b2a;font-size:1.2rem;margin-bottom:8px;">Xác nhận thiết bị mới</div>'
        + '<p style="color:#64748b;font-size:.9rem;margin-bottom:20px;">Chúng tôi đã gửi mã xác nhận đến email của bạn. '
        + 'Nhập mã bên dưới để tiếp tục đăng nhập.</p>'
        + '<input id="browserOtpCode" type="text" inputmode="numeric" maxlength="6" placeholder="Mã 6 số" '
        + 'style="width:100%;padding:10px 12px;border:1px solid #dadce0;border-radius:8px;font-size:1rem;'
        + 'text-align:center;letter-spacing:4px;margin-bottom:12px;box-sizing:border-box;">'
        + '<div id="browserOtpError" style="color:red;font-size:.85rem;min-height:18px;margin-bottom:10px;"></div>'
        + '<button id="browserOtpSubmit" type="button" style="width:100%;background:#356ba2;color:#fff;border:none;'
        + 'border-radius:8px;padding:10px;font-weight:600;cursor:pointer;margin-bottom:10px;">Xác nhận</button>'
        + '<button id="browserOtpResend" type="button" style="width:100%;background:none;border:none;'
        + 'color:#356ba2;font-size:.85rem;cursor:pointer;">Gửi lại mã</button>'
        + '</div>';
    document.body.appendChild(overlay);

    const codeInput = document.getElementById('browserOtpCode');
    const errorEl = document.getElementById('browserOtpError');
    codeInput.focus();

    function submitCode() {
        errorEl.style.color = 'red';
        errorEl.textContent = '';
        fetch('/api/login-verify-browser-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.assign({}, userDetails, { pass: codeInput.value.trim() }))
        })
            .then(response => response.json())
            .then(result => {
                if (result.id > 0) {
                    const target = (result.pass && result.pass.indexOf('/') === 0) ? result.pass : '/trang-ca-nhan';
                    window.location.href = target;
                } else {
                    errorEl.textContent = result.pass || 'Mã không đúng, vui lòng thử lại.';
                }
            })
            .catch(() => { errorEl.textContent = 'Có lỗi xảy ra, vui lòng thử lại.'; });
    }

    document.getElementById('browserOtpSubmit').addEventListener('click', submitCode);
    codeInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { submitCode(); }
    });

    document.getElementById('browserOtpResend').addEventListener('click', function () {
        errorEl.textContent = '';
        fetch('/api/login-resend-browser-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDetails)
        })
            .then(response => response.json())
            .then(result => {
                errorEl.style.color = result.id > 0 ? 'green' : 'red';
                errorEl.textContent = result.id > 0 ? 'Đã gửi lại mã.' : (result.pass || 'Không thể gửi lại mã.');
            })
            .catch(() => { errorEl.style.color = 'red'; errorEl.textContent = 'Có lỗi xảy ra, vui lòng thử lại.'; });
    });
}
