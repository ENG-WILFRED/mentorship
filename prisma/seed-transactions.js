const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTransactions() {
  console.log('🌱 Seeding transactions for mentorship schools and environmental conservation...');

  const transactions = [
    // Mentorship Programs
    { amount: 5000, currency: '$', type: 'Donation', status: 'completed', description: 'Quarterly funding for school mentorship program' },
    { amount: 2500, currency: '$', type: 'Expense', status: 'completed', description: 'School supplies and learning materials for 50 students' },
    { amount: 1200, currency: '$', type: 'Expense', status: 'completed', description: 'Mentor training workshop and certification' },
    { amount: 800, currency: '$', type: 'Donation', status: 'completed', description: 'Student scholarships fund' },
    { amount: 450, currency: '$', type: 'Expense', status: 'completed', description: 'Transportation for mentorship outreach' },
    { amount: 3000, currency: '$', type: 'Donation', status: 'completed', description: 'One-time donation for school infrastructure' },
    { amount: 650, currency: '$', type: 'Expense', status: 'completed', description: 'Mentor honorarium and allowances' },
    { amount: 1500, currency: '$', type: 'Expense', status: 'completed', description: 'Educational technology for remote mentoring' },
    { amount: 2200, currency: '$', type: 'Donation', status: 'completed', description: 'Monthly mentorship program operating costs' },
    
    // Environmental Conservation
    { amount: 4000, currency: '$', type: 'Donation', status: 'completed', description: 'Tree planting initiative and environmental cleanup supplies' },
    { amount: 1800, currency: '$', type: 'Expense', status: 'completed', description: 'Recycling bins and waste management infrastructure' },
    { amount: 950, currency: '$', type: 'Expense', status: 'completed', description: 'Environmental education training materials' },
    { amount: 2500, currency: '$', type: 'Donation', status: 'completed', description: 'Water conservation and solar panel installation' },
    { amount: 1100, currency: '$', type: 'Expense', status: 'completed', description: 'Environmental awareness campaign and posters' },
    { amount: 3200, currency: '$', type: 'Donation', status: 'completed', description: 'School garden project and composting system' },
    { amount: 780, currency: '$', type: 'Expense', status: 'completed', description: 'Green technology workshop facilitator fees' },
    { amount: 600, currency: '$', type: 'Expense', status: 'completed', description: 'Environmental monitoring equipment' },
    { amount: 2800, currency: '$', type: 'Donation', status: 'completed', description: 'Quarterly environmental conservation fund' },

    // Combined Programs
    { amount: 3500, currency: '$', type: 'Donation', status: 'completed', description: 'Youth environmental leadership mentorship program' },
    { amount: 1300, currency: '$', type: 'Expense', status: 'completed', description: 'Eco-club materials and field trip expenses' },
    { amount: 2100, currency: '$', type: 'Donation', status: 'completed', description: 'Sustainable livelihoods mentorship for graduates' },
    { amount: 950, currency: '$', type: 'Expense', status: 'completed', description: 'Green mentor training and certification' },
    { amount: 4200, currency: '$', type: 'Donation', status: 'completed', description: 'Environmental sustainability project partnership' },
    { amount: 1600, currency: '$', type: 'Expense', status: 'pending', description: 'Upcoming school garden expansion project' },
    { amount: 2300, currency: '$', type: 'Donation', status: 'completed', description: 'Community tree nursery and mentoring initiative' },
  ];

  for (const txData of transactions) {
    await prisma.transaction.create({
      data: {
        amount: txData.amount,
        currency: txData.currency,
        type: txData.type,
        status: txData.status,
        description: txData.description,
      },
    });
  }

  console.log(`✅ Successfully seeded ${transactions.length} transactions!`);
}

// Run seeder
seedTransactions()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
