const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);


const userModel = require('./model/User')
const grModel = require('./model/GroupChat')
const pmModel = require('./model/PrivateChat')

//mongoDB
const mongoDB = 'mongodb+srv://RK_02:ab8UjMGR44roYdJH@cluster0.iu4uasl.mongodb.net/comp3133_labtest?retryWrites=true&w=majority'
mongoose.connect(mongoDB, 
    {
         useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(success => {
      console.log('MongoDB connected')
    }).catch(err => {
      console.log('Error while MongoDB connection')
    });
    
    const formatMessage = require('./model/message');
    const {
      userJoin,
      getCurrentUser,
      userLeave,
      getRoomUsers
    } = require('./model/users');
    
    
    // Set static folder
    app.use(express.static(path.join(__dirname, 'public')));
    
    const botName = "Chat Master";
    
    // Run when client connects
    io.on('connection', socket => {
      socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
    
        socket.join(user.room);
    
        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome back'));
    
        // Broadcast when a user connects
        socket.broadcast
          .to(user.room)
          .emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat`)
          );
    
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      });
    
      // Listen for chatMessage
      socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
    
        io.to(user.room).emit('message', formatMessage(user.username, msg));
      });
    
      // Runs when client disconnects
      socket.on('disconnect', () => {
        const user = userLeave(socket.id);
    
        if (user) {
          io.to(user.room).emit(
            'message',
            formatMessage(botName, `${user.username} has left the chat`)
          );
    
          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        }
      });
    });
    
    //http://localhost:3000/signup
    app.get('./signup', async (request, response) => {
        response.sendFile('/public/signup.html');
    });
    
    //http://localhost:3000/login
    app.get('/login', async (request, response) => {
        response.sendFile('/public/login.html')
    });
    app.post('/login', async (request, response) => {
    const user = new userModel(request.body);
    try {
      await user.save((err) => {
        if(err){
            if (err.code === 11000) {
               return response.redirect('/signup?err=username')
            }
          
          response.send(err)
        }else{
            response.sendFile('/public/login')
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
    });
    
    //http://localhost:3000/
    app.get('/', async (request, response) => {
        response.sendFile(__dirname + './public/login.html')
    });
    app.post('/', async (request, response) => {
    const username=request.body.username
    const password=request.body.password
    
    const user = await userModel.find({username:username});
    
    try {
      if(user.length != 0){
        if(user[0].password==password){
          return response.redirect('/')
        }
        else{
          return response.redirect('/login?wrong=pass')
        }
      }else{
        return response.redirect('/login?wrong=uname')
      }
    } catch (err) {
        response.status(500).send(err);
    }
    });
    
   
    //http://localhost:3000/chat/covid
    app.get('/chat/:room', async (request, response) => {
      const room = request.params.room
      const msg = await gmModel.find({room: room}).sort({'date_sent': 'desc'}).limit(10);
      if(msg.length!=0){
        response.send(msg)
      }
      else
      response.sendFile(__dirname + `<a href="./signup.html">`)
    });
    app.post('/chat',async(request,response)=>{
      const username=request.body.username
      const user = await userModel.find({username:username});
      console.log(user)
      if(user[0].username==username){
        return response.redirect('/chat/'+username)
      }
      else{
        return response.redirect('/?err=noUser')
      }
    })
    


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
