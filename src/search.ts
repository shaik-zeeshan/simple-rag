import { config } from "./env";

const env = config;

const searchURL = new URL("https://www.googleapis.com/customsearch/v1");
searchURL.searchParams.set("key", env.GOOGLE_API);
searchURL.searchParams.set("cx", env.CX);

export async function search(query: string) {
	searchURL.searchParams.set("q", query);
	const res = await fetch(searchURL, {
		method: "GET",
	});
	const data = await res.json();
	const links = data.items.map((item: { link: string }) => item.link);
	return links;
}
