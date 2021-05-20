package lt.rebellion.service;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lt.rebellion.model.EStatus;
import lt.rebellion.user.User;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserDetailsImpl implements UserDetails{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7996756526614494270L;
	
	private Long id;

	private String email;

	@JsonIgnore
	private String password;
	private boolean isActive;
	private Collection<? extends GrantedAuthority> authorities;
	
	
	
	public static UserDetailsImpl build(User user) {
		
		List<GrantedAuthority> authorities = user.getRoles()
				.stream()
				.map(role -> new SimpleGrantedAuthority(role.getName().name()))
				.collect(Collectors.toList());

		return new UserDetailsImpl(
				user.getId(), 
				user.getEmail(),
				user.getPassword(),
				user.getStatus().equals(EStatus.ACTIVE),
				authorities);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		return authorities;
	}

	@Override
	public String getPassword() {

		return password;
	}

	@Override
	public String getUsername() {

		return email;
	}

	@Override
	public boolean isAccountNonExpired() {

		return isActive;
	}

	@Override
	public boolean isAccountNonLocked() {

		return isActive;
	}

	@Override
	public boolean isCredentialsNonExpired() {

		return isActive;
	}

	@Override
	public boolean isEnabled() {

		return isActive;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserDetailsImpl user = (UserDetailsImpl) o;
		return Objects.equals(id, user.id);
	}

}
