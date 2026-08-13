// Shared helper for the various VITE_MOCK_* flags scattered across api/*.ts files (see
// forfaitApi.ts, souscriptionApi.ts, tokenApi.ts, paymentApi.ts, paymentMethodApi.ts, and
// the pre-existing routeurApi.ts). Wraps a plain value into the same shape as an axios
// response, with a simulated network delay so loading states/skeletons still render.
import type { AxiosResponse } from "axios";

export function mockResponse<T>(data: T, delayMs = 400): Promise<AxiosResponse<T>> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          data,
          status: 200,
          statusText: "OK",
          headers: {},
          config: {} as AxiosResponse["config"],
        }),
      delayMs
    )
  );
}
