import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import fs from "fs";
import { ref, get, set, update, remove } from "firebase/database";

const ADMIN_UID = "PEJmKG9mp3ahKo0jL77qVMiGLd42";
const ATTACKER_UID = "unauthorized_user_999";
const PROJECT_ID = "bhanu-portfolio-78a90";

const rules = fs.readFileSync("./database.rules.json", "utf8");

let testEnv;
let passed = 0;
let total = 0;

async function runTest(name, testFn) {
  total++;
  try {
    await testFn();
    passed++;
    console.log(`✅ [PASS] ${name}`);
  } catch (error) {
    console.error(`❌ [FAIL] ${name}:`, error.message || error);
  }
}

async function main() {
  console.log("=================================================================");
  console.log("   OFFICIAL FIREBASE REALTIME DATABASE EMULATOR RULES VERIFIER   ");
  console.log("   Engine: Firebase Realtime Database Emulator (Java Runtime)    ");
  console.log("=================================================================\n");

  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    database: {
      rules,
      host: "127.0.0.1",
      port: 9000,
    },
  });

  const unauthedContext = testEnv.unauthenticatedContext();
  const unauthedDb = unauthedContext.database();

  const attackerContext = testEnv.authenticatedContext(ATTACKER_UID);
  const attackerDb = attackerContext.database();

  const adminContext = testEnv.authenticatedContext(ADMIN_UID);
  const adminDb = adminContext.database();

  const validMsg = {
    name: "Sai Shruthin",
    email: "saishruthin8555@gmail.com",
    subject: "Collaboration Inquiry",
    message: "Hello Bhanu, loved your 3D Keycap Tech Orb and projects!",
    createdAt: new Date().toISOString(),
    read: false,
  };

  // 1. Portfolio read/write tests
  await runTest("1. Public visitor CAN read portfolio content", async () => {
    await assertSucceeds(get(ref(unauthedDb, "portfolio/projects")));
  });

  await runTest("2. Anonymous visitor CANNOT write to portfolio", async () => {
    await assertFails(set(ref(unauthedDb, "portfolio/projects/p1"), { title: "Hacked" }));
  });

  await runTest("3. Unauthorized user CANNOT write to portfolio", async () => {
    await assertFails(set(ref(attackerDb, "portfolio/projects/p1"), { title: "Hacked" }));
  });

  await runTest("4. Admin (PEJmKG9mp3ahKo0jL77qVMiGLd42) CAN manage portfolio content", async () => {
    await assertSucceeds(
      set(ref(adminDb, "portfolio/projects/p1"), {
        title: "DecisionVerse AI",
        category: "AI PLATFORM",
      })
    );
  });

  // 2. Messages read protection
  await runTest("5. Anonymous visitor CANNOT read /messages root", async () => {
    await assertFails(get(ref(unauthedDb, "messages")));
  });

  await runTest("6. Unauthorized authenticated user CANNOT read /messages", async () => {
    await assertFails(get(ref(attackerDb, "messages")));
  });

  await runTest("7. Admin CAN read /messages root", async () => {
    await assertSucceeds(get(ref(adminDb, "messages")));
  });

  // 3. Direct write to /messages root & multi-location writes
  await runTest("8. Anonymous visitor CANNOT write directly to /messages root", async () => {
    await assertFails(set(ref(unauthedDb, "messages"), { defaced: true }));
  });

  await runTest("9. Anonymous visitor CANNOT perform unauthorized multi-location writes", async () => {
    await assertFails(
      update(ref(unauthedDb), {
        "messages/test_ml": validMsg,
        "portfolio/about": { hacked: true },
      })
    );
  });

  // 4. Contact message creation & validation
  await runTest("10. Anonymous visitor CAN create a valid contact message", async () => {
    await assertSucceeds(set(ref(unauthedDb, "messages/msg_01"), validMsg));
  });

  await runTest("11. REJECT: Missing required field (email)", async () => {
    const invalid = { ...validMsg };
    delete invalid.email;
    await assertFails(set(ref(unauthedDb, "messages/msg_bad_email"), invalid));
  });

  await runTest("12. REJECT: Malformed email format", async () => {
    await assertFails(
      set(ref(unauthedDb, "messages/msg_bad_email_fmt"), {
        ...validMsg,
        email: "not-an-email-at-all",
      })
    );
  });

  await runTest("13. REJECT: Empty name", async () => {
    await assertFails(
      set(ref(unauthedDb, "messages/msg_bad_name"), {
        ...validMsg,
        name: "",
      })
    );
  });

  await runTest("14. REJECT: Empty message body", async () => {
    await assertFails(
      set(ref(unauthedDb, "messages/msg_bad_msg"), {
        ...validMsg,
        message: "",
      })
    );
  });

  await runTest("15. REJECT: Forged initial read: true status", async () => {
    await assertFails(
      set(ref(unauthedDb, "messages/msg_forged_read"), {
        ...validMsg,
        read: true,
      })
    );
  });

  await runTest("16. REJECT: Extra unauthorized fields injected ($other: false)", async () => {
    await assertFails(
      set(ref(unauthedDb, "messages/msg_extra_fields"), {
        ...validMsg,
        isAdmin: true,
        backdoor: "payload",
      })
    );
  });

  // 5. Modification & Deletion Protection
  await runTest("17. Anonymous visitor CANNOT modify existing message", async () => {
    await assertFails(
      set(ref(unauthedDb, "messages/msg_01"), {
        ...validMsg,
        message: "Attempted defacement of existing message",
      })
    );
  });

  await runTest("18. Anonymous visitor CANNOT delete existing message", async () => {
    await assertFails(remove(ref(unauthedDb, "messages/msg_01")));
  });

  await runTest("19. Unauthorized user CANNOT modify existing message", async () => {
    await assertFails(
      set(ref(attackerDb, "messages/msg_01"), {
        ...validMsg,
        message: "Attacker tampering with message",
      })
    );
  });

  await runTest("20. Unauthorized user CANNOT delete existing message", async () => {
    await assertFails(remove(ref(attackerDb, "messages/msg_01")));
  });

  // 6. Admin message management
  await runTest("21. Admin CAN update message status (mark as read)", async () => {
    await assertSucceeds(update(ref(adminDb, "messages/msg_01"), { read: true }));
  });

  await runTest("22. Admin CAN delete message", async () => {
    await assertSucceeds(remove(ref(adminDb, "messages/msg_01")));
  });

  // 7. Unknown root paths
  await runTest("23. Access to unknown root path is completely denied", async () => {
    await assertFails(get(ref(unauthedDb, "secret_data")));
  });

  console.log(`\n=================================================================`);
  console.log(`   TEST SUMMARY: ${passed}/${total} passed (${Math.round((passed / total) * 100)}% success rate)`);
  console.log(`=================================================================\n`);

  await testEnv.cleanup();

  if (passed !== total) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
