import { EmailService } from './emailService';

const emailService = new EmailService();

async function testEmails() {
  const testEmail = 'danibizza@yahoo.it';
  const testFirstName = 'Daniele';
  const testClinicTitle = 'Polework Clinic';
  const testClinicDate = 'Saturday, 23rd November 2024';
  const testReferralCode = 'DANIELE2024';
  const testPoints = 50;
  const testReferredClient = 'Sarah Johnson';

  console.log('Testing GHL Email Integration...\n');

  try {
    // Test 1: First-time clinic confirmation
    console.log('1. Sending first-time clinic confirmation email...');
    await emailService.sendFirstTimeClinicConfirmation(
      testEmail,
      testFirstName,
      testClinicTitle,
      testClinicDate,
      testReferralCode
    );
    console.log('✓ First-time clinic confirmation sent successfully\n');

    // Wait a bit between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Returning client confirmation
    console.log('2. Sending returning client confirmation email...');
    await emailService.sendReturningClinicConfirmation(
      testEmail,
      testFirstName,
      testClinicTitle,
      testClinicDate,
      testReferralCode,
      testPoints
    );
    console.log('✓ Returning client confirmation sent successfully\n');

    // Wait a bit between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Referral bonus notification
    console.log('3. Sending referral bonus notification email...');
    await emailService.sendReferralBonusNotification(
      testEmail,
      testFirstName,
      testReferredClient,
      20,
      testPoints + 20
    );
    console.log('✓ Referral bonus notification sent successfully\n');

    console.log('All test emails sent successfully! Check danibizza@yahoo.it inbox.');
  } catch (error) {
    console.error('Error sending test emails:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

testEmails();
