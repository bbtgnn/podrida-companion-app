import { deLocalizeUrl } from '$lib/paraglide/runtime';
import { app } from '@app/index';
import type { ClientInit } from '@sveltejs/kit';

export const reroute = (request: Request) => deLocalizeUrl(request.url).pathname;

export const init: ClientInit = () => {
	app.load();
};
