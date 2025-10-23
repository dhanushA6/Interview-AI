import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

/**
 * Send a verification email to a new user.
 * Purpose: Sends an email containing a verification token for email verification.
 * Input:
 *   - email: string (recipient's email address)
 *   - verificationToken: string (unique token/code for verification)
 * Output:
 *   - On success: Logs the email response to console.
 *   - On failure: Throws an error with descriptive message.
 */

export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};



/**
 * Send a welcome email to a new user.
 * Purpose: Greets the user after successful registration.
 * Input:
 *   - email: string (recipient's email address)
 *   - name: string (recipient's name)
 * Output:
 *   - On success: Logs the email response to console.
 *   - On failure: Throws an error with descriptive message.
 */

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      subject: "Welcome to Auth Company!",
      text: `Hi ${name},\n\nWelcome to Auth Company. We're glad to have you!`,
      html: `<p>Hi ${name},</p><p>Welcome to <strong>Auth Company</strong>. We're glad to have you!</p>`,
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};


/**
 * Send a password reset email to a user.
 * Purpose: Provides a reset link for users who request password reset.
 * Input:
 *   - email: string (recipient's email address)
 *   - resetURL: string (link to reset password)
 * Output:
 *   - On success: Email sent (no console log here, optional).
 *   - On failure: Throws an error with descriptive message.
 */


export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

/**
 * Send a confirmation email after successful password reset.
 * Purpose: Notifies the user that their password has been reset successfully.
 * Input:
 *   - email: string (recipient's email address)
 * Output:
 *   - On success: Logs the email response to console.
 *   - On failure: Throws an error with descriptive message.
 */

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};