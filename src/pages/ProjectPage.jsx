import { useParams } from "react-router-dom";
import useProject from "../hooks/use-project";
import { calculatePledges } from "../utils/projectUtils";

function ProjectPage() {
      // Here we use a hook that comes for free in react router called `useParams` to get the id from the URL so that we can pass it to our useProject hook.
      const { id } = useParams();
      // useProject returns three pieces of info, so we need to grab them all here
      const { project, isLoading, error } = useProject(id);    

      if (isLoading) {
            return (<p>loading...</p>)
      }
        
      if (error) {
            return (<p>{error.message}</p>)
      }

      // Calculate pledges
      const { totalPledges, remaining } = calculatePledges(project);

      return (
          <div>
              <h2>{project.title}</h2>
              <h3>Created at: {project.date_created}</h3>
              <h3>{`Status: ${project.is_open ? "Open" : "Closed"}`}</h3>
              <p>Goal: ${project.target_amount}</p>
              <p>Total Pledged: ${totalPledges}</p>
              <h3>Pledges:</h3>
              <ul>
                  {project.pledges.map((pledgeData, key) => {
                      return (
                          <li key={key}>
                              {pledgeData.amount} from {pledgeData.supporter}
                          </li>
                      );
                  })}
              </ul>
          </div>
       );
    }
  
  export default ProjectPage