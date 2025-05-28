function toggleConsole() {
    const cc = document.getElementById('customConsole');
    cc.style.display = cc.style.display === 'none' ? 'block' : 'none';
}

// Custom log function
function myConsoleLog(...args) {
    const cc = document.getElementById('customConsole');
    cc.style.display = 'block';
    cc.innerHTML += args.map(a => 
        typeof a === 'object' ? JSON.stringify(a) : a
    ).join(' ') + '<br>';
    cc.scrollTop = cc.scrollHeight;
}

// Optionally override window.console.log (be careful!)
window.console.log = myConsoleLog;

// Usage
console.log("Hello, this is your custom console!");
console.log({foo: "bar"}, [1,2,3]);
