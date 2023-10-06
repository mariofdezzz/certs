import { walk, WalkEntry } from 'std/fs/walk.ts';

type ListDirOptions = {
	type: 'file' | 'dir';
};
type ListDirFilters = Record<
	ListDirOptions['type'] | 'default',
	(e: WalkEntry) => boolean
>;
const ListDirFilters: ListDirFilters = {
	file: (entry: WalkEntry) => entry.isFile,
	dir: (entry: WalkEntry) => entry.isDirectory,
	default: () => true,
};

export class FileSystem {
	static async listDir(path: string, { type }: ListDirOptions) {
		const walkList: WalkEntry[] = [];

		for await (const entry of walk(path)) {
			walkList.push(entry);
		}

		const list = walkList.filter(
			ListDirFilters[type ?? 'default'],
		).map((entry) => entry.path);

		return list;
	}
}
