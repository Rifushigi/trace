import { Schema } from "mongoose";
import { User, Class } from "../models/index.js";
import { emailFrom, transporter } from "../config/index.js";
import { DatabaseError } from "../middlewares/index.js";
import ejs from "ejs";

// Helper function to get user's full name
export async function getUserFullName(userId: Schema.Types.ObjectId): Promise<string> {
    const user = await User.findById(userId.toString());
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`.trim();
}

// Helper function to get class name
export async function getClassName(classId: Schema.Types.ObjectId): Promise<string> {
    const classData = await Class.findById(classId.toString());
    if (!classData) return 'Unknown Class';
    return `${classData.courseCode} - ${classData.title}`;
}

// Helper function to send email with error handling
export async function sendEmailWithTemplate(
    to: string,
    subject: string,
    templatePath: string,
    templateData: any
): Promise<void> {
    try {
        const htmlContent = await ejs.renderFile(templatePath, templateData);
        const mailOptions = {
            from: emailFrom,
            to,
            subject,
            html: htmlContent as string
        };
        await (await transporter()).sendMail(mailOptions);
    } catch (error) {
        throw new DatabaseError(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
} 