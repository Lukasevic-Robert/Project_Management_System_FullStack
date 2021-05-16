package lt.rebellion.journal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {

	@Query(value ="SELECT j FROM JournalEntry j")
	Page<JournalEntry> getAllJournalEntries(Pageable pageable);
	
}
