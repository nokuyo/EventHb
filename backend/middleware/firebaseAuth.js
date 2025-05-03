const admin = require("firebase-admin");
const serviceAccount = require("../firebaseKey.json"); // Firebase service key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Firebase token" });
  }
};
