package lt.rebellion.project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>{

	@Query(value = "SELECT * FROM projects WHERE user_id = ?1", nativeQuery = true)
	List<Project>findAllProjectsByUserId(Long id);
}
