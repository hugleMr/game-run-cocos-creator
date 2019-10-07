
function callGameQuit(){
    Toaster.postMessage("action=quit");
}

function callGameComplete(score){
    Toaster.postMessage('action=finish&data=' + score);
}