package lt.rebellion.journal;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
@Entity
@Table(name = "event_journal")
public class JournalEntry {

	@Id
	@Column(name = "entry_id")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long entryID;
	
	@Column(name= "email")
	private String email;
	
	@Column(name= "time")
	private LocalDateTime time;
	
	@Column(name= "type")
	private Type type;
	
	@Column(name= "category")
	private Category category;
	
	@Column(name= "activity")
	private Activity activity;
	
	@Column(name="message")
	private String message;
	
	public JournalEntry() {
		
	}
	
	public JournalEntry(String email, LocalDateTime time, Type type, Category category,
			Activity activity, String message) {
		super();
		this.email = email;
		this.time = time;
		this.type = type;
		this.category = category;
		this.activity = activity;
		this.message = message;
	}	
}
