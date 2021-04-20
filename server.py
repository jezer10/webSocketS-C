import socketio

from aiohttp import web

data={}

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
def  begin_chat(sid,roomname):
    if roomname in data:
        print('ya existe la sala')
        sio.enter_room(sid,room=roomname)

    else:
        print('Creando nueva sala')
        data[roomname]=[]
        sio.enter_room(sid,room=roomname)
@sio.event
async def  exit_chat(sid,roomname):
    sio.leave_room(sid,room=roomname)

@sio.event
async def  message(sid,data):
    session= await sio.get_session(sid)

    await sio.emit('newmsg',{'msg':data,'user':session['username'],'sid':sid},room=session['room'])


@sio.event
async def joinroom(sid,data):
    print(sid+' '+data)
    ar=data.split(',')
    begin_chat(sid,ar[1])
    await sio.save_session(sid, {'username': ar[0] ,'room':ar[1]})



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