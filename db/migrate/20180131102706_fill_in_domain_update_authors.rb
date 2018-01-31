class FillInDomainUpdateAuthors < ActiveRecord::Migration[5.0]
  def up
    DomainUpdate.where('author_id IS NULL').each do |domain_update|
      audit = Audited::Audit.find_by(auditable_type: 'DomainUpdate', auditable_id: domain_update.id, action: 'create')
      if audit
        domain_update.update(author_id: audit.user_id)
      end
    end
  end
end
