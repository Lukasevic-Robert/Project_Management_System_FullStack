package lt.rebellion.user;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lt.rebellion.baseEntity.BaseEntity;
import lt.rebellion.project.Project;
import lt.rebellion.role.Role;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User extends BaseEntity{

	
//	@Column(name = "first_name")
//	private String firstName;
//	
//	@Column(name = "last_name")
//	private String lastName;
	
	@Column(name = "email")
	private String email;
	
	@Column(name = "password")
	private String password;
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_roles", 
			joinColumns = @JoinColumn(name = "user_id"), 
			inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();
	
	@OneToMany(mappedBy = "user")
	private Set<Project> projects = new HashSet<>();

	public User(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}
}
