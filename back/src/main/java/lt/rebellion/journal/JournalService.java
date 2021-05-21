package lt.rebellion.journal;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class JournalService {

	@Autowired
	private JournalEntryRepository journalEntryRepository;

	@Transactional(readOnly = true)
	public Page<JournalEntry> getAllJournalEntries(Pageable pageable) {
		return journalEntryRepository.getAllJournalEntries(pageable);
	}

	@Transactional
	public void newJournalEntry(Type type, Category category, Activity activity, String message) {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String email = "";
		if (principal instanceof UserDetails) {
			email = ((UserDetails) principal).getUsername();
		}

		JournalEntry entry = new JournalEntry(email, LocalDateTime.now(), type, category, activity, message);

		journalEntryRepository.saveAndFlush(entry);
	}

	@Transactional
	public void newJournalEntry(String email, Type type, Category category, Activity activity, String message) {

		JournalEntry entry = new JournalEntry(email, LocalDateTime.now(), type, category, activity, message);

		journalEntryRepository.saveAndFlush(entry);
	}

	public HttpServletResponse exportToCSV(HttpServletResponse response) throws IOException {

		response.setContentType("text/csv");

		List<JournalEntry> entries = journalEntryRepository.findAll();
//		List<JournalEntryDTO> entriesDTO = entries.stream().map(entry -> toEntryDTO(entry))
//				.collect(Collectors.toList());

		ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
		String[] csvHeader = { "Entry ID", "Email", "Time", "Type", "Category", "Activity", "Message" };
		String[] nameMapping = { "entryID", "email", "time", "type", "category", "activity", "message" };

		csvWriter.writeHeader(csvHeader);

		for (JournalEntry entry : entries) {
			log.info("Entry: {}", entries);
			csvWriter.write(entry, nameMapping);
		}
		csvWriter.close();
		return response;
	}

}
