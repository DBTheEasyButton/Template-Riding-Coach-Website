import { storage } from "./storage";

export const csvEmailList = [
  { firstName: "Georgy", lastName: "Killengray", email: "georgy.killengray@btinternet.com" },
  { firstName: "Evie", lastName: "Godowski", email: "egodowski@gmail.com" },
  { firstName: "Hannah", lastName: "Kane", email: "hannah@hannahkane.co.uk" },
  { firstName: "Polly", lastName: "McKenzie-Howard", email: "pmckhoward01@gmail.com" },
  { firstName: "Sarah", lastName: "Godowski", email: "godowskis@gmail.com" },
  { firstName: "Abi", lastName: "Mawer", email: "abigail.mawer@gmail.com" },
  { firstName: "Rachel", lastName: "Stanhope", email: "rachel.stanhope92@gmail.com" },
  { firstName: "Sue", lastName: "Dear", email: "suedear@oxyard.co.uk" },
  { firstName: "Emma", lastName: "Hunter", email: "delta_child@hotmail.com" },
  { firstName: "Katie", lastName: "Ball", email: "millie@milliestone.com" },
  { firstName: "Hattie", lastName: "Fancourt", email: "talesattie@googlemail.com" },
  { firstName: "Devon", lastName: "Street", email: "devonaprilstreet@gmail.com" },
  { firstName: "Helen", lastName: "Roberts", email: "helenrobs02@aol.com" },
  { firstName: "Grace", lastName: "Chapple", email: "emmachapple4@gmail.com" },
  { firstName: "Monika", lastName: "Pyziak-Mollov", email: "armollov@yahoo.co.uk" },
  { firstName: "Michelle", lastName: "Watts", email: "mickeywatts@hotmail.co.uk" },
  { firstName: "Cass", lastName: "Winter", email: "cassjwinter@yahoo.com" },
  { firstName: "Shelley", lastName: "Prior", email: "shelley@broadway-florist.com" },
  { firstName: "Elliott", lastName: "Short", email: "elliottshort@hotmail.co.uk" },
  { firstName: "Christine", lastName: "Wilson", email: "wilsoncj1@hotmail.co.uk" },
  { firstName: "Sally", lastName: "Last", email: "sallybiddulph@hotmail.com" },
  { firstName: "Emma", lastName: "Brooks", email: "emma.brooks.uk@gmail.com" },
  { firstName: "Louise", lastName: "Roberts", email: "louisegloster@yahoo.co.uk" },
  { firstName: "Nicola", lastName: "Topper", email: "nicola.topper@gmail.com" },
  { firstName: "Fiona", lastName: "Mackenzie", email: "fifimack@yahoo.com" },
  { firstName: "Fiona", lastName: "Byrne", email: "f.byrne21@btconnect.com" },
  { firstName: "Lilly", lastName: "Bulley", email: "lillyannebulley@outlook.com" },
  { firstName: "Zoe", lastName: "Etherington", email: "zoe.etherington@btinternet.com" },
  { firstName: "Lizzie", lastName: "Royce", email: "lizzieroyce@live.co.uk" },
  { firstName: "Sheila", lastName: "Jones", email: "sheilajones95@outlook.com" },
  { firstName: "Eva", lastName: "Raisbeck", email: "clemraisbeck@hotmail.com" },
  { firstName: "Karen", lastName: "Rawlins", email: "karenrawlins.1@btopenworld.com" },
  { firstName: "Susan", lastName: "Stodart", email: "susanstodart@gmail.com" },
  { firstName: "Nadja", lastName: "Stuertzbecher", email: "nadja.sbr@gmail.com" },
  { firstName: "Charlotte", lastName: "Alexander", email: "charlotte.alexander@lycetts.co.uk" },
  { firstName: "Charlie", lastName: "Winchester", email: "4shiresvets@gmail.com" },
  { firstName: "Angela", lastName: "Hardie", email: "angelalhardie@gmail.com" },
  { firstName: "Isabelle", lastName: "Chadbourne", email: "isabellechadbourne@snowdome.co.uk" },
  { firstName: "Susie", lastName: "Evans", email: "evans.susie@hotmail.com" },
  { firstName: "Anna", lastName: "Metekohy", email: "a_metekohy@hotmail.co.uk" },
  { firstName: "Vanessa", lastName: "Hartley", email: "vanessa.hartley@hotmail.com" },
  { firstName: "Amanda", lastName: "Courtney", email: "cruella@courtconstruct.co.uk" },
  { firstName: "Sonia", lastName: "Mattle", email: "sonia@charingworthgrange.net" },
  { firstName: "Gina", lastName: "Farrow", email: "gina@ginafarrow.com" },
  { firstName: "Annie", lastName: "Hall", email: "info@camp4211.co.uk" },
  { firstName: "Ann", lastName: "Wright", email: "annjwright@googlemail.com" },
  { firstName: "Liz", lastName: "Quinn", email: "lquinn21@icloud.com" },
  { firstName: "Molly", lastName: "Williams", email: "molly.f.williams@icloud.com" },
  { firstName: "Monica", lastName: "Norton", email: "monicanorton1@googlemail.com" },
  { firstName: "Loti", lastName: "Innes-Parry", email: "loti-x@sky.com" },
  { firstName: "Gillian", lastName: "Carr", email: "gillscarr@hotmail.com" },
  { firstName: "Cheryl", lastName: "Edwards", email: "chezedd1405@gmail.com" },
  { firstName: "Laura", lastName: "Thomas", email: "laura@buckthornfarm.co.uk" },
  { firstName: "Lucie", lastName: "Howkins", email: "lucie.howkins@gmail.com" },
  { firstName: "Ysabelle", lastName: "Martin", email: "ysabelleindia@icloud.com" },
  { firstName: "Kate", lastName: "Clarke", email: "katelouiseyoung123@gmail.com" },
  { firstName: "Paul", lastName: "Hitchin", email: "paul.hitchin007@gmail.com" },
  { firstName: "Immy", lastName: "Brade", email: "susancnewcombe@gmail.com" },
  { firstName: "Alison", lastName: "Coldicott", email: "a.m.coldicott@gmail.com" },
  { firstName: "Tina", lastName: "Thornton", email: "christina.thornton@hotmail.co.uk" },
  { firstName: "Kelsey", lastName: "Ball", email: "kelselizball@icloud.com" },
  { firstName: "Eleanor", lastName: "Harrison", email: "ellinora.96@live.co.uk" },
  { firstName: "Betsy", lastName: "Hunt", email: "betsyhunt7@gmail.com" },
  { firstName: "Fiona", lastName: "Dowding", email: "fionadowding@yahoo.co.uk" },
  { firstName: "Lynne", lastName: "Kitson", email: "lynneki@hotmail.com" },
  { firstName: "Tiffany", lastName: "Rix", email: "tiffanyrix@hotmail.com" },
  { firstName: "Zuzanna", lastName: "Pogorzelska", email: "zuzannapogorzelska@yahoo.com" },
  { firstName: "Jo", lastName: "Poultney", email: "joannapoultney@yahoo.co.uk" },
  { firstName: "Bella", lastName: "Harrison", email: "emma@sandfieldfarm.com" },
  { firstName: "Alexia", lastName: "Davies", email: "alexia.j.massey@gmail.com" },
  { firstName: "Alex", lastName: "Wilkinson", email: "allyywilkinson@gmail.com" },
  { firstName: "Annabel", lastName: "England", email: "englands6@aol.com" },
  { firstName: "Cathy", lastName: "Twiston Davies", email: "cathy.twistondavies@btinternet.com" },
  { firstName: "Amy", lastName: "Stokes", email: "amyfranklinstokes@live.co.uk" },
  { firstName: "Charlotte", lastName: "Marsh", email: "charlotte.marsh2002@gmail.com" },
  { firstName: "Holly", lastName: "Evans", email: "Groomscottage@hotmail.com" },
  { firstName: "Alex", lastName: "Thomas", email: "alexthomas262@gmail.com" },
  { firstName: "Amanda", lastName: "Campbell", email: "amanda@republicamedia.co.uk" },
  { firstName: "Bex", lastName: "Read", email: "bexxread@gmail.com" },
  { firstName: "Grace", lastName: "Leonard", email: "grace06leonard@icloud.com" },
  { firstName: "Purdy", lastName: "Lenigas", email: "lucy@solona.co.uk" },
  { firstName: "Alexandra", lastName: "Thomas", email: "alexthomas262@googlemail.com" },
  { firstName: "Erin", lastName: "Marriott", email: "erin.jennings11@icloud.com" },
  { firstName: "Sarah", lastName: "Dossett", email: "sarahdossett@hotmail.com" }
];

export async function replaceCsvEmails() {
  console.log("Starting CSV email replacement...");
  
  // Clear all existing subscribers
  await storage.clearAllEmailSubscribers();
  console.log("Cleared existing subscribers");
  
  // Add new subscribers from CSV
  let successCount = 0;
  let errorCount = 0;
  
  for (const contact of csvEmailList) {
    try {
      await storage.createEmailSubscriber({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        isActive: true,
        subscriptionSource: "csv_import"
      });
      successCount++;
    } catch (error) {
      console.error(`Failed to import ${contact.email}:`, error);
      errorCount++;
    }
  }
  
  console.log(`CSV import completed: ${successCount} successful, ${errorCount} failed`);
  return { successCount, errorCount };
}