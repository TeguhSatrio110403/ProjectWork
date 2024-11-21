import db from './db.js';
import bcrypt from 'bcrypt';

// Function untuk simpan data accel x ke table
export const saveAcceleration_xData = async (data) => {
  try {
    const { id_accel_x, id_lokasi, tanggal, nilai_accel_x } = data;

    await db.query('INSERT INTO data_accel_x SET ?', {
      id_accel_x: id_accel_x, 
      id_lokasi: id_lokasi, 
      nilai_accel_x: nilai_accel_x,
      tanggal: tanggal
      
    });
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan data Acceleration x');
  }
};

// Function untuk simpan data accel y ke table
export const saveAccelerationA_yData = async (data) => {
  try {
    const { id_accel_y, id_lokasi, tanggal, nilai_accel_y } = data;

    await db.query('INSERT INTO data_accel_y SET ?', {
      id_accel_y: id_accel_y, 
      id_lokasi: id_lokasi, 
      nilai_accel_y: nilai_accel_y,
      tanggal: tanggal
      
    });
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan data Acceleration x');
  }
};

// Function untuk simpan data accel z ke table
export const saveAcceleration_zData= async (data) => {
  try {
    const { id_accel_z, id_lokasi, tanggal, nilai_accel_z } = data;

    await db.query('INSERT INTO data_accel_z SET ?', {
      id_accel_z: id_accel_z, 
      id_lokasi: id_lokasi, 
      nilai_accel_z: nilai_accel_z,
      tanggal: tanggal
      
    });
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan data Acceleration x');
  }
};

export const saveSensorPHData = async (data) => {
  try {
    const { id_ph, id_lokasi, tanggal, nilai_ph } = data;

    await db.query('INSERT INTO data_ph SET ?', {
      id_ph: id_ph, 
      id_lokasi: id_lokasi, 
      nilai_ph: nilai_ph,
      tanggal: tanggal
    });
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan data pH');
  }
};

export const saveTurbidityData = async (data) => {
  try {
    const { id_turbidity, id_lokasi, tanggal, nilai_turbidity } = data;

    await db.query('INSERT INTO data_turbidity SET ?', {
      id_turbidity: id_turbidity, 
      id_lokasi: id_lokasi, 
      nilai_turbidity: nilai_turbidity,
      tanggal: tanggal
    });
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan Data Turbidity');
  }
};

export const saveTemperatureData = async (data) => {
  try {
     const { id_temperature, id_lokasi, tanggal, nilai_temperature } = data;

    await db.query('INSERT INTO data_temperature SET ?', {
      id_temperature: id_temperature, 
      id_lokasi: id_lokasi, 
      nilai_temperature: nilai_temperature,
      tanggal: tanggal
    });
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan data Temperature');
  }
};

//BELOM 
export const getAllDataSensor = async (req, res) => {
  try {
    // Query untuk mengambil data dari tabel sensor
    const [rows] = await db.query(`
      SELECT 
        COALESCE(a.timestamp, p.timestamp, t.timestamp, u.timestamp) AS timestamp,
        a.acceleration_x AS accelX,
        a.acceleration_y AS accelY,
        a.acceleration_z AS accelZ,
        t.temperature_value AS temperature,
        u.turbidity_value AS turbidity,
        p.ph_value AS phsensor
      FROM
        (SELECT timestamp, acceleration_x, acceleration_y, acceleration_z
         FROM acceleration) a
      LEFT JOIN
        (SELECT timestamp, ph_value
         FROM ph_sensor) p ON a.timestamp = p.timestamp
      LEFT JOIN
        (SELECT timestamp, temperature_value
         FROM temperature) t ON a.timestamp = t.timestamp
      LEFT JOIN
        (SELECT timestamp, turbidity_value
         FROM turbidity) u ON a.timestamp = u.timestamp
      ORDER BY timestamp ASC
    `);

    // Mengirimkan hasil query sebagai respons JSON
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginController = async (req, res) => {
  const { username, password } = req.body;
  console.log('Username:', username);
  console.log('Password:', password);

  try {
    // Retrieve user from the database by username
    const result = await db.query('SELECT * FROM users WHERE username = ?', [
      username,
    ]);
    console.log('Result from DB:', result[0][0].password); // Log the entire result object

    // Check if result.rows is defined and has a length property
    if (!result[0] || result[0].length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const hashedPassword = result[0][0].password;
    console.log('Hashed Password from DB:', hashedPassword);

    // Compare the provided password with the hashed password from the database
    const match = await bcrypt.compare(password, hashedPassword);
    console.log('Match:', match);

    if (!match) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    res.status(200).json({ message: 'Login Berhasil' });
  } catch (error) {
    console.error('Error in loginController:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export default {
  loginController,
  saveAccelerationData,
  saveSensorPHData,
  saveTemperatureData,
  saveTurbidityData,
};
