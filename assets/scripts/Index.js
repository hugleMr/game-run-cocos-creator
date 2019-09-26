function confirmQuitGame(){
    Toaster.postMessage("action=quit");
}

function gameComplete(result){
    Toaster.postMessage(result);
}