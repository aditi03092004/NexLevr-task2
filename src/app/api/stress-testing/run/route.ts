import { NextRequest, NextResponse } from "next/server";
import { executeTestCase, runFullStressTestSuite } from "@/lib/stressTesting/runner";
import { STRESS_TEST_SUITE } from "@/lib/stressTesting/testSuite";
import { TestCategory } from "@/lib/stressTesting/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      phase = "AFTER_FIXES",
      testId,
      category,
    } = body as {
      phase?: "BEFORE_FIXES" | "AFTER_FIXES";
      testId?: string;
      category?: TestCategory;
    };

    // If running a single specific test
    if (testId) {
      const testCase = STRESS_TEST_SUITE.find((t) => t.id === testId);
      if (!testCase) {
        return NextResponse.json({ error: `Test case ${testId} not found` }, { status: 404 });
      }
      const result = await executeTestCase(testCase, phase);
      return NextResponse.json({ result });
    }

    // If filtering by category
    if (category) {
      const filtered = STRESS_TEST_SUITE.filter((t) => t.category === category);
      const results = [];
      for (const t of filtered) {
        const res = await executeTestCase(t, phase);
        results.push(res);
      }
      return NextResponse.json({ category, phase, count: results.length, results });
    }

    // Otherwise run full test suite
    const report = await runFullStressTestSuite(phase);
    return NextResponse.json(report);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Stress Test Runner API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute stress tests" },
      { status: 500 }
    );
  }
}
