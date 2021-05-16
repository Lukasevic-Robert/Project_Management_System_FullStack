package lt.rebellion.journal;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lt.rebellion.exception.NotFoundException;
import lt.rebellion.project.ProjectDTO;
import lt.rebellion.user.User;
import lt.rebellion.user.UserRepository;

@Service
public class JournalService {

	@Autowired
	private JournalEntryRepository journalEntryRepository;

	@Autowired
	private UserRepository userRepository;
	
	
	@Transactional(readOnly = true)
	public Page<JournalEntry> getAllJournalEntries(Pageable pageable) {
		return journalEntryRepository.getAllJournalEntries(pageable);
	}

	/**
	 * Metodas visiems atvejams, kai pasiekiamas user iš SecurityContext
	 */
	
//	public Page<JournalEntry> getAllJournalEntries(Pageable pageable) {
//		Page<JournalEntry> allProjects = journalEntryRepository.findAll(pageable);
//		return allProjects;
//	}

	@Transactional
	public void newJournalEntry(Type type, Category category, Activity activity,
			String message) {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String email = "";
		if (principal instanceof UserDetails) {
			email = ((UserDetails) principal).getUsername();
		}
//		if (!username.isBlank()) {
//			User currentUser= userRepository.findByEmail(username).get();
//			String email=currentUser.getEmail();
//		}
//		
		JournalEntry entry = new JournalEntry(email, LocalDateTime.now(), type, category,
				activity, message);

		journalEntryRepository.saveAndFlush(entry);
	}


	/**
	 * Metodas sėkmingo prisijungimo atvejui, kad nereikėtų ieškoti userID
	 * duombazėje
	 */

//	@Transactional
//	public void newJournalEntry(Category category, Activity activity, String message) {
//
//		String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
//		
//		User currentUser = userRepository.findByUsername(currentUsername);
//		Long currentUserID = 0L;
//		
//		if(currentUser!=null) {
//			currentUserID = currentUser.getUserId();
//		} 
//		
//		JournalEntry entry = new JournalEntry(currentUserID, currentUsername, LocalDateTime.now(), operationType,
//				currentUserID, objectType, entryMessage);
//
//		journalEntryRepository.saveAndFlush(entry);
//	}

	/**
	 * Metodas atvejams, kai SecurityContext'e nelieka/nėra userio - logout ir
	 * unsuccessful login atvejais. Nesėkmingo prisijungimo atveju currentUserID,
	 * objectID reikšmes paduoti null
	 */

	@Transactional
	public void newJournalEntry(String email, Type type, Category category,
			Activity activity, String message) {

		JournalEntry entry = new JournalEntry(email, LocalDateTime.now(), type, category,
				activity, message);

		journalEntryRepository.saveAndFlush(entry);
	}
	
	
}
