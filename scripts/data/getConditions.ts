import got from "got";
import cheerio from "cheerio";
import * as log from "../util/log";
import write from "../util/write";

export interface Condition {
  name: string;
  description: string;
  icon: string;
}

export default async function getStatuses() {
  log.info("Starting");
  try {
    log.info("Running");
    const result = await got("https://temtem.gamepedia.com/Status_Conditions");
    const $ = cheerio.load(result.body);
    const $page = $(".mw-parser-output").last();
    const statuses: Condition[] = [];
    $page.find(".mw-headline").each((i, el) => {
      if (i === 0) return;
      const description = $(el)
        .parent("h2")
        .next("p")
        .text()
        .trim()
        .replace(/\n/g, "");
      const conditions = $(el)
        .text()
        .split(" and ")
        .map(c => ({
          name: c.trim(),
          description,
          icon: `/images/icons/conditions/${c.trim()}.png`
        }));
      statuses.push(...conditions);
    });
    await write("conditions", statuses);
    return statuses;
  } catch (e) {
    log.error(e.message);
  }
}
