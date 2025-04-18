document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const passwordField = document.getElementById('password');
    const lengthSlider = document.getElementById('length');
    const lengthNumber = document.getElementById('length-number');
    const lengthValue = document.getElementById('length-value');

    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
      };
    
      passwordField.value = '';

});