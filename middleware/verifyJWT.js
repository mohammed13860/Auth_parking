const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if the Authorization header exists and starts with 'Bearer '
    // التحقق من وجود الهيدر Authorization وأنه يبدأ بـ 'Bearer '
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Unauthorized غير مصرح' });
    }

    const token = authHeader.split(' ')[1]; // استخراج التوكن من الهيدر// Extract the token from the Authorization header

    // Verify the token
    // التحقق من صحة التوكن
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden ممنوع الوصول' }); // توكن غير صالح أو منتهي // Invalid or expired token
        }

        // Attach decoded user info to the request object
        // إضافة بيانات المستخدم من التوكن إلى كائن الطلب
        req.user = decoded.userInfo?.id;
         // الانتقال إلى الميدلوير أو الراوت التالي
        // Pass control to the next middleware or route handler
        return next();
    });
};

module.exports = verifyJWT;
