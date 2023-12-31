import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import * as FormData from 'form-data';
import { List, User } from '@prisma/client';

type EmailData = {
	from: string;
	to: string;
	cc?: string;
	subject: string;
	html: string;
};

let mailgunApiKey: string;
let mailgunDomain: string;
let isProduction: boolean;

@Injectable()
export class EmailService {
	private mailgunClient: IMailgunClient;

	constructor(private readonly configService: ConfigService) {
		mailgunApiKey = this.configService.get<string>('MAILGUN_KEY') as string;
		mailgunDomain = this.configService.get<string>('MAILGUN_DOMAIN') as string;
		isProduction = this.configService.get<string>('NODE_ENV') === 'production';

		if (!mailgunApiKey || !mailgunDomain) {
			throw new Error('Mailgun API key or domain is not configured');
		}

		const mailgun = new Mailgun(FormData);
		this.mailgunClient = mailgun.client({
			username: 'api',
			key: mailgunApiKey,
		});
	}

	private async sendEmail(messageData: EmailData) {
		if (isProduction) {
			try {
				const fire = await this.mailgunClient.messages.create(
					mailgunDomain,
					messageData,
				);

				return fire;
			} catch (error) {
				throw new InternalServerErrorException(
					'Error attempting to send email',
				);
			}
		}
	}

	async sendSignupEmail(recipient: string, username: string) {
		const email = {
			from: 'CineSync <mail@cinesync.me>',
			to: recipient,
			subject: 'Welcome to CineSync!',
			html: `
			<style>
			@import url('https://fonts.cdnfonts.com/css/courier-prime');
			p {
				font-family: 'Courier Prime', sans-serif;
			}
			</style>
			<p>Hi there ${username},</p>
			<p>We're thrilled to welcome you to CineSync! 🎉</p>
			<p>Thank you for joining our community. You're now part of a growing network of users who want to curate, manage, and share their most loved movies.</p>
			<p>To get started and learn more about our service, visit our about page at <a href="https://cinesync.me/dashboard/about">https://cinesync.me/dashboard/about</a>. There you can find information about our application and how it works.
			<br/>If you have any questions or need assistance, please don't hesitate to reach out to our team at <a href="mailto:cinesync@proton.me">cinesync@proton.me</a>.</p>
			<p>We look forward to seeing you thrive in our community and hope you enjoy every moment of your journey with us.</p>
			<p>With love,</p>
			<p>The CineSync Team</p>
			`,
		};

		await this.sendEmail(email);
	}

	async sendListSharingEmail(users: User[], list: List) {
		const [owner, sharee] = users;

		const email = {
			from: 'CineSync <mail@cinesync.me>',
			to: sharee.email,
			cc: owner.email,
			subject: 'A user has shared a list with you on CineSync!',
			html: `
			<style>
			@import url('https://fonts.cdnfonts.com/css/courier-prime');
			p {
				font-family: 'Courier Prime', sans-serif;
			}
			</style>
			<p>Hi there ${sharee.username},</p>
			<p>${owner.username} has shared the movie list "${list.name}" with you on CineSync! 🎬</p>
			<p>Click <a href="https://cinesync.me/dashboard/list/${list.id}">here</a> to view the list.
			<br/>If you have any questions or need assistance, please don't hesitate to reach out to our team at <a href="mailto:cinesync@proton.me">cinesync@proton.me</a>.</p>
			<p>Enjoy exploring the movies!</p>
			<p>With love,</p>
			<p>The CineSync Team</p>
			`,
		};

		await this.sendEmail(email);
	}

	async sendListCommentEmail(creator: string, list: List, commenter: string) {
		const email = {
			from: 'CineSync <mail@cinesync.me>',
			to: creator,
			subject: 'A user has commented on one of your lists on CineSync!',
			html: `
			<style>
			@import url('https://fonts.cdnfonts.com/css/courier-prime');
			p {
				font-family: 'Courier Prime', sans-serif;
			}
			</style>
			<p>Hi there ${creator},</p>
			<p>${commenter} has left a comment on the movie list "${list.name}" on CineSync! 💬</p>
			<p>Click <a href="https://cinesync.me/dashboard/list/${list.id}">here</a> to view the list.
			<br/>If you have any questions or need assistance, please don't hesitate to reach out to our team at <a href="mailto:cinesync@proton.me">cinesync@proton.me</a>.</p>
			<p>Enjoy exploring the movies!</p>
			<p>With love,</p>
			<p>The CineSync Team</p>
			`,
		};

		await this.sendEmail(email);
	}

	async sendAccountDeletionEmail(recipient: string) {
		const email = {
			from: 'CineSync <mail@cinesync.me>',
			to: recipient,
			subject: 'Your account has been deleted on CineSync',
			html: `
			<style>
			@import url('https://fonts.cdnfonts.com/css/courier-prime');
			p {
				font-family: 'Courier Prime', sans-serif;
			}
			</style>
			<p>Hi there ${recipient},</p>
			<p>Your CineSync account has been successfully deleted. We're sorry to see you go. 😢</p>
			<p>If you ever decide to return, we'll be here to welcome you back with open arms.</p>
			<p>If you have any feedback or questions, please don't hesitate to reach out to our team at <a href="mailto:cinesync@proton.me">cinesync@proton.me</a>.</p>
			<p>Thank you for being a part of our community, and we hope to see you again in the future!</p>
			<p>With love,</p>
			<p>The CineSync Team</p>
			`,
		};

		await this.sendEmail(email);
	}
}
