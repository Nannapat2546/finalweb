import express from 'express';
import pkg from 'pg'; // นำเข้า pg เป็น package
const { Pool } = pkg; // ดึง Pool ออกมาจาก package
import bodyParser from 'body-parser';

const app = express();

// ตั้งค่า EJS
app.set('view engine', 'ejs');
app.set('views', './views'); // ใช้เส้นทางที่ถูกต้อง

// เชื่อมต่อกับฐานข้อมูล PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'attendance_db',
    password: '0807780787',
    port: 5432,
});

// ใช้ body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// หน้าแรก
app.get('/', (req, res) => {
    res.render('index');
});

// บันทึกข้อมูลเช็คชื่อ
app.post('/attendance', async (req, res) => {
    const { name, date, status } = req.body;
    const isPresent = status === 'on';

    try {
        await pool.query('INSERT INTO attendance (name, date, status) VALUES ($1, $2, $3)', [name, date, isPresent]);
        res.redirect('/attendance');
    } catch (error) {
        console.error('Error inserting attendance:', error);
        res.status(500).send('Internal Server Error');
    }
});


// ดูบันทึกเช็คชื่อ
app.get('/attendance', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM attendance ORDER BY date DESC');
    res.render('attendance', { records: rows });
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
