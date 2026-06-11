import {
  DASHBOARD_FEATURE_FLAGS_DEFAULTS,
  type DashboardFeatureFlags,
} from "@sdp-mvp/types";

export { DASHBOARD_FEATURE_FLAGS_DEFAULTS };
export type { DashboardFeatureFlags };

export const DASHBOARD_PAYMENTS_V2_OVERRIDE_COOKIE_NAME =
  "sdp_dashboard_payments_v2_override";

export function resolveDashboardFeatureFlags(
  paymentsV2Override: string | undefined
): DashboardFeatureFlags {
  if (paymentsV2Override === "enabled") {
    return { paymentsV2: true };
  }
  if (paymentsV2Override === "disabled") {
    return { paymentsV2: false };
  }
  return DASHBOARD_FEATURE_FLAGS_DEFAULTS;
}
