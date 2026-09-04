if defined?(CypressOnRails)
  CypressOnRails.configure do |c|
    # `install_folder`, not the pre-1.17 `cypress_folder`, which still works but
    # warns. The legacy layout is kept deliberately: app_commands and the helper
    # live under spec/cypress, and the gem's CommandExecutor still supports that
    # (with a deprecation). Restructuring to spec/e2e belongs with the Cypress
    # 10+ integration -> e2e move, not here.
    c.install_folder = File.expand_path("#{__dir__}/../../spec/cypress")

    # WARNING: CypressOnRails can execute arbitrary Ruby sent to
    # /__cypress__/command. The gem's own template suggests
    # `!Rails.env.production?`; test-only is deliberately stricter, so a
    # development server never exposes it.
    c.use_middleware = Rails.env.test?
    c.logger = Rails.logger
  end
end
