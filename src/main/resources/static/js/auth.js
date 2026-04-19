// ==================== API CONFIG ====================
const API_BASE_URL = 'http://localhost:8080';
let otpEmail = '';

// ==================== LOADING INDICATOR WITH RIPPLE EFFECT ====================
function showLoading(button, isLoading, originalText = null) {
    if (!button) return;

    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="loading-spinner"></span> Processing...';

        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    } else {
        button.disabled = false;
        button.innerHTML = originalText || button.dataset.originalText || button.textContent;
    }
}

function showMessage(message, type) {
    const div = document.getElementById('message');
    if (!div) return;

    div.textContent = message;
    div.className = `message ${type}`;

    // Add icon based on type
    const icon = document.createElement('span');
    icon.className = 'message-icon';
    div.insertBefore(icon, div.firstChild);

    // Auto-clear message after 4 seconds
    setTimeout(() => {
        if (div.textContent === message) {
            div.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                div.textContent = '';
                div.className = 'message';
                div.style.animation = '';
            }, 300);
        }
    }, 4000);
}

// ==================== SIGNUP WITH ENHANCED VALIDATION ====================
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Enhanced validation
        if (username.length < 3) {
            return showMessage('Username must be at least 3 characters', 'error');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return showMessage('Please enter a valid email address', 'error');
        }

        if (password !== confirmPassword) {
            return showMessage('Passwords do not match!', 'error');
        }

        if (password.length < 6) {
            return showMessage('Password must be at least 6 characters', 'error');
        }

        // Password strength check
        const strength = checkPasswordStrength(password);
        if (strength < 2) {
            return showMessage('Password is too weak. Use letters, numbers, and special characters', 'error');
        }

        showLoading(submitBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showMessage('🎉 Signup successful! Redirecting to login...', 'success');
                setTimeout(() => window.location.href = '/login-page', 1500);
            } else {
                showMessage(data.message || 'Signup failed', 'error');
                showLoading(submitBtn, false);
            }
        } catch (err) {
            showMessage('Network error: ' + err.message, 'error');
            showLoading(submitBtn, false);
        }
    });
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
}

// ==================== PASSWORD LOGIN ====================
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            return showMessage('Please fill in all fields', 'error');
        }

        showLoading(submitBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const token = typeof data.data === "string" ? data.data : data.data.token;
                const userId = data.data?.userId || data.data?.id;

                localStorage.setItem('jwt_token', token);
                localStorage.setItem('username', username);
                if (userId) localStorage.setItem('userId', userId);

                // Track login method
                sessionStorage.setItem('login_method', 'password');

                showMessage('🔐 Login successful! Redirecting...', 'success');
                setTimeout(() => window.location.href = '/home', 1000);
            } else {
                showMessage(data.message || 'Invalid credentials', 'error');
                showLoading(submitBtn, false);
            }
        } catch (err) {
            showMessage('Network error: ' + err.message, 'error');
            showLoading(submitBtn, false);
        }
    });
}

// ==================== SEND OTP ====================
if (document.getElementById('otpRequestForm')) {
    document.getElementById('otpRequestForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');

        const email = document.getElementById('otpEmail').value.trim();

        if (!email) {
            return showMessage('Please enter your email address', 'error');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return showMessage('Please enter a valid email address', 'error');
        }

        showLoading(submitBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                sessionStorage.setItem('otp_email', email);
                sessionStorage.setItem('login_method', 'otp');
                showMessage('📧 OTP sent successfully! Redirecting...', 'success');
                setTimeout(() => window.location.href = '/verify-otp-page', 1500);
            } else {
                showMessage(data.message || 'Failed to send OTP. Check your email.', 'error');
                showLoading(submitBtn, false);
            }
        } catch (err) {
            showMessage('Network error: ' + err.message, 'error');
            showLoading(submitBtn, false);
        }
    });
}

// ==================== VERIFY OTP ====================
if (document.getElementById('verifyOtpForm')) {
    const urlParams = new URLSearchParams(window.location.search);
    otpEmail = urlParams.get('email') || sessionStorage.getItem('otp_email');

    const userEmailEl = document.getElementById('userEmail');
    if (userEmailEl && otpEmail) {
        userEmailEl.textContent = otpEmail;
        // Add animation
        userEmailEl.style.animation = 'pulse 0.5s ease';
    }

    if (!otpEmail) {
        showMessage('Session expired. Redirecting to login...', 'error');
        setTimeout(() => window.location.href = '/login-page', 1500);
    }

    document.getElementById('verifyOtpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');

        const otp = document.getElementById('otp').value.trim();

        if (!otp || otp.length !== 6) {
            return showMessage('Please enter a valid 6-digit OTP', 'error');
        }

        if (!/^\d{6}$/.test(otp)) {
            return showMessage('OTP must contain digits only', 'error');
        }

        showLoading(submitBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: otpEmail, otp })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const token = typeof data.data === "string" ? data.data : data.data.token;
                const userId = data.data?.userId || data.data?.id;

                localStorage.setItem('jwt_token', token);
                localStorage.setItem('username', otpEmail);
                if (userId) localStorage.setItem('userId', userId);

                sessionStorage.removeItem('otp_email');

                showMessage('✅ OTP verified successfully! Redirecting...', 'success');
                setTimeout(() => window.location.href = '/home', 1000);
            } else {
                showMessage(data.message || 'Invalid or expired OTP', 'error');
                showLoading(submitBtn, false);
                // Clear OTP input on error
                document.getElementById('otp').value = '';
                document.getElementById('otp').focus();
            }
        } catch (err) {
            showMessage('Network error: ' + err.message, 'error');
            showLoading(submitBtn, false);
        }
    });
}

