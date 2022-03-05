(function(){
    const vscode = acquireVsCodeApi();            
            // append functionality to resulting html elements
            var tree= document.querySelectorAll(".tree");
            for (var i = 0; i < tree.length; i++) {
                tree[i].parentElement.classList.add('plus');
                
                tree[i].onclick= function() {
                this.parentElement.querySelector(".subtree").classList.toggle("active");
                this.parentElement.classList.toggle('minus');
                
                };
            }
})();