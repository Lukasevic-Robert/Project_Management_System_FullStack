package lt.rebellion.project;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

	@Query(value = "SELECT * FROM projects, user_projects" + " WHERE projects.id = user_projects.project_id " + "AND" + " user_id = ?1 group by projects.id", nativeQuery = true)
	Page<Project> findAllPaginatedProjectsByUserId(Long id, Pageable pageable);
	
	@Query(value = "SELECT * FROM projects WHERE user_id = ?1", nativeQuery = true)
	List<Project> getAllProjectsByUserId(Long id);	
	
}
