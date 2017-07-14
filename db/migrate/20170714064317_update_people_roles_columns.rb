class UpdatePeopleRolesColumns < ActiveRecord::Migration[5.0]
  def up
    Person.all.each do |person|
      case person.role
        when 1
          person.update(role_user: true)
        when 2
          person.update(role_program_responsable: true)
        when 3
          person.update(role_program_supervisor: true)
        when 4
          person.update(role_site_admin: true)
      end
    end
  end
end
