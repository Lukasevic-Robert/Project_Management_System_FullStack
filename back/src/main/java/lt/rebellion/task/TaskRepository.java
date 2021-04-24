package lt.rebellion.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

	@Query(value = "SELECT count(*) FROM tasks WHERE project_id = ?1", nativeQuery = true)
	int getAllTaskCount(Long id);

	@Query(value = "SELECT count(*) FROM tasks WHERE project_id = ?1 AND status != 'DONE'", nativeQuery = true)
	int getAllUndoneTaskCount(Long id);
}
