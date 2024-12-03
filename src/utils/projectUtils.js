export function calculatePledges(project) {
    const totalPledges = project.current_amount; // Use backend property
    const remaining = project.target_amount - totalPledges; // Use backend property
    return { totalPledges, remaining };
  }
  