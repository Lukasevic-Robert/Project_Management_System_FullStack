package lt.rebellion.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long>{
	
	@Query(value = "SELECT * FROM users WHERE UPPER(first_name) LIKE %:keyword% OR UPPER(last_name) LIKE %:keyword% OR id LIKE %:keyword%", nativeQuery = true)
	Page<User>findPaginatedUsersByKeyword(Pageable pageable, @Param("keyword") String keyword);
	
	@Query(value = "SELECT * FROM users WHERE status!='PENDING'", nativeQuery = true)
	List<User> findAllActivated();
	
	Optional <User> findByEmail (String email);
	
	Boolean existsByEmail(String email);
}
