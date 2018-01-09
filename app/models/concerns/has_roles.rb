module HasRoles
  extend ActiveSupport::Concern

  def roles
    Role.roles_from_field(roles_field)
  end

  def program_roles
    Role.program_roles(roles)
  end

  def roles_text
    Role.roles_text roles_field
  end

  def has_role?(role)
    roles.include? role.to_sym
  end

  def has_role_among?(roles)
    Role.roles_overlap?(self.roles, roles)
  end

  def add_role(new_role)
    update roles_field: Role.roles_field_with(roles_field, new_role)
  end

  def remove_role(role)
    update roles_field: Role.roles_field_without(roles_field, role)
  end

  class_methods do
    def where_has_role(role)
      where('roles_field LIKE ?', "%|#{role}|%")
    end

    def where_has_role_among(roles)
      return [] if roles.empty?
      search = roles.collect{ |r| 'roles_field LIKE ?'}.join(' OR ')
      roles = roles.collect{ |r| "%|#{r}|%"}
      where(search, *roles)
    end
  end

  # def has_program_role?
  #   Role.has_a_program_role? self
  # end
end