// ==================== RESEND OTP WITH COOLDOWN ====================
window.resendOtp = async function() {
    const email = sessionStorage.getItem('otp_email') || otpEmail;
    const resendLink = document.querySelector('.auth-link a:first-child');

    if (!email) {
        showMessage('Session expired. Please go back to login.', 'error');
        setTimeout(() => window.location.href = '/login-page', 1500);
        return;
    }

    if (resendLink) {
        resendLink.style.pointerEvents = 'none';
        const originalText = resendLink.textContent;
        resendLink.textContent = '⏳ Sending...';

        // Cooldown timer
        let countdown = 30;
        const timer = setInterval(() => {
            if (countdown > 0) {
                resendLink.textContent = `⏳ Wait ${countdown}s`;
                countdown--;
            } else {
                clearInterval(timer);
                resendLink.style.pointerEvents = 'auto';
                resendLink.textContent = originalText;
            }
        }, 1000);
    }

    showMessage('📧 Sending OTP...', 'info');

    try {
        const response = await fetch(`${API_BASE_URL}/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('✅ OTP resent successfully! Check your email.', 'success');
        } else {
            showMessage(data.message || 'Failed to resend OTP', 'error');
        }
    } catch (err) {
        showMessage('Network error: ' + err.message, 'error');
    }
};

// ==================== HOME PAGE WITH ENHANCED UI ====================
if (window.location.pathname === '/home' || window.location.pathname === '/home.html') {
    const token = localStorage.getItem('jwt_token');
    const username = localStorage.getItem('username');

    if (!token) {
        window.location.href = '/login-page';
    } else {
        validateToken(token, username);
        setupHomePage();
    }
}

function setupHomePage() {
    // Animated greeting
    const greetingEl = document.querySelector('.greeting');
    if (greetingEl) {
        const hour = new Date().getHours();
        let greeting = '';
        if (hour < 12) greeting = 'Good morning 🌅';
        else if (hour < 17) greeting = 'Good afternoon ☀️';
        else greeting = 'Good evening 🌙';
        greetingEl.textContent = `${greeting}! You have successfully logged in to your account.`;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }

    const testHelloBtn = document.getElementById('testHelloBtn');
    if (testHelloBtn) {
        testHelloBtn.addEventListener('click', async () => {
            await callProtectedAPI();
        });
    }

    const authMethodSpan = document.getElementById('authMethod');
    if (authMethodSpan) {
        const loginMethod = sessionStorage.getItem('login_method');
        const methodText = loginMethod === 'otp' ? '🔐 OTP Login' : '🔑 Password Login';
        authMethodSpan.textContent = methodText;

        // Add icon based on method
        if (loginMethod === 'otp') {
            authMethodSpan.innerHTML = '🔐 OTP Login <span style="font-size:12px;">(Email)</span>';
        } else {
            authMethodSpan.innerHTML = '🔑 Password Login <span style="font-size:12px;">(Credentials)</span>';
        }
    }
}

async function validateToken(token, username) {
    try {
        const response = await fetch(`${API_BASE_URL}/hello`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const usernameEl = document.getElementById('username');
            if (usernameEl) {
                usernameEl.textContent = username || data.username || 'User';
                // Add typing animation
                usernameEl.style.animation = 'fadeIn 0.5s ease';
            }
        } else {
            logout();
        }
    } catch (error) {
        console.error('Token validation error:', error);
        logout();
    }
}

async function callProtectedAPI() {
    const token = localStorage.getItem('jwt_token');
    const responseDiv = document.getElementById('apiResponse');
    const testBtn = document.getElementById('testHelloBtn');

    if (!token) {
        logout();
        return;
    }

    if (testBtn) {
        const originalText = testBtn.textContent;
        testBtn.disabled = true;
        testBtn.innerHTML = '<span class="loading-spinner"></span> Calling API...';
    }

    if (responseDiv) {
        responseDiv.style.display = 'block';
        responseDiv.className = 'api-response info';
        responseDiv.innerHTML = '<span class="loading-spinner-small"></span> Fetching secure data...';
    }

    try {
        const response = await fetch(`${API_BASE_URL}/hello`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            if (responseDiv) {
                responseDiv.className = 'api-response success';
                responseDiv.innerHTML = `
                    <strong>✅ API Response Successful</strong><br>
                    <code>${JSON.stringify(data, null, 2)}</code>
                    <small style="display:block; margin-top:8px;">✓ Authenticated via JWT Token</small>
                `;
            }
            showMessage('✅ API call successful!', 'success');
            return data;
        } else {
            throw new Error(data.message || 'API call failed');
        }
    } catch (err) {
        console.error("Protected API error:", err);
        if (responseDiv) {
            responseDiv.className = 'api-response error';
            responseDiv.innerHTML = `
                <strong>❌ API Error</strong><br>
                ${err.message}<br>
                <small>Please check your connection or login again</small>
            `;
        }
        showMessage('Failed to fetch protected data', 'error');

        if (err.message.includes('401') || err.message.includes('403')) {
            setTimeout(() => logout(), 1500);
        }
    } finally {
        if (testBtn) {
            setTimeout(() => {
                testBtn.disabled = false;
                testBtn.textContent = '🔐 Call /hello API';
            }, 1000);
        }
    }
}

function logout() {
    // Add fade out animation
    const container = document.querySelector('.container');
    if (container) {
        container.style.animation = 'fadeOut 0.3s ease';
    }

    localStorage.clear();
    sessionStorage.clear();
    showMessage('👋 Logging out...', 'info');
    setTimeout(() => {
        window.location.href = '/login-page';
    }, 500);
}

// Add fadeOut animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }

    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(20px); }
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    button {
        position: relative;
        overflow: hidden;
    }

    .message-icon {
        margin-right: 8px;
    }
`;
document.head.appendChild(styleSheet);