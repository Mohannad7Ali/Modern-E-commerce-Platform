"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passwordResetTemplate = (resetUrl, token) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعادة تعيين كلمة المرور | EgWinch</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f8f9fa;
            padding-bottom: 40px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            margin: 30px auto;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #eee;
        }
        .header {
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .content h2 {
            color: #1a1a1a;
            font-size: 20px;
            margin-bottom: 20px;
        }
        .content p {
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            padding: 14px 35px;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        .token-box {
            background-color: #f1f3f5;
            padding: 15px;
            border-radius: 8px;
            margin: 25px 0;
            border: 1px dashed #adb5bd;
        }
        .token-text {
            font-family: monospace;
            font-size: 22px;
            color: #007bff;
            letter-spacing: 2px;
            font-weight: bold;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #999;
            background-color: #fafafa;
        }
        .hr {
            border: 0;
            border-top: 1px solid #eee;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>EgWinch</h1>
            </div>
            <div class="content">
                <h2>نسيت كلمة المرور؟</h2>
                <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. يمكنك القيام بذلك بالضغط على الزر أدناه:</p>
                
                <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
                
                <div class="hr"></div>
                
                <p>أو استخدم رمز التحقق التالي:</p>
                <div class="token-box">
                    <span class="token-text">${token}</span>
                </div>
                
                <p style="font-size: 14px; color: #888;">إذا لم تطلب هذا الإجراء، يمكنك تجاهل هذا الإيميل بأمان.</p>
            </div>
            <div class="footer">
                &copy; 2026 EgWinch Team. جميع الحقوق محفوظة.<br>
                هذا البريد تم إرساله تلقائياً، يرجى عدم الرد عليه.
            </div>
        </div>
    </div>
</body>
</html>
`;
exports.default = passwordResetTemplate;
