export function calculatePledges(project) {
    const totalPledges = project.current_amount || 0; // Use backend property
    const remaining = project.target_amount - totalPledges || 0; // Use backend property
    return { totalPledges, remaining };
  }
  