package lt.rebellion.task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

	@Query(value = "SELECT count(*) FROM tasks WHERE project_id = ?1", nativeQuery = true)
	int getAllTaskCount(Long id);

	@Query(value = "SELECT count(*) FROM tasks WHERE project_id = ?1 AND status != 'DONE'", nativeQuery = true)
	int getAllUndoneTaskCount(Long id);
	
	@Query(value = "SELECT * FROM tasks WHERE project_id = ?1 AND status = 'BACKLOG'", nativeQuery = true)
	List<Task> findBacklogTasks(Long id);
	
	@Query(value = "SELECT * FROM tasks WHERE project_id = ?1 AND status != 'BACKLOG'" + " AND " + "status != 'HISTORY'", nativeQuery = true)
	List<Task> findActiveTasks(Long id);
}
