let messages = ["I warned you!", "You're still here?!", "Go away!"];

window.addEventListener('load', function() {
    let btn = document.getElementById("trap-btn");
    
    if (btn) {
        btn.addEventListener("click", function() {
            let i = 0;
            
            // "while (true)" lets the different messages keep alerting since we'll never turn it to "false"
            while (true) {
                alert(messages[i]);
                i++;
                
                // Reset the counter so it cycles through the 3 messages forever
                if (i >= messages.length) {
                    i = 0;
                }
            }
        });
    }
});