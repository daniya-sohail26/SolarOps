const db = require('./dbconnection');
const bcrypt = require('bcrypt');

async function register(req, res) {
  try {
    const { organizationName, email, password, location } = req.body;

    const existingEmail = await db.fetchData(email);

    if (existingEmail.length !== 0) {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.insertData({
      organizationName,
      email,
      password: hashedPassword,
      location,
    });

    if (user) {
      return res.status(200).json({ success: true, msg: "Successfully registered" });
    } else {
      return res.status(500).json({ success: false, error: "Failed to register user" });
    }
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

async function login(req, res) {
    try {
        const { email, password, organizationName } = req.body;

        const user = await db.fetchDataByEmailAndOrganization(email, organizationName);
        console.log("User fetched:", user);
        
        if (user.length === 0) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, error: "Invalid credentials" });
        }

        return res.status(200).json({
            success: true,
            msg: "Login successful",
            user: { email: user[0].email, organizationName: user[0].organizationName }
        });
    } catch (error) {
        console.error("Error during login:", error); 
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

  
module.exports = {register, login};
