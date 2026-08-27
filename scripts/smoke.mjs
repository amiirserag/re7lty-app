/**
 * Headless smoke test for re7lety core flows.
 * Run: node scripts/smoke.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:5173";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function dismissToHome(page) {
  await page.waitForTimeout(1800);

  // Onboarding — keep polling; splash/step transitions may still be animating.
  for (let i = 0; i < 12; i++) {
    if (await page.getByRole("button", { name: /get started/i }).count()) {
      await page.getByRole("button", { name: /get started/i }).click();
      break;
    }
    if (await page.getByRole("button", { name: /^continue$/i }).count()) {
      await page.getByRole("button", { name: /^continue$/i }).first().click();
    } else if (await page.getByRole("button", { name: /^skip$/i }).count()) {
      await page.getByRole("button", { name: /^skip$/i }).click();
      break;
    }
    await page.waitForTimeout(500);
  }

  await page.waitForTimeout(400);
  if (await page.locator("text=/select city/i").count()) {
    await page.locator(".location-card").first().click();
  }
  await page.getByRole("button", { name: /more detail/i }).waitFor({ timeout: 8000 });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 900 },
  });
  // Fresh storage each run
  await context.clearCookies();
  const page = await context.newPage();
  // Wipe persisted state only on the tab's first load, so the reload-persistence
  // test (step 10) still sees the saved data.
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("smoke-initialized")) {
      localStorage.clear();
      sessionStorage.setItem("smoke-initialized", "1");
    }
  });

  const results = [];
  const pass = (name) => {
    results.push({ name, ok: true });
    console.log(`PASS  ${name}`);
  };
  const fail = (name, err) => {
    results.push({ name, ok: false, err: String(err) });
    console.error(`FAIL  ${name}: ${err}`);
  };

  try {
    await page.goto(BASE, { waitUntil: "networkidle" });

    try {
      await page.waitForSelector("text=/drive beyond ordinary/i", { timeout: 5000 });
      pass("1 Launch / splash");
    } catch (e) {
      fail("1 Launch / splash", e.message);
    }

    try {
      await dismissToHome(page);
      pass("2 Onboarding + location → Home");
    } catch (e) {
      fail("2 Onboarding + location → Home", e.message);
    }

    try {
      const before = await page.locator(".home-title-block h1").innerText();
      const dots = page.locator(".pager button");
      assert((await dots.count()) >= 2, "need pager dots");
      await dots.nth(1).click();
      await page.waitForTimeout(450);
      const after = await page.locator(".home-title-block h1").innerText();
      assert(before !== after, `carousel did not change (${before} → ${after})`);
      pass("3 Featured carousel pager");
    } catch (e) {
      fail("3 Featured carousel pager", e.message);
    }

    try {
      await page.getByRole("button", { name: /more detail/i }).first().click();
      await page.waitForSelector("text=/book now/i", { timeout: 5000 });
      pass("4 Car detail");
    } catch (e) {
      fail("4 Car detail", e.message);
    }

    try {
      await page.locator(".section-head button").first().click();
      await page.waitForSelector("text=/rotate 360/i", { timeout: 5000 });
      await page.locator(".hotspot").first().click();
      await page.waitForTimeout(350);
      assert((await page.locator(".hotspot-card").count()) > 0, "hotspot sheet missing");
      pass("5 Tour + hotspot");
    } catch (e) {
      fail("5 Tour + hotspot", e.message);
    }

    try {
      await page.getByRole("button", { name: /^back$/i }).first().click();
      await page.waitForTimeout(350);
      await page.getByRole("button", { name: /book now/i }).click();
      await page.waitForSelector("text=/step 1/i", { timeout: 5000 });
      pass("6 Open booking");
    } catch (e) {
      fail("6 Open booking", e.message);
    }

    let refText = "";
    try {
      for (let i = 0; i < 4; i++) {
        await page.getByTestId("booking-continue").click({ force: true });
        await page.waitForTimeout(300);
      }
      await page.getByTestId("booking-confirm").click({ force: true });
      await page.waitForSelector("text=/you're ready/i", { timeout: 5000 });
      refText = await page.locator("text=/RE7-\\d+/").first().innerText();
      pass("7 Complete booking " + refText.trim());
    } catch (e) {
      fail("7 Complete booking", e.message);
    }

    try {
      await page.getByRole("button", { name: /view booking/i }).click();
      await page.waitForSelector("text=/my bookings/i", { timeout: 5000 });
      assert((await page.locator("text=/RE7-\\d+/").count()) > 0, "booking not listed");
      pass("8 Bookings list");
    } catch (e) {
      fail("8 Bookings list", e.message);
    }

    try {
      await page.locator(".nav-item", { hasText: /^Explore$/i }).click();
      await page.waitForTimeout(350);
      await page.getByPlaceholder(/search vehicles/i).fill("Land");
      await page.waitForTimeout(350);
      assert((await page.locator(".pack-list-card").count()) > 0, "no search results");
      pass("9 Explore search");
    } catch (e) {
      fail("9 Explore search", e.message);
    }

    try {
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForTimeout(2000);
      if (await page.locator("text=/select city/i").count()) {
        await page.locator(".location-card").first().click();
        await page.waitForTimeout(400);
      }
      // should not show full onboarding again
      assert(
        (await page.locator("text=/rent the extraordinary/i").count()) === 0,
        "onboarding replayed",
      );
      await page.locator(".nav-item", { hasText: /^Bookings$/i }).click();
      await page.waitForTimeout(400);
      assert((await page.locator("text=/RE7-\\d+/").count()) > 0, "booking lost after reload");
      pass("10 Persistence after reload");
    } catch (e) {
      fail("10 Persistence after reload", e.message);
    }

    try {
      // Re-book the same car (booked in step 7 at the same default dates):
      // the Continue button must be disabled and the conflict note shown.
      await page.locator(".nav-item", { hasText: /^Home$/i }).click();
      await page.waitForTimeout(400);
      await page.locator(".pager button").nth(1).click();
      await page.waitForTimeout(450);
      await page.getByRole("button", { name: /more detail/i }).first().click();
      await page.getByRole("button", { name: /book now/i }).click();
      await page.waitForSelector("text=/step 1/i", { timeout: 5000 });
      await page.waitForTimeout(400);
      assert(
        await page.getByTestId("booking-continue").isDisabled(),
        "continue should be disabled for double-booked dates",
      );
      assert(
        (await page.locator("text=/already have a booking/i").count()) > 0,
        "conflict note missing",
      );
      pass("11 Double-booking guard");
    } catch (e) {
      fail("11 Double-booking guard", e.message);
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log("\n── Summary ──");
  console.log(`${results.filter((r) => r.ok).length}/${results.length} passed`);
  if (failed.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
