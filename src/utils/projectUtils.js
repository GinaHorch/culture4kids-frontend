export function calculatePledges(project) {
    const totalPledges = project.current_amount || 0;
    const targetAmount = project.target_amount || 0;
    const remaining = Math.max(targetAmount - totalPledges, 0); // Ensure remaining amount is not negative
    return { totalPledges, remaining };
  }
  