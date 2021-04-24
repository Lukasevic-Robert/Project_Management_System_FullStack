package lt.rebellion.service;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

public interface ResponseService<T> {

	ResponseEntity<Page<T>> findPaginated(int page, int size);
}
