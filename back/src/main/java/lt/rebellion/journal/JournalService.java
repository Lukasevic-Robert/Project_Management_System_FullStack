package lt.rebellion.journal;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JournalService {

	@Autowired
	private JournalEntryRepository journalEntryRepository;
	
	@Transactional(readOnly = true)
	public Page<JournalEntry> getAllJournalEntries(Pageable pageable) {
		return journalEntryRepository.getAllJournalEntries(pageable);
	}

	@Transactional
	public void newJournalEntry(Type type, Category category, Activity activity,
			String message) {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String email = "";
		if (principal instanceof UserDetails) {
			email = ((UserDetails) principal).getUsername();
		}
		
		JournalEntry entry = new JournalEntry(email, LocalDateTime.now(), type, category,
				activity, message);

		journalEntryRepository.saveAndFlush(entry);
	}

	@Transactional
	public void newJournalEntry(String email, Type type, Category category,
			Activity activity, String message) {

		JournalEntry entry = new JournalEntry(email, LocalDateTime.now(), type, category,
				activity, message);

		journalEntryRepository.saveAndFlush(entry);
	}
}
