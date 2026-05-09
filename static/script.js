let isPasswordVisible = false;
let analysisInProgress = false;

// Toggle password visibility
document.getElementById('toggleVisibility').addEventListener('click', function() {
    const passwordInput = document.getElementById('passwordInput');
    isPasswordVisible = !isPasswordVisible;
    passwordInput.type = isPasswordVisible ? 'text' : 'password';
    this.textContent = isPasswordVisible ? '[🙈]' : '[👁]';
});

// Analyze button click handler (removed auto-analyze)
document.getElementById('analyzeBtn').addEventListener('click', async function() {
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

// Enter key support (only when button exists)
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('analyzeBtn').click();
    }
});

async function analyzePassword(password) {
    analysisInProgress = true;
    const analyzeBtn = document.getElementById('analyzeBtn');
    const originalText = analyzeBtn.textContent;
    
    // Show hacking simulation messages
    showConsoleMessage('[>] INITIATING SECURITY_PROTOCOL...');
    await sleep(200);
    showConsoleMessage('[>] BYPASSING ENCRYPTION LAYERS...');
    await sleep(200);
    showConsoleMessage('[>] ACCESSING PASSWORD_MATRIX...');
    await sleep(200);
    showConsoleMessage('[>] CALCULATING ENTROPY VALUES...');
    
    analyzeBtn.textContent = '[> SCANNING...]';
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
            showConsoleMessage('[+] ANALYSIS_COMPLETE. RESULTS:');
            displayResults(data);
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
    // You can add a console output div if you want
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function displayResults(data) {
    // Show results section
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    
    // Smooth scroll to results (only when user clicks analyze)
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
    strengthProgress.style.backgroundColor = data.strength_color;
    
    // Update metrics
    document.getElementById('entropyValue').textContent = data.entropy;
    document.getElementById('crackTimeValue').textContent = data.crack_time;
    
    // Update analysis details
    updateDetailItem('length', data.length_message, data.length_score);
    updateDetailItem('variety', data.variety_message, data.variety_score);
    updateDetailItem('patterns', data.patterns_message, data.patterns_score);
    updateDetailItem('common', data.common_message, data.common_score);
    
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

// Add cool typing sound effect (optional - requires audio)
// This is just for aesthetics - remove if not needed
console.log(`
╔═══════════════════════════════════════╗
║  PASSWORD SECURITY ANALYZER v2.0      ║
║  [SYSTEM: ONLINE]                     ║
║  [ENCRYPTION: ACTIVE]                 ║
╚═══════════════════════════════════════╝
`);
