const socket=io('http://localhost:5000/')
socket.on('connect',()=>sessionStorage.setItem('sid',socket.id))

/*routes=[{path:'/chat',component:},{path:'/main',component:}]
const router = new VueRouter({
    routes
})
*/

Vue.component('rmsg',{
    data:{
        msj:'hola'
    },
    template:'<div class="rmsgbox"><div class="mensajer">{{ msj }}</div></div>'
    
})

Vue.component('smsg',{
    data:{
        msj:'hola'
    },
    template:'<div class="smsgbox"><div class="mensajes">{{ msj }}</div></div>',
    
})

new Vue({
    el:'#chatbox',
    created(){
        socket.on('newmsg',(msg)=>{
            this.messages.push(msg)
            if(this.checkmsg(msg.sid)){
                this.msgSound(1)
            }else{
                this.msgSound(2)
            }
        })
    },
    
    data:{
        messages:[]
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
            if (sessionStorage.getItem('sid')==s){
                return false
            }
            return true
        }
    }
})

new Vue({
    el:'#msgbox',
    data:{
        message:''
    },
    methods:{
        sendmsg(){
            socket.emit('message',this.message)
            this.message=''
        }
        
    }
})

new Vue({
    el:'#joinroomform',
    data:{
        inroom:false,
        username:'',
        roomcode:'',
        maxl:6
    },
    methods:{
        joinroom(){
            this.inroom=true
            socket.emit('joinroom',this.username+','+this.roomcode)
        },
        leaveroom(){
            this.inroom=false
            socket.emit('leaveroom')
        },
        upprc(){
            this.roomcode=this.roomcode.toUpperCase()
            if(this.roomcode.length>this.maxl){
                this.roomcode=this.roomcode.substring(0,this.maxl)
            }
        }
    },
    filters:{
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.toUpperCase()
          }
    }
})



