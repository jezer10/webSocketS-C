import socketio

from aiohttp import web

PORT=5000
HOST='localhost'

sio= socketio.AsyncServer(async_mode='aiohttp')
app=web.Application()
sio.attach(app)

@sio.event
def connect(sid,environment):
    print(sid,'connected')

@sio.event
def disconnect(sid):
    print(sid,'disconnected')



async def root(request):
    print(request.match_info.get('name',"Anonymous"))
    return web.Response(text='Hola Mundo')



if __name__=='__main__':
    app.add_routes([web.get('/',root)])
    web.run_app(app,port=PORT,host=HOST)