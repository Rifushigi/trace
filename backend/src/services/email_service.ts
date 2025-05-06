import { Model } from "mongoose";
import {
    Verification,
    User,
    AttendanceSession,
    AttendanceLog
} from "../models/index.js";
import {
    IOtp,
    IVerification,
    IVerificationToken,
    IAttendanceLog,
    IAttendanceSession
} from "../types/index.js";
import { randomBytes } from "crypto";
import { baseUrl, emailExp, emailFrom, otpExp, transporter } from "../config/index.js";
import path from "path";
import ejs from "ejs";
import { getUserByEmail, getUserById } from "./user_service.js";
import {
    AuthenticationError,
    ConflictError,
    NotFoundError,
    DatabaseError
} from "../middlewares/index.js";
import {
    getUserFullName,
    getClassName,
    sendEmailWithTemplate,
    hashPayload,
    generateOtp
} from "../utils/index.js";
import { format as dateFormat } from "date-fns";

const dbModel: Model<IVerification> = Verification;
const __dirname = path.resolve();

export async function sendVerificationEmail(email: string): Promise<void> {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    const verificationRecord = await dbModel.findOne({ userId: user?._id });

    if (verificationRecord?.isVerified) {
        throw new ConflictError("User is already verified");
    }

    let verificationLink;

    if (!verificationRecord) {
        const token = randomBytes(32).toString('hex');
        const verificationToken: IVerificationToken = {
            token,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + emailExp)
        };
        const verification = new dbModel({
            userId: user?._id,
            updatedAt: new Date(),
            email: email,
            verificationToken: verificationToken
        });
        await verification.save();
        verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;
    } else if (new Date() > verificationRecord.verificationToken.expiresAt) {
        const token = randomBytes(32).toString('hex');
        const verificationToken: IVerificationToken = {
            token,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + emailExp)
        };

        verificationRecord.verificationToken = verificationToken;
        verificationRecord.updatedAt = new Date();
        await verificationRecord.save();
        verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;
    } else {
        verificationLink = `${baseUrl}/auth/verify-email?token=${verificationRecord.verificationToken.token}`;
    }

    const templatePath = path.join(__dirname, "/src/views/emails/verification_email.ejs");
    const htmlContent = await ejs.renderFile(templatePath, {
        title: "Email Verification",
        userName: user?.firstName || "User",
        verificationLink: verificationLink,
    })
    const mailOptions = {
        from: emailFrom,
        to: email,
        subject: 'Email Verification',
        html: htmlContent
    };

    (await transporter()).sendMail(mailOptions);
}

export async function validateVerificationEmail(token: string): Promise<boolean | void> {
    const verificationRecord = await dbModel.findOne({ "verificationToken.token": token });
    console.log({ verificationRecord });
    if (!verificationRecord) {
        throw new NotFoundError("Request for a new verfication email");
    }

    if (verificationRecord.isVerified) {
        throw new ConflictError("Email has already been verified");
    }

    const storedToken = verificationRecord.verificationToken.token;
    const expiresAt = verificationRecord.verificationToken.expiresAt;
    // Check if the token has expired
    if (new Date() > expiresAt) {
        throw new AuthenticationError("Token has expired, request a new verification email");
    }

    if (storedToken && storedToken === token) {
        if (verificationRecord.userId) {
            const user = await getUserById(verificationRecord.userId.toString());
            if (user) {
                user.isVerified = true;
                await user.save();
            }
            verificationRecord.isVerified = true;
            verificationRecord.verifiedAt = new Date();
            verificationRecord.updatedAt = new Date();
            await verificationRecord.save();

            // Send email notification
            const templatePath = path.join(__dirname, "src/views/emails/email_verified.ejs");
            const htmlContent = await ejs.renderFile(templatePath, {
                title: "Email Verified",
                firstName: user?.firstName,
            });

            const mailOptions = {
                from: emailFrom,
                to: verificationRecord.email,
                subject: "Email Verified Successfully",
                html: htmlContent,
            };

            await (await transporter()).sendMail(mailOptions);
            return true;
        }
    }
    throw new AuthenticationError("Invalid token, request for a new verification email");
}

export async function sendOtpEmail(email: string) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    const verificationRecord = await dbModel.findOne({ userId: user?._id });
    let code;

    if (!verificationRecord) {
        code = generateOtp();
        const otp: IOtp = {
            code,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + otpExp)
        };
        const verification = new dbModel({
            userId: user?._id,
            updatedAt: new Date(),
            email: email,
            otp: otp
        });
        await verification.save();
    } else if (new Date() > verificationRecord.otp.expiresAt) {
        code = generateOtp();
        const otp: IOtp = {
            code,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + otpExp)
        };
        verificationRecord.otp = otp;
        verificationRecord.updatedAt = new Date();
        await verificationRecord.save();
    } else {
        code = verificationRecord.otp.code;
    }

    const templatePath = path.join(__dirname, "/src/views/emails/otp_email.ejs");
    const htmlContent = await ejs.renderFile(templatePath, {
        title: "Password Reset (OTP)",
        userName: user?.firstName || "User",
        otp: code
    })
    const mailOptions = {
        from: emailFrom,
        to: email,
        subject: 'Password Reset (OTP)',
        html: htmlContent
    };

    (await transporter()).sendMail(mailOptions);
}

