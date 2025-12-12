import { emailService } from "../server/emailService";

const users = [
  { email: "4shiresvets@gmail.com", firstName: "Charlie", referralCode: "DBM-CHARLIE", points: 10 },
  { email: "louisegloster@yahoo.co.uk", firstName: "Louise", referralCode: "DBM-LOUISE", points: 10 },
  { email: "susancnewcombe@gmail.com", firstName: "Susan", referralCode: "DBM-SUSAN", points: 10 },
  { email: "moorendhouse@hotmail.co.uk", firstName: "Sian", referralCode: "DBM-SIAN", points: 10 },
];

async function sendReferralCodes() {
  console.log("Sending referral code emails to users...\n");
  
  for (const user of users) {
    console.log(`Sending to ${user.firstName} (${user.email})...`);
    try {
      const success = await emailService.sendReferralCodeReminder(
        user.email,
        user.firstName,
        user.referralCode,
        user.points
      );
      if (success) {
        console.log(`  ✓ Email sent successfully to ${user.email}`);
      } else {
        console.log(`  ✗ Failed to send email to ${user.email}`);
      }
    } catch (error) {
      console.error(`  ✗ Error sending to ${user.email}:`, error);
    }
  }
  
  console.log("\nDone!");
  process.exit(0);
}

sendReferralCodes();
