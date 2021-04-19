const app = new Vue({
    el:'chat'
}) 

function msgSound(){
    new Audio('./assets/smsg.mp3').play()

}

function enterMsg(e) {

    console.log(e)
    if (e.key=='Enter'){
        document.getElementById('msgButton').click()
        document.getElementById('msgInput').value=''
    }
}