export async function verifyOtpEmail(email: string, otp: string, password: string): Promise<boolean | void> {

    const verificationRecord = await dbModel.findOne({ email });
    if (!verificationRecord) {
        throw new NotFoundError("Request for a new otp");
    }

    if (verificationRecord?.otp.usedAt) {
        throw new ConflictError("Invalid otp");
    }

    const storedOtp = verificationRecord.otp.code;

    if (storedOtp && storedOtp === otp) {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        user.password = await hashPayload(password);
        verificationRecord.updatedAt = new Date();
        verificationRecord.otp.usedAt = new Date();
        await verificationRecord.save();
        await user.save();
        return true;
    }
    throw new AuthenticationError("Invalid otp, request for a new otp");
}

export async function notifySessionStart(session: IAttendanceSession, lecturerEmail: string) {
    try {
        const templatePath = path.join(__dirname, "/src/views/emails/session_start.ejs");
        const lecturerName = await getUserFullName(session._id);
        const className = await getClassName(session.classId);

        await sendEmailWithTemplate(
            lecturerEmail,
            'Attendance Session Started',
            templatePath,
            {
                title: "Session Started",
                lecturerName,
                className,
                session,
                dashboardUrl: `${baseUrl}/dashboard/sessions/${session._id}`,
                format: dateFormat
            }
        );
    } catch (error) {
        throw new DatabaseError(`Failed to send session start notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function notifySessionEnd(session: IAttendanceSession, lecturerEmail: string) {
    try {
        const templatePath = path.join(__dirname, "/src/views/emails/session_end.ejs");

        // Get attendance statistics
        const totalStudents = await User.countDocuments({ role: 'student' });
        const presentStudents = await AttendanceLog.countDocuments({ sessionId: session._id });
        const attendanceRate = totalStudents > 0 ? presentStudents / totalStudents : 0;

        const lecturerName = await getUserFullName(session._id);
        const className = await getClassName(session.classId);

        await sendEmailWithTemplate(
            lecturerEmail,
            'Attendance Session Ended',
            templatePath,
            {
                lecturerName,
                className,
                session,
                totalStudents,
                presentStudents,
                attendanceRate,
                dashboardUrl: `${baseUrl}/dashboard/sessions/${session._id}`,
                format: dateFormat
            }
        );
    } catch (error) {
        throw new DatabaseError(`Failed to send session end notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function notifyCheckIn(log: IAttendanceLog, studentEmail: string) {
    try {
        const templatePath = path.join(__dirname, "/src/views/emails/check_in.ejs");

        // Get session and class details
        const session = await AttendanceSession.findById(log.sessionId);
        if (!session) {
            throw new NotFoundError("Session not found");
        }

        const studentName = await getUserFullName(log.studentId);
        const className = await getClassName(session.classId);

        await sendEmailWithTemplate(
            studentEmail,
            'Attendance Check-in Confirmation',
            templatePath,
            {
                studentName,
                className,
                log,
                dashboardUrl: `${baseUrl}/dashboard/attendance/${log._id}`,
                format: dateFormat
            }
        );
    } catch (error) {
        throw new DatabaseError(`Failed to send check-in notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function notifyAnomaly(log: IAttendanceLog, lecturerEmail: string) {
    try {
        const templatePath = path.join(__dirname, "/src/views/emails/attendance_anomaly.ejs");

        // Get session and student details
        const session = await AttendanceSession.findById(log.sessionId);
        if (!session) {
            throw new NotFoundError("Session not found");
        }

        const lecturerName = await getUserFullName(session._id);
        const studentName = await getUserFullName(log.studentId);
        const className = await getClassName(session.classId);

        await sendEmailWithTemplate(
            lecturerEmail,
            'Attendance Anomaly Detected',
            templatePath,
            {
                lecturerName,
                studentName,
                className,
                log,
                dashboardUrl: `${baseUrl}/dashboard/attendance/${log._id}`,
                format: dateFormat
            }
        );
    } catch (error) {
        throw new DatabaseError(`Failed to send anomaly notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function notifyLowAttendance(session: IAttendanceSession, lecturerEmail: string, attendanceRate: number) {
    try {
        const templatePath = path.join(__dirname, "/src/views/emails/low_attendance.ejs");

        // Get attendance statistics
        const totalStudents = await User.countDocuments({ role: 'student' });
        const presentStudents = await AttendanceLog.countDocuments({ sessionId: session._id });

        const lecturerName = await getUserFullName(session._id);
        const className = await getClassName(session.classId);

        await sendEmailWithTemplate(
            lecturerEmail,
            'Low Attendance Alert',
            templatePath,
            {
                lecturerName,
                className,
                session,
                totalStudents,
                presentStudents,
                attendanceRate,
                dashboardUrl: `${baseUrl}/dashboard/sessions/${session._id}`,
                format: dateFormat
            }
        );
    } catch (error) {
        throw new DatabaseError(`Failed to send low attendance notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}