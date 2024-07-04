import { convert } from "html-to-text";

export async function readText(path: string): Promise<string> {
	// test if path is a local file or a remote URL
	const protocol = path.split("://")[0];
	let result = "";
	if (protocol === "http" || protocol === "https") {
		// fetch the remote URL
		const url = `https://r.jina.ai/${path}`;
		const res = await fetch(url, {
			method: "GET",
		});
		const text = await res.text();
		result = convert(text);
	} else {
		// read the local file
		result = await Bun.file(path).text();
	}
	return result;
}
