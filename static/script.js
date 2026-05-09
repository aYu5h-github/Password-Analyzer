let isPasswordVisible = false;
let analysisInProgress = false;
let passwordHistory = loadHistory();

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('passwordHistory');
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
}

// Add to history
function addToHistory(password, results) {
    const historyEntry = {
        id: Date.now(),
        password: '*'.repeat(password.length), // Store only masked version
        strength: results.strength_rating,
        entropy: results.entropy,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString()
    };
    passwordHistory.unshift(historyEntry); // Add to beginning
    if (passwordHistory.length > 20) passwordHistory.pop(); // Keep last 20
    saveHistory();
}

// Generate strong password
function generateStrongPassword() {
    const length = 16;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    document.getElementById('passwordInput').value = password;
    document.getElementById('analyzeBtn').click();
}

// Toggle password visibility
document.getElementById('toggleVisibility')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('passwordInput');
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';
    this.textContent = isPasswordVisible ? '[🙈]' : '[👁]';
});

// Generate password button
document.getElementById('generateBtn')?.addEventListener('click', generateStrongPassword);

// Export report button
document.getElementById('exportBtn')?.addEventListener('click', async function() {
    if (!currentResults) {
        alert('[!] No analysis to export');
        return;
    }
    
    try {
        const response = await fetch('/export-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ report: currentResults })
        });
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `password_audit_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showConsoleMessage('[+] Report exported successfully');
    } catch (error) {
        console.error('Export failed:', error);
        alert('[!] Export failed');
    }
});

// History button
document.getElementById('historyBtn')?.addEventListener('click', function() {
    displayHistory();
    document.getElementById('historyModal').style.display = 'block';
});

// Close modal
document.querySelector('.modal-close')?.addEventListener('click', function() {
    document.getElementById('historyModal').style.display = 'none';
});

document.getElementById('clearHistoryBtn')?.addEventListener('click', function() {
    passwordHistory = [];
    saveHistory();
    displayHistory();
});

// Click outside modal to close
window.addEventListener('click', function(event) {
    const modal = document.getElementById('historyModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function displayHistory() {
    const historyList = document.getElementById('historyList');
    if (passwordHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No passwords analyzed yet</div>';
        return;
    }
    
    historyList.innerHTML = passwordHistory.map(entry => `
        <div class="history-item">
            <div><strong>${entry.strength}</strong> | Entropy: ${entry.entropy} bits</div>
            <div class="date">${entry.date}</div>
            <div class="password-mask">${entry.password}</div>
        </div>
    `).join('');
}

// Dark Web Simulation
async function simulateDarkWeb() {
    const darkWebSection = document.getElementById('darkWebSection');
    const darkWebLog = document.getElementById('darkWebLog');
    
    darkWebSection.style.display = 'block';
    darkWebLog.innerHTML = '';
    
    const messages = [
        '[>] Connecting to TOR nodes...',
        '[+] Connected to 3 anonymous proxies',
        '[>] Accessing dark web breach databases...',
        '[!] Found 127 potential password dumps',
        '[>] Scanning for password hash...',
        '[+] Hash found in 3 databases',
        '[⚠️] Password appears in RockYou (2009) breach',
        '[⚠️] Password appears in LinkedIn (2012) breach',
        '[>] Checking HaveIBeenPwned API...',
        '[+] 2 additional breaches found',
        '[!] This password has been compromised!',
        '[>] Generating security recommendations...'
    ];
    
    for (let msg of messages) {
        await sleep(150);
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = msg;
        darkWebLog.appendChild(logEntry);
        darkWebLog.scrollTop = darkWebLog.scrollHeight;
    }
}

// Update theme based on password strength
function updateTheme(strengthLevel) {
    const body = document.body;
    body.classList.remove('theme-amber', 'theme-green', 'theme-red');
    
    switch(strengthLevel) {
        case 'critical':
            body.classList.add('theme-red');
            break;
        case 'weak':
            body.classList.add('theme-red');
            break;
        case 'moderate':
            body.classList.add('theme-amber');
            break;
        case 'secure':
            body.classList.add('theme-green');
            break;
        case 'impenetrable':
            body.classList.add('theme-green');
            break;
        default:
            body.classList.add('theme-amber');
    }
}

// Analyze button
document.getElementById('analyzeBtn')?.addEventListener('click', async function() {
    const password = document.getElementById('passwordInput').value;
    
    if (!password) {
        showConsoleMessage('[!] ERROR: No password input detected');
        return;
    }
    
    if (analysisInProgress) {
        showConsoleMessage('[!] Scan already in progress...');
        return;
    }
    
    await analyzePassword(password);
});

// Enter key support
document.getElementById('passwordInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('analyzeBtn').click();
    }
});

let currentResults = null;

async function analyzePassword(password) {
    analysisInProgress = true;
    const analyzeBtn = document.getElementById('analyzeBtn');
    const originalText = analyzeBtn.textContent;
    
    showConsoleMessage('[>] INITIATING SECURITY_PROTOCOL...');
    await sleep(200);
    
    analyzeBtn.textContent = '[> SCANNING DARK WEB...]';
    analyzeBtn.disabled = true;
    
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentResults = {
                timestamp: data.timestamp,
                strength_rating: data.strength_rating,
                entropy: data.entropy,
                crack_time: data.crack_time,
                total_score: data.total_score,
                length_message: data.length_message,
                variety_message: data.variety_message,
                patterns_message: data.patterns_message,
                common_message: data.common_message,
                suggestions: data.suggestions,
                breach_count: data.breach_check.count,
                breaches: data.breach_check.breaches
            };
            
            // Update theme based on strength
            updateTheme(data.strength_level);
            
            // Show dark web simulation for weak passwords
            if (data.strength_level === 'critical' || data.strength_level === 'weak') {
                await simulateDarkWeb();
            } else {
                document.getElementById('darkWebSection').style.display = 'none';
            }
            
            displayResults(data);
            addToHistory(password, data);
            showConsoleMessage('[+] ANALYSIS_COMPLETE');
        } else {
            showConsoleMessage('[!] ERROR: ' + data.error, true);
        }
    } catch (error) {
        console.error('Error:', error);
        showConsoleMessage('[!] CRITICAL ERROR: Connection failed', true);
    } finally {
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
        analysisInProgress = false;
    }
}

function showConsoleMessage(message, isError = false) {
    console.log(message);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    
    setTimeout(() => {
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    // Update strength rating
    const strengthValue = document.getElementById('strengthValue');
    strengthValue.textContent = data.strength_rating;
    strengthValue.style.color = data.strength_color;
    
    // Update strength bar
    const strengthProgress = document.getElementById('strengthProgress');
    let widthPercentage = 0;
    switch(data.strength_rating) {
        case '⚠️ CRITICAL': widthPercentage = 20; break;
        case '⚠️ WEAK': widthPercentage = 40; break;
        case '🟡 MODERATE': widthPercentage = 60; break;
        case '🟢 SECURE': widthPercentage = 80; break;
        case '💪 IMPENETRABLE': widthPercentage = 100; break;
    }
    strengthProgress.style.width = widthPercentage + '%';
    
    // Update metrics
    document.getElementById('entropyValue').textContent = data.entropy;
    document.getElementById('crackTimeValue').textContent = data.crack_time;
    
    // Update analysis details
    updateDetailItem('length', data.length_message, data.length_score);
    updateDetailItem('variety', data.variety_message, data.variety_score);
    updateDetailItem('patterns', data.patterns_message, data.patterns_score);
    updateDetailItem('common', data.common_message, data.common_score);
    
    // Update breach check
    const breachText = document.getElementById('breachText');
    const breachStatus = document.getElementById('breachStatus');
    if (data.breach_check.found) {
        breachText.textContent = `Breach Database Check: ${data.breach_check.count} breach(es) found!`;
        breachStatus.textContent = '[CRIT]';
        breachStatus.className = 'detail-status critical';
    } else {
        breachText.textContent = 'Breach Database Check: No breaches found';
        breachStatus.textContent = '[PASS]';
        breachStatus.className = 'detail-status good';
    }
    
    // Update suggestions
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = '';
    data.suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
    });
}

function updateDetailItem(category, message, score) {
    const textSpan = document.getElementById(`${category}Text`);
    const statusSpan = document.getElementById(`${category}Status`);
    
    if (textSpan && statusSpan) {
        textSpan.textContent = message;
        statusSpan.textContent = getStatusText(score);
        statusSpan.className = `detail-status ${getStatusClass(score)}`;
    }
}

function getStatusText(score) {
    if (score >= 2.5) return '[PASS]';
    if (score >= 1.5) return '[WARN]';
    if (score >= 0.5) return '[FAIL]';
    return '[CRIT]';
}

function getStatusClass(score) {
    if (score >= 2.5) return 'good';
    if (score >= 1.5) return 'warning';
    if (score >= 0.5) return 'bad';
    return 'critical';
}

// Console welcome message
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║     PASSWORD SECURITY ANALYZER v3.0 - DARK WEB EDITION       ║
║  [SYSTEM: ONLINE] | [DARK WEB: CONNECTED] | [READY]          ║
╚═══════════════════════════════════════════════════════════════╝
`);