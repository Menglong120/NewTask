/**
 * NewTask Backend Server
 * 
 * NOTE: The primary user interface has moved to the Next.js frontend (port 3000).
 * This backend now primarily serves as an API layer (/api/*).
 * Legacy EJS views in /views and web routes in /routes/web are maintained for fallback/compatibility.
 */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const authMiddleware = require('./middleware/auth');
const superadmin = require('./routes/web/superadmin')
const user = require('./routes/web/user');

// API
const apiAuth = require('./routes/api/auth');
const apiProfile = require('./routes/api/profile');
const apiProject = require('./routes/api/project');
const apiUser = require('./routes/api/user');
const apiDepartment = require('./routes/api/department');
const apiIssue = require('./routes/api/issue');
const apiSubIssue = require('./routes/api/subIssue');
const apiAnalyst = require('./routes/api/analyst');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');

app.use(cors({
    origin: ["http://127.0.0.1:5501", "http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    credentials: true
}));
app.use(fileUpload());
app.use(cookieParser());
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// API
app.use('/api', apiAuth);
app.use('/api', authMiddleware.requireAuth, apiProfile);
app.use('/api', apiProject);
app.use('/api', apiUser);
app.use('/api', apiDepartment);
app.use('/api', apiIssue);
app.use('/api', apiSubIssue);
app.use('/api', apiAnalyst);

// Web
app.use(superadmin)
app.use(user)

app.use((req, res) => {
    res.status(404).render('pages/error-404');
});

io.on('connection', (socket) => {
    socket.on('sendNotification', (data) => {
        io.emit('receiveNotification', data);
    });
});

server.listen(3030, () => {
    console.log('Server is running on port 3030');
})
