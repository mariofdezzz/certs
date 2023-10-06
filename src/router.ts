import { httpRouter, type Route } from 'toruk';
import type { Handler } from 'std/http/server.ts';
import { FileSystem } from '/utils/fs.ts';
import { extname, relative } from 'std/path/mod.ts';

export class Router {
	async getHandler(): Promise<Handler> {
		const routes = await this.getRoutes();

		return httpRouter({
			routes,
		});
	}

	private async getRoutes(): Promise<Route[]> {
		const assets = await this.getAssets();

		const routes = [...assets] satisfies Route[];

		return routes;
	}

	private async getAssets(): Promise<Route[]> {
		const dir = './src/assets';
		const assetPaths = await FileSystem.listDir(dir, { type: 'file' });

		const assets = assetPaths.map<Promise<Route>>(async (filepath) => {
			const file = await Deno.readFile(filepath);
			const fileExt = extname(filepath);
			const relativePath = relative(dir, filepath);
			const path = '/' + relativePath.replace(fileExt, '');

			return {
				path,
				handler: () =>
					new Response(file, {
						headers: {
							'Content-Type': 'application/pdf',
						},
					}),
			};
		});

		return Promise.all(assets);
	}
}
