from flask import Flask, render_template, request, jsonify
from password_analyzer import PasswordStrengthAnalyzer
import traceback

app = Flask(__name__)
analyzer = PasswordStrengthAnalyzer()

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_password():
    """API endpoint to analyze password"""
    try:
        data = request.get_json()
        password = data.get('password', '')
        
        if not password:
            return jsonify({'error': 'Password cannot be empty'}), 400
        
        # Analyze password using your existing analyzer
        results = analyzer.analyze(password)
        
        if results:
            # Format results for JSON response
            response = {
                'success': True,
                'entropy': results['entropy'],
                'crack_time': results['crack_time'],
                'strength_rating': results['strength_rating'],
                'strength_color': results['strength_color'],
                'length_score': results['length']['score'],
                'length_message': results['length']['message'],
                'variety_score': results['variety']['score'],
                'variety_message': results['variety']['message'],
                'patterns_score': results['patterns']['score'],
                'patterns_message': results['patterns']['message'],
                'common_score': results['common']['score'],
                'common_message': results['common']['message'],
                'suggestions': results['suggestions'],
                'total_score': results['total_score']
            }
            return jsonify(response)
        else:
            return jsonify({'error': 'Analysis failed'}), 500
            
    except Exception as e:
        print(f"Error: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🔐 Starting Password Strength Analyzer Web App...")
    print("🌐 Open your browser and go to: http://127.0.0.1:5000")
    print("Press CTRL+C to stop the server")
    app.run(debug=True, host='127.0.0.1', port=5000)