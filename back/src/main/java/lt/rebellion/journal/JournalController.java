package lt.rebellion.journal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/admin/journal")

public class JournalController {

	@Autowired
	private JournalService journalService;
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping(path = "/page")
	public ResponseEntity<Page<JournalEntry>> getJournalEntriesPage(
			@RequestParam("page") int page, 
			  @RequestParam("size") int size) {	
		
		Sort.Order order = new Sort.Order(Sort.Direction.DESC, "time");
						
		Pageable pageable = PageRequest.of(page, size, Sort.by(order));

		return new ResponseEntity<>(journalService.getAllJournalEntries(pageable), HttpStatus.OK);
	}

}
