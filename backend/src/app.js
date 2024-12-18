const path = require('path');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));