import re
import math
import string

class PasswordStrengthAnalyzer:
    def __init__(self):
        # Common weak passwords
        self.common_passwords = {
            'password', '123456', '123456789', 'qwerty', 'abc123', 
            'password123', 'admin', 'letmein', 'welcome', 'monkey',
            'dragon', 'master', 'hello', 'football', 'superman',
            'admin123', 'root', 'toor', 'passw0rd'
        }
        
        self.char_sets = {
            'lowercase': string.ascii_lowercase,
            'uppercase': string.ascii_uppercase,
            'digits': string.digits,
            'special': string.punctuation
        }
        
        # Hacker-style messages
        self.hacker_messages = {
            'cracking': [
                "[*] Initiating security scan...",
                "[>] Bypassing firewall...",
                "[+] Accessing authentication matrix...",
                "[*] Running entropy algorithms...",
                "[>] Analyzing cryptographic strength..."
            ]
        }
    
    def calculate_entropy(self, password):
        pool_size = 0
        
        if re.search(r'[a-z]', password):
            pool_size += len(self.char_sets['lowercase'])
        if re.search(r'[A-Z]', password):
            pool_size += len(self.char_sets['uppercase'])
        if re.search(r'\d', password):
            pool_size += len(self.char_sets['digits'])
        if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            pool_size += len(self.char_sets['special'])
        
        if pool_size == 0:
            return 0
        
        entropy = len(password) * math.log2(pool_size)
        return round(entropy, 2)
    
    def check_length(self, password):
        length = len(password)
        if length < 8:
            return 0, "[FAIL] Too short - minimum 8 characters required"
        elif length < 12:
            return 1, "[WARN] Acceptable but vulnerable"
        elif length < 16:
            return 2, "[OK] Good length"
        else:
            return 3, "[PASS] Excellent length"
    
    def check_character_variety(self, password):
        has_lower = bool(re.search(r'[a-z]', password))
        has_upper = bool(re.search(r'[A-Z]', password))
        has_digit = bool(re.search(r'\d', password))
        has_special = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
        
        variety_count = sum([has_lower, has_upper, has_digit, has_special])
        
        if variety_count == 1:
            return 0, "[FAIL] Very poor variety - easily predictable"
        elif variety_count == 2:
            return 1, "[WARN] Poor variety"
        elif variety_count == 3:
            return 2, "[OK] Good variety"
        else:
            return 3, "[PASS] Excellent variety - high complexity"
    
    def check_patterns(self, password):
        score = 3
        warnings = []
        
        if re.search(r'(.)\1{2,}', password):
            score -= 1
            warnings.append("Detected repeated characters")
        
        sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789', 'qwertyuiop', 'asdfghjkl']
        lower_pass = password.lower()
        
        for seq in sequences:
            for i in range(len(seq) - 2):
                if seq[i:i+3] in lower_pass:
                    score -= 1
                    warnings.append("Detected sequential pattern")
                    break
            if score < 2:
                break
        
        keyboard_patterns = ['qwerty', 'asdfgh', 'zxcvbn', '1qaz', '2wsx']
        for pattern in keyboard_patterns:
            if pattern in password.lower():
                score -= 1
                warnings.append("Detected keyboard pattern")
                break
        
        score = max(0, score)
        
        if score == 3:
            return score, "[PASS] No patterns detected"
        elif score == 2:
            return score, "[WARN] Weak patterns found"
        elif score == 1:
            return score, "[FAIL] Multiple patterns detected"
        else:
            return score, "[CRIT] Severe pattern vulnerabilities"
    
    def check_common_password(self, password):
        if password.lower() in self.common_passwords:
            return 0, "[CRIT] Password found in breach database!"
        return 3, "[PASS] Not found in common password lists"
    
    def calculate_crack_time(self, entropy):
        guesses_per_second = 1_000_000_000
        total_combinations = 2 ** entropy if entropy > 0 else 0
        
        if total_combinations <= 0 or entropy <= 0:
            return "INSTANT (>_<)"
        
        seconds = total_combinations / guesses_per_second
        
        if seconds < 1:
            return "< 1 second [VULNERABLE]"
        elif seconds < 60:
            return f"{seconds:.0f} seconds [INSECURE]"
        elif seconds < 3600:
            return f"{seconds/60:.1f} minutes [WEAK]"
        elif seconds < 86400:
            return f"{seconds/3600:.1f} hours [MODERATE]"
        elif seconds < 31536000:
            return f"{seconds/86400:.1f} days [STRONG]"
        elif seconds < 31536000 * 100:
            return f"{seconds/31536000:.1f} years [VERY STRONG]"
        else:
            return "> 100 years [IMPENETRABLE]"
    
    def get_strength_rating(self, entropy, total_score):
        max_possible_score = 12
        percentage = (total_score / max_possible_score) * 100 if max_possible_score > 0 else 0
        
        if entropy < 30 and total_score < 6:
            return "⚠️ CRITICAL", "#ff0000"
        elif entropy < 40 and total_score < 9:
            return "⚠️ WEAK", "#ff6600"
        elif entropy < 60 and total_score < 12:
            return "🟡 MODERATE", "#ffff00"
        elif entropy < 80 or total_score < 14:
            return "🟢 SECURE", "#00ff00"
        else:
            return "💪 IMPENETRABLE", "#00ffff"
    
    def generate_improvement_suggestions(self, password, results):
        suggestions = []
        
        if len(password) < 12:
            suggestions.append(f"> Increase length to 12+ chars (current: {len(password)})")
        
        missing_types = []
        if not re.search(r'[A-Z]', password):
            missing_types.append("UPPERCASE")
        if not re.search(r'[a-z]', password):
            missing_types.append("lowercase")
        if not re.search(r'\d', password):
            missing_types.append("numbers")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            missing_types.append("special chars")
        
        if missing_types:
            suggestions.append(f"> Add missing: {', '.join(missing_types)}")
        
        if results['patterns']['message'] != "[PASS] No patterns detected":
            suggestions.append("> Avoid sequential/keyboard patterns")
        
        if results['common']['score'] == 0:
            suggestions.append("> DO NOT use common passwords!")
        
        if results['entropy'] < 40:
            suggestions.append("> Use random characters - avoid dictionary words")
        
        if len(suggestions) < 3:
            suggestions.append("> Use passphrase: 4+ random words with symbols")
            suggestions.append("> Consider a password manager for unique passwords")
        
        return suggestions
    
    def analyze(self, password):
        if not password or len(password.strip()) == 0:
            return None
        
        entropy = self.calculate_entropy(password)
        length_score, length_msg = self.check_length(password)
        variety_score, variety_msg = self.check_character_variety(password)
        patterns_score, patterns_msg = self.check_patterns(password)
        common_score, common_msg = self.check_common_password(password)
        crack_time = self.calculate_crack_time(entropy)
        
        results = {
            'password': password,
            'entropy': entropy,
            'crack_time': crack_time,
            'length': {'score': length_score, 'message': length_msg},
            'variety': {'score': variety_score, 'message': variety_msg},
            'patterns': {'score': patterns_score, 'message': patterns_msg},
            'common': {'score': common_score, 'message': common_msg}
        }
        
        total_score = sum([length_score, variety_score, patterns_score, common_score])
        strength_rating, strength_color = self.get_strength_rating(entropy, total_score)
        
        results['strength_rating'] = strength_rating
        results['strength_color'] = strength_color
        results['total_score'] = total_score
        results['suggestions'] = self.generate_improvement_suggestions(password, results)
        
        return results