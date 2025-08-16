export interface ForecastThresholds {
  agingDays: number;
  noActivityDays: number;
}

export const forecastThresholds: ForecastThresholds = {
  agingDays: Number(process.env.FORECAST_AGING_DAYS ?? 60),
  noActivityDays: Number(process.env.FORECAST_NO_ACTIVITY_DAYS ?? 30),
};
