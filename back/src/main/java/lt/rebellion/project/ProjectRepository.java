package lt.rebellion.project;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

	@Query(value = "SELECT * FROM projects WHERE user_id = ?1", nativeQuery = true)
	Page<Project> findAllPaginatedProjectsByUserId(Long id, Pageable pageable);
	
	@Query(value = "SELECT * FROM projects WHERE user_id = ?1", nativeQuery = true)
	List<Project> getAllProjectsByUserId(Long id);

	@Query(value = "SELECT * FROM projects WHERE id = ?1 AND user_id = ?2", nativeQuery = true)
	Project findByIdAndUserId(Long projectId, Long userId);
	
	
}
