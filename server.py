import socketio

from aiohttp import web

rooms={}

PORT=5000
HOST='localhost'

sio= socketio.AsyncServer(async_mode='aiohttp',cors_allowed_origins='*')
app=web.Application()
sio.attach(app)


@sio.event
async def connect(sid,environment):
    print(sid,'connected')

@sio.event
async def disconnect(sid):
    print(sid,'disconnected')

@sio.event
async def  joinroom(sid,data):
    print(data)
    roomcode=data['roomcode']
    sio.enter_room(sid,room=roomcode)
    await sio.save_session(sid,{'username':data['username'],'room':roomcode})
    await sio.emit('newmsg',{'username':data['username'],'sid':sid,'status':'join'},room=roomcode)
    print(sio.rooms(sid))

@sio.event
async def leaveroom(sid,roomname):
    data=await sio.get_session(sid)
    sio.leave_room(sid,roomname)
    await sio.emit('newmsg',{'username':data['username'],'sid':sid,'status':'left'},room=roomname)


@sio.event
async def  message(sid,data):
    session= await sio.get_session(sid)
    await sio.emit('newmsg',{'msg':data,'username':session['username'],'sid':sid},room=session['room'])



def countUsers(sid,roomname):
    if roomname in rooms:
        rooms[roomname].append(sid)
    else:
        rooms[roomname]=[]
        rooms[roomname].append(sid)

async def root(request):
    print(request.match_info.get('name',"Anonymous"))
    return web.Response(text='Hola Mundo')



def auth(env):
    paramsar=env['QUERY_STRING'].split('&')
    paramsar=[p.split('=') for p in paramsar]
    return paramsar[0][1]


if __name__=='__main__':
    app.add_routes([web.get('/',root)])
    web.run_app(app,port=PORT,host=HOST)