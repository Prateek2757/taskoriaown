

import {
  getActiveSeoCityCountFromDB,
  getActiveServiceCategoryCountFromDB,
} from "@/lib/cache";
import HomepageStatsCounterClient, {
  type HomepageCounterStat,
} from "./HomepageStatsCounterClient";

export type { HomepageCounterStat } from "./HomepageStatsCounterClient";

const FALLBACK_SERVICE_CATEGORY_COUNT = 100;
const FALLBACK_CITY_COUNT = 50;
const FALLBACK_GOOGLE_RATING = 5;
const FALLBACK_AVERAGE_POST_SECONDS = 60;

function numericEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);

  return Number.isFinite(value) ? value : fallback;
}

async function getHomepageCounterStats(): Promise<HomepageCounterStat[]> {
  const [serviceCategoryCount, cityCount] = await Promise.all([
    getActiveServiceCategoryCountFromDB().catch(
      () => FALLBACK_SERVICE_CATEGORY_COUNT
    ),
    getActiveSeoCityCountFromDB().catch(() => FALLBACK_CITY_COUNT),
  ]);

  return [
    {
      value: serviceCategoryCount,
      suffix: "+",
      label: "Service categories",
    },
    {
      value: numericEnv("HOMEPAGE_GOOGLE_RATING", FALLBACK_GOOGLE_RATING),
      suffix: "\u2605",
      decimals: 1,
      label: "Google rating",
    },
    {
      value: numericEnv(
        "HOMEPAGE_AVERAGE_POST_SECONDS",
        FALLBACK_AVERAGE_POST_SECONDS
      ),
      suffix: "s",
      decimals: 1,
      label: "Average time to post",
    },
    {
      value: cityCount,
      suffix: "+",
      label: "Australian cities",
    },
  ];
}

export default async function HomepageStatsCounter() {
  const stats = await getHomepageCounterStats();

  return <HomepageStatsCounterClient stats={stats} />;
}
