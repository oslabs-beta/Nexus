(function(){
    const vscode = acquireVsCodeApi();
            const counter = document.getElementById('counter');

            let count = 0;
            setInterval(() => {
                counter.textContent = 'How many stars Nexus will have on GitHub: ' + count++;

                // Alert the extension when our cat introduces a bug
                if (Math.random() < 0.001 * count) {
                    vscode.postMessage({
                        command: 'alert',
                        text: '🐛  on line ' + count
                    });
                }
            }, 100);
})();