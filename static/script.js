const socket=io('http://127.0.0.1:5000')
socket.on('connect',()=>sessionStorage.setItem('sid',socket.id))

/*routes=[{path:'/chat',component:},{path:'/main',component:}]
const router = new VueRouter({
    routes
})
*/

new Vue({
    el:'#vchat',
    data:{
        actualroom:'',
        chat:[],
        message:'',
        inroom:false,
        username:'',
        roomcode:'',
        maxl:6,
        uson:0
    },
    created(){
        socket.on('newmsg',(msg)=>{
            
            this.chat.push(msg)
            if(this.checkmsg(msg.sid)){
                this.msgSound(1)
            }else{
                this.msgSound(2)
            }
            var scroll=this.$el.querySelector('#chatbox')
            console.log(scroll.clientHeight)
        })
        
    },
    methods:{
        msgSound(audio){
            switch(audio){
                case 1: new Audio('./assets/rmsg.mp3').play()
                    break;
                case 2:  new Audio('./assets/smsg.mp3').play()
                    break;
            }
        },
        checkmsg(s){
            if (!s['msg']){
                return false
            }
            if (sessionStorage.getItem('sid')==s['sid']){
                return false
            }
            return true
        },
        sendmsg(){
            if (this.message==''){
                return
            }
            socket.emit('message',this.message)
            this.message=''
        },
        joinroom(){
            this.inroom=true
            socket.emit('joinroom',{'username':this.username,'roomcode':this.roomcode})
            this.actualroom=this.roomcode
        },
        leaveroom(){
            this.inroom=false
            socket.emit('leaveroom',this.roomcode)
            this.chat=[]
            this.actualroom=''
        },
        upprc(){
            this.roomcode=this.roomcode.toUpperCase()
            if(this.roomcode.length>this.maxl){
                this.roomcode=this.roomcode.substring(0,this.maxl)
            }
        }
    }
})