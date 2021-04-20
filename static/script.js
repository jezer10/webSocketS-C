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
            this.messages.push({'msg':msg,name:''})
        })
    },
    data:{
        messages:[]
    },
    methods:{
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
        },
        msgSound(){
            new Audio('./assets/smsg.mp3').play()
